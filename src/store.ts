import {eLearnInterface} from './interfaces/eLearn';
import fuseSearch from './search';

interface Store {
  eLearn: eLearnInterface|null;
  search: string;
  searchResults: Record<string,any>;
  settings: {
    showDebugInfo: boolean;
    saveLogin: boolean;
    theme: string;
    loadHiddenCourseData: boolean;
  };
  searchFunction: Function;
  searchTimer: any;
  userDoneTypingOnSearch: boolean;
  fullPageLoadText: string;
  fullPageLoadLog: string[];
  updateAvailable: boolean;
}

const store: Store = {
  eLearn: null,
  search: '',
  searchResults: {},
  settings: {
    showDebugInfo: false,
    saveLogin: false,
    theme: "light-theme",
    loadHiddenCourseData: false,
  },
  searchFunction: fuseSearch,
  searchTimer: null,
  userDoneTypingOnSearch: true,
  fullPageLoadLog: [],
  fullPageLoadText: "",
  updateAvailable: false,
};

export default store;