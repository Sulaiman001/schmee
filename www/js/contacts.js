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


function toggleContactField(contactsArray, displayName, field) {
	for(i=0;i<contactsArray.length;i++){
		if (contactsArray[i]['displayName'] == displayName) {
			contactsArray[i][field] = !contactsArray[i][field];
		}
	}
}

function toggleEmergencyContact(contactsArray, displayName) {
	toggleContactField(contactsArray, displayName, "emergency");
}

function toggleAlertContact(contactsArray, displayName) {
	toggleContactField(contactsArray, displayName, "alerts");
}

function toggleSilenceContact(contactsArray, displayName) {
	toggleContactField(contactsArray, displayName, "silence");
}

var testContacts = [{
		"id": "2",
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
    { "id": "1",
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


// Tests


function testGetDisplayName() {
	var displayName = getDisplayName(testContacts, "0835592468891");
	if (displayName == "Glen Baker") {
		console.log("+ Success!  getDisplayName worked as expected for first test");
	} else {
		console.log("+ Error!  getDisplayName not working properly");
	}

	var secondDisplayName = getDisplayName(testContacts, "0835598888888");
	if (secondDisplayName == "Mocha Dick") {
		console.log("+ Success!  getDisplayName worked as expected for second test");
	} else {
		console.log("+ Error!  getDisplayName not working properly");
	}
}


function testToggleAlerts() {
	var pre_toggle = acceptAlerts(testContacts, "0835598888888");
	toggleAlertContact(testContacts, "Mocha Dick");
	var post_toggle = acceptAlerts(testContacts, "0835598888888");
	if (pre_toggle != post_toggle) {
		console.log("+ Success!  toggleAlertContact working as expected");
	} else {
		console.log("+ Failure!  toggleAlertContact not working as expected");
	}
}


function testToggleSilence() {
	var pre_toggle = acceptSilence(testContacts, "0835598888888");
	toggleSilenceContact(testContacts, "Mocha Dick");
	var post_toggle = acceptSilence(testContacts, "0835598888888");
	if (pre_toggle != post_toggle) {
		console.log("+ Success!  toggleSilenceContact working as expected");
	} else {
		console.log("+ Failure!  toggleSilenceContact not working as expected");
	}
}


function testAcceptAlerts() {
	if (acceptAlerts(testContacts, "0835592468891")) {
		console.log("+ Success!  Expected acceptAlerts true");
	} else {
		console.log(acceptAlerts(testContacts, "0835592468891"));
		console.log("+ Failure!  Expected acceptAlerts true");
	}

	if (!acceptAlerts(testContacts, "0835598888888")) {
		console.log("+ Success!  Expected acceptAlerts false");
	} else {
		console.log(acceptAlerts(testContacts, "0835598888888"));
		console.log("+ Failure!  Expected acceptAlerts false");
	}

}

function testAcceptSilence() {
	if (acceptSilence(testContacts, "0835592468891")) {
		console.log("+ Success!  Expected acceptSilence true");
	} else {
		console.log(acceptSilence(testContacts, "0835592468891"));
		console.log("+ Failure!  Expected acceptSilence true");
	}

	if (!acceptSilence(testContacts, "0835598888888")) {
		console.log("+ Success!  Expected acceptSilence false");
	} else {
		console.log(acceptSilence(testContacts, "0835598888888"));
		console.log("+ Failure!  Expected acceptSilence false");
	}
}

function contactsTest() {
	console.log("Testing contacts.js...")
	testAcceptAlerts();
	testAcceptSilence();

	testToggleAlerts();
	testToggleSilence();

	testGetDisplayName();
}
