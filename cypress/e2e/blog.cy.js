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

  it('shows the reading time of each article', () => {
    cy.get('.article-list-item .article-meta')
      .first()
      .invoke('text')
      .should('match', /\d+ min read/)
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
    cy.location('pathname').should('eq', '/blog/page/2')
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

context('Blog pages', () => {
  it('are prerendered', () => {
    cy.request('/blog/page/2')
      .its('body')
      .should('include', 'article-list-item')
  })

  it('redirect the old ?page= URLs', () => {
    cy.visit('/blog?page=2')
    cy.location('pathname').should('eq', '/blog/page/2')
  })
})

context('Unknown routes', () => {
  it('show a not found page with links', () => {
    cy.visit('/does-not-exist', { failOnStatusCode: false })
    cy.contains('Page not found')
    cy.contains('button', 'Blog').click()
    cy.location('pathname').should('eq', '/blog')
  })

  it('return a 404 status code', () => {
    cy.request({ url: '/does-not-exist', failOnStatusCode: false })
      .its('status')
      .should('eq', 404)
  })

  it('show a not found page for unknown articles', () => {
    cy.visit('/blog/post/does-not-exist', { failOnStatusCode: false })
    cy.contains('Page not found')
  })
})
