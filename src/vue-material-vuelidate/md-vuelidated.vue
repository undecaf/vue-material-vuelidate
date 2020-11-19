<template>
  <component
    :is="field"
    v-model="model.validation.$model"
    v-bind="$attrs"
    class="md-vuelidated"
    :class="{ 'md-invalid': model.validation.$error }"
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

        // Is new Function() allowed?
        try {
            new Function('return').call()

        } catch (e) {
            throw e.toString().match(/unsafe-eval|CSP/)
                ? new Error(`The Content Security Policy seems to prohibit unsafe-eval.
Unfortunately, <md-vuelidated> cannot work in this environment.
Please consider relaxing the policy to allow unsafe-eval.`)
                : e
        }

        Vue.component('MdVuelidated', this)
        Vue.component('MdVuelidatedMsg', MdVuelidatedMsg)
    },

    props: {
        field: {
            type: String,
            default: 'md-field',
            validator: field => /^md-(field|autocomplete|chips|datepicker)$/.test(field),
        },

        messages: {
            type: Object,
            default: () => {},
        },
    },

    data() {
        return {
            validation: null,
            unwatch: () => {},
            touchStart: Infinity,
        }
    },

    computed: {
        model() {
            // Find a nested VNode with a v-model, or presume this VNode has one
            const vnode = (this.$slots.default && this.$slots.default.find(vn => vn.data && vn.data.model))
                || this.$vnode

            // Use the v-model expression to get the validation object
            if (vnode.data && vnode.data.model) {
                const
                    context = this.$vnode.context,
                    expression = vnode.data.model.expression

                let valueExpr, validationExpr

                if (typeof this.$vnode.key === 'undefined') {
                    // Not repeated by v-for, straightforward
                    valueExpr = validationExpr = expression

                } else {
                    // Repeated by v-for, gets ugly

                    // Fiddle with the expression since the name of the index variable is not known
                    // If there are several subscripts one of which is [indexNNN] (N are optional digits)
                    // then replace that one with the [key] subscript; otherwise replace the rightmost subscript.
                    // This fails for expressions like 'data[myIndex][0]'; use 'indexNNN' in v-for in such cases.
                    const
                        key = JSON.stringify(this.$vnode.key),
                        single = /\[.+?\]/g,                  // for counting subscripts
                        index = /\[\s*index\d*\s*\]/,         // finds [index], [index0], [index1], ...
                        rightmost = /\[[^\[]*\]([^\[]*)$/     // rightmost subscript, trailing text in $1

                    if ((expression.match(single) || []).length > 1 && expression.match(index)) {
                        valueExpr = expression.replace(index, `[${key}]`)
                        validationExpr = expression.replace(index, `.$each.$iter[${key}]`)

                    } else {
                        valueExpr = expression.replace(rightmost, `[${key}]$1`),
                        validationExpr = expression.replace(rightmost, `.$each.$iter[${key}]$1`)
                    }
                }

                let validation = new Function(`try { with(this) return $v.${validationExpr} } catch(e) {}`).call(context)

                if (validation) {
                    // Vuelidate removes the validation object even before beforeDestroy(), so save it for later
                    this.validation = validation

                } else {
                    // Keep the validation object around until this component instance has been destroyed
                    if (this.validation) {
                        validation = this.validation

                    } else {
                        throw new Error(`No validation object found at: $v.${validationExpr.replace('.$iter', '')}`)
                    }
                }

                return {
                    expression,
                    validation,
                    getValue: new Function(`try { with(this) return ${valueExpr} } catch(e) {}`).bind(context),
                }

            } else {
                throw new Error(`No v-model directive found for <md-vuelidate field="${this.field}">`)
            }
        },

        activeMessages() {
            return Object.keys(Object(this.messages))
                .filter(constraint => this.model.validation[constraint] === false && this.model.validation.$anyDirty)
                .map(constraint => this.messages[constraint])
        },
    },

    mounted() {
        // Wait until children have been mounted
        this.$nextTick(() => {
            // Sync the validation $model with the input value
            this.unwatch = this.$watch(
                function() {
                    return this.model.getValue()
                },
                function(value) {
                    this.model.validation.$model = value
                    this.touch()
                }
            )

            this.touchStart = Date.now() + focusoutDelay
        })
    },

    beforeDestroy() {
        this.unwatch()
    },

    methods: {
        touch() {
            if(Date.now() >= this.touchStart) {
                this.model.validation.$touch()
            }
        },
    },

    provide() {
        return {
            mdVuelidated: {
                validation: this.model.validation,
                expression: this.model.expression,
            }
        }
    },
}
</script>

<style>
/* Shows the md-autocomplete menu in the foreground */
.md-menu-content {
    z-index: 15 !important;
}

/* Shows only the first one of multiple error messages */
.md-vuelidated span.md-error ~ span.md-error {
    display: none !important;
}
</style>
