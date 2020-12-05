export interface Assignment {
  id:                          number;
  cmid:                        number;
  course:                      number;
  name:                        string;
  nosubmissions:               number;
  submissiondrafts:            number;
  sendnotifications:           number;
  sendlatenotifications:       number;
  sendstudentnotifications:    number;
  duedate:                     Date | number;
  allowsubmissionsfromdate:    Date | number;
  grade:                       number;
  timemodified:                Date | number;
  completionsubmit:            number;
  cutoffdate:                  Date | number;
  gradingduedate:              Date | number;
  teamsubmission:              number;
  requireallteammemberssubmit: number;
  teamsubmissiongroupingid:    number;
  blindmarking:                number;
  hidegrader:                  number;
  revealidentities:            number;
  attemptreopenmethod:         string;
  maxattempts:                 number;
  markingworkflow:             number;
  markingallocation:           number;
  requiresubmissionstatement:  number;
  preventsubmissionnotingroup: number;
  configs:                     Config[];
  intro:                       string;
  introformat:                 number;
  introfiles:                  any[];
  introattachments:            any[];
}

export interface Config {
  plugin:  Plugin;
  subtype: Subtype;
  name:    Name;
  value:   string;
}

export enum Name {
  Commentinline = "commentinline",
  Enabled = "enabled",
  Filetypeslist = "filetypeslist",
  Maxfilesubmissions = "maxfilesubmissions",
  Maxsubmissionsizebytes = "maxsubmissionsizebytes",
}

export enum Plugin {
  Comments = "comments",
  Editpdf = "editpdf",
  File = "file",
}

export enum Subtype {
  Assignfeedback = "assignfeedback",
  Assignsubmission = "assignsubmission",
}
