redux-form-utils [![Build Status](https://travis-ci.org/jasonslyvia/redux-form-utils.svg)](https://travis-ci.org/jasonslyvia/redux-form-utils) [![npm version](https://badge.fury.io/js/redux-form-utils.svg)](http://badge.fury.io/js/redux-form-utils)
==========================

Make handling forms in Redux less painful by providing 2 helpful utility functions:

 - `createForm(options)`: return a [Higher Order Component](https://gist.github.com/sebmarkbage/ef0bf1f338a7182b6775) which will pass all required form bindings (eg. `value`, `onChange` and more) to children
 - `bindRedux(options)`: return a object consists of 3 keys:
  - `state`: the initialState of the form
  - `reducer`: a reducer function handling form related actions
  - `setInitValue`: a function to set initial value for form, useful when in `edit` mode

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

  render() {
    return (
      <div className="form">
        <input name="name" value={this.props.name} onChange={::this.handleChangeName} />
        <input name="address" value={this.props.address} onChange={::this.handleChangeAddress} />
      </div>
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
  fields: ['name', 'address']
})
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
```

Notice how many lines of code have been reduced when you use `redux-form-utils`.

That's why I create this.

## How about `redux-form`

It's great but it's too enormous, I just want a simple utility function to help me reduce repetitive work.

## Usage

```
$ npm install --save redux-form-utils
```

To completely make use of `redux-form-utils`, you have at least 2 steps to go.

### Enhance your component

First thing is you should enhance your component by using `createForm` function.

In aforementioned example, I use this function as [decorater](https://developer.mozilla.org/en-US/docs/Decorators), if it bugs you, you can switch to normal function paradigm.

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


## Scripts

```
$ npm run test
```

## License

MIT

