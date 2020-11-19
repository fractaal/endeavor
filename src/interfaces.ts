/**
 * Entry types:
 * Section - Has a section key 
 * 
 * Forum - Has key modname of value forum
 * Quiz - Has key modname of value quiz
 * Assignment - Has key modname of value assign
 * 
 * Folder - Has key modnanme of value folder, important: contents
 * URL - Has - has key modname of value url, important: contents
 * Resource - Has key modname of value resource, important: contents
 * 
 * Content - Lists files / urls
 * 
 * INSTANCE KEY for all these things = (TYPE) ID
 */

export interface Entry {
  name: string;
  id: string;
  courseid: string;
  elearnurl: string;
  description: string;
};

export interface Section extends Entry {
  section: number;
};

export interface Forum extends Entry {
  duedate?: Date;
  cutoffdate?: Date;
};

export interface Quiz extends Entry {
  timeopen?: Date;
  timeclose?: Date;
  timelimit?: number;
  grade?: number;
  attempts: number;
  maxattempts: number;
  overduehandling?: string;
  preferredbehaviour: string;
  navmethod: string; // FREE or SEQUENTIAL???
}

export interface Assignment extends Entry {
  submitted?: boolean;
  teamsubmission: boolean;
  duedate: Date;
  gradingduedate: Date;
  allowsubmissiondate: Date;
}

export interface Resource extends Entry {
  contents: Content[];
}

export interface URL extends Entry {
  contents: Content[];
}

export interface Folder extends Entry {
  contents: Content[];
}

export interface Content {
  type: string;
  fileurl: string;
  filesize: number;
  filename: string;
  author: string;
  license: string;
}

export interface Course {
  id: string;
  shortname: string;
  fullname: string;
  displayname: string;
  progress: number;
  lastaccess: Date;
  info?: Array<Record<string,any>>
};



export interface eLearnSession {
  token: string;
  userid: string;
  username: string;
  firstname: string;
  lastname: string;
  fullname: string;
  userpictureurl: string;
  downloadFiles: boolean;
  uploadFiles: boolean;
  release: string;
  version: string;
}

export interface eLearnInterface {
  login(username: string, password: string): Promise<boolean>;
  wsFunction(name: string, args: Record<string, any>, token?: string): Promise<any>;
  getSession(): Promise<eLearnSession>;
  getCourses(): Promise<Course[]>;
  getCourseInfo(courseid: string): Promise<Record<string,any>>;
  getTimeline(): Promise<Record<string,any>>;
  //getEvents(): Promise<Entry[]>; 
}