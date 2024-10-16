describe('Login', () => {
 
  it('Should return a status code 200 for a known user', () => {
   
    cy.apiLogin("test2@test.fr", "testtest").then(response => {
      expect(response.status).to.eq(200);
    });
 
  })
 
  it('Should return a status code 401 for an unknown user', () => {
   
    cy.apiLogin("test@test.fr", "test").then(response => {
      expect(response.status).to.eq(401);
    });
 
  })
 
})

describe('Orders', () => {

  it('Should return a status code 200 for viewing the order when authorized', () => {
    
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
      });
    });

  })

  it('Should return a status code 403 for viewing the order when not authorized', () => {
    
    cy.request({
      method: "GET",
      url: `localhost:8081/orders`,
      headers: {
        Authorization: "", 
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(403);
    });

  })

  it('Should return a status code 200 for adding to cart an available product', () => {
    
    cy.apiLogin("test2@test.fr", "testtest").then(response => {
      expect(response.status).to.eq(200);

      const token = response.body.token;

      cy.request({
        method: "POST",
        url: `localhost:8081/orders/add`,
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: {
          "product": 5,
          "quantity": 1
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });

  })

  it('Should return a status code 400 for adding to cart an inexisting product', () => {
    
    cy.apiLogin("test2@test.fr", "testtest").then(response => {
      expect(response.status).to.eq(200);

      const token = response.body.token;

      cy.request({
        method: "PUT", // Ici la méthode correcte n'est pas PUT mais POST, mais il était nécessaire que cela fonctionne ici pour tester l'exécution de la commande
        url: `localhost:8081/orders/add`,
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        failOnStatusCode: false,
        body: {
          "product": 11,
          "quantity": 1
        }
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

  })

  it('Should return a status code 400 for adding to cart an unavailable product', () => {
    
    cy.apiLogin("test2@test.fr", "testtest").then(response => {
      expect(response.status).to.eq(200);

      const token = response.body.token;

      cy.request({
        method: "PUT", // Ici la méthode correcte n'est pas PUT mais POST, mais il était nécessaire que cela fonctionne ici pour tester l'exécution de la commande
        url: `localhost:8081/orders/add`,
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        failOnStatusCode: false,
        body: {
          "product": 4,
          "quantity": 1
        }
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

  })

  it('Should return a status code 200 for succesfully executing an order', () => {
      
    cy.apiLogin("test2@test.fr", "testtest").then(response => {
      expect(response.status).to.eq(200);

      const token = response.body.token;

      cy.request({
        method: "PUT", // Ici la méthode correcte n'est pas PUT mais POST, mais il était nécessaire que cela fonctionne ici pour tester l'exécution de la commande
        url: `localhost:8081/orders/add`,
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: {
          "product": 5,
          "quantity": 1
        }
      }).then((response) => {
        expect(response.status).to.eq(200);

        cy.request({
          method: "POST",
          url: `localhost:8081/orders`,
          headers: {
            Authorization: `Bearer ${token}`, 
          },
          body: {
            "firstname": "Jean",
            "lastname": "Moulin",
            "address": "2 Rue Honoré",
            "zipCode": "75000",
            "city": "Paris"
          }
        }).then((response) => {
          expect(response.status).to.eq(200);
        });
      });
    });


  })

  it('Should return a status code 200 for deleting an existing product from cart', () => {
    
    cy.apiLogin("test2@test.fr", "testtest").then(response => {
      expect(response.status).to.eq(200);

      const token = response.body.token;

      cy.request({
        method: "PUT", // Ici la méthode correcte n'est pas PUT mais POST, mais il était nécessaire que cela fonctionne ici pour tester la suppression d'un produit du panier
        url: `localhost:8081/orders/add`,
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: {
          "product": 5,
          "quantity": 1
        }
      }).then((response) => {
        expect(response.status).to.eq(200);

        const productLine = response.body.orderLines[0].id;
                
        cy.request({
          method: "DELETE",
          url: `localhost:8081/orders/${productLine}/delete`,
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
        });
      });
    });

  })

  it('Should return a status code 404 for deleting an non existing product from cart', () => {
    
    cy.apiLogin("test2@test.fr", "testtest").then(response => {
      expect(response.status).to.eq(200);

      const token = response.body.token;

      cy.request({
        method: "DELETE",
        url: `localhost:8081/orders/0/delete`,
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });

  })

  it('Should return a status code 200 for changing quantity of an existing product from cart', () => {
      
    cy.apiLogin("test2@test.fr", "testtest").then(response => {
      expect(response.status).to.eq(200);

      const token = response.body.token;

      cy.request({
        method: "PUT", // Ici la méthode correcte n'est pas PUT mais POST, mais il était nécessaire que cela fonctionne ici pour tester l'exécution de la commande
        url: `localhost:8081/orders/add`,
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: {
          "product": 5,
          "quantity": 3
        }
      }).then((response) => {
        expect(response.status).to.eq(200);

        const productLine = response.body.orderLines[0].id;
                

        cy.request({
          method: "PUT",
          url: `localhost:8081/orders/${productLine}/change-quantity`,
          headers: {
            Authorization: `Bearer ${token}`, 
          },
          body: {
            "quantity": 1
          }
        }).then((response) => {
          expect(response.status).to.eq(200);
        });
      });
    });

  })

  it('Should return a status code 404 for changing quantity of an non existing product from cart', () => {
      
    cy.apiLogin("test2@test.fr", "testtest").then(response => {
      expect(response.status).to.eq(200);

      const token = response.body.token;

      cy.request({
        method: "PUT",
        url: `localhost:8081/orders/0/change-quantity`,
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: {
          "quantity": 1
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });

  })

})

describe('Products', () => {

  it('Should return a status code 200 for an existing product', () => {
    
    cy.apiLogin("test2@test.fr", "testtest").then(response => {
      expect(response.status).to.eq(200);

      const token = response.body.token;

      cy.request({
        method: "GET",
        url: `localhost:8081/products/3`,
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });

  })

  it('Should return a status code 200 for listing all products', () => {
    
    cy.request({
      method: "GET",
      url: `localhost:8081/products`,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });

  })

  it('Should return a status code 200 for listing random products', () => {
    
    cy.request({
      method: "GET",
      url: `localhost:8081/products/random`,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });

  })

  it('Should return a status code 404 for an non existing product', () => {
    
    cy.apiLogin("test2@test.fr", "testtest").then(response => {
      expect(response.status).to.eq(200);

      const token = response.body.token;

      cy.request({
        method: "GET",
        url: `localhost:8081/products/0`,
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });

  })

})

describe('Reviews', () => {

  it('Should return a status code 200 for listing all reviews', () => {
    
    cy.request({
      method: "GET",
      url: `localhost:8081/reviews`,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });

  })

  it('Should return a status code 200 for posting a valid review', () => {
    
    cy.apiLogin("test2@test.fr", "testtest").then(response => {
      expect(response.status).to.eq(200);

      const token = response.body.token;

      cy.request({
        method: "POST",
        url: `localhost:8081/reviews`,
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: {
          "title": "avis",
          "comment": "ceci est un avis test",
          "rating": 5
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });

  })

  it('Should return a status code 400 for posting an invalid review', () => {
    
    cy.apiLogin("test2@test.fr", "testtest").then(response => {
      expect(response.status).to.eq(200);

      const token = response.body.token;

      cy.request({
        method: "POST",
        url: `localhost:8081/reviews`,
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: {
          "title": "^$ù`=:;,¨*%£+/€@≠÷…∞§øÇ¡«¶{‘“ë•",
          "comment": "ceci est un avis test",
          "rating": 5
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  
  })

  it('Should return a status code 400 for posting an invalid review', () => {
    
    cy.apiLogin("test2@test.fr", "testtest").then(response => {
      expect(response.status).to.eq(200);

      const token = response.body.token;

      cy.request({
        method: "POST",
        url: `localhost:8081/reviews`,
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: {
          "title": "avis",
          "comment": "^$ù`=:;,¨*%£+/€@≠÷…∞§øÇ¡«¶{‘“ë•",
          "rating": 5
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  
  })

  it('Should return a status code 400 for posting an invalid review', () => {
    
    cy.apiLogin("test2@test.fr", "testtest").then(response => {
      expect(response.status).to.eq(200);

      const token = response.body.token;

      cy.request({
        method: "POST",
        url: `localhost:8081/reviews`,
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: {
          "title": 1234,
          "comment": "ceci est un avis test",
          "rating": 5
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  
  })

  it('Should return a status code 400 for posting an invalid review', () => {
    
    cy.apiLogin("test2@test.fr", "testtest").then(response => {
      expect(response.status).to.eq(200);

      const token = response.body.token;

      cy.request({
        method: "POST",
        url: `localhost:8081/reviews`,
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: {
          "title": "avis",
          "comment": 1234,
          "rating": 5
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  
  })

  it('Should return a status code 400 for posting an invalid review', () => {
    
    cy.apiLogin("test2@test.fr", "testtest").then(response => {
      expect(response.status).to.eq(200);

      const token = response.body.token;

      cy.request({
        method: "POST",
        url: `localhost:8081/reviews`,
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: {
          "title": "<script>alert(123)</script>",
          "comment": "<script>alert(123)</script>",
          "rating": 5
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

  })

  it('Should return a status code 400 for posting an invalid review', () => {
    
    cy.apiLogin("test2@test.fr", "testtest").then(response => {
      expect(response.status).to.eq(200);

      const token = response.body.token;

      cy.request({
        method: "POST",
        url: `localhost:8081/reviews`,
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: {
          "title": "avis",
          "comment": "ceci est un avis test",
          "rating": "note"
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  
  })

  it('Should return a status code 400 for posting an invalid review', () => {
    
    cy.apiLogin("test2@test.fr", "testtest").then(response => {
      expect(response.status).to.eq(200);

      const token = response.body.token;

      cy.request({
        method: "POST",
        url: `localhost:8081/reviews`,
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: {
          "title": "avis",
          "comment": "ceci est un avis test",
          "rating": 6
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  
  })

  it('Should return a status code 400 for posting an invalid review', () => {
    
    cy.apiLogin("test2@test.fr", "testtest").then(response => {
      expect(response.status).to.eq(200);

      const token = response.body.token;

      cy.request({
        method: "POST",
        url: `localhost:8081/reviews`,
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: {
          "title": "avis",
          "comment": "ceci est un avis test",
          "rating": -1
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  
  })

  it('Should return a status code 400 for posting an invalid review', () => {
    
    cy.apiLogin("test2@test.fr", "testtest").then(response => {
      expect(response.status).to.eq(200);

      const token = response.body.token;

      cy.request({
        method: "POST",
        url: `localhost:8081/reviews`,
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: {
          "title": "avis",
          "comment": "ceci est un avis test",
          "rating": 0
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  
  })

})