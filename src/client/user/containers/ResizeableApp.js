import { connect } from 'react-redux'

import { resize } from '../../shared/actions'
import App from '../components/App'

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => ({
  onResize: (width, height) => dispatch(resize(width, height))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App)
