redux-form-utils [![Build Status](https://travis-ci.org/jasonslyvia/redux-form-utils.svg)](https://travis-ci.org/jasonslyvia/redux-form-utils) [![npm version](https://badge.fury.io/js/redux-form-utils.svg)](http://badge.fury.io/js/redux-form-utils)
==========================

Make handling forms in Redux less painful by providing 2 helpful util function:

 - `createForm(options)`: return a [Higher Order Component]() which pass all required form bindings (eg. `value`, `onChange` and more) to children
 - `bindRedux(options)`: return a object consists of 3 keys:
  - `state`: the initialState of the form
  - `reducer`: a reducer function handling form related actions
  - `setInitValue`: a function to set initial value for form, useful when in `edit` mode

## Why

TBD

## Usage

```
$ npm install --save redux-form-utils
```
TBD

## Scripts

```
$ npm run test
```

## License

MIT

