var spawn = require('child_process'), 
	shell, 
	platform = process.platform, 
	exec = 'default';
	
var dispatch = {
	win32 : function() {
		handleExec(null, "\nPlease install ImageMagick (http://www.imagemagick.org)\n", null); 
	},
	default : function() {
		shell = spawn.execFile('./imagemagick.sh', handleExec);
	}
}

if (platform in dispatch) {
	exec = platform;
}

dispatch[exec].call();

function handleExec(error, stdOut, stdErr) {
	var exit = 0;
	
	if (stdErr) {
		console.error(stdErr);
	}
	
	if (stdOut) {
		console.log(stdOut);
	}
	
	if (error) {
		exit = error.code;
	}
	
	process.exit(exit);
}