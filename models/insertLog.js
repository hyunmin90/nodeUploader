var mongoose = require('mongoose');  
var Log = require('./db');
var fs = require('fs');
var LineByLineReader = require('line-by-line');
var async = require('async');
var isPrevious= false;
var globalArray =[];
var counter=0;
var syncLock = false;
var ended = true;
var scheduler;
var task = [];

exports.insertLog =  function(res){
  
  //if(uuid==null||path==null)
    //return;
    fs.readdir("./public/uploadedLog/", function (err, files){ 
        task=files;
        task.splice(0,1);
        task.splice(-1,1);
        console.log(task);
        testRecursive(task);
        res.sendStatus(200);
        res.end();
    });
      
   
    //testRecursive(task);
    //console.log(path[i]);
    

    /*async.each(path,function(file,callback){
      var lr = new LineByLineReader(file);

      lr.on('error', function (err) {
          // 'err' contains error object
      });

      lr.on('line', function (line) {
        console.log(line);
          // 'line' contains the current line without the trailing newline character.
      });

      lr.on('end', function () {
        console.log(file);
        console.log(counter);
        counter++;
        callback();
          // All lines are read, file is closed now.
      });

    },function(err){
      if(err){console.log(err);}
      else{
       // callback();
      }
    });

    /*
    var lr = new LineByLineReader(path[i]);
    lr.on('error', function (err) {
      // 'err' contains error object
    });

    lr.on('line', function (line) {

      var stringArray = line.split(" ");
      // pause emitting of lines...
      lr.pause();
      if(stringArray[0].indexOf("2015-08")>-1&&isPrevious==true)
      {
        console.log(globalArray.slice(5).toString());
       /* var log = Log({
          uuid: uuid,
          logDate: globalArray[0],
          logTime: globalArray[1],
          logTag: globalArray[3],
          logLV: globalArray[4],
          logContent: globalArray.slice(5).toString()
        });

        log.save(function(err){
          if (err) throw err;
          console.log(log);
        });*/
    /*    isPrevious=false;
      }
      if(stringArray[0].indexOf("2015-08")>-1&&isPrevious==false)
      {
        globalArray=stringArray;
        isPrevious=true;
      }
      if((stringArray[0].indexOf("2015-08")<0))
      {
        globalArray.push("\n"+line);
      }
      
      setTimeout(function () {

          // ...and continue emitting lines.
          lr.resume();
      }, 100);
    });

    lr.on('end', function () {
      console.log("done");
      // All lines are read, file is closed now.
    });
  */
  
  
}

exports.test = function(){
  console.log("hi");

}

var testRecursive = function(path)
{
  if(counter>path.length || path[counter]==null)
  {
    counter = 0;
    return;
  }
  var tempArray= path;
  //Log.LogHistory.findOne({fileName:(tempArray[counter].split("-")).slice(1).join("-"),logInserted:true}, function(err,obj) { 
   // if(obj!=null){
    //  console.log(obj);
     // return;
    //}
  //});
  
  /*if(syncLock==true){
    while(ended==false)
    {
      console.log("waiting");
    }
  }*/
  
  var uuid = (path[counter].split("-"))[0];

  //LogHistory.findOne({uuid:uuid,fileName: path[counter],logInserted:false}, function(err,obj) { console.log(obj); });
  

  lr = new LineByLineReader("./public/uploadedLog/"+path[counter]);
  
  lr.on('error', function (err) {
      // 'err' contains error object
  });

  lr.on('line', function (line) {

    var stringArray = line.split(" ");
      if(stringArray[0].indexOf("2015-08")>-1&&isPrevious==true)
      {
         var dateAndPid = globalArray[1].split("(");
         var pid = (dateAndPid[1].split(","))[0].split("=");

             var log = Log.log({
                uuid: uuid,
                fileName:path[counter],
                logDate: globalArray[0],
                logTime: dateAndPid[0],
                logPid: pid[1],
                logTag: globalArray[3],
                logLV: globalArray[4],
                logContent: globalArray.slice(5).join(" ")
              });
              log.save(function(err){
                if (err) throw err;
                console.log(log);
              });

         isPrevious=false;
      }
      if(stringArray[0].indexOf("2015-08")>-1&&isPrevious==false)
      {
        globalArray=stringArray;
        isPrevious=true;
      }
      if((stringArray[0].indexOf("2015-08")<0))
      {
        globalArray.push("\n"+line);
      }
  });

  lr.on('end', function () {
    if(counter==path.length)
    {
      console.log("SAME"+counter+path.length);
    }
    var conditions = {uuid:uuid, fileName:path[counter]}
    ,update = { logInserted:true}
    ,options = { };

    Log.LogHistory.update(conditions, update, options, callback);
  
    function callback (err, numAffected) {
      console.log(numAffected);
    }

    var source = fs.createReadStream("./public/uploadedLog/"+path[counter]);
    var dest = fs.createWriteStream("./public/uploadedLog/archive/"+path[counter]);
    source.pipe(dest);
    source.on('end', function() { /* copied */ });
    source.on('error', function(err) { /* error */ });
    fs.unlinkSync("./public/uploadedLog/"+path[counter]);
    counter++;

    testRecursive(path);
   
      // All lines are read, file is closed now.
  });
}