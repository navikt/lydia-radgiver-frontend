// describe('', () => {
//     beforeEach(() => {
//       cy.visit("http://localhost:9876/lydia-radgiver");
//     })
// })


describe('My First Test', () => {
    beforeEach(() => {
      cy.visit("http://localhost:9876/lydia-radgiver");
    });
    it('Does not do much!', () => {
      expect(true).to.equal(true)
    })
  })