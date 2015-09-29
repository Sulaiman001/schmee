// Tests for parseEmoji.js

/* Simple tests to verify parseEmoji identifies all of
 * the expected emojis.
 */
function parseEmojiTest() {
    var success = true;
    var errorCount = 0;
    var testNoEmoji = "Some plain text message."
    var testAlertSMS = "Some loud ASAP SMS !alert";
    var testSilentSMS = "Some silent SMS !silent";
    var testEmergencySMS = "Emergency!!! !emergency";

    var return_emoji = "";
    console.log("Testing parseEmoji.js...")

    if (parseEmergency(testEmergencySMS)) {
        console.log("+ Success!  Emergency emoji identified");
    } else {
        console.log("- Error identifying emergency emoji");
        success = false;
        errorCount += 1;
    }


    if (parseAlert(testAlertSMS)) {
        console.log("+ Success!  Alert emoji identified");
    } else {
        console.log("- Error identifying alert emoji");
        success = false;
        errorCount += 1;
    }


    if (parseSilent(testSilentSMS)) {
        console.log("+ Success!  Silent emoji identified");
    } else {
        console.log("- Error identifying silent emoji");
        success = false;
        errorCount += 1;
    }

    return_emoji = parseEmoji(testNoEmoji);
    if (return_emoji != null) {
        console.log("- Error identifying emojiless text");
        success = false;
        errorCount += 1;
    } else {
        console.log("+ Success!  Emojiless text identified");
    }

    if (success) {
        console.log("...parseEmoji.js is functioning properly.")
    } else {
        console.log("...parseEmoji.js encountered errors.", errorCount)
    }
}