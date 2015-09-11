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