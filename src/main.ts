import { Canvas } from "./app/canvas";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <canvas id="app-canvas">Canvas is not supported!</canvas>
`;

const canvasElem = document.getElementById("app-canvas")! as HTMLCanvasElement;

const canvas = new Canvas(canvasElem);
canvas.start();
