<template>
  <transition name="modal">
    <div class="floating-editor" ref="parent" v-if="show" style="height: 500px;">
      <movable target="parent">
        <div class="draggable">
          <div>
            <div>
              <h2 class="nospacing" style="display: inline-block; font-weight: 300; opacity: 0.5;">SCRATCHPAD - </h2>
              <h2 class="nospacing" style="display: inline-block; margin-left: 10px; font-weight: 500; opacity: 1;">{{title}}</h2>
            </div>
          </div>
        </div>
      </movable>
      <button @click="$emit('close', editor.getHTML())" class="roundButton danger" style="position: absolute; top: 5px; right: 10px;"><fai icon="times"/></button>
      <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }" style="margin: 40px 0 0 0;">
        <div class="menubar">

          <button
            class="roundButton"
            :class="{ 'active': isActive.bold() }"
            @click="commands.bold"
          >
            <fai icon="bold" />
          </button>

          <button
            class="roundButton"
            :class="{ 'active': isActive.italic() }"
            @click="commands.italic"
          >
            <fai icon="italic" />
          </button>

          <button
            class="roundButton"
            :class="{ 'active': isActive.strike() }"
            @click="commands.strike"
          >
            <fai icon="strikethrough" />
          </button>

          <button
            class="roundButton"
            :class="{ 'active': isActive.underline() }"
            @click="commands.underline"
          >
            <fai icon="underline" />
          </button>

          <button
            class="roundButton"
            :class="{ 'active': isActive.heading({ level: 1 }) }"
            @click="commands.heading({ level: 1 })"
          >
            H1
          </button>

          <button
            class="roundButton"
            :class="{ 'active': isActive.heading({ level: 2 }) }"
            @click="commands.heading({ level: 2 })"
          >
            H2
          </button>

          <button
            class="roundButton"
            :class="{ 'active': isActive.heading({ level: 3 }) }"
            @click="commands.heading({ level: 3 })"
          >
            H3
          </button>

          <button
            class="roundButton"
            :class="{ 'active': isActive.bullet_list() }"
            @click="commands.bullet_list"
          >
            <fai icon="list-ul" />
          </button>

          <button
            class="roundButton"
            :class="{ 'active': isActive.ordered_list() }"
            @click="commands.ordered_list"
          >
            <fai icon="list-ol" />
          </button>

          <button
            class="roundButton"
            :class="{ 'active': isActive.blockquote() }"
            @click="commands.blockquote"
          >
            <fai icon="quote-left" />
          </button>

          <button
            class="roundButton"
            @click="commands.horizontal_rule"
          >
            <fai icon="ruler-horizontal" />
          </button>

          <button
            class="roundButton"
            @click="commands.undo"
          >
            <fai icon="undo" />
          </button>

          <button
            class="roundButton"
            @click="commands.redo"
          >
            <fai icon="redo" />
          </button>

        </div>
      </editor-menu-bar>
      <div class="floating-editor-textarea">
        <editor-content :editor="editor"/>
      </div>
    </div>
  </transition>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import {
  Blockquote,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Italic,
  Link,
  Strike,
  Underline,
  History,
} from 'tiptap-extensions'

export default {
  name: "FloatingEditor",
  data() {
    return {
      editor: null,
      editorChange: false,
    };
  },
  props: ['value', 'title', 'show'],
  components: {
    EditorContent,
    EditorMenuBar,
  },
  mounted() {
    this.editor = new Editor({
      onUpdate: ({ getHTML }) => {
        this.editorChange = true;
        this.$emit("input", getHTML());
      },
      content: this.value,
      extensions: [
        new Blockquote(),
        new BulletList(),
        new HardBreak(),
        new Heading({ levels: [1, 2, 3] }),
        new HorizontalRule(),
        new ListItem(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new Link(),
        new Bold(),
        new Italic(),
        new Strike(),
        new Underline(),
        new History(),
      ]
    })
  },
  beforeDestroy() {
    this.editor.destroy();
  },
  watch: {
    value(val) {
      if (this.editor && !this.editorChange) {
        this.editor.setContent(val, true);
      }
      this.editorChange = false;
    },
  }
};
</script>