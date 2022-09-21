import testUsers from "../fixtures/test_users.json";

describe("Testing friend requests", () => {
  it("creating a poll", () => {
    // Sign in as main
    cy.visit("/signInWithPassword");
    cy.get('[data-cy="email-input"]').clear().type(testUsers["main"]["email"]);
    cy.get('[data-cy="password-input"]')
      .clear()
      .type(testUsers["main"]["password"]);
    cy.get('[data-cy="sign-in-btn"]').click();
    cy.contains("User is currently signed-in").should("exist");

    // Open macro
    cy.visit("/");
    cy.get('[data-cy="poll-preview"]').click();
    cy.contains("My Poll").should("exist");

    // Create new poll
    cy.get('[name="new-poll"]').type(testUsers["main"]["poll"] + "{enter}");
    cy.contains(testUsers["main"]["poll"]).should("exist");

    // Add vote
    cy.get("input").type(testUsers["main"]["vote"] + "{enter}");
    cy.contains("Vote updated").should("exist");
  });

  it("friend1 votes on the poll", () => {
    // Sign in as friend1
    cy.visit("/signInWithPassword");
    cy.get('[data-cy="email-input"]')
      .clear()
      .type(testUsers["friend1"]["email"]);
    cy.get('[data-cy="password-input"]')
      .clear()
      .type(testUsers["friend1"]["password"]);
    cy.get('[data-cy="sign-in-btn"]').click();
    cy.contains("User is currently signed-in").should("exist");

    // Open macro
    cy.visit("/");
    cy.get('[data-cy="poll-preview"]').click();
    cy.contains("My Poll").should("exist");

    // Go to main's poll
    cy.contains(testUsers["main"]["poll"]).click();

    // Add vote
    cy.wait(500);
    cy.get("input").clear().type(testUsers["friend1"]["vote"]);
    cy.wait(500);
    cy.get('[type="submit"]').click();
    cy.wait(500);
    cy.contains("Vote updated").should("exist");
  });

  it("friend2 votes on the poll", () => {
    // Sign in as friend2
    cy.visit("/signInWithPassword");
    cy.get('[data-cy="email-input"]')
      .clear()
      .type(testUsers["friend2"]["email"]);
    cy.get('[data-cy="password-input"]')
      .clear()
      .type(testUsers["friend2"]["password"]);
    cy.get('[data-cy="sign-in-btn"]').click();
    cy.contains("User is currently signed-in").should("exist");

    // Open macro
    cy.visit("/");
    cy.get('[data-cy="poll-preview"]').click();
    cy.contains("My Poll").should("exist");

    // Go to main's poll
    cy.contains(testUsers["main"]["poll"]).click();

    // Add vote
    cy.wait(500);
    cy.get("input").clear().type(testUsers["friend2"]["vote"]);
    cy.wait(500);
    cy.get('[type="submit"]').click();
    cy.wait(500);
    cy.contains("Vote updated").should("exist");

    // Change vote
    cy.wait(500);
    cy.get("input").clear().type(testUsers["friend1"]["vote"]);
    cy.wait(500);
    cy.get('[type="submit"]').click();
    cy.wait(500);
    cy.contains("Vote updated").should("exist");
  });

  it("new user cannot see the poll", () => {
    // Sign in as new
    cy.visit("/signInWithPassword");
    cy.get('[data-cy="email-input"]').clear().type(testUsers["new"]["email"]);
    cy.get('[data-cy="password-input"]')
      .clear()
      .type(testUsers["new"]["password"]);
    cy.get('[data-cy="sign-in-btn"]').click();
    cy.contains("User is currently signed-in").should("exist");

    // Open macro
    cy.visit("/");
    cy.get('[data-cy="poll-preview"]').click();
    cy.contains("My Poll").should("exist");

    // Go to main's poll
    cy.contains(testUsers["main"]["poll"]).should("not.exist");
  });

  it("main deletes the poll", () => {
    // Sign in as main
    cy.visit("/signInWithPassword");
    cy.get('[data-cy="email-input"]').clear().type(testUsers["main"]["email"]);
    cy.get('[data-cy="password-input"]')
      .clear()
      .type(testUsers["main"]["password"]);
    cy.get('[data-cy="sign-in-btn"]').click();
    cy.contains("User is currently signed-in").should("exist");

    // Open macro
    cy.visit("/");
    cy.get('[data-cy="poll-preview"]').click();
    cy.contains("My Poll").should("exist");

    // Go to my poll
    cy.contains(testUsers["main"]["poll"]).click();

    // Remove vote
    cy.get('[data-cy="remove-vote-button"]').click();
    cy.get('[data-cy="remove-vote-button"]').should("not.exist");

    // Delete the poll
    cy.get('[data-cy="delete-button"]').click();
    cy.contains(testUsers["main"]["poll"]).should("not.exist");
  });
});

export default {};
