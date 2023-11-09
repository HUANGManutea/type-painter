'use client';

import { useRef, useState, KeyboardEvent, useEffect, ChangeEvent } from "react";
import Keyboard, { KeyboardButtonTheme, KeyboardLayoutObject } from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import dynamic from 'next/dynamic';
import { layoutButtonThemes } from "./layout-button-themes";
import { Dot } from "../lib/models";

const Canvas = dynamic(
  () => import('./canvas'),
  { ssr: false }
)

type HomeComponentProps = {
}

interface Option {
  name: string;
  value: string;
}

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

// const validInputRegex = new RegExp("^[a-zA-Z0-9]+$");
const validInputKey = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ←→↓↑";

interface TypeWriterFileData {
  layoutName: string,
  paletteName: string,
  input: string,
  dots: Dot[]
}

export default function HomeComponent(props: HomeComponentProps) {
  const [input, setInput] = useState("");
  const [layoutName, setLayoutName] = useState("fr");
  const [paletteName, setPaletteName] = useState("rainbow");
  const [buttonTheme, setButtonTheme] = useState<KeyboardButtonTheme[]>(layoutButtonThemes['fr']['rainbow']);
  const [canvasSize, setCanvasSize] = useState("600x400");
  const [canvasWidth, setCanvasWidth] = useState(600);
  const [canvasHeight, setCanvasHeight] = useState(400);
  const [cursorSize, setCursorSize] = useState(10);
  const [hideCursor, setHideCursor] = useState(false);
  const [loadImage, setLoadImage] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [dots, setDots] = useState<Dot[]>([]);
  const keyboard = useRef<any>();


  const addKeyToInput = (key: string) => {
    setInput((prevInput) => {
      const newInput = prevInput + key;
      return newInput;
    });
  }

  const handleKeyDown = (event: Event) => {
    if (document) {
      const cursorSizeInput = document.getElementById("cursorSizeInput");
      if (cursorSizeInput) {
        const cursorSizeInputElement = cursorSizeInput as HTMLInputElement;
        if (!(document.activeElement === cursorSizeInputElement)) {
          // @ts-ignore
          let key: string = event.key;

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
            return;
          } else {
            // normalize to lower case
            key = key.toLowerCase();
            const button = document.querySelector(`[data-skbtn="${key}"]`);
            if (button) {
              button.classList.add('hg-activeButton');
              setTimeout(() => { button.classList.remove('hg-activeButton') }, 100);
            }
          }
          addKeyToInput(key);
        }
      }
    }
  }

  useEffect(() => {
    if (document) {
      document.addEventListener('keydown', handleKeyDown);
    }
  }, []);

  // LAYOUTNAME SELECT

  // build the layout options to display
  const layoutOptions: Option[] = [];
  for (const [key, value] of Object.entries(layouts)) {
    const option: Option = {
      name: key,
      value: key
    }
    layoutOptions.push(option);
  }

  // PALETTENAME SELECT
  const paletteOptions: Option[] = [
    {
      name: "rainbow",
      value: "rainbow"
    },
    {
      name: "cool-warm",
      value: "cool-warm"
    }
  ]

  const updateLayout = (layoutName: string) => {
    setLayoutName(layoutName);
    if (layoutName in layoutButtonThemes && paletteName in layoutButtonThemes[layoutName]) {
      setButtonTheme(layoutButtonThemes[layoutName][paletteName]);
    }
  }

  const updatePalette = (name: string) => {
    setPaletteName(name);
    if (layoutName in layoutButtonThemes && name in layoutButtonThemes[layoutName]) {
      setButtonTheme(layoutButtonThemes[layoutName][name]);
    }
  }
  // CANVASSIZE SELECT
  const canvasSizeOptions: Option[] = [
    { name: "600x400", value: "600x400" },
    { name: "500x300", value: "500x300" },
  ]
  const updateCanvasSize = (size: string) => {
    setCanvasSize(size);
    const [width, height] = size.split("x").map(n => Number(n));
    setCanvasWidth(width);
    setCanvasHeight(height);
  }


  // CURSOR SIZE INPUT
  const onCursorInputChange = (value: string) => {
    const valueNumber = Number(value);
    setCursorSize(valueNumber);
  }

  // KEYBOARD

  const onKeyboardKeyPress = (value: string) => {
    addKeyToInput(value);
  }

  const saveImage = () => {
    if (document) {
      setHideCursor(true);
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

  const saveInput = () => {
    const data: TypeWriterFileData = {
      layoutName: layoutName,
      paletteName: paletteName,
      input: input,
      dots: dots
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const a = document.createElement('a');
    a.download = 'type-writer-input.json';
    a.href = URL.createObjectURL(blob);
    a.click();
  }

  const loadInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file: File = files[0];
      const content: string = await file.text();
      const data: TypeWriterFileData = JSON.parse(content);
      console.log(data);
      updateLayout(data.layoutName);
      updatePalette(data.paletteName);
      setInput(data.input);
      setDots(data.dots);
      setLoadImage(true);
    }
  }

  const onImageLoaded = () => {
    setLoadImage(false);
  }

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
        <div className="form-control w-full max-w-xs tooltip" data-tip="Canvas size in pixels (width x height)">
          <label className="label">
            <span className="label-text">Canvas size</span>
          </label>
          <select className="select select-bordered" value={canvasSize} onChange={(e) => updateCanvasSize(e.target.value)}>
            {canvasSizeOptions.map((opt: Option) => <option value={opt.value} key={`canvasSize-${opt.name}`}>{opt.name}</option>)}
          </select>
        </div>
        <div className="form-control w-full max-w-xs tooltip" data-tip="Cursor size in pixels (the cursor is a square, the size is the length of the square side)">
          <label className="label">
            <span className="label-text">Cursor size</span>
          </label>
          <input id="cursorSizeInput" className="input input-bordered" type="number" min="1" max="100" value={cursorSize} onChange={(e) => onCursorInputChange(e.target.value)}></input>
        </div>
        <div className="form-control w-full max-w-xs tooltip" data-tip="Save the image on your device">
          <button className="btn btn-primary" onClick={() => saveImage()}>Save Image</button>
        </div>
        <div className="form-control w-full max-w-xs tooltip" data-tip="Save the input on your device as a json file">
          <button className="btn btn-secondary" onClick={() => saveInput()}>Save Input</button>
        </div>
        <div className="form-control w-full max-w-xs tooltip" data-tip="Load a json file from you device to use as canvas base">
          <label className="label">
            <span className="label-text">Load Input</span>
          </label>
          <input className="file-input file-input-bordered file-input-info" type="file" accept="application/json" onChange={loadInput}></input>
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
        setDots={setDots} />
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