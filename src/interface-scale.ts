import store from './store';
import {webFrame} from 'electron';

export function increaseZoom() {
  console.log("[interface-scale] Increasing zoom factor " + store.settings.zoomLevel)
  store.settings.zoomLevel += 0.05;
  webFrame.setZoomFactor(store.settings.zoomLevel);
}

export function decreaseZoom() {
  console.log("[interface-scale] Decreasing zoom factor " + store.settings.zoomLevel)
  store.settings.zoomLevel -= 0.05;
  webFrame.setZoomFactor(store.settings.zoomLevel);
}

export function resetZoom() {
  console.log("[interface-scale] Resetting scale");
  store.settings.zoomLevel = 1;
  webFrame.setZoomFactor(store.settings.zoomLevel);
}

export function setZoom(value) {
  console.log("[interface-scale] Setting zoom factor " + store.settings.zoomLevel)
  store.settings.zoomLevel = value;
  webFrame.setZoomFactor(store.settings.zoomLevel);
}

export function initZoom() {
  console.log("[interface-scale] Initializing zoom factor " + store.settings.zoomLevel)
  webFrame.setZoomFactor(store.settings.zoomLevel);
}