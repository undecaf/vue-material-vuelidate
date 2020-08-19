<template>
  <component
    :is="field"
    v-model="model.$model"
    v-bind="$attrs"
    :class="{ 'md-invalid': model.$error }"
    v-on="$listeners"
    @focusout.native="model.$touch()"
  >
    <slot />
    <span
      v-for="(msg, index) in activeMessages"
      :key="index"
      class="md-error"
    >
      {{ msg }}
    </span>
  </component>
</template>

<script>
import Vue from 'vue'
import MdVuelidatedMsg from './md-vuelidated-msg.vue'

export default {
    name: 'MdVuelidated',

    install(Vue, options) {
        if (this.install.installed) {
            return
        }
        this.install.installed = true

        Vue.component('MdVuelidated', this)
        Vue.component('MdVuelidatedMsg', MdVuelidatedMsg)
    },

    props: {
        field: {
            type: String,
            default: 'md-field',
            validator: field => /^md-(field|autocomplete|chips|datepicker)$/.test(field),
        },

        model: {
            type: Object,
            required: true,
        },

        messages: {
            type: Object,
            default: () => {},
        },
    },

    computed: {
        activeMessages() {
            return Object.keys(Object(this.messages))
                .filter(constraint => !this.model[constraint])
                .map(constraint => this.messages[constraint])
        },
    },
}
</script>

<style>
/* Shows the md-autocomplete menu in the foreground */
.md-menu-content {
    z-index: 15 !important;
}
</style>
