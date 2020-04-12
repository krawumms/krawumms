describe('The Home Page', () => {
  it('Does not do much!', () => {
    expect(true).to.equal(true);
  });

  it('successfully loads the page', () => {
    cy.visit('/');
  });
});
