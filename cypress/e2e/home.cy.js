/// <reference types="cypress" />

context('Home', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('contains welcome banner', () => {
    cy.contains('Welcome!')
  })

  it('contains 3 cards', () => {
    const cards = cy.get('.image-link-card')
    const expectedLabels = ['Projects', 'Blog', 'GitHub']

    cards.each((item, index, list) => {
      expect(list).to.have.length(3)
      expect(item).to.contain(expectedLabels[index])
    })
  })

  it('navigates to Projects site when clicking on the "Projects" card', () => {
    const card = cy.get('.image-link-card').eq(0)
    card.contains('Projects')
    card.click()
    cy.url().should('include', '/projects')
  })

  it('navigates to blog when clicking on the "Blog" card', () => {
    const card = cy.get('.image-link-card').eq(1)
    card.contains('Blog')
    card.click()
    cy.url().should('include', '/blog')
  })
})
