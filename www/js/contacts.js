// Contacts Utility Functions
// Written by Mocha Dick
var default_alert = true;
var default_silence = true;


function defaultContacts(contactsArray) {
	for (i = 0; i < contactsArray.length; i++) {
		contactsArray = defaultAlert(contactsArray, i);
		contactsArray = defaultSilence(contactsArray, i);
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
				num = num.replace("(", "");
				num = num.replace(")", "");
				num = num.replace("-", "");
				num = num.replace(" ", "");
				// console.log(num);
				// console.log(phoneNumber.slice(3, phoneNumber.length));
				if (num === phoneNumber.slice(3, phoneNumber.length)) {
					return contactsArray[i][field];
				}
			}
		}
	}
	return false;
}

function acceptAlerts(contactsArray, phoneNumber) {
	return isTrue(contactsArray, phoneNumber, "alerts");
}

function acceptSilence(contactsArray, phoneNumber) {
	return isTrue(contactsArray, phoneNumber, "silence");
}



var testContacts = [{
      	"displayName": 'Glen Baker',
      	"alerts": true,
      	"silence": true,
      	"phoneNumbers": [{
	      	"id": "4",
	      	"value": "(559) 246-8891",
	      	"type": "mobile"
	    }]

    },
    { displayName: 'Robert Hawk',
      alerts: false,
      silence: true
    },
    { displayName: 'Mocha Dick',
      alerts: false,
      silence: false,
      "phoneNumbers": [{
	      	"id": "4",
	      	"value": "(559) 888-8888",
	      	"type": "mobile"
	    }]
    }
]


function isTrueTest() {
	testAcceptAlerts();
	testAcceptSilence();
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
	isTrueTest();
}
