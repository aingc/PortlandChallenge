var fs = require('fs');
var records = JSON.parse(fs.readFileSync('leads.json', 'utf8'));
var deduplicatedRecords = [];
var recordsLog = [];

const checkCollision = (recordElement) => {
	if (deduplicatedRecords.length === 0)
		return false;
	else {
		for (let i = 0; i < deduplicatedRecords.length; i++) {
			if (recordElement._id === deduplicatedRecords[i]._id || recordElement.email === deduplicatedRecords[i].email) {
				//console.log('Removed Record: ', recordElement);
				//recordsLog.push(recordElement);
				/*let tempChangeLog = {
					'_id': 'Value from: ' + recordElement._id + ' -> Value to: ' + deduplicatedRecords[i]._id,
					'email': 'Value from: ' + 
					
				};*/
				createChangeLogEntry(recordElement, deduplicatedRecords[i]);
				return true;
			}
		}
		return false;
	}
}

const deduplicate = (recordObjects) => {
	for (let i = recordObjects.length - 1; i >= 0; i--) {
		if (!checkCollision(recordObjects[i])) {
			//add to deduplicatedRecords
			deduplicatedRecords.push(recordObjects[i]);
		}
	}
	return deduplicatedRecords;
}

const createChangeLogEntry = (elementFrom, elementTo) => {
	let tempChangeLog = {
		'_id': 'Value from: ' + elementFrom._id + ' -> Value to: ' + elementTo._id,
		'email': 'Value from: ' + elementFrom.email + ' -> Value to: ' + elementTo.email,
		'firstName': 'Value from: ' + elementFrom.firstName + ' -> Value to: ' + elementTo.firstName,
		'lastName': 'Value from: ' + elementFrom.lastName + ' -> Value to: ' + elementTo.lastName,
		'address': 'Value from: ' + elementFrom.address + ' -> Value to: ' + elementTo.address,
		'entryDate': 'Value from: ' + elementFrom.entryDate + ' -> Value to: ' + elementTo.entryDate,
	};
	recordsLog.push(tempChangeLog);
}


console.log(deduplicate(records.leads).reverse());