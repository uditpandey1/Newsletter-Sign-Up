const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
require('dotenv').config()

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");                                                   //signup page
});

app.post("/", function (req, res) {

    //form filled up values

    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const emailId = req.body.email;

    //fields

    var data = {
        members: [
            {
                email_address: emailId,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);                                                //data in JSON format

    const audience_id = process.env.Audience_ID;                                          //Audience Id

    const url = "https://us11.api.mailchimp.com/3.0/lists/"+audience_id;                  //api endpoint and path

    const apikey = process.env.API_KEY;                                                   //Api Key
    
    const options = {
        method: "POST",
        auth: "udit:"+apikey
    };

    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {                                                      //shows success page
            res.sendFile(__dirname + "/success.html");                          
        }
        else {
            res.sendFile(__dirname + "/failure.html");                                          //shows failure page
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);                                                                   //save user in mailing list
    request.end();
});

app.post("/failure", function (req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
    console.log("srver running at port 3000");
});