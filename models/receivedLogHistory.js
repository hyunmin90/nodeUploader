var mongoose = require('mongoose');  
var LogHistory = require('./db');
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



exports.insertLogHistory =  function(uuid,filename)
{
	var log = LogHistory({
		uuid:uuid,
	    receivedDate:Date.now(),
		fileName:filename,
		logInserted:false
     });
	log.save(function(err){
          if (err) throw err;
          console.log(log);
     });

}