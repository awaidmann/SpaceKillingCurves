import { connect } from 'react-redux'

import { fetchConfig, fetchProject } from '../../shared/actions'
import Menu from '../components/Menu'

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => ({
  onAppLoad: () => dispatch(fetchConfig()),
  onSelectProject: (id) => dispatch(fetchProject(id))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Menu)
