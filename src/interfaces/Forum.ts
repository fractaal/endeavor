export interface Forum {
  id:                    number;
  course:                number;
  type:                  string;
  name:                  string;
  intro:                 string;
  introformat:           number;
  introfiles:            any[];
  duedate:               Date | number;
  cutoffdate:            Date | number;
  assessed:              number;
  assesstimestart:       Date | number;
  assesstimefinish:      Date | number;
  scale:                 number;
  grade_forum:           number;
  grade_forum_notify:    number;
  maxbytes:              number;
  maxattachments:        number;
  forcesubscribe:        number;
  trackingtype:          number;
  rsstype:               number;
  rssarticles:           number;
  timemodified:          Date | number;
  warnafter:             number;
  blockafter:            number;
  blockperiod:           number;
  completiondiscussions: number;
  completionreplies:     number;
  completionposts:       number;
  cmid:                  number;
  numdiscussions:        number;
  cancreatediscussions:  boolean;
  lockdiscussionafter:   number;
  istracked:             boolean;
}