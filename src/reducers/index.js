import { combineReducers } from 'redux';
import userReducers, * as fromUser from './user';

export default combineReducers({
  userReducers,
});

export const userWithState = state => fromUser.withState(state.userReducers);
