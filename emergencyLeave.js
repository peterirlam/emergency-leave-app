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