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
    "sections.modules.modnameformatted",
    "sections.modules.intro",
    "sections.modules.description"
  ],
  includeScore: true,
  includeMatches: true,
  threshold: 0.4
}


export default function search(term) {
  if (!fuse) {
    fuse = new Fuse(sharedStore.eLearn.cache.coursesMetadata, options); 
  }
  const rawResult = fuse.search(term);
  console.log(rawResult); 

  const courseResults = [];
  const sectionResults = [];
  const moduleResults = [];
  
  // Result processing
  for (let a = 0; a < rawResult.length; a++) {
    const topLevelMatch = rawResult[a];
    courseResults.push(topLevelMatch.item);

    for (let b = 0; b < topLevelMatch.matches.length; b++) {
      const match = topLevelMatch.matches[b];
      if (match.key == "sections.name" || match.key == "sections.summary") {
        for (const section of topLevelMatch.item.sections) {
          if (section.name == match.value || section.summary == match.value) sectionResults.push({...section});
        }
      } else if (match.key == "sections.modules.name" || match.key == "sections.modules.intro" || match.key == "sections.modules.description" || match.key == "sections.modules.modnameformatted") {
        for (const section of topLevelMatch.item.sections) {
          for (const module of section.modules) {
            if (module.name == match.value || module.description == match.value) moduleResults.push({...module});
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

  console.log(result);
  return result;
}