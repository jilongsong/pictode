import { PanelConfig } from '@/panels/types';

export const linePanelConfig: PanelConfig = {
  bindTool: 'lineTool',
  bindShape: 'Line',
  formConfig: [
    {
      name: 'stroke',
      label: '描边',
      type: 'ColorPicker',
    },
    {
      name: 'strokeWidth',
      label: '描边宽度',
      type: 'RadioGroup',
      optionType: 'icon',
      options: [
        {
          label: 'line-1',
          value: 2,
        },
        {
          label: 'line-2',
          value: 4,
        },
        {
          label: 'line-3',
          value: 8,
        },
      ],
    },
    {
      name: 'opacity',
      label: '透明度',
      type: 'Slider',
    },
  ],
  model: {
    stroke: '#000000',
    strokeWidth: 2,
    opacity: 1,
  },
};

export default linePanelConfig;
