import { BaseService } from '@pictode/utils';
import { Canvas, Object as FabricObject, Point } from 'fabric';

import { MouseService } from './services/mouse';
import { AppOption, ControlsOption, EventArgs, Plugin, Tool } from './types';
import { DEFAULT_APP_OPTION } from './utils';

export class App extends BaseService<EventArgs> {
  public canvas: Canvas;
  public mouseService: MouseService;
  public currentTool: Tool | null = null;

  private option: AppOption & { controls: ControlsOption };
  private installedPlugins: Map<string, Plugin> = new Map();

  constructor(option?: AppOption) {
    super();
    this.option = Object.assign({}, DEFAULT_APP_OPTION, option ?? DEFAULT_APP_OPTION);
    this.canvas = new Canvas('canvas', {
      backgroundColor: this.option.backgroundColor,
    });
    // 关闭对象缓存，缩放时不会模糊
    FabricObject.prototype.objectCaching = false;
    this.setControls(this.option.controls);
    this.mouseService = new MouseService(this);
  }

  public get pointer(): Point {
    return this.mouseService.pointer;
  }

  public mount(element: HTMLElement) {
    element.appendChild(this.canvas.elements.container);
    this.canvas.setDimensions({
      width: element.clientWidth,
      height: element.clientHeight,
    });
  }

  public setControls(controls: ControlsOption | boolean): void {
    this.option.controls = controls;
    if (typeof controls === 'boolean') {
      this.option.controls.hasControls = controls;
    }

    const originalDefaults = FabricObject.getDefaults;
    FabricObject.getDefaults = (): Record<string, any> => ({
      ...originalDefaults(),
      ...(this.option.controls as ControlsOption),
    });
    this.render(true);
  }

  public setTool(tool: Tool): void {
    this.currentTool = tool;
    this.canvas.discardActiveObject();
    this.render();
  }

  public render(asyncRedraw?: boolean): void {
    if (asyncRedraw) {
      this.canvas.requestRenderAll();
    } else {
      this.canvas.renderAll();
    }
  }

  public use(plugin: Plugin, ...options: any[]): App {
    if (!this.installedPlugins.has(plugin.name)) {
      this.installedPlugins.set(plugin.name, plugin);
      plugin.install(this, ...options);
    }
    return this;
  }

  public getPlugin<T extends Plugin>(pluginName: string): T | undefined {
    return this.installedPlugins.get(pluginName) as T;
  }

  public getPlugins<T extends Plugin[]>(pluginNames: string[]): T | undefined {
    return pluginNames.map((pluginName) => this.getPlugin(pluginName)) as T;
  }

  public enablePlugin(plugins: string | string[]): App {
    if (!Array.isArray(plugins)) {
      plugins = [plugins];
    }
    const aboutToChangePlugins = this.getPlugins(plugins);
    aboutToChangePlugins?.forEach((plugin) => plugin?.enable?.());
    return this;
  }

  public disablePlugin(plugins: string | string[]): App {
    if (!Array.isArray(plugins)) {
      plugins = [plugins];
    }
    const aboutToChangePlugins = this.getPlugins(plugins);
    aboutToChangePlugins?.forEach((plugin) => plugin?.disable?.());
    return this;
  }

  public isPluginEnable(pluginName: string): boolean {
    return this.getPlugin(pluginName)?.isEnabled?.() ?? false;
  }

  public disposePlugins(plugins: string | string[]): App {
    if (!Array.isArray(plugins)) {
      plugins = [plugins];
    }
    const aboutToChangePlugins = this.getPlugins(plugins);
    aboutToChangePlugins?.forEach((plugin) => plugin?.dispose());
    return this;
  }
}

export default App;
