const express = require("express");
require('dotenv').config();
const cors = require("cors");
const axios = require("axios");
const helmet = require("helmet");

const app = express();
const PORT = process.env.PORT || 3030;

const AUTHENDPOINT = "https://login.salesforce.com/services/oauth2/token";

app.use(cors());
app.use(helmet());

const queryParams = {
   grant_type: "password",
   client_id: process.env.RENDER_LOGIN_CLIENT_ID,
   client_secret: process.env.RENDER_LOGIN_CLIENT_SECRET,
   username: process.env.RENDER_LOGIN_USERNAME,
   password: process.env.RENDER_LOGIN_PASSWORD
};

let responseData = null;

axios
.post(AUTHENDPOINT, null, {
    params: queryParams
})
.then(res => {
    responseData = res.data || {};
}).catch(e => {
    console.log("Error", e)
});

app.get("/", (req, res) => {
    res.json(responseData);
    res.end();
});

app.listen(PORT, () => console.log(`Hello world app listening on port ${PORT}!`));