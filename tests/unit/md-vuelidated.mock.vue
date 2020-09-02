<template>
  <div>
    <md-vuelidated
      id="text"
      class="mock-class"
      :messages="{ minLength: 'minLength' }"
      mock-attr="mockAttr"
      @mock-event.native="mockEvent()"
    >
      <label>Text</label>
      <md-input
        v-model.trim="text"
        type="text"
      />
      <md-vuelidated-msg constraint="required">
        required
      </md-vuelidated-msg>
    </md-vuelidated>


    <md-vuelidated
      id="autocomplete"
      v-model="autocompleted"
      field="md-autocomplete"
      :md-options="autocompletions"
      :messages="{ required: 'required' }"
    >
      <label>Autocompleted</label>
    </md-vuelidated>


    <md-vuelidated
      id="chips"
      v-model="chips"
      field="md-chips"
      md-placeholder="Chips"
      :md-auto-insert="true"
      :messages="{ required: 'required' }"
    >
      <md-vuelidated-msg
        v-slot="{ min }"
        constraint="minLength"
      >
        minLength {{ min }}
      </md-vuelidated-msg>
    </md-vuelidated>

    <md-vuelidated-msg
      id="chips-msg"
      v-slot="{ min }"
      constraint="chips.minLength"
    >
      minLength {{ min }}
    </md-vuelidated-msg>


    <md-vuelidated
      id="datepicker"
      v-model="date"
      field="md-datepicker"
      :md-open-on-focus="false"
      :md-debounce="10"
    >
      <label>Datepicker</label>
      <md-vuelidated-msg constraint="required">
        required
      </md-vuelidated-msg>
    </md-vuelidated>


    <div id="array">
      <md-vuelidated
        v-for="(_, index) in array"
        :id="`array-${index}`"
        :key="index"
      >
        <label>{{ `Element #${index}` }}</label>
        <md-input
          v-model.trim="array[index].text"
          type="text"
        />
        <md-vuelidated-msg constraint="required">
          required
        </md-vuelidated-msg>
        <md-vuelidated-msg
          v-slot="{ min }"
          constraint="minLength"
        >
          minLength {{ min }}
        </md-vuelidated-msg>
      </md-vuelidated>
    </div>

    <md-vuelidated-msg
      id="array-msg"
      v-slot="{ min }"
      constraint="array.minLength"
    >
      minLength {{ min }}
    </md-vuelidated-msg>


    <div id="nested-array" v-for="(_, index) in array" :key="index">
      <md-vuelidated
        :id="`nested-array-${index}`"
        :key="index"
      >
        <label>{{ `Nested element #${index}` }}</label>
        <md-input
          v-model.trim="array[index].text"
          type="text"
        />
        <md-vuelidated-msg constraint="required">
          required
        </md-vuelidated-msg>
        <md-vuelidated-msg
          v-slot="{ min }"
          constraint="minLength"
        >
          minLength {{ min }}
        </md-vuelidated-msg>
      </md-vuelidated>
    </div>


    <div id="object">
      <md-vuelidated
        v-for="(_, name) in object"
        :id="`object-${name}`"
        :key="name"
      >
        <label>{{ `Member #${name}` }}</label>
        <md-input
          v-model.trim="object[name].x"
          type="number"
        />
        <md-vuelidated-msg
          v-slot="{ min, max }"
          constraint="between"
        >
          between {{ min }} {{ max }}
        </md-vuelidated-msg>
      </md-vuelidated>
    </div>

    <md-vuelidated-msg
      id="object-msg"
      v-slot="{ max }"
      constraint="object.maxLength"
    >
      maxLength {{ max }}
    </md-vuelidated-msg>
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
                array: [
                    { text: null },
                    { text: 'a' },
                    { text: 'b' },
                ],
                object: {
                    foo: { x: 12 },
                    bar: { x: 567 },
                    baz: { x: 1234 },
                },
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
            },

            array: {
                minLength: minLength(2),
                $each: {
                    text: {
                        required,
                        minLength: minLength(3),
                    },
                },
            },

            object: {
                maxLength: maxLength(3),
                $each: {
                    x: { between: between(0, 1000) },
                },
            },
        },

        methods: {
            mockEvent() {
                this.mockEventCalled = true
            }
        }
    }
</script>
