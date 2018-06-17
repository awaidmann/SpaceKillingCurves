import React from 'react'

import { TILES_VISIBLE } from '../defaults/settings'

export default class Settings extends React.Component {
  constructor(props) {
    super(props)

    this.toggleTilesVisible = this.toggleTilesVisible.bind(this)
  }

  toggleTilesVisible() {
    this.props.onUpdateSettings({ [TILES_VISIBLE]: !this.props.settings[TILES_VISIBLE] })
  }

  render() {
    return (
      <div>
        <label>
          <button type="button" className="" onClick={this.toggleTilesVisible}>
            { this.props.settings[TILES_VISIBLE] ? 'On' : 'Off' }
          </button>
          <span>Show tiles</span>
        </label>
      </div>
    )
  }
}
