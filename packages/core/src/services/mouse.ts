import { App } from '../app';
import { KonvaMouseEvent, KonvaWheelEvent, Service } from '../types';
import { Point } from '../utils';

export class Mouse extends Service {
  constructor(app: App) {
    super(app);

    this.app.stage.on<'mousedown'>('mousedown', this.onMouseDown);
    this.app.stage.on<'mouseup'>('mouseup', this.onMouseUp);
    this.app.stage.on<'mousemove'>('mousemove', this.onMouseMove);
    this.app.stage.on<'mouseover'>('mouseover', this.onMouseOver);
    this.app.stage.on<'mouseout'>('mouseout', this.onMouseOut);
    this.app.stage.on<'dblclick'>('dblclick', this.onMouseDoubleClick);
    this.app.stage.on<'click'>('click', this.onMouseClick);
    this.app.stage.on<'contextmenu'>('contextmenu', this.onMouseContextmenu);
    this.app.stage.on<'wheel'>('wheel', this.onWheel);
  }

  private onMouseDown = (event: KonvaMouseEvent): void => {
    if (event.evt.button === 1) {
      this.app.triggerPanning(true);
    }

    if (this.app.stage.draggable()) {
      return;
    }
    this.app.emit('mouse:down', { event });
  };

  private onMouseUp = (event: KonvaMouseEvent): void => {
    if (event.evt.button === 1) {
      this.app.triggerPanning(false);
    }

    if (this.app.stage.draggable()) {
      return;
    }
    this.app.emit('mouse:up', { event });
  };

  private onMouseMove = (event: KonvaMouseEvent): void => {
    if (this.app.stage.draggable()) {
      return;
    }
    this.app.emit('mouse:move', { event });
  };

  private onMouseOver = (event: KonvaMouseEvent): void => {
    if (this.app.stage.draggable()) {
      return;
    }
    this.app.emit('mouse:over', { event });
  };

  private onMouseOut = (event: KonvaMouseEvent): void => {
    if (this.app.stage.draggable()) {
      return;
    }
    this.app.emit('mouse:out', { event });
  };

  private onMouseDoubleClick = (event: KonvaMouseEvent): void => {
    if (this.app.stage.draggable()) {
      return;
    }
    this.app.emit('mouse:dbclick', { event });
  };

  private onMouseClick = (event: KonvaMouseEvent): void => {
    if (this.app.stage.draggable()) {
      return;
    }
    this.app.emit('mouse:click', { event });
  };

  private onMouseContextmenu = (event: KonvaMouseEvent): void => {
    this.app.triggerTool(false);
    this.app.emit('mouse:contextmenu', { event });
    setTimeout(() => this.app.triggerTool(true), 100);
  };

  private onWheel = (event: KonvaWheelEvent): void => {
    event.evt.preventDefault();
    if (!this.app.config.mousewheel.enabled) {
      return;
    }
    const oldScale = this.app.stage.scaleX();
    this.app.emit('canvas:zoom:start', { scale: oldScale });
    const pointer = this.app.stage.getPointerPosition() ?? new Point(0, 0);
    const mousePointTo = new Point(
      (pointer.x - this.app.stage.x()) / oldScale,
      (pointer.y - this.app.stage.y()) / oldScale
    );

    const direction = (event.evt.shiftKey && !event.evt.ctrlKey ? event.evt.deltaX : event.evt.deltaY) > 0 ? 1 : -1;
    let newScale = oldScale;
    if (direction > 0) {
      newScale += this.app.config.mousewheel.factor;
    } else {
      newScale -= this.app.config.mousewheel.factor;
    }

    // Set the scale value
    newScale = Math.min(Math.max(newScale, this.app.config.scale.min), this.app.config.scale.max);

    // Apply this scale to the stage.
    this.app.stage.scale({ x: newScale, y: newScale });

    // Compute the new position of the stage so that the same stage point
    // is under the mouse pointer.
    // Apply the new position of the stage
    this.app.stage.position({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
    this.app.emit('canvas:zoom:end', { scale: newScale });
  };

  public destroy(): void {
    this.app.stage.off('mousedown', this.onMouseDown);
    this.app.stage.off('mouseup', this.onMouseUp);
    this.app.stage.off('mousemove', this.onMouseMove);
    this.app.stage.off('mouseover', this.onMouseOver);
    this.app.stage.off('mouseout', this.onMouseOut);
    this.app.stage.off('dblclick', this.onMouseDoubleClick);
    this.app.stage.off('click', this.onMouseClick);
    this.app.stage.off('contextmenu', this.onMouseContextmenu);
    this.app.stage.off('wheel', this.onWheel);
  }
}
