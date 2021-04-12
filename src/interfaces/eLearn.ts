import {Module, Section} from './Section';
import {CourseMetadata} from './CourseMetadata';
import { Event } from './Timeline';
import { Discussion } from './Discussion';
import { Page } from './Page';
import { BookPage } from './BookPage';
import { PagesData } from '@/elearn/objects/page-data';
import { ELearn } from '@/elearn';
import Notification from './Notification';

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
  getCourseInfo(courseid: number, overwrite: boolean): Promise<Section[]>;
  getSection(courseid: number, sectionNumber: number): Promise<Section>;
  getModule(courseid: number, instance: number): Promise<Module>;
  getTimeline(): Promise<Event[]>;
  buildCache(update: Function): Promise<ELearn['cache']>;
  debugData(): Record<string,any>;
  getFeedback(type: string, id: number): Promise<{
    grade: number;
    gradeForDisplay: string;
    gradedDate: Date;
    feedbackComments: string;
  }>;
  getLessonPages(lessonid: string): Promise<PagesData>;
  getBookPages(courseid: string, bookid: string): Promise<PagesData>;
  cache: {
    coursesMetadata: CourseMetadata[];
    buildTime: number;
  };
  notifications: Notification[];
}