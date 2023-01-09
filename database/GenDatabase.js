// Requiring the module
const reader = require('xlsx')
const sqlite3 = require('sqlite3');
const util = require('../PlaceAPIServer/Util.js');
const LAST_INSERT = {'SCHOOLS':40, 'HOSPITAL':0};
module.exports.GenerateDatabase = function(call_back) {
	let db = new sqlite3.Database('./database/Place.db');
	// Reading our test file
	const file = reader.readFile('./database/map.xlsx')
	const sheets = file.SheetNames; // số lượng sheet
	console.log(sheets);
	let result = [];
	for(let i = 0; i < sheets.length; i++)
	{
		const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]])
		temp.forEach((res) => {
			if (parseInt(res.STT) > LAST_INSERT[sheets[i]] && res.Name && res.Address && res.LatLong) { // If after insert=> check condition res.STT > old
				let LatLongs = res.LatLong.split(',');
				let query = util.removeVietnameseTones(res.Name) + ' ' + util.removeVietnameseTones(res.Address);
				result.push(query);
				let sql = `INSERT INTO PLACE(ADDRESS, NAME, LAT, LONG, QUERY) VALUES (?, ?, ?, ?, ?)`;
				db.run(sql, [res.Address, res.Name, LatLongs[0].trim(), LatLongs[1].trim(), query],function(err) {
					if (err) {
						return console.error(err.message);
					}
					// console.log(`Rows inserted ${this.changes}`);		
				});
			}
		});
	}
	db.close();
	call_back(result);
};
