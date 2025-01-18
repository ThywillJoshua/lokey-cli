import type { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { IVariant, ButtonDirective } from './button.directive';

@Component({
  standalone: true,
  imports: [ButtonDirective],
  selector: 'story-text',
  template: `
    <button style="width: 300px;" appButton [variant]="variant">
      {{ text }}
    </button>
  `,
})
export class StoryButtonComponent {
  text = 'Button';
  variant: IVariant = 'default';
}

const meta: Meta<StoryButtonComponent> = {
  title: 'Directives/Button',
  component: StoryButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'cta'],
    },
  },
  args: {
    text: 'Button',
    variant: 'default',
  },
};

export default meta;
type Story = StoryObj<StoryButtonComponent>;

export const Primary: Story = {
  args: {},
};
