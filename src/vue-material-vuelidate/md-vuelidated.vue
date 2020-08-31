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
            const patterns = {
                'md-field': /(MdInput|MdTextarea|MdSelect)$/,
            }

            let vnode, context, expr

            // Get the validation context from a child VNode
            try {
                vnode = this.$slots.default.find(vn => vn.tag.match(patterns[this.field] || /.*/))
                context = vnode.context
            } catch (e) {
                throw (e instanceof TypeError)
                    ? new Error('<md-vuelidated> requires at least one child element')
                    : e
            }

            // Get the v-model expression from the VNode, or from this component if not available at the VNode
            if (vnode.data && vnode.data.model) {
                expr = vnode.data.model.expression
            } else {
                try {
                    expr = this.$vnode.data.model.expression
                } catch (e) {
                    throw (e instanceof TypeError)
                        ? new Error(`No v-model directive found in <md-vuelidate field="${this.field}">`)
                        : e
                }
            }

            return {
                validation: new Function(`with(this) return $v.${expr}`).call(vnode.context),
                getValue: new Function(`with(this) return ${expr}`).bind(vnode.context),
            }
        },

        activeMessages() {
            return Object.keys(Object(this.messages))
                .filter(constraint => !this.model.validation[constraint])
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
            validation: this.model.validation
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
