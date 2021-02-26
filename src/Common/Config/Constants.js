// Export empty GUID
exports.EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

// Define User Service Index
exports.UserServiceIndex = {
    GSI1NAME: "Session-index",
    GSI1KEYS: {
        PK: "Session"
    },
    GSI2NAME: "Email-index",
    GSI2KEYS: {
        PK: "Email"
    }
};

// Define User Event Code
exports.UserEventCode = {
    CREATE: "CREATE",
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
    ENROLL: "ENROLL",
    UNENROLL: "UNENROLL",
    CHANGEPASSWORD: "CHGPASS",
    UPDATEPROFILE: "UPDPRO",
    SUBSCRIBE: "SUB",
    UNSUBSCRIBE: "UNSUB",
    CHANGESUBSCRIBTION: "CHGSUB",
    ACTIVATE: "ACT",
    DEACTIVATE: "DEACT"
};

// Define Responsde Code
exports.ResponseCode = {
    "UNAUTHORISED": "401",
    "RESOURCE_NOT_FOUND": "404",
    "TIMEOUT": "504",
    "BAD_REQUEST_BODY": "402",
    "BAD_REQUEST_PARAMETERS": "405",
    "ACCESS_DENIED": "403",
    "SUCCEED_NO_CONTENT": "204",
    "SUCCEED_OK": "200",
    "SUCEED_ACCEPTED": "202",
    "NOT_IMPLEMENTED": "501",
    "SERVICE_REQUEST_FAILURE": "500"

}

//  Define LogLevel
exports.LogLevel = {
    TestLevel: 0,
    ErrorLevel: 1,
    Warning: 2,
    Info: 3,
    Debug: 4,
    Verbose: 5
};