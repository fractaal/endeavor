import Store from 'electron-store'; 

const scratchpads = new Store({name: "scratchpads"});

/**
 * Sets scratchpad content to be retrieved later. 
 * @param id ID of the module to set the scratchpad content for.
 * @param content The content string (is html).
 */
export function setScratchpadContent(id: string, content: string): void {
  id = id.toString();
  if (content) {
    scratchpads.set(id, content);
  } else {
    console.warn(`[scratchpad] Content for ${id} is undefined, not setting`);
  }

  return;
}

export function getScratchpadContent(id: string): string {
  id = id.toString();
  return scratchpads.get(id, "") as string; 
}