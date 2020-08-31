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
    ],

    props: {
        constraint: {
            type: String,
            required: true,
        },
    },
}
</script>
