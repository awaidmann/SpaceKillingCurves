import { connect } from 'react-redux'

import { transform } from '../../shared/actions'
import Canvas from '../components/Canvas'

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => ({
  onTransform: (prevTransform, searchPrefixes) => {
    return (newTransform) => dispatch(transform(newTransform, prevTransform, searchPrefixes))
  }
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return Object.assign({}, ownProps, stateProps, {
    onTransform: dispatchProps.onTransform(
      stateProps.transform,
      (stateProps.search || {}).viewPrefixes || [])
  })
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(Canvas)
