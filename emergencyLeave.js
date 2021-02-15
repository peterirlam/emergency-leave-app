function getManager() {
  var currentUser = Session.getActiveUser();
  // var group = GroupsApp.getGroupByEmail("pensionwise@googlegroups.com");
  if (currentUser == "admin@calancs.org.uk") {
    return "Guy Simpson";
  } else if ((currentUser == "gsimpson@calancs.org.uk") || (currentUser == "sbookcock@calancs.org.uk") || (currentUser == "aoshea@calancs.org.uk")) {
    return "Diane Gradwell";
  } else if (GroupsApp.getGroupByEmail("pensionwise@calancs.org.uk").hasUser(currentUser.getEmail())) {
    return "Steve Dent";
  } else if (GroupsApp.getGroupByEmail("debt@calancs.org.uk").hasUser(currentUser.getEmail())) {
    return "Emma Sylvester";
  } else {
    return "Guy Simpson";
  }
}

function doGet(e) {
  var currentuser = Session.getActiveUser().getEmail().replace("calancs", "calw");
  var manager = getManager();
  var html = HtmlService.createTemplateFromFile('Form');
  html.requestoremail = currentuser;
  html.manager = manager;
  return html.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  //email_001 = replyaddr.replace("calancs","calw");
}

function doPost(e) {
  if (typeof e !== 'undefined')
    var reasonForTimeTaken = e.parameter.hdnTimeTakenReason;
  var manager = e.parameter.managername;
  var reasonForTimeTakenThankyou = reasonForTimeTaken;
  if (reasonForTimeTaken == "Worked at alternate time") {
    reasonForTimeTakenThankyou = "to work at an alternative time";
  } else {
    reasonForTimeTakenThankyou = "for " + reasonForTimeTaken;
  }
  var name = e.parameter.name_001.replace(/^\s+|\s+$/g, '');
  var email = e.parameter.email_001.replace(/^\s+|\s+$/g, '');
  var runningtotalTimetaken = e.parameter.runningtotalTimetaken;
  var TimeTakenList = e.parameter.hdnTimeTakenList;
  var runningtotalTimeoffered = e.parameter.runningtotalTimeoffered;
  var TimeOfferedList = e.parameter.hdnTimeOfferedList;
  sendreport(name, email, reasonForTimeTaken, TimeTakenList, runningtotalTimetaken, TimeOfferedList, runningtotalTimeoffered, manager);
  var html = HtmlService.createTemplateFromFile('Thankyou');
  html.reasonForTimeTaken = reasonForTimeTakenThankyou;
  html.name = name;
  html.email = email;
  html.manager = manager;
  html.runningtotalTimetaken = runningtotalTimetaken;
  html.TimeTakenList = TimeTakenList;
  return html.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function isUndefined(arg) {
  return typeof arg === 'undefined';
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

function sendreport(name, email, reasonForTimeTaken, TimeTakenList, runningtotalTimetaken, TimeOfferedList, runningtotalTimeoffered, manager) {
  var manageremail = "admin@calw.org.uk";
  if (manager == "Steve Dent") {
    manageremail = "sdent@calw.org.uk";
  } else if (manager == "Emma Sylvester") {
    manageremail = "esylvester@calw.org.uk";
  } else if (manager == "Guy Simpson") {
    manageremail = "gsimpson@calw.org.uk";
  } else if (manager == "Diane Gradwell") {
    manageremail = "dgradwell@calw.org.uk";
  }
  //Set up destination folder
  var dstFolderId = DriveApp.getFolderById("15eD817P6ybztt6arbYYLGX4Hlk9XK-XF");
  var timetakenlistArray = TimeTakenList.split("@");
  var dateTaken = "\r";
  var timeTaken = "\r";
  var hrsTaken = "\r";

  for (i = 0; i < timetakenlistArray.length; i++) {
    dateTaken += Trim(timetakenlistArray[i].split("|")[0]) + '\r';
    timeTaken += Trim(timetakenlistArray[i].split("|")[1]) + '\r';
    hrsTaken += Trim(timetakenlistArray[i].split("|")[2]) + '\r';
  }

  var runningtotalTimetakenArray = runningtotalTimetaken.split(":");
  if (runningtotalTimetakenArray[1] == "00") {
    runningtotalTimetaken = runningtotalTimetakenArray[0] + "hrs ";
  } else {
    runningtotalTimetaken = runningtotalTimetakenArray[0] + "hrs " + runningtotalTimetakenArray[1] + "mins";
  }
  var docid;
  var doc;
  var body;
  var todaysdate = new Date();
  var dd = todaysdate.getDate();
  var mm = todaysdate.getMonth() + 1;
  var yyyy = todaysdate.getFullYear();

  if (reasonForTimeTaken == "Worked at alternate time") {
    docid = DriveApp.getFileById("1zQCTkBp37cc3WodE9Zb9EsZ7v9CdHyAI6xM8oENHSmI").makeCopy("Leavers_Letter_" + Utilities.formatDate(new Date(), "GMT+1", "dd-MMM-yyyy") + "_" + name, dstFolderId).getId()
    doc = DocumentApp.openById(docid);
    body = doc.getActiveSection();
    var timeofferedlistArray = TimeOfferedList.split("@");
    var dateOffered = "\r";
    var timeOffered = "\r";
    var hrsOffered = "\r";

    for (i = 0; i < timeofferedlistArray.length; i++) {
      dateOffered += Trim(timeofferedlistArray[i].split("|")[0]) + '\r';
      timeOffered += Trim(timeofferedlistArray[i].split("|")[1]) + '\r';
      hrsOffered += Trim(timeofferedlistArray[i].split("|")[2]) + '\r';
    }
    var runningtotalTimeofferedArray = runningtotalTimeoffered.split(":");
    if (runningtotalTimeofferedArray[1] == "00") {
      runningtotalTimeoffered = runningtotalTimeofferedArray[0] + "hrs ";
    } else {
      runningtotalTimeoffered = runningtotalTimeofferedArray[0] + "hrs " + runningtotalTimeofferedArray[1] + "mins";
    }
    body.replaceText("%todaysdate%", dd + "/" + mm + "/" + yyyy);
    body.replaceText("%fullname%", name);
    body.replaceText("%email%", email);
    body.replaceText("%manager%", manager);
    body.replaceText("%datetaken%", dateTaken);
    body.replaceText("%timetaken%", timeTaken);
    body.replaceText("%hrstaken%", hrsTaken);
    body.replaceText("%totalhrstaken%", runningtotalTimetaken);
    body.replaceText("%dateoffered%", dateOffered);
    body.replaceText("%timeoffered%", timeOffered);
    body.replaceText("%hrsoffered%", hrsOffered);
    body.replaceText("%totalhrsoffered%", runningtotalTimeoffered);
  } else {
    docid = DriveApp.getFileById("1Twt4L_huG84myt8uUiy9Ey5OzyxRC3uDzwt1VDXCZzc").makeCopy("Leavers_Letter_" + Utilities.formatDate(new Date(), "GMT+1", "dd-MMM-yyyy") + "_" + name, dstFolderId).getId()
    doc = DocumentApp.openById(docid);
    body = doc.getActiveSection();
    body.replaceText("%todaysdate%", dd + "/" + mm + "/" + yyyy);
    body.replaceText("%fullname%", name);
    body.replaceText("%email%", email);
    body.replaceText("%reason%", reasonForTimeTaken);
    body.replaceText("%manager%", manager);
    body.replaceText("%datetaken%", dateTaken);
    body.replaceText("%timetaken%", timeTaken);
    body.replaceText("%hrstaken%", hrsTaken);
    body.replaceText("%totalhrstaken%", runningtotalTimetaken);
  }
  doc.saveAndClose();
  GmailApp.sendEmail('sboocock@calw.org.uk', 'Time taken off for Medical or Family Emergency Reasons', 'Please see the attached report.', {
    cc: manageremail,
    bcc: 'pirlam@calw.org.uk',
    attachments: [doc.getAs(MimeType.PDF)],
    name: 'Time taken off for Medical or Family Emergency Reasons'
  });
  //GmailApp.sendEmail('pirlam@calw.org.uk', 'Time taken off for Medical or Family Emergency Reasons', 'Please see the attached report.', {bcc:'pirlam@calw.org.uk', attachments: [doc.getAs(MimeType.PDF)],name: 'Time taken off for Medical or Family Emergency Reasons' });
}