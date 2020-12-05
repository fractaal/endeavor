import sharedStore from './store';
import Fuse from 'fuse.js';
import { CourseMetadata } from './interfaces/CourseMetadata';

let fuse: Fuse<CourseMetadata>;

const options = {  
  keys: [
    "fullname",
    "sections.name",
    "sections.summary",
    "sections.modules.name",
  ],
  includeScore: true,
  includeMatches: true,
  threshold: 0.4,
}


export default function search(term) {
  if (!fuse) {
    fuse = new Fuse(sharedStore.eLearn.cache.coursesMetadata, options); 
  }
  const rawResult = fuse.search(term);

  const courseResults = [];
  const sectionResults = [];
  const moduleResults = [];

  for (const i in rawResult) {
    const topLevelMatch = rawResult[i];
    courseResults.push(topLevelMatch);

    for (const j in topLevelMatch.matches) {
      const match = topLevelMatch.matches[j];

      let counter = 0;

      if (match.key == "sections.name" || match.key == "sections.summary") {
        for (const idx in topLevelMatch.item.sections) {
          if (idx as any == match.refIndex) sectionResults.push({...topLevelMatch.item.sections[idx]});
        }
      } else {
        for (const section of topLevelMatch.item.sections) {
          for (const module of section.modules) {
            if (counter == match.refIndex) { 
              console.log(counter, match.refIndex, counter == match.refIndex); 
              moduleResults.push({...module})
            }
            counter++;
          }
        }
      }
    }
  }

  const result = {
    courseResults,
    sectionResults,
    moduleResults,
  }

  return result;
}