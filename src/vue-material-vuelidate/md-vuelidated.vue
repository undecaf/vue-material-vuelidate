<template>
  <component
    :is="field"
    v-model="model.validation.$model"
    v-bind="$attrs"
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

                if (typeof this.$vnode.key === 'undefined') {
                    // Not repeated by v-for, straightforward
                    var valueExpr = validationExpr = expression

                } else {
                    // Repeated by v-for, ugly
                    const key = JSON.stringify(this.$vnode.key)

                    // Have to fiddle with the expression since the name of the index variable is not known
                    // If there is only one subscript then replace it;
                    // else if there is an [index] subscript then replace it; otherwise replace the
                    // rightmost subscript.
                    // This fails for expressions like 'data[myIndex][0]'; use 'index' in v-for in such cases.
                    const
                        single = /\[.+?\]/g,                  // for counting subscripts
                        index = /\[\s*index\s*\]/,            // finds [index]
                        rightmost = /\[[^\[]*\]([^\[]*)$/     // rightmost subscript, trailing text in $1

                    if ((expression.match(single) || []).length === 1) {
                        var
                            valueExpr = expression.replace(rightmost, `[${key}]$1`),
                            validationExpr = expression.replace(rightmost, `.$each[${key}]$1`)

                    } else if (expression.match(index)) {
                        var
                            valueExpr = expression.replace(index, `[${key}]`),
                            validationExpr = expression.replace(index, `.$each[${key}]`)

                    } else {
                        var
                            valueExpr = expression.replace(rightmost, `[${key}]$1`),
                            validationExpr = expression.replace(rightmost, `.$each[${key}]$1`)
                    }
                }

                return {
                    expression,
                    validation: new Function(`with(this) return $v.${validationExpr}`).call(context),
                    getValue: new Function(`with(this) return ${valueExpr}`).bind(context),
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
</style>
