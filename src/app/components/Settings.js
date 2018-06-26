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
    const isActive = this.props.settings[TILES_VISIBLE]
    return (
      <div>
        <button
          type="button"
          className={'btn ' + (isActive ? 'btn-primary' : 'btn-secondary') + ' btn-sm btn-block'}
          onClick={this.toggleTilesVisible}
        >
          { isActive ? 'Hide tiles' : 'Show tiles' }
        </button>
      </div>
    )
  }
}
