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



exports.insertLogHistory =  function(uuid,filename)
{
	Log.LogHistory.findOne({
		uuid:uuid,
		fileName:filename,
		logInserted:false
	}, function(err,obj) { 
		if(obj==null){
		var log = Log.LogHistory({
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
	});

}
exports.findOneHistory = function(name)
{
   Log.LogHistory.findOne({fileName:name},function(err,obj){
    if(obj!=null)
      return true;
   });
}