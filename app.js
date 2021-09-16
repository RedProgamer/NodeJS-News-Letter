const express = require('express');
const parser = require('body-parser');
const request = require('request');
const https = require('https');


const app = express();

app.use(express.static("public"));
app.use(parser.urlencoded({extended:true}));


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', function(req, res) {
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };

    const json_data = JSON.stringify(data);
    const api_key = '6c57aa79a070f00fd428a4d076bb33a1-us5';
    const list_id = '472c37ffaa';

    const url = `https://us5.api.mailchimp.com/3.0/lists/${list_id}`;
    const options = {
        method: 'POST',
        auth: `nirmalNodeJS:${api_key}`,
    }
    
    // Sending data to mailchimp
    const request = https.request(url, options, function(response) {

        if(response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
        }else {
            res.sendFile(__dirname + '/failure.html');
        }

        response.on("data", function(data) {
            // console.log(JSON.parse(data));
        });
    });

    // Passing the data
    request.write(json_data);
    request.end();
    
});

// For handling failure
app.post('/fail', function(req, res) {
    res.redirect('/');
});

app.listen(process.env.PORT || 3000, ()=> {
    console.log(`Listening to http://localhost:3000`);
});