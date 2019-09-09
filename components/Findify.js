import React, { useState, useRef, useEffect } from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

const randomKey = () =>
  Math.random()
    .toString(36)
    .substring(7)

export const waitForFindify = () =>
  new Promise(resolve => {
    ;(window.findifyCallbacks = window.findifyCallbacks || []).push(findify => resolve(findify))
  })

const eventBindings = {
  autocomplete: 'change:suggestions',
  recommendation: 'change:items',
  search: 'change:items',
}

const setupFindify = ({ widgetKey = randomKey(), options = {}, config = {} }, type) => {
  const container = useRef(null);
  const [isFindifyReady, setReadyState] = React.useState(false)

  React.useEffect(() => {
    if (!container.current) return
    let findify = void 0;
    let shouldRender = true;

    (async () => {
      if (!shouldRender) return
      findify = await waitForFindify()
      findify.widgets.attach(container.current, type, {
        ...options,
        ...config,
        title: 'Rekommenderade produkter',
        widgetKey,
        disableAutoRequest: true,
      })

      const widget = findify.widgets.get(widgetKey)

      const handleFirstResponse = () => {
        setReadyState(true)
        widget.agent.off(handleFirstResponse)
      }

      widget.agent.defaults(options).on(eventBindings[type], handleFirstResponse)

      if (['search', 'smart-collection'].includes(type)) {
        widget.agent.applyState(findify.utils.getQuery())
      }
    })()

    return () => {
      if (!findify) return (shouldRender = false)
      findify.widgets.detach(widgetKey)
    }
  }, [options, config, container])

  return [container, isFindifyReady]
}

export default ({ children, placeholder, type, ...rest }) => {
  const [container, isFindifyReady] = setupFindify(rest, type);
  
  if (type === 'autocomplete') {
    return (
      <Input
        inputRef={container}
        type="search"
        disableUnderline
        placeholder={'Search'}
        endAdornment={
          <InputAdornment position="end">
            <IconButton aria-label="Search icon">
              <SearchIcon fontSize="large" />
            </IconButton>
          </InputAdornment>
        }
      />
    )
  }
  return (
    <React.Fragment>
      { !isFindifyReady && placeholder }
      {
        children
          && React.cloneElement(children, { ref: container })
          || <div ref={container} />
      }
    </React.Fragment>
  )
}