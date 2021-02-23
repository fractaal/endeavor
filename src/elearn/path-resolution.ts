import { CourseMetadata } from "@/interfaces/CourseMetadata";
import { Module, Section } from "@/interfaces/Section";
import findInArray from "@/util/find-in-array";

export interface PathData {
  name: string;
  path: string;
}

export function resolve(path: string, data: {coursesMetadata: CourseMetadata[]; buildTime: number}): PathData[] {
  const tokens = path.split("/");
  const result: PathData[] = [];

  let course: CourseMetadata;
  let section: Section;
  let module: Module;

  /**
   * Index 2 - course ID
   * Index 3 - section no.
   * Index 4 - instance ID.
   */

  if (tokens[2]) {
    course = findInArray(data.coursesMetadata, parseInt(tokens[2]));
    if (course) {
      result.push({
        name: course.shortname,
        path: `/COURSES/${tokens[2]}`
      })
    }
  }

  if (tokens[3] && course) {
    section = course.sections[tokens[3]];
    if (section) {
      result.push({
        name: section.name,
        path: `/COURSES/${tokens[2]}/${tokens[3]}`
      })
    }
  }

  if (tokens[4] && section) {
    // console.log("module find")
    module = findInArray(section.modules, tokens[4] as unknown as number);

    if (module) {
      result.push({
        name: module.name,
        path: `/COURSES/${tokens[2]}/${tokens[3]}/${tokens[4]}`
      })
    }
  }

  return result;

}