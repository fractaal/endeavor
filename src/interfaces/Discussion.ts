export interface Discussion {
  id:             number;
  subject:        string;
  replysubject:   string;
  message:        string;
  messageformat:  number;
  author:         Author;
  discussionid:   number;
  hasparent:      boolean;
  children:       Discussion[];
  parentid:       number | null;
  timecreated:    number;
  unread:         null;
  isdeleted:      boolean;
  isprivatereply: boolean;
  haswordcount:   boolean;
  wordcount:      null;
  charcount:      null;
  capabilities:   Capabilities;
  urls:           { [key: string]: null | string };
  attachments:    any[];
  tags:           any[];
  html:           HTML;
}

export interface Author {
  id:        number;
  fullname:  string;
  isdeleted: boolean;
  groups:    any[];
  urls:      Urls;
}

export interface Urls {
  profile:      string;
  profileimage: string;
}

export interface Capabilities {
  view:              boolean;
  edit:              boolean;
  delete:            boolean;
  split:             boolean;
  reply:             boolean;
  selfenrol:         boolean;
  export:            boolean;
  controlreadstatus: boolean;
  canreplyprivately: boolean;
}

export interface HTML {
  rating:           null;
  taglist:          null;
  authorsubheading: string;
}
