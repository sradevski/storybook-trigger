import React from 'react';

const storybookIframe = 'storybook-preview-iframe';

const actionsCss = (sheets, el, action) => {
  const actionStyles = [];
  el.matches =
    el.matches ||
    el.webkitMatchesSelector ||
    el.mozMatchesSelector ||
    el.msMatchesSelector ||
    el.oMatchesSelector;
  for (let i = 0; i < sheets.length; i++) {
    let cssRules = sheets[i].rules || sheets[i].cssRules;
    for (let j = 0; j < cssRules.length; j++) {
      const selector = cssRules[j].selectorText;
      if (selector.includes(`:${action}`)) {
        const ruleSelectorBase = selector.replace(`:${action}`, '');
        if (el.matches(ruleSelectorBase)) {
          const res = {
            className: ruleSelectorBase,
            fullSelector: selector,
            originalCss: cssRules[j].cssText,
            actionCss: cssRules[j].cssText.replace(/.*{/, '').replace('}', ''),
          };

          actionStyles.push(res);
        }
      }
    }
  }

  return actionStyles;
};

export class Trigger extends React.Component {
  componentDidMount() {
    const { channel } = this.props;

    channel.on('sradevski/trigger/emit', this.handleTrigger);

    this.iframe = document.getElementById(storybookIframe);
    if (!this.iframe) {
      throw new Error('Cannot find Storybook iframe');
    }
  }

  componentWillUnmount() {
    if (this.stopListeningOnStory) {
      this.stopListeningOnStory();
    }

    this.unmounted = true;
    const { channel } = this.props;
    channel.removeListener('sradevski/trigger/emit', this.handleTrigger);
  }

  getSelector = params => {
    const idSelector = params.id ? `#${params.id}` : undefined;
    const classSelector = params.class
      ? `.${params.class
          .split(' ')
          .join(' .')
          .trim()}`
      : undefined;
    return params.selector || idSelector || classSelector;
  };

  getElements = (selector, iframe) => {
    if (selector) {
      return iframe.contentWindow.document.querySelectorAll(selector);
    }

    return iframe.contentWindow.document.querySelectorAll('*');
  };

  applyActionStyle = (selector, action, iframe) => {
    const elements = this.getElements(selector, iframe);
    for (let i = 0; i < elements.length; i++) {
      const actionStyles = actionsCss(
        iframe.contentWindow.document.styleSheets,
        elements[i],
        action,
      );
      elements[i].style.cssText = `${
        elements[i].style.cssText
      }; ${actionStyles.map(x => x.actionCss).join(' ')}`;
    }
  };

  handleTrigger = params => {
    const selector = this.getSelector(params);
    this.applyActionStyle(selector, params.action, this.iframe);
  };

  render() {
    return null;
  }
}
