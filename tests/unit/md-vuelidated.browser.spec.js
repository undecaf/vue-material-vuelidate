import Vue from 'vue'


Vue.config.productionTip = false
Vue.config.devtools = false

window.Vue = Vue
import('@/../dist/components.min')


describe('<md-vuelidated> (Browser)', () => {
    it('is registered as Vue component', () => {
        expect(Vue.options.components.MdVuelidated).to.be.a('function')
        expect(Vue.options.components.MdVuelidatedMsg).to.be.a('function')
    })
})
