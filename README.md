# Using Vuelidate more easily in Vue Material

![Minified size](https://badgen.net/bundlephobia/min/@undecaf/vue-material-vuelidate)
![Open issues](https://badgen.net/github/open-issues/undecaf/vue-material-vuelidate)
![Vulnerabilities](https://snyk.io/test/npm/@undecaf/vue-material-vuelidate/badge.svg)
![Total downloads](https://badgen.net/npm/dt/@undecaf/vue-material-vuelidate)
![License](https://badgen.net/github/license/undecaf/vue-material-vuelidate)


[Vuelidate](https://vuelidate.js.org/) is a model-based validation for Vue.js
that decouples JavaScript validation nicely from Vue templates. On the downside,
it may lead to lengthy Vue expressions and repetitions.

The components in this package let you write concise Vuelidate
validations for [Vue Material](https://vuematerial.io/) input elements.

For example, an input field like this one ...

```html
<md-field :class="{ 'md-invalid': $v.username.$error }">
  <md-input type="text" v-model="$v.username.$model" />
  <span class="md-error" v-if="!$v.username.maxLength">
    Must not be longer than {{ $v.username.$params.maxLength.max }} chars
  </span>
</md-field>
```

... becomes:

```html
<md-vuelidated>
  <md-input type="text" v-model="username" />
  <md-vuelidated-msg constraint="maxLength" v-slot="{ max }">
    Must not be longer than {{ max }} chars
  </md-vuelidated-msg>
</md-vuelidated>
```

Here is [a more extensive online example](https://undecaf.github.io/vue-material-vuelidate/example/)
([source code](https://github.com/undecaf/vue-material-vuelidate/blob/master/src/components/Demo.vue))
of how this package can be used.


There are more benefits than just concise markup:

+   Works with [`<md-field>`](https://vuematerial.io/components/input) (any type of `<input>`, and `<textarea>`),
    [`<md-autocomplete>`](https://vuematerial.io/components/autocomplete),
    [`<md-chips>`](https://vuematerial.io/components/chips) and
    [`<md-datepicker>`](https://vuematerial.io/components/datepicker)
+   Suppresses validation messages for fields that have not been touched yet (similar to 
    [Angular Material](https://material.angular.io/components/input/overview#changing-when-error-messages-are-shown))
+   Supports Vuelidate [data nesting](https://vuelidate.js.org/#sub-data-nesting),
    [collections validation](https://vuelidate.js.org/#sub-collections-validation) and
    [accessing validator parameters](https://vuelidate.js.org/#sub-accessing-validator-parameters)


## Installation

As a module:

```shell script
$ npm install @undecaf/vue-material-vuelidate
    or
$ yarn add @undecaf/vue-material-vuelidate
```

Included as `<script>`:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@undecaf/vue-material-vuelidate/dist/components.css">
<script src="https://cdn.jsdelivr.net/npm/@undecaf/vue-material-vuelidate/dist/components.min.js"></script>
```

<ins>Please note</ins>: this module needs the CSP to allow [`unsafe-eval`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src)
(same as for the [full Vue build](https://www.fenovice.com/doc/vue/v2/guide/installation.html#CSP-environments)).
For your reassurance: nevertheless, no `eval()` inside!


## Registering the components

```javascript 1.8
import MdVuelidated from '@undecaf/vue-material-vuelidate'
import '@undecaf/vue-material-vuelidate/dist/components.css'
    ...
// This must come after Vue.use(VueMaterial) and Vue.use(Vuelidate):
Vue.use(MdVuelidated)
```

This registers `<md-vuelidated>` and `<md-vuelidated-msg>` globally.


## Validating Vue Material input elements

In order to _validate_ an `<md-field>`, `<md-autocomplete>`, `<md-chips>` or `<md-datepicker>` field
(see here for [_providing validation messages_](#providing-validation-messages)):

+   Replace that tag with `<md-vuelidated>`.
+   Pass the replaced tag name as property `field` (defaults to `md-field`).
+   Place `v-model` on an input element (`<input>` or `<textarea>`) or on 
    `<md-vuelidated>`.
+   Express constraints in the `validations` object of your component in the usual way.

The following examples assume that a suitable `validations` object has been defined.


### Basic usage

Validating text:

```html
<md-vuelidated>    <!-- becomes an <md-field> by default -->
  <label>Enter your email address</label>
  <md-input type="email" v-model.trim="mail" />
</md-vuelidated>
```

Validating a selection:

```html
<md-vuelidated>
  <label>Select at most two toppings</label>
  <md-select v-model="toppings" multiple>
    <md-option value="1">Pepperoni</md-option>
    <md-option value="2">Mushrooms</md-option>
    <md-option value="3">Onions</md-option>
  </md-select>
</md-vuelidated>
```

Validating an autocomplete field:

```html
<md-vuelidated field="md-autocomplete" :md-options="colors" v-model="color">
  <label>Select a color</label>
</md-vuelidated>
```

Validating a chips field:

```html
<md-vuelidated field="md-chips" md-placeholder="Enter keywords" v-model="keywords">
</md-vuelidated>
```

Validating a date:

```html
<md-vuelidated field="md-datepicker" v-model="dateOfBirth">
  <label>Your date of birth</label>
</md-vuelidated>
```


### Data nesting

Just use the nested path as the `v-model`, e.g.

```html
<md-vuelidated>
  <label>Homepage</label>
  <md-input type="url" v-model.trim="www.home" />
</md-vuelidated>
```


### Collections validation with `v-for`

`v-for` can be placed on `<md-vuelidated>` or on a parent element. In any case, `<md-vuelidated>`
requires a `key` that is bound to the `v-for` index.

Let's assume that `comments` is an array with elements like `{ text: 'blah' }` or an object with 
such members. Then an input field for each comment can be rendered and validated as follows:

```html
<md-vuelidated v-for="(_, index) in comments" :key="index">
  <label>Comment</label>
  <textarea v-model="comments[index].text"></textarea>
</md-vuelidated>
```

If `v-for` is on a parent element then `<md-vuelidated>` needs a copy of the `key`:

```html
<div v-for="(_, i) in comments" :key="i">
    ...
  <md-vuelidated :key="i">
    <label>Comment</label>
    <textarea v-model="comments[i].text"></textarea>
  </md-vuelidated>
    ...
</div>
```

The `v-for` index _should_ be named `index`. In nested `v-for` blocks, indices _must_ be named
`index1`, `index2` etc.  


## Providing validation messages

Validation messages can be specified in two ways both of which can be combined:

1.  As the `messages` property of `<md-vuelidated>`, bound to an object containing
    the message for each Vuelidate constraint, 
    e.g. `:messages="{ required: 'This field is required' }"`.
    
    These messages appear below the corresponding input field.

1.  As `<md-vuelidated-msg>` elements, either enclosed in `<md-vuelidated>` tags or detached.
    Property `constraint` must be set to the Vuelidate constraint name. For detached messages,
    the constraint name must be qualified with the model name, see the
    [examples below](#independent-messages).
    
    Enclosed messages appear below the corresponding input field.  

If multiple validations fail at the same time then only the first one (in declaration order)
displays a message.


### Enclosed messages

Using the `messages` property:

```html
<md-vuelidated
    :messages="{ 
      required: 'Your mail address is required',
      email: 'Not a valid mail address',
    }">
  <md-input type="email" v-model.trim="mail" />
</md-vuelidated>
```

As `<md-vuelidated-msg>` tags:

```html
<md-vuelidated>
  <label>Enter your email address</label>
  <md-input type="email" v-model.trim="mail" />
  <md-vuelidated-msg constraint="required">Your mail address is required</md-vuelidated-msg>
  <md-vuelidated-msg constraint="email">Not a valid mail address</md-vuelidated-msg>
</md-vuelidated>
```

Both methods can be combined.


### Detached messages

Messages outside of `<md-vuelidated>` blocks need their `constraint` property to be qualified 
with the model name (often the collection name):

```html
<md-vuelidated v-for="(_, index) in comments" :key="index">
  <label>Comment</label>
  <textarea v-model="comments[index].text"></textarea>
</md-vuelidated>

<!-- Detached message, referring to collection 'comments' -->
<md-vuelidated-msg constraint="comments.maxLength">Too many comments!</md-vuelidated-msg>
```


### Accessing validator parameters

The parameters of the `constraint` validator are available as a `v-slot`:

```html
<md-vuelidated-msg constraint="comments.maxLength" v-slot="params">
  You may not author more than {{ params.max }} comments
</md-vuelidated-msg>
``` 

Object destructuring lets us express this more elegantly:

```html
<md-vuelidated-msg constraint="comments.maxLength" v-slot="{ max }">
  You may not author more than {{ max }} comments
</md-vuelidated-msg>
``` 


## License

Software: [MIT](http://opensource.org/licenses/MIT)

Documentation: [CC-BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/)
