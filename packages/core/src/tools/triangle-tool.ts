import { Triangle } from '../customs/triangle';
import { Tool } from '../types';
import { Point } from '../utils';

import { selectTool } from './select-tool';

export const triangleTool = (): Tool => {
  const startPointer: Point = new Point(0, 0);
  const triangle: Triangle = new Triangle({
    fill: 'transparent',
    stroke: 'black',
    strokeWidth: 2,
    sides: 3,
    radius: 0,
  });

  return {
    name: 'triangleTool',
    onActive(app) {
      app.cancelSelect();
    },
    onInactive() {
      startPointer.setXY(0, 0);
    },
    onMouseDown({ app }) {
      startPointer.clone(app.pointer);
      triangle.radius(0);
      triangle.setPosition(startPointer);
      app.add(triangle);
    },
    onMouseMove({ app }) {
      const dx = app.pointer.x - startPointer.x;
      const dy = app.pointer.y - startPointer.y;
      const newPosition = new Point(startPointer.x + dx / 2, startPointer.y + dy / 2);

      triangle.setPosition(newPosition);
      triangle.radius(newPosition.distanceTo(app.pointer));
      app.render();
    },
    onMouseUp({ app }) {
      app.setTool(selectTool(triangle));
    },
  };
};

export default triangleTool;
