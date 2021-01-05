<template>
  <div class="daemon">
    <transition-group name="modal">
      <floating-editor v-for="scratchpad in scratchpads" :key="scratchpad.id"
        :show="true"
        :title="scratchpad.name"
        :focused="scratchpad.focused"
        v-model="scratchpad.content"
        @close="closeScratchpad(scratchpad.id)"
        style="pointer-events: auto !important;"
        :style="scratchpad.focused ? 'z-index: 150' : 'z-index: 100'"
        @editor-clicked="focusScratchpad(scratchpad.id)"
      />
    </transition-group>
  </div>
</template>

<script>
import { openScratchpad, closeScratchpad, toggleScratchpad, focusScratchpad } from '../scratchpad/manager';
import scratchpads from '../scratchpad/manager';

import { Bus } from '../main';
import FloatingEditor from './FloatingEditor.vue';

export default {
  name: "Scratchpads",
  created() {
  
    Bus.$on("open-scratchpad", (id, name) => openScratchpad(id, name));
    Bus.$on("close-scratchpad", id => closeScratchpad(id));
    Bus.$on("toggle-scratchpad", (id, name) => toggleScratchpad(id, name));
  },
  components: {
    FloatingEditor  
  },
  data() {
    return {
      scratchpads,
    };
  },
  methods: {
    closeScratchpad: id => closeScratchpad(id),
    focusScratchpad: id => focusScratchpad(id),
  },
};
</script>