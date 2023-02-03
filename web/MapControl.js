var AutoComplete = (function() {
    function Event_t() {
        this.callbacks=[];
    }
    Event_t.prototype.registerCallback = function(call_back) {
        this.callbacks.push(call_back);
    }
    Event_t.prototype.unregisterCallback = function() {
        this.callbacks.length = 0;
    }
    Event_t.prototype.dispatchEvent_t = function() {
        this.callbacks.forEach(function(call_back) {
            call_back();
        });
    }
    function AutoComplete(id_input) {
        arrayItemData = [];
        autocomplete__events={};
        autocomplete__data={};
        last_result = [];
        let element = $(`#${id_input}`);
        let valid = (element.is('input') && element.attr('type')=='text')? true : false;
        if (valid)
        {
            currentFocus = -1;
            //Setup
            element.addClass('form-control form-control-sm shadow-sm');
            element.attr("autocomplete", "off");
            element.attr("name", "place");
            element.prop("autofocus", true);
            element.attr("placeholder", "Enter place...");
            let root = element.parent();
            let width_element = element.outerWidth(true);
            //Adjust
            let list = $(`<ul class="list-group list-group-flush shadow-sm" style="position: absolute; width:${width_element}px; z-index:99;"></ul>`);
            root.append(list);
            //Set Listener Event
            set_set_listener_event_window_resize(element, list);
            set_listener_event_click(element, list);
            set_listener_event_keypress_arrow(element, list);
            set_listener_event_fill(element, list);
        } else {
            console.error('Invalid require:', "Valid when tag input and type='text'");
        }
    }
    function remove_item_from_list(list) {
        currentFocus = -1;
        $('li[place_find__index]').off('click');
        arrayItemData.length = 0;
        autocomplete__data.length = 0;
        list.empty();
    }
    function set_listener_event_list_item(element, list) {
        if (list.children().length) {
            $('li[place_find__index]').on('click', function() {
                autocomplete__data = arrayItemData[parseInt($(this).attr('place_find__index'))];
                if (autocomplete__events.place_changed) {
                    element.val(arrayItemData[currentFocus].NAME);
                    autocomplete__events['place_changed'].dispatchEvent_t();
                    list.hide();
                    currentFocus = -1;
                }
            });
            $('li[place_find__index]').hover(function() {
                    $('li[place_find__index]').css("background-color", "white");
                    $(this).css("background-color", "#EEEEEE");
                    currentFocus = parseInt($(this).attr('place_find__index'));
                }, function() {
                    $(this).css("background-color", "white");
                    currentFocus = -1;
            });
        }
    }
    function set_set_listener_event_window_resize(element, list) {
        $(window).resize(function() {
            let width_element = element.outerWidth(true);
            list.css({"width":width_element});
        });
    }
    function active_item() {
        $('li[place_find__index]').css("background-color", "white");
        $(`li[place_find__index="${currentFocus}"]`).css("background-color", "#EEEEEE");
    }
    function set_listener_event_keypress_arrow(element, list) {
        element.keyup(function(e) {
            let child_leng = list.children().length;
            if (!child_leng)
                return;
            e.preventDefault();
            switch(e.keyCode) {
                case 40: { //DOWN
                    currentFocus = (currentFocus+1 < child_leng)?currentFocus+1:0;
                    list.show();
                    active_item();
                    break;
                }
                case 38: { //UP
                    currentFocus = (currentFocus-1 > -1)?currentFocus-1:child_leng-1;
                    list.show();
                    active_item();
                    break;
                }
                case 13: { //ENTER
                    if (currentFocus > -1) {
                        autocomplete__data = arrayItemData[currentFocus];
                        if (autocomplete__events.place_changed) {
                            element.val(arrayItemData[currentFocus].NAME);
                            autocomplete__events['place_changed'].dispatchEvent_t();
                            list.hide();
                            currentFocus = -1;
                        }
                    }
                    break;
                }
            }
        });
    }
    function set_listener_event_click(element, list) {
        element.click(function() {
            list.show();
            $('li[place_find__index]').css("background-color", "white");
            currentFocus = -1;
        });
        $(document).on('click', function (e) {
            if (($(e.target).closest(list).length == 0) && ($(e.target).closest(element).length == 0)) {
                list.hide();
                $('li[place_find__index]').css("background-color", "white");
                currentFocus = -1;
            }
        });
    }
    function set_listener_event_fill(element, list) {
        let searchTimeout = null;
        element.on('paste input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(function() {
                remove_item_from_list(list);
                if (element.val().length) {
                    let url = `${g_url_place_config}/findPlace?address=${element.val()}&accessToken=${g_accessToken}`;
                    $.getJSON(url, function(result) {
                        console.log(result.length);
                        $.each(result, function(index, item) {
                            let li = $(`<li class="list-group-item form-control-sm"></li>`).html(`<b>${item.NAME} </b><br><small>${item.ADDRESS}</small>`);
                            // "overflow":"scroll", "white-space": "nowrap",
                            li.css({"height":"auto", "padding":"5px 7px", "border-radius":'2px'});
                            li.attr('place_find__index', index);
                            li.attr('title', item.NAME);
                            arrayItemData.push(item);
                            list.append(li);
                        });
                        set_listener_event_list_item(element, list);
                        list.show();
                    });
                }
            }, 250);
        });
    }
    AutoComplete.prototype.getPlace = function() {
        return autocomplete__data;
    }
    AutoComplete.prototype.addListener = function(event, func) {
        if (event=='place_changed') {
            if(autocomplete__events[event] == undefined) {
                var evt = new Event_t(event);
                autocomplete__events[event] = evt; //=> autocomplete__events = {${event}: evt}
            }
            autocomplete__events[event].registerCallback(func);
        }
    }
    AutoComplete.prototype.removeListener = function(event) {
        if (autocomplete__events[event]!=undefined) {
            autocomplete__events[event].unregisterCallback();
            if (event=='place_changed')
                delete autocomplete__events.place_changed;
        }
    }
    return AutoComplete;
})();
var contentInfo = 
    `<div style="" class="d-flex flex-column">
        <strong style="color:blue;">INFO TRASH</strong><br>
        <span class="mb-2" id="nameinfo"></span>
        <span id="ipinfo"></span><hr>
        <div>
        <button class="btn btn-outline-primary btn-sm" onclick="MarkerEdit()">Edit</button>
        <button class="btn btn-outline-danger btn-sm" onclick="MarkerRemove()">Remove</button>
        </div>
    </div>`;
var contentAddEditTrash =
    `<div style="width: 220px;" class="d-flex flex-column">
    <strong id="ftitle" style="color:blue;">ADD NEW TRASH</strong><br>
    <div class="mb-3">
        <input type="text" id="fplace">
    </div>
    <div class="input-group mb-3 input-group-sm">
        <span class="input-group-text">Name</span>
        <input type="text" class="form-control" id="fname" name="trashsdn" placeholder="Name trash, can not fill" autocomple="off" maxlength="30">
    </div>
    <div class="input-group mb-2 input-group-sm was-validated" novalidate>
        <span class="input-group-text">IP</span>
        <input type="text" class="form-control" id="fip" placeholder="Unique address" required pattern="^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$">
        <div class="valid-feedback" style="font-size:14px">IP Valid.</div>
        <div class="invalid-feedback" style="font-size:14px">Please provide a valid IP.</div>
    </div>
    <strong class="h6"><small>LatLng: <u><i>If place not found, move pin on map to locate the trash</i></u></small></strong><hr>
    <div>
        <button class="btn btn-outline-success btn-sm" onclick="saveNewMarkerTrash()">Save</button>
        <button class="btn btn-outline-danger btn-sm" onclick="cancelMarkerTrash()">Cancel</button>
    </div>
    </div>`;
var map, routing=null, isChange=false;
var infowindow, addtrashwindow;
var markerSelectCurrent, markerAddNew, markerEdit, markerOld, indexOld;
var g_accessToken = "", g_url_place_config = "";
var modeMarker = 0; // 0<=>add, 1<=>edit, 2<=>add_start_end, 3 <=>mode_other
var markerArray = []; // {'marker':value, 'name':value, 'ip':value, 'status':{value}(0=undefine,1=full,2=empty)}
var myModal;
var marker_start=null, marker_end=null, marker_start_t=null, marker_end_t=null;
let t_routing = null;
let t_on_off = 0; // 1 on, 0 off
var g_url_server;
async function getLocationStartEnd() {
    try {
        const response = await fetch(`${g_url_server}get_marker_start_end_from_database`);
        const data= await response.json();
        if (response.status!=200) {
            throw 0;
        }
        console.log("GET marker start end data from database: ", data);
        data.forEach(el => {
            if (!el.TYPE || !el.LAT || !el.LNG || el.LAT == '~%fake_NULL%~' || el.LNG == '~%fake_NULL%~') {
                return;
            }
            if (el.TYPE=='START') {
                let myIconA = L.icon({
                    iconUrl: "/image/markerA.png",
                    iconSize: [66, 66],
                    iconAnchor: [33, 66]
                });
                marker_start = L.marker([el.LAT, el.LNG], {
                    icon:myIconA,
                    draggable:false,
                }).addTo(map);
                map.setView(marker_start.getLatLng(), 14);
            } else {
                let myIconB = L.icon({
                    iconUrl: "/image/markerB.png",
                    iconSize: [66, 66],
                    iconAnchor: [33, 66]
                });
                marker_end = L.marker([el.LAT, el.LNG], {
                    icon:myIconB,
                    draggable:false,
                }).addTo(map);
            }
        });
        if (!marker_start || !marker_end)
        {
            if(marker_start) marker_start.remove();
            if (marker_end) marker_end.remove();
        }
    } catch (e) {
        console.log("Error when GET get_marker_start_end_from_database", e);
        showAlert('Error Get data from server');
    }
}
async function getMakerData() {
    try {
        const response = await fetch(`${g_url_server}get_marker_from_database`);
        const data= await response.json();
        if (response.status!=200) {
            throw 0;
        }
        console.log("GET marker data from database: ", data);
        data.forEach(function(val, index){
            if (!val.LAT || !val.LNG) {
                console.error('marker invalid');
            } else {
                if (!marker_start) {
                    map.setView([val.LAT, val.LNG], 14);
                }
                if (!val.ID) val.ID='';
                if (!val.NAME || val.NAME=='~%fake_NULL%~') val.NAME='';
                let myIcon = L.icon({
                    iconUrl: "/image/trash_undefine.png",
                    iconSize: [52, 62],
                    iconAnchor: [26, 62],
                    popupAnchor: [1, -62],
                });
                var marker = L.marker([val.LAT, val.LNG], {
                    icon:myIcon,
                    draggable:false,
                    autoPan:true,
                    closeButton:false
                }).addTo(map);
                marker.bindPopup(infowindow);
                if (val.NAME) {
                    let ct= `<span style="color:crimson; font-size:15px;">${val.NAME}</span>`
                    marker.bindTooltip(ct, {permanent:true,direction:"top",offset:[1, -65],opacity:0.95}).openTooltip();
                }
                markerArray.push({'marker':marker, 'name':val.NAME, 'ip':val.IP, 'status':0}); // Not asyn, cause init
            }
        });
        markerArray.forEach(el => {
            getStateTrashFromIP(el.ip);
        });
    } catch (e) {
        console.log("Error when GET update_marker_data_form_database");
        showAlert('Error Get data from server');
    }
}
function updateStatusTrash() {
    setInterval(async function() {
        try {
            const response = await fetch(`${g_url_server}update_status_trash`);
            const data= await response.json();
            // console.log(data);
            if (!response.ok) {
                throw 0;
            } else {
                data.forEach(el => {
                    let find = markerArray.find(_el => (_el.ip == el.ip));
                    if (find) {
                        let _path_trash;
                        let _trash = markerArray[markerArray.indexOf(find)];
                        _path_trash = (el.status == 'FULL')? "/image/trash_full.png" : "/image/trash_empty.png";
                        let _icon = _trash.marker.getIcon();
                        _icon.options.iconUrl = _path_trash;
                        _trash.marker.setIcon(_icon);
                        _trash.status = (el.status == 'FULL')? 1 : 2;
                        if (t_on_off == 1) {
                            t_on_off = 0;
                            isChange = true;
                            btn_route();
                        }
                        if (_trash.status==1) {
                            showNoti(`Trash '${_trash.name}(${_trash.ip})' is full`);
                        }
                    }
                });
            }
        } catch (e) {
            console.log("Error when GET update_status_trash", e);
        }
    }, 3000);
}
async function getPlaceConfig() {
    const response = await fetch(`${g_url_server}place_config`);
    const data= await response.json();
    if (response.status==200) {
        if(data) {
            g_url_place_config = data[0].URL;
            g_accessToken = data[0].ACCESSTOKEN;
            $('#f_setting_url_place_server').val(g_url_place_config);
            $('#f_setting_accesstoken_place_server').val(g_accessToken);
            console.log("get_data_config with:", g_url_place_config, g_accessToken);
        } else {
            console.log('get_data_config empty');
        }
    } else {
        console.error("get_data_config", data);
    }
}
function initialize() {
    var bounds = L.latLngBounds([7.730748, 102.0409], [23.47731, 111.6685]);
    map = L.map('map-canvas', {
        maxBounds: bounds,
        maxBoundsViscosity: 0.9,
        attributionControl: false,
        zoomControl: false,
        doubleClickZoom: false
    }).setView([21.03486962947104, 105.83428601061978], 14);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 8,
        maxZoom: 19,
        attribution: 'Maps and routes from <a href="https://www.openstreetmap.org">OpenStreetMap</a>. ' +
		'data uses <a href="http://opendatacommons.org/licenses/odbl/">ODbL</a> license'
    }).addTo(map);
    var attrControl = L.control.attribution(); //Create own attribution
    attrControl.addTo(map);
    var container = attrControl.getContainer();
    map.getContainer().appendChild(container);
    document.getElementById("map-canvas").removeAttribute("tabIndex");
    var elements = document.querySelectorAll(".leaflet-control a");
    for (var i = 0; i < elements.length; ++i) {
        elements[i].setAttribute("tabindex", "-1");
    }
    infowindow = L.popup({
        maxWidth:300,
        closeOnClick:false,
        autoClose:false,
    }).setContent(contentInfo);

    addtrashwindow = L.popup({
        maxWidth:300,
        closeOnClick:false,
        autoClose:false,
    }).setContent(contentAddEditTrash);
    setEventPopup();
    getMakerData();
    getLocationStartEnd();
    getPlaceConfig();
    updateStatusTrash();
}
function setEventPopup() {
    let fplace = null;
    let v_place, v_name, v_ip;
    addtrashwindow.on('add', ()=> {
        console.log('addtrashwindow added');
        if (modeMarker==1) {
            $('#ftitle').text("EDIT TRASH");
        }
        fplace = new AutoComplete('fplace');
        if (markerAddNew) {
            $('#fplace').val(v_place);
            $('#fname').val(v_name);
            $('#fip').val(v_ip);
        }
        if (modeMarker==1 && markerOld) {
            $('#fname').val(markerOld.name);
            $('#fip').val(markerOld.ip);
        }
        fplace.addListener("place_changed", ()=> {
            var place = fplace.getPlace();
            map.setView(L.latLng(place.LAT, place.LONG), 16);
            if (markerAddNew) {
                markerAddNew.setLatLng([place.LAT, place.LONG]);
            }
            if (markerEdit) {
                markerEdit.setLatLng([place.LAT, place.LONG]);
            }
            console.log(place);
        });
    });
    addtrashwindow.on('remove', ()=> {
        console.log('addtrashwindow remove');
        if (markerAddNew) {
            v_place = $('#fplace').val();
            v_name = $('#fname').val();
            v_ip = $('#fip').val();
        }
        fplace = null;
    });
    infowindow.on('add', (e)=> {
        console.log('infowindow added');
        if (markerSelectCurrent) {
            var index_temp = markerArray.findIndex(x => x.marker == markerSelectCurrent);
            if (index_temp!=-1) {
                $('#nameinfo').text('Name: '+ markerArray[index_temp].name);
                $('#ipinfo').text('IP: '+ markerArray[index_temp].ip);
            }
        }
    });
    addtrashwindow.on('remove', ()=> {
        console.log('infowindow remove');
    });
}
function setEventMarker(marker) {
    marker.off('click'); // remove all click
    marker.on('dblclick', (e) => {/*disable create marker new*/});
    marker.on('click', (e) => {
        console.log(e.target);
        if (e.target != markerSelectCurrent) {
            markerSelectCurrent = e.target;
            e.target.unbindPopup();
            e.target.bindPopup(infowindow);
            e.target.closePopup();
            e.target.openPopup();
        }
    });
    marker.on('popupclose', (e) => {
        console.log('close');
    });
}
function MarkerEdit() {
    cancelMarkerTrash();
    if (markerSelectCurrent) {
        let temp_marker = markerSelectCurrent;
        markerSelectCurrent=null;
        modeMarker=1;//edit
        indexOld = markerArray.findIndex(x => x.marker == temp_marker);
        markerOld = markerArray[indexOld];
        temp_marker.remove();
        let myIcon = L.icon({
            iconUrl: temp_marker.getIcon().options.iconUrl,
            iconSize: [52, 62],
            iconAnchor: [26, 62],
            popupAnchor: [1, -62],
        });
        var marker = L.marker(temp_marker.getLatLng(), {
            icon:myIcon,
            draggable:true,
            autoPan:true,
            closeButton:false
        }).addTo(map);
        marker.bindPopup(addtrashwindow).openPopup();
        marker.off('click');
        marker.on('dblclick', (e) => {});
        marker.on('dragend', (e) => {
            e.target.openPopup()
        });
        markerEdit = marker;
    }
}
function MarkerRemove() {
    if (markerSelectCurrent) {
        let t_marker = markerSelectCurrent;
        markerSelectCurrent = null;
        //confirm
        var index_temp = markerArray.findIndex(x => x.marker == t_marker);
        if (index_temp!=-1) {
            let _ip = markerArray[index_temp].ip;
            let _status = markerArray[index_temp].status;
            fetch(`${g_url_server}delete_marker_to_database?ip=${_ip}`, {
                method: 'DELETE'
            }).then(res => {
                if (res.status!=200) {
                    showNoti('Delete Trash Fail');
                    t_marker.closePopup();
                } else {
                    showNoti('Delete Trash Success');
                    markerArray.splice(index_temp, 1);
                    t_marker.remove();
                }
                t_marker = null;
                if (routing) {
                    isChange = true;
                    routing.remove();
                    t_on_off = 0;
                }
            });
        } else {
            showAlert('An error occurred');
        }
    }
}
function saveNewMarkerTrash() {
    let _ip = $('#fip').val();
    let _name = $('#fname').val();
    if (markerAddNew) {
        let t_marker = markerAddNew;
        // check valid IP
        if (!document.getElementById('fip').checkValidity())
        {
            showAlert("Please provide a valid IP")
            return;
        }
        // check IP duplicate
        var index_temp = markerArray.findIndex(x => x.ip == _ip);
        console.log(index_temp);
        if (index_temp!=-1) {
            showAlert("Field 'IP' duplicate");
            return;
        }
        markerAddNew=null;
        let _lat = t_marker.getLatLng().lat;
        let _lng = t_marker.getLatLng().lng;
        t_marker.dragging.disable();
        t_marker.off();
        t_marker.closePopup();
        t_marker.bindTooltip("Adding...", {permanent:true,direction:"top",offset:[1, -65],opacity:0.95}).openTooltip();
        fetch(`${g_url_server}add_marker_to_database`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'IP':_ip, 'LAT':_lat, 'LNG':_lng, 'NAME':_name})
        }).then(res => {
            if (res.status!=200) {
                showNoti('Add Trash Fail');
                t_marker.remove();
            } else {
                showNoti('Add Trash Success');
                markerArray.push({'marker':t_marker, 'name':_name, 'ip':_ip, status:0});
                getStateTrashFromIP(_ip); // Get first state trash
            }
            t_marker=null;
            if (routing) {
                isChange = true;
                routing.remove();
                t_on_off = 0;
            }
        });
    }
    if (markerEdit) {
        if ((markerOld.marker.getLatLng() == markerEdit.getLatLng())&&
            (markerOld.ip == _ip) && (markerOld.name) == _name) {
                cancelMarkerTrash();
                showNoti('Trash no chance');
                return;
        }
        let t_marker = markerEdit;
        // check valid IP
        if (!document.getElementById('fip').checkValidity())
        {
            showAlert("Please provide a valid IP")
            return;
        }
        // check IP duplicate
        var index_temp = markerArray.findIndex(x => x.ip == _ip);
        if (index_temp!=-1 && index_temp!=indexOld) {
            showAlert("Field 'ID' duplicate");
            return;
        }
        let _lat = t_marker.getLatLng().lat;
        let _lng = t_marker.getLatLng().lng;
        markerEdit=null;
        t_marker.dragging.disable();
        t_marker.off();
        t_marker.closePopup();
        t_marker.unbindPopup();
        t_marker.bindTooltip("Editing...", {permanent:true,direction:"top",offset:[1, -65],opacity:0.95}).openTooltip();
        fetch(`${g_url_server}edit_marker_from_database`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'_IP':markerOld.ip, 'IP':_ip, 'LAT':_lat, 'LNG':_lng, 'NAME':_name})
        }).then(res => {
            if (res.status!=200) {
                showNoti('Edit Trash Fail');
                markerEdit = t_marker;
                cancelMarkerTrash();
            } else {
                showNoti('Edit Trash Success');
                let __status = markerArray[indexOld].status;
                if (markerOld.ip != _ip) {
                    __status = 0;
                    let _icon = t_marker.getIcon();
                    _icon.options.iconUrl = "/image/trash_undefine.png";
                    t_marker.setIcon(_icon);
                }
                markerArray[indexOld] = {'marker':t_marker, 'name':_name, 'ip':_ip, status:__status};
                t_marker.bindPopup(infowindow);
                getStateTrashFromIP(_ip); // Get first state trash
                markerOld=null;
                if (routing) {
                    isChange = true;
                    routing.remove();
                    t_on_off = 0;
                }
            }
            t_marker=null;
        });
    }
}
function cancelMarkerTrash() {
    if (markerAddNew) {
        markerAddNew.closePopup();
        markerAddNew.unbindPopup();
        markerAddNew.remove();
        markerAddNew=null;
    }
    if (markerEdit) { // mode edit
        markerEdit.remove();
        markerOld.marker.addTo(map);
        markerOld.marker.dragging.disable();
        markerOld=null;
        markerEdit=null;
    }
}
function routingerror() {
    showAlert('An error occurred, please try again!');
}
function UpdateRoute(arrLatLng) {
    if (arrLatLng.length > 3) {
        let point_A = arrLatLng[0];
        for (let i = 1; i < arrLatLng.length-1; i++) {
            let dis = point_A.distanceTo(arrLatLng[i]);
            arrLatLng[i]['dis'] = dis;
        }
        arrLatLng.sort(function(a, b){return a.dis - b.dis});
    }
    routing = L.Routing.control({
        waypoints: arrLatLng, 
        createMarker: function (i, waypoint) {
            const marker = L.marker(waypoint.latLng, {
                draggable: false,
                icon: L.icon({
                    iconUrl: "/image/circle.png",
                    iconSize: [6, 6],
                    iconAnchor: [3, 6]
                })
            });
            return marker;
        },
        summaryTemplate: `<h2><b>Route Summary</b></h2><h3>{distance}, {time}</h3><hr>`,
        addWaypoints: false,
        collapsible: true,
        draggableWaypoints: false
    }).addTo(map);
    routing.addEventListener('routingerror', routingerror);
}
function btn_route() {
    if (modeMarker == 2) { //<=> remove start_end
        fetch(`${g_url_server}delete_start_end_from_database`, {
            method: 'DELETE'
        }).then(res => {
            if (res.status!=200) {
                showNoti('Remove Location Start-End Fail');
            } else {
                showNoti('Remove Location Start-End Success');
                $('#icon-btn1').css("background-image", "url('/image/distance.png')");
                $('#txt-btn1').text('Start-End');
                $('#icon-btn2').css("background-image", "url('/image/route.png')");
                $('#txt-btn2').text('Route');
                if(marker_start) marker_start.remove();
                if(marker_start_t) marker_start_t.remove();
                if(marker_end) marker_end.remove();
                if(marker_end_t) marker_end_t.remove();
                marker_start_t=null;
                marker_end_t=null;
                marker_start=null;
                marker_end=null;
                modeMarker = 3;
                if (t_on_off == 1) {
                    btn_route();
                }
            }
        });
        return;
    }
    if (!marker_start || !marker_end) {
        showAlert('Start-End Location Not Configured');
        if (routing) routing.remove();
        return;
    }
    if (markerArray.length == 0) {
        showAlert('Empty trash list');
        if (routing) routing.remove();
        return;
    }
    t_on_off++;
    if (t_on_off==2) {
        t_on_off=0;
    }
    if (t_on_off == 0) { // hide
        showNoti('Off Route');
        if (routing) {
            t_routing = routing;
            routing.remove();
            routing=null;
            return;
        }
    }
    else {
        showNoti('On Route');
        if (!isChange && t_routing) { // show
            console.log('Not Change => show route Old');
            routing = t_routing;
            routing.addTo(map);
            t_routing=null;
        }
        else {
            if (routing) { 
                routing.remove();
                routing.removeEventListener('routingerror', routingerror);
            }
            console.log('Change => Create and Show route');
            let arrPoint = [];
            arrPoint.push(marker_start.getLatLng());
            markerArray.forEach(value => {
                if (value.status==1) {
                    arrPoint.push(value.marker.getLatLng())
                }
            });
            arrPoint.push(marker_end.getLatLng());
            if (arrPoint.length > 2) {
                UpdateRoute(arrPoint);
            } else {
                showAlert('No trash full');
                t_on_off = 0;
            }
            isChange = false;
        }
    }
}
function btn_start_end() {
    if (modeMarker==2) {
        let __data = [{'LAT':marker_start_t.getLatLng().lat, 'LNG':marker_start_t.getLatLng().lng, 'TYPE':'START'},
                        {'LAT':marker_end_t.getLatLng().lat, 'LNG':marker_end_t.getLatLng().lng, 'TYPE':'END'}];
        fetch(`${g_url_server}add_marker_start_end_to_database`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(__data)
        }).then(res => {
            if (res.status!=200) {
                showNoti('Update Location Start-End Fail');
            } else {
                marker_start = marker_start_t;
                marker_end = marker_end_t;
                marker_start.dragging.disable();
                marker_end.dragging.disable();
                marker_start_t=null, marker_end_t=null;
                showNoti('Update Location Start-End Success');
                $('#icon-btn1').css("background-image", "url('/image/distance.png')");
                $('#txt-btn1').text('Start-End');
                $('#icon-btn2').css("background-image", "url('/image/route.png')");
                $('#txt-btn2').text('Route');
                modeMarker=3;
                if (t_on_off == 1) {
                    t_on_off--;
                    btn_route();
                }
                isChange=true;
            }
        });
        return;
    }
    modeMarker = 2;
    let myIconA = L.icon({
        iconUrl: "/image/markerA.png",
        iconSize: [66, 66],
        iconAnchor: [33, 66]
    });
    let latlngA = (marker_start) ? marker_start.getLatLng() : map.getCenter();
    let latlngB = (marker_end) ? marker_end.getLatLng() : map.getCenter();
    if (!(marker_end)) latlngB.lng += 0.0015;
    if(marker_start) marker_start.remove();
    if(marker_end) marker_end.remove();

    marker_start_t=null, marker_end_t=null;
    marker_start_t = L.marker(latlngA, {
        icon:myIconA,
        draggable:true,
        autoPan:true,
        closeButton:false
    }).addTo(map);

    let myIconB = L.icon({
        iconUrl: "/image/markerB.png",
        iconSize: [66, 66],
        iconAnchor: [33, 66]
    });
    marker_end_t = L.marker(latlngB, {
        icon:myIconB,
        draggable:true,
        autoPan:true,
        closeButton:false
    }).addTo(map);

    $('#icon-btn1').css("background-image", "url('/image/check.png')");
    $('#txt-btn1').text('Save');
    $('#icon-btn2').css("background-image", "url('/image/cancel.png')");
    $('#txt-btn2').text('Remove');
}
async function getStateTrashFromIP(ip) {
    let find = markerArray.findIndex(_el => (_el.ip == ip));
    if (find==-1) {
        console.log("Error when get state trash from ip");
        return;
    }
    let trash = markerArray[find];
    trash.marker.unbindPopup();
    trash.marker.bindPopup(infowindow);
    trash.marker.off('click')
    let ct = `<span style="color:blue; font-size:15px;">Getting state...</span>`;
    trash.marker.bindTooltip(ct, {permanent:true,direction:"top",offset:[1, -65],opacity:0.95}).openTooltip();
    const response = await fetch(`${g_url_server}getstatefromip?ip=${ip}`);
    const data= await response.json();
    setEventMarker(trash.marker);
    if (response.status==200) {
        if(data) {
            console.log("STATE TRASH", data);
            let _path_trash, rt = true;
            if (data.state === "FULL") {
                trash.status = 1;
                _path_trash = "/image/trash_full.png";
            } else if (data.state === "EMPTY") {
                _path_trash = "/image/trash_empty.png";
                trash.status = 2;
            } else {
                _path_trash = "/image/trash_undefine.png";
                trash.status = 0;
                rt = false;
            }
            let _icon = trash.marker.getIcon();
            _icon.options.iconUrl = _path_trash;
            trash.marker.setIcon(_icon);
            if (trash.name) {
                let ct = `<span style="color:crimson; font-size:15px;">${trash.name}</span>`
                trash.marker.bindTooltip(ct, {permanent:true,direction:"top",offset:[1, -65],opacity:0.95}).openTooltip();
            } else {
                trash.marker.unbindTooltip();
            }
            if (rt)
                return;
        }
    }
    ct = `<span style="color:blue; font-size:15px;">Get state FAIL</span>`
    trash.marker.bindTooltip(ct, {permanent:true,direction:"top",offset:[1, -65],opacity:0.95}).openTooltip();
}
$(document).ready(function() {
    // console.log = function() {};
    g_url_server = window.location.href;
    InitWeb();
    SwitchTab(1);
    initialize();
    myModal = new bootstrap.Modal(document.getElementById('myModal'), {backdrop: 'static'});
    map.on('contextmenu', ()=>{})
    map.on('click', ()=>{
        if (markerSelectCurrent)
            markerSelectCurrent.closePopup();
        markerSelectCurrent=null;
    });
    map.on('dblclick', function(e) {
        modeMarker=0;//add
        cancelMarkerTrash();
        let myIcon = L.icon({
            iconUrl: "/image/trash_undefine.png",
            iconSize: [52, 62],
            iconAnchor: [26, 62],
            popupAnchor: [1, -62],
        }); 
        var marker = L.marker(e.latlng, {
            icon:myIcon,
            draggable:true,
            autoPan:true,
            closeButton:false
        }).addTo(map);
        marker.bindPopup(addtrashwindow).openPopup();
        marker.off('click');
        marker.on('dblclick', (e) => {});
        marker.on('dragend', (e) => {
            e.target.openPopup()
        });
        markerAddNew = marker;
    });
});