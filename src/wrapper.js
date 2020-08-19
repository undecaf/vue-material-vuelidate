import * as components from './index'

// Install function executed by Vue.use()
export function install(Vue) {
    if (!install.installed) {
        for (const name in components) {
            if (name !== 'default') {
                Vue.component(name, components[name])
            }
        }
        install.installed = true
    }
}

// Auto-install if Vue is found (eg. in browsers via <script> tag)
let GlobalVue

if (typeof window !== "undefined") {
    GlobalVue = window.Vue
} else if (typeof global !== "undefined") {
    GlobalVue = global.Vue
}

if (GlobalVue) {
    GlobalVue.use({ install })
}
