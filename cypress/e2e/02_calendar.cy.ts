import dayjs from "dayjs";

function parseHour(timeString: string) {
  const hour = timeString.match(/\d+(?=\:)/);
  if (hour) return parseInt(hour[0]);
  return 0;
}

function parseMonth(monthString: string) {
  return dayjs(monthString).toDate();
}

describe("Testing the calendar widgets", () => {
  it("makes sure candle lighting is earlier than havdalah", () => {
    cy.visit("/");
    cy.mockGeolocation();
    cy.get('[data-cy="get-times-button"]').click();
    cy.contains("Get ready").should("exist");
    cy.get('[data-cy="candles-time"]')
      .invoke("text")
      .then(parseHour)
      .then(($candles) => {
        cy.get('[data-cy="havdalah-time"]')
          .invoke("text")
          .then(parseHour)
          .then(($havdalah) => {
            expect($candles).to.be.lessThan($havdalah);
          });
      });
  });

  it("tests that calendar buttons work", () => {
    cy.visit("/");
    cy.get('[data-cy="month-name"]')
      .invoke("text")
      .then(parseMonth)
      .then(($currentMonth) => {
        cy.get('[data-cy="prev-month"]').click();
        cy.get('[data-cy="month-name"]')
          .invoke("text")
          .then(parseMonth)
          .then(($prevMonth) => {
            expect($prevMonth).to.be.lessThan($currentMonth);
          });
        cy.get('[data-cy="next-month"]').click();
        cy.get('[data-cy="next-month"]').click();
        cy.get('[data-cy="month-name"]')
          .invoke("text")
          .then(parseMonth)
          .then(($nextMonth) => {
            expect($nextMonth).to.be.greaterThan($currentMonth);
          });
        cy.get('[data-cy="back-to-today"]').click();
        cy.get('[data-cy="month-name"]')
          .invoke("text")
          .then(parseMonth)
          .then(($nextMonth) => {
            expect($nextMonth).to.be.deep.equal($currentMonth);
          });
      });

    cy.get('[data-cy="calendar-table"]').within(() => {
      cy.get(`[data-cy="${dayjs().date()}"]`).should(
        "have.css",
        "font-weight",
        "700"
      );
      cy.get(`[data-cy="${dayjs().date() + 1}"]`).should(
        "have.css",
        "font-weight",
        "400"
      );
      cy.get(`[data-cy="${dayjs().date() + 1}"]`).click();
      cy.get(`[data-cy="${dayjs().date() + 1}"]`).should(
        "have.css",
        "font-weight",
        "700"
      );
    });
  });
});

export default {};
