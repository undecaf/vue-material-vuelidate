<template>
  <span
    v-if="!constraint"
    class="md-error"
  >
    <slot />
  </span>
</template>

<script>
import Vue from "vue"

export default {
    name: "MdVuelidatedMsg",

    props: {
        constraint: {
            type: Boolean,
            required: true,
        },
    },
}
</script>
