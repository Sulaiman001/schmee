// Contacts Utility Functions
// Written by Mocha Dick
var default_alert = true;
var default_silent = true;
var default_emergency = true;
var default_accept_unknown_alert = true;
var default_accept_unknown_silent = true;
var default_accept_unknown_emergency = true;


function stripNumber(num) {
	num = num.replace("(", "");
	num = num.replace(")", "");
	num = num.replace("-", "");
	num = num.replace(" ", "");
	return num;
}


function onContactsLoadSuccess(contacts) {
    // js = callback hell
    var mergedContacts = mergeWithSavedContacts(contacts);
    saveContacts(mergedContacts);
    // $('#test').html(JSON.stringify(mergedContacts));
}


function onContactsLoadError(contactError) {
    // js = callback hell
    alert("Error loading contacts", contactError);
}


function loadContacts() {
    if(( /(ipad|iphone|ipod|android)/i.test(navigator.userAgent) )) {
        var options = new ContactFindOptions();
        options.filter = "";          // empty search string returns all contacts
        options.multiple = true;      // return multiple results
        filter = ["displayName", "name", "nickname", "id", "phoneNumbers"];   // return contact.displayName 
        navigator.contacts.find(filter, onContactsLoadSuccess, onContactsLoadError, options);
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
				if (contactsArray[i]['id'] == savedContacts[j]['id'] && !matchFound) {
					matchFound = true;
					savedContacts[j]['displayName'] = contactsArray[i]['displayName'];
					savedContacts[j]['name'] = contactsArray[i]['name'];
					savedContacts[j]['nickname'] = contactsArray[i]['nickname'];
					savedContacts[j]['phoneNumbers'] = contactsArray[i]['phoneNumbers'];
				}
			}

			if (!matchFound) {
				newContacts.push(contactsArray[i])
			}
		}
	} else {
		// null catch
		if (contactsArray == null && savedContacts != null) {
			return savedContacts;
		} else if (savedContacts == null && contactsArray != null) {
			return contactsArray;
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


function isTrue(contactsArray, phoneNumber, field) {
	for (i = 0; i < contactsArray.length; i++) {
		var numbersArray = contactsArray[i].phoneNumbers;
		if (numbersArray instanceof Array) {
			for (j = 0; j < numbersArray.length; j++) {
				var num = numbersArray[j]["value"];
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
				var num = numbersArray[j]["value"];
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
				var num = numbersArray[j]["value"];
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
	if (isKnownContact(contactsArray, phoneNumber)) {
		return isTrue(contactsArray, phoneNumber, "emergency");
	} else if (accept_unknown_emergency) {
		return true;
	}
	return false;
}


function acceptAlerts(contactsArray, phoneNumber) {
	if (isKnownContact(contactsArray, phoneNumber)) {
		return isTrue(contactsArray, phoneNumber, "alerts");
	} else if (accept_unknown_alert) {
		return true;
	}
	return false;
}


function acceptSilent(contactsArray, phoneNumber) {
	if (isKnownContact(contactsArray, phoneNumber)) {
		return isTrue(contactsArray, phoneNumber, "silent");
	} else if (accept_unknown_silent) {
		return true;
	}
	return false;
}


function saveVariable(name, data) {
	localStorage.setItem(name, data);
}


function loadVariable(name) {
	return localStorage.getItem(name);
}


function loadUnknownNumberVariables() {
	var accept_unknown_alert = loadVariable('accept_unknown_alert');
	if (accept_unknown_alert == null) {
		accept_unknown_alert = default_accept_unknown_alert;
	}
	var accept_unknown_silent = loadVariable('accept_unknown_silent');
	if (accept_unknown_silent == null) {
		accept_unknown_silent = default_accept_unknown_silent;
	}
	var accept_unknown_emergency = loadVariable('accept_unknown_emergency');
	if (accept_unknown_emergency == null) {
		accept_unknown_emergency = default_accept_unknown_emergency;
	}
}


function toggleAcceptUnknownAlert() {
	var accept_unknown_alert = loadVariable('accept_unknown_alert');
	saveVariable('accept_unknown_alert', !accept_unknown_alert);
}


function toggleAcceptUnknownSilent() {
	var accept_unknown_silent = loadVariable('accept_unknown_silent');
	saveVariable('accept_unknown_silent', !accept_unknown_silent);
}


function toggleAcceptUnknownEmergency() {
	var accept_unknown_emergency = loadVariable('accept_unknown_emergency');
	saveVariable('accept_unknown_emergency', !accept_unknown_emergency);
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
	var contacts = toggleContactField(id, "emergency");
	return contacts;
}


function toggleAlertContact(id) {
	var contacts = toggleContactField(id, "alerts");
	return contacts;
}


function toggleSilentContact(id) {
	var contacts = toggleContactField(id, "silent");
	return contacts;
}


// Tests
var testContacts = [{
		"id": "1",
      	"displayName": "Glen Baker",
      	"emergency": true,
      	"alerts": true,
      	"silent": true,
      	"phoneNumbers": [{
	      	"id": "4",
	      	"value": "(559) 246-8891",
	      	"type": "mobile"
	    }]

    },
    { "id": "2",
      "displayName": 'Robert Hawk',
	  "emergency": true,
      "alerts": false,
      "silent": true
    },
    { "id": "3",
      "displayName": 'Mocha Dick',
      "emergency": false,
      "alerts": false,
      "silent": false,
      "phoneNumbers": [{
	      	"id": "4",
	      	"value": "(559) 888-8888",
	      	"type": "mobile"
	    }]
    }
]

var testContacts2 = [{
		"id": "4",
      	"displayName": "Datastream Cowboy",
      	"phoneNumbers": [{
	      	"id": "5",
	      	"value": "(559) 999-9999",
	      	"type": "mobile"
	    }]

    },
    { "id": "2",
      "displayName": 'Robert Hawk',
    },
    { "id": "3",
      "displayName": 'Mocha Dick',
      "phoneNumbers": [{
	      	"id": "4",
	      	"value": "(559) 888-8888",
	      	"type": "mobile"
	    }]
    }
]


function testGetDisplayName() {
	var displayName = getDisplayName(testContacts, "0835592468891");
	if (displayName == "Glen Baker") {
		console.log("+ Success!  getDisplayName worked as expected for first test");
	} else {
		console.log("- Error!  getDisplayName not working properly");
	}

	var secondDisplayName = getDisplayName(testContacts, "0835598888888");
	if (secondDisplayName == "Mocha Dick") {
		console.log("+ Success!  getDisplayName worked as expected for second test");
	} else {
		console.log("- Error!  getDisplayName not working properly");
	}
}


function testToggleAlerts() {
	var preToggleContacts = loadSavedContacts();
	var preToggle = acceptAlerts(preToggleContacts, "0835598888888");
	toggleAlertContact(3);
	var postToggleContacts = loadSavedContacts();
	var postToggle = acceptAlerts(postToggleContacts, "0835598888888");
	if (preToggle != postToggle) {
		console.log("+ Success!  toggleAlertContact working as expected");
	} else {
		console.log("- Failure!  toggleAlertContact not working as expected");
	}
}


function testToggleSilent() {
	var preToggleContacts = loadSavedContacts();
	var preToggle = acceptSilent(preToggleContacts, "0835598888888");
	toggleSilentContact(3);
	var postToggleContacts = loadSavedContacts();
	var postToggle = acceptSilent(postToggleContacts, "0835598888888");
	if (preToggle != postToggle) {
		console.log("+ Success!  toggleSilentContact working as expected");
	} else {
		console.log("- Failure!  toggleSilentContact not working as expected");
	}
}


function testToggleEmergency() {
	var preToggleContacts = loadSavedContacts();
	var preToggle = acceptEmergency(preToggleContacts, "0835598888888");
	toggleEmergencyContact(3);
	var postToggleContacts = loadSavedContacts();
	var postToggle = acceptEmergency(postToggleContacts, "0835598888888");
	if (preToggle != postToggle) {
		console.log("+ Success!  toggleEmergencyContact working as expected");
	} else {
		console.log("- Failure!  toggleEmergencyContact not working as expected");
	}
}


function testAcceptAlerts() {
	if (acceptAlerts(testContacts, "0835592468891")) {
		console.log("+ Success!  Expected acceptAlerts true");
	} else {
		console.log(acceptAlerts(testContacts, "0835592468891"));
		console.log("- Failure!  Expected acceptAlerts true");
	}

	if (!acceptAlerts(testContacts, "0835598888888")) {
		console.log("+ Success!  Expected acceptAlerts false");
	} else {
		console.log(acceptAlerts(testContacts, "0835598888888"));
		console.log("- Failure!  Expected acceptAlerts false");
	}

}


function testAcceptSilent() {
	if (acceptSilent(testContacts, "0835592468891")) {
		console.log("+ Success!  Expected acceptSilent true");
	} else {
		console.log(acceptSilent(testContacts, "0835592468891"));
		console.log("- Failure!  Expected acceptSilent true");
	}

	if (!acceptSilent(testContacts, "0835598888888")) {
		console.log("+ Success!  Expected acceptSilent false");
	} else {
		console.log(acceptSilent(testContacts, "0835598888888"));
		console.log("- Failure!  Expected acceptSilent false");
	}
}


function contactsTest() {
	console.log("Testing contacts.js...")
	testAcceptAlerts();
	testAcceptSilent();

	testToggleAlerts();
	testToggleSilent();
	testToggleEmergency();

	testGetDisplayName();
}
