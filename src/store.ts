import {eLearnInterface, eLearnSession} from './interfaces/eLearn';
import { PathData } from '@/elearn/path-resolution';

import fuseSearch from './search';
import { themes, Theme } from './theme';
import {settings} from './settings';

interface Store {
  eLearn: eLearnInterface|null;
  search: string;
  searchResults: Record<string,any>;
  settings: typeof settings;
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
  settings,
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