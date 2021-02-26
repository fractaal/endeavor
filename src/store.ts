import {eLearnInterface, eLearnSession} from './interfaces/eLearn';
import { PathData } from '@/elearn/path-resolution';

import fuseSearch from './search';
import { themes, Theme } from './theme';

interface Store {
  eLearn: eLearnInterface|null;
  search: string;
  searchResults: Record<string,any>;
  settings: {
    showDebugInfo: boolean;
    saveLogin: boolean;
    theme: string;
    loadHiddenCourseData: boolean;
    autoUpdateData: boolean;
    zoomLevel: number;
  };
  searchFunction: Function;
  searchTimer: any;
  userDoneTypingOnSearch: boolean;
  fullPageLoadText: string;
  fullPageLoadLog: string[];
  updateAvailable: boolean;
  debugLog: string[];
  pathData: PathData[];
  session: eLearnSession;
  themes: Theme[];
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
    autoUpdateData: true,
    zoomLevel: 1,
  },
  searchFunction: fuseSearch,
  searchTimer: null,
  userDoneTypingOnSearch: true,
  fullPageLoadLog: [],
  fullPageLoadText: "",
  updateAvailable: false,
  debugLog: [],
  pathData: [],
  session: {} as eLearnSession,
  themes,
};

export default store;