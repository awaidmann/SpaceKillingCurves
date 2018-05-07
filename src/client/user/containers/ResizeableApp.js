import { connect } from 'react-redux'

import { resize } from '../../shared/actions'
import App from '../components/App'

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => ({
  onResize: (prevDimensions, searchPrefixes) => {
    return (width, height) => dispatch(resize({width, height}, prevDimensions, searchPrefixes))
  }
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return Object.assign({}, ownProps, stateProps, {
    onResize: dispatchProps.onResize(
      stateProps.dimensions,
      (stateProps.search || {}).viewPrefixes || [])
  })
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(App)
