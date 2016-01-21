import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose } from 'redux';
import { Provider, connect } from 'react-redux';
import DevTools from './DevTools';
import reducers from './reducers/FormReducer';
import Form from './components/Form';


const finalCreateStore = compose(
  DevTools.instrument()
)(createStore);
const store = finalCreateStore(reducers);


class Root extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <DevTools />
          <App />
        </div>
      </Provider>
    );
  }
}

@connect(state => {
  return {
    form: state,
  };
})
class App extends React.Component {
  render() {
    return (
      <Form {...this.props.form} dispatch={this.props.dispatch} />
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('app'));
