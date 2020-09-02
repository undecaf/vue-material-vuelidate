<template>
  <span
    v-if="!valid"
    class="md-error"
  >
    <slot v-bind="params" />
  </span>
</template>

<script>
export default {
    name: "MdVuelidatedMsg",

    inject: {
        mdVuelidated: {
            from: 'mdVuelidated',
            default: null,
        }
    },

    props: {
        constraint: {
            type: String,
            required: true,
        },
    },

    computed: {
        innerConstraint() {
            if (typeof this.mdVuelidated.validation[this.constraint] !== 'boolean') {
                throw new Error(`Constraint not found: $v.${this.mdVuelidated.expression}.${this.constraint}`)
            }

            return {
                isValid: () => this.mdVuelidated.validation[this.constraint] || !this.mdVuelidated.validation.$anyDirty,
                getParams: () => this.mdVuelidated.validation.$params[this.constraint]
            }
        },

        outerConstraint() {
            const
                context = this.$vnode.context,
                parts = this.constraint.match(/^(.*\.)?([^.]+)$/)

            if (!parts) {
                throw new Error(`Invalid constraint format: ${this.constraint}`)
            }

            const
                path = parts[1],
                name = parts[2],
                getConstraint = new Function(`return this.$v.${this.constraint}`).bind(context),
                isValid = new Function(`return arguments[0]() || !this.$v.${path}$anyDirty`).bind(context, getConstraint),
                getParams = new Function(`return this.$v.${path}$params.${name}`).bind(context)

            if (typeof getConstraint() !== 'boolean') {
                throw new Error(`Constraint not found: $v.${this.constraint}`)
            }

            return {
                isValid,
                getParams,
            }
        },

        effectiveConstraint() {
            return this.mdVuelidated ? this.innerConstraint : this.outerConstraint
        },

        valid() {
            return this.effectiveConstraint.isValid()
        },

        params() {
            return this.effectiveConstraint.getParams()
        },
    },
}
</script>
