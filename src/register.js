import React from 'react';
import addons from '@storybook/addons';
import { Trigger } from './Trigger';

addons.register('sradevski/trigger', api => {
  const channel = addons.getChannel();
  addons.addPanel('sradevski/trigger/panel', {
    title: 'Trigger',
    // eslint-disable-next-line
    render: ({ active }) => (
      <Trigger channel={channel} api={api} active={active} />
    ),
  });
});
