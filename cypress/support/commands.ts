/// <reference types="cypress" />

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      visitHydrated(url: string): Chainable<void>
    }
  }
}

// Visit a page and wait until it is hydrated, so input and clicks are handled by the app.
// Vue sets `__vue_app__` when mounting starts, but Nuxt keeps hydrating async components
// afterwards, so wait for Nuxt's `isHydrating` flag. Vue 2 (Nuxt 2) sets `__vue__`.
Cypress.Commands.add('visitHydrated', (url: string) => {
  cy.visit(url)
  cy.get('#__nuxt').should((element) => {
    const root = element[0] as HTMLElement & {
      __vue_app__?: { $nuxt?: { isHydrating?: boolean } }
      __vue__?: unknown
    }
    const hydrated = root.__vue_app__
      ? root.__vue_app__.$nuxt?.isHydrating === false
      : Boolean(root.__vue__)
    expect(hydrated, 'hydrated').to.equal(true)
  })
})

export {}
