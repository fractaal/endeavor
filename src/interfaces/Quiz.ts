export interface Quiz {
  id:                    number;
  course:                number;
  coursemodule:          number;
  name:                  string;
  intro:                 string;
  introformat:           number;
  introfiles:            any[];
  timeopen:              Date | number;
  timeclose:             Date | number;
  timelimit:             Date | number;
  preferredbehaviour:    string;
  attempts:              number;
  grademethod:           number;
  decimalpoints:         number;
  questiondecimalpoints: number;
  sumgrades:             number;
  grade:                 number;
  hasfeedback:           number;
  section:               number;
  visible:               number;
  groupmode:             number;
  groupingid:            number;
}
