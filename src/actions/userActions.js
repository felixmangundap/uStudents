import { createAction } from 'redux-actions';

const actionTypes = {};

actionTypes.userFetch = {
  request: createAction('userFetchRequest'),
  success: createAction('userFetchSuccess'),
  error: createAction('userFetchError'),
};

export default actionTypes;