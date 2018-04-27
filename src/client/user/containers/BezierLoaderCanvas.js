import { connect } from 'react-redux'

import { transform } from '../../shared/actions'
import Canvas from '../components/Canvas'

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => ({
  onTransform: (prevTransform) => {
    return (newTransform) => dispatch(transform(newTransform, prevTransform))
  }
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return Object.assign({}, ownProps, stateProps, {
    onTransform: dispatchProps.onTransform(stateProps.transform)
  })
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(Canvas)
