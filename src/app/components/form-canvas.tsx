'use client';

import input from "postcss/lib/input";
import { ChangeEvent } from "react";
import { TypePainterFileData, Option, Dot } from "../lib/models";
import { layoutButtonThemes, layouts } from "./layout-button-themes";
import { KeyboardButtonTheme } from "react-simple-keyboard";
import dynamic from "next/dynamic";
const MediaQuery = dynamic(() => import("react-responsive"), {
  ssr: false
});

type FormCanvasProps = {
  input: string,
  setInput: (value: string) => void,
  layoutName: string,
  setLayoutName: (value: string) => void,
  paletteName: string,
  setPaletteName: (value: string) => void,
  buttonTheme: KeyboardButtonTheme[],
  setButtonTheme: (value: KeyboardButtonTheme[]) => void
  canvasSize: string,
  setCanvasSize: (value: string) => void,
  canvasWidth: number,
  setCanvasWidth: (value: number) => void,
  canvasHeight: number,
  setCanvasHeight: (value: number) => void,
  cursorSize: number,
  setCursorSize: (value: number) => void,
  opacity: number,
  setOpacity: (value: number) => void,
  hideCursor: boolean,
  setHideCursor: (value: boolean) => void,
  loadImage: boolean,
  setLoadImage: (value: boolean) => void,
  clearing: boolean,
  setClearing: (value: boolean) => void,
  dots: Dot[],
  setDots: (value: Dot[]) => void
}


export default function FormCanvas(props: FormCanvasProps) {


  // the palette options
  const paletteOptions: Option[] = [
    {
      name: "rainbow",
      value: "rainbow"
    },
    {
      name: "cool-warm",
      value: "cool-warm"
    },
    {
      name: "original",
      value: "original"
    }
  ]

  // build the layout options to display
  const layoutOptions: Option[] = [];
  for (const [key, value] of Object.entries(layouts)) {
    const option: Option = {
      name: key,
      value: key
    }
    layoutOptions.push(option);
  }

  /**
   * Update the layout name and the button theme
   * @param layoutName the layout name
   */
  const updateLayout = (layoutName: string) => {
    props.setLayoutName(layoutName);
    if (layoutName in layoutButtonThemes && props.paletteName in layoutButtonThemes[layoutName]) {
      props.setButtonTheme(layoutButtonThemes[layoutName][props.paletteName]);
    }
  }

  /**
   * Update the palette name and the button theme
   * @param paletteName 
   */
  const updatePalette = (paletteName: string) => {
    props.setPaletteName(paletteName);
    if (props.layoutName in layoutButtonThemes && paletteName in layoutButtonThemes[props.layoutName]) {
      props.setButtonTheme(layoutButtonThemes[props.layoutName][paletteName]);
    }
  }

  // the canvas size options
  const canvasSizeOptions: Option[] = [
    { name: "300x200", value: "300x200" },
    { name: "600x400", value: "600x400" },
    { name: "500x300", value: "500x300" },
  ]

  /**
   * Clear and Update the canvas size
   * @param size the size (foramt WxH)
   */
  const updateCanvasSize = (size: string) => {
    clear();
    props.setCanvasSize(size);
    const [width, height] = size.split("x").map(n => Number(n));
    props.setCanvasWidth(width);
    props.setCanvasHeight(height);
  }


  /**
   * Update the cursor size
   * @param value the cursor size value
   */
  const onCursorInputChange = (value: string) => {
    const valueNumber = Number(value);
    props.setCursorSize(valueNumber);
  }

  /**
   * Update the opacity
   * @param value the opacity value
   */
  const onOpacityInputChange = (value: string) => {
    const valueNumber = Number(value);
    props.setOpacity(valueNumber);
  }

  /**
   * Saves the canvas as a png file
   */
  const saveImage = () => {
    if (document) {
      props.setHideCursor(true);
      // we use setTimeout so that the cursor is hidden before saving the image
      setTimeout(() => {
        const canvases = document.getElementsByTagName("canvas");
        if (canvases.length > 0) {
          const canvas = canvases[0];
          const url = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.download = "type-writer-image.png";
          link.href = url;
          link.click();
        }
        props.setHideCursor(false);
      }, 100);

    }
  }

  /**
   * Saves the type painter data into a json file to download
   */
  const saveTypePainterData = () => {
    // build the data
    const data: TypePainterFileData = {
      layoutName: props.layoutName,
      paletteName: props.paletteName,
      input: props.input,
      dots: props.dots
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    // build the link
    const a = document.createElement('a');
    a.download = 'type-writer-input.json';
    a.href = URL.createObjectURL(blob);
    // trigger the link
    a.click();
  }

  /**
   * Load the type painter data
   * @param e the ChangeEvent used to retrieve the file
   */
  const loadTypePainterData = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // get the file
      const file: File = files[0];
      // parse the file into a TypePainterFileData interface
      const content: string = await file.text();
      const data: TypePainterFileData = JSON.parse(content);
      // update the states
      updateLayout(data.layoutName);
      updatePalette(data.paletteName);
      props.setInput(data.input);
      props.setDots(data.dots);
      props.setLoadImage(true);
    }
  }

  /**
   * Clear the input and trigger the canvas to also clear his data
   */
  const clear = () => {
    props.setInput("");
    props.setClearing(true);
  }

  return (
    <MediaQuery minWidth={1280}>
      {(matches) =>
        matches
          ?
          // desktop layout
          <div className="flex flex-col items-center gap-5">
            <div className="flex flex-row items-end gap-5">
              <div className="form-control w-full max-w-xs tooltip" data-tip="Keyboard layout">
                <label className="label">
                  <span className="label-text">Language</span>
                </label>
                <select className="select select-bordered w-full" value={props.layoutName} onChange={(e) => updateLayout(e.target.value)}>
                  {layoutOptions.map((opt: Option) => <option value={opt.value} key={`layout-${opt.name}`}>{opt.name}</option>)}
                </select>
              </div>
              <div className="form-control w-full max-w-xs tooltip" data-tip="Color palette to apply to the keyboard">
                <label className="label">
                  <span className="label-text">Palette</span>
                </label>
                <select className="select select-bordered w-full" value={props.paletteName} onChange={(e) => updatePalette(e.target.value)}>
                  {paletteOptions.map((opt: Option) => <option value={opt.value} key={`palette-${opt.name}`}>{opt.name}</option>)}
                </select>
              </div>
              <div className="form-control w-full max-w-xs tooltip" data-tip="Canvas size in pixels (width x height), warning: changing the canvas size means resetting the canvas !">
                <label className="label">
                  <span className="label-text">Canvas size</span>
                </label>
                <select className="select select-bordered w-full" value={props.canvasSize} onChange={(e) => updateCanvasSize(e.target.value)}>
                  {canvasSizeOptions.map((opt: Option) => <option value={opt.value} key={`canvasSize-${opt.name}`}>{opt.name}</option>)}
                </select>
              </div>
              <div className="form-control w-full max-w-xs tooltip" data-tip="Dot size in pixels (the cursor and the dot are squares, the size is the length of the square side, min: 1, max: 100)">
                <label className="label">
                  <span className="label-text">Dot size</span>
                </label>
                <input id="cursorSizeInput" className="input input-bordered w-full" type="number" min="1" max="100" value={props.cursorSize} onChange={(e) => onCursorInputChange(e.target.value)}></input>
              </div>
              <div className="form-control w-full max-w-xs tooltip" data-tip="Dot opacity (min: 1, max: 100)">
                <label className="label">
                  <span className="label-text">Dot Opacity</span>
                </label>
                <input id="cursorSizeInput" className="input input-bordered w-full" type="number" min="1" max="100" value={props.opacity} onChange={(e) => onOpacityInputChange(e.target.value)}></input>
              </div>
            </div>
            <div className="flex flex-row items-end gap-5">
              <div className="form-control max-w-xs tooltip" data-tip="Save the image on your device">
                <button className="btn btn-primary" onClick={() => saveImage()}>Save Image</button>
              </div>
              <div className="form-control max-w-xs tooltip" data-tip="Save the input on your device as a json file">
                <button className="btn btn-secondary" onClick={() => saveTypePainterData()}>Save Input</button>
              </div>
              <div className="form-control w-full max-w-xs tooltip" data-tip="Load a json file from you device to use as canvas base">
                <label className="label">
                  <span className="label-text">Load Input</span>
                </label>
                <input className="file-input file-input-bordered file-input-info w-full" type="file" accept="application/json" onChange={loadTypePainterData}></input>
              </div>
              <div className="form-control max-w-xs tooltip" data-tip="Clear the input and the canvas">
                <button className="btn btn-error" onClick={() => clear()} >Clear</button>
              </div>
            </div>
          </div>


          :
          // mobile layout
          <div className="grid grid-cols-2 place-items-end gap-4">
            <div className="form-control w-full max-w-xs tooltip" data-tip="Keyboard layout">
              <label className="label">
                <span className="label-text">Language</span>
              </label>
              <select className="select select-bordered w-full" value={props.layoutName} onChange={(e) => updateLayout(e.target.value)}>
                {layoutOptions.map((opt: Option) => <option value={opt.value} key={`layout-${opt.name}`}>{opt.name}</option>)}
              </select>
            </div>
            <div className="form-control w-full max-w-xs tooltip" data-tip="Color palette to apply to the keyboard">
              <label className="label">
                <span className="label-text">Palette</span>
              </label>
              <select className="select select-bordered w-full" value={props.paletteName} onChange={(e) => updatePalette(e.target.value)}>
                {paletteOptions.map((opt: Option) => <option value={opt.value} key={`palette-${opt.name}`}>{opt.name}</option>)}
              </select>
            </div>
            <div className="form-control w-full max-w-xs tooltip" data-tip="Canvas size in pixels (width x height), warning: changing the canvas size means resetting the canvas !">
              <label className="label">
                <span className="label-text">Canvas size</span>
              </label>
              <select className="select select-bordered w-full" value={props.canvasSize} onChange={(e) => updateCanvasSize(e.target.value)}>
                {canvasSizeOptions.map((opt: Option) => <option value={opt.value} key={`canvasSize-${opt.name}`}>{opt.name}</option>)}
              </select>
            </div>
            <div className="form-control w-full max-w-xs tooltip" data-tip="Dot size in pixels (the cursor and the dot are squares, the size is the length of the square side, min: 1, max: 100)">
              <label className="label">
                <span className="label-text">Dot size</span>
              </label>
              <input id="cursorSizeInput" className="input input-bordered w-full" type="number" min="1" max="100" value={props.cursorSize} onChange={(e) => onCursorInputChange(e.target.value)}></input>
            </div>
            <div className="form-control tooltip w-full col-span-2" data-tip="Dot opacity (min: 1, max: 100)">
              <label className="label">
                <span className="label-text">Dot Opacity</span>
              </label>
              <input id="cursorSizeInput" className="input input-bordered w-full" type="number" min="1" max="100" value={props.opacity} onChange={(e) => onOpacityInputChange(e.target.value)}></input>
            </div>
            <div className="form-control w-full max-w-xs tooltip" data-tip="Save the image on your device">
              <button className="btn btn-primary w-full" onClick={() => saveImage()}>Save Image</button>
            </div>
            <div className="form-control w-full max-w-xs tooltip" data-tip="Save the input on your device as a json file">
              <button className="btn btn-secondary w-full" onClick={() => saveTypePainterData()}>Save Input</button>
            </div>
            <div className="form-control w-full max-w-xs tooltip" data-tip="Load a json file from you device to use as canvas base">
              <label className="label">
                <span className="label-text">Load Input</span>
              </label>
              <input className="file-input file-input-bordered file-input-info w-full" type="file" accept="application/json" onChange={loadTypePainterData}></input>
            </div>
            <div className="form-control w-full max-w-xs tooltip" data-tip="Clear the input and the canvas">
              <button className="btn btn-error w-full" onClick={() => clear()} >Clear</button>
            </div>
          </div>
      }
    </MediaQuery>
  );
}