export enum NotificationType {
  ADD = "ADD",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export default interface Notification {
  title: string;
  text?: string;
  type: NotificationType;
  moduleId?: number;
  sectionId?: number;
  courseId?: number;
}