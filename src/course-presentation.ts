import Store from 'electron-store';

const store = new Store({name: "course-presentation"});

export function toggleCourseVisibility(id) {
  if (store.get(id)) {
    store.set(id, false);
    return false;
  } else {
    store.set(id, true);
    return true;
  }
}

export function getCourseVisibility(id): boolean {
  return store.get(id) as boolean;
}