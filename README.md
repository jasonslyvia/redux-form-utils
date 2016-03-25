redux-form-utils [![Build Status](https://travis-ci.org/jasonslyvia/redux-form-utils.svg)](https://travis-ci.org/jasonslyvia/redux-form-utils) [![npm version](https://badge.fury.io/js/redux-form-utils.svg)](http://badge.fury.io/js/redux-form-utils)
==========================

Make handling forms in Redux less painful by providing two helpful utility functions:

 - `createForm(options)`: return a [Higher Order Component](https://gist.github.com/sebmarkbage/ef0bf1f338a7182b6775) which will pass all required form bindings (eg. `value`, `onChange` and more) to children
 - `bindRedux(options)`: return an object consists of four keys:
   - `state`: the initialState of the form
   - `reducer`: a reducer function handling form related actions
   - `actionCreators`: an object consists of two helpful action creators `clear(filed)` and `clearAll()`
   - `setInitValue`: a function to set initial value for form, useful when in `edit` mode

[Live Demo](http://jasonslyvia.github.io/redux-form-utils/examples/)

## Why

Suppose you have a form component in Redux app which consists of many `input[type=text]` and `select`s. In Redux, you have to give each input an `onChange` event handler, and handle the change action inside your reducers respectively.

That might lead to a great load of redundant and duplicated code base.

**Before**

```javascript
class Form extends React.Component {
  handleChangeName(e) {
    this.props.changeName(e.target.value);
  }

  handleChangeAddress(e) {
   this.props.changeAddress(e.target.value);
  }

  handleChangeGender(e) {
    this.props.changeGender(e.target.value);
  }

  render() {
    return (
      <form className="form">
        <input name="name" value={this.props.name} onChange={::this.handleChangeName} />
        <input name="address" value={this.props.address} onChange={::this.handleChangeAddress} />
        <select name="gender" value={this.props.gender} onChange={::this.handleChangeGender}>
          <option value="male" />
          <option value="female" />
        </select>
      </form>
    );
  }
}
```

By using `redux-form-utils`, you're freed from all these repetitive work.

**After**

```javascript
import { createForm } from 'redux-form-utils';

@createForm({
  form: 'my-form',
  fields: ['name', 'address', 'gender']
})
class Form extends React.Component {
  render() {
    // What is `this.props.fields`? This will be explained in the following docs.
    const { name, address, gender } = this.props.fields;
    return (
      <form className="form">
        <input name="name" {...name} />
        <input name="address" {...address} />
        <select {...gender}>
          <option value="male" />
          <option value="female" />
        </select>
      </form>
    );
  }
}
```

Notice how many lines of code have been reduced when you use `redux-form-utils`.

That's why I create this.

## How about `redux-form`?

It's great but it's too enormous, I just want a simple utility function to help me reduce repetitive work.

## Usage

```
$ npm install --save redux-form-utils
```

To completely make use of `redux-form-utils`, you have at least 2 steps to go.

### 1. Enhance your component

First thing is you should enhance your component by using `createForm` function.

In aforementioned example, I use this function as a [decorater](https://developer.mozilla.org/en-US/docs/Decorators). If it bugs you, you can switch to normal function paradigm.

```javascript
import { createForm } from 'redux-form-utils';

class Form extends React.Component {
  render() {
    const { name, address } = this.props.fields;
    return (
      <div className="form">
        <input name="name" {...name} />
        <input name="address" {...address} />
      </div>
    );
  }
}

const EnhancedForm = createForm({
  form: 'my-form',
  fields: ['name', 'address']
})(Form);
```

By enhancing your component, it achieves 3 extra `props`:

 - `fields`(*Object*) An object contains fields you defined in `createForm` option, it looks like this `{fields: { name: { value: '', onChange: Function }}}`
 - `clear(field)`(*Function*)  An action creator that will clear certain field
 - `clearAll()`(*Function*) An action creator to clear all fields in this form

Then in your component's `render()` method, destructure these fields to form controls like `input`, `textarea` or `select`.

```javascript
const { name } = this.props.fields;
<input {...name} />  // Give `input` a `value` props and a `onChange` props
```

At last, when you enhance your component, make sure it has Redux store's `dispatch` function as a props.

Alternatively, you can connect your component using `react-redux`'s `connect` method, in this case `dispatch` is passed as props to your component too.

### 2. Enhance your reducer

The second and the last thing to do is to enhance your reducer.

Basically you should compose your form state to your reducer's `initialState`, and handle form actions in your reducer.

```javascript
import { bindRedux } from 'redux-form-utils';
const { state: formState , reducer: formReducer, actionCreators: formActionCreators } = bindRedux({
  form: 'my-form',
  fields: ['name', 'address']
});


// `formState` has a shape of:
//  {
//    form: {
//      name: {
//        value: '',
//      },
//      address: {
//        value: '',
//      }
//    }
//  }

// Compose initialState with formState
const initialState = {
  foo: 1,
  bar: 2,
  ...formState
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'XXX_ACTION': {
      // Do sth for your own action
    }

    default:
      // Let formReducer handle default situation instead of returning state directly
      return formReducer(state, action);
  }
}
```

**Bonus**

If you some redux flow control middleware like [redux-sequence-action](https://github.com/jasonslyvia/redux-sequence-action), you can make use of actionCreators returned by `bindRedux`. It's an object consists of two keys: `clear(field)` and `clearAll()`.

So you can dispatch some action in sequence, for example send an AJAX request and then clear all form fields.

```js
function add() {
  return [sendReqeust(), clearAll()];
}
```

## Options

Both `createForm` and `bindRedux` accept the same parameter: an object of your form's configuration.

This object is in shape of:

### form

Type: *String* Default: *undefined* Required: *true*

A unique string key for your form.

### fields

Type: *Array* Default: *[]* Required: *true*

An array of form fields configuration.

For the simple way, you can pass an array of strings.

```
// Configure fields like this
fields: ['name']

// Get a props in your component like this
{
  fields: {
    name: {
      value: '',
      onChange: Function
    }
  }
}

```

It's quite enough for normal `input` and `select`, but for composite React components, like a `Calendar` or `react-reselect`, `value` and `onChange` seems insufficient.

So you can configure your field in an object as well:

```javascript
// Configure fields like this
fields: [{
  key: 'startDate',
  changeType: 'onSwitch',
  valueKey: 'date',
  // This resolver is called when your `onChange` callback (In this case, `onSwitch`) is called,
  // it will be called with excatly the same arguments provided to `onChange`, so you can resolve
  //the payload of what to change by your own
  resolver(date){
    return {
      date: date.focusedDate
    };
  }
}]

// Get a props in your component like this
{
  fields: {
    startDate: {
      date: '',
      onSwitch: Function
    }
  }
}

// Use props in component like this
const { startDate } = this.props.fields;
<Calendar {...startDate} />
```

## Tips

Since both `createForm` and `bindRedux` require the same option, it's wise to store these options into separate files and require them in your component and reducer.

Check the [Live Demo](http://jasonslyvia.github.io/redux-form-utils/examples/) for more clue.

## Scripts

```
$ npm run test
```

## License

MIT

