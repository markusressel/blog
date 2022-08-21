context('Theme', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Theme switch present on top bar', () => {
    cy.get('.color-mode-picker').should('be.visible')
  })

  it('Theme can be changed after cookies are accepted', () => {
    cy.get('.cookie__bar__buttons__button--accept').click()
    cy.get('.color-mode-picker').click()
    cy.get('.color-mode-picker').click()
    cy.get('.page-header').should('have.class', '.dark-mode')
  })
})
