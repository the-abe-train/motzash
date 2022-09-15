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
});

export default {};
