import { connect } from 'react-redux'

import { resize } from '../../shared/actions'
import App from '../components/App'

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => ({
  onResize: (prevDimensions) => {
    return (width, height) => dispatch(resize({width, height}, prevDimensions))
  }
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return Object.assign({}, ownProps, stateProps, {
    onResize: dispatchProps.onResize(stateProps.dimensions)
  })
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(App)
