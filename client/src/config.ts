// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '2bc1nekv07'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-babalola.eu.auth0.com',            // Auth0 domain
  clientId: 'Xz0sQrc4MwRrnGtS4Ug236nKw4ZRi0bk',          // Auth0 client id
  callbackUrl: 'http://localhost:3003/callback'
}
