/*eslint no-prototype-builtins: "off"*/

import fs from 'fs';
import path from 'path';
import Notification, {NotificationType} from '../interfaces/Notification';
import findInArray from '../util/find-in-array';

export function diff(oldCache, newCache) {
  const notifs: Notification[] = [];

  /*
  const oldCache = JSON.parse(fs.readFileSync(path.join(__dirname, 'cache.json'), {encoding: "utf-8"}));
  const newCache = JSON.parse(fs.readFileSync(path.join(__dirname, 'cache2.json'), {encoding: "utf-8"}));
  */

  console.log(`[diff] Performing diff...`)
  // Additions and updates to a course
  for (const course of newCache.coursesMetadata) {

    // If the course already existed, nothing changed
    const oldCourse = findInArray(oldCache.coursesMetadata, course.id);
    if (oldCourse) {

      // Additions to sections
      for (const section of course.sections) {
        // If the section already exists, check for updates only within the section object
        const oldSection = findInArray(oldCourse.sections, section.id);
        if (oldSection) {

          if (
            section.name !== oldSection.name ||
            section.summary !== oldSection.summary
          ) {
            notifs.push({
              title: `${section.name} was changed`,
              text: `${course.fullname}`,
              type: NotificationType.UPDATE,
              sectionId: section.section,
              courseId: course.id,
            })
          }

          // Additions to modules
          for (const module of section.modules) {
            // If the module already exists, check for updates only within the module object
            const oldModule = findInArray(oldSection.modules, module.id);
            if (oldModule) {

              if (
                module.name !== oldModule.name ||
                module.description !== oldModule.description ||
                module.intro !== oldModule.intro
              ) {
                notifs.push({
                  title: `${module.name} was changed`,
                  text: `in ${section.name} - ${course.fullname}`,
                  type: NotificationType.UPDATE,
                  moduleId: module.instance,
                  sectionId: section.section,
                  courseId: course.id,
                })
              }
            
            
            // If the module didn't exist, it was newly added
            } else {
              notifs.push({
                title: `${module.name} was added`,
                text: `in ${section.name} - ${course.fullname}`,
                type: NotificationType.ADD,
                moduleId: module.instance,
                sectionId: section.section,
                courseId: course.id,
              })
            }
          }

          // Removal of modules
          for (const module of oldSection.modules) {
            if (!findInArray(section.modules, module.id)) {
              notifs.push({
                title: `${module.name} was deleted`,
                text: `in ${section.name} - ${course.fullname}`,
                type: NotificationType.DELETE,
                moduleId: module.instance,
                sectionId: section.section,
                courseId: course.id,
              })
            }
          }


        // If the section didn't exist, it was newly added
        } else {
          notifs.push({
            title: `${section.name} was added`,
            text: `${course.fullname}`,
            type: NotificationType.ADD,
            sectionId: section.section,
            courseId: course.id,
          })
        }
      }

      // Removal of sections
      for (const section of oldCourse.sections) {
        if (!findInArray(course.sections, section.id)) {
          notifs.push({
            title: `${section.name} was deleted`,
            text: `${course.fullname}`,
            type: NotificationType.DELETE,
            // sectionId: section.section,
            courseId: course.id,
          })
        }
      }

      
    // If the course did not exist before, it was newly added
    } else {
      notifs.push({
        title: `${course.fullname} was added`,
        type: NotificationType.ADD,
        courseId: course.id,
      })
    }
  }

  // Removals of courses
  for (const course of oldCache.coursesMetadata) {
    // If the course existed in old, but doesn't anymore in new, it was deleted
    if (!findInArray(newCache.coursesMetadata, course.id)) {
      notifs.push({
        title: `${course.fullname} was removed`,
        type: NotificationType.DELETE,
      })
    }
  }
  
  return notifs;
}
