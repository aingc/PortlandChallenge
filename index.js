var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('leads.json', 'utf8'));
console.log(obj);