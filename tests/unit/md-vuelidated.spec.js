import Vue from 'vue'
import VueMaterial from 'vue-material'
import Vuelidate from 'vuelidate'
import moment from 'moment'
import { mount } from '@vue/test-utils'

import MdVuelidated from '@/../dist/components.esm'
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
    let wrapper, field, input, error

    function get(fieldSelector) {
        field = wrapper.get(fieldSelector)
        input = field.get('input')
        error = field.get('.md-error')
    }

    function verifyLabel(text, asPlaceholder = false) {
        if (asPlaceholder) {
            expect(input.attributes('placeholder')).to.equal(text)
        } else {
            const label = field.get('label')
            expect(label.text()).to.equal(text)
        }
    }

    async function verifyInvalid(value, constraint) {
        input.setValue(value)
        await input.trigger('blur')     // validate <md-chips>, <md-datepicker>
        await input.trigger('focusout')
        expect(field.classes()).to.include('md-invalid')
        error = field.get('.md-error')
        expect(error.text()).to.equal(constraint)
    }

    async function verifyValid(value) {
        input.setValue(value)
        await input.trigger('blur')     // validate <md-chips>, <md-datepicker>
        await input.trigger('focusout')
        expect(field.classes()).not.to.include('md-invalid')
    }

    async function verifyValidDate(value) {
        input.setValue(value)
        await delay(100)  // let mdDatepicker debounce the input
        expect(field.classes()).not.to.include('md-invalid')
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

    it('validates <md-field> and renders messages', async () => {
        get('#text')

        // Not invalid yet since the focus has never been lost
        expect(field.classes()).not.to.include('md-invalid')

        await verifyInvalid('', 'required')
        await verifyInvalid('x', 'minLength')
        await verifyValid('xyz')
    })

    it('renders <md-autocomplete>', () => {
        get('#autocomplete')
        expect(field.classes()).to.include('md-autocomplete')
        verifyLabel('Autocompleted')
    })

    it('validates <md-autocomplete> and renders messages', async () => {
        get('#autocomplete')

        // Not invalid yet since the focus has never been lost
        expect(field.classes()).not.to.include('md-invalid')

        await verifyInvalid('', 'required')
        await verifyValid('a')
    })

    it('renders <md-chips>', () => {
        get('#chips')
        expect(field.classes()).to.include('md-chips')
        verifyLabel('Chips', true)
    })

    it('validates <md-chips> and renders messages', async () => {
        get('#chips')

        // Not invalid yet since the focus has never been lost
        expect(field.classes()).not.to.include('md-invalid')

        // Wait until focusout events are honored
        await delay(100)

        await verifyInvalid('', 'required')
        await verifyInvalid('a', 'minLength')
        await verifyValid('b')
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

    it('validates <md-datepicker> and renders messages', async () => {
        get('#datepicker')

        // Not invalid yet since the focus has never been lost
        expect(field.classes()).not.to.include('md-invalid')

        // Wait until focusout events are honored
        await delay(100)

        await verifyInvalid('', 'required')
        await verifyInvalid('x', 'required')
        await verifyValidDate(new Date().toLocaleDateString(navigator.language))
    })

    it('ignores early focusout events on <md-datepicker>', async () => {
        get('#datepicker')

        // Not invalid since focusout events are still ignored
        await verifyValidDate('')
        await verifyValidDate('x')
    })
})
