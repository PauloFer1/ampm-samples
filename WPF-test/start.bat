WHERE nodemon
IF %ERRORLEVEL% NEQ 0 CALL npm install -g nodemon 
nodemon -q -e js,json ../../ampm/server.js ../ampm-test/WPF-test/config.json