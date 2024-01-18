const express = require("express");
require('dotenv').config();
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const app = express();
const PORT = process.env.PORT || 3030;

const AUTHENDPOINT = "https://login.salesforce.com/services/oauth2/token";

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

const queryParams = {
   grant_type: "password",
   client_id: process.env.RENDER_LOGIN_CLIENT_ID,
   client_secret: process.env.RENDER_LOGIN_CLIENT_SECRET,
   username: process.env.RENDER_LOGIN_USERNAME,
   password: process.env.RENDER_LOGIN_PASSWORD
};

app.post("/create", (req, res) => {

    let request = req.body;
    let result = null;
    axios
    .post(AUTHENDPOINT, null, {
        params: queryParams
    })
    .then(async res => {
        if(res.status === 200){
            let data = res.data;
            let accessToken = data.access_token,
            instanceURL = data.instance_url || "https://roswaltrealty.my.salesforce.com";
            let sendData = {
                req: {...request}
            };
            const FORMURL = `${instanceURL}/services/apexrest/CreateLead/`;

            await axios
            .post(FORMURL, sendData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type':'application/json'
                }
            }).then(res => {
                console.log('Res status', res.status);
                if(res.status === 200){
                    let data = res.data;
                    result = data;
                }
            })
        }
    }).then(resp => {
        res.send(result);
    }).catch(e => {
        console.log("Error", e)
    });

});


app.listen(PORT, () => console.log(`Hello world app listening on port ${PORT}!`));