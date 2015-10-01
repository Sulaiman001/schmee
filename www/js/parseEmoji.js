// Parses SMS messages for valid emojis and commands
// Written by Mocha Dick

var alert_emoji = "⏰";
var silent_emoji = "😴";
var emergency_emoji = "🆘";

var schedule_emoji = "";



var alert_emojis = ["!alert", alert_emoji];
var silent_emojis = ["!silent", silent_emoji];
var emergency_emojis = ["!emergency", "!sos", emergency_emoji];

var schedule_emojis = ["!schedule", schedule_emoji];


/* Function count the occurrences of substring in a string;
 * @param {String} string   Required. The string;
 * @param {String} subString    Required. The string to search for;
 * @param {Boolean} allowOverlapping    Optional. Default: false;
 */
function occurrences(string, subString, allowOverlapping){
    string+=""; subString+="";
    if(subString.length<=0) return string.length+1;

    var n=0, pos=0;
    var step=(allowOverlapping)?(1):(subString.length);

    while(true){
        pos=string.indexOf(subString,pos);
        if(pos>=0){ n++; pos+=step; } else break;
    }
    return(n);
}

function parseAlert(sms) {
    for (i=0;i<alert_emojis.length;i++) {
        if (sms.indexOf(alert_emojis[i]) > 0) {
            return true;
        }
    }
    return false
}

function parseEmergency(sms) {
    for (i=0;i<emergency_emojis.length;i++) {
        if (sms.indexOf(emergency_emojis[i]) > 0) {
            return true;
        }
    }
    return false
}

function parseSilent(sms) {
    for (i=0;i<silent_emojis.length;i++) {
        if (sms.indexOf(silent_emojis[i]) > 0) {
            return true;
        }
    }
    return false
}

/* Function to return the dominant valid emoji in a given string.
 * Returns null if string has no valid emojis.
 * @param {String} sms   Required.  String to check for emojis.
 */
function parseEmoji(sms) {
    if (sms.indexOf(alert_emoji) > 0) {
        return alert_emoji;
    } else if (sms.indexOf(silent_emoji) > 0) {
        return silent_emoji;
    } else if (sms.indexOf(emergency_emoji) > 0) {
        return emergency_emoji;
    } else if (sms.indexOf(alert_emoji) > 0 &&
                  sms.indexOf(silent_emoji) > 0) {
        var alert_count = occurrences(sms, alert_emoji);
        var silent_count = occurrences(sms, silent_emoji);
        if (alert_count > silent_count) {
            return alert_emoji;
        } else {
            return silent_emoji;
        }
    } else {
        return null;
    }
}


function shouldEmergency(sms) {
    return parseEmergency(sms);
}

function shouldAlert(sms) {
    return parseAlert(sms);
}

function shouldSilent(sms) {
    return parseSilent(sms);
}
