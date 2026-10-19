/// <reference types="cypress" />

context('Feed and metadata', () => {
  it('has an RSS feed with all articles', () => {
    cy.request('/feed.xml').then((response) => {
      expect(response.body).to.include('<rss version="2.0"')
      expect(response.body).to.include(
        '<link>https://markusressel.de/blog/post/investigating-zfs-cksum-errors/</link>',
      )
      expect(response.body).not.to.include('dummy-post')
    })
  })

  it('links the feed and the canonical URL', () => {
    cy.visitHydrated('/blog')
    cy.get('link[rel="alternate"][type="application/rss+xml"]').should(
      'have.attr',
      'href',
      '/feed.xml',
    )
    cy.get('link[rel="canonical"]').should(
      'have.attr',
      'href',
      'https://markusressel.de/blog/',
    )
  })

  it('describes articles as structured data', () => {
    cy.visitHydrated('/blog/post/investigating-zfs-cksum-errors')
    cy.get('script[type="application/ld+json"]')
      .invoke('text')
      .then((text) => {
        const data = JSON.parse(text)
        expect(data['@type']).to.equal('BlogPosting')
        expect(data.headline).to.equal(
          'Investigating inconspicuous ZFS CKSUM Errors',
        )
        expect(data.datePublished).to.equal('2021-04-28')
        expect(data.dateModified).to.equal('2023-12-16')
      })
  })
})
