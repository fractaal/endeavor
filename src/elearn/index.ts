// Required libraries
import got from 'got';

// Interfaces
import {Course, eLearnInterface, eLearnSession} from '../interfaces';

// Runtime stuff
const client = got.extend();
const baseurl = "http://elearn.xu.edu.ph/"; // Base url for requests.
let session: eLearnSession; // Ask for site info upon login

// Utility functions
function findInArray(array: Array<any>, id: number) {
  for (const element of array) {
    if (element.id == id) return element;
  }
}

export class ELearn implements eLearnInterface {
  /**
   * Logs in a user to the eLearn website. eLearn also
   * has some logintoken functionality that this function
   * automatically handles.
   * @param username Username to pass to eLearn.
   * @param password Password to pass to eLearn.
   */
  async login(username: string, password: string): Promise<boolean> {
    try {
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
      session.token = token;
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

  async getCourses(): Promise<Course[]> {
    // You should get an array containing all course information.
    const res = await this.wsFunction("core_enrol_get_users_courses", {userid: session.userid, returnusercount: 1});
    try {
      const courses = res.map(value => {
        const course: Course = {
          displayname: value.displayname,
          fullname: value.fullname,
          shortname: value.shortname,
          id: value.id,
          progress: value.progress,
          // We multiply the lastaccess value by 1000 because
          // The Date object takes takes Unix time in ms
          lastaccess: new Date(value.lastaccess*1000),
        }
        return course;
      });
      return courses;
    } catch(err) {
      console.warn("[elearn-api] Parsing course data failed " + err);
      return null;
    }
  }

  async getCourseInfo(courseid: string): Promise<Record<string,any>> {
    // You should get an array containing all entries inside the course.
    const res = await this.wsFunctionRaw({
      'courseid': courseid,
      'options[0][name]': 'excludemodules',
      'options[0][value]': '0',
      'options[1][name]': 'excludecontents',
      'options[1][value]': '0',
      'options[2][name]': 'includestealthmodules',
      'options[2][value]': '1',
      'wsfunction': 'core_course_get_contents',
    });

    const info = {
      forum: [],
      quiz: [],
      assignment: []
    }

    // You should get an array containing forum information. 
    try {
      const res = await this.wsFunctionRaw({
        'requests[0][function]': 'mod_forum_get_forums_by_courses',
        'requests[0][arguments]': `{"courseids":["${courseid}"]}`,
        'requests[0][settingfilter]': '1',
        'requests[0][settingfileurl]': '1',
        'requests[1][function]': 'core_user_get_user_preferences',
        'requests[1][arguments]': '{"name":"forum_discussionlistsortorder"}',
        'requests[1][settingfilter]': '1',
        'requests[1][settingfileurl]': '1',
        'wsfunction': 'tool_mobile_call_external_functions',
      })

      info.forum = JSON.parse(res.responses[0].data);
    } catch(err) {
      console.warn("[elearn-api] Failed attempting to get detailed forum information");
    }

    // You should get an array containing quiz information.
    try {
      const res = await this.wsFunctionRaw({
        'requests[0][function]': 'mod_quiz_get_quizzes_by_courses',
        'requests[0][arguments]': `{"courseids":["${courseid}"]}`,
        'requests[0][settingfilter]': '1',
        'requests[0][settingfileurl]': '1',
        'wsfunction': 'tool_mobile_call_external_functions',
      })
      info.quiz = JSON.parse(res.responses[0].data).quizzes;
    } catch(err) {
      console.warn("[elearn-api] Failed attempting to get detailed quiz information " + err);
    }

    // You should get an array containing asssignment information.
    try {
      const res = await this.wsFunctionRaw({
        'requests[0][function]': 'mod_assign_get_assignments',
        'requests[0][arguments]': `{"courseids":["${courseid}"]}`,
        'requests[0][settingfilter]': '1',
        'requests[0][settingfileurl]': '1',
        'wsfunction': 'tool_mobile_call_external_functions',
      })
      info.assignment = JSON.parse(res.responses[0].data).courses[0].assignments;
    } catch(err) {
      console.warn("[elearn-api] Failed attempting to get detailed assignment information");
    }
    
    // Section-level parsing. (Top-level objects are sections!)
    for (const section of res) {
      // Module-level parsing. (Middle-level objects are modules!)
      for (const module of section.modules) {
        // Transform them based on what type they are
        // Fix later, stupid code (DONT REPEAT YOURSELF!)
        if (module.modname == "assign") module.modname = "assignment" // Because endeavor uses assignment instead of assign
        try {
          const data = findInArray(info[module.modname], parseInt(module.instance));
          if (data) {
            // Transform time data...
            for (const key in data) {
              if (key.match("date") || key == "timeopen" || key == "timeclose") {
                /**
                 * eLearn stores time data in unix epoch format in seconds.
                 * We multiply by 1000 so that Javascript accepts it.
                 */
                data[key] = new Date(data[key] * 1000)
              }
              module[key] = data[key];
            }
          } else {
            console.warn("[elearn-api] WARN: More information on " + module.name + " not found...");
          }
        } catch(err) {
          console.warn(`[elearn-api] WARN: No info on ${module.name} of ID ${module.instance} of type {${module.modname}}`)
        }
      }
    }

    return res;
  }
}

console.log("[elearn-api] ✅ Initialization complete")
