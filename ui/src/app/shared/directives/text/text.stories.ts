import type { Meta, StoryObj } from '@storybook/angular';
import { Component, input } from '@angular/core';
import { IVariant, TextDirective } from './text.directive';

@Component({
  standalone: true,
  imports: [TextDirective],
  selector: 'story-text',
  template: `<p appText [variant]="variant()">{{ text() }}</p>`,
})
export class StoryTextComponent {
  text = input('This is a text');
  variant = input<IVariant>('paragraph');
}

const meta: Meta<StoryTextComponent> = {
  title: 'Directives/Text',
  component: StoryTextComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'paragraph',
        'paragraph-bold',
        'info',
        'info-sm',
        'title',
        'title-sm',
      ],
    },
  },
  args: {
    text: 'This is a text',
    variant: 'paragraph',
  },
};

export default meta;
type Story = StoryObj<StoryTextComponent>;

export const Primary: Story = {
  args: {},
};

export const Info: Story = {
  args: { text: 'This is an Info', variant: 'info' },
};

export const Title: Story = {
  args: {
    text: 'TITLE',
    variant: 'title',
  },
};
