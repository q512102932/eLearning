const UserRepository = require("./Repository/UserRepository");
const Constants = require("../Common/Constants");
const LogHelper = require("../Common/LogHelper");
const {
    formatResponse
} = require("../Common/ResponseHelper");
const {
    v4: uuidv4
} = require('uuid');
const Log = new LogHelper.LogHelper();

exports.CreateUserHandler = async (event, context) => {
    Log.Verbose(
        "CreateUser",
        `Creating user please wait. 
        Event: ${JSON.stringify(event)}`,
        `CreateUserHandler()`
    );
 
    let result;
    let userRepository = new UserRepository();
    let userId;
    let user={};
    //Validate user Info
    if (!event.body || typeof event.body === undefined || event.body === null) {
        return formatResponse(Constants.ResponseCode.BAD_REQUEST_BODY, "User information is required for creating a user!");
    }
    //TODO Validate user Info e.g. if email address is valid



    
    //Validate Duplication
    let emailDuplicateResult = await userRepository.getUserByEmail(event.body.email);
    Log.Verbose(
        "CreateUser",
        `emailDuplicateResult: 
        ${JSON.stringify(emailDuplicateResult)}`,
        `CreateUserHandler()`
    );

    if (typeof emailDuplicateResult.error === undefined) {
        return formatResponse(Constants.ResponseCode.BAD_REQUEST_BODY, "Duplicated User Email.");
    }
    //TODO validate username duplication 

    if (typeof event.session !== undefined) {
        //get user id from session
        Log.Info(
            "CreateUser",
            `Getting user id for session user`,
            `CreateUserHandler()`
        );
        userId = await userRepository.getUserBySession(event.session).PK;
        Log.Info(
            "CreateUser",
            `UserId for session user is ${userId}`,
            `CreateUserHandler()`
        );
    }

    //create user
    user.PK = uuidv4(); //generate a guid
    user.Username=event.body.username;
    user.Password=event.body.password;
    user.Email=event.body.email;
    user.Phone=event.body.profile.phone;
    user.Gender=event.body.profile.gender;
    user["Skill Sets"]=event.body.profile.skillSets;
    user["Interest Fields"]=event.body.profile.interestFields;
    user["Career Level"]=event.body.profile.careerLevel;
    user["Programming Level"]= event.body.profile.programmingLevel;
    user.Deactivated=false;
    user.Version = 1;
    user.EventCode = Constants.UserEventCode.CREATE;
    user.EventTimestamp = new Date().toUTCString();
    result = await userRepository.createUser(user, userId);
    if (!result.error || typeof result.error === undefined) {
        return formatResponse(Constants.ResponseCode.SUCCEED_OK, "User Created Successfully!");
    }
    return result;
}