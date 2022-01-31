describe('Tester at lydia-radigiver-frontend når lydia-api', () => {
    it('Forventer 401 når man kaller /api uten gyldig token', () => {
        const endepunkt = "/api/test"
        cy.intercept(endepunkt, (req) => {
            req.headers['authorization'] = 'bearer my-bearer-auth-token'
        }).as('addAuthHeader')
        cy.visit(`http://localhost:9876${endepunkt}`, { failOnStatusCode: false });
        cy.wait('@addAuthHeader').its("response.statusCode").should("equal", 401)
    })
})