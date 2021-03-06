const DataObject = require("./DataObject");

class User extends DataObject {
    constructor() {
        super();
        this.profile = {};
    }

    PushDbObjectRow(dbObjectRow) {
        //TODO
        this.pk = dbObjectRow.pk;
        this.username = dbObjectRow.username;
        this.email = dbObjectRow.email;
        this.profile = {
            phone: dbObjectRow.phone,
            gender: dbObjectRow.gender,
            skillSets: dbObjectRow.skillSets,
            interestFields: dbObjectRow.interestFields,
            careerLevel: dbObjectRow.careerLevel,
            programmingLevel: dbObjectRow.programmingLevel,
            enrolledCourses: dbObjectRow.enrolledCourses,
        };
        this.role = dbObjectRow.role;
        this.premium = dbObjectRow.premium;
        this.deactivated = dbObjectRow.deactivated;
        this.session = dbObjectRow.session;
        this.version = dbObjectRow.version;
        this.lastLoginTimestamp = dbObjectRow.lastLoginTimestamp;
    }
}

module.exports = User;