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

describe('Learning e2e test', () => {
  const learningPageUrl = '/learning';
  const learningPageUrlPattern = new RegExp('/learning(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const learningSample = { startDate: '2023-09-23T07:15:01.806Z', language: 'SWAHILI' };

  let learning;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/learnings+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/learnings').as('postEntityRequest');
    cy.intercept('DELETE', '/api/learnings/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (learning) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/learnings/${learning.id}`,
      }).then(() => {
        learning = undefined;
      });
    }
  });

  it('Learnings menu should load Learnings page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('learning');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Learning').should('exist');
    cy.url().should('match', learningPageUrlPattern);
  });

  describe('Learning page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(learningPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Learning page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/learning/new$'));
        cy.getEntityCreateUpdateHeading('Learning');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', learningPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/learnings',
          body: learningSample,
        }).then(({ body }) => {
          learning = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/learnings+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [learning],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(learningPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Learning page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('learning');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', learningPageUrlPattern);
      });

      it('edit button click should load edit Learning page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Learning');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', learningPageUrlPattern);
      });

      it('edit button click should load edit Learning page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Learning');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', learningPageUrlPattern);
      });

      it('last delete button click should delete instance of Learning', () => {
        cy.intercept('GET', '/api/learnings/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('learning').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', learningPageUrlPattern);

        learning = undefined;
      });
    });
  });

  describe('new Learning page', () => {
    beforeEach(() => {
      cy.visit(`${learningPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Learning');
    });

    it('should create an instance of Learning', () => {
      cy.get(`[data-cy="startDate"]`).type('2023-09-22T20:09').blur().should('have.value', '2023-09-22T20:09');

      cy.get(`[data-cy="endDate"]`).type('2023-09-23T13:29').blur().should('have.value', '2023-09-23T13:29');

      cy.get(`[data-cy="language"]`).select('SWAHILI');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        learning = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', learningPageUrlPattern);
    });
  });
});
