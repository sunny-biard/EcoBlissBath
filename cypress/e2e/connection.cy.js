describe('Connection', () => {
  
    beforeEach(() => {
  
      cy.visit('http://localhost:8080/');
  
    })
  
    it('Should connect a known user', () => {
  
      cy.login("test2@test.fr", "testtest");
  
      cy.get('[data-cy="nav-link-cart"]').should('exist');
      cy.get('[data-cy="nav-link-logout"]').should('exist');
  
      cy.get('[data-cy="nav-link-logout"]').click();
  
      cy.get('[data-cy="nav-link-login"]').should('exist');
      cy.get('[data-cy="nav-link-register"]').should('exist');
      cy.get('[data-cy="nav-link-cart"]').should('not.exist');
  
    })
  
    it('Should not connect an unknown user', () => {
  
      cy.get('[data-cy="nav-link-login"]').click();
  
      cy.login("test@test.fr", "test");
  
      cy.get('[data-cy="nav-link-cart"]').should('not.exist');
      cy.get('[data-cy="nav-link-logout"]').should('not.exist');
      cy.get('[data-cy="login-errors"]').contains('Identifiants incorrects').should('exist');
  
      cy.login("testtestfr", "test");
  
      cy.get('[data-cy="nav-link-cart"]').should('not.exist');
      cy.get('[data-cy="nav-link-logout"]').should('not.exist');
      cy.get('[data-cy="login-errors"]').contains('Merci de remplir correctement tous les champs').should('exist');
  
    })
  
  })