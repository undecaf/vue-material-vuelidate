import Vue from "vue"
import VueMaterial from 'vue-material'
import Vuelidate from 'vuelidate'
import MdVuelidated from '@/..'
import Demo from '@/components/Demo.vue'
import '@/main.css'


Vue.config.productionTip = false

Vue.use(VueMaterial)
Vue.use(Vuelidate)
Vue.use(MdVuelidated)


new Vue({
    el: '#app',
    render: h => h(Demo),
})
