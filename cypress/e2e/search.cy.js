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

context('Search keyboard navigation', () => {
  it('focuses the search with "/"', () => {
    cy.visitHydrated('/')
    cy.get('body').type('/')
    cy.focused().should('have.attr', 'type', 'search')
  })

  it('opens the selected result with the arrow keys and Enter', () => {
    cy.visitHydrated('/')
    cy.get('input[type="search"]').type('zfs')
    cy.get('[role="option"]').should('have.length', 2)
    cy.get('input[type="search"]').type('{downArrow}{downArrow}')
    cy.get('[role="option"]')
      .eq(1)
      .should('have.attr', 'aria-selected', 'true')
      .find('a')
      .invoke('attr', 'href')
      .then((href) => {
        cy.get('input[type="search"]').type('{enter}')
        cy.location().should((location) =>
          expect(location.pathname + location.hash).to.equal(href),
        )
      })
  })

  it('does not load the SQLite database for searching', () => {
    cy.intercept('/__nuxt_content/**').as('database')
    cy.visitHydrated('/')
    cy.get('input[type="search"]').type('zfs')
    cy.get('[role="option"]').should('exist')
    cy.get('@database.all').should('have.length', 0)
  })
})
