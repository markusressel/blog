/// <reference types="cypress" />

context('Search', () => {
  beforeEach(() => {
    cy.visitHydrated('/')
  })

  it('finds articles by text', () => {
    cy.get('input[type="search"]').type('zfs')
    cy.contains('a', 'Investigating inconspicuous ZFS CKSUM Errors').should(
      'exist',
    )
  })

  it('navigates to an article when clicking a search result', () => {
    cy.get('input[type="search"]').type('zfs')
    cy.contains('a', 'Investigating inconspicuous ZFS CKSUM Errors').click()
    cy.url().should('include', '/blog/post/investigating-zfs-cksum-errors')
  })

  it('shows a message when nothing matches', () => {
    cy.get('input[type="search"]').type('qwertzuiopasdfgh')
    cy.contains('Nothing found')
  })

  it('does not find dummy articles in production', () => {
    cy.get('input[type="search"]').type('UM34C')
    cy.contains('Nothing found')
  })
})

context('Search results', () => {
  it('close when clicking outside of the search', () => {
    cy.visitHydrated('/')
    cy.get('input[type="search"]').type('zfs')
    cy.contains('a', 'Investigating inconspicuous ZFS CKSUM Errors')
    cy.get('main').click('topLeft')
    cy.contains('a', 'Investigating inconspicuous ZFS CKSUM Errors').should(
      'not.exist',
    )
  })
})
