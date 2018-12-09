import addons, { makeDecorator } from '@storybook/addons';

export const withPseudoclass = makeDecorator({
  name: 'withPseudoclass',
  parameterName: 'pseudoclass',
  skipIfNoParametersOrOptions: true,
  allowDeprecatedUsage: true,
  wrapper: (getStory, context, { parameters }) => {
    const channel = addons.getChannel();
    const story = getStory(context);

    const normalizedParams =
      typeof parameters === 'string' ? { action: parameters } : parameters;
    const allParameters = {
      ...normalizedParams,
      id: story.props.id,
      class: story.props.className || story.props.class,
    };

    channel.emit('sradevski/emit/trigger', allParameters);

    return story;
  },
});
