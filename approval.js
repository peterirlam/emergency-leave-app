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