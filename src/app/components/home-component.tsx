'use client';

import { useRef, useState, useEffect, ChangeEvent } from "react";
import Keyboard, { KeyboardButtonTheme, KeyboardLayoutObject } from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import dynamic from 'next/dynamic';
import { inlineLayouts, layoutButtonThemes } from "./layout-button-themes";
import { Dot, InlineLayout, Option, TypePainterFileData } from "../lib/models";

// Must use a dynamic import because of react-p5
const Canvas = dynamic(
  () => import('./canvas'),
  { ssr: false }
)

type HomeComponentProps = {
}


/**
 * the keyboard layouts
 */
const layouts: KeyboardLayoutObject = {
  'en': [
    'q w e r t y u i o p',
    'a s d f g h j k l',
    'z x c v b n m',
    '← ↓ ↑ →'
  ],
  'fr': [
    'a z e r t y u i o p',
    'q s d f g h j k l m',
    'w x c v b n',
    '← ↓ ↑ →'
  ],
}

// the keyboard key filter
const validInputKey = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ←→↓↑";


export default function HomeComponent(props: HomeComponentProps) {
  // when a key is pressed, it is added to the input
  const [input, setInput] = useState("");
  const [layoutName, setLayoutName] = useState("fr");
  const [paletteName, setPaletteName] = useState("original");
  const [buttonTheme, setButtonTheme] = useState<KeyboardButtonTheme[]>(layoutButtonThemes['fr']['original']);
  const [canvasSize, setCanvasSize] = useState("600x400");
  const [canvasWidth, setCanvasWidth] = useState(600);
  const [canvasHeight, setCanvasHeight] = useState(400);
  const [cursorSize, setCursorSize] = useState(10);
  const [opacity, setOpacity] = useState(100);
  const [hideCursor, setHideCursor] = useState(false);
  const [loadImage, setLoadImage] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [dots, setDots] = useState<Dot[]>([]);
  // react-simple-keyboard needs a ref
  const keyboard = useRef<any>();

  /**
   * Add the key pressed to the input string
   * @param key the key pressed
   */
  const addKeyToInput = (key: string) => {
    setInput((prevInput) => {
      const newInput = prevInput + key;
      return newInput;
    });
  }

  /**
   * Handles the key event
   * @param event Keydown event
   */
  const handleKeyDown = (event: Event) => {
    if (document) {
      const inputFields = document.getElementsByTagName('input');
      const isInputFocused = Array.from(inputFields).some((element) => document.activeElement === element);
      // we don't want to filter the keys if the <input> for the cursor size is focused
      if (!isInputFocused) {
        // @ts-ignore
        let key: string = event.key;

        // replace the key if it is an arrow key
        if (key === "ArrowLeft") {
          key = "←";
        } else if (key === "ArrowRight") {
          key = "→";
        } else if (key === "ArrowDown") {
          key = "↓";
        } else if (key === "ArrowUp") {
          key = "↑";
        }

        // reject special chars
        if (!validInputKey.includes(key)) {
          event.preventDefault();
        } else {
          // normalize to lower case
          key = key.toLowerCase();
          const button = document.querySelector(`[data-skbtn="${key}"]`);
          if (button) {
            button.classList.add('hg-activeButton');
            setTimeout(() => { button.classList.remove('hg-activeButton') }, 100);
          }
          addKeyToInput(key);
        }
      }
    }
  }

  // trigger once after loading the DOM
  useEffect(() => {
    if (document) {
      document.addEventListener('keydown', handleKeyDown);
    }
  }, []);

  // build the layout options to display
  const layoutOptions: Option[] = [];
  for (const [key, value] of Object.entries(layouts)) {
    const option: Option = {
      name: key,
      value: key
    }
    layoutOptions.push(option);
  }

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

  /**
   * Update the layout name and the button theme
   * @param layoutName the layout name
   */
  const updateLayout = (layoutName: string) => {
    setLayoutName(layoutName);
    if (layoutName in layoutButtonThemes && paletteName in layoutButtonThemes[layoutName]) {
      setButtonTheme(layoutButtonThemes[layoutName][paletteName]);
    }
  }

  /**
   * Update the palette name and the button theme
   * @param paletteName 
   */
  const updatePalette = (paletteName: string) => {
    setPaletteName(paletteName);
    if (layoutName in layoutButtonThemes && paletteName in layoutButtonThemes[layoutName]) {
      setButtonTheme(layoutButtonThemes[layoutName][paletteName]);
    }
  }

  // the canvas size options
  const canvasSizeOptions: Option[] = [
    { name: "600x400", value: "600x400" },
    { name: "500x300", value: "500x300" },
  ]

  /**
   * Clear and Update the canvas size
   * @param size the size (foramt WxH)
   */
  const updateCanvasSize = (size: string) => {
    clear();
    setCanvasSize(size);
    const [width, height] = size.split("x").map(n => Number(n));
    setCanvasWidth(width);
    setCanvasHeight(height);
  }


  /**
   * Update the cursor size
   * @param value the cursor size value
   */
  const onCursorInputChange = (value: string) => {
    const valueNumber = Number(value);
    setCursorSize(valueNumber);
  }

  /**
   * Update the opacity
   * @param value the opacity value
   */
  const onOpacityInputChange = (value: string) => {
    const valueNumber = Number(value);
    setOpacity(valueNumber);
  }

  /**
   * Update the input when a key is pressed on the virtual keyboard
   * @param value the key pressed
   */
  const onKeyboardKeyPress = (value: string) => {
    addKeyToInput(value);
  }

  /**
   * Saves the canvas as a png file
   */
  const saveImage = () => {
    if (document) {
      setHideCursor(true);
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
        setHideCursor(false);
      }, 100);

    }
  }

  /**
   * Saves the type painter data into a json file to download
   */
  const saveTypePainterData = () => {
    // build the data
    const data: TypePainterFileData = {
      layoutName: layoutName,
      paletteName: paletteName,
      input: input,
      dots: dots
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
      setInput(data.input);
      setDots(data.dots);
      setLoadImage(true);
    }
  }

  /**
   * Callback called by the canvas when the image has been loaded
   */
  const onImageLoaded = () => {
    setLoadImage(false);
  }

  /**
   * Clear the input and trigger the canvas to also clear his data
   */
  const clear = () => {
    setInput("");
    setClearing(true);
  }

  return (
    <div className="flex flex-col w-full h-full items-center gap-5">
      <div className="flex flex-row items-end gap-5">
        <div className="form-control w-full max-w-xs tooltip" data-tip="Keyboard layout">
          <label className="label">
            <span className="label-text">Language</span>
          </label>
          <select className="select select-bordered" value={layoutName} onChange={(e) => updateLayout(e.target.value)}>
            {layoutOptions.map((opt: Option) => <option value={opt.value} key={`layout-${opt.name}`}>{opt.name}</option>)}
          </select>
        </div>
        <div className="form-control w-full max-w-xs tooltip" data-tip="Color palette to apply to the keyboard">
          <label className="label">
            <span className="label-text">Palette</span>
          </label>
          <select className="select select-bordered" value={paletteName} onChange={(e) => updatePalette(e.target.value)}>
            {paletteOptions.map((opt: Option) => <option value={opt.value} key={`palette-${opt.name}`}>{opt.name}</option>)}
          </select>
        </div>
        <div className="form-control w-full max-w-xs tooltip" data-tip="Canvas size in pixels (width x height), warning: changing the canvas size means resetting the canvas !">
          <label className="label">
            <span className="label-text">Canvas size</span>
          </label>
          <select className="select select-bordered" value={canvasSize} onChange={(e) => updateCanvasSize(e.target.value)}>
            {canvasSizeOptions.map((opt: Option) => <option value={opt.value} key={`canvasSize-${opt.name}`}>{opt.name}</option>)}
          </select>
        </div>
        <div className="form-control w-full max-w-xs tooltip" data-tip="Dot size in pixels (the cursor and the dot are squares, the size is the length of the square side, min: 1, max: 100)">
          <label className="label">
            <span className="label-text">Dot size</span>
          </label>
          <input id="cursorSizeInput" className="input input-bordered" type="number" min="1" max="100" value={cursorSize} onChange={(e) => onCursorInputChange(e.target.value)}></input>
        </div>
        <div className="form-control w-full max-w-xs tooltip" data-tip="Dot opacity (min: 1, max: 100)">
          <label className="label">
            <span className="label-text">Dot Opacity</span>
          </label>
          <input id="cursorSizeInput" className="input input-bordered" type="number" min="1" max="100" value={opacity} onChange={(e) => onOpacityInputChange(e.target.value)}></input>
        </div>
        <div className="form-control w-full max-w-xs tooltip" data-tip="Save the image on your device">
          <button className="btn btn-primary" onClick={() => saveImage()}>Save Image</button>
        </div>
        <div className="form-control w-full max-w-xs tooltip" data-tip="Save the input on your device as a json file">
          <button className="btn btn-secondary" onClick={() => saveTypePainterData()}>Save Input</button>
        </div>
        <div className="form-control w-full max-w-xs tooltip" data-tip="Load a json file from you device to use as canvas base">
          <label className="label">
            <span className="label-text">Load Input</span>
          </label>
          <input className="file-input file-input-bordered file-input-info" type="file" accept="application/json" onChange={loadTypePainterData}></input>
        </div>
        <div className="form-control w-full max-w-xs tooltip" data-tip="Clear the input and the canvas">
          <button className="btn btn-error" onClick={() => clear()} >Clear</button>
        </div>
      </div>
      <Canvas
        width={canvasWidth}
        height={canvasHeight}
        cursorSize={cursorSize}
        input={input}
        hideCursor={hideCursor}
        loadImage={loadImage}
        onImageLoaded={onImageLoaded}
        clearing={clearing}
        setClearing={setClearing}
        dots={dots}
        setDots={setDots}
        opacity={opacity} />
      <div className="flex flex-col place-items-center w-2/5">
        <Keyboard
          keyboardRef={r => (keyboard.current = r)}
          layoutName={layoutName}
          // onChange={onKeyboardChange}
          onKeyPress={onKeyboardKeyPress}
          layout={layouts}
          theme={"hg-theme-default hg-layout-default myTheme"}
          buttonTheme={buttonTheme}
        />
      </div>
    </div>
  );
}