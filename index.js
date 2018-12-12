var fs = require('fs');
var records = JSON.parse(fs.readFileSync('leads.json', 'utf8'));
var deduplicatedRecords = [];

const checkCollision = (recordElement) => {
	if (deduplicatedRecords.length === 0)
		return false;
	else {
		for (let i = 0; i < deduplicatedRecords.length; i++) {
			if (recordElement._id === deduplicatedRecords[i]._id || recordElement.email === deduplicatedRecords[i].email) {
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

console.log(deduplicate(records.leads).reverse());