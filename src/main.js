import Vue from "vue"
import VueMaterial from 'vue-material'
import Vuelidate from 'vuelidate'
import MdVuelidated from '@/../dist/components.esm'
// import MdVuelidated from '@/vue-material-vuelidate/md-vuelidated'
import Test from '@/components/Test.vue'
import '@/main.css'


Vue.config.productionTip = false

Vue.use(VueMaterial)
Vue.use(Vuelidate)
Vue.use(MdVuelidated)


new Vue({
    el: '#app',
    render: h => h(Test),
})
