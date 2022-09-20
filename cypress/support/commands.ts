/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
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
//
declare global {
  namespace Cypress {
    interface Chainable {
      login(user: string): Chainable<void>;
      mockGeolocation(): Chainable<void>;
      drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>;
      dismiss(
        subject: string,
        options?: Partial<TypeOptions>
      ): Chainable<Element>;
      // visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
    }
  }
}

Cypress.Commands.add("login", (user) => {
  cy.task("getUserSession", {
    user,
    url: Cypress.env("SUPABASE_URL"),
    key: Cypress.env("SUPABASE_ANON_KEY"),
  }).then((sessionData) => {
    localStorage.setItem(
      "sb-localhost-auth-token",
      JSON.stringify(sessionData)
    );
  });
});

Cypress.Commands.add("mockGeolocation", (latitude = 42, longitude = -79) => {
  cy.window().then(($window) => {
    cy.stub($window.navigator.geolocation, "getCurrentPosition", (callback) => {
      return callback({ coords: { latitude, longitude } });
    });
  });
});

export default {};
