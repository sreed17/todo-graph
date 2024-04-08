export interface IEventData {
  dragging: boolean;
  mouseX: number;
  mouseY: number;
  movementX: number;
  movementY: number;
  button: number | null;
  key: string | null;
}

export interface IUiData {
  innerWidth: number;
  innerHeight: number;
  innerCenterX: number;
  innerCenterY: number;
  ratio: number;
}

export type ICoordinate = [x_coord: number, y_coord: number];

export type IEventParams = {
  scroll_smoothing: number;
  drag_smoothing: number;
  onInput: (evt_data: IEventData, evt: unknown) => void;
  onUiEvent: (win_data: IUiData, evt: UIEvent) => void;
};

export class EventHandler {
  protected event_data: IEventData = {
    dragging: false,
    mouseX: 0,
    mouseY: 0,
    movementX: 0,
    movementY: 0,
    button: null,
    key: null,
  };

  protected ui_data: IUiData = {
    innerWidth: 0,
    innerHeight: 0,
    innerCenterX: 0,
    innerCenterY: 0,
    ratio: 0,
  };

  protected scroll_smoothing: number;
  protected drag_smoothing: number;

  protected prev_pos: ICoordinate | null = null;

  protected onEvent: IEventParams["onInput"];

  protected onUiEvent: IEventParams["onUiEvent"];

  constructor({
    scroll_smoothing,
    drag_smoothing,
    onInput,
    onUiEvent,
  }: IEventParams) {
    this.scroll_smoothing = scroll_smoothing;
    this.drag_smoothing = drag_smoothing;
    this.onEvent = onInput;
    this.onUiEvent = onUiEvent;

    window.onload = () => {
      window.addEventListener("mousedown", this.onMouseDown.bind(this));
      window.addEventListener("mouseup", this.onMouseUp.bind(this));
      window.addEventListener("mousemove", this.onMouseMove.bind(this));
      window.addEventListener("resize", this.onResize.bind(this));
      window.addEventListener("keydown", this.onKeyDown.bind(this));
      window.addEventListener("keyup", this.onKeyUp.bind(this));
      window.addEventListener("keypress", this.onKeyPress.bind(this));
    };

    window.addEventListener("unload", () => {
      window.removeEventListener("mousedown", this.onMouseDown.bind(this));
      window.removeEventListener("mouseup", this.onMouseUp.bind(this));
      window.removeEventListener("mousemove", this.onMouseMove.bind(this));
      window.removeEventListener("resize", this.onResize.bind(this));
      window.removeEventListener("keydown", this.onKeyDown.bind(this));
      window.removeEventListener("keyup", this.onKeyUp.bind(this));
      window.removeEventListener("keypress", this.onKeyPress.bind(this));
    });
  }

  onKeyDown(evt: KeyboardEvent) {
    this.onEvent(this.event_data, evt);
  }

  onKeyUp(evt: KeyboardEvent) {
    this.onEvent(this.event_data, evt);
  }

  onKeyPress(evt: KeyboardEvent) {
    this.event_data.key = evt.key;
    this.onEvent(this.event_data, evt);
  }

  onMouseDown(evt: MouseEvent) {
    if (evt.button === 0) {
      this.event_data.dragging = true;
    }
    this.prev_pos = [evt.clientX, evt.clientY];
    this.onEvent(this.event_data, evt);
  }

  onMouseUp(evt: MouseEvent) {
    if (evt.button === 0) {
      this.event_data.dragging = false;
    }
    this.prev_pos = null;
    this.onEvent(this.event_data, evt);
  }

  onMouseMove(evt: MouseEvent) {
    if (this.prev_pos === null) {
      return;
    }
    this.event_data.mouseX = evt.clientX;
    this.event_data.mouseY = evt.clientY;
    this.onEvent(this.event_data, evt);
  }

  onResize(evt: UIEvent) {
    this.ui_data.innerWidth = window.innerWidth;
    this.ui_data.innerHeight = window.innerHeight;
    this.ui_data.innerCenterX = this.ui_data.innerWidth / 2;
    this.ui_data.innerCenterY = this.ui_data.innerHeight / 2;
    this.ui_data.ratio = window.devicePixelRatio;
    this.onUiEvent(this.ui_data, evt);
  }
}
