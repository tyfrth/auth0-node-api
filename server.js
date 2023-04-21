const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const bodyParser = require("body-parser")

//pull in auth0 clients
const ManagementClient = require("auth0").ManagementClient;
const AuthenticationClient = require("auth0").AuthenticationClient;

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

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

var auth0 = new ManagementClient({
  domain: process.env.DOMAIN,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  audience: process.env.MGMNT_AUDIENCE,
  scope: 'read:users update:users',
});

//Using claimIncludes to check if the permissions claim contains read:msg
app.get('/api/external', checkJwt, claimIncludes('permissions', 'read:msg'), (req, res) => {
  res.json({ message: `Hello ${req.auth.payload.sub} - Permissions: ${req.auth.payload.permissions}` });
});

//Public endpoint
app.get('/api/external/public', (req, res) => {
    res.json({ message: `Hello- This is a public endpoint, welcome!` });
  });

//Protected, requires create:msg permission
app.post('/api/external/create', checkJwt, claimIncludes('permissions', 'create:msg'), (req, res) => {
  res.json({message: `Hello ${req.auth.payload.sub} - Successful POST` })
});

//endpoint to update nickname
app.post('/api/external/nickname', checkJwt, (req, res) => {

const data = JSON.stringify(req.body)
console.log(data); // log the data to the console

auth0.users.update({id: req.auth.payload.sub}, data, function (err, user) {
  if (err) {
    console.log(err)
    res.json({message: `Unable to successfully set new nickname!`})
  } else {
    console.log(user)
    res.json({message: `Your new nickname ${user.nickname} has been set successfully!`})
  }
    
  })

});


app.listen(3003, () => console.log(`listening at http://localhost:3003`))