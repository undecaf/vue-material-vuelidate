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
      <div class="md-display-1">Nosy registration form</div>
      <hr>

      <p>Required*</p>

      <form ref="form" novalidate>
        <div class="md-layout">
          <md-vuelidated field="md-field"
                         class="md-layout-item"
                         :messages="{ fourLetter: 'Sorry, we cannot register four-letter names' }"
          >
            <label>Name</label>
            <md-input type="text" v-model.trim="name" required />
            <md-vuelidated-msg constraint="required">Please enter your name</md-vuelidated-msg>
          </md-vuelidated>

          <md-vuelidated
            field="md-field"
            class="md-layout-item"
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


        <div class="md-layout">
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


        <div class="md-layout">
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


        <div class="md-layout">
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


        <div class="md-layout">
          <md-vuelidated
            field="md-field"
            class="md-layout-item"
            :messages="{ url: 'Invalid URL' }"
          >
            <label>Homepage</label>
            <md-input type="url" v-model.trim="www.home" />
          </md-vuelidated>

          <md-vuelidated
            field="md-field"
            class="md-layout-item"
          >
            <label>Visitors/day</label>
            <md-input type="number" v-model="www.visitors" />
            <md-vuelidated-msg constraint="required">We need to know!</md-vuelidated-msg>
            <md-vuelidated-msg constraint="minValue" v-slot="{ min }">You cannot have fewer than {{ min }} visitors</md-vuelidated-msg>
          </md-vuelidated>
        </div>


        <div class="md-layout">
          <md-vuelidated class="md-layout-item" v-for="(_, name) in phones" :key="name">
            <label>Phone {{ name }}</label>
            <md-input type="tel" v-model="phones[name].number" />

            <md-button class="md-icon-button md-dense md-suffix" @click="$delete(phones, name)">
              <md-icon>remove</md-icon>
            </md-button>

            <md-vuelidated-msg constraint="phone">This does not look like a phone number</md-vuelidated-msg>
          </md-vuelidated>

          <md-field class="md-layout-item">
            <label>Add a category</label>
            <md-input type="text" v-model="category" />

            <md-button
              class="md-icon-button md-dense md-suffix"
              :disabled="!category"
              @click="$set(phones, category, { number: null }); category = null"
            >
              <md-icon>add</md-icon>
            </md-button>
          </md-field>
        </div>

        <md-vuelidated-msg
          class="md-layout md-caption"
          constraint="phones.minPhones"
          v-slot="p"
        >
          We would like at least {{ p.min }} of your phone numbers
        </md-vuelidated-msg>


        <div class="md-layout">
          <md-vuelidated class="md-layout-item" v-for="(_, index) in creditCards" :key="index">
            <label>Credit card #{{ index+1 }}</label>
            <md-input type="text" v-model="creditCards[index].number" />

            <md-button v-if="creditCards.length &gt; 1" class="md-icon-button md-dense md-suffix" @click="creditCards.splice(index, 1)">
              <md-icon>remove</md-icon>
            </md-button>

            <md-button class="md-icon-button md-dense md-suffix" @click="creditCards.splice(index+1, 0, { number: null })">
              <md-icon>add</md-icon>
            </md-button>

            <md-vuelidated-msg constraint="creditCard" v-slot="{ pattern }">The card number must match {{ pattern }}</md-vuelidated-msg>
          </md-vuelidated>
        </div>

        <md-vuelidated-msg
          class="md-layout md-caption"
          constraint="creditCards.minCards"
          v-slot="{ min }"
        >
          Please specify at least {{ min }} credit card(s)
        </md-vuelidated-msg>

        <md-vuelidated-msg
          class="md-layout md-caption"
          constraint="creditCards.maxLength"
          v-slot="{ max }"
        >
          {{ max }} credit card numbers would be sufficient, thank you
        </md-vuelidated-msg>

        <md-vuelidated-msg
          class="md-layout md-caption"
          constraint="creditCards.$each[0].number.creditCard"
        >
          The first credit card number is invalid
        </md-vuelidated-msg>


        <div class="md-layout">
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

        <div class="md-layout md-alignment-center-right">
          <md-button class="md-raised" @click="reset">Reset</md-button>
          <md-button class="md-raised md-primary" :disabled="$v.$invalid" @click="submit">Register now!</md-button>
        </div>
      </form>
    </md-app-content>
  </md-app>
</template>

<script>
import { required, requiredIf, requiredUnless, minLength, maxLength, minValue, maxValue, between, alpha, alphaNum, numeric, integer, decimal, email, ipAddress, macAddress, sameAs, url, or, and, not, helpers } from "vuelidate/lib/validators"

const
    minAge = 6,
    creditCard = pattern => helpers.withParams({ pattern }, helpers.regex('creditCard', pattern)),     // simplified for testing
    phone = helpers.regex('phone', /^[\d -\(\)]+/),     // simplified for testing
    minCards = min => helpers.withParams({ type: 'minCards', min }, creditCards => creditCards.filter(cc => cc.number).length >= min),
    minPhones = min => helpers.withParams({ type: 'minPhones', min }, phones => Object.keys(phones).map(k => phones[k]).filter(p => p.number).length >= min)

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
                visitors: null,
            },
            hobbies: [],
            dateOfBirth: null,
            minAge,
            coolness: 1,
            phones: {
                office: {
                    number: null,
                },
                mobile: {
                    number: null,
                },
                home: {
                    number: null,
                },
            },
            category: null,
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
            visitors: { required, minValue: minValue(0) },
        },
        hobbies: { required, minLength: minLength(2) },
        dateOfBirth: { age: maxValue(new Date(Date.now() - minAge*365.25*86400*1000)) },
        coolness: { required, between: between(1, 5) },
        phones: {
            minPhones: minPhones(1),
            $each: {
                number: { phone },
            },
        },
        creditCards: {
            minCards: minCards(2),
            maxLength: maxLength(5),
            $each: {
                number: { creditCard: creditCard(/^[\d -]+$/) },
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
.md-layout.md-gutter {
  margin-left: 0;
  margin-right: 0;
}

.md-layout-item ~ .md-layout-item {
  margin-left: 1em;
}

.md-error.md-caption {
  color: #ff1744;
}

</style>
