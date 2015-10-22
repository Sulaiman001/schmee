// Parses SMS messages for valid emojis and commands
// Written by Mocha Dick

var alert_emoji = "⏰";
var silent_emoji = "😴";
var emergency_emoji = "🆘";

var schedule_emoji = "";
var howler_emoji = "";


var alert_emojis = ["!alert", alert_emoji];
var silent_emojis = ["!silent", silent_emoji];
var emergency_emojis = ["!emergency", "!sos", emergency_emoji];

var schedule_emojis = ["!schedule", schedule_emoji];
var howler_emojis = ["!howler", howler_emoji];

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


function parseSchedule(sms) {
    for (i=0;i<schedule_emojis.length;i++) {
        if (sms.indexOf(schedule_emojis[i]) > 0) {
            return true;
        }
    }
    return false
}


function parseHowler(sms) {
    for (i=0;i<howler_emojis.length;i++) {
        if (sms.indexOf(howler_emojis[i]) > 0) {
            return true;
        }
    }
    return false
}


function cutEverythingAfterM(someStr) {
    if (someStr.indexOf('M') > -1) {
        return someStr.substring(0, someStr.indexOf('M')+1)
    } else if (someStr.indexOf('m') > -1) {
        return someStr.substring(0, someStr.indexOf('m')+1)
    }
    return someStr;
}


function parseScheduleDateStr(sms) {
    // returns the str following the identified !schedule emoji
    for (i=0;i<schedule_emojis.length;i++) {
        if (sms.indexOf(schedule_emojis[i]) > 0) {
            var afterSchedule = sms.substr(sms.indexOf(schedule_emojis[i]) + schedule_emojis[i].length);
            return cutEverythingAfterM(afterSchedule.trim());
        }
    }
    return null;
}


function hasPM(dateStr) {
    if (// dateStr.indexOf("AM") != -1 || dateStr.indexOf("A.M") != -1 ||
        dateStr.indexOf("PM") != -1 || dateStr.indexOf("P.M") != -1 ||
        // dateStr.indexOf("am") != -1 || dateStr.indexOf("a.m") != -1 ||
        dateStr.indexOf("pm") != -1 || dateStr.indexOf("p.m") != -1) {
        return true;
    }
    return false;
}


function convertTo24Hours(dateStr) {
    // Convert a string like 10:05:23 PM to 24h format, returns like [22,5,23]

    var hours = Number(dateStr.match(/^(\d\d?)/)[1]);
    var minutes = Number(dateStr.match(/:(\d\d?)/)[1]);
    var AMPM = dateStr.match(/(.AM|PM|A.M|P.M|A.M.|P.M.)$/i);
    if (AMPM != null) {
        AMPM = AMPM[1];
    }
    if (AMPM == 'PM' || AMPM == 'pm' ||
        AMPM == 'P.M' || AMPM == 'p.m' && hours<12) 
    {
        hours = hours+12;
    }
    else if (AMPM == 'AM' || AMPM == "am" && hours==12)
    {
        hours = hours-12;
    }

    var sHours = hours.toString();
    var sMinutes = minutes.toString();

    if(hours<10)
    {
        sHours = "0" + sHours;
    }
    else if(minutes<10) {
        sMinutes = "0" + sMinutes;
    }

    return sHours + ":" + sMinutes;    
}


var test_times = ['1:00 pm','1:00 p.m.','1:00 p','1:00pm',
    '1:00p.m.','1:00p','1 pm','1 p.m.','1 p','1pm','1p.m.',
    '1p','13:00','13'];

function parseDateTime(dateStr) {
    var d = new Date();
    if (hasPM(dateStr)) {
        dateStr = convertTo24Hours(dateStr);
    }
    var time = dateStr.match(/(\d+)(?::(\d\d))?\s*(p?)/);
    d.setHours( parseInt(time[1]) + (time[3] ? 12 : 0) );
    d.setMinutes( parseInt(time[2]) || 0 );
    return d;
}


function parseHowlerSoundUrl(sms) {
    // returns the str following the identified !howler emoji
    for (i=0; i<howler_emojis.length; i++) {
        if (sms.indexOf(howler_emojis[i]) > 0) {
            var afterHowler = sms.substr(sms.indexOf(howler_emojis[i]) + howler_emojis[i].length);
            var uri = afterHowler.trim()
            if (uri.lastIndexOf("http://", 0) !== 0) {
                uri = "http://"+uri.replace(/ /g, "%20");
            } else {
                uri = "http://"+uri.slice(7, uri.length).replace(/ /g, "%20");
            }
            return uri;
        }
    }
    return null;
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

function shouldSchedule(sms) {
    return parseSchedule(sms);
}

function shouldHowler(sms) {
    return parseHowler(sms);
}
