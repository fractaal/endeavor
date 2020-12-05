import { Section } from './Section';

export interface CourseMetadata {
  id:                    number;
  shortname:             string;
  fullname:              string;
  displayname:           string;
  enrolledusercount:     number;
  idnumber:              string;
  visible:               number;
  summary:               string;
  summaryformat:         number;
  format:                string;
  showgrades:            boolean;
  lang:                  string;
  enablecompletion:      boolean;
  completionhascriteria: boolean;
  completionusertracked: boolean;
  category:              number;
  progress:              number;
  completed:             boolean;
  startdate:             Date | number;
  enddate:               Date | number;
  marker:                number;
  lastaccess:            Date | number;
  isfavourite:           boolean;
  hidden:                boolean;
  overviewfiles:         Overviewfile[];
  sections:              Section[];
  styling:               string;
}

export interface Overviewfile {
  filename:     string;
  filepath:     string;
  filesize:     number;
  fileurl:      string;
  timemodified: Date | number;
  mimetype:     string;
}
