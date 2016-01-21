import { bindRedux } from '../../lib/';
import formConfig from '../utils/config';

const { state: formState, reducer: formReducer } = bindRedux(formConfig);

const initialState = {
  foo: 1,
  bar: 2,
  ...formState
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SOME_ACTION_NON_EXISTENT': {
      return {
        foo: 2,
        ...state,
      };
    }

    default:
      return formReducer(state, action);
  }
}
