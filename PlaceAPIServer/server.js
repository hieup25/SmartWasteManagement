const express = require('express');
const app = express();
const place = require('./PlaceAPI.js');
const gendatabase = require('../database/GenDatabase.js');

app.use(express.static(__dirname)); // thay __dirname bang duong dan muon
app.get('/authentication', (req, res) => {
    res.json('dd');
});
app.get('/gendatabase', (req, res) => {
    let accessToken = req.query.accessToken;
    if (accessToken === '09f76ee031ad59a5ff9f43f06427b799') {
        gendatabase.GenerateDatabase((r)=> {
            res.status(200).json(r);
        });
    }
    else {
        res.status(400).json({"error":"Bad Request"});
    }
});
app.get('/findPlace', (req, res) => {
    let address = req.query.address;
    let accessToken = req.query.accessToken;
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (address && accessToken) {
        place.FindPlace(address, accessToken, (result, status=200)=> {
            res.status(status).send(result);
        });
    }
    else {
        res.status(400).json({"error":"Bad Request"});
    }
});
var server = app.listen(9001, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log("PlaceAPIServer listening at http://%s:%s", host, port)
});