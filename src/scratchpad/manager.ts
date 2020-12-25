import { getScratchpadContent, setScratchpadContent } from './content';
import Vue from 'vue';

interface Scratchpad {
  id: number;
  content: string;
  focused: boolean;
  name: string;
}

const scratchpadHistory = [];
const scratchpads: Record<string,Scratchpad> = {};

function addToScratchpadHistory(id) {
  if (scratchpadHistory[0] != id) {
    scratchpadHistory.unshift(id);
  }
}

export default scratchpads; 

export function focusScratchpad(id: string) {
  console.log(`[scratchpad] Focusing scratchpad ${id}`)
  if (scratchpads[id]) {
    scratchpads[id].focused = true;

    for (const otherId in scratchpads) {
      const scratchpad = scratchpads[otherId];
      if (otherId != id) {
        scratchpad.focused = false;
      }
    }
  }

  addToScratchpadHistory(id);
}

export function openScratchpad(id: string, name: string) {
  console.log(`[scratchpad] Opening scratchpad ${id}`);
  const content = getScratchpadContent(id);
  Vue.set(scratchpads, id, {id, content, focused: true, name});

  focusScratchpad(id);
}

export function closeScratchpad(id: string) {
  console.log(`[scratchpad] Closing scratchpad ${id}`);
  setScratchpadContent(id, scratchpads[id].content);
  Vue.delete(scratchpads, id);

  scratchpadHistory.shift()
  focusScratchpad(scratchpadHistory[0]);
}

export function toggleScratchpad(id: string, name: string) {
  console.log(`[scratchpad] Toggling scratchpad ${id} was ${!!scratchpads[id]} is now ${!scratchpads[id]}`);
  if (scratchpads[id]) {
    closeScratchpad(id);
  } else {
    openScratchpad(id, name);
  }
}