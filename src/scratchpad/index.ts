import Store from 'electron-store'; 

const scratchpads = new Store({name: "scratchpads"});

/**
 * Sets scratchpad content to be retrieved later. 
 * @param instance ID of the module to set the scratchpad content for.
 * @param content The content string (is html).
 */
export function setScratchpadContent(instance: string, content: string): void {
  if (content) {
    scratchpads.set(instance, content);
  } else {
    console.warn(`[scratchpad] Content for ${instance} is undefined, not setting`);
  }

  return;
}

export function getScratchpadContent(instance: string): string {
  return scratchpads.get(instance, "") as string; 
}