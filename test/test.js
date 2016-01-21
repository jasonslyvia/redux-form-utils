import React from 'react';
import ReactDOM from 'react-dom';
import { createForm, bindRedux } from '../lib/';
import { expect } from 'chai';

describe('redux-form-utils', () => {
  it('should return initialState for `bindRedux`', () => {
    const redux = bindRedux({
      form: 'test',
      fields: ['name']
    });

    expect(redux).to.be.an('object');
    expect(redux.state).to.be.an('object');
    expect(redux.state.form).to.be.an('object');
    expect(redux.state.form.name).to.be.an('object');
    expect(redux.state.form.name.value).to.equal('');
  });


  it('should return all fields defined in options', () => {
    const redux = bindRedux({
      form: 'test',
      fields: ['name', 'address']
    });

    expect(redux.state.form.name.value).to.equal('');
    expect(redux.state.form.address.value).to.equal('');
  });


  it('should return all fields defined in options as object', () => {
    const redux = bindRedux({
      form: 'test',
      fields: [{
        key: 'name',
        valueKey: 'testName',
      }, {
        key: 'address',
        valueKey: 'awesomeAddress',
      }]
    });

    expect(redux.state.form.name.testName).to.equal('');
    expect(redux.state.form.address.awesomeAddress).to.equal('');
  });


  it('should return a reducer for `bindRedux`', () => {
    const redux = bindRedux({
      form: 'test',
      fields: ['name']
    });

    expect(redux.reducer).to.be.a('function');
    expect(redux.reducer.length).to.equal(2);
  });

  it('reducer should do nothing if it is not form change', () => {
    const redux = bindRedux({
      form: 'test',
      fields: ['name']
    });

    const newState = redux.reducer({a: 1}, {type: 'SOME_ACTION'});
    expect(newState).to.eql({a: 1});
  });

  it('should change form value in reducer', () => {
    const redux = bindRedux({
      form: 'test',
      fields: ['name']
    });

    const newState = redux.reducer({
      form: {
        name: {
          value: ''
        }
      }
    }, {
      type: '@@form/VALUE_CHANGE',
      meta: {
        field: 'name',
        form: 'test',
      },
      payload: '123'
    });

    expect(newState.form.name.value).to.equal('123');
  });

  it('should clear form value in reducer', () => {
    const redux = bindRedux({
      form: 'test',
      fields: ['name']
    });

    const newState = redux.reducer({
      form: {
        name: {
          value: '123'
        }
      }
    }, {
      type: '@@form/CLEAR',
      meta: {
        field: 'name',
        form: 'test',
      }
    });

    expect(newState.form.name.value).to.equal('');
  });

  it('should clear all form value in reducer', () => {
    const redux = bindRedux({
      form: 'test',
      fields: ['name', 'address']
    });

    const newState = redux.reducer({
      form: {
        name: {
          value: '123'
        },
        address: {
          value: '345'
        }
      }
    }, {
      type: '@@form/CLEAR_ALL',
      meta: {
        form: 'test',
      }
    });

    expect(newState.form.name.value).to.equal('');
    expect(newState.form.address.value).to.equal('');
  });

});
