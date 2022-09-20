// import { greg } from "@hebcal/core";
import testUsers from "../fixtures/test_users.json";

// Update status
// GPS button AND dragging the marker
// Delete status

// See friends' statuses
// Focus on statuses
//

describe("Testing the statuses", () => {
  it("friend creates a status if none exists already", () => {
    // Sign in friend
    cy.visit("/signInWithPassword");
    cy.get('[data-cy="email-input"]')
      .clear()
      .type(testUsers["friend1"]["email"]);
    cy.get('[data-cy="password-input"]')
      .clear()
      .type(testUsers["main"]["password"]);
    cy.get('[data-cy="sign-in-btn"]').click();
    cy.contains("User is currently signed-in").should("exist");

    // Go to Friends page
    cy.visit("/friends");
    cy.contains("Your Status").should("exist");

    // Open "Update Status" form
    cy.get('[data-cy="add-status-button"]').click();
    cy.contains("What are you up to").should("exist");

    // Update status
    cy.get('[name="text"]').type(`words`);
    // cy.get('[name="text"]').type(`${greg.greg2abs(new Date())}`);
    cy.get('[name="city"]').type("Narnia");
    cy.mockGeolocation();
    cy.get('[data-cy="gps-button"]').click();
    cy.get('[name="city"]').should("not.have.value", "Narnia");

    // Dragging pin on map, too hard to test with cypress

    // cy.get('[name="city"]').type("Narnia");
    // cy.get("svg")
    //   .trigger("dragenter")
    //   .then((x) => {
    //     x.trigger("drop", { clientX: 200, clientY: 300 });
    //   });
    // cy.get(".mapboxgl-canvas");
    // .trigger("mousemove", 15, 40);
    // cy.get("svg").trigger("drop", { clientX: 200, clientY: 300 });
  });
});

export default {};
