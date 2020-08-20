# A Vue Material adapter for Vuelidate


[Vuelidate](https://vuelidate.js.org/) is a model-based validation for Vue.js
that decouples validations nicely from the template.

This package (components `MdVuelidated` and `MdVuelidatedMsg`) simplifies
using Vuelidate together with [Vue Material](https://vuematerial.io/):

+   Reduces boilerplate markup in the template
+   Suppresses validation messages for fields that are still untouched (similar to 
    Angular Material)
+   Can be used with `MdField`, `MdAutocomplete`, `MdChips` and `MdDatepicker`


## Installation

As a package:

```shell script
$ npm install vue-material-vuelidate
    or
$ yarn add vue-material-vuelidate
```

Included as `<script>`:

```html
<script src="https://cdn.jsdelivr.net/npm/vue-material-vuelidate/dist/components.min.js"></script>
```


## Usage

### Registering the components

```javascript 1.8
import MdVuelidated from 'vue-material-vuelidated'
import 'vue-material-vuelidated/dist/components.css'

    ...
// This must come after Vue.use(VueMaterial) and Vue.use(Vuelidate):
Vue.use(MdVuelidated)
```


### Validating Vue Material form fields

In order to validate
[`<md-field>`](https://vuematerial.io/components/input) (any type of `<input>`),
[`<md-autocomplete>`](https://vuematerial.io/components/autocomplete),
[`<md-chips>`](https://vuematerial.io/components/chips) or
[`<md-datepicker>`](https://vuematerial.io/components/datepicker):

+   Replace that tag with `<md-vuelidated>`.
+   Pass the desired Vue Material tag name as property `field`.
+   Express constraints in the `validations` object of your component in the usual way.
+   Bind property `model` to the respective `validations` member, e.g. `$v.input`.
+   What to use as `v-model` for the input depends on the input component, see the examples
    below.


#### Examples

All examples assume that a suitable `validations` object has been defined.

Validating text:

```html
<md-vuelidated field="md-field" :model="$v.email">
  <label>Enter your email address</label>
  <md-input type="email" v-model.trim="$v.email.$model" />
</md-vuelidated>
```

Validating a selection:

```html
<md-vuelidated field="md-field" :model="$v.toppings">
  <label>Select at most two toppings</label>
  <md-select v-model.trim="toppings" multiple>
    <md-option value="1">Pepperoni</md-option>
    <md-option value="2">Mushrooms</md-option>
    <md-option value="3">Onions</md-option>
  </md-select>
</md-vuelidated>
```

Validating an autocomplete field:

```html
<md-vuelidated field="md-autocomplete" :md-options="colors" :model="$v.color">
  <label>Select a color</label>
</md-vuelidated>
```

Validating a chips field:

```html
<md-vuelidated field="md-chips" md-placeholder="Enter keywords" :model="$v.keywords">
</md-vuelidated>
```

Validating a date:

```html
<md-vuelidated field="md-datepicker" :model="$v.birthday">
  <label>Select your birthday</label>
</md-vuelidated>
```


### Providing validation messages

Validation messages can be specified in two ways (both methods can be combined):

1.  As the `messages` property of `<md-vuelidated>`.
    This property must be bound to an object containing the message for each Vuelidate
    constraint, e.g. `:messages="{ required: 'This field is required' }"`.
    
    These messages appear below the corresponding input field.

1.  As `<md-vuelidated-msg>` tags, either inside `<md-vuelidated>` or somewhere else.
    The Vuelidate constraint must be bound to property `constraint`, see the examples below.
    
    If placed inside `<md-vuelidated>` then these messages appear below the corresponding
    input field.  
    If placed outside `<md-vuelidated>` then they appear only if their container
    has the CSS-class `md-invalid`.


#### Examples

Using the `messages` property:

```html
<md-vuelidated
    field="md-field" 
    :model="$v.email"
    :messages="{ 
      required: 'Your mail address is required',
      email: 'Not a valid mail address',
    }">
  <label>Enter your email address</label>
  <md-input type="email" v-model.trim="$v.email.$model" />
</md-vuelidated>
```

As `<md-vuelidated-msg>` tags:

```html
<md-vuelidated field="md-field" :model="$v.email">
  <label>Enter your email address</label>
  <md-input type="email" v-model.trim="$v.email.$model" />
  <md-vuelidated-msg :constraint="$v.email.required">Your mail address is required</md-vuelidated-msg>
  <md-vuelidated-msg :constraint="$v.email.email">Not a valid mail address</md-vuelidated-msg>
</md-vuelidated>
```

Combining both methods:

```html
<md-vuelidated
    field="md-field" 
    :model="$v.email"
    :messages="{ required: 'Your mail address is required' }">
  <label>Enter your email address</label>
  <md-input type="email" v-model.trim="$v.email.$model" />
  <md-vuelidated-msg :constraint="$v.email.email">Not a valid mail address</md-vuelidated-msg>
</md-vuelidated>
```


## License

[MIT](http://opensource.org/licenses/MIT)
