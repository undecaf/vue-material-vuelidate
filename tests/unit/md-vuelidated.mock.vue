<template>
  <div>
    <md-vuelidated
      id="text"
      class="mock-class"
      :model="$v.text"
      :messages="{ minLength: 'minLength' }"
      mock-attr="mockAttr"
      @mock-event.native="mockEvent()"
    >
      <label>Text</label>
      <md-input
        v-model.trim="$v.text.$model"
        type="text"
      />
      <md-vuelidated-msg :constraint="$v.text.required">
        required
      </md-vuelidated-msg>
    </md-vuelidated>

    <md-vuelidated
      id="autocomplete"
      field="md-autocomplete"
      :md-options="autocompletions"
      :model="$v.autocompleted"
      :messages="{ required: 'required' }"
    >
      <label>Autocompleted</label>
    </md-vuelidated>

    <md-vuelidated
      id="chips"
      field="md-chips"
      md-placeholder="Chips"
      :md-auto-insert="true"
      :model="$v.chips"
      :messages="{ required: 'required' }"
    >
      <md-vuelidated-msg :constraint="$v.chips.minLength">
        minLength
      </md-vuelidated-msg>
    </md-vuelidated>

    <md-vuelidated
      id="datepicker"
      field="md-datepicker"
      :model="$v.date"
      :md-open-on-focus="false"
      :md-debounce="10"
    >
      <label>Datepicker</label>
      <md-vuelidated-msg :constraint="$v.date.required">
        required
      </md-vuelidated-msg>
    </md-vuelidated>
  </div>
</template>

<script>
    import { required, requiredIf, requiredUnless, minLength, maxLength, minValue, maxValue, between, alpha, alphaNum, numeric, integer, decimal, email, ipAddress, macAddress, sameAs, url, or, and, not, helpers } from 'vuelidate/lib/validators'

    export default {
        name: 'MdVuelidatedMock',

        data() {
            return {
                text: null,
                autocompleted: null,
                autocompletions: [
                    'a', 'b', 'c'
                ],
                chips: [],
                date: null,
                mockEventCalled: false,
            }
          },

        validations: {
            text: {
                required,
                minLength: minLength(2),
            },

            autocompleted: {
                required,
            },

            chips: {
                required,
                minLength: minLength(2),
            },

            date: {
                required,
            }
        },

        methods: {
            mockEvent() {
                this.mockEventCalled = true
            }
        }
    }
</script>
