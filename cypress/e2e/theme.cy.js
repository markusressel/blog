/// <reference types="cypress" />

context('Theme', () => {
  it('cycles through system, light and dark mode', () => {
    cy.visitHydrated('/')
    cy.get('button[aria-label^="Theme: system"]').click()
    cy.get('html').should('have.class', 'light-mode')
    cy.get('button[aria-label^="Theme: light"]').click()
    cy.get('html').should('have.class', 'dark-mode')
    cy.get('button[aria-label^="Theme: dark"]').click()
    cy.get('button[aria-label^="Theme: system"]').should('exist')
  })

  it('remembers the selected theme', () => {
    cy.visitHydrated('/')
    cy.get('button[aria-label^="Theme: system"]').click()
    cy.get('button[aria-label^="Theme: light"]').click()
    cy.reload()
    cy.get('html').should('have.class', 'dark-mode')
  })
})
