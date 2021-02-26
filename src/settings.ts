import Store from 'electron-store';
import { remote } from 'electron';

const settingsStore = new Store({
  name: 'endeavor',
  defaults: {
  showDebugInfo: false,
  saveLogin: false,
  theme: "",
  font: "Manrope",
  numColumnsInCourseView: 1,
  showActivityDescriptionsOnCards: true,
  version: remote.app.getVersion(),
  loadHiddenCourseData: false,
  autoUpdateData: true,
  zoomLevel: 1,
}})

export const {store: settings} = settingsStore;

export function save(settings: typeof settingsStore.store) {
  console.log("Saving settings: ");
  console.log(settings);
  settingsStore.store = settings;
}
