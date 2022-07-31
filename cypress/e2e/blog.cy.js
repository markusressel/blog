/// <reference types="cypress" />

context('Blog', () => {
  beforeEach(() => {
    cy.visit('/blog')
  })

  it('contains list items', () => {
    cy.get('.article-list-item').should('have.length.gte', 1)
  })

  it('has an item in the list', () => {
    cy.get('.article-list-item').contains('Read more')
  })

  it('navigates to post when clicking on - read more', () => {
    cy.get('.article-list-item').first().click()
    cy.url().should('include', 'blog/post/')
  })
})
