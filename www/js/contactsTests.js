// Tests for contacts.js
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
	var errorCount = 0;
	var displayName = getDisplayName(testContacts, "0835592468891");
	if (displayName == "Glen Baker") {
		console.log("+ Success!  getDisplayName worked as expected for first test");
	} else {
		console.log("- Error!  getDisplayName not working properly");
		errorCount++;
	}

	var secondDisplayName = getDisplayName(testContacts, "0835598888888");
	if (secondDisplayName == "Mocha Dick") {
		console.log("+ Success!  getDisplayName worked as expected for second test");
	} else {
		console.log("- Error!  getDisplayName not working properly");
		errorCount++;
	}
	return errorCount;
}


function testToggleAlerts() {
	var errorCount = 0;
	var preToggleContacts = loadSavedContacts();
	var preToggle = acceptAlerts(preToggleContacts, "0835598888888");
	toggleAlertContact(3);
	var postToggleContacts = loadSavedContacts();
	var postToggle = acceptAlerts(postToggleContacts, "0835598888888");
	if (preToggle != postToggle) {
		console.log("+ Success!  toggleAlertContact working as expected");
	} else {
		console.log("- Failure!  toggleAlertContact not working as expected");
		errorCount++;
	}
	return errorCount;
}


function testToggleSilent() {
	var errorCount = 0;
	var preToggleContacts = loadSavedContacts();
	var preToggle = acceptSilent(preToggleContacts, "0835598888888");
	toggleSilentContact(3);
	var postToggleContacts = loadSavedContacts();
	var postToggle = acceptSilent(postToggleContacts, "0835598888888");
	if (preToggle != postToggle) {
		console.log("+ Success!  toggleSilentContact working as expected");
	} else {
		console.log("- Failure!  toggleSilentContact not working as expected");
		errorCount++;
	}
	return errorCount;
}


function testToggleEmergency() {
	var errorCount = 0;
	var preToggleContacts = loadSavedContacts();
	var preToggle = acceptEmergency(preToggleContacts, "0835598888888");
	toggleEmergencyContact(3);
	var postToggleContacts = loadSavedContacts();
	var postToggle = acceptEmergency(postToggleContacts, "0835598888888");
	if (preToggle != postToggle) {
		console.log("+ Success!  toggleEmergencyContact working as expected");
	} else {
		console.log("- Failure!  toggleEmergencyContact not working as expected");
		errorCount++;
	}
	return errorCount;
}


function testAcceptAlerts() {
	var errorCount = 0;
	if (acceptAlerts(testContacts, "0835592468891")) {
		console.log("+ Success!  Expected acceptAlerts true");
	} else {
		console.log(acceptAlerts(testContacts, "0835592468891"));
		console.log("- Failure!  Expected acceptAlerts true");
		errorCount++;
	}

	if (!acceptAlerts(testContacts, "0835598888888")) {
		console.log("+ Success!  Expected acceptAlerts false");
	} else {
		console.log(acceptAlerts(testContacts, "0835598888888"));
		console.log("- Failure!  Expected acceptAlerts false");
		errorCount++;
	}
	return errorCount;
}


function testAcceptSilent() {
	var errorCount = 0;
	if (acceptSilent(testContacts, "0835592468891")) {
		console.log("+ Success!  Expected acceptSilent true");
	} else {
		console.log(acceptSilent(testContacts, "0835592468891"));
		console.log("- Failure!  Expected acceptSilent true");
		errorCount++;
	}

	if (!acceptSilent(testContacts, "0835598888888")) {
		console.log("+ Success!  Expected acceptSilent false");
	} else {
		console.log(acceptSilent(testContacts, "0835598888888"));
		console.log("- Failure!  Expected acceptSilent false");
		errorCount++;
	}
	return errorCount;
}


function testToggleAcceptUnknownAlert() {
	var errorCount = 0;
	var pre_accept_unknown_alert = loadBool('accept_unknown_alert');
	toggleAcceptUnknownAlert();
	var post_accept_unknown_alert = loadBool('accept_unknown_alert');
	if (pre_accept_unknown_alert == post_accept_unknown_alert) {
		console.log("- Failure!  toggleAcceptUnknownAlert failed");
		errorCount++;
	} else {
		console.log("+ Success!  toggleAcceptUnknownAlert functioning properly");
	}
	toggleAcceptUnknownAlert();  // reset variable after test
	return errorCount;
}


function testToggleAcceptUnknownSilent() {
	var errorCount = 0;
	var pre_accept_unknown_alert = loadBool('accept_unknown_silent');
	toggleAcceptUnknownSilent();
	var post_accept_unknown_alert = loadBool('accept_unknown_silent');
	if (pre_accept_unknown_alert == post_accept_unknown_alert) {
		console.log("- Failure!  toggleAcceptUnknownSilent failed");
		errorCount++;
	} else {
		console.log("+ Success!  toggleAcceptUnknownSilent functioning properly");
	}
	toggleAcceptUnknownSilent();  // reset variable after test
	return errorCount;
}


function testToggleAcceptUnknownEmergency() {
	var errorCount = 0;
	var pre_accept_unknown_alert = loadBool('accept_unknown_emergency');
	toggleAcceptUnknownEmergency();
	var post_accept_unknown_alert = loadBool('accept_unknown_emergency');
	if (pre_accept_unknown_alert == post_accept_unknown_alert) {
		console.log("- Failure!  toggleAcceptUnknownEmergency failed");
		errorCount++;
	} else {
		console.log("+ Success!  toggleAcceptUnknownEmergency functioning properly");
	}
	toggleAcceptUnknownEmergency();  // reset variable after test
	return errorCount;
}


function contactsTest() {
	console.log("Testing contacts.js...")
	var errorCount = 0;
	errorCount += testAcceptAlerts();
	errorCount += testAcceptSilent();
	errorCount += testToggleAlerts();
	errorCount += testToggleSilent();
	errorCount += testToggleEmergency();
	errorCount += testGetDisplayName();
	errorCount += testToggleAcceptUnknownAlert();
	errorCount += testToggleAcceptUnknownSilent();
	errorCount += testToggleAcceptUnknownEmergency();

	if (errorCount == 0) {
		console.log("...contacts.js is functioning properly.")
	} else {
		console.log("...contact.js encountered errors.", errorCount)
	}
}
