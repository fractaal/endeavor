import Store from 'electron-store';

const store = new Store({name: "course-presentation"});

export function reset() {
  store.reset();
}

export function toggleCourseVisibility(id: number) {
  const _id = id.toString();
  console.log(store.get(_id));
  if (store.get(_id) === undefined) {
    store.set(_id, false);
  } else if (store.get(_id)) {
    store.set(_id, false);
  } else {
    store.set(_id, true);
  }
}

export function getCourseVisibility(id: number): boolean {
  if (store.get(id.toString()) === undefined) {
    return true;
  } else {
    return store.get(id.toString()) as boolean;
  }
}