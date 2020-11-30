export interface Section {
  id:                  number;
  name:                string;
  visible:             number;
  summary:             string;
  summaryformat:       number;
  section:             number;
  hiddenbynumsections: number;
  uservisible:         boolean;
  modules:             Module[];
  courseid:            number;
}

export interface Module {
  id:                  number;
  url:                 string;
  name:                string;
  instance:            number;
  visible:             number;
  uservisible:         boolean;
  visibleoncoursepage: number;
  modicon:             string;
  modname:             Modname;
  modplural:           Modplural;
  indent:              number;
  onclick:             string;
  afterlink:           null | string;
  customdata:          string;
  noviewlink:          boolean;
  completion:          number;
  description?:        string;
  completiondata?:     Completiondata;
  contents?:           Content[];
  contentsinfo?:       Contentsinfo;
  styling:             string;
  courseid:            number;
  section:             number;
}

export interface Completiondata {
  state:         number;
  timecompleted: Date | number;
  overrideby:    null;
  valueused:     boolean;
}

export interface Content {
  type:            Type;
  filename:        string;
  filepath:        Filepath | null;
  filesize:        number;
  fileurl:         string;
  timecreated:     Date | number;
  timemodified:    Date | number;
  sortorder:       number | null;
  userid:          number | null;
  author:          Author | null;
  license:         License | null;
  mimetype?:       string;
  isexternalfile?: boolean;
}

export enum Author {
  PatrickMack = "Patrick Mack",
}

export enum Filepath {
  Empty = "/",
}

export enum License {
  Allrightsreserved = "allrightsreserved",
}

export enum Type {
  File = "file",
  URL = "url",
}

export interface Contentsinfo {
  filescount:     number;
  filessize:      number;
  lastmodified:   number;
  mimetypes:      string[];
  repositorytype: string;
}

export enum Modname {
  Assign = "assign",
  Folder = "folder",
  Forum = "forum",
  Quiz = "quiz",
  Resource = "resource",
  URL = "url",
}

export enum Modplural {
  Assignments = "Assignments",
  Files = "Files",
  Folders = "Folders",
  Forums = "Forums",
  Quizzes = "Quizzes",
  URLs = "URLs",
}
