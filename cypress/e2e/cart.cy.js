describe('Cart', () => {

    beforeEach(() => {

      cy.intercept({url:'/products/\[0-9]'}).as('requeteProduit');
      cy.intercept({url:'/orders/add'}).as('requeteCommande')
  
      /* Effacement du panier par requête API après chaque test */
      cy.apiLogin("test2@test.fr", "testtest").then(response => {
        expect(response.status).to.eq(200);
  
        const token = response.body.token;
  
        cy.request({
          method: "GET",
          url: `localhost:8081/orders`,
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
  
          const numberOfProducts = response.body.orderLines.length;
  
          for(let i = 0; i < numberOfProducts; i++){
            const productLine = response.body.orderLines[i].id;
                    
            cy.request({
              method: "DELETE",
              url: `localhost:8081/orders/${productLine}/delete`,
              headers: {
                Authorization: `Bearer ${token}`, 
              },
            }).then((response) => {
              expect(response.status).to.eq(200);
            });
          }
        });
      });
      
      /* Accès au site */
      cy.visit('http://localhost:8080/');
  
      /* Connexion */
      cy.login("test2@test.fr", "testtest");
  
      /* Accès à la liste des produits */
      cy.get('[data-cy="nav-link-products"]').click();
    })
  
    afterEach(() => {
      /* Effacement du panier par requête API après chaque test */
      cy.apiLogin("test2@test.fr", "testtest").then(response => {
        expect(response.status).to.eq(200);
  
        const token = response.body.token;
  
        cy.request({
          method: "GET",
          url: `localhost:8081/orders`,
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
  
          const numberOfProducts = response.body.orderLines.length;
  
          for(let i = 0; i < numberOfProducts; i++){
            const productLine = response.body.orderLines[i].id;
                    
            cy.request({
              method: "DELETE",
              url: `localhost:8081/orders/${productLine}/delete`,
              headers: {
                Authorization: `Bearer ${token}`, 
              },
            }).then((response) => {
              expect(response.status).to.eq(200);
            });
          }
        });
      });
  
    })
  
    it('Should successfully add an available product to the cart', () => {

      /* Accès à la page du produit */
      cy.get('[data-cy="product"]').contains('Dans la forêt').siblings('[class="add-to-cart"]').find('[data-cy="product-link"]').click();
  
      cy.wait('@requeteProduit');
  
      /* Sauvegarde du stock initial */
      let prevStock;
      cy.get('[data-cy="detail-product-stock"]').invoke("text").then(text => {
        prevStock = parseInt(text.match(/\d+/));
      })

      cy.log(prevStock);
  
      /* Sauvegarde du prix du produit */
      let price;
      cy.get('[data-cy="detail-product-price"]').invoke("text").then(text => {
        price = parseInt(text.match(/\d+/));
      })

      cy.log(price);
  
      /* Sauvegarde et sélection de la quantité à ajouter au panier */
      let quantity = 3;
      cy.get('[data-cy="detail-product-quantity"]').clear();
      cy.get('[data-cy="detail-product-quantity"]').type(quantity.toString());
  
      /* Ajout du produit au panier */
      cy.get('[data-cy="detail-product-add"]').click();
  
      cy.wait('@requeteCommande');
  
      /* Vérification du panier (produit, prix par produit, prix total) */
      let cartLineTotal;
      let cartTotal;
      cy.get('h1').contains('Commande').should('exist');
      cy.get('[data-cy="cart-line"]').contains('Dans la forêt').should('exist');
      cy.get('[data-cy="cart-line"]').find('[data-cy="cart-line-total"]').invoke("text").then(text => {
        cartLineTotal = parseInt(text.match(/\d+/));
        expect(cartLineTotal).to.eq(price*quantity);
  
      })
      cy.get('[data-cy="cart-total"]').invoke("text").then(text => {
        cartTotal = parseInt(text.match(/\d+/));
        expect(cartTotal).to.eq(cartLineTotal);
  
      })
  
      cy.get('[data-cy="nav-link-products"]').click();
  
      /* Accès à la page du produit */
      cy.get('[data-cy="product"]').contains('Dans la forêt').siblings('[class="add-to-cart"]').find('[data-cy="product-link"]').click();
  
      cy.wait('@requeteProduit');

      /* Vérification du stock restant */
      cy.get('[data-cy="detail-product-stock"]').invoke("text").then(text => {
        expect(parseInt(text.match(/\d+/))).to.eq(prevStock-quantity);
      })
  
      /* Vérification du panier en cours par requête API */
      cy.apiLogin("test2@test.fr", "testtest").then(response => {
        expect(response.status).to.eq(200);
  
        const token = response.body.token;
  
        cy.request({
          method: "GET",
          url: `localhost:8081/orders`,
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
  
          const order = {
            "id": 6,
            "name": "Dans la forêt",
            "description": "La mousse riche et onctueuse nettoie en profondeur en laissant votre peau douce et hydratée.",
            "price": 24,
            "picture": "https://cdn.pixabay.com/photo/2015/01/06/02/56/soap-589824_960_720.jpg"
          }
  
          expect(response.body.orderLines[0].product).to.include(order);
          expect(response.body.orderLines[0].quantity).to.eq(quantity);
        });
      });
  
    })

    it('Should not add a product with a negative quantity to the cart', () => {

      /* Accès à la page du produit */
      cy.get('[data-cy="product"]').contains('Milkyway').siblings('[class="add-to-cart"]').find('[data-cy="product-link"]').click();
  
      cy.wait('@requeteProduit');
  
      /* Sauvegarde et sélection de la quantité à ajouter au panier */
      let quantity = -1;
      cy.get('[data-cy="detail-product-quantity"]').clear();
      cy.get('[data-cy="detail-product-quantity"]').type(quantity.toString());
      
      /* Ajout du produit au panier */
      cy.get('[data-cy="detail-product-add"]').click();

      /* Vérification du panier en cours par requête API */
      cy.apiLogin("test2@test.fr", "testtest").then(response => {
        expect(response.status).to.eq(200);
  
        const token = response.body.token;
  
        cy.request({
          method: "GET",
          url: `localhost:8081/orders`,
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
  
          expect(response.body.orderLines).to.be.empty;
        });
      });
  
      /* Vérification de l'échec de l'ajout au panier */
      cy.get('h1').contains('Commande').should('not.exist');
  
    })

    it('Should not add a product with a quantity > 20 to the cart', () => {

      /* Accès à la page du produit */
      cy.get('[data-cy="product"]').contains(`Chuchotements d'été`).siblings('[class="add-to-cart"]').find('[data-cy="product-link"]').click();
  
      cy.wait('@requeteProduit');
  
      /* Sauvegarde et sélection de la quantité à ajouter au panier */
      let quantity = 21;
      cy.get('[data-cy="detail-product-quantity"]').clear();
      cy.get('[data-cy="detail-product-quantity"]').type(quantity.toString());
          
      /* Ajout du produit au panier */
      cy.get('[data-cy="detail-product-add"]').click();
  
      /* Vérification du panier en cours par requête API */
      cy.apiLogin("test2@test.fr", "testtest").then(response => {
        expect(response.status).to.eq(200);
  
        const token = response.body.token;
  
        cy.request({
          method: "GET",
          url: `localhost:8081/orders`,
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
  
          expect(response.body.orderLines).to.be.empty;
        });
      });
  
      /* Vérification de l'ajout au panier */
      cy.get('h1').contains('Commande').should('not.exist');
  
    })

    it('Should not add an unavailable product to the cart', () => {

      /* Accès à la page du produit */
      cy.get('[data-cy="product"]').contains('Sentiments printaniers').siblings('[class="add-to-cart"]').find('[data-cy="product-link"]').click();
  
      cy.wait('@requeteProduit');
  
      /* Vérification du stock initial négatif */
      let stock;
      cy.get('[data-cy="detail-product-stock"]').invoke("text").then(text => {
        stock = parseInt(text.match(/^-?\d+/));
        expect(stock).to.be.lessThan(0);
      })
  
      /* Ajout du produit au panier */
      cy.get('[data-cy="detail-product-add"]').click();
  
      /* Vérification du panier en cours par requête API */
      cy.apiLogin("test2@test.fr", "testtest").then(response => {
        expect(response.status).to.eq(200);
  
        const token = response.body.token;
  
        cy.request({
          method: "GET",
          url: `localhost:8081/orders`,
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
  
          expect(response.body.orderLines).to.be.empty;
        });
      });
  
      /* Vérification de l'ajout au panier */
      cy.get('h1').contains('Commande').should('not.exist');
  
    })
  
    it('Should keep cart stored after logout', () => {
  
      /* Accès à la page du produit */
      cy.get('[data-cy="product"]').contains('Dans la forêt').siblings('[class="add-to-cart"]').find('[data-cy="product-link"]').click();
  
      cy.wait('@requeteProduit');
  
      /* Ajout du produit au panier */
      cy.get('[data-cy="detail-product-add"]').click();
  
      cy.wait('@requeteCommande');
  
      /* Vérification de l'ajout au panier */
      cy.get('h1').contains('Commande').should('exist');
      cy.get('[data-cy="cart-line"]').contains('Dans la forêt').should('exist');
  
      /* Déconnexion */
      cy.get('[data-cy="nav-link-logout"]').click();
  
      /* Reconnexion */
      cy.login("test2@test.fr", "testtest");
  
      /* Accès au panier */
      cy.get('[data-cy="nav-link-cart"]').click();
  
      /*Vérification du panier */
      cy.get('[data-cy="cart-line"]').contains('Dans la forêt').should('exist');
  
      /* Vérification du panier en cours par requête API */
      cy.apiLogin("test2@test.fr", "testtest").then(response => {
        expect(response.status).to.eq(200);
      
        const token = response.body.token;
      
        cy.request({
          method: "GET",
          url: `localhost:8081/orders`,
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
      
          const order = {
            "id": 6,
            "name": "Dans la forêt",
            "description": "La mousse riche et onctueuse nettoie en profondeur en laissant votre peau douce et hydratée.",
            "price": 24,
            "picture": "https://cdn.pixabay.com/photo/2015/01/06/02/56/soap-589824_960_720.jpg"
          }
      
          expect(response.body.orderLines[0].product).to.include(order);
        });
      });
      
    })
})