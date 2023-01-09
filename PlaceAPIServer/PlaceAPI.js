const TAG = '[PlaceAPI.js]';
const database = require('./SQLManage.js');

module.exports.FindPlace = async function(address, accessToken, call_back) {
    console.log(TAG, `Find: ${address}, AccessToken: ${accessToken}`);
    if ((database.isReady()) && (await database.isValidAccessToken(accessToken))) {
        database.QueryAddress(address, call_back);
    } else {
        console.log(TAG, "database init fail or quota limit");
        call_back({'error': 'database init fail or quota limit'}, 400);
    }
};