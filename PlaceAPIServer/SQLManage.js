const TAG = '[SQLManage.js]';
let isReady = true;
const util = require('./Util.js');
const sqlite3 = require('sqlite3');
let db_place = new sqlite3.Database('database/place.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        isReady = false;
        return console.error(err.message);;
    }
    console.log(TAG, 'Database "place.db" opened!');
});

let db_customer = new sqlite3.Database('database/customer.db', (err) => {
    if  (err) {
        isReady = false;
        return console.error(err.message);;
    }
    console.log(TAG, 'Database "customer.db" opened!');
});
function CleanAndExit() {
    // close the database connection
    db_place.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log(TAG, 'Close the database connection.');
    });
    db_customer.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log(TAG, 'Close the database connection.');
    });
    return console.error(TAG, "Error");
}
module.exports.isReady = function() {
    return isReady;
}
module.exports.isValidAccessToken = async function(accessToken) {
    if (!isReady) {
        return false;
    }
    let _promise = new Promise(function(resolve) {
        db_customer.serialize(function() {
            let sql =  `SELECT * FROM CUSTOMER WHERE ACCESSTOKEN='${accessToken}' AND QUOTA!=0;`; // gia m
            db_customer.all(sql, [], function (err, rows) {
                if (err) {
                    console.log(TAG, err);
                    // CleanAndExit();
                    resolve(false);
                }
                else {
                    console.log(rows);
                    if (rows.length) {
                        db_customer.serialize(function() {
                            let _sql = `UPDATE CUSTOMER SET QUOTA=QUOTA-1 WHERE ACCESSTOKEN='${accessToken}';`;
                            db_customer.all(_sql, [], function (err, rows) {
                                if (err) {
                                    console.log(TAG, err);
                                    resolve(false);
                                } else {
                                    resolve(true);
                                }
                            });
                        });
                    } else {
                        resolve(false);
                    }
                }
            });
        });
    });
    return _promise;
}
module.exports.QueryAddress = function(place_name, call_back) {
    if (!isReady) {
        call_back([]);
        return;
    }
    db_place.serialize(function() {
        let _place = util.removeVietnameseTones(place_name);
        let sql =  `SELECT NAME, ADDRESS, LAT, LONG FROM PLACE WHERE QUERY LIKE '${_place}%' OR QUERY LIKE '% ${_place}%' LIMIT 5`;
        db_place.all(sql, [], function (err, rows) {
            if (err) {
                console.log(TAG, err);
                call_back([]);
                // CleanAndExit();
            } else {
                if (rows.length) {
                    call_back(rows);
                } else {
                    call_back([]);
                }
            }
        });
    });
}