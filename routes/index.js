var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var util = require('util');
var mkdirp = require('mkdirp');
var db = require('../models/db');
var logSchema = require('../models/insertLog');
var logHistorySchema = require('../models/receivedLogHistory');
var paths = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/batchrun', function(req,res,nex){
  logSchema.insertLog(res);
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
            console.log(err);
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
            
            /*if(fs.existsSync("./public/uploadedLog/"+ name+"-"+file.name))
            {
                var stats = fs.statSync("./public/uploadedLog/"+name+"-"+file.name);
                var fileSizeInBytes = stats["size"]
                if(fileSizeHashT[file.name]<=fileSizeInBytes){
                 console.log("file already exists");
                 rmDir("./public/uploadedLog/Temp");
                 return;
                }
            }*/
            var date = new Date().getTime();
        	file.path = "./public/uploadedLog/"+name+"-"+date+"-"+file.name;
          logHistorySchema.insertLogHistory(name,name+"-"+date+"-"+file.name);    
         })

        //Received single file
        .on('file', function(field, file) {
          console.log(field);
           /*db.LogHistory.findOne({uuid:field, fileName:file.name, logInserted:true},function(err,obj){
            if(obj!=null){
              console.log(obj);
              console.log(field);
              console.log("file already exists");
              fs.unlinkSync("./public/uploadedLog/"+field+"-"+file.name);
              rmDir("./public/uploadedLog/Temp");
            }
            else if(obj==null)
            {
              logHistorySchema.insertLogHistory(field,file.name);
            }
           
           });*/
            
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
        });

    form.parse(req,function(err){
        //res.redirect('/');
        console.log('form parse :\n\n');
    });
    res.sendStatus(200);
});

   rmDir = function(dirPath) {
      try { var files = fs.readdirSync(dirPath); }
      catch(e) { return; }
      if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
          var filePath = dirPath + '/' + files[i];
          if (fs.statSync(filePath).isFile())
            fs.unlinkSync(filePath);
          else
            rmDir(filePath);
        }
      //fs.rmdirSync(dirPath);
    };
module.exports = router;
