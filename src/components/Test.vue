<template>
  <md-app
    v-cloak
    md-waterfall
    md-mode="fixed"
  >
    <md-app-toolbar class="md-primary md-dense md-layout md-alignment-center-space-between">
      <div class="md-layout-item md-title">
        Testing &lt;md-vuelidate&gt;
      </div>
    </md-app-toolbar>

    <md-app-content>
      <md-dialog :md-active="true">
        <md-dialog-title>Nosy registration form</md-dialog-title>

        <md-dialog-content>
          <p>Required*</p>

          <form ref="form" novalidate>
            <div class="md-layout md-gutter">
              <md-vuelidated field="md-field"
                             class="md-layout-item"
                             :messages="{ fourLetter: 'Sorry, cannot register four-letter names' }"
              >
                <label>Name</label>
                <md-input type="text" v-model.trim="name" required />
                <md-vuelidated-msg constraint="required">Please enter your name</md-vuelidated-msg>
              </md-vuelidated>

              <md-vuelidated
                field="md-field"
                class="md-layout-item md-size-50"
                :messages="{ maxLength: `More that ${$v.title.$params.maxLength.max} titles cause server overload`}"
              >
                <label>Title</label>
                <md-select v-model.trim="title" multiple md-dense>
                  <md-option value="M.A.">M.A.</md-option>
                  <md-option value="M.S.">M.S.</md-option>
                  <md-option value="M.B.A.">M.B.A.</md-option>
                  <md-option value="Ph.D.">Ph.D.</md-option>
                  <md-option value="Ed.D.">Ed.D.</md-option>
                </md-select>
              </md-vuelidated>
            </div>

            <div class="md-layout md-gutter">
              <md-vuelidated
                field="md-autocomplete"
                class="md-layout-item md-size-50"
                :md-options="countries"
                md-dense
                v-model="country"
                :messages="{ required: 'Choose your country' }"
              >
                <label>Country</label>
              </md-vuelidated>

              <md-vuelidated
                field="md-field"
                class="md-layout-item"
                :messages="{
                      required: 'Yor email address is required',
                      email: 'Invalid email address'
                  }"
              >
                <label>Email</label>
                <md-input type="email" v-model.trim="www.email" required />
              </md-vuelidated>
            </div>

            <div class="md-layout md-gutter">
              <md-vuelidated
                field="md-chips"
                class="md-layout-item"
                md-placeholder="Hobbies*"
                :md-auto-insert="true"
                v-model="hobbies"
                :messages="{
                      required: 'Please tell us about your hobbies'
                  }"
              >
                <md-vuelidated-msg constraint="minLength" v-slot="{ min }">You should have at least {{ min }} hobbies</md-vuelidated-msg>
              </md-vuelidated>
            </div>

            <div class="md-layout md-gutter">
              <md-vuelidated
                field="md-datepicker"
                class="md-layout-item md-size-50"
                v-model="dateOfBirth"
                md-immediately
                :md-open-on-focus="false"
              >
                <label>Date of birth</label>
                <md-vuelidated-msg constraint="age">You are not even {{ minAge }} years old!</md-vuelidated-msg>
              </md-vuelidated>

              <md-vuelidated
                field="md-field"
                class="md-layout-item"
                :messages="{
                      between: `Mere mortals cannot be cooler than ${$v.coolness.$params.between.max}`
                  }"
              >
                <label>Your coolness: {{ coolness }}</label>
                <md-input type="range" min="1" max="6" v-model="coolness" />
              </md-vuelidated>
            </div>

            <div class="md-layout md-gutter">
              <md-vuelidated
                field="md-field"
                class="md-layout-item"
                :messages="{ url: 'Invalid URL' }"
              >
                <label>Homepage</label>
                <md-input type="url" v-model.trim="www.home" />
              </md-vuelidated>
            </div>

            <div class="md-layout md-gutter">
              <md-vuelidated class="md-layout-item" v-for="(_, index) in creditCards" :key="index">
                <label>Credit card #{{ index+1 }}</label>
                <md-input type="text" v-model="creditCards[index].number" />
                <md-vuelidated-msg constraint="creditCard">Invalid for a credit card</md-vuelidated-msg>
              </md-vuelidated>
            </div>

            <md-vuelidated-msg
              class="md-layout md-gutter md-caption"
              constraint="creditCards.minCount"
              v-slot="{ min }"
            >
              Please specify at least {{ min }} credit card(s)
            </md-vuelidated-msg>

            <div class="md-layout md-gutter">
              <md-vuelidated class="md-layout-item">
                <label>Passphrase</label>
                <md-input type="password" v-model.trim="pass" required />
                <md-vuelidated-msg constraint="required">Please enter a passphrase</md-vuelidated-msg>
                <md-vuelidated-msg constraint="strength">At least {{ $v.pass.$params.strength.min }} characters are required</md-vuelidated-msg>
              </md-vuelidated>

              <md-vuelidated
                class="md-layout-item"
                :messages="{ verified: 'The passphrases do not match' }"
              >
                <label>Repeat passphrase</label>
                <md-input type="password" v-model.trim="pass2" required />
              </md-vuelidated>
            </div>
          </form>
        </md-dialog-content>

        <md-dialog-actions>
          <md-button class="md-raised" @click="reset">Reset</md-button>
          <md-button class="md-raised md-primary" :disabled="$v.$invalid" @click="submit">Register now!</md-button>
        </md-dialog-actions>
      </md-dialog>
    </md-app-content>
  </md-app>
</template>

<script>
import { required, requiredIf, requiredUnless, minLength, maxLength, minValue, maxValue, between, alpha, alphaNum, numeric, integer, decimal, email, ipAddress, macAddress, sameAs, url, or, and, not, helpers } from "vuelidate/lib/validators"

const
    minAge = 6,
    creditCard = helpers.regex('creditCard', /[\d -]+/),     // simplified for testing
    minCount = min => helpers.withParams({ type: 'minCount', min }, creditCards => creditCards.filter(cc => cc.number).length >= min)

export default {
    name: 'Test',

    data() {
        return {
            title: [],
            name: null,
            country: null,
            www: {
                email: null,
                home: null,
            },
            hobbies: [],
            dateOfBirth: null,
            minAge,
            coolness: 1,
            creditCards: [
                { number: null },
                { number: null },
                { number: null },
            ],
            pass: null,
            pass2: null,

            countries: [
                'Austria',
                'France',
                'Germany',
                'Switzerland',
                'United Kingdom',
            ]
        }
    },

    validations: {
        name: { required, fourLetter: name => !name || (name.length !== 4) },
        title: { maxLength: maxLength(3) },
        country: { required },
        www: {
            email: { required, email },
            home: { url },
        },
        hobbies: { required, minLength: minLength(2) },
        dateOfBirth: { age: maxValue(new Date(Date.now() - minAge*365.25*86400*1000)) },
        coolness: { required, between: between(1, 5) },
        creditCards: {
            minCount: minCount(2),
            $each: {
                number: { creditCard },
            },
        },
        pass: { required, strength: minLength(5) },
        pass2: { required, verified: sameAs("pass") },
    },

    methods: {
        reset() {
            this.$refs.form.reset()
            this.title = []
            this.hobbies = []
            this.$nextTick(() => this.$nextTick(() => {
                this.$v.$reset()
                this.coolness = 1
            }))
        },

        submit() {
            this.reset()
        },
    },
}
</script>


<style scoped>
.md-error.md-caption {
  color: #ff1744;
}

</style>
