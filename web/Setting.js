function ApplySettingUrlPlaceServer() {
    let url = $('#f_setting_url_place_server').val();
    fetch(`${g_url_server}place_config`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'URL': url})
    }).then(res => {
        if (res.status!=200) {
            showNoti('Apply URL Place Server Fail');
        } else {
            showNoti('Apply URL Place Server Success');
            g_url_place_config = url;
        }
    });    
}

function ApplySettingAccessTokenPlaceServer() {
    let accesstoken = $('#f_setting_accesstoken_place_server').val();
    fetch(`${g_url_server}place_config`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'ACCESSTOKEN': accesstoken})
    }).then(res => {
        if (res.status!=200) {
            showNoti('Apply AccessToken Place Server Fail');
        } else {
            showNoti('Apply AccessToken Place Server Success');
            g_accessToken = accesstoken;
        }
    });
}