// Tests for parseEmoji.js

/* Simple tests to verify parseEmoji identifies all of
 * the expected emojis.
 */
function testParseScheduleDateStr() {
    var errorCount = 0;
    var testScheduleSMS = "Alert later !schedule 2:30PM";
    var afterSchedule = parseScheduleDateStr(testScheduleSMS);
    if (afterSchedule == "2:30PM") {
        console.log("+ Success!  parseScheduleDateStr is functioning properly");
    } else {
        console.log("- Error!  parseScheduleDateStr is not functioning properly");
        errorCount++;
    }
    return errorCount;
}


function testParseHowlerSoundUrl() {
    var errorCount = 0;
    var testHowler = "Danger Zone !howler ehab.it/dangerzone.mp3"
    var url = parseHowlerSoundUrl(testHowler);
    if (url == "http://ehab.it/dangerzone.mp3") {
        console.log("+ Success!  parseHowlerSoundUrl is functioning properly");
    } else {
        console.log("- Error!  parseHowlerSoundUrl is not functioning properly");
        errorCount++;
    }
    return errorCount;
}


function parseEmojiTest() {
    var success = true;
    var errorCount = 0;
    var testNoEmoji = "Some plain text message."
    var testAlertSMS = "Some loud ASAP SMS !alert";
    var testSilentSMS = "Some silent SMS !silent";
    var testEmergencySMS = "Emergency!!! !sos";
    var testScheduleSMS = "Alert later !schedule 2:30PM";
    var testHowlerSMS = "Danger Zone!!! !howler snd.url";

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

    if (parseSchedule(testScheduleSMS)) {
        console.log("+ Success!  Schedule emoji identified");
    } else {
        console.log("- Error identifying schedule emoji");
        success = false;
        errorCount += 1;
    }

    if (parseHowler(testHowlerSMS)) {
        console.log("+ Success!  Howler emoji identified");
    } else {
        console.log("- Error identifying howler emoji");
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


    errorCount += testParseScheduleDateStr();
    errorCount += testParseHowlerSoundUrl();

    if (errorCount == 0) {
        console.log("...parseEmoji.js is functioning properly.")
    } else {
        console.log("...parseEmoji.js encountered errors.", errorCount)
    }


}