'use client';

import { useRef, useState, KeyboardEvent } from "react";
import Keyboard, { KeyboardButtonTheme, KeyboardLayoutObject } from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import dynamic from 'next/dynamic';
import { layoutButtonThemes } from "./layout-button-themes";

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
  ],
  'fr': [
    'a z e r t y u i o p',
    'q s d f g h j k l m',
    'w x c v b n',
  ],
}

const validInputRegex = new RegExp("^[a-zA-Z0-9]+$");


export default function HomeComponent(props: HomeComponentProps) {
  const [input, setInput] = useState("");
  const [layoutName, setLayoutName] = useState("fr");
  const [paletteName, setPaletteName] = useState("rainbow");
  const [buttonTheme, setButtonTheme] = useState<KeyboardButtonTheme[]>(layoutButtonThemes['fr']['rainbow']);
  const keyboard = useRef<any>();

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

  // KEYBOARD

  const onKeyboardChange = (input: string) => {
    setInput(input);
  };

  const onKeyboardKeyPress = (button: string) => {
  };

  // INPUT
  const onInputChange = (input: string) => {
    setInput(input);
    if (keyboard.current) {
      keyboard.current.setInput(input);
    }
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    let key = event.key;
    console.log(key);
    // reject special chars
    if (!validInputRegex.test(key)) {
      event.preventDefault();
    } else {
      // normalize to lower case
      key = key.toLowerCase();
      const button = document.querySelector(`[data-skbtn="${key}"]`);
      if (button) {
        button.classList.add('hg-activeButton');
        setTimeout(() => { button.classList.remove('hg-activeButton') }, 100);
      }
    }
  }

  return (
    <div className="flex flex-col w-full h-full gap-5">
      <div className="flex flex-row gap-5">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Language</span>
          </label>
          <select className="select select-bordered" value={layoutName} onChange={(e) => updateLayout(e.target.value)}>
            {layoutOptions.map((opt: Option) => <option value={opt.value}>{opt.name}</option>)}
          </select>
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Palette</span>
          </label>
          <select className="select select-bordered" value={paletteName} onChange={(e) => updatePalette(e.target.value)}>
            {paletteOptions.map((opt: Option) => <option value={opt.value}>{opt.name}</option>)}
          </select>
        </div>
      </div>
      <Canvas />
      <div className="flex flex-col">
        <input className="input input-bordered w-full" placeholder="Type here" value={input} onChange={(e) => onInputChange(e.target.value)} onKeyDown={(e) => onInputKeyDown(e)}></input>
        <Keyboard
          keyboardRef={r => (keyboard.current = r)}
          layoutName={layoutName}
          onChange={onKeyboardChange}
          onKeyPress={onKeyboardKeyPress}
          layout={layouts}
          theme={"hg-theme-default hg-layout-default myTheme"}
          buttonTheme={buttonTheme}
        />
      </div>
    </div>
  );
}