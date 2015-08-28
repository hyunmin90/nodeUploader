var mongoose = require('mongoose');  
var logSchema = new mongoose.Schema({  
  uuid: String,
  fileName:String,
  logDate: String,
  logTime: String,
  logPid: String,
  logTag: String,
  logLV: String,
  logContent: String
});
var logHistorySchema = new mongoose.Schema({
	uuid:String,
	receivedDate:Date,
	fileName:String,
	logInserted:Boolean
});




var Log = mongoose.model('Log', logSchema);
var LogHistory = mongoose.model('LogHistory',logHistorySchema);

mongoose.connect('mongodb://localhost/logger');  

module.exports = {
    log: mongoose.model('Log', logSchema),
    LogHistory: mongoose.model('LogHistory',logHistorySchema)
}

//module.exports = LogHistory;

