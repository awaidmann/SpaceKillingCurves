import { connect } from 'react-redux'
import React from 'react'
import { selection, event as d3event } from 'd3-selection'

import { beginEditMode, endEditMode } from '../actions/editor'
import { saveBufferedPaths } from '../actions/path'

class KeyPressManager extends React.Component {
  _handleKeyUp() {
    if (d3event.key === 'Meta') this.props.onEditModeBegin()
  }

  _handleKeyDown() {
    if (d3event.key === 'Meta') this.props.onEditModeEnd()
    else if (d3event.key === 's' && d3event.metaKey) {
      d3event.preventDefault()
      this.props.onSaveBuffered(this.props.auth.authToken, this.props.path.pending)
    }
  }

  componentDidMount() {
    selection()
      .on('keyup', this._handleKeyUp.bind(this))
      .on('keydown', this._handleKeyDown.bind(this))
  }

  componentWillUnmount() {
    selection()
      .on('.keyup', null)
      .on('.keydown', null)
  }

  render() {
    return <div />
  }
}

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => ({
  onEditModeBegin: () => dispatch(beginEditMode()),
  onEditModeEnd: () => dispatch(endEditMode()),
  onSaveBuffered: (authToken, buffered) => dispatch(saveBufferedPaths(authToken, buffered)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(KeyPressManager)
