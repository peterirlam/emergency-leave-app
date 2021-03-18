function isUndefined(arg) {
  return typeof arg == 'undefined';
}

function IsMissing(x) {
  return isUndefined(x);
}

function CStr(v) {
  return v === null || IsMissing(v) ? ' ' : v.toString();
}

function Trim(v) {
  return LTrim(RTrim(v));
};

function LTrim(s) {
  return CStr(s).replace(/^\s\s*/, "");
};

function RTrim(s) {
  return CStr(s).replace(/\s\s*$/, "");
};

function doGet(e) {
  var requestername = e.parameter.requestername;
  var requesteremail = e.parameter.requesteremail;
  var timeTakenList = e.parameter.timeTakenList;
  var timeOfferedList = e.parameter.timeOfferedList;
  var runningtotalTimetaken = e.parameter.runningtotalTimetaken;
  var runningtotalTimeoffered = e.parameter.runningtotalTimeoffered;
  var reasonForTimeTaken = e.parameter.reasonForTimeTaken;
  var managername = e.parameter.managername;
  var manageremail = e.parameter.manageremail
  var html = HtmlService.createTemplateFromFile('Emergency_Leave_Approval');
  html.requestername = requestername;
  html.requesteremail = requesteremail;
  html.timeTakenList = timeTakenList;
  html.timeOfferedList = timeOfferedList;
  html.runningtotalTimetaken = runningtotalTimetaken;
  html.runningtotalTimeoffered = runningtotalTimeoffered;
  html.managername = managername;
  html.manageremail = manageremail;
  html.reasonForTimeTaken = reasonForTimeTaken.toLowerCase();
  return html.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  if (typeof e !== 'undefined')
    var requestername = e.parameter.requestername;
  var requesteremail = e.parameter.requesteremail;
  var timeTakenList = e.parameter.timeTakenList;
  var timeOfferedList = e.parameter.timeOfferedList;
  var runningtotalTimetaken = e.parameter.runningtotalTimetaken;
  var runningtotalTimeoffered = e.parameter.runningtotalTimeoffered;
  var managername = e.parameter.managername;
  var manageremail = e.parameter.manageremail;
  var reasonForTimeTaken = e.parameter.reasonForTimeTaken;
  var approvalstatus = e.parameter.hdnApprovalStatus;
  var reasonforreusal = e.parameter.reasonNotApproved

  sendreport(requestername, requesteremail, reasonForTimeTaken, timeTakenList, runningtotalTimetaken, timeOfferedList, runningtotalTimeoffered, managername, manageremail, approvalstatus, reasonforreusal);
  var html = HtmlService.createTemplateFromFile('Confirmation');
  html.requestername = requestername;
  html.managername = managername;
  return html.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function sendreport(requestername, requesteremail, reasonForTimeTaken, timeTakenList, runningtotalTimetaken, timeOfferedList, runningtotalTimeoffered, managername, manageremail, approvalstatus, reasonforreusal) {
  //Set up destination folder
  var dstFolderId = DriveApp.getFolderById("15eD817P6ybztt6arbYYLGX4Hlk9XK-XF");
  var timetakenlistArray = timeTakenList.split("@");
  var dateTaken = "\r";
  var timeTaken = "\r";
  var hrsTaken = "\r";
  for (i = 0; i < timetakenlistArray.length; i++) {
    dateTaken += Trim(timetakenlistArray[i].split("|")[0]) + '\r';
    timeTaken += Trim(timetakenlistArray[i].split("|")[1]) + '\r';
    hrsTaken += Trim(timetakenlistArray[i].split("|")[2]) + '\r';
  }
  var docid;
  var doc;
  var body;
  var todaysdate = new Date();
  var dd = todaysdate.getDate();
  var mm = todaysdate.getMonth() + 1;
  var yyyy = todaysdate.getFullYear();
  if (timeOfferedList != "notapplicable") {
    docid = DriveApp.getFileById("1WW7MOW8kYvlUhS06weDKv5plGpmxu_ea3j8qt2HdiI8").makeCopy("Leave_Approval_Notification_" + Utilities.formatDate(new Date(), "GMT+1", "dd-MMM-yyyy") + "_" + requestername, dstFolderId).getId()
    doc = DocumentApp.openById(docid);
    body = doc.getActiveSection();
    var timeofferedlistArray = timeOfferedList.split("@");
    var dateOffered = "\r";
    var timeOffered = "\r";
    var hrsOffered = "\r";
    for (i = 0; i < timeofferedlistArray.length; i++) {
      dateOffered += Trim(timeofferedlistArray[i].split("|")[0]) + '\r';
      timeOffered += Trim(timeofferedlistArray[i].split("|")[1]) + '\r';
      hrsOffered += Trim(timeofferedlistArray[i].split("|")[2]) + '\r';
    }
    body.replaceText("%todaysdate%", dd + "/" + mm + "/" + yyyy);
    body.replaceText("%fullname%", requestername);
    body.replaceText("%email%", requesteremail);
    body.replaceText("%manager%", managername);
    body.replaceText("%datetaken%", dateTaken);
    body.replaceText("%timetaken%", timeTaken);
    body.replaceText("%hrstaken%", hrsTaken);
    body.replaceText("%totalhrstaken%", runningtotalTimetaken);
    body.replaceText("%dateoffered%", dateOffered);
    body.replaceText("%timeoffered%", timeOffered);
    body.replaceText("%hrsoffered%", hrsOffered);
    body.replaceText("%approvalstatus%", approvalstatus);
    body.replaceText("%totalhrsoffered%", runningtotalTimeoffered);
    body.replaceText("%reasonforreusal%", reasonforreusal);
  } else {
    docid = DriveApp.getFileById("1Z4elQ7Q_81FUsts3QdtShojykV0PGWeAcmG4Y2Cr_Js").makeCopy("Leave_Approval_Notification_" + Utilities.formatDate(new Date(), "GMT+1", "dd-MMM-yyyy") + "_" + requestername, dstFolderId).getId()
    doc = DocumentApp.openById(docid);
    body = doc.getActiveSection();
    body.replaceText("%todaysdate%", dd + "/" + mm + "/" + yyyy);
    body.replaceText("%fullname%", requestername);
    body.replaceText("%email%", requesteremail);
    body.replaceText("%reason%", reasonForTimeTaken);
    body.replaceText("%manager%", managername);
    body.replaceText("%datetaken%", dateTaken);
    body.replaceText("%timetaken%", timeTaken);
    body.replaceText("%hrstaken%", hrsTaken);
    body.replaceText("%totalhrstaken%", runningtotalTimetaken);
    body.replaceText("%approvalstatus%", approvalstatus);
    body.replaceText("%reasonforreusal%", reasonforreusal);
  }
  doc.saveAndClose();

  MailApp.sendEmail({
    to: requesteremail,
    cc: manageremail,
    bcc: "sboocock@calw.org.uk,jasbury@calw.org.uk",
    subject: "RE: Your request for Medical or Family Emergency Leave",
    htmlBody: "Please see the attached response",
    attachments: [doc.getAs(MimeType.PDF)],
    name: "Leave Approval Notification"
  });
}