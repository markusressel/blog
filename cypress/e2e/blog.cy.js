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

context('Blog pagination', () => {
  it('shows 5 articles on the first page', () => {
    cy.visitHydrated('/blog')
    cy.get('.article-list-item').should('have.length', 5)
  })

  it('navigates to the next page', () => {
    cy.visitHydrated('/blog')
    cy.contains('a', 'Next').click()
    cy.url().should('include', 'page=2')
    cy.get('.article-list-item').should('have.length.gte', 1)
    cy.get('.article-list-item').should('have.length.lte', 5)
  })

  it('does not list dummy articles in production', () => {
    cy.visitHydrated('/blog')
    cy.contains('a', 'Next').click()
    cy.get('.article-list-item').should('not.contain', 'UM34C')
    cy.visitHydrated('/blog')
    cy.get('.article-list-item').should('not.contain', 'UM34C')
  })
})

context('Unknown routes', () => {
  it('redirects to the home page', () => {
    cy.visit('/does-not-exist', { failOnStatusCode: false })
    cy.location('pathname').should('eq', '/')
    cy.contains('Welcome!')
  })
})
