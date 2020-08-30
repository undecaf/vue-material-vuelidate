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
        <md-dialog-title>Indiscreet registration</md-dialog-title>

        <md-dialog-content>
          <p>Required*</p>

          <form ref="form" novalidate>
            <div class="md-layout md-gutter">
              <md-vuelidated field="md-field"
                             class="md-layout-item"
                             :model="$v.name">
                <label>Name</label>
                <md-input type="text" v-model.trim="$v.name.$model" required></md-input>
                <md-vuelidated-msg :constraint="$v.name.required">Please enter your name</md-vuelidated-msg>
              </md-vuelidated>

              <md-vuelidated
                field="md-field"
                class="md-layout-item md-size-50"
                :model="$v.title" :messages="{ maxLength: `No more that ${$v.title.$params.maxLength.max} titles, please`}">
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
                :model="$v.country"
                :messages="{ required: 'Choose your country' }">
                <label>Country</label>
              </md-vuelidated>

              <md-vuelidated
                field="md-field"
                class="md-layout-item"
                :model="$v.email"
                :messages="{
                      required: 'Yor email address is required',
                      email: 'Invalid email address'
                  }">
                <label>Email</label>
                <md-input type="email" v-model.trim="$v.email.$model" required></md-input>
              </md-vuelidated>
            </div>

            <div class="md-layout md-gutter">
              <md-vuelidated
                field="md-chips"
                class="md-layout-item"
                md-placeholder="Social media used*"
                :md-auto-insert="true"
                :model="$v.media"
                :messages="{
                      minLength: `State at least ${$v.media.$params.minLength.min} social media`
                  }">
                <md-vuelidated-msg :constraint="$v.media.required">Please state which social media your are using</md-vuelidated-msg>
              </md-vuelidated>
            </div>

            <div class="md-layout md-gutter">
              <md-vuelidated
                field="md-datepicker"
                class="md-layout-item md-size-50"
                :model="$v.dateOfBirth"
                md-immediately
                :md-open-on-focus="false">
                <label>Date of birth</label>
                <md-vuelidated-msg :constraint="$v.dateOfBirth.alter">You are not even 6 years old!</md-vuelidated-msg>
              </md-vuelidated>

              <md-vuelidated
                field="md-field"
                class="md-layout-item"
                :model="$v.coolness"
                :messages="{
                      between: `Mere mortals cannot be cooler than ${$v.coolness.$params.between.max}`
                  }">
                <label>My coolness: {{ coolness }}</label>
                <md-input type="range" min="1" max="6" v-model="$v.coolness.$model"></md-input>
              </md-vuelidated>
            </div>

            <div class="md-layout md-gutter">
              <md-vuelidated
                field="md-field"
                class="md-layout-item"
                :model="$v.home"
                :messages="{ url: 'Invalid URL' }">
                <label>Homepage</label>
                <md-input type="url" v-model.trim="$v.home.$model"></md-input>
              </md-vuelidated>
            </div>

            <div class="md-layout md-gutter">
              <md-vuelidated
                class="md-layout-item"
                :model="$v.pass">
                <label>Passphrase</label>
                <md-input type="password" v-model.trim="$v.pass.$model" required></md-input>
                <md-vuelidated-msg :constraint="$v.pass.required">Please enter a passphrase</md-vuelidated-msg>
                <md-vuelidated-msg :constraint="$v.pass.strength">At least {{ $v.pass.$params.strength.min }} characters are required</md-vuelidated-msg>
              </md-vuelidated>

              <md-vuelidated
                class="md-layout-item"
                :model="$v.pass2"
                :messages="{ verified: 'The passphrases do not match' }">
                <label>Repeat passphrase</label>
                <md-input type="password" v-model.trim="$v.pass2.$model" required></md-input>
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

export default {
    name: 'Test',

    data() {
        return {
            title: [],
            name: null,
            country: null,
            email: null,
            media: [],
            dateOfBirth: null,
            minAge: 6,
            coolness: 1,
            home: null,
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
        title: { maxLength: maxLength(3) },
        name: { required },
        country: { required },
        email: { required, email },
        media: { required, minLength: minLength(2) },
        dateOfBirth: { alter: maxValue(new Date(Date.now() - 6*365.25*86400*1000)) },
        coolness: { required, between: between(1, 5) },
        home: { url },
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
