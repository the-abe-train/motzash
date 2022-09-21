import testUsers from "../fixtures/test_users.json";

describe("Testing the todo widget", () => {
  it("cannot create a todo list when not signed-in", () => {
    cy.visit("/");
    cy.get('[data-cy="todo-preview"]').click();
    cy.contains("Sign-in form").should("exist");
  });

  it("creates a new todo list", () => {
    // Sign in
    cy.visit("/signInWithPassword");
    cy.get('[data-cy="email-input"]').clear().type(testUsers["main"]["email"]);
    cy.get('[data-cy="password-input"]')
      .clear()
      .type(testUsers["main"]["password"]);
    cy.get('[data-cy="sign-in-btn"]').click();
    cy.contains("User is currently signed-in").should("exist");
    cy.visit("/");

    // Open macro
    cy.get('[data-cy="todo-preview"]').click();
    cy.contains("Create new list").should("exist");

    // Create new list
    cy.get('[data-cy="new-list-input"]').type("Fake new list{enter}");
    cy.get('[data-cy="list-of-lists"]').within(() => {
      cy.contains("Fake new list").should("exist");
    });

    // Add item to list
    cy.get('[data-cy="list-of-lists"]').within(() => {
      cy.contains("Fake new list").click();
    });
    cy.get('[data-cy="new-todo-input"]').type("Eat pancakes{enter}");
    cy.get('[data-cy="todos-list"]').within(() => {
      cy.get("input").should("have.value", "Eat pancakes");
    });

    // Complete and un-complete item on list
    cy.get('[data-cy="complete-button"]').click();
    cy.get("input").should("have.css", "text-decoration-line", "line-through");
    cy.get('[data-cy="complete-button"]').click();
    cy.get("input").should("have.css", "text-decoration-line", "none");

    // Delete item from list
    cy.get('[data-cy="task-delete-button"]').click();
    cy.get('[data-cy="todos-list"]').within(() => {
      cy.get("input").should("not.exist");
    });

    // Delete list
    cy.contains("Delete list").click();
    cy.get('[data-cy="list-of-lists"]').within(() => {
      cy.contains("Fake new list").should("not.exist");
    });
  });
});

export default {};
