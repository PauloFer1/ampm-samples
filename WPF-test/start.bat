WHERE nodemon
IF %ERRORLEVEL% NEQ 0 CALL npm install -g nodemon 
cd ..\..\ampm
nodemon server.js ../ampm-test/WPF-test/config.json