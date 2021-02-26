import { LogLevel } from '../Config/Constants';

// First perform bitwise or on process.env.LOG_LEVEL to force convert process.env.LOG_LEVEL to integer.
// Then we convert it back to string and compare with original string to test whether it is integer.
var CurrentLogLevel = (process.env.LOG_LEVEL | 0).toString() === process.env.LOG_LEVEL ? parseInt(process.env.LOG_LEVEL) : LogLevel.Info;

// Define a LogHelper Class for logging
class LogHelper {

    /** Set Log Level
     * Documentation
     * @param {*} level 
     */
    SetLogLevel(level) {
        CurrentLogLevel = level;
    }

    /**
     * 
     * @param {*} sender 
     * @param {*} exception 
     * @param {*} message 
     * @param {*} memberName 
     */
    Exception(sender, exception, message, memberName) {
        this.PersistLog(
            exports.LogLevel.ErrorLevel,
            typeof sender === "string" ?
            sender :
            Object.prototype.toString.call(sender),
            memberName,
            `${message}\nException: ${exception}`
        );
    }

    /**
     * 
     * @param {*} sender 
     * @param {*} message 
     * @param {*} memberName 
     */
    ErrorLevel(sender, message, memberName) {
        this.PersistLog(
            exports.LogLevel.ErrorLevel,
            typeof sender === "string" ?
            sender :
            Object.prototype.toString.call(sender),
            memberName,
            message
        );
    }

    /**
     * 
     * @param {*} sender 
     * @param {*} message 
     * @param {*} memberName 
     */
    Warning(sender, message, memberName) {
        this.PersistLog(
            exports.LogLevel.Warning,
            typeof sender === "string" ?
            sender :
            Object.prototype.toString.call(sender),
            memberName,
            message
        );
    }

    /**
     * 
     * @param {*} sender 
     * @param {*} message 
     * @param {*} memberName 
     */
    Info(sender, message, memberName) {
        this.PersistLog(
            exports.LogLevel.Info,
            typeof sender === "string" ?
            sender :
            Object.prototype.toString.call(sender),
            memberName,
            message
        );
    }

    /**
     * 
     * @param {*} sender 
     * @param {*} message 
     * @param {*} memberName 
     */
    Debug(sender, message, memberName) {
        this.PersistLog(
            exports.LogLevel.Debug,
            typeof sender === "string" ?
            sender :
            Object.prototype.toString.call(sender),
            memberName,
            message
        );
    }

    /**
     * 
     * @param {*} sender 
     * @param {*} message 
     * @param {*} memberName 
     */
    Verbose(sender, message, memberName) {
        this.PersistLog(
            exports.LogLevel.Verbose,
            typeof sender === "string" ?
            sender :
            Object.prototype.toString.call(sender),
            memberName,
            message
        );
    }

    /**
     * 
     * @param {*} sender 
     * @param {*} message 
     * @param {*} memberName 
     */
    TestLevel(sender, message, memberName) {
        this.PersistLog(
            exports.LogLevel.TestLevel,
            typeof sender === "string" ?
            sender :
            Object.prototype.toString.call(sender),
            memberName,
            `${message}`
        );
    }

    /**
     * 
     * @param {*} logLevel 
     * @param {*} sender 
     * @param {*} method 
     * @param {*} message 
     */
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

// exports.LogLevel = LogLevel;
exports.LogHelper = LogHelper;