import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

const randomKey = () => Math.random().toString(36).substring(7);

export const waitForFindify = () => new Promise(resolve => {
  (window.findifyCallbacks = window.findifyCallbacks || []).push((findify) => resolve(findify));
})

export default class Findify extends Component{
  container = undefined;
  findifyKey = undefined;
  widget = undefined;

  state = {
    isLoaded: false,
  }

  static propTypes = {
    widgetKey: PropTypes.string,
    type: PropTypes.oneOf(['search', 'recommendation', 'autocomplete', 'smart-collection']),
    options: PropTypes.object,
    config: PropTypes.object
  }

  componentWillUnmount() {
    if (this.findifyKey) window.findify.widgets.detach(this.findifyKey);
  }

  handleFirstResponse = (items) => {
    this.setState({ isLoaded: true });
    this.widget.agent.off(this.handleFirstResponse)
  }

  register = (container) => {
    if (this.container || !container) return;
    const { getRef } = this.props;
    this.container = getRef && getRef(container) || container;
    this.renderFindify(this.container);
  }

  renderFindify = async (container) => {
    const { widgetKey, type, options = {}, config, ref } = this.props;
    const findify = await waitForFindify();

    this.findifyKey = widgetKey || randomKey();

    findify.widgets.attach(container, type, {
      ...options,
      ...config,
      widgetKey: this.findifyKey,
      disableAutoRequest: true
    });
  
    this.widget = findify.widgets.get(this.findifyKey);

    this.widget.agent
      .defaults(options)
      .on('change:items', this.handleFirstResponse);

    if (['search', 'smart-collection'].includes(type)) {
      this.widget.agent.applyState(findify.utils.getQuery())
    }

    if (ref) ref(this);
  }

  render() {
    const { isLoaded } = this.state;
    const { children, placeholder } = this.props;
    return (
      <React.Fragment>
        { !isLoaded && placeholder }
        {
          children
            && React.cloneElement(children, { ref: this.register })
            || <div ref={this.register} />
        }
      </React.Fragment>
    )
  }
}
