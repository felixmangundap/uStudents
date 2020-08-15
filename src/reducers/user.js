import types from '../actions/actions';

export const initialState = {
  error: '',
  message: '',
  type: 'mentor',
  user: {
    
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.userFetch.success: {
      const { user } = action.data;
      return {
        user,
        type: user.type,
      };
    }
    case types.userFetch.error: {
      const { error } = action.data;
      return {
        error,
      };
    }
    default:
      return state;
  }
};

export const withState = state => ({
  getProfile: () => state.user,
  getType: () => state.type,
});