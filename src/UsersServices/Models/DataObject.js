class DataObject {
	LoadFromDbObject(dbDataObject) {
		if (dbDataObject !== null) {
			Object.assign(this, dbDataObject);
		}
	}
}

module.exports = DataObject;
