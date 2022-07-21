function getManager() {
  let currentUser = Session.getActiveUser();
  // let group = GroupsApp.getGroupByEmail("pensionwise@googlegroups.com");
  if (currentUser == "admin@calancs.org.uk") {
    return "Guy Simpson";
  } else if (
    currentUser == "gsimpson@calancs.org.uk" ||
    currentUser == "sbookcock@calancs.org.uk" ||
    currentUser == "lkeenan@calancs.org.uk" ||
    currentUser == "mdeslandes@calancs.org.uk" ||
    currentUser == "aoshea@calancs.org.uk" ||
    currentUser == "sdent@calancs.org.uk" ||
    currentUser == "esylvester@calancs.org.uk"
  ) {
    return "Diane Gradwell";
  } else if (
    GroupsApp.getGroupByEmail("pensionwise@calancs.org.uk").hasUser(
      currentUser.getEmail()
    )
  ) {
    return "Steve Dent";
  } else if (
    GroupsApp.getGroupByEmail("debt@calancs.org.uk").hasUser(
      currentUser.getEmail()
    )
  ) {
    return "Emma Sylvester";
  } else {
    return "Guy Simpson";
  }
}

function doGet(e) {
  let currentuser = Session.getActiveUser()
    .getEmail()
    .replace("calancs", "calw");
  let manager = getManager();
  let html = HtmlService.createTemplateFromFile("Form");
  html.requestoremail = currentuser;
  html.manager = manager;
  return html
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  //email_001 = replyaddr.replace("calancs","calw");
}

function doPost(e) {
  if (typeof e !== "undefined")
    let reasonForTimeTaken = e.parameter.hdnTimeTakenReason;
  let manager = e.parameter.managername;
  let reasonForTimeTakenThankyou = reasonForTimeTaken;
  if (reasonForTimeTaken == "Worked at alternate time") {
    reasonForTimeTakenThankyou = "to work at an alternative time";
  } else {
    reasonForTimeTakenThankyou = "for " + reasonForTimeTaken;
  }
  let name = e.parameter.name_001.replace(/^\s+|\s+$/g, "");
  let email = e.parameter.email_001.replace(/^\s+|\s+$/g, "");
  let runningtotalTimetaken = e.parameter.runningtotalTimetaken;
  let TimeTakenList = e.parameter.hdnTimeTakenList;
  let runningtotalTimeoffered = e.parameter.runningtotalTimeoffered;
  let TimeOfferedList = e.parameter.hdnTimeOfferedList;

  sendreport(
    name,
    email,
    reasonForTimeTaken,
    TimeTakenList,
    runningtotalTimetaken,
    TimeOfferedList,
    runningtotalTimeoffered,
    manager
  );
  let html = HtmlService.createTemplateFromFile("Thankyou");
  html.reasonForTimeTaken = reasonForTimeTakenThankyou;
  html.name = name;
  html.email = email;
  html.manager = manager;
  html.runningtotalTimetaken = runningtotalTimetaken;
  html.TimeTakenList = TimeTakenList;
  return html
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function isUndefined(arg) {
  return typeof arg == "undefined";
}

function IsMissing(x) {
  return isUndefined(x);
}

function CStr(v) {
  return v === null || IsMissing(v) ? " " : v.toString();
}

function Trim(v) {
  return LTrim(RTrim(v));
}

function LTrim(s) {
  return CStr(s).replace(/^\s\s*/, "");
}

function RTrim(s) {
  return CStr(s).replace(/\s\s*$/, "");
}

function sendreport(
  name,
  email,
  reasonForTimeTaken,
  TimeTakenList,
  runningtotalTimetaken,
  TimeOfferedList,
  runningtotalTimeoffered,
  manager
) {
  let manageremail = "admin@calw.org.uk";
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
  let dstFolderId = DriveApp.getFolderById("15eD817P6ybztt6arbYYLGX4Hlk9XK-XF");
  let timetakenlistArray = TimeTakenList.split("@");
  let dateTaken = "\r";
  let timeTaken = "\r";
  let hrsTaken = "\r";

  for (i = 0; i < timetakenlistArray.length; i++) {
    dateTaken += Trim(timetakenlistArray[i].split("|")[0]) + "\r";
    timeTaken += Trim(timetakenlistArray[i].split("|")[1]) + "\r";
    hrsTaken += Trim(timetakenlistArray[i].split("|")[2]) + "\r";
  }
  let runningtotalTimetakenArray = runningtotalTimetaken.split(":");
  if (runningtotalTimetakenArray[1] == "00") {
    runningtotalTimetaken = runningtotalTimetakenArray[0] + "hrs ";
  } else {
    runningtotalTimetaken =
      runningtotalTimetakenArray[0] +
      "hrs " +
      runningtotalTimetakenArray[1] +
      "mins";
  }
  let docid;
  let doc;
  let body;
  let todaysdate = new Date();
  let dd = todaysdate.getDate();
  let mm = todaysdate.getMonth() + 1;
  let yyyy = todaysdate.getFullYear();

  if (reasonForTimeTaken == "Worked at alternate time") {
    docid = DriveApp.getFileById("1zQCTkBp37cc3WodE9Zb9EsZ7v9CdHyAI6xM8oENHSmI")
      .makeCopy(
        "Medical_Leave_Request_" +
          Utilities.formatDate(new Date(), "GMT+1", "dd-MMM-yyyy") +
          "_" +
          name,
        dstFolderId
      )
      .getId();
    doc = DocumentApp.openById(docid);
    body = doc.getActiveSection();

    let timeofferedlistArray = TimeOfferedList.split("@");
    let dateOffered = "\r";
    let timeOffered = "\r";
    let hrsOffered = "\r";

    for (i = 0; i < timeofferedlistArray.length; i++) {
      dateOffered += Trim(timeofferedlistArray[i].split("|")[0]) + "\r";
      timeOffered += Trim(timeofferedlistArray[i].split("|")[1]) + "\r";
      hrsOffered += Trim(timeofferedlistArray[i].split("|")[2]) + "\r";
    }
    let runningtotalTimeofferedArray = runningtotalTimeoffered.split(":");
    if (runningtotalTimeofferedArray[1] == "00") {
      runningtotalTimeoffered = runningtotalTimeofferedArray[0] + "hrs ";
    } else {
      runningtotalTimeoffered =
        runningtotalTimeofferedArray[0] +
        "hrs " +
        runningtotalTimeofferedArray[1] +
        "mins";
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
    TimeOfferedList = "notapplicable";
    docid = DriveApp.getFileById("1Twt4L_huG84myt8uUiy9Ey5OzyxRC3uDzwt1VDXCZzc")
      .makeCopy(
        "Medical_Leave_Request_" +
          Utilities.formatDate(new Date(), "GMT+1", "dd-MMM-yyyy") +
          "_" +
          name,
        dstFolderId
      )
      .getId();
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
  let nameEncoded = encodeURIComponent(name);
  let emailEncoded = encodeURIComponent(email);
  let managerEncoded = encodeURIComponent(manager);
  let runningtotalTimetakenEncoded = encodeURIComponent(runningtotalTimetaken);
  let reasonForTimeTakenEncoded = encodeURIComponent(reasonForTimeTaken);
  if (TimeOfferedList == "notapplicable") {
    let runningtotalTimeofferedEncoded = encodeURIComponent("notapplicable");
  } else {
    let runningtotalTimeofferedEncoded = encodeURIComponent(
      runningtotalTimeoffered
    );
  }
  let timeTakenListEncoded = encodeURIComponent(TimeTakenList);
  let timeOfferedListEncoded = encodeURIComponent(TimeOfferedList);

  doc.saveAndClose();

  MailApp.sendEmail({
    to: "sboocock@calw.org.uk",
    bcc: "pirlam@calw.org.uk",
    subject: "Request for Medical or Family Emergency Leave",
    htmlBody:
      "<br>Please click <a href='https://script.google.com/a/calancs.org.uk/macros/s/AKfycbxdYVreAZgKUc8sbExgcA8sKwWF76UIuPs3XJ_MUkvU722xNd4/exec?requestername=" +
      nameEncoded +
      "&requesteremail=" +
      emailEncoded +
      "&timeTakenList=" +
      timeTakenListEncoded +
      "&timeOfferedList=" +
      timeOfferedListEncoded +
      "&runningtotalTimetaken=" +
      runningtotalTimetakenEncoded +
      "&runningtotalTimeoffered=" +
      runningtotalTimeofferedEncoded +
      "&reasonForTimeTaken=" +
      reasonForTimeTakenEncoded +
      "&managername=" +
      manager +
      "&manageremail=" +
      manageremail +
      "'>HERE</a> to approve or deny the request shown in the document attached below.<br><br><br>",
    attachments: [doc.getAs(MimeType.PDF)],
    name: "Leave Approval Request",
  });
  //GmailApp.sendEmail('sboocock@calw.org.uk', 'Time taken off for Medical or Family Emergency Reasons', 'Please see the attached report.', {cc: manageremail ,bcc:'pirlam@calw.org.uk', attachments: [doc.getAs(MimeType.PDF)],name: 'Time taken off for Medical or Family Emergency Reasons' });
  //GmailApp.sendEmail('pirlam@calw.org.uk', 'Time taken off for Medical or Family Emergency Reasons', 'Please see the attached report\n\nhttps://script.google.com/a/calancs.org.uk/macros/s/AKfycbxdYVreAZgKUc8sbExgcA8sKwWF76UIuPs3XJ_MUkvU722xNd4/exec?requestername=' + nameEncoded + '&requesteremail=' + emailEncoded + '&timeTakenList=' + timeTakenListEncoded + '&timeOfferedList=' + timeOfferedListEncoded + '&runningtotalTimetaken=' + runningtotalTimetakenEncoded + '&runningtotalTimeoffered=' + runningtotalTimeofferedEncoded + '&reasonForTimeTaken=' + reasonForTimeTakenEncoded, {bcc:'pirlam@calw.org.uk', attachments: [doc.getAs(MimeType.PDF)],name: 'Time taken off for Medical or Family Emergency Reasons' });
}
