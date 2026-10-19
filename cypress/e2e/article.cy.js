/// <reference types="cypress" />

// The Nuxt 2 build throws this from the Prism line-highlight plugin.
// Ignore only this error, so the old build can be used as a reference.
Cypress.on('uncaught:exception', (error) =>
  error.message.includes("reading 'highlightLines'") ? false : undefined,
)

context('Article', () => {
  beforeEach(() => {
    cy.visitHydrated('/blog/post/my-first-blog-post')
  })

  it('shows title and header image', () => {
    cy.get('h1').should('contain', 'My first Blog Post')
    cy.get('article img, img').first().should('have.attr', 'src')
  })

  it('has a table of contents linking to the headings', () => {
    cy.contains('Table of Contents')
    cy.get('nav a[href^="#"]')
      .should('have.length.gte', 5)
      .each((link) => {
        const id = link.attr('href').slice(1)
        cy.get(`[id="${id}"]`).should('exist')
      })
  })

  it('navigates to a heading when clicking a table of contents entry', () => {
    cy.get('nav a[href="#code"]').click()
    cy.location('hash').should('eq', '#code')
  })

  it('renders headings with anchor links', () => {
    cy.get('h2#code').find('a[href="#code"]').should('exist')
  })

  it('renders code blocks with filename', () => {
    cy.contains('example.py').should('exist')
    cy.get('pre')
      .first()
      .should('contain', 'def function(a: str, b: int) -> None:')
  })

  // Fails on the Nuxt 2 build, where the Prism error above prevents the toolbar.
  it('has a copy button on code blocks', () => {
    cy.contains('example.py').scrollIntoView().should('be.visible')
    cy.contains('button', 'Copy').should('exist')
  })

  it('renders tables and blockquotes', () => {
    cy.get('table').should('exist')
    cy.get('blockquote').should('exist')
  })

  it('links tags to the tag page', () => {
    cy.contains('a', '#helloworld').click()
    cy.url().should('include', '/blog/tags/helloworld')
  })

  it('shows the author', () => {
    cy.contains('Markus Ressel')
    cy.contains('Software Engineer, Germany')
  })

  it('links to the next article', () => {
    cy.contains('a', '>>').click()
    cy.url().should('include', '/blog/post/')
    cy.url().should('not.include', 'my-first-blog-post')
  })
})

context('Images', () => {
  for (const url of [
    '/',
    '/blog',
    '/blog/post/investigating-zfs-cksum-errors',
  ]) {
    it(`all load on ${url}`, () => {
      cy.visitHydrated(url)
      cy.get('img').each((image) => {
        cy.wrap(image).scrollIntoView()
        cy.wrap(image).should((element) =>
          expect(element[0].naturalWidth, element[0].currentSrc).to.be.above(0),
        )
      })
    })
  }
})
