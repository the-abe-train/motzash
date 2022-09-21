import testUsers from "../fixtures/test_users.json";

describe("Explore all navigation links", () => {
  it("Visits every nav link while not authenticated", () => {
    cy.visit("/");
    cy.contains("Candle Lighting").should("exist");

    cy.get('[data-cy="header-friends"]').click();
    cy.url().should("contain", "/friends");

    cy.get('[data-cy="header-logo"]').click();
    cy.url().should("contain", "/");

    cy.get('[data-cy="header-about"]').click();
    cy.url().should("contain", "/about");

    cy.get('[data-cy="header-dashboard"]').click();
    cy.url().should("contain", "/");

    cy.get('[data-cy="header-profile"]').click();
    cy.url().should("contain", "/profile");

    cy.get('[data-cy="footer-friends"]').click();
    cy.url().should("contain", "/friends");

    cy.get('[data-cy="footer-about"]').click();
    cy.url().should("contain", "/about");

    cy.get('[data-cy="footer-dashboard"]').click();
    cy.url().should("contain", "/");

    cy.get('[data-cy="footer-profile"]').click();
    cy.url().should("contain", "/profile");
  });

  it("Visits links while authenticated", () => {
    cy.visit("/signInWithPassword");
    cy.get('[data-cy="email-input"]').clear().type(testUsers["main"]["email"]);
    cy.get('[data-cy="password-input"]')
      .clear()
      .type(testUsers["main"]["password"]);
    cy.get('[data-cy="sign-in-btn"]').click();
    cy.contains("User is currently signed-in").should("exist");

    cy.get('[data-cy="header-friends"]').click();
    cy.contains("Your Status").should("exist");

    cy.get('[data-cy="header-profile"]').click();
    cy.contains("Update profile").should("exist");
    cy.url().should("contain", "/");
  });
});

export default {};
