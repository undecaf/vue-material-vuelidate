<template>
  <span
    v-if="!validation[constraint]"
    class="md-error"
  >
    <slot />
  </span>
</template>

<script>
export default {
    name: "MdVuelidatedMsg",

    inject: [
        'validation',
        'expression',
    ],

    props: {
        constraint: {
            type: String,
            required: true,
        },
    },

    mounted() {
        if (!this.validation) {
            throw new Error('<md-vuelidated-msg> must be placed inside <md-vuelidated>')
        }

        if (typeof this.validation[this.constraint] === 'undefined') {
            throw new Error(`Vuelidate constraint '${this.constraint}' for '${this.expression}' not found`)
        }
    },
}
</script>
