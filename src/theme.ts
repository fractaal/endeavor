declare const __static: string;

import fs from 'fs';
import path from 'path';
import store from './store';
import { remote } from 'electron';

const data = remote.app.getPath("userData");

export interface Theme {
  filename: string;
  filepath: string;
  displayName: string;
  author: string;
  type: string;
  version: string;
  endeavorVersion: string;
  default: string;
  setActive();
}

export const themes: Theme[] = [];

function getThemeMetadata(data: string) {
  const lines = data.split("\n");
  const result = {
    displayName: "none",
    author: "none",
    type: "none",
    version: "none",
    endeavorVersion: "none",
    default: "none",
  }

  for (const line of lines) {
    const tokens = line.split("=").map(line => line.trim());
    if (result[tokens[0]]) {
      result[tokens[0]] = tokens[1];
    }
  }

  return result;
}

function addTheme(filename: string, filepath: string, data: string) {
  const metadata = getThemeMetadata(data);

  const alreadyExists = themes.reduce((acc, curr) => curr.displayName == metadata.displayName, false);

  if (alreadyExists) {
    console.log(`[themes] WARN: ${metadata.displayName} already exists! Aborting...`);
    return;
  }

  themes.push({
    ...metadata,
    filename,
    filepath,
    setActive: () => {
      document.getElementById("vars").setAttribute("href", filepath)
      store.settings.theme = metadata.displayName;
    },
  })
}

function addThemesFromFolder(folderPath: string, isInternal: boolean) {
  const truePath = isInternal ? path.join(__static, "/themes") : folderPath;
  if (!fs.existsSync(truePath)) fs.mkdirSync(truePath);

  const files = fs.readdirSync(truePath).filter(file => file.indexOf(".css") !== -1);

  for (const file of files) {
    addTheme(file, path.join(truePath, file), fs.readFileSync(path.join(truePath, file), {encoding: "utf-8"}));
  }
}

addThemesFromFolder("", true);
addThemesFromFolder(path.join(data, "/themes"), false);

fs.watch(path.join(data, "/themes"), () => {
  console.log("Themes folder changed! Updating...");
  addThemesFromFolder(path.join(data, "/themes"), false);
})

setTimeout(() => {
  let themeSet = false;

  for (const theme of themes) {
    if (store.settings.theme == theme.displayName) {
      theme.setActive();
      themeSet = true;
    }
  }
  
  if (!themeSet) themes[0].setActive();
}, 10);
