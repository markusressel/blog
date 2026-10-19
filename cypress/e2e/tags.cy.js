/// <reference types="cypress" />

context('Tags', () => {
  it('lists all tags', () => {
    cy.visitHydrated('/blog/tags')
    cy.contains('All Tags')
    cy.contains('a', '#zfs').should('exist')
    cy.contains('a', '#linux').should('exist')
  })

  it('navigates to a tag page when clicking a tag', () => {
    cy.visitHydrated('/blog/tags')
    cy.contains('a', '#zfs').click()
    cy.url().should('include', '/blog/tags/zfs')
  })

  it('shows only articles with the selected tag', () => {
    cy.visitHydrated('/blog/tags/zfs')
    cy.contains('#zfs')
    cy.get('.article-list-item').should('have.length', 2)
    cy.get('.article-list-item').should('contain', 'ZFS')
  })
})
