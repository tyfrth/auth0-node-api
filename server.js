const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
//const authConfig = require("./src/auth_config.json");

const express = require('express');
const { auth, requiredScopes, claimEquals, claimIncludes } = require('express-oauth2-jwt-bearer');
require('dotenv').config(); // Load the .env variables

const appPort = 3000;
const appOrigin = `http://localhost:${appPort}`;

const app = express();
const checkJwt = auth();
app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: appOrigin }));

//using claimIncludes to check if the permissions claim contains read:msg
app.get('/api/external', checkJwt, claimIncludes('permissions', 'read:msg'), (req, res) => {
  res.json({ message: `Hello ${req.auth.payload.sub} - Permissions: ${req.auth.payload.permissions}` });
});

//public endpoint
app.get('/api/external/public', (req, res) => {
    res.json({ message: `Hello- This is a public endpoint, welcome!` });
  });

//protected, requires create:msg permission
app.post('/api/external/create', checkJwt, claimIncludes('permissions', 'create:msg'), (req, res) => {
  res.json({message: `Hello ${req.auth.payload.sub} - Successful POST` })
});

app.listen(3003, () => console.log(`listening at http://localhost:3003`))