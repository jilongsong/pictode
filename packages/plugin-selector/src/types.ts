import { KonvaMouseEvent, KonvaNode } from '@pictode/core';

import { SelectorPlugin } from './index';

declare module '@pictode/core' {
  export interface App {
    select(...nodes: KonvaNode[]): void;
    cancelSelect(...nodes: KonvaNode[]): void;
    selectByEvent(event: KonvaMouseEvent): void;
    selectAll(): void;
  }

  export interface EventArgs {
    'selector:installed': {
      selector: SelectorPlugin;
    };
    'selector:destroy': {
      selector: SelectorPlugin;
    };
    'selected:changed': {
      selected: KonvaNode[];
    };
  }
}

export interface Options {
  enable?: boolean;
  multipleSelect?: boolean;
}