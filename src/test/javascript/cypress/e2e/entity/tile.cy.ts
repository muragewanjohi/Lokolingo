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

describe('Tile e2e test', () => {
  const tilePageUrl = '/tile';
  const tilePageUrlPattern = new RegExp('/tile(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const tileSample = {
    status: 'UNLOCKED',
    image: 'Li4vZmFrZS1kYXRhL2Jsb2IvaGlwc3Rlci5wbmc=',
    imageContentType: 'unknown',
    audio: 'Li4vZmFrZS1kYXRhL2Jsb2IvaGlwc3Rlci5wbmc=',
    audioContentType: 'unknown',
    languageTitle: 'deposit',
    englishTitle: 'application array Union',
  };

  let tile;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/tiles+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/tiles').as('postEntityRequest');
    cy.intercept('DELETE', '/api/tiles/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (tile) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/tiles/${tile.id}`,
      }).then(() => {
        tile = undefined;
      });
    }
  });

  it('Tiles menu should load Tiles page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('tile');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Tile').should('exist');
    cy.url().should('match', tilePageUrlPattern);
  });

  describe('Tile page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(tilePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Tile page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/tile/new$'));
        cy.getEntityCreateUpdateHeading('Tile');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', tilePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/tiles',
          body: tileSample,
        }).then(({ body }) => {
          tile = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/tiles+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [tile],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(tilePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Tile page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('tile');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', tilePageUrlPattern);
      });

      it('edit button click should load edit Tile page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Tile');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', tilePageUrlPattern);
      });

      it('edit button click should load edit Tile page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Tile');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', tilePageUrlPattern);
      });

      it('last delete button click should delete instance of Tile', () => {
        cy.intercept('GET', '/api/tiles/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('tile').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', tilePageUrlPattern);

        tile = undefined;
      });
    });
  });

  describe('new Tile page', () => {
    beforeEach(() => {
      cy.visit(`${tilePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Tile');
    });

    it('should create an instance of Tile', () => {
      cy.get(`[data-cy="status"]`).select('LOCKED');

      cy.setFieldImageAsBytesOfEntity('image', 'integration-test.png', 'image/png');

      cy.setFieldImageAsBytesOfEntity('audio', 'integration-test.png', 'image/png');

      cy.get(`[data-cy="languageTitle"]`).type('composite Borders connecting').should('have.value', 'composite Borders connecting');

      cy.get(`[data-cy="englishTitle"]`).type('infrastructures parsing').should('have.value', 'infrastructures parsing');

      // since cypress clicks submit too fast before the blob fields are validated
      cy.wait(200); // eslint-disable-line cypress/no-unnecessary-waiting
      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        tile = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', tilePageUrlPattern);
    });
  });
});
