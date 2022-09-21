import testUsers from "../fixtures/test_users.json";

describe("Testing friend requests", () => {
  it("sends a friend request", () => {
    // Sign in as new
    cy.visit("/signInWithPassword");
    cy.get('[data-cy="email-input"]').clear().type(testUsers["new"]["email"]);
    cy.get('[data-cy="password-input"]')
      .clear()
      .type(testUsers["new"]["password"]);
    cy.get('[data-cy="sign-in-btn"]').click();
    cy.contains("User is currently signed-in").should("exist");

    // Go to profile page
    cy.visit("/profile");
    cy.contains("Update profile").should("exist");

    // Update username
    cy.get("input")
      .clear()
      .type(testUsers["new"]["username"] + "{enter}");
    cy.contains("Profile updated").should("exist");

    // Go to Friends page
    cy.visit("/friends");
    cy.contains("Your Status").should("exist");

    // Open "Update Status" form
    cy.get('[data-cy="add-status-button"]').click();
    cy.contains("What are you up to").should("exist");

    // Update status
    cy.get('[name="text"]').clear().type(testUsers["new"]["status"]);
    cy.mockGeolocation(43.67 - 0.005, -79.41 - 0.005);
    cy.get('[data-cy="gps-button"]').click();
    cy.wait(2000);
    cy.get('[data-cy="update-status-button"]').click();
    cy.get('[data-cy="status"]')
      .first()
      .within(() => {
        cy.contains(testUsers["new"]["status"]).should("exist");
      });
    cy.wait(2000);

    // Send friend request
    cy.contains("Add friend").click();
    cy.get('[name="friend"]').type(testUsers["main"]["email"] + "{enter}");
    cy.wait(2000);
    cy.contains("Friend request sent!").should("exist");

    // Sign out
    cy.visit("/profile");
    cy.get('[data-cy="sign-out-button"]').click();
    cy.contains("Sign-in form").should("exist");
  });

  it("main accepts the friend request", () => {
    // Sign in main
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

    // Update status
    cy.mockGeolocation(43.6775, -79.4175);
    cy.get('[data-cy="add-status-button"]').click();
    cy.get('[name="text"]').clear().type(testUsers["main"]["status"]);
    cy.get('[name="city"]').clear().type("Xanadu");
    cy.get('[data-cy="update-status-button"]').click();
    cy.contains(testUsers["main"]["status"]).should("exist");

    // Accept friend request
    cy.contains("Add friend").click();
    cy.get(`[data-cy="${testUsers["new"]["username"]}"]`).within(() => {
      cy.get('[data-cy="accept-button"]').click();
    });
    cy.contains(testUsers["new"]["status"]).should("exist");
  });

  it("new delete's friendship with main", () => {
    // Sign in as new
    cy.visit("/signInWithPassword");
    cy.get('[data-cy="email-input"]').clear().type(testUsers["new"]["email"]);
    cy.get('[data-cy="password-input"]')
      .clear()
      .type(testUsers["new"]["password"]);
    cy.get('[data-cy="sign-in-btn"]').click();
    cy.contains("User is currently signed-in").should("exist");

    // Go to Friends page
    cy.visit("/friends");
    cy.contains("Your Status").should("exist");

    // Main's status should be there
    cy.contains(testUsers["main"]["status"]).should("exist");

    // Delete friend request
    cy.contains("Add friend").click();
    cy.get('[name="remove"]').type(testUsers["main"]["email"] + "{enter}");
    cy.contains(testUsers["new"]["status"]).should("exist");
    cy.contains("Friendship deleted.").should("exist");
  });
});

export default {};
