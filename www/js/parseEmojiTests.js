// Tests for parseEmoji.js
// Written by Mocha Dick

function testParseScheduleDateStr() {
    var errorCount = 0;
    var testScheduleSMS = "Alert later !schedule 2:30PM";
    var afterSchedule = parseScheduleDateStr(testScheduleSMS);
    if (afterSchedule == "2:30PM") {
        console.log("+ Success!  parseScheduleDateStr is functioning properly");
    } else {
        console.log("- Error!  parseScheduleDateStr failed the first test");
        errorCount++;
    }

    var testScheduleSMS2 = "Alert for later !schedule 1am";
    afterSchedule = parseScheduleDateStr(testScheduleSMS2);
    if (afterSchedule == "1am") {
        console.log("+ Success!  parseScheduleDateStr is functioning properly");
    } else {
        console.log("- Error!  parseScheduleDateStr failed the second test");
        errorCount++;
    }

    return errorCount;
}


function testParseDateTime() {
    errorCount = 0;
    var testScheduleSMS = "Alert later !schedule 2:30 PM";
    var dateTime = parseDateTime(parseScheduleDateStr(testScheduleSMS));
    var expectedTime = new Date();
    expectedTime.setHours(14);
    expectedTime.setMinutes(30);
    if (dateTime.getTime() == expectedTime.getTime()) {
        console.log("+ Success!  parseDateTime passed first test");
    } else {
        console.log("dateTime: " + dateTime.getTime());
        console.log("expectedTime: " + expectedTime.getTime());
        console.log("- Error!  parseDateTime failed the first test");
        errorCount++;
    }

    var testScheduleSMS2 = "Alert for later !schedule 1am";
    dateTime = parseDateTime(parseScheduleDateStr(testScheduleSMS2));
    expectedTime.setHours(1);
    expectedTime.setMinutes(0);
    if (dateTime.getTime() == expectedTime.getTime()) {
        console.log("+ Success!  parseDateTime passed second test");
    } else {
        console.log("dateTime: " + dateTime.getTime());
        console.log("expectedTime: " + expectedTime.getTime());
        console.log("- Error!  parseDateTime failed the second test");
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
        console.log(url);
        console.log("- Error!  parseHowlerSoundUrl is not functioning properly");
        errorCount++;
    }
    return errorCount;
}


function testConvertTo24Hours() {
    var errorCount = 0;
    var test = "2:30PM"
    var converted = convertTo24Hours(test);
    if (converted == "14:30") {
       console.log("+ Success!  convertTo24Hours is functioning properly");
    } else {
        console.log("Input Str: " + test);
        console.log("Converted: " + converted);
        console.log("- Error!  convertTo24Hours is not functioning properly");
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

    if (shouldEmergency(testEmergencySMS)) {
        console.log("+ Success!  Emergency emoji identified");
    } else {
        console.log("- Error identifying emergency emoji");
        success = false;
        errorCount += 1;
    }


    if (shouldAlert(testAlertSMS)) {
        console.log("+ Success!  Alert emoji identified");
    } else {
        console.log("- Error identifying alert emoji");
        success = false;
        errorCount += 1;
    }


    if (shouldSilent(testSilentSMS)) {
        console.log("+ Success!  Silent emoji identified");
    } else {
        console.log("- Error identifying silent emoji");
        success = false;
        errorCount += 1;
    }

    if (shouldSchedule(testScheduleSMS)) {
        console.log("+ Success!  Schedule emoji identified");
    } else {
        console.log("- Error identifying schedule emoji");
        success = false;
        errorCount += 1;
    }

    if (shouldHowler(testHowlerSMS)) {
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
    errorCount += testConvertTo24Hours();
    errorCount += testParseDateTime();
    errorCount += testParseHowlerSoundUrl();

    if (errorCount == 0) {
        console.log("...parseEmoji.js is functioning properly.")
    } else {
        console.log("...parseEmoji.js encountered errors.", errorCount)
    }


}