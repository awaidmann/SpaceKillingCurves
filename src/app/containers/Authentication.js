import { connect } from 'react-redux'

import { authenticate, revokeAuthentication } from '../actions/auth'
import { Login } from '../components/menu'

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => ({
  onAuthenticate: credentials => dispatch(authenticate(credentials)),
  onRevokeAuthentication: () => dispatch(revokeAuthentication())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login)
