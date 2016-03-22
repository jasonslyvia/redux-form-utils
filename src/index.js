import React, { PropTypes } from 'react';

/**
 * @param  {string} options.form     A unique key to identify your form throughout the app
 * @param  {array}  options.fields   An array of string or object to configure the form fields
 * @return {object} Enhanced React Component
 */
export function createForm({ form, fields }) {
  return (Component) => {
    class ReduxForm extends React.Component {
      static propTypes = {
        form: PropTypes.object,
      };

      static contextTypes = {
        store: React.PropTypes.object
      };

      constructor(props) {
        super(props);
        this.displayName = form + 'Form';
        this.state = {};

        this.dispatch = this.props.dispatch || this.context.dispatch;
        if (typeof this.dispatch !== 'function') {
          throw new ReferenceError(`[redux-form-utils] Please pass \`dispatch\` to ${form} as props or connect it with Redux's store.`);
        }
      }

      handleChange(key, e) {
        let value;
        if (e.target) {
          value = e.target.value;
        }

        this.dispatch({
          type: '@@form/VALUE_CHANGE',
          meta: {
            form: form,
            field: key,
            complex: value === undefined,
          },
          payload: value !== undefined ? value : { ...e },
        });
      }

      clearAll() {
        this.dispatch({
          type: '@@form/CLEAR_ALL',
          meta: {
            form: form,
          },
        });
      }

      clear(field) {
        if (field && fields.indexOf(field) > -1) {
          this.dispatch({
            type: '@@form/CLEAR',
            meta: {
              form: form,
              field: field,
            },
          });
        }
      }

      render() {
        return (
          <Component {...this.props} fields={fields.reduce((prev, curr) => {
            if (typeof curr === 'string') {
              prev[curr] = {
                value: this.props.form[curr].value,
                onChange: this.handleChange.bind(this, curr),
              };
            } else {
              const { key, valueKey = 'value', resovler, changeType = 'onChange' } = curr;

              if (!key || typeof key !== 'string') {
                throw new TypeError('[redux-form-utils] If you provide a object within \`fields\` options, make sure this object has a key which named \`key\`, and the type of it\'s value is string.');
              }

              prev[key] = {
                [valueKey]: this.props.form[key][valueKey],
                [changeType]: (a, b, c, d) => {
                  if (resovler) {
                    const payload = resovler(a, b, c, d);
                    this.handleChange.call(this, key, payload);
                  } else {
                    this.handleChange.call(this, key, a, b, c, d);
                  }
                },
              };
            }

            return prev;
          }, {})}
          clearAll={::this.clearAll}
          clear={::this.clear} />
        );
      }
    }

    return ReduxForm;
  };
}


export function bindRedux({ form, fields }) {
  return {
    state: {
      form: fields.reduce((prev, curr) => {
        if (typeof curr === 'string') {
          prev[curr] = {
            value: '',
          };
        } else {
          const { key, valueKey = 'value', initValue } = curr;
          prev[key] = {
            [valueKey]: initValue !== undefined ? initValue : '',
          };
        }

        return prev;
      }, {}),
    },

    setInitValue(initObj, state) {
      if (!state || !state.form) {
        return state;
      }

      return {
        ...state,
        form: {
          ...state.form,
          ...Object.keys(initObj).reduce((prev, curr) => {
            if (typeof initObj[curr] !== 'object') {
              return {
                ...prev,
                [curr]: {
                  value: initObj[curr],
                },
              };
            }

            return {
              ...prev,
              [curr]: initObj[curr],
            };
          }, {}),
        },
      };
    },

    reducer(state, action) {
      if (action.type.indexOf('@@form') !== 0 || action.meta.form !== form) {
        return state;
      }

      switch (action.type) {
        case '@@form/VALUE_CHANGE': {
          let newField;
          if (action.meta.complex) {
            return {
              ...state,
              form: {
                ...state.form,
                [action.meta.field]: {
                  ...state.form[action.meta.field],
                  ...action.payload,
                },
              },
            };
          }

          return {
            ...state,
            form: {
              ...state.form,
              [action.meta.field]: {
                ...state.form[action.meta.field],
                value: action.payload,
              },
            },
          };
        }

        case '@@form/CLEAR_ALL': {
          return {
            ...state,
            form: Object.keys(state.form).reduce((prev, curr) => {
              prev[curr] = {
                ...state.form[curr],
                value: '',
              };

              return prev;
            }, {}),
          };
        }

        case '@@form/CLEAR': {
          return {
            ...state,
            form: {
              ...state.form,
              [action.meta.field]: {
                ...state.form[action.meta.field],
                value: '',
              },
            },
          };
        }

        default:
          return state;
      }
    },

    actionCreators: {
      clear(field) {
        return {
          type: '@@form/CLEAR',
          meta: {
            form: form,
            field: field,
          },
        };
      },

      clearAll() {
        return {
          type: '@@form/CLEAR_ALL',
          meta: {
            form: form,
          },
        };
      }
    },
  };
}
