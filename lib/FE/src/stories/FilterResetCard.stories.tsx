import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import FilterResetCard from '../components/designComponent/FilterResetCard';

export default {
  title: 'Components/FilterResetCard',
  component: FilterResetCard,
} as Meta;

const Template: StoryFn = (args) => <FilterResetCard {...args} />;

export const Default = Template.bind({});
Default.args = {};
