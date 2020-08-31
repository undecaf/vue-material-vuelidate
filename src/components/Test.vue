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
                <md-input type="text" v-model.trim="name" required></md-input>
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
                <md-input type="email" v-model.trim="www.email" required></md-input>
              </md-vuelidated>
            </div>

            <div class="md-layout md-gutter">
              <md-vuelidated
                field="md-chips"
                class="md-layout-item"
                md-placeholder="Social media used*"
                :md-auto-insert="true"
                v-model="www.media"
                :messages="{
                      minLength: `State at least ${$v.www.media.$params.minLength.min} social media`
                  }"
              >
                <md-vuelidated-msg constraint="required">Please state which social media your are using</md-vuelidated-msg>
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
                <md-input type="range" min="1" max="6" v-model="coolness"></md-input>
              </md-vuelidated>
            </div>

            <div class="md-layout md-gutter">
              <md-vuelidated
                field="md-field"
                class="md-layout-item"
                :messages="{ url: 'Invalid URL' }"
              >
                <label>Homepage</label>
                <md-input type="url" v-model.trim="www.home"></md-input>
              </md-vuelidated>
            </div>

            <div class="md-layout md-gutter">
              <md-vuelidated class="md-layout-item">
                <label>Passphrase</label>
                <md-input type="password" v-model.trim="pass" required></md-input>
                <md-vuelidated-msg constraint="required">Please enter a passphrase</md-vuelidated-msg>
                <md-vuelidated-msg constraint="strength">At least {{ $v.pass.$params.strength.min }} characters are required</md-vuelidated-msg>
              </md-vuelidated>

              <md-vuelidated
                class="md-layout-item"
                :messages="{ verified: 'The passphrases do not match' }"
              >
                <label>Repeat passphrase</label>
                <md-input type="password" v-model.trim="pass2" required></md-input>
              </md-vuelidated>
            </div>
          </form>
        </md-dialog-content>

        <md-dialog-actions>
          <md-button class="md-raised" @click="reset">Cancel</md-button>
          <md-button class="md-raised md-primary" :disabled="$v.$invalid" @click="submit">Register</md-button>
        </md-dialog-actions>
      </md-dialog>
    </md-app-content>
  </md-app>
</template>

<script>
import { required, requiredIf, requiredUnless, minLength, maxLength, minValue, maxValue, between, alpha, alphaNum, numeric, integer, decimal, email, ipAddress, macAddress, sameAs, url, or, and, not, helpers } from "vuelidate/lib/validators"

const minAge = 6

export default {
    name: 'Test',

    data() {
        return {
            title: [],
            name: null,
            country: null,
            www: {
                email: null,
                media: [],
                home: null,
            },
            dateOfBirth: null,
            minAge,
            coolness: 1,
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
            media: { required, minLength: minLength(2) },
            home: { url },
        },
        dateOfBirth: { age: maxValue(new Date(Date.now() - minAge*365.25*86400*1000)) },
        coolness: { required, between: between(1, 5) },
        pass: { required, strength: minLength(5) },
        pass2: { required, verified: sameAs("pass") },
    },

    methods: {
        reset() {
            this.$refs.form.reset()
            this.title = []
            this.media = []
            this.coolness = 1
            this.$nextTick(() => this.$nextTick(this.$v.$reset))
        },

        submit() {
            this.reset()
        },
    },
}
</script>


<style scoped>
.md-menu-content {
    z-index: 100;
}
</style>
