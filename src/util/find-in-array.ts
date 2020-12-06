export default function findInArray(array: Array<any>, id: number) {
  for (const element of array) {
    if (element.id == id || element.cmid == id || element.instance == id || element.coursemodule == id) return element;
  }
}