// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add("apiLogin", (email, pwd) => {

    cy.request({
        method: "POST",
        url: `localhost:8081/login`,
        body: {
          username: `${email}`,
          password: `${pwd}`,
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

    cy.get('[data-cy="login-input-username"]').type(`${email}`);
    cy.get('[data-cy="login-input-password"]').type(`${pwd}`);

    cy.get('[data-cy="login-submit"]').click();

    cy.wait(1000);
})