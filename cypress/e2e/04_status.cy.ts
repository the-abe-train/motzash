import testUsers from "../fixtures/test_users.json";

describe("Testing the statuses", () => {
  it("friend1 creates a status", () => {
    // Sign in friend
    cy.visit("/signInWithPassword");
    cy.get('[data-cy="email-input"]')
      .clear()
      .type(testUsers["friend1"]["email"]);
    cy.get('[data-cy="password-input"]')
      .clear()
      .type(testUsers["friend1"]["password"]);
    cy.get('[data-cy="sign-in-btn"]').click();
    cy.contains("User is currently signed-in").should("exist");

    // Go to Friends page
    cy.visit("/friends");
    cy.contains("Your Status").should("exist");

    // Open "Update Status" form
    cy.get('[data-cy="add-status-button"]').click();
    cy.contains("What are you up to").should("exist");

    // Update status
    cy.get('[name="text"]').clear().type(testUsers["friend1"]["status"]);
    cy.get('[name="city"]').clear().type("Narnia");
    cy.mockGeolocation(43.67, -79.41);
    cy.get('[data-cy="gps-button"]').click();
    cy.get('[name="city"]').should("not.have.value", "Narnia");
    // Dragging pin on map, too hard to test with cypress
    cy.get('[data-cy="update-status-button"]').click();
    cy.contains(testUsers["friend1"]["status"]).should("exist");
  });

  it("friend2 creates a status", () => {
    // Sign in friend
    cy.visit("/signInWithPassword");
    cy.get('[data-cy="email-input"]')
      .clear()
      .type(testUsers["friend2"]["email"]);
    cy.get('[data-cy="password-input"]')
      .clear()
      .type(testUsers["friend2"]["password"]);
    cy.get('[data-cy="sign-in-btn"]').click();
    cy.contains("User is currently signed-in").should("exist");

    // Go to Friends page
    cy.visit("/friends");
    cy.contains("Your Status").should("exist");

    // Open "Update Status" form
    cy.get('[data-cy="add-status-button"]').click();
    cy.contains("What are you up to").should("exist");

    // Update status
    cy.get('[name="text"]').clear().type(testUsers["friend2"]["status"]);
    cy.get('[name="city"]').clear().type("Xanadu");
    cy.mockGeolocation(43.675, -79.415);
    cy.get('[data-cy="gps-button"]').click();
    cy.get('[name="city"]').should("not.have.value", "Xanadu");
    cy.get('[data-cy="update-status-button"]').click();
    cy.contains(testUsers["friend2"]["status"]).should("exist");
  });

  it("main looks at friends' statuses", () => {
    // Sign in friend
    cy.visit("/signInWithPassword");
    cy.get('[data-cy="email-input"]').clear().type(testUsers["main"]["email"]);
    cy.get('[data-cy="password-input"]')
      .clear()
      .type(testUsers["main"]["password"]);
    cy.get('[data-cy="sign-in-btn"]').click();
    cy.contains("User is currently signed-in").should("exist");

    // Go to Friends page
    cy.visit("/friends");
    cy.contains("Your Status").should("exist");

    // Check that friend statuses exist
    cy.contains(testUsers["friend1"]["username"]).should("exist");
    cy.contains(testUsers["friend1"]["status"]).should("exist");
    cy.contains(testUsers["friend2"]["username"]).should("exist");
    cy.contains(testUsers["friend2"]["status"]).should("exist");

    // Check that you can activate statuses
    cy.get('[data-cy="status"]').first().click();
    cy.get('[data-cy="status"]')
      .first()
      .should("have.css", "background-color", "rgb(255, 188, 66)");

    // Filter friends
    cy.get('[name="filter"]').type(
      testUsers["friend1"]["username"] + "{enter}"
    );
    cy.contains(testUsers["friend2"]["username"]).should("not.exist");
    cy.get('[type="reset"]').click();
    cy.contains(testUsers["friend2"]["username"]).should("exist");

    // Update status
    cy.mockGeolocation(43.6775, -79.4175);
    cy.get('[data-cy="add-status-button"]').click();
    cy.get('[name="text"]').clear().type(testUsers["main"]["status"]);
    cy.get('[name="city"]').clear().type("Xanadu");
    cy.get('[data-cy="update-status-button"]').click();
    cy.contains(testUsers["main"]["status"]).should("exist");

    // Delete status
    cy.wait(2000);
    cy.get('[data-cy="add-status-button"]').click();
    cy.get('[data-cy="delete-status-button"]').click();
    cy.contains(testUsers["main"]["status"]).should("not.exist");
  });
});

export default {};
