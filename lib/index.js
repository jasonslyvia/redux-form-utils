'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createForm = createForm;
exports.bindRedux = bindRedux;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @param  {string} options.form     A unique key to identify your form throughout the app
 * @param  {array}  options.fields   An array of string or object to configure the form fields
 * @return {object} Enhanced React Component
 */
function createForm(_ref) {
  var form = _ref.form;
  var fields = _ref.fields;

  return function (Component) {
    var ReduxForm = function (_React$Component) {
      _inherits(ReduxForm, _React$Component);

      function ReduxForm(props) {
        _classCallCheck(this, ReduxForm);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ReduxForm).call(this, props));

        _this.displayName = form + 'Form';
        _this.state = {};
        return _this;
      }

      _createClass(ReduxForm, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
          this.dispatch = this.props.dispatch || this.context && this.context.store && this.context.store.dispatch;
          if (typeof this.dispatch !== 'function') {
            throw new ReferenceError('[redux-form-utils] Please pass `dispatch` to ' + form + ' as props or connect it with Redux\'s store.');
          }
        }
      }, {
        key: 'handleChange',
        value: function handleChange(key, e) {
          var value = e;

          if ((typeof e === 'undefined' ? 'undefined' : _typeof(e)) === 'object') {
            if (_typeof(e.target) === 'object') {
              if (e.target.tagName.toLowerCase() === 'input' && ['checkbox', 'radio'].indexOf(e.target.type) > -1) {
                value = e.target.checked;
              } else {
                value = e.target.value;
              }
            } else if (e.value !== undefined) {
              value = e.value;
            }
          }

          this.dispatch({
            type: '@@form/VALUE_CHANGE',
            meta: {
              form: form,
              field: key,
              complex: value === undefined
            },
            payload: value !== undefined ? value : _extends({}, e)
          });
        }
      }, {
        key: 'clearAll',
        value: function clearAll() {
          this.dispatch({
            type: '@@form/CLEAR_ALL',
            meta: {
              form: form
            }
          });
        }
      }, {
        key: 'clear',
        value: function clear(field) {
          if (field && fields.indexOf(field) > -1) {
            this.dispatch({
              type: '@@form/CLEAR',
              meta: {
                form: form,
                field: field
              }
            });
          }
        }
      }, {
        key: 'render',
        value: function render() {
          var _this2 = this;

          return _react2.default.createElement(Component, _extends({}, this.props, { fields: fields.reduce(function (prev, curr) {
              if (!_this2.props.form) {
                throw new Error('[redux-form-utils] `' + _this2.displayName + '.props.form` is not found, make sure add `formState` to initialState using `bindRedux` in your reducer.');
              }

              if (typeof curr === 'string') {
                prev[curr] = {
                  value: _this2.props.form[curr].value,
                  onChange: _this2.handleChange.bind(_this2, curr)
                };
              } else {
                (function () {
                  var _prev$key;

                  var key = curr.key;
                  var _curr$valueKey = curr.valueKey;
                  var valueKey = _curr$valueKey === undefined ? 'value' : _curr$valueKey;
                  var _curr$changeType = curr.changeType;
                  var changeType = _curr$changeType === undefined ? 'onChange' : _curr$changeType;
                  var resolver = curr.resolver;
                  var resovler = curr.resovler;

                  // backward compatible for a typo

                  if (!resolver) {
                    resolver = resovler;
                  }

                  if (!key || typeof key !== 'string') {
                    throw new TypeError('[redux-form-utils] If you provide an object within \`fields\` options, make sure this object has a key which named \`key\`, and the type of it\'s value is string.');
                  }

                  prev[key] = (_prev$key = {}, _defineProperty(_prev$key, valueKey, _this2.props.form[key][valueKey]), _defineProperty(_prev$key, changeType, function (a, b, c, d) {
                    if (resolver) {
                      var payload = resolver(a, b, c, d);
                      _this2.handleChange.call(_this2, key, payload);
                    } else {
                      _this2.handleChange.call(_this2, key, a, b, c, d);
                    }
                  }), _prev$key);
                })();
              }

              return prev;
            }, {}),
            clearAll: this.clearAll.bind(this),
            clear: this.clear.bind(this) }));
        }
      }]);

      return ReduxForm;
    }(_react2.default.Component);

    ReduxForm.propTypes = {
      form: _react.PropTypes.object
    };
    ReduxForm.contextTypes = {
      store: _react2.default.PropTypes.object
    };

    return ReduxForm;
  };
}

function bindRedux(_ref2) {
  var form = _ref2.form;
  var fields = _ref2.fields;

  return {
    state: {
      form: fields.reduce(function (prev, curr) {
        if (typeof curr === 'string') {
          prev[curr] = {
            value: ''
          };
        } else {
          var key = curr.key;
          var _curr$valueKey2 = curr.valueKey;
          var valueKey = _curr$valueKey2 === undefined ? 'value' : _curr$valueKey2;
          var initValue = curr.initValue;

          prev[key] = _defineProperty({}, valueKey, initValue !== undefined ? initValue : '');
        }

        return prev;
      }, {})
    },

    setInitValue: function setInitValue(initObj, state) {
      if (!state || !state.form) {
        return state;
      }

      return _extends({}, state, {
        form: _extends({}, state.form, Object.keys(initObj).reduce(function (prev, curr) {
          if (_typeof(initObj[curr]) !== 'object') {
            return _extends({}, prev, _defineProperty({}, curr, {
              value: initObj[curr]
            }));
          }

          return _extends({}, prev, _defineProperty({}, curr, initObj[curr]));
        }, {}))
      });
    },
    reducer: function reducer(state, action) {
      if (action.type.indexOf('@@form') !== 0 || action.meta.form !== form) {
        return state;
      }

      function findConfig(field) {
        var fieldConfig = fields.filter(function (k) {
          if ((typeof k === 'undefined' ? 'undefined' : _typeof(k)) === 'object') {
            return k.key === field;
          }

          return k === field;
        });

        return fieldConfig[0] || {};
      }

      switch (action.type) {
        case '@@form/VALUE_CHANGE':
          {
            var newField = undefined;
            if (action.meta.complex) {
              return _extends({}, state, {
                form: _extends({}, state.form, _defineProperty({}, action.meta.field, _extends({}, state.form[action.meta.field], action.payload)))
              });
            }

            return _extends({}, state, {
              form: _extends({}, state.form, _defineProperty({}, action.meta.field, _extends({}, state.form[action.meta.field], {
                value: action.payload
              })))
            });
          }

        case '@@form/CLEAR_ALL':
          {
            return _extends({}, state, {
              form: Object.keys(state.form).reduce(function (prev, curr) {
                var fieldConfig = findConfig(curr);
                prev[curr] = _extends({}, state.form[curr], {
                  value: fieldConfig.initValue || ''
                });

                return prev;
              }, {})
            });
          }

        case '@@form/CLEAR':
          {
            var fieldConfig = findConfig(action.meta.field);

            return _extends({}, state, {
              form: _extends({}, state.form, _defineProperty({}, action.meta.field, _extends({}, state.form[action.meta.field], {
                value: fieldConfig.initValue || ''
              })))
            });
          }

        default:
          return state;
      }
    },

    actionCreators: {
      clear: function clear(field) {
        return {
          type: '@@form/CLEAR',
          meta: {
            form: form,
            field: field
          }
        };
      },
      clearAll: function clearAll() {
        return {
          type: '@@form/CLEAR_ALL',
          meta: {
            form: form
          }
        };
      }
    }
  };
}