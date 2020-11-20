import {Course, eLearnInterface} from './interfaces';

interface Store {
  eLearn: eLearnInterface|null;
  cache: {
    courses: Course[];
  };
  search: string;
  settings: {
    showDebugInfo: boolean;
    saveLogin: boolean;
  };
}

const store: Store = {
  eLearn: null,
  cache: {
    courses: [],
  },
  search: '',
  settings: {
    showDebugInfo: false,
    saveLogin: false,
  }
};

export function addCourseToCache(newCourse: Course): boolean {
  for (const course of store.cache.courses) {
    if (course.id == newCourse.id) return true;
  }
  store.cache.courses.push(newCourse); 
}

export function updateCourseInCache(updatedCourse: Course): boolean {
  for (let course of store.cache.courses) {
    if (course.id == updatedCourse.id) {
      course = updatedCourse;
      return true;
    }
  }
  return false;
}

export function getCourseFromCache(id: string|number): Course {
  for (const course of store.cache.courses) {
    if (course.id == id) {
      return course;
    }
  }
}

export default store;