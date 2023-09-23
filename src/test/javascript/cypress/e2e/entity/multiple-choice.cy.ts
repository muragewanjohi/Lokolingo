import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('MultipleChoice e2e test', () => {
  const multipleChoicePageUrl = '/multiple-choice';
  const multipleChoicePageUrlPattern = new RegExp('/multiple-choice(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const multipleChoiceSample = { status: 'CORRECT', image: 'Li4vZmFrZS1kYXRhL2Jsb2IvaGlwc3Rlci5wbmc=', imageContentType: 'unknown' };

  let multipleChoice;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/multiple-choices+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/multiple-choices').as('postEntityRequest');
    cy.intercept('DELETE', '/api/multiple-choices/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (multipleChoice) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/multiple-choices/${multipleChoice.id}`,
      }).then(() => {
        multipleChoice = undefined;
      });
    }
  });

  it('MultipleChoices menu should load MultipleChoices page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('multiple-choice');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('MultipleChoice').should('exist');
    cy.url().should('match', multipleChoicePageUrlPattern);
  });

  describe('MultipleChoice page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(multipleChoicePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create MultipleChoice page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/multiple-choice/new$'));
        cy.getEntityCreateUpdateHeading('MultipleChoice');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', multipleChoicePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/multiple-choices',
          body: multipleChoiceSample,
        }).then(({ body }) => {
          multipleChoice = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/multiple-choices+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [multipleChoice],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(multipleChoicePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details MultipleChoice page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('multipleChoice');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', multipleChoicePageUrlPattern);
      });

      it('edit button click should load edit MultipleChoice page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('MultipleChoice');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', multipleChoicePageUrlPattern);
      });

      it('edit button click should load edit MultipleChoice page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('MultipleChoice');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', multipleChoicePageUrlPattern);
      });

      it('last delete button click should delete instance of MultipleChoice', () => {
        cy.intercept('GET', '/api/multiple-choices/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('multipleChoice').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', multipleChoicePageUrlPattern);

        multipleChoice = undefined;
      });
    });
  });

  describe('new MultipleChoice page', () => {
    beforeEach(() => {
      cy.visit(`${multipleChoicePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('MultipleChoice');
    });

    it('should create an instance of MultipleChoice', () => {
      cy.get(`[data-cy="status"]`).select('CORRECT');

      cy.setFieldImageAsBytesOfEntity('image', 'integration-test.png', 'image/png');

      // since cypress clicks submit too fast before the blob fields are validated
      cy.wait(200); // eslint-disable-line cypress/no-unnecessary-waiting
      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        multipleChoice = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', multipleChoicePageUrlPattern);
    });
  });
});
