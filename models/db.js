var mongoose = require('mongoose');  
var logSchema = new mongoose.Schema({  
  uuid: String,
  logDate: String,
  logTime: String,
  logPid: String,
  logTag: String,
  logLV: String,
  logContent: String
});
var Log = mongoose.model('Log', logSchema);
mongoose.model('EntireLog', logSchema);  
mongoose.connect('mongodb://localhost/logger');  

module.exports = Log;