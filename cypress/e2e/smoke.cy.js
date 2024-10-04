describe('Smoke Tests', () => {

    beforeEach(() => {

        cy.intercept({url:'/products/\[0-9]'}).as('requeteProduit');
        cy.intercept({url:'/products'}).as('requeteListeProduits');
  
        cy.visit('http://localhost:8080/');
  
    })
  
    it('Should display login fields and buttons', () => {
  
        cy.get('[data-cy="nav-link-login"]').should('be.visible');
        cy.get('[data-cy="nav-link-register"]').should('be.visible');
    
        cy.get('[data-cy="nav-link-login"]').click();
    
        cy.get('[data-cy="login-input-username"]').should('be.visible');
        cy.get('[data-cy="login-input-password"]').should('be.visible');
        cy.get('[data-cy="login-submit"]').should('be.visible');
        cy.get('a').contains(`S'inscrire`).should('be.visible');
    
        cy.get('a').contains(`S'inscrire`).click();
    
        cy.get('[data-cy="register-input-lastname"]').should('be.visible');
        cy.get('[data-cy="register-input-firstname"]').should('be.visible');
        cy.get('[data-cy="register-input-email"]').should('be.visible');
        cy.get('[data-cy="register-input-password"]').should('be.visible');
        cy.get('[data-cy="register-input-password-confirm"]').should('be.visible');
        cy.get('[data-cy="register-submit"]').should('be.visible');
        cy.get('a').contains(`Se connecter`).should('be.visible');
    
    })
  
    it('Should display "Add to cart" button when user is connected', () => {
  
        cy.login("test2@test.fr", "testtest");
    
        cy.get('[data-cy="nav-link-products"]').click();
    
        cy.wait('@requeteListeProduits');
    
        cy.get('[data-cy="product-link"]').should('be.visible');
    
        cy.get('[data-cy="product"]').contains('Sentiments printaniers').siblings('[class="add-to-cart"]').find('[data-cy="product-link"]').click();
    
        cy.wait('@requeteProduit');
    
        cy.get('[data-cy="detail-product-add"]').should('be.visible');
      
    })
  
    it('Should display product availability field', () => {
  
        cy.login("test2@test.fr", "testtest");
    
        cy.get('[data-cy="nav-link-products"]').click();
    
        cy.wait('@requeteListeProduits');
    
        cy.get('[data-cy="product"]').contains('Sentiments printaniers').siblings('[class="add-to-cart"]').find('[data-cy="product-link"]').click();
    
        cy.wait('@requeteProduit');
    
        cy.get('[data-cy="detail-product-stock"]').should('be.visible');
      
    })
  
    it('Should display all navigation buttons', () => {
  
        cy.get('[data-cy="nav-link-home"]').should('be.visible');
        cy.get('[data-cy="nav-link-products"]').should('be.visible');
        cy.get('[data-cy="nav-link-reviews"]').should('be.visible');
        cy.get('[data-cy="nav-link-login"]').should('be.visible');
        cy.get('[data-cy="nav-link-register"]').should('be.visible');
        cy.get('button').contains('Voir les produits').should('be.visible');
        cy.get('[data-cy="product-home-link"]').should('be.visible');
    
        cy.get('[data-cy="nav-link-products"]').click();
    
        cy.get('[data-cy="nav-link-home"]').should('be.visible');
        cy.get('[data-cy="nav-link-products"]').should('be.visible');
        cy.get('[data-cy="nav-link-reviews"]').should('be.visible');
        cy.get('[data-cy="nav-link-login"]').should('be.visible');
        cy.get('[data-cy="nav-link-register"]').should('be.visible');
    
        cy.get('[data-cy="nav-link-reviews"]').click();
    
        cy.get('[data-cy="nav-link-home"]').should('be.visible');
        cy.get('[data-cy="nav-link-products"]').should('be.visible');
        cy.get('[data-cy="nav-link-reviews"]').should('be.visible');
        cy.get('[data-cy="nav-link-login"]').should('be.visible');
        cy.get('[data-cy="nav-link-register"]').should('be.visible');
    
        cy.get('[data-cy="nav-link-login"]').click();
    
        cy.get('[data-cy="nav-link-home"]').should('be.visible');
        cy.get('[data-cy="nav-link-products"]').should('be.visible');
        cy.get('[data-cy="nav-link-reviews"]').should('be.visible');
        cy.get('[data-cy="nav-link-login"]').should('be.visible');
        cy.get('[data-cy="nav-link-register"]').should('be.visible');
    
        cy.get('[data-cy="nav-link-register"]').click();
    
        cy.get('[data-cy="nav-link-home"]').should('be.visible');
        cy.get('[data-cy="nav-link-products"]').should('be.visible');
        cy.get('[data-cy="nav-link-reviews"]').should('be.visible');
        cy.get('[data-cy="nav-link-login"]').should('be.visible');
        cy.get('[data-cy="nav-link-register"]').should('be.visible');
    
        cy.login("test2@test.fr", "testtest");
    
        cy.get('[data-cy="nav-link-cart"]').should('be.visible');
    
        cy.get('[data-cy="nav-link-cart"]').click();
    
        cy.get('[data-cy="nav-link-home"]').should('be.visible');
        cy.get('[data-cy="nav-link-products"]').should('be.visible');
        cy.get('[data-cy="nav-link-reviews"]').should('be.visible');
        cy.get('[data-cy="nav-link-cart"]').should('be.visible');
        cy.get('[data-cy="nav-link-logout"]').should('be.visible');
  
    })
  })