<template>
  <div class="modal-mask" v-if="show">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <slot name="header">
            <h3>{{header}}</h3>
          </slot>
        </div>

        <div class="modal-body">
          <slot name="body">
            {{body}}
          </slot>
        </div>

        <div class="modal-footer">
            <EndeavorButton @click="$emit('close')">👍 Okay</EndeavorButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EndeavorButton from './EndeavorButton.vue';

export default {
  name: "Modal",
  components: {
    EndeavorButton,
  },
  props: {
    body: String,
    header: String,
    show: Boolean,
  },
}
</script>

<style>

</style>