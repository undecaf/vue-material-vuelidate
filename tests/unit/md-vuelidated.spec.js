import Vue from 'vue'
import VueMaterial from 'vue-material'
import Vuelidate from 'vuelidate'
import moment from 'moment'
import { mount } from '@vue/test-utils'

import MdVuelidated from '@/..'
// import MdVuelidated from '@/vue-material-vuelidate/md-vuelidated'
import '@/../dist/components.css'
import MdVuelidatedMock from './md-vuelidated.mock.vue'


Vue.use(VueMaterial)
Vue.use(Vuelidate)
Vue.use(MdVuelidated)

moment.locale(navigator.language)

Vue.material.locale = {
    startYear: 1900,
    endYear: 2099,
    dateFormat: moment.localeData().longDateFormat('L').replace(/D/g, 'd').replace(/Y/g, 'y'),
    days: moment.weekdays(),
    shortDays: moment.weekdaysShort(),
    shorterDays: moment.weekdaysMin(),
    months: moment.months(),
    shortMonths: moment.monthsShort(),
    shorterMonths: moment.monthsShort(),
    firstDayOfAWeek: moment.localeData().firstDayOfWeek(),
}


describe('<md-vuelidated>', () => {
    let wrapper, field, input

    function get(fieldSelector) {
        field = wrapper.get(fieldSelector)
        input = field.get('input')
    }

    function verifyLabel(text, asPlaceholder = false) {
        if (asPlaceholder) {
            expect(input.attributes('placeholder')).to.equal(text)
        } else {
            const label = field.get('label')
            expect(label.text()).to.equal(text)
        }
    }

    async function verifyInvalid(value, constraint, errorText = constraint) {
        if (typeof value !== 'undefined') {
            input.setValue(value)
        }

        await input.trigger('blur')     // validate <md-chips>, <md-datepicker>
        await input.trigger('focusout')

        if (constraint) {
            expect(field.classes(), `classes: ${field.classes().join(', ')}`).to.include('md-invalid')
            expect(field.get('.md-error').text()).to.equal(errorText)
        }
    }

    async function verifyValid(value) {
        if (typeof value !== 'undefined') {
            input.setValue(value)
        }

        await input.trigger('blur')     // validate <md-chips>, <md-datepicker>
        await input.trigger('focusout')
        expect(field.classes(), `classes: ${field.classes().join(', ')}`).to.not.include('md-invalid')
    }

    async function verifyValidDate(value) {
        input.setValue(value)
        await delay(100)  // let mdDatepicker debounce the input
        expect(field.classes()).to.not.include('md-invalid')
    }

    async function verifyArrayRendered(id, label) {
        for (let i = 0; i < wrapper.vm.array.length; i++) {
            get(`${id}-${i}`)
            expect(field.classes()).to.include('md-field')
            verifyLabel(`${label} #${i}`)
            expect(input.element.value).to.equal((wrapper.vm.array[i].text || '').toString())
        }
    }

    async function verifyArrayValidation(id, values, violated) {
        // Set initial values and verify validation status
        for (let i = 0; i < values.length; i++) {
            get(`${id}-${i}`)
            if (violated[i]) {
                await verifyInvalid(values[i], violated[i])
            } else {
                await verifyValid(values[i])
            }
        }

        // Same validation status after all values have been set?
        for (let i = 0; i < values.length; i++) {
            get(`${id}-${i}`)
            if (violated[i]) {
                await verifyInvalid(undefined, violated[i])
            } else {
                await verifyValid()
            }
        }
    }

    async function verifyObjectRendered(id, label) {
        for (let k in wrapper.vm.object) {
            get(`${id}-${k}`)
            expect(field.classes()).to.include('md-field')
            verifyLabel(`${label} #${k}`)
            expect(input.element.value).to.equal((wrapper.vm.object[k].x || '').toString())
        }
    }

    async function verifyObjectValidation(id, values, violated) {
        // Set initial values and verify validation status
        for (let k in values) {
            get(`${id}-${k}`)
            if (violated[k]) {
                await verifyInvalid(values[k], violated[k])
            } else {
                await verifyValid(values[k])
            }
        }

        // Same validation status after all values have been set?
        for (let k in values) {
            get(`${id}-${k}`)
            if (violated[k]) {
                await verifyInvalid(undefined, violated[k])
            } else {
                await verifyValid()
            }
        }
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    beforeEach(() => {
        wrapper = mount(MdVuelidatedMock)
    })


    it('renders <md-field>', () => {
        get('#text')
        expect(field.classes()).to.include('md-field')
        verifyLabel('Text')
    })

    it('passes a CSS class to <md-field>', () => {
        get('#text')
        expect(field.classes()).to.include('mock-class')
    })

    it('passes an attribute to <md-field>', () => {
        get('#text')
        expect(field.attributes('mock-attr')).to.equal('mockAttr')
    })

    it('passes a listener to <md-field>', async () => {
        get('#text')
        await field.trigger('mock-event')
        expect(wrapper.vm.mockEventCalled).to.be.ok
    })

    it('validates <md-field>, updates the model and renders messages', async () => {
        get('#text')

        // Not invalid yet since the focus has never been lost
        expect(field.classes()).to.not.include('md-invalid')

        await verifyInvalid('', 'required')
        await verifyInvalid('x', 'minLength')
        await verifyValid('xyz')
        expect(wrapper.vm.text).to.equal('xyz')
    })

    it('renders <md-autocomplete>', () => {
        get('#autocomplete')
        expect(field.classes()).to.include('md-autocomplete')
        verifyLabel('Autocompleted')
    })

    it('validates <md-autocomplete>, updates the model and renders messages', async () => {
        get('#autocomplete')

        // Not invalid yet since the focus has never been lost
        expect(field.classes()).to.not.include('md-invalid')

        await verifyInvalid('', 'required')
        await verifyValid('a')
        expect(wrapper.vm.autocompleted).to.equal('a')
    })

    it('renders <md-chips>', () => {
        get('#chips')
        expect(field.classes()).to.include('md-chips')
        verifyLabel('Chips', true)
    })

    it('validates <md-chips>, updates the model and uses validator params in rendered messages', async () => {
        get('#chips')

        // Not invalid yet since the focus has never been lost
        expect(field.classes()).to.not.include('md-invalid')

        // Wait until focusout events are honored
        await delay(100)

        await verifyInvalid('', 'required')
        await verifyInvalid('a', 'minLength', 'minLength 2')
        await verifyValid('b')
        expect(wrapper.vm.chips).to.deep.equal(['a', 'b'])
    })

    it('validates <md-vuelidated-msg> visibility, updates the model and includes validator params', async () => {
        const chipsMsgId = '#chips-msg'
        get('#chips')

        // Wait until focusout events are honored
        await delay(100)

        expect(wrapper.find(chipsMsgId).exists()).to.not.be.ok

        await verifyInvalid('a')
        let chipsMsg = wrapper.find(chipsMsgId)
        expect(chipsMsg.exists()).to.be.ok
        expect(chipsMsg.text()).to.equal('minLength 2')

        await verifyValid('b')
        expect(wrapper.vm.chips).to.deep.equal(['a', 'b'])

        expect(wrapper.find(chipsMsgId).exists()).to.not.be.ok
    })

    it('ignores early focusout events on <md-chips>', async () => {
        get('#chips')

        // Not invalid since focusout events are still ignored
        await verifyValid('')
    })

    it('renders <md-datepicker>', () => {
        get('#datepicker')
        expect(field.classes()).to.include('md-datepicker')
        verifyLabel('Datepicker')
    })

    it('validates <md-datepicker>, updates the model and renders messages', async () => {
        get('#datepicker')

        // Not invalid yet since the focus has never been lost
        expect(field.classes()).to.not.include('md-invalid')

        // Wait until focusout events are honored
        await delay(100)

        await verifyInvalid('', 'required')
        await verifyInvalid('x', 'required')

        let date = new Date()
        await verifyValidDate(date.toLocaleDateString(navigator.language))
        expect(wrapper.vm.date.toLocaleDateString(navigator.language)).to.equal(date.toLocaleDateString(navigator.language))
    })

    it('ignores early focusout events on <md-datepicker>', async () => {
        get('#datepicker')

        // Not invalid since focusout events are still ignored
        await verifyValidDate('')
        await verifyValidDate('x')
    })

    it('renders <md-field>s for an array', async () => {
        await verifyArrayRendered('#array', 'Element')
    })

    it('validates <md-field>s rendered for an array independently of each other', async () => {
        // Wait until focusout events are honored
        await delay(100)

        await verifyArrayValidation('#array', [null, 'a', null], ['required', 'minLength 3', 'required'])
        await verifyArrayValidation('#array', ['a', 'abcd', null], ['minLength 3', false, 'required'])
    })

    it('updates <md-field>s rendered for an array on element inserts/deletes', async () => {
        wrapper.vm.array.push({ text: 'c'})
        await delay(1)
        await verifyArrayRendered('#array', 'Element')

        wrapper.vm.array.splice(2)
        await delay(1)
        await verifyArrayRendered('#array', 'Element')
    })

    it('validates <md-vuelidated-msg> visibility and includes array validator params', async () => {
        const linesId = '#array-msg'
        get('#array-0')

        // Wait until focusout events are honored
        await delay(100)
        await verifyInvalid('')

        expect(wrapper.find(linesId).exists()).to.not.be.ok
        wrapper.vm.array.pop()
        expect(wrapper.find(linesId).exists()).to.not.be.ok
        wrapper.vm.array.pop()
        await delay(100)
        expect(wrapper.find(linesId).exists()).to.be.ok
    })

    it('renders a nested <md-field> for an array', async () => {
        await verifyArrayRendered('#nested-array', 'Nested element')
    })

    it('validates nested <md-field>s rendered for an array independently of each other', async () => {
        // Wait until focusout events are honored
        await delay(100)

        await verifyArrayValidation('#nested-array', [null, 'a', null], ['required', 'minLength 3', 'required'])
        await verifyArrayValidation('#nested-array', ['a', 'abcd', null], ['minLength 3', false, 'required'])
    })

    it('updates nested <md-field>s rendered for an array on element inserts/deletes', async () => {
        wrapper.vm.array.push({ text: 'c'})
        await delay(1)
        await verifyArrayRendered('#nested-array', 'Nested element')

        wrapper.vm.array.splice(2)
        await delay(1)
        await verifyArrayRendered('#nested-array', 'Nested element')
    })

    it('renders <md-field>s for an object', async () => {
        await verifyObjectRendered('#object', 'Member')
    })

    it('validates <md-field>s rendered for an object independently of each other', async () => {
        // Wait until focusout events are honored
        await delay(100)

        await verifyObjectValidation('#object', { foo: 3000, bar: 123, baz: null }, { foo: 'between 0 1000' })
    })

    it('updates <md-field>s rendered for an object on member inserts/deletes', async () => {
        wrapper.vm.$set(wrapper.vm.object, 'foobar', { x: 42 })
        await delay(1)
        await verifyObjectRendered('#object', 'Member')

        wrapper.vm.$delete(wrapper.vm.object, 'foobar')
        await delay(1)
        await verifyObjectRendered('#object', 'Member')
    })
})
