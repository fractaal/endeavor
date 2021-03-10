import findInArray from '../util/find-in-array'
import store from '../store';
import { CourseMetadata } from '@/interfaces/CourseMetadata';
import { Section } from '@/interfaces/Section';

// eslint-disable-next-line
type AsyncReturnType<T extends (...args: any) => any> =
// eslint-disable-next-line
  T extends (...args: any) => Promise<infer U> ? U :
// eslint-disable-next-line
  T extends (...args: any) => infer U ? U :
// eslint-disable-next-line
  any

async function getGradesFromSection(section: Section) {
  const result = {
    link: `/courses/${section.courseid}/${section.section}`,
    title: section.name,
    id: section.id,
    maxGrade: 0,
    grade: 0,
    modules: [] as {
      link: string;
      name: string;
      modnameformatted: string;
      grade: number;
      maxGrade: number;
      feedback?: string;
      date?: Date;
    }[]
  }

  await Promise.all(section.modules.map(async module => {
    if (module.grade && module.completion && module.completiondata.state != 0) {
      const feedback = await store.eLearn.getFeedback(module.modname, module.instance);

      feedback.grade = parseInt(feedback.grade as unknown as string);
      if (isNaN(feedback.grade)) feedback.grade = 0;

      result.maxGrade += parseInt(module.grade);
      result.grade += feedback.grade;
      result.modules.push({
        link: `/courses/${module.courseid}/${module.section}/${module.instance}`,
        name: module.name,
        modnameformatted: module.modnameformatted,
        grade: feedback.grade,
        maxGrade: module.grade,
        date: feedback.gradedDate,
        feedback: feedback.feedbackComments,
      })

    }
  }))

  return result;
}

async function getGradesFromCourse(course: CourseMetadata) {
  const result = {
    title: course.shortname,
    id: course.id,
    maxGrade: 0,
    grade: 0,
    sections: [] as AsyncReturnType<typeof getGradesFromSection>[]
  }

  await Promise.all(course.sections.map(async section => {
    const data = await getGradesFromSection(section);
    result.maxGrade += data.maxGrade;
    result.grade += data.grade;

    result.sections.push(data);
  }))

  result.sections = result.sections.filter(section => section.maxGrade != 0);

  return result;
}

export default async function processOverview(courseid: number, sectionid?: number) {
  const course: CourseMetadata = findInArray(store.eLearn.cache.coursesMetadata, courseid);

  if (sectionid) {
    const section = course.sections[sectionid];
    return await getGradesFromSection(section)
  } else if (course) {
    return await getGradesFromCourse(course)
  } else {
    console.warn(`Course ID ${courseid} does not exist in eLearn cache.`);
    return {};
  }
}

