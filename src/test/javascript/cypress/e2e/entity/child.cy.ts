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

describe('Child e2e test', () => {
  const childPageUrl = '/child';
  const childPageUrlPattern = new RegExp('/child(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const childSample = { firstName: 'Javier', lastName: 'Murazik', gender: 'FEMALE' };

  let child;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/children+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/children').as('postEntityRequest');
    cy.intercept('DELETE', '/api/children/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (child) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/children/${child.id}`,
      }).then(() => {
        child = undefined;
      });
    }
  });

  it('Children menu should load Children page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('child');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Child').should('exist');
    cy.url().should('match', childPageUrlPattern);
  });

  describe('Child page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(childPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Child page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/child/new$'));
        cy.getEntityCreateUpdateHeading('Child');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', childPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/children',
          body: childSample,
        }).then(({ body }) => {
          child = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/children+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [child],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(childPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Child page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('child');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', childPageUrlPattern);
      });

      it('edit button click should load edit Child page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Child');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', childPageUrlPattern);
      });

      it('edit button click should load edit Child page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Child');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', childPageUrlPattern);
      });

      it('last delete button click should delete instance of Child', () => {
        cy.intercept('GET', '/api/children/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('child').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', childPageUrlPattern);

        child = undefined;
      });
    });
  });

  describe('new Child page', () => {
    beforeEach(() => {
      cy.visit(`${childPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Child');
    });

    it('should create an instance of Child', () => {
      cy.get(`[data-cy="firstName"]`).type('Hester').should('have.value', 'Hester');

      cy.get(`[data-cy="lastName"]`).type('Hagenes').should('have.value', 'Hagenes');

      cy.get(`[data-cy="gender"]`).select('MALE');

      cy.get(`[data-cy="age"]`).type('87958').should('have.value', '87958');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        child = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', childPageUrlPattern);
    });
  });
});
