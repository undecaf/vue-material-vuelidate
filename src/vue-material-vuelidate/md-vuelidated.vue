<template>
  <component
    :is="field"
    v-model="model.$model"
    v-bind="$attrs"
    :class="{ 'md-invalid': model.$error }"
    v-on="$listeners"
    @focusout.native="touch()"
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

// focusout events will not trigger validation
// within this period of time after this component
// and all its children have been mounted
const focusoutDelay = 50

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

    data() {
        return {
            touchStart: Infinity,
        }
    },

    computed: {
        activeMessages() {
            return Object.keys(Object(this.messages))
                .filter(constraint => !this.model[constraint])
                .map(constraint => this.messages[constraint])
        },
    },

    mounted() {
        // Wait until children have been mounted
        this.$nextTick(() => this.touchStart = Date.now() + focusoutDelay)
    },

    methods: {
        touch() {
            if(Date.now() >= this.touchStart) {
                this.model.$touch()
            }
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
