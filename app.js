const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
require("dotenv").config();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LName: lastName,
        },
      },
    ],
  };
  const JSONdata = JSON.stringify(data);
  const url = `https://us5.api.mailchimp.com/3.0/lists/218cfe5f3c`;
  const options = {
    method: "POST",
    auth: `brett:${process.env.API_KEY}`,
  };
  const request = https.request(url, options, function (response) {
    if (response.statusCode == 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  });
  request.write(JSONdata);
  request.end();
});

app.listen(3000, function () {
  console.log(`Server is running on port 3000`);
});
