const TAG = '[SQLManage.js]';
const sqlite3 = require('sqlite3');
let isReady = true;
let db_trash = new sqlite3.Database('database/Data.db', (err) => {
    if (err) {
        isReady = false;
        return console.error(err.message);;
    }
    console.log(TAG, 'Database "Data.db" opened!');
});
module.exports.GetMakerStartEnd = function(call_back) {
    if (!isReady) {
        call_back(500, []);
    } else {
        db_trash.serialize(function() {
            let sql =  `SELECT * FROM START_END`;
            db_trash.all(sql, [], function (err, rows) {
                if (err) {
                    console.log(TAG, err);
                    call_back(500, []);
                } else {
                    if (rows.length) {
                        call_back(200, rows);
                    } else {
                        call_back(200, []);
                    }
                }
            });
        });
    }
}
module.exports.UpdateMakerStartEnd = function(data, call_back) {
    if (!isReady) {
        call_back(500, []);
    } else {
        let is_ok = true;
        db_trash.serialize(function() {
            for (let i = 0; i < data.length; i++) {
                let sql =  `UPDATE START_END SET LAT=${data[i].LAT}, LNG=${data[i].LNG} WHERE TYPE='${data[i].TYPE}';`;
                db_trash.all(sql, [], function (err, rows) {
                    if (err) {
                        is_ok = false;
                        console.log(TAG, err);
                    }
                });
            }
            if (is_ok)
                call_back(200, {'status':'success'});
            else 
                call_back(500, {'status':'error'});
        });
    }
}
module.exports.DeleteMarkerStartEnd = function(call_back) {
    if (!isReady) {
        call_back(500, []);
    } else {
        db_trash.serialize(function() {
            let sql =  `UPDATE START_END SET LAT='~%fake_NULL%~', LNG='~%fake_NULL%~';`;
            db_trash.all(sql, [], function (err, rows) {
                if (err) {
                    console.log(TAG, err);
                    call_back(500, {'status':'error'});
                } else {
                    call_back(200, {'status':'success'});
                }
            });
        });
    }
}
module.exports.GetMakers = function(call_back) {
    if (!isReady) {
        call_back(500, []);
    } else {
        db_trash.serialize(function() {
            let sql =  `SELECT * FROM TRASH`;
            db_trash.all(sql, [], function (err, rows) {
                if (err) {
                    console.log(TAG, err);
                    call_back(500, []);
                } else {
                    if (rows.length) {
                        call_back(200, rows);
                    } else {
                        call_back(200, []);
                    }
                }
            });
        });
    }
}
module.exports.GetSingleMaker = function(data, call_back) {
    if (!isReady) {
        call_back({'status': false, 'reason':'server side error'});
    } else {
        db_trash.serialize(function() {
            let sql =  `SELECT ID FROM TRASH WHERE ID=${data.ID}`;
            db_trash.all(sql, [], function (err, rows) {
                if (err) {
                    console.log(TAG, err);
                    call_back({'status': false, 'reason':'server side error'});
                } else {
                    if (rows.length) {
                        call_back({'status': true, 'data': rows});
                    } else {
                        call_back({'status': false, 'reason': `notfound marker ID=${data.ID}`});
                    }
                }
            });
        });
    }
}
module.exports.AddMarker = function(data, call_back) {
    if (!data.LAT || !data.LNG) {
        call_back(412, {'status':'lat lng invalid'});
        return;
    }
    if (!data.ID) data.ID = 'NULL';
    if (!data.NAME) data.NAME= '~%fake_NULL%~';
    if (!isReady) {
        call_back(500, {'status':'error'});
    } else {
        db_trash.serialize(function() {
            let sql =  `INSERT INTO TRASH VALUES (${data.ID}, ${data.LAT}, ${data.LNG}, '${data.NAME}');`;
            db_trash.all(sql, [], function (err, rows) {
                if (err) {
                    console.log(TAG, err);
                    call_back(500, {'status':'error'});
                } else {
                    call_back(200, {'status':'success'});
                }
            });
        });
    }
}
module.exports.EditMarker = function(data, call_back) {
    if (!data.LAT || !data.LNG) {
        call_back(412, {'status':'lat lng invalid'});
        return;
    }
    if (!data.ID) data.ID = 'NULL';
    if (!data.NAME) data.NAME= '~%fake_NULL%~';
    if (!isReady) {
        call_back(500, {'status':'error'});
    } else {
        db_trash.serialize(function() {
            let sql =  `UPDATE TRASH SET ID=${data.ID}, LAT=${data.LAT}, LNG=${data.LNG}, NAME='${data.NAME}' WHERE ID=${data._ID};`;
            db_trash.all(sql, [], function (err, rows) {
                if (err) {
                    console.log(TAG, err);
                    call_back(500, {'status':'error'});
                } else {
                    call_back(200, {'status':'success'});
                }
            });
        });
    }
}
module.exports.DeleteMarker = function(id, call_back) {
    console.log(id);
    if (!isReady) {
        call_back(500, {'status':'error'});
    } else {
        db_trash.serialize(function() {
            let sql =  `DELETE FROM TRASH WHERE ID=${id};`;
            db_trash.all(sql, [], function (err, rows) {
                if (err) {
                    console.log(TAG, err);
                    call_back(500, {'status':'error'});
                } else {
                    call_back(200, {'status':'success'});
                }
            });
        });
    }
}
module.exports.GetPlaceConfig = function(call_back) {
    if (!isReady) {
        call_back(500, {'status':'error'});
    } else {
        db_trash.serialize(function() {
            let sql =  `SELECT * FROM PLACE_CONFIG;`;
            db_trash.all(sql, [], function (err, rows) {
                if (err) {
                    console.log(TAG, err);
                    call_back(500, {'status':'error'});
                } else {
                    if (rows.length) {
                        call_back(200, rows);
                    } else {
                        call_back(200, []);
                    }
                }
            });
        });
    }
}
module.exports.SetPlaceConfig = function(data, call_back) {
    if (!data.URL && !data.ACCESSTOKEN) {
        call_back(412, {'status':'data config invalid'});
        return;
    }
    if (!isReady) {
        call_back(500, {'status':'error'});
    } else {
        db_trash.serialize(function() {
            let target = (data.URL) ? 'URL' : 'ACCESSTOKEN';
            let val = (data.URL) ? data.URL : data.ACCESSTOKEN;
            let sql =  `UPDATE PLACE_CONFIG SET ${target}='${val}';`;
            db_trash.all(sql, [], function (err, rows) {
                if (err) {
                    console.log(TAG, err);
                    call_back(500, {'status':'error'});
                } else {
                    call_back(200, {'status':'success'});
                }
            });
        });
    }
}