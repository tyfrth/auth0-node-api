# Sample API using the Auth0 express-oauth2-jwt-bearer library

This is intended to work with an Auth0 frontend library sample such as [auth0-react-samples](https://github.com/auth0-samples/auth0-react-samples) in place of the existing `api-server.js`. 

## Project setup

Use `npm` to install the project dependencies:

```bash
npm install
```

## Configuration

Some tweaking will need to be done to the React sample app, primarily updating `ExternalApi.js` with the correct `apiOrigin` (`http://localhost:3003`) and adding additional functions to call `/api/external/public` and `/api/external/create` . The "Call an API" functionality of auth0-react-samples should work with the `/api/external` endpoint once the port has been configured correctly. This sample runs on `http://localhost:30003`.  

This app uses [dotenv](https://www.npmjs.com/package/dotenv) rather than `auth_config.json` in `api-server.js`. Create a `.env` file and add the following:

```
ISSUER_BASE_URL=https://{your_domain}.auth0.com
AUDIENCE=https://{your_api_identifier}
```
## Run the sample

This starts the backend API server on port 3003.

```bash
node server.js
```
