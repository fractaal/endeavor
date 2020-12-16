export interface Page {
  page:           PageClass;
  answerids:      number[];
  jumps:          number[];
  filescount:     number;
  filessizetotal: number;
}

export interface PageClass {
  id:                 number;
  lessonid:           number;
  prevpageid:         number;
  nextpageid:         number;
  qtype:              number;
  qoption:            number;
  layout:             number;
  display:            number;
  timecreated:        number;
  timemodified:       number;
  title?:             string;
  contents?:          string;
  contentsformat?:    number;
  displayinmenublock: boolean;
  type:               number;
  typeid:             number;
  typestring:         Typestring;
}

export enum Typestring {
  Content = "Content",
  Matching = "Matching",
}
