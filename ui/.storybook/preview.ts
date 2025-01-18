import {
  componentWrapperDecorator,
  moduleMetadata,
  type Preview,
} from '@storybook/angular';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';
import { GlobalComponent } from './decorators/global.component';

setCompodocJson(docJson);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  decorators: [
    moduleMetadata({
      imports: [GlobalComponent],
    }),
    componentWrapperDecorator(GlobalComponent),
  ],
};

export default preview;
