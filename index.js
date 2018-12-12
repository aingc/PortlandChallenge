var fs = require('fs');
var path = require('path');

//Check collision in deduplicates array and if there is for the id/email
//Return false if array length is 0
//Return true if there is a collision
//Return false if there was no collision found
const checkCollision = (log, deduplicates, recordElement) => {
	if (deduplicates.length === 0)
		return false;
	else {
		for (let i = 0; i < deduplicates.length; i++) {
			if (recordElement._id === deduplicates[i]._id || recordElement.email === deduplicates[i].email) {
				createChangeLogEntry(log, recordElement, deduplicates[i]);
				return true;
			}
		}
		return false;
	}
}

/*
*	Deduplicate a given json array of leads by stepping through it backwards to guarantee latest
*	entries and only check collisions with _ids and emails
*/
const deduplicate = (log, recordObjects) => {
	let deduplicatedRecords = [];
	for (let i = recordObjects.length - 1; i >= 0; i--) {
		if (!checkCollision(log, deduplicatedRecords, recordObjects[i])) {
			deduplicatedRecords.push(recordObjects[i]);
		}
	}
	return deduplicatedRecords;
}

const createChangeLogEntry = (log, elementFrom, elementTo) => {
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
	
	log.push(tempChangeLog);
}

const displayChangeLog = (log, fileName) => {
	let newLog = log.reverse();
	console.log('*****Change Log*****\n');
	console.log(newLog);
	console.log('\nNew reconciled json has been written to current directory with filename:', 'RECONCILED_' + fileName);
	fs.writeFile('changelog.txt', JSON.stringify(newLog), 'utf8', () => console.log('\nChange log also written to current directory with filename: changelog.txt'));
	//console.log('\nChange log also written to current directory with filename: changelog.txt');
}
//console.log(deduplicate(records.leads).reverse());

//Check if user entered in less than 3 arguments in command line
if (process.argv.length < 3) {
	console.log('Usage: \"node', process.argv[1], '_CURRENT DIRECTORY JSON FILE_\"');
	process.exit(1);
}

//Read 3rd argument in command line
let fileToRead = process.argv[2];

//Error check for .json file
//Else read .json file, deduplicate, write new
if (path.extname(fileToRead) !== '.json') {
	console.log('Please use a .json file');
} else {
	var records = JSON.parse(fs.readFileSync(fileToRead, 'utf8'));
	var recordsLog = [];

	let reconciledLeads = {
		'leads': deduplicate(recordsLog, records.leads).reverse()
	};

	let newJSON = JSON.stringify(reconciledLeads);
	fs.writeFile('RECONCILED_' + fileToRead, newJSON, 'utf8', () => displayChangeLog(recordsLog, fileToRead));
}