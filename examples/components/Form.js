import React from 'react';
import { createForm } from '../../lib/';
import formConfig from '../utils/config';

@createForm(formConfig)
class Form extends React.Component {
  render() {
    const { clear, clearAll } = this.props;
    const { name, address, gender } = this.props.fields;

    return (
      <div>
        <input type="text" {...name} placeholder="enter your name" />
        <input type="text" {...address} placeholder="enter your address" />
        <select {...gender}>
          <option>select your gender</option>
          <option value="male">male</option>
          <option value="female">female</option>
        </select>
        <div>
          <button onClick={clear.bind(null, 'name')}>clear name</button>
          <button onClick={clear.bind(null, 'address')}>clear address</button>
          <button onClick={clear.bind(null, 'gender')}>clear gender</button>
          <button onClick={clearAll}>clear all</button>
        </div>
      </div>
    );
  }
}

export default Form;
