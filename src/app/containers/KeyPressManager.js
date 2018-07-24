import { connect } from 'react-redux'
import React from 'react'
import { selection, event as d3event } from 'd3-selection'

import { beginEditMode, endEditMode } from '../actions/editor'

class KeyPressManager extends React.Component {
  constructor(props) {
    super(props)

    this._handleKeyUp = () => {
      if (d3event.key === 'Meta') props.onEditModeBegin()
    }

    this._handleKeyDown = () => {
      if (d3event.key === 'Meta') props.onEditModeEnd()
    }
  }

  componentDidMount() {
    selection()
      .on('keyup', this._handleKeyUp)
      .on('keydown', this._handleKeyDown)
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
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(KeyPressManager)
