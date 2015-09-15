# nodeUploader

####Use brew install

brew install mongodb

####Use forever npm module to keep node running
sudo npm install forever -g

####Use npm to install dependencies

npm install

####Run

./bin/www


####What this is about? 
NodeJS + MongoDB server that parse the ADB logfile from android devices and insert LOG based on their type, contents and more. 

This will dramatically help efficiency with QA engineers archieving logs from QA devices. 
It will also help developers to look up errors that occured previously.
This server requires your device to send log files to the server.

Within your android app

        Request request = new Request.Builder()
                .url("http://10.70.14.90:3000/post/")
                .post(requestBody)
                .build();

This is Example POST request being made with the logs attached.(Server can handle multiple devices sending multiple log at the same time) 

#### How inserting log is done

After log is received, server arhceive log in a file at upLoadedLog/archeive folder 

After all the logs have been received, make a batch job that runs at certain time. 

Once you make GET request for http://localhost/batchrun , server will insert all the log in order of they were received.

#### Example of log

"2015-08-27 00:12:28(pid=5705,tid=1) : Legy.heartbeat (D) : don't use client ping"
This is straight from the log file. My server will save DATES, PID, Tid, Process name, Log Type(D for debugging)
, and content of this log. This will be acheived through log parsing logic implemented.


Take a look at https://github.com/hyunmin90/androidLineLogCollector for Android app t
