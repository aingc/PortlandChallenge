var fs = require('fs');
var records = JSON.parse(fs.readFileSync('leads.json', 'utf8'));
var recordsLog = [];

const checkCollision = (deduplicates, recordElement) => {
	if (deduplicates.length === 0)
		return false;
	else {
		for (let i = 0; i < deduplicates.length; i++) {
			if (recordElement._id === deduplicates[i]._id || recordElement.email === deduplicates[i].email) {
				createChangeLogEntry(recordElement, deduplicates[i]);
				return true;
			}
		}
		return false;
	}
}

const deduplicate = (recordObjects) => {
	let deduplicatedRecords = [];
	for (let i = recordObjects.length - 1; i >= 0; i--) {
		if (!checkCollision(deduplicatedRecords, recordObjects[i])) {
			//add to deduplicatedRecords
			deduplicatedRecords.push(recordObjects[i]);
		}
	}
	return deduplicatedRecords;
}

const createChangeLogEntry = (elementFrom, elementTo) => {
	let tempChangeLog = {
		'_id': elementFrom._id,
		'email': elementFrom.email,
		'firstName': elementFrom.firstName,
		'lastName': elementFrom.lastName,
		'address': elementFrom.address,
		'entryDate': elementFrom.entryDate
	};
	
	if (elementFrom._id !== elementTo._id) {
		tempChangeLog._id = 'Value from: ' + elementFrom._id + ' -> Value to: ' + elementTo._id
	}
	if (elementFrom.email !== elementTo.email) {
		tempChangeLog.email = 'Value from: ' + elementFrom.email + ' -> Value to: ' + elementTo.email
	}
	if (elementFrom.firstName !== elementTo.firstName) {
		tempChangeLog.firstName = 'Value from: ' + elementFrom.firstName + ' -> Value to: ' + elementTo.firstName
	}
	if (elementFrom.lastName !== elementTo.lastName) {
		tempChangeLog.lastName = 'Value from: ' + elementFrom.lastName + ' -> Value to: ' + elementTo.lastName
	}
	if (elementFrom.address !== elementTo.address) {
		tempChangeLog.address = 'Value from: ' + elementFrom.address + ' -> Value to: ' + elementTo.address
	}
	if (elementFrom.entryDate !== elementTo.entryDate) {
		tempChangeLog.entryDate = 'Value from: ' + elementFrom.entryDate + ' -> Value to: ' + elementTo.entryDate
	}
	
	recordsLog.push(tempChangeLog);
}

const displayChangeLog = () => {
	console.log('*****Change Log*****\n');
	console.log(recordsLog.reverse());
	console.log('\nNew reconciled json has been written to current directory');
}
//console.log(deduplicate(records.leads).reverse());
let reconciledLeads = {
	'leads': deduplicate(records.leads).reverse()
};

let newJSON = JSON.stringify(reconciledLeads);
fs.writeFile('reconciledLeads.json', newJSON, 'utf8', displayChangeLog);