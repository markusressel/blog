/// <reference types="cypress" />

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      visitHydrated(url: string): Chainable<void>
    }
  }
}

// Visit a page and wait until Vue has hydrated it, so clicks are handled by the app.
// Vue 3 sets `__vue_app__` on the mount element, Vue 2 (Nuxt 2) sets `__vue__`.
Cypress.Commands.add('visitHydrated', (url: string) => {
  cy.visit(url)
  cy.get('#__nuxt').should((element) => {
    const root = element[0] as HTMLElement & {
      __vue_app__?: unknown
      __vue__?: unknown
    }
    expect(Boolean(root.__vue_app__ ?? root.__vue__), 'hydrated').to.equal(true)
  })
})

export {}
