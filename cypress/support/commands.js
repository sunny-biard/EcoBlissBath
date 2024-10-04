Cypress.Commands.add("apiLogin", (email, pwd) => {
 
    cy.request({
        method: "POST",
        url: `localhost:8081/login`,
        body: {
          username: email,
          password: pwd,
        },
        failOnStatusCode: false,
    }).then((response) => {
        return response;
    });
 
})

Cypress.Commands.add("login", (email, pwd) => {

    cy.get('[data-cy="nav-link-login"]').click();

    cy.get('[data-cy="login-input-username"]').clear();
    cy.get('[data-cy="login-input-password"]').clear();

    cy.get('[data-cy="login-input-username"]').type(email);
    cy.get('[data-cy="login-input-password"]').type(pwd);

    cy.get('[data-cy="login-submit"]').click();

    cy.wait(1000);
})