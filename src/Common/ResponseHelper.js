const ConstantResponseCode = require("./Constants").ResponseCode;

exports.formatResponse = (responseCode, info) => {
    switch (responseCode) {
        case ConstantResponseCode.ACCESS_DENIED:
            return formatErrorResponse(responseCode, "Access denied due to role permission.", info);
        case ConstantResponseCode.BAD_REQUEST_BODY:
            return formatErrorResponse(responseCode, "The data in request body is not well formed.", info);
        case ConstantResponseCode.BAD_REQUEST_PARAMETERS:
            return formatErrorResponse(responseCode, "The data in request parameters are not well formed.", info);
        case ConstantResponseCode.RESOURCE_NOT_FOUND:
            return formatErrorResponse(responseCode, "The resource is not found to action on.", info);
        case ConstantResponseCode.TIMEOUT:
            return formatErrorResponse(responseCode, "The lambda function timed out.", info);
        case ConstantResponseCode.UNAUTHORISED:
            return formatErrorResponse(responseCode, "Unauthorised to access the lambda functio.", info);
        case ConstantResponseCode.SUCCEED_OK:
            return formateSuccessResponse(responseCode, "Request required, processed and returned successfully.", info);
        case ConstantResponseCode.SUCEED_ACCEPTED:
            return formateSuccessResponse(responseCode, "The request is accepted but still processing.", info);
        case ConstantResponseCode.SUCCEED_NO_CONTENT:
            return formateSuccessResponse(responseCode, "PUT/POST/DELETE Done but returned no content.", info);
        case ConstantResponseCode.NOT_IMPLEMENTED:
            return formatErrorResponse(responseCode, "The lambda function is not currently in use.", info);
        case ConstantResponseCode.SERVICE_REQUEST_FAILURE:
            return formatErrorResponse(responseCode, "Internel service exception.", info);
    }
}

function formatErrorResponse(responseCode, errorMsg, info) {
    return {
        statusCode: responseCode,
        error: errorMsg,
        info: info
    };
}

function formateSuccessResponse(responseCode,msg,info){
    return {
        statusCode: responseCode,
        message: msg,
        info: info
    };
}
