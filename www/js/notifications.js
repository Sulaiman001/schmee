// Schmee notifications.js by Mocha Dick
function saveNotificationID(id) {
	saveVariable("notificationID", id);
}


function loadNotificationID() {
	var id = loadVariable("notificationID");
	if (id != null) {
		return id;
	}
	return 1;
}


function getLastMessage() {
    // retrieve from MessagesCtrl scope
    var scope = angular.element($("#data")).scope();
   	return scope.messages[0];
}


function isMultipartMessage(data) {
	var lastMessage = getLastMessage();
	if (lastMessage['fromNumber'] == data['address']) {
		if (int(data['date_sent']) - int(lastMessage['dateSent']) <= 4000) {
			return true;
		}
	}
	return false;
}

var dialog;
showToast = function (text) {
    setTimeout(function () {
        if (device.platform != 'windows') {
            window.plugins.toast.showShortCenter(text);
        } else {
            showDialog(text);
        }
    }, 100);
};

showDialog = function (text) {
    if (dialog) {
        dialog.content = text;
        return;
    }
    dialog = new Windows.UI.Popups.MessageDialog(text);
    dialog.showAsync().done(function () {
        dialog = null;
    });
};

function mediaError(e) {
    alert("Problem loading sound clip");
    alert(JSON.stringify(e));
}        

scheduleEmergency = function(txt, type, from) {
	var id = loadNotificationID();
    cordova.plugins.notification.local.schedule({
        id: id,
        text: txt,
        title: type + " from " + from,
        sound: null,
        icon: 'whale_red.png',
        led: "FF0000"
    });
    
    showToast(txt);
    var media = new Media("/android_asset/www/sos.mp3", null, mediaError);
    media.play();
    saveNotificationID(id+1);
}

scheduleAlert = function(txt, type, from) {
	var id = loadNotificationID();
    cordova.plugins.notification.local.schedule({
        id: id,
        text: txt,
        title: type + " from " + from,
        icon: 'whale_blue.png',
        led: "0000FF"
    });

    showToast(txt);
    saveNotificationID(id+1);
};

scheduleSilent = function(txt, type, from) {
	var id = loadNotificationID();
    cordova.plugins.notification.local.schedule({
        id: id,
        text: txt,
        title: type + " from " + from,
        icon: 'whale.png',
        sound: null,
        led: "FFFFFF"
    });
    saveNotificationID(id+1);
};


scheduleSchedule = function(txt, type, from) {
	var id = loadNotificationID();
    var at = parseDateTime(parseScheduleDateStr(txt));
    cordova.plugins.notification.local.schedule({
        id: id,
        text: txt,
        title: type + " from " + from,
        icon: 'whale_yellow.png',
        led: "0000FF",
        at: at
    });

    showToast(txt);
    saveNotificationID(id+1);
};


scheduleHowler = function(txt, type, from) {
	var id = loadNotificationID();
    var sndurl = parseHowlerSoundUrl(txt);
    cordova.plugins.notification.local.schedule({
        id: id,
        text: txt,
        title: type + " from " + from,
        icon: 'whale_purple.png',
        led: "800080",
        sound: null
    });

    var media = new Media(sndurl, null, mediaError);
    media.play();
    showToast(txt);
    saveNotificationID(id+1);
}


// we will store the intercepted SMS here for later restore
var smsList = [];
var interceptEnabled = false;
var watching = false;

var testNotification = {
    id: 3,
    address: '0835598888888',
    body: 'test !sos',
    displayName: "Mocha Dick"
}


function schmeeNotifications(data) {
    var contacts = loadSavedContacts();
    var fromNumber = data.address;
    var msg = data.body;
    var fromName = getDisplayName(contacts, fromNumber);
    var message = {
        address: fromNumber,
        body: msg,
        fromName: fromName,
        dateSent: data.date_sent
    }

    // push to MessagesCtrl scope
    var scope = angular.element($("#data")).scope();
    scope.$apply(function(){
        scope.addMessage(message);
    })


    if (isKnownContact(contacts, fromNumber)) {  
        // Known Contacts
        if (shouldEmergency(msg)) {
            if (acceptEmergency(contacts, fromNumber)) {
                scheduleEmergency(msg, "Emergency", fromName);
            }
        } else if (!emergencyMode()) {
            if (shouldAlert(msg)) {
                if (acceptAlerts(contacts, fromNumber)) {
                    scheduleAlert(msg, "Alert", fromName);
                }
            } else if (shouldSchedule(msg)) {
                if (acceptUnknownSchedule()) {
                    scheduleSchedule(msg, "Schedule", fromNumber);
                }
            } else if (shouldSilent(msg)) {
                if (acceptSilent(contacts, fromNumber)) {
                    scheduleSilent(msg, "Silent", fromName);
                }
            } else if (shouldHowler(msg)) {
                if (acceptHowler(contacts, fromNumber)) {
                    scheduleHowler(msg, "Howler", fromName);
                }
            }
        }
    } else {
        // Unknown Contacts
        if (shouldEmergency(msg)) {
            if (acceptUnknownEmergency()) {
                scheduleEmergency(msg, "Emergency", fromName);
            }
        } else if (!emergencyMode()) {

            if (shouldAlert(msg)) {
                if (acceptUnknownAlert()) {
                    scheduleAlert(msg, "Alert", fromNumber);
                }
            } else if (shouldSchedule(msg)) {
                if (acceptUnknownSchedule()) {
                    scheduleSchedule(msg, "Schedule", fromNumber);
                }
            } else {
                if (shouldSilent(msg)) {
                    if (acceptUnknownSilent()) {
                        scheduleSilent(msg, "Silent", fromName);
                    }
                } else if (shouldHowler(msg)) {
                    if (acceptHowler(contacts, fromNumber)) {
                        scheduleHowler(msg, "Howler", fromName);
                    }
                } else {
                    if (!silenceMode()) {
                        scheduleAlert(msg, "Text", fromName);
                    } else {
                        scheduleSilent(msg, "Text", fromName);
                    }
                }
            }
        }
    }
}
