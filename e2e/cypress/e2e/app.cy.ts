describe("Prioriteringsliste", () => {
    it("Sjekk at dato endret finnes", () => {
        cy.visit("iframe.html?args=&id=prioritering-prioriteringstabell--hovedstory&viewMode=story");

        cy.get("table tbody tr.navds-table__row").should(($rows) => {
            expect($rows.eq(1)).to.contain("22.08.2022").and.not.contain("Ikke aktiv")
        });
    });
});

describe("IA-sakskomponent", () => {
    it("Sak i 'Kartlegges' skal ha knapper for 'Tilbake', 'Vi bistår' og 'Ikke aktuell'", () => {
        cy.visit("iframe.html?args=&id=virksomhet-oversikt-over-ia-sak--kartlegges&viewMode=story");
        cy.findByRole('button', {name: /Tilbake/i}).should('exist')
        cy.findByRole('button', {name: /Vi bistår/i}).should('exist')
        cy.findByRole('button', {name: /Ikke aktuell/i}).should('exist')
    });
    it("Sak i 'Vi bistår' skal ha knapper for 'Tilbake', 'Fullfør' og 'Ikke aktuell'", () => {
        cy.visit("iframe.html?args=&id=virksomhet-oversikt-over-ia-sak--vi-bistar&viewMode=story");
        cy.findByRole('button', {name: /Tilbake/i}).should('exist')
        cy.findByRole('button', {name: /Fullfør/i}).should('exist')
        cy.findByRole('button', {name: /Ikke aktuell/i}).should('exist')
    });
});

