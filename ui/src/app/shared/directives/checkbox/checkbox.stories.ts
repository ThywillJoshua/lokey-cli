import type { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { CheckboxDirective } from './checkbox.directive';

@Component({
  standalone: true,
  imports: [CheckboxDirective],
  selector: 'story-text',
  template: `
    <label appCheckbox>
      <input type="checkbox" name="checkbox" />
      Checkbox
    </label>
  `,
})
export class StoryCheckboxComponent {
  text = 'Button';
}

const meta: Meta<StoryCheckboxComponent> = {
  title: 'Directives/Checkbox',
  component: StoryCheckboxComponent,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    text: 'Button',
  },
};

export default meta;
type Story = StoryObj<StoryCheckboxComponent>;

export const Primary: Story = {
  args: {},
};
