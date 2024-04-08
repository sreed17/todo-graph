import { EventHandler, IEventData, IUiData } from "./IEventData";

export class Canvas {
  protected canvas: HTMLCanvasElement;
  protected pen: CanvasRenderingContext2D;

  protected eventData: IEventData | undefined;

  protected eventHandler: EventHandler;

  protected Components = [];

  protected prevTick: number = 0;

  protected deltaTime = 0;

  protected running = false;
  protected pending_frame: number | null = null;

  protected fps: number = 0;
  protected frame_count = 0;
  protected time_interval = 0;

  constructor(canvas: HTMLCanvasElement) {
    if (!canvas) {
      throw new Error("Canvas is null.");
    }
    this.canvas = canvas;
    this.canvas.style.width = `${window.innerWidth}px`;
    this.canvas.style.height = `${window.innerHeight}px`;
    const ratio = window.devicePixelRatio;
    this.canvas.width = window.innerWidth * ratio;
    this.canvas.height = window.innerHeight * ratio;

    const pen = canvas.getContext("2d");
    if (!pen) {
      throw new Error("Canvas is not supported.");
    }
    this.pen = pen;
    this.eventHandler = new EventHandler({
      drag_smoothing: 0.1,
      scroll_smoothing: 0.2,
      onInput: (evt_data) => {
        this.eventData = evt_data;
      },
      onUiEvent: this.onResize.bind(this),
    });
  }

  onResize(uiData: IUiData) {
    const { innerWidth, innerHeight, ratio } = uiData;
    this.canvas.width = innerWidth * ratio;
    this.canvas.height = innerHeight * ratio;
  }

  start() {
    this.prevTick = performance.now();
    this.running = true;
    this.loop();
  }

  stop() {
    if (this.running) {
      this.running = false;
      if (this.pending_frame !== null) {
        cancelAnimationFrame(this.pending_frame);
      }
    }
    console.warn("Can't stop a non running loop.");
  }

  loop() {
    const now = performance.now();
    this.deltaTime = (now - this.prevTick) / 1000;
    this.prevTick = now;
    this.time_interval += this.deltaTime;
    this.frame_count += 1;

    this.update();

    if (this.time_interval >= 1) {
      this.fps = this.frame_count / this.time_interval;
      this.time_interval = 0;
      this.frame_count = 0;
    }

    if (this.running) {
      this.pending_frame = requestAnimationFrame(this.loop.bind(this));
    }
  }

  update() {
    this.pen.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.pen.save();
    this.pen.fillStyle = "red";
    this.pen.fillRect(10, 10, 300, 400);
    this.pen.fillStyle = "black";
    this.pen.font = "48px Arial";
    this.pen.fillText(this.fps.toFixed(2).toString(), 110, 150);
    this.pen.fillText(this.frame_count.toString(), 110, 200);
    this.pen.restore();
  }

  getFPS() {
    return this.fps;
  }
}
