import {Module, Section} from './Section';
import {CourseMetadata} from './CourseMetadata';
import { Event } from './Timeline';

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
  login(username: string, password: string, update: Function): Promise<boolean>;
  wsFunction(name: string, args: Record<string, any>, token?: string): Promise<any>;
  getSession(): Promise<eLearnSession>;
  getCourses(): Promise<CourseMetadata[]>;
  getCourseInfo(courseid: number, update: Function): Promise<Section[]>;
  getSection(courseid: number, sectionNumber: number): Promise<Section>;
  getModule(courseid: number, instance: number): Promise<Module>;
  getTimeline(): Promise<Event[]>;
  buildCache(update: Function): Promise<void>; 
  debugData(): Record<string,any>;
  cache: {
    courses: Section[][];
    coursesMetadata: CourseMetadata[];
  };
  getActualGrade(type: string, id: number): Promise<number>;
}