import { connect } from 'react-redux'

import { transform } from '../../shared/actions'
import Canvas from '../components/Canvas'

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => ({
  onTransform: (t) => {
    if (t) dispatch(transform(t.x, t.y, t.k))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Canvas)
