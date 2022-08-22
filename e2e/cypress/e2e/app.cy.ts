describe("Navigasjon", () => {
    it("kan nå storybook", () => {
        cy.visit("iframe.html?args=&id=prioritering-prioriteringstabell--hovedstory&viewMode=story");

        cy.get("table tbody tr.navds-table__row").should(($rows) => {
            expect($rows.eq(1)).to.contain("22.08.2022").and.not.contain("Ikke aktiv")
        });
    });
});
