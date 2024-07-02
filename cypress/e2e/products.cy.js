describe('Products', () => {

  beforeEach(() => {

    /* Accès au site */
    cy.visit('http://localhost:8080/');

    /* Connexion */
    cy.login("test2@test.fr", "testtest");

    /* Accès à la liste des produits */
    cy.get('[data-cy="nav-link-products"]').click();

    cy.wait(1000);
    
  })

  it('Should display all products', () => {

    cy.request({
      method: "GET",
      url: `localhost:8081/products`,
    }).then((response) => {
      expect(response.status).to.eq(200);

      const numberOfProducts = response.body.length;

      for(let i = 0; i < numberOfProducts; i++){
        
        cy.get('[data-cy="product"]').contains(response.body[i].name).should('be.visible');
        cy.get('[data-cy="product-ingredients"]').contains(response.body[i].ingredients).should('be.visible');
        cy.get('[data-cy="product"]').contains(response.body[i].name).siblings('[data-cy="product-picture"]').should('have.attr', 'src', response.body[i].picture)
        cy.get('[data-cy="product"]').contains(response.body[i].name).siblings('[class="add-to-cart"]').find('[data-cy="product-link"]').should('be.visible');
        
      }
    });

  })

  it('Should display every product page', () => {

    cy.request({
      method: "GET",
      url: `localhost:8081/products`,
    }).then((response) => {
      expect(response.status).to.eq(200);

      const numberOfProducts = response.body.length;

      for(let i = 0; i < numberOfProducts; i++){

        cy.get('[data-cy="product"]').contains(response.body[i].name).siblings('[class="add-to-cart"]').find('[data-cy="product-link"]').click();

        cy.wait(1000);

        cy.get('[data-cy="detail-product-name"]').contains(response.body[i].name).should('be.visible');
        cy.get('[data-cy="detail-product-description"]').contains(response.body[i].description).should('be.visible');

        cy.get('[data-cy="detail-product-skin"]').contains(response.body[i].skin).should('be.visible');
        cy.get('[data-cy="detail-product-aromas"]').contains(response.body[i].aromas).should('be.visible');
        cy.get('[data-cy="detail-product-ingredients"]').contains(response.body[i].ingredients).should('be.visible');

        let price = '' + response.body[i].price.toFixed(2).replace(".", ",") + ' €';
        let availableStock = '' + response.body[i].availableStock + ' en stock';
        cy.get('[data-cy="detail-product-price"]').contains(price).should('be.visible');
        cy.get('[data-cy="detail-product-stock"]').contains(availableStock).should('be.visible');

        cy.get('[data-cy="detail-product-img"]').should('have.attr', 'src', response.body[i].picture);

        cy.get('[data-cy="detail-product-add"]').should('be.visible');

        cy.get('[data-cy="nav-link-products"]').click();

      }
    });

  })

})