var e = {
	isWin : false,
	mv : 'mv',
};

if (process.platform === 'win32') {
	e.isWin = true;
	e.mv = 'move';
}

exports.environment = e;