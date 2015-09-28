// Contacts Utility Functions
// Written by Mocha Dick
var default_alert = true;
var default_silence = true;
var default_emergency = true;


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
	if (contactsArray != null) {
		for (i = 0; i < contactsArray.length; ++i) {
			var matchFound = false;
			if (savedContacts != null) {
				for(j = 0; j < savedContacts.length && matchFound == false; ++j ) {
					if (contactsArray[i]['id'] == savedContacts[j]['id'] && !matchFound) {
						matchFound = true;
						savedContacts[j]['displayName'] = contactsArray[i]['displayName'];
						savedContacts[j]['name'] = contactsArray[i]['name'];
						savedContacts[j]['nickname'] = contactsArray[i]['nickname'];
						savedContacts[j]['phoneNumbers'] = contactsArray[i]['phoneNumbers'];
					}
				}
			}

			if (!matchFound) {
				newContacts.push(contactsArray[i])
			}
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
		contactsArray = defaultSilence(contactsArray, i);
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

function defaultSilence(contactsArray, idx) {
	if (contactsArray[idx].silence == undefined) {
		contactsArray[idx].silence = default_silence;
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
	return isTrue(contactsArray, phoneNumber, "emergency")
}


function acceptAlerts(contactsArray, phoneNumber) {
	return isTrue(contactsArray, phoneNumber, "alerts");
}


function acceptSilence(contactsArray, phoneNumber) {
	return isTrue(contactsArray, phoneNumber, "silence");
}


function toggleContactField(id, field) {
	var contactsArray = loadSavedContacts();
	for(i=0;i<contactsArray.length;i++){
		if (contactsArray[i]['id'] == id) {
			contactsArray[i][field] = !contactsArray[i][field];
			saveContacts(contactsArray);
		}
	}
}

function toggleEmergencyContact(id) {
	toggleContactField(id, "emergency");
}

function toggleAlertContact(id) {
	toggleContactField(id, "alerts");
}

function toggleSilenceContact(id) {
	toggleContactField(id, "silence");
}

// Tests

var testContacts = [{
		"id": "1",
      	"displayName": "Glen Baker",
      	"emergency": true,
      	"alerts": true,
      	"silence": true,
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
      "silence": true
    },
    { "id": "3",
      "displayName": 'Mocha Dick',
      "emergency": false,
      "alerts": false,
      "silence": false,
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


function testToggleSilence() {
	var preToggleContacts = loadSavedContacts();
	var preToggle = acceptSilence(preToggleContacts, "0835598888888");
	toggleSilenceContact(3);
	var postToggleContacts = loadSavedContacts();
	var postToggle = acceptSilence(postToggleContacts, "0835598888888");
	if (preToggle != postToggle) {
		console.log("+ Success!  toggleSilenceContact working as expected");
	} else {
		console.log("- Failure!  toggleSilenceContact not working as expected");
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

function testAcceptSilence() {
	if (acceptSilence(testContacts, "0835592468891")) {
		console.log("+ Success!  Expected acceptSilence true");
	} else {
		console.log(acceptSilence(testContacts, "0835592468891"));
		console.log("- Failure!  Expected acceptSilence true");
	}

	if (!acceptSilence(testContacts, "0835598888888")) {
		console.log("+ Success!  Expected acceptSilence false");
	} else {
		console.log(acceptSilence(testContacts, "0835598888888"));
		console.log("- Failure!  Expected acceptSilence false");
	}
}

function contactsTest() {
	console.log("Testing contacts.js...")
	testAcceptAlerts();
	testAcceptSilence();

	testToggleAlerts();
	testToggleSilence();
	testToggleEmergency();

	testGetDisplayName();
}
