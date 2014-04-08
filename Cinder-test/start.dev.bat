:: Run ampm from its repo, assume everything is installed, and watch everything.
CD ..\..\ampm
supervisor ^
	--watch .,..\ampm-test\cinder-test\config.json,..\ampm-test\sharedState.js,restart.json ^
	--ignore .git,node_modules,view,samples,logs,app,content,state.json ^
	--extensions js,json ^
	--no-restart-on error ^
	-- server.js ..\ampm-test\cinder-test\config.json dev.foo.bar
