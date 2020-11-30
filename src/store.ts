import {eLearnInterface} from './interfaces/eLearn';
import fuseSearch from './search';

interface Store {
  eLearn: eLearnInterface|null;
  search: string;
  theme: string;
  searchResults: [];
  settings: {
    showDebugInfo: boolean;
    saveLogin: boolean;
  };
  searchFunction: Function;
  searchTimer: any;
  userDoneTypingOnSearch: boolean;
}

const store: Store = {
  eLearn: null,
  search: '',
  theme: "light-theme",
  searchResults: [],
  settings: {
    showDebugInfo: false,
    saveLogin: false,
  },
  searchFunction: fuseSearch,
  searchTimer: null,
  userDoneTypingOnSearch: true,
};

export default store;