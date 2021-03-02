const LogLevel = {
	TestLevel: 0,
	ErrorLevel: 1,
	Warning: 2,
	Info: 3,
	Debug: 4,
	Verbose: 5
};

// First perform bitwise or on process.env.LOG_LEVEL to force convert process.env.LOG_LEVEL to integer.
// Then we convert it back to string and compare with original string to test whether it is integer.
var CurrentLogLevel = (process.env.LOG_LEVEL|0).toString() === process.env.LOG_LEVEL ? parseInt(process.env.LOG_LEVEL): LogLevel.Info;

class LogHelper {
	SetLogLevel(level) {
		CurrentLogLevel = level;
	}

	Exception(sender, exception, message, memberName) {
		this.PersistLog(
			exports.LogLevel.ErrorLevel,
			typeof sender === "string"
				? sender
				: Object.prototype.toString.call(sender),
			memberName,
			`${message}\nException: ${exception}`
		);
	}

	ErrorLevel(sender, message, memberName) {
		this.PersistLog(
			exports.LogLevel.ErrorLevel,
			typeof sender === "string"
				? sender
				: Object.prototype.toString.call(sender),
			memberName,
			message
		);
	}

	Warning(sender, message, memberName) {
		this.PersistLog(
			exports.LogLevel.Warning,
			typeof sender === "string"
				? sender
				: Object.prototype.toString.call(sender),
			memberName,
			message
		);
	}

	Info(sender, message, memberName) {
		this.PersistLog(
			exports.LogLevel.Info,
			typeof sender === "string"
				? sender
				: Object.prototype.toString.call(sender),
			memberName,
			message
		);
	}

	Debug(sender, message, memberName) {
		this.PersistLog(
			exports.LogLevel.Debug,
			typeof sender === "string"
				? sender
				: Object.prototype.toString.call(sender),
			memberName,
			message
		);
	}

	Verbose(sender, message, memberName) {
		this.PersistLog(
			exports.LogLevel.Verbose,
			typeof sender === "string"
				? sender
				: Object.prototype.toString.call(sender),
			memberName,
			message
		);
	}

	TestLevel(sender, message, memberName) {
		this.PersistLog(
			exports.LogLevel.TestLevel,
			typeof sender === "string"
				? sender
				: Object.prototype.toString.call(sender),
			memberName,
			`${message}`
		);
	}

	PersistLog(logLevel, sender, method, message) {
		let log = Object.keys(exports.LogLevel).find(
			key => exports.LogLevel[key] === logLevel
		);
		var logEntry = `${new Date().toISOString()} [${log}] [${sender}.${method}] ${message}\n`;
		if (logLevel <= CurrentLogLevel) {
			console.log(logEntry);
		}
	}
}

exports.LogLevel = LogLevel;
exports.LogHelper = LogHelper;
