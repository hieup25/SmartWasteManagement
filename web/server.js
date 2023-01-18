const database = require('./database/SQLManage.js');
const express = require('express');
var cors = require('cors');
const app = express();
app.use(cors());
app.use(express.static(__dirname)); // thay __dirname bang duong dan muon
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

var temp_status_trash = [];
app.get('/', function (req, res) {
   res.sendFile(__dirname + '/home.html');
});
app.get('/update_status_trash', (req, res) => {
   let t = temp_status_trash;
   temp_status_trash = [];
   res.json(t);
});
app.delete('/delete_start_end_from_database', (req, res)=>{
   database.DeleteMarkerStartEnd(function(status, result) {
      res.status(status).json(result);
   });
});
app.put('/add_marker_start_end_to_database', (req, res)=>{
   console.log(req.body);
   database.UpdateMakerStartEnd(req.body, function(status, result) {
      res.status(status).json(result);
   });
});
app.get('/get_marker_start_end_from_database', (req, res)=>{
   // ex data get form database format, remember use await
   database.GetMakerStartEnd(function(status, result) {
      res.status(status).json(result);
   });
});
app.get('/get_marker_from_database', (req, res)=>{
   // ex data get form database format, remember use await
   database.GetMakers(function(status, result) {
      res.status(status).json(result);
   });
});
// status => FULL or EMPTY
app.get('/notify_trash', (req, res)=> {
   let ip = req.query.ip;
   let status = req.query.status;
   if (status !== 'FULL' && status !== 'EMPTY') {
      res.json({"status": "fail", "reason": "status trash invalid"});
      return;
   }
   // check id has database ???
   database.GetSingleMaker({'IP':ip}, function(check_id) {
      if (!check_id['status']){
         res.json(check_id);
         return;
      }
      // check status FULL or EMPTY
      let isExist = temp_status_trash.find(e => (e.ip == ip));
      if (isExist==undefined) {
         let obj = {};
         obj['ip'] = ip;
         obj['status'] = status;
         temp_status_trash.push(obj);
      } else {
         if (isExist.status!=status) {
            temp_status_trash[temp_status_trash.indexOf(isExist)].status = status;
         }
      }
      console.log(temp_status_trash.length);
      res.json(check_id);
   });
});
app.post('/add_marker_to_database', (req, res)=>{
   console.log(req.body);
   database.AddMarker(req.body, function(status, result) {
      res.status(status).json(result);
   });
});
app.put('/edit_marker_from_database', (req, res) => {
   console.log(req.body);
   database.EditMarker(req.body, function(status, result) {
      res.status(status).json(result);
   });
});
app.delete('/delete_marker_to_database', (req, res)=>{
   let ip = req.query.ip;
   if (ip) {
      console.log(ip);
      database.DeleteMarker(ip, function(status, result) {
         res.status(status).json(result);
      });
   } else {
      res.status(406).json([]);
   }
});

app.get('/place_config', (req, res)=> {
   database.GetPlaceConfig(function(status, result) {
      res.status(status).json(result);
   });
});

app.put('/place_config', (req, res)=> {
   database.SetPlaceConfig(req.body, function(status, result) {
      res.status(status).json(result);
   });
});

var server = app.listen(9000, "localhost", function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log("Example app listening at http://%s:%s", host, port)
});