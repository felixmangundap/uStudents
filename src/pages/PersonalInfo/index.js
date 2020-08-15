import { connect } from 'react-redux';

import InfoSetup from './component';
import types from '../../actions/actions';
import { userWithState } from '../../reducers';


const mapStateToProps = state => ({
  state,
  userType: userWithState(state).getType(),
});

const mapDispatchToProp = {
  fetchUser: types.userFetch.request,
};

export default connect(mapStateToProps, mapDispatchToProp)(InfoSetup);
