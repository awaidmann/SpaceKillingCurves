import React from 'react'
import { selection, event as d3event } from 'd3-selection'

export default function withKeyPressBehavior(
  onKeyDown,
  onKeyUp,
  filter
) {
  return function(Component) {
    return class extends React.Component {
      constructor(props) {
        super(props)

        this._filter = () => filter
          ? filter(this.props, d3event)
          : true
        this._handleKeyEvent = (handler) =>
          handler && this._filter()
            ? handler(this.props, d3event)
            : undefined

        this._handleKeyUp = () => this._handleKeyEvent(onKeyUp)
        this._handleKeyDown = () => this._handleKeyEvent(onKeyDown)
      }

      componentDidMount() {
        // TODO: allow multiple handlers from different components.
        // <selection>.on() removes prev listener before applying new one
        selection()
          .on('keyup', this._handleKeyUp)
          .on('keydown', this._handleKeyDown)
      }

      componentWillUnmount() {
        selection()
          .on('keyup', null)
          .on('keydown', null)
      }

      render() {
        return <Component {...this.props} />
      }
    }
  }
}
