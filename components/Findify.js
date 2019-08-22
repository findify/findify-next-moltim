import React, { useState, useRef, useEffect } from 'react';

const randomKey = () => Math.random().toString(36).substring(7);

export const waitForFindify = () => new Promise(resolve => {
  (window.findifyCallbacks = window.findifyCallbacks || []).push((findify) => resolve(findify));
});

const setupFindify = (container, { widgetKey = randomKey(), getRef, options = {}, config = {}, type }) => {
  const [isFindifyReady, setReadyState] = useState(false);

  useEffect(() => {
    if (!container.current) return;
    let findify = void 0;
    let shouldRender = true;

    (async () => {
      if (!shouldRender) return;
      findify = await waitForFindify();
      findify.widgets.attach(
        getRef ? getRef(container.current) : container.current, type,
        { ...options, ...config, widgetKey, disableAutoRequest: true }
      );

      const widget = findify.widgets.get(widgetKey);
  
      const handleFirstResponse = () => {
        setReadyState(true);
        widget.agent.off(handleFirstResponse)
      }
  
      widget.agent.defaults(options).on('change:items', handleFirstResponse);

      if (['search', 'smart-collection'].includes(type)) {
        widget.agent.applyState(findify.utils.getQuery())
      }
    })();

    return () => {
      if (!findify) return shouldRender = false;
      findify.widgets.detach(widgetKey)
    };
  }, [options, config, container])

  return isFindifyReady;
}

export default ({ children, placeholder, ...rest }) => {
  const container = useRef(null);
  const isFindifyReady = setupFindify(container, rest);
  
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