<template>
  <card 
  :content="section.summary"
  :internalLink="`/courses/${course.id}/${section.section}`"
  >
    <template v-slot:header>
      <div class="flex-row">
        <fai size="2x" icon="bars"/>
        <p style="margin: 0;">{{section.name}}</p>
      </div>
      <slot name="extra"/>
    </template>
  </card>
</template>

<script>
import Card from './Card.vue';

export default {
  name: "SectionCard",
  components: { Card },
  props: {
    section: {
      type: Object,
      required: true,
    },
    course: {
      type: Object,
      required: true,
    }
  }
}
</script>