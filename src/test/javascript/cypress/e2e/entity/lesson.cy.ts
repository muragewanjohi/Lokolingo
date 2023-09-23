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

describe('Lesson e2e test', () => {
  const lessonPageUrl = '/lesson';
  const lessonPageUrlPattern = new RegExp('/lesson(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const lessonSample = { title: 'SSL sensor', language: 'KIKUYU', level: 'JUNIOR' };

  let lesson;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/lessons+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/lessons').as('postEntityRequest');
    cy.intercept('DELETE', '/api/lessons/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (lesson) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/lessons/${lesson.id}`,
      }).then(() => {
        lesson = undefined;
      });
    }
  });

  it('Lessons menu should load Lessons page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('lesson');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Lesson').should('exist');
    cy.url().should('match', lessonPageUrlPattern);
  });

  describe('Lesson page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(lessonPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Lesson page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/lesson/new$'));
        cy.getEntityCreateUpdateHeading('Lesson');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', lessonPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/lessons',
          body: lessonSample,
        }).then(({ body }) => {
          lesson = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/lessons+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [lesson],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(lessonPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Lesson page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('lesson');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', lessonPageUrlPattern);
      });

      it('edit button click should load edit Lesson page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Lesson');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', lessonPageUrlPattern);
      });

      it('edit button click should load edit Lesson page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Lesson');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', lessonPageUrlPattern);
      });

      it('last delete button click should delete instance of Lesson', () => {
        cy.intercept('GET', '/api/lessons/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('lesson').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', lessonPageUrlPattern);

        lesson = undefined;
      });
    });
  });

  describe('new Lesson page', () => {
    beforeEach(() => {
      cy.visit(`${lessonPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Lesson');
    });

    it('should create an instance of Lesson', () => {
      cy.get(`[data-cy="title"]`).type('Designer').should('have.value', 'Designer');

      cy.get(`[data-cy="language"]`).select('ENGLISH');

      cy.get(`[data-cy="level"]`).select('ADVANCED');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        lesson = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', lessonPageUrlPattern);
    });
  });
});
