// Contacts Utility Functions
// Written by Mocha Dick
var default_alert = true;
var default_silent = true;
var default_emergency = true;
var default_schedule = true;
var default_howler = true;
var default_accept_unknown_alert = true;
var default_accept_unknown_silent = true;
var default_accept_unknown_emergency = true;
var default_accept_unknown_schedule = true;
var default_accept_unknown_howler = true;
var default_emergency_mode = false;
var default_silence_mode = true;


function stripNumber(num) {
	num = num.replace("(", "");
	num = num.replace(")", "");
	num = num.replace("-", "");
	num = num.replace(" ", "");
	return num;
}


function saveVariable(name, data) {
	localStorage.setItem(name, data);
}


function loadVariable(name) {
	// returns localStorage string value given a key
	return localStorage.getItem(name);
}


function loadBool(name) {
	// converts stored localStorage string to Boolean
	return ("true" === loadVariable(name));
}


function hasPhoneNumber(contact) {
	// returns true if contaact has a phone number
	if (contact['phoneNumbers'] !== null) {
		return true;
	}
	return false;
}


function hasDisplayName(contact) {
	if (contact['displayname'] !== null) {
		return true;
	}
	return false;
}


function contactsWithPhoneNumbers(contacts) {
	var contactsWithNumbers = [];
	for (i=0; i < contacts.length; i++) {
		if (hasPhoneNumber(contacts[i])) {
			contactsWithNumbers.push(contacts[i]);
		} 
	}
	return contactsWithNumbers;
}


function contactsWithNumbersAndNames(contacts) {
	var contactsWithDisplayNames = [];
	for (i=0; i< contacts.length; i++) {
		if (hasPhoneNumber(contacts[i]) && hasDisplayName(contacts[i])) {
			contactsWithDisplayNames.push(contacts[i]);
		}
	}
	return contactsWithDisplayNames;
}


function onContactsLoadSuccess(contacts) {
    // js = callback hell
    var mergedContacts = mergeWithSavedContacts(contacts);
    saveContacts(contactsWithNumbersAndNames(mergedContacts));
    // $('#test').html(JSON.stringify(mergedContacts));
}


function onContactsLoadError(contactError) {
    // js = callback hell
    alert("Error loading contacts", contactError);
}


function loadContacts() {
    if(( /(ipad|iphone|ipod|android)/i.test(navigator.userAgent) )) {
        // var options = new ContactFindOptions();
        // options.filter = "";          // empty search string returns all contacts
        // options.multiple = true;      // return multiple results
        // filter = ["displayName", "name", "nickname", "id", "phoneNumbers"];   // return contact.displayName 
        // navigator.contacts.find(filter, onContactsLoadSuccess, onContactsLoadError, options);
    	navigator.contactsPhoneNumbers.list(function(contacts) {
	    	onContactsLoadSuccess(contacts);
	   	}, function(error) {
	    	onContactsLoadError(error);
	   	});
    } else {
        var mergedContacts = mergeWithSavedContacts(testContacts);
	    saveContacts(mergedContacts);
    }

    loadUnknownNumberVariables();
}


function loadSavedContacts() {
	var contacts = localStorage.getItem('contacts')
	if (typeof contacts !== undefined && contacts !== "undefined") {
		return JSON.parse(contacts);
	}
	return null;
}


function saveContacts(contactsArray) {
	localStorage.setItem('contacts', JSON.stringify(contactsArray));
}


function mergeWithSavedContacts(contactsArray) {
	// check for matching ids
	// use settings information from savedContacts, update entry with
	// any new information from the given contactsArray
	var savedContacts = loadSavedContacts();
	var newContacts = [];
	if (contactsArray != null && savedContacts != null) {
		for (i = 0; i < contactsArray.length; ++i) {
			var matchFound = false;
			for(j = 0; j < savedContacts.length && matchFound == false; ++j ) {
				if (contactsArray[i]['id'] == savedContacts[j]['id'] && !matchFound
					&& contactsArray[i]['phoneNumbers'] != null && contactsArray[i]['displayName'] != null) {
					matchFound = true;
					savedContacts[j]['displayName'] = contactsArray[i]['displayName'];
					savedContacts[j]['name'] = contactsArray[i]['name'];
					savedContacts[j]['nickname'] = contactsArray[i]['nickname'];
					savedContacts[j]['phoneNumbers'] = contactsArray[i]['phoneNumbers'];
				}
			}

			if (!matchFound) {
				if (hasPhoneNumber(contactsArray[i])) {
					// only push to newContacts if contact has a phoneNumber
					if (hasDisplayName(contactsArray[i])) {
						// only push to newContacts if contact has a displayName
						newContacts.push(contactsArray[i]);
					}
				}
			}
		}
	} else {
		// null catch
		if (contactsArray == null && savedContacts != null) {
			return savedContacts;
		} else if (savedContacts == null && contactsArray != null) {
			return defaultContacts(contactsArray);
		} else if (contactsArray == null && saveContacts == null) {
			return newContacts;
		}
	}

	newContacts = defaultContacts(newContacts);

	if (savedContacts != null) {
		return savedContacts.concat(newContacts);
	} else {
		return newContacts;
	}
}


function defaultContacts(contactsArray) {
	// Initializes default settings on the given contactsArray
	for (i = 0; i < contactsArray.length; i++) {
		contactsArray = defaultAlert(contactsArray, i);
		contactsArray = defaultSilent(contactsArray, i);
		contactsArray = defaultEmergency(contactsArray, i);
		contactsArray = defaultSchedule(contactsArray, i);
		contactsArray = defaultHowler(contactsArray, i);
	}
	return contactsArray;	
}


function defaultEmergency(contactsArray, idx) {
	if (contactsArray[idx].emergency == undefined) {
		contactsArray[idx].emergency = default_emergency;
	}
	return contactsArray;
}


function defaultAlert(contactsArray, idx) {
	if (contactsArray[idx].alerts == undefined) {
		contactsArray[idx].alerts = default_alert;
	}
	return contactsArray;
}


function defaultSilent(contactsArray, idx) {
	if (contactsArray[idx].silent == undefined) {
		contactsArray[idx].silent = default_silent;
	}
	return contactsArray;
}


function defaultSchedule(contactsArray, idx) {
	if (contactsArray[idx].schedule == undefined) {
		contactsArray[idx].schedule = default_schedule;
	}
	return contactsArray;
}


function defaultHowler(contactsArray, idx) {
	if (contactsArray[idx].howler == undefined) {
		contactsArray[idx].howler = default_howler;
	}
	return contactsArray;
}


function isTrue(contactsArray, phoneNumber, field) {
	for (i = 0; i < contactsArray.length; i++) {
		var numbersArray = contactsArray[i].phoneNumbers;
		if (numbersArray instanceof Array) {
			for (j = 0; j < numbersArray.length; j++) {
				var num = numbersArray[j]["number"];
				num = stripNumber(num)
				if (num === phoneNumber.slice(3, phoneNumber.length)) {
					return contactsArray[i][field];
				}
			}
		}
	}
	return false;
}


function isKnownContact(contactsArray, phoneNumber) {
	for (i = 0; i < contactsArray.length; i++) {
		var numbersArray = contactsArray[i].phoneNumbers;
		if (numbersArray instanceof Array) {
			for (j = 0; j < numbersArray.length; j++) {
				var num = numbersArray[j]["number"];
				num = stripNumber(num)
				if (num === phoneNumber.slice(3, phoneNumber.length)) {
					return true;
				}
			}
		}
	}
	return false;
}


function getDisplayName(contactsArray, phoneNumber) {
	// returns displayName of contact in contactsArray with given phoneNumber
	for (i = 0; i < contactsArray.length; i++) {
		var numbersArray = contactsArray[i].phoneNumbers;
		if (numbersArray instanceof Array) {
			for (j = 0; j < numbersArray.length; j++) {
				var num = numbersArray[j]["number"];
				num = stripNumber(num)
				if (num === phoneNumber.slice(3, phoneNumber.length)) {
					return contactsArray[i].displayName;
				}
			}
		}
	}
	return phoneNumber;
}


function acceptEmergency(contactsArray, phoneNumber) {
	var accept_unknown_emergency = loadBool("accept_unknown_emergency");
	if (isKnownContact(contactsArray, phoneNumber)) {
		return isTrue(contactsArray, phoneNumber, "emergency");
	} else if (accept_unknown_emergency) {
		return true;
	}
	return false;
}


function acceptAlerts(contactsArray, phoneNumber) {
	var accept_unknown_alert = loadBool("accept_unknown_alert");
	if (isKnownContact(contactsArray, phoneNumber)) {
		return isTrue(contactsArray, phoneNumber, "alerts");
	} else if (accept_unknown_alert) {
		return true;
	}
	return false;
}


function acceptSilent(contactsArray, phoneNumber) {
	var accept_unknown_silent = loadBool("accept_unknown_silent");
	if (isKnownContact(contactsArray, phoneNumber)) {
		return isTrue(contactsArray, phoneNumber, "silent");
	} else if (accept_unknown_silent) {
		return true;
	}
	return false;
}


function acceptSchedule(contactsArray, phoneNumber) {
	var accept_unknown_schedule = loadBool("accept_unknown_schedule");
	if (isKnownContact(contactsArray, phoneNumber)) {
		return isTrue(contactsArray, phoneNumber, "schedule");
	} else if (accept_unknown_schedule) {
		return true;
	}
	return false;
}


function acceptHowler(contactsArray, phoneNumber) {
	var accept_unknown_howler = loadBool("accept_unknown_howler");
	if (isKnownContact(contactsArray, phoneNumber)) {
		return isTrue(contactsArray, phoneNumber, "howler");
	} else if (accept_unknown_howler) {
		return true;
	}
	return false;
}


function loadUnknownNumberVariables() {
	// if a variable is unset, sets to default value
	var accept_unknown_alert = loadVariable('accept_unknown_alert');
	if (accept_unknown_alert == null) {
		saveVariable("accept_unknown_alert", default_accept_unknown_alert);
	}
	var accept_unknown_silent = loadVariable('accept_unknown_silent');
	if (accept_unknown_silent == null) {
		saveVariable("accept_unknown_silent", default_accept_unknown_silent);
	}
	var accept_unknown_emergency = loadVariable('accept_unknown_emergency');
	if (accept_unknown_emergency == null) {
		saveVariable("accept_unknown_emergency", default_accept_unknown_emergency);
	}
	var accept_unknown_schedule = loadVariable('accept_unknown_schedule');
	if (accept_unknown_schedule == null) {
		saveVariable("accept_unknown_schedule", default_accept_unknown_schedule);
	}
	var accept_unknown_howler = loadVariable('accept_unknown_howler');
	if (accept_unknown_howler == null) {
		saveVariable("accept_unknown_howler", default_accept_unknown_howler);
	}
	var emergency_mode = loadVariable('emergency_mode');
	if (emergency_mode == null) {
		saveVariable('emergency_mode', default_emergency_mode);
	}
	var silence_mode = loadVariable('silence_mode');
	if (silence_mode == null) {
		saveVariable('silence_mode', default_silence_mode);
	}
}


function acceptUnknownAlert() {
	var accept_unknown_alert = loadBool('accept_unknown_alert');
	if (accept_unknown_alert == null) {
		return default_accept_unknown_alert;
	}
	return accept_unknown_alert;
}


function acceptUnknownSilent() {
	var accept_unknown_silent = loadBool('accept_unknown_silent');
	if (accept_unknown_silent == null) {
		return default_accept_unknown_silent;
	}
	return accept_unknown_silent;
}


function acceptUnknownEmergency() {
	var accept_unknown_emergency = loadBool('accept_unknown_emergency');
	if (accept_unknown_emergency == null) {
		return default_accept_unknown_emergency;
	}
	return accept_unknown_emergency;
}


function acceptUnknownSchedule() {
	var accept_unknown_schedule = loadBool('accept_unknown_schedule');
	if (accept_unknown_schedule == null) {
		return default_accept_unknown_schedule;
	}
	return accept_unknown_schedule;
}


function acceptUnknownHowler() {
	var accept_unknown_howler = loadBool('accept_unknown_howler');
	if (accept_unknown_howler == null) {
		return default_accept_unknown_howler;
	}
	return accept_unknown_howler;
}


function emergencyMode() {
	// returns true if emergency mode, false otherwise
	var emergency_mode = loadBool('emergency_mode');
	if (emergency_mode == null) {
		return default_emergency_mode;
	}
	return emergency_mode;
}


function silenceMode() {
	// returns true if emergency mode, false otherwise
	var silence_mode = loadBool('silence_mode');
	if (silence_mode == null) {
		return default_silence_mode;
	}
	return silence_mode;
}


function toggleAcceptUnknownAlert() {
	var accept_unknown_alert = acceptUnknownAlert();
	saveVariable('accept_unknown_alert', !accept_unknown_alert);
	return !accept_unknown_alert;
}


function toggleAcceptUnknownSilent() {
	var accept_unknown_silent = acceptUnknownSilent();
	saveVariable('accept_unknown_silent', !accept_unknown_silent);
	return !accept_unknown_silent;
}


function toggleAcceptUnknownEmergency() {
	var accept_unknown_emergency = acceptUnknownEmergency();
	saveVariable('accept_unknown_emergency', !accept_unknown_emergency);
	return !accept_unknown_emergency;
}


function toggleAcceptUnknownSchedule() {
	var accept_unknown_schedule = acceptUnknownSchedule();
	saveVariable('accept_unknown_schedule', !accept_unknown_schedule);
	return !accept_unknown_schedule;
}


function toggleAcceptUnknownHowler() {
	var accept_unknown_howler = acceptUnknownHowler();
	saveVariable('accept_unknown_howler', !accept_unknown_howler);
	return !accept_unknown_howler;
}


function toggleEmergencyMode() {
	var emergency_mode = emergencyMode();
	saveVariable('emergency_mode', !emergency_mode);
	return !emergency_mode;
}


function toggleSilenceMode() {
	var silence_mode = silenceMode();
	saveVariable('silence_mode', !silence_mode);
	return !silence_mode;
}


function toggleContactField(id, field) {
	var contacts = loadSavedContacts();
	for(i=0;i<contacts.length;i++){
		if (contacts[i]['id'] == id) {
			contacts[i][field] = !contacts[i][field];
			saveContacts(contacts);
		}
	}
	return contacts;
}


function toggleEmergencyContact(id) {
	return toggleContactField(id, "emergency");
}


function toggleAlertContact(id) {
	return toggleContactField(id, "alerts");
}


function toggleSilentContact(id) {
	return toggleContactField(id, "silent");
}


function toggleScheduleContact(id) {
	return toggleContactField(id, "schedule");
}


function toggleHowlerContact(id) {
	return toggleContactField(id, "howler");
}

