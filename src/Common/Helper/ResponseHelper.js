const ConstantResponseCode = require("../Config/Constants").ResponseCode;

exports.formatResponse = (responseCode, info) => {
    switch (responseCode) {
        case ConstantResponseCode.ACCESS_DENIED:
            return formatErrorResponse(responseCode, "Access denied due to role permission.", info);
            break;

        case ConstantResponseCode.BAD_REQUEST_BODY:
            return formatErrorResponse(responseCode, "The data in request body is not well formed.", info);
            break;

        case ConstantResponseCode.BAD_REQUEST_PARAMETERS:
            return formatErrorResponse(responseCode, "The data in request parameters are not well formed.", info);
            break;

        case ConstantResponseCode.RESOURCE_NOT_FOUND:
            return formatErrorResponse(responseCode, "The resource is not found to action on.", info);
            break;

        case ConstantResponseCode.TIMEOUT:
            return formatErrorResponse(responseCode, "The lambda function timed out.", info);
            break;

        case ConstantResponseCode.UNAUTHORISED:
            return formatErrorResponse(responseCode, "Unauthorised to access the lambda functio.", info);
            break;

        case ConstantResponseCode.SUCCEED_OK:
            return formateSuccessResponse(responseCode, "Request required, processed and returned successfully.", info);
            break;

        case ConstantResponseCode.SUCEED_ACCEPTED:
            return formateSuccessResponse(responseCode, "The request is accepted but still processing.", info);
            break;

        case ConstantResponseCode.SUCCEED_NO_CONTENT:
            return formateSuccessResponse(responseCode, "PUT/POST/DELETE Done but returned no content.", info);
            break;

        case ConstantResponseCode.NOT_IMPLEMENTED:
            return formatErrorResponse(responseCode, "The lambda function is not currently in use.", info);
            break;

        case ConstantResponseCode.SERVICE_REQUEST_FAILURE:
            return formatErrorResponse(responseCode, "Internel service exception.", info);
            break;
    }
}

/**
 * Formate Error Response
 * @param {*} responseCode 
 * @param {*} errorMsg 
 * @param {*} info 
 */

function formatErrorResponse(responseCode, errorMsg, info) {
    return {
        statusCode: responseCode,
        error: errorMsg,
        info: info
    };
}

/**
 * Formate Successs Response
 * @param {*} responseCode 
 * @param {*} msg 
 * @param {*} info 
 */
function formateSuccessResponse(responseCode, msg, info) {
    return {
        statusCode: responseCode,
        message: msg,
        info: info
    };
}