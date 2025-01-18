import type { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { TextInputDirective } from './text-input.directive';

@Component({
  standalone: true,
  imports: [TextInputDirective],
  selector: 'story-text',
  template: `<input
    type="text"
    appTextInput
    [placeholder]="placeholder"
    [errorMessage]="errorMessage"
    [variant]="variant"
  />`,
})
export class StoryTextComponent {
  placeholder = 'Email';
  variant = 'default';
  errorMessage = '';
}

const meta: Meta<StoryTextComponent> = {
  title: 'Directives/Text Input',
  component: StoryTextComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default'],
    },
  },
  args: {
    placeholder: 'Email',
    errorMessage: 'Error message',
    variant: 'default',
  },
};

export default meta;
type Story = StoryObj<StoryTextComponent>;

export const Primary: Story = {
  args: {},
};
