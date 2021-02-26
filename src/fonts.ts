import store from './store';

export function resetFont() {
  console.log("[fonts] Resetting font");
  store.settings.font = "Manrope";
  document.getElementById("font").innerHTML = `
  @import url('https://fonts.googleapis.com/css?family=Manrope:100,200,300,400,500,600,700,800,900');
  * {
    font-family: Manrope, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  `
}

export function setFont(name: string) {
  console.log("[fonts] Setting font to " + name);
  store.settings.font = name;
  document.getElementById("font").innerHTML = `
  @import url('https://fonts.googleapis.com/css?family=${name}:100,200,300,400,500,600,700,800,900');
  * {
    font-family: ${name}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  `
}

export function getFont() {
  return store.settings.font;
}

export function initFont() {
  setFont(store.settings.font);
}