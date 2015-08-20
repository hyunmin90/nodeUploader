var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var util = require('util');
var mkdirp = require('mkdirp');
var db = require('../models/db');
var logSchema = require('../models/insertLog');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/post', function(req, res) {

  var form = new formidable.IncomingForm();
  var uuid;
  var path = [];
  var fileSizeHashT = new Object();
  form.uploadDir="./public/uploadedLog/Temp"
  form.keepExtensions = true;

  form
        .on('error', function(err) {
            console.log('err');
            throw err;
        })

        .on('field', function(field, value) {
            fileSizeHashT[field]=value;
            //receive form fields here
            //console.log(field,value);
        })

        .on ('fileBegin', function(name, file){
            //console.log(name);
            //console.log("fileBegin");
            //If file already has been uploaded we return, not saving anything in DB.
            
            if(fs.existsSync("./public/uploadedLog/"+ name+file.name))
            {
                var stats = fs.statSync("./public/uploadedLog/"+ name+file.name);
                var fileSizeInBytes = stats["size"]
                if(fileSizeHashT[file.name]<=fileSizeInBytes){
                 console.log("file already exists");
                 return;
                }
            }
        	file.path = "./public/uploadedLog/" + name+file.name;
            
            path.push(file.path);
         })
        //Received single file
        .on('file', function(field, file) {
            uuid=field;
                             
        })
        .on('progress', function(bytesReceived, bytesExpected) {
            //console.log("Byte expected!"+bytesExpected);
            //self.emit('progess', bytesReceived, bytesExpected)
            //console.log('progress');
            //var percent = (bytesReceived / bytesExpected * 100) | 0;
           // process.stdout.write('Uploading: %' + percent + '\r');
        })
        .on('end',function(req,res){
            console.log('form end:\n\n');
            logSchema.insertLog(uuid,path);
        });

    form.parse(req,function(err){
        //res.redirect('/');
        console.log('form parse :\n\n');
    });

});

module.exports = router;
