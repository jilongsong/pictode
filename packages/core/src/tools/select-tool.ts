import { AppMouseEvent, ToolStrategy } from '../types';

export class SelectTool implements ToolStrategy {
  public onMouseDown({ app }: AppMouseEvent): void {
    app.canvas.selection = true;
    app.canvas.isDrawingMode = false;
    app.canvas.selectionColor = 'rgba(157, 157, 231, 0.5)';
    app.canvas.selectionBorderColor = 'rgb(157, 157, 231)';
    app.canvas.selectionLineWidth = 2;
  }

  public onMouseMove(): void {}

  public onMouseUp({ app }: AppMouseEvent): void {
    app.canvas.selection = false;
  }
}

export default SelectTool;
