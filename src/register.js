import React from 'react';
import addons from '@storybook/addons';
import { Pseudoclass } from './Pseudoclass';

addons.register('with/pseudoclass', api => {
  const channel = addons.getChannel();
  addons.addPanel('sradevski/emit/panel', {
    title: 'Pseudoclass',
    // eslint-disable-next-line
    render: ({ active }) => (
      <Pseudoclass channel={channel} api={api} active={active} />
    ),
  });
});
