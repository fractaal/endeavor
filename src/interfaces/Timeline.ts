export interface Timeline {
  events:  Event[];
  firstid: number;
  lastid:  number;
}

export interface Event {
  id:                      number;
  name:                    string;
  description:             string;
  descriptionformat:       number;
  section:                 number;
  date:                    Date;
  location:                string;
  categoryid:              null;
  groupid:                 null;
  userid:                  number;
  repeatid:                null;
  eventcount:              null;
  component:               string;
  modulename:              string;
  instance:                number;
  eventtype:               string;
  timestart:               Date | number;
  timeduration:            Date | number;
  timesort:                Date | number;
  visible:                 number;
  timemodified:            Date | number;
  icon:                    Icon;
  course:                  Course;
  subscription:            Subscription;
  canedit:                 boolean;
  candelete:               boolean;
  deleteurl:               string;
  editurl:                 string;
  viewurl:                 string;
  formattedtime:           string;
  formatteddistance:       string; 
  isactionevent:           boolean;
  iscourseevent:           boolean;
  iscategoryevent:         boolean;
  groupname:               null;
  normalisedeventtype:     string;
  normalisedeventtypetext: string;
  action:                  Action;
  url:                     string;
  styling:                 string;
}

export interface Action {
  name:          string;
  url:           string;
  itemcount:     number;
  actionable:    boolean;
  showitemcount: boolean;
}

export interface Course {
  id:              number;
  fullname:        string;
  shortname:       string;
  idnumber:        string;
  summary:         string;
  summaryformat:   number;
  startdate:       number;
  enddate:         number;
  visible:         boolean;
  fullnamedisplay: string;
  viewurl:         string;
  courseimage:     string;
  progress:        number;
  hasprogress:     boolean;
  isfavourite:     boolean;
  hidden:          boolean;
  showshortname:   boolean;
  coursecategory:  string;
}

export interface Icon {
  key:       string;
  component: string;
  alttext:   string;
}

export interface Subscription {
  displayeventsource: boolean;
}
