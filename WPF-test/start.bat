WHERE nodemon
IF %ERRORLEVEL% NEQ 0 CALL npm install -g nodemon 

cd ../../ampm
nodemon -q -e js,json server.js ../ampm-test/WPF-test/config.json