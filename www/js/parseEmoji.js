// Parses SMS messages for valid emojis
// Written by Mocha Dick

var alert_emoji = "☎";
var silence_emoji = "😶";

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

/* Function to return the dominant valid emoji in a given string.
 * Returns null if string has no valid emojis.
 * @param {String} sms   Required.  String to check for emojis.
 */
function parseEmoji(sms) {
    if (sms.indexOf(alert_emoji) > 0) {
        return alert_emoji;
    } else if (sms.indexOf(silence_emoji) > 0) {
        return silence_emoji;
    } else if (sms.indexOf(alert_emoji) > 0 &&
                  sms.indexOf(silence_emoji) > 0) {
        var alert_count = occurrences(sms, alert_emoji);
        var silence_count = occurrences(sms, silence_emoji);
        if (alert_count > silence_count) {
            return alert_emoji;
        } else {
            return silence_emoji;
        }
    } else {
        return null;
    }
}

/* Simple tests to verify parseEmoji identifies all of
 * the expected emojis.
 */
function parseEmojiTest() {
    var success = true;
    var errorCount = 0;
    var testNoEmoji = "Some plain text message."
    var testAlertSMS = "Some loud ASAP SMS☎";
    var testSilentSMS = "Some silent SMS 😶";
    var return_emoji = "";
    console.log("Testing parseEmoji()...")
    return_emoji = parseEmoji(testAlertSMS);
    if (return_emoji != alert_emoji) {
        console.log("+  Error identifying alert emoji");
        success = false;
        errorCount += 1;
    } else {
        console.log("+  Success!  Alert emoji identified");
    }

    return_emoji = parseEmoji(testSilentSMS);
    if (return_emoji != silence_emoji) {
        console.log("+  Error identifying silence emoji");
        success = false;
        errorCount += 1;
    } else {
        console.log("+  Success!  Silence emoji identified");
    }

    return_emoji = parseEmoji(testNoEmoji);
    if (return_emoji != null) {
        console.log("+  Error identifying emojiless text");
        success = false;
        errorCount += 1;
    } else {
        console.log("+  Success!  Emojiless text identified");
    }

    if (success) {
        console.log("...parseEmoji() functioning properly.")
    } else {
        console.log("...parseEmoji() encountered errors.", errorCount)
    }
}