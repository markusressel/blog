describe('Projects', () => {
  it('shows the projects fetched at build time', () => {
    // the browser refresh from the GitHub API is optional
    cy.intercept('https://api.github.com/**', { statusCode: 503 })
    cy.visitHydrated('/projects')
    cy.get('.project-card').should('have.length.greaterThan', 10)
    cy.contains('.project-card', 'fan2go')
  })

  it('loads the preview images', () => {
    cy.intercept('https://api.github.com/**', { statusCode: 503 })
    cy.visitHydrated('/projects')
    cy.get('.project-card img')
      .should('have.length.greaterThan', 5)
      .each(($img) => {
        cy.wrap($img).scrollIntoView()
        cy.wrap($img).should(($el) => {
          expect($el[0].naturalWidth).to.be.greaterThan(0)
        })
      })
  })
})
