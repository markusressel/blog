// Provide a baseUrl without basic auth credentials

// @ts-ignore
export const baseUrl = Cypress.config().baseUrl.replace(
  /(http.:\/\/).*:.*@(.*)$/,
  '$1$2'
)

export default baseUrl
