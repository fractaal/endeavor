/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */

// Required libraries
import got from 'got';
import {CookieJar} from 'tough-cookie';
import {remote} from 'electron';
import {format, formatDistanceStrict} from 'date-fns'
import {transformForPresentation} from './content-presentation';
import capitalize from '../util/capitalize';
import findInArray from '../util/find-in-array';
import updateQueryString from './update-query-string';
import {getCourseVisibility} from '../course-presentation';
import sharedStore from '../store';

// Interfaces
import {eLearnInterface, eLearnSession} from '../interfaces/eLearn';
import { Module, Section } from '@/interfaces/Section';
import { Event } from '@/interfaces/Timeline';
import { CourseMetadata } from '@/interfaces/CourseMetadata';
import { Assignment } from '@/interfaces/Assignment';
import { Forum } from '@/interfaces/Forum';
import { Quiz } from '@/interfaces/Quiz';

// Enums
enum Urgency {
  SAFE = "safe",
  WARN = "warn",
  ALERT = "alert",
  DANGER = "danger"
}

// Runtime stuff
const cookieJar = new CookieJar();
const client = got.extend({cookieJar: cookieJar});
const baseurl = "http://elearn.xu.edu.ph/"; // Base url for requests.
let session: eLearnSession; // Ask for site info upon login

// Format dates and time data in object
function convertRawTimeValuesToDate(object: any): any {
  for (const key in object) {
    if (typeof object[key] == 'object') {
      convertRawTimeValuesToDate(object[key]);
    }

    if ((key.match("date") || key.match("time")) && !key.match("timeduration")) {
      // If the key matches the keys normally assigned to time values (excluding time duration)
      // Transform the element into a date object.
      try {
        object[key] = new Date(object[key] * 1000)
      } catch(e) {
        // Invalid time value. Wipe the key.
        object[key] = null;
      }
    }
  }
  return object; 
}

function urgency(date: Date): Urgency {
  const diff = (Date.now() - date.getTime())/1000
  if (diff > 0) {
    return Urgency.DANGER;
  } else if (diff < 0 && diff > (-3600*24)) {
    return Urgency.ALERT;
  } else if (diff < 0 && diff > (-3600*48)) {
    return Urgency.WARN;
  } else {
    return Urgency.SAFE; 
  }
}

export class ELearn implements eLearnInterface {
  public cache = {
    courses: [],
    coursesMetadata: [],
    buildTime: 0,
  };
  
  /**
   * Logs in a user to the eLearn website. eLearn also
   * has some logintoken functionality that this function
   * automatically handles.
   * @param username Username to pass to eLearn.
   * @param password Password to pass to eLearn.
   */
  async login(username: string, password: string, update: Function): Promise<boolean> {
    try {
      // To obtain a cookie
      await client(`http://elearn.xu.edu.ph/lib/ajax/service.php?info=tool_mobile_get_public_config`);
      const moodleSessionCookie = await cookieJar.getCookies(baseurl);

      remote.session.defaultSession.cookies.set({url: baseurl, name: moodleSessionCookie[0].key, value: moodleSessionCookie[0].value})

      const loginRequest = await client(`${baseurl}/login/token.php`, {
        method: "POST",
        form: {
          username,
          password,
          service: "moodle_mobile_app"
        }
      })

      let token;
      try {
        token = JSON.parse(loginRequest.body).token;
      } catch(err) {
        console.warn("[elearn-api] Login response parse failure: " + err);
        return false;
      }
      
      const siteInfoRequest: Record<string, any> = await this.wsFunction("core_webservice_get_site_info", {}, token);

      session = siteInfoRequest as any;

      // Transform the userpictureurl present in the API response to an address that actually works 😬
      // Change the URL. webservice/pluginfile API endpoint accepts token as a parameter.
      session.userpictureurl = session.userpictureurl.replace("pluginfile", "webservice/pluginfile");

      // Add the token to the query string.
      session.userpictureurl = updateQueryString('token', token, session.userpictureurl);
      
      session.token = token;
      update("Building search cache");
      await this.buildCache(update);
      return true;

    } catch(err) {
      console.warn("[elearn-api] Login request failure: " + err); 
      return false;
    }
  }

  /**
   * Returns the session object generated by the login function
   * You must be logged in before this returns a session object! 
   */
  async getSession(): Promise<eLearnSession> {
    if (session) {
      return session;
    }
  }
  
  /**
   * Calls a Moodle webservice function an awaits the responose. 
   * @param name Name of the function to call moodle
   * @param args Arguments to pass to the function
   * @param token Token to use, in case there is no session object yet (If you're not logged in)
   */
  async wsFunction(name: string, args: {}, token?: string): Promise<any> {
    const useToken = token || session.token;
    try {
      const res = await client(`${baseurl}/webservice/rest/server.php`, {
        method: "POST",
        form: {
          ...args,
          moodlewssettingfilter: true,
          moodlewssettingfileurl: true,
          moodlewsrestformat: "json",
          wsfunction: name,
          wstoken: useToken,
        }
      })
      try {
        const responseObj = JSON.parse(res.body);
        return responseObj;
      } catch(err) {
        console.warn("[elearn-api] wsFunction response parse failure: " + err); 
        return null;
      }
    } catch(err) {
      console.warn("[elearn-api] wsFunction request failure " + err);
      return null; 
    }
  } 

  /**
   * Calls the Moodle webservice to parse this request. Used for more
   * advanced, complicated requests that seem to be chained together
   * (???) I'm reverse engineering the Moodle API, bear with me
   * 
   * Along with the form data, inputs prerequisite arguments such as
   * moodlewsrestformat: json, and the webservice token given by
   * moodle.
   * 
   * @param form Form data to pass to moodle.
   * @param token Token to pass to Moodle, in case no existing session
   * object is present.
   */
  async wsFunctionRaw(form: Record<string, any>, token?: string): Promise<any> {
    const useToken = token || session.token;
    try {
      const res = await client(`${baseurl}/webservice/rest/server.php`, {
        method: "POST",
        form: {
          ...form,
          moodlewssettingfilter: true,
          moodlewssettingfileurl: true,
          moodlewsrestformat: "json",
          wstoken: useToken,
        }
      })

      try {
        const responseObj = JSON.parse(res.body);
        return responseObj
      } catch(err) {
        console.warn("[elearn-api] wsFunctionRaw response parse failure " + err);
        return null;
      }
    } catch(err) {
      console.warn("[elearn-api] wsFunctionRaw request failure " + err);
      return null;
    }
  }

  async getCourses(): Promise<CourseMetadata[]> {
    // You should get an array containing all course information.
    const res = await this.wsFunction("core_enrol_get_users_courses", {userid: session.userid, returnusercount: 1});
    try {
      const courses = res.map(value => {
        const course: CourseMetadata = {
          ...value,
          // We multiply the lastaccess value by 1000 because
          // The Date object takes takes Unix time in ms
          lastaccess: new Date(value.lastaccess*1000),
          /**
           * Moodle does not add the url to it's API response, so we build it here for convenience.
           */
          url: `${baseurl}course/view.php?id=${value.id}`
        }
        return course;
      });
      return courses;
    } catch(err) {
      console.warn("[elearn-api] Parsing course data failed " + err);
      return null;
    }
  }

  async getCourse(id): Promise<CourseMetadata> {
    return findInArray(await this.getCourses(), id);
  }

  async getCourseInfo(courseid: number): Promise<Section[]> {
    const alreadyExisting: CourseMetadata = this.findInCache(courseid);

    if (alreadyExisting) {
      return alreadyExisting.sections;
    }

    const info = {
      forum: [] as Forum[],
      quiz: [] as Quiz[],
      assign: [] as Assignment[],
    }

    // You should get an array containing all entries inside the course.
    const a = this.wsFunctionRaw({
      'courseid': courseid,
      'options[0][name]': 'excludemodules',
      'options[0][value]': '0',
      'options[1][name]': 'excludecontents',
      'options[1][value]': '0',
      'options[2][name]': 'includestealthmodules',
      'options[2][value]': '1',
      'wsfunction': 'core_course_get_contents',}) as any;

    // You should get an array containing forum information. 
    const b = this.wsFunctionRaw({
      'requests[0][function]': 'mod_forum_get_forums_by_courses',
      'requests[0][arguments]': `{"courseids":["${courseid}"]}`,
      'requests[0][settingfilter]': '1',
      'requests[0][settingfileurl]': '1',
      'requests[1][function]': 'core_user_get_user_preferences',
      'requests[1][arguments]': '{"name":"forum_discussionlistsortorder"}',
      'requests[1][settingfilter]': '1',
      'requests[1][settingfileurl]': '1',
      'wsfunction': 'tool_mobile_call_external_functions',}) as any;

    // You should get an array containing quiz information.
    const c = this.wsFunctionRaw({
      'requests[0][function]': 'mod_quiz_get_quizzes_by_courses',
      'requests[0][arguments]': `{"courseids":["${courseid}"]}`,
      'requests[0][settingfilter]': '1',
      'requests[0][settingfileurl]': '1',
      'wsfunction': 'tool_mobile_call_external_functions',}) as any;


    // You should get an array containing asssignment information.
    const d = this.wsFunctionRaw({
      'requests[0][function]': 'mod_assign_get_assignments',
      'requests[0][arguments]': `{"courseids":["${courseid}"]}`,
      'requests[0][settingfilter]': '1',
      'requests[0][settingfileurl]': '1',
      'wsfunction': 'tool_mobile_call_external_functions'}) as any;

    const [entries, forums, quizzes, assignments] = await Promise.all([a,b,c,d])

    info.assign = JSON.parse(assignments.responses[0].data).courses[0].assignments;
    info.quiz = JSON.parse(quizzes.responses[0].data).quizzes;
    info.forum = JSON.parse(forums.responses[0].data);

    // Section-level parsing. (Top-level objects are sections!)
    for (const section of entries) {

      if (section.summary) {
        section.summary = transformForPresentation(section.summary, (await this.getSession()).token);
      }

      // Module-level parsing. (Middle-level objects are modules!)
      section.courseid = courseid;
      section.url = `${baseurl}course/view.php?id=${courseid}&section=${section.section}`;
      for (const module of section.modules) {
        // Add additional data to the object
        module.section = section.section;
        module.courseid = courseid;

        // Inject tokens for any src attributes in description.
        if (module.description) {
          module.description = transformForPresentation(module.description, (await this.getSession()).token);
        }

        // Capitalize the module type for display. 
        module.modnameformatted = capitalize(module.modname);

        /**
         * I need to do this stupid thing because for some reason
         * moodle reports assignments as "assign" instead of just
         * assignment. 🤷‍♂️🤷‍♂️
         */
        if (module.modnameformatted.toLowerCase() == "assign") {
          module.modnameformatted = "Assignment";
        }
        
        if (info[module.modname]) {          
          // Get additional data for this module (if available). 
          const data: Quiz & Assignment & Forum = findInArray(info[module.modname], module.instance);
          
          // If additional data exists...
          if (data) {
            // Mark this module as having additional data (for debug purposes)
            module.hasextradata = true;

            if (data.intro) {
              data.intro = transformForPresentation(data.intro, (await this.getSession()).token);
            }
            
            // Time formatting
            for (const key in data) {
              if (key.match("date") || key.match("time")) {
                /**
                 * If the time value is 0, assume it's invalid and delete the key.
                 */
                if (data[key] == 0) { delete data[key]; } else {
                  /**
                   * eLearn stores time data in unix epoch format in seconds.
                   * We multiply by 1000 so that Javascript accepts it.
                   */
                  data[key] = new Date(data[key] * 1000)
                  
                  // Format time limit in a human way (as words)
                  if (key.match("timelimit")) {
                    module['timelimitformatted'] = `⌛ Good for ${formatDistanceStrict(Date.now(), Date.now() - (data[key]))}`;
                  } else if (key.match("timeopen")) {
                    module.timeopenformatted = `✔ Opens ${format(data[key], "hh:mma, MMMM dd")}`;
                  } else if (key.match("timeclose")) {
                    module.timecloseformatted = `❌ Closes ${format(data[key], "hh:mma, MMMM dd")}`;
                  }
                }
              }

              // Add the additional data into the module object.
              module[key] = data[key];
            }
            
            // Styling function definition
            const style = (key) => {
              const styling = urgency(module[key] as Date);
              module.styling = styling;
              module.duedateformatted = format(module[key], "hh:mma, MMMM dd, yyyy");
              module.duedatedistanceformatted = formatDistanceStrict(module[key], Date.now(), {addSuffix: true});
            }

            // Styling & formatting pass
            if (module.duedate) {
              style("duedate");
            } else if (module.cutoffdate) {
              style("cutoffdate");
            } else if (module.gradingduedate) {
              style("gradingduedate");
            } else if (module.timeclose) {
              style("timeclose");
            }

          }
        }
      }
    }
    return entries;
  }

  async getSection(courseid: number, sectionNumber: number): Promise<Section> {
    const course: CourseMetadata = findInArray(this.cache.coursesMetadata, courseid);
    for (const section of course.sections) {
      if (section.section == sectionNumber) return section;
    }
  }

  async getModule(courseid: number, instance: number): Promise<Module> {
    const course: CourseMetadata = findInArray(this.cache.coursesMetadata, courseid);
    let found;
    for (const section of course.sections) {
      found = findInArray(section.modules, instance);
      if (found) break;
    }
    return found; 
  }

  async getTimeline(): Promise<Event[]> {
    const weekAgo = (Date.now()/1000) - (60*60*24*7)
    const res = await this.wsFunctionRaw({
      timesortfrom: weekAgo.toFixed(0),
      limitnum: 50,
      moodlewssettingfilter: 'true',
      moodlewssettingfileurl: 'true',
      wsfunction: 'core_calendar_get_action_events_by_timesort',
    });
    const events: Event[] = res.events;

    for (let event of events) {
      event = convertRawTimeValuesToDate(event);
      event.styling = urgency(event.timesort as Date)
      event.formatteddistance = formatDistanceStrict(event.timesort, Date.now(), {addSuffix: true});
      event.formattedtime = format(event.timesort, "🕘 hh:mma, MMMM dd, yyyy");
    }

    return events;
  }

  async buildCache(update: Function): Promise<void> {
    const startTime = Date.now();
    console.log("[elearn-api] 📃 Building search cache")
    console.time("search cache build time");
    update("⌛ Getting course metadata...");
    let coursesMetadata = await this.getCourses();
    update("⌛ Getting course sections & modules...")
    // const courses = await Promise.all(coursesMetadata.map(course => this.getCourseInfo(course.id)));
    const courses: any = await Promise.all(coursesMetadata.map(course => {
      return new Promise((resolve, reject) => {
        if (getCourseVisibility(course.id) || sharedStore.settings.loadHiddenCourseData) {
          this.getCourseInfo(course.id).then(courseinfo => {
            update("✅ Loaded " + course.shortname);
            resolve(courseinfo);
          })
        } else {
          update("⏩ Skipped " + course.shortname + " (was hidden)");
          resolve([]);
        }
      })
    }));

    update("⌛ Transforming data...");
    coursesMetadata = coursesMetadata.map((courseMetadata, index) => {
      return {
        ...courseMetadata,
        sections: courses[index],
      }
    })

    this.cache.courses = courses;
    this.cache.coursesMetadata = coursesMetadata;
    console.log("[elearn-api] 📃 Search cache build complete");
    console.timeEnd("search cache build time");
    update("💖 Complete!");
    this.cache.buildTime = Date.now() - startTime;
    await new Promise(r => setTimeout(r, 1000));
  }

  findInCache(courseid: number): CourseMetadata {
    return findInArray(this.cache.coursesMetadata, courseid);
  }

  async getActualGrade(type: string, id: number) {
    let grade: number;
    if (type == "quiz") {
      grade = (await this.wsFunction("mod_quiz_get_user_best_grade", {quizid: id})).grade;
    } else if (type == "assign") {
      const response = await this.wsFunction("mod_assign_get_submission_status", {assignid: id});
      /**
       * Moodle weirdness means I have to do response.feedback.grade.grade. Don't ask me why.
       */
      try {
        grade = response.feedback.grade.grade; // ???????????????????? 
      } catch(e) {
        grade = 0;
      }
    }

    console.log(grade);
    
    return grade;
  }

  debugData() {
    const returnData = {
      buildtime: this.cache.buildTime,
      loadedcourses: 0,
      loadedsections: 0,
      loadedmodules: 0,
      loadedmoduleswithdata: 0,
    };

    for (const course of this.cache.coursesMetadata as CourseMetadata[]) {
      returnData.loadedcourses++;
      for (const section of course.sections) {
        returnData.loadedsections++;
        for (const module of section.modules) {
          returnData.loadedmodules++;
          if (module.hasextradata) returnData.loadedmoduleswithdata++;
        }
      }
    }

    return returnData;
  }
}

console.log("[elearn-api] ✅ Initialization complete")
