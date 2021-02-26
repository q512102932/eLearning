// Class DataObject: Base Class for other models
class DataObject {

    LoadFromDbObject(dbDataObject) {
        if (dbDataObject !== null) {
            Object.assign(this, dbDataObject);
        }
    }

}

module.exports = DataObject;