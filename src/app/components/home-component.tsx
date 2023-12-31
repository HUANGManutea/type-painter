'use client';

import { useRef, useState, useEffect, ChangeEvent } from "react";
import Keyboard, { KeyboardButtonTheme, KeyboardLayoutObject } from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import dynamic from 'next/dynamic';
import { layoutButtonThemes, layouts, validInputKey } from "./layout-button-themes";
import { Action, Command, Dot, Option, TypePainterFileData } from "../lib/models";
import FormCanvas from "./form-canvas";

// Must use a dynamic import because of react-p5
const Canvas = dynamic(
  () => import('./canvas'),
  { ssr: false }
)

type HomeComponentProps = {
}


export default function HomeComponent(props: HomeComponentProps) {
  // when a key is pressed, it is added to the input
  const [history, setHistory] = useState<Command[]>([]);
  const [layoutName, setLayoutName] = useState("en");
  const [paletteName, setPaletteName] = useState("original");
  const [buttonTheme, setButtonTheme] = useState<KeyboardButtonTheme[]>(layoutButtonThemes['en']['original']);
  const [canvasSize, setCanvasSize] = useState("300x200");
  const [canvasWidth, setCanvasWidth] = useState(300);
  const [canvasHeight, setCanvasHeight] = useState(200);
  const [cursorSize, setCursorSize] = useState(10);
  const [cursorIncrement, setCursorIncrement] = useState(10);
  const [opacity, setOpacity] = useState(100);
  const [hideCursor, setHideCursor] = useState(false);
  const [loadImage, setLoadImage] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [blurRadius, setBlurRadius] = useState(5);
  const [actions, setActions] = useState<Action[]>([]);
  // react-simple-keyboard needs a ref
  const keyboard = useRef<any>();

  /**
   * Add the key pressed to the history
   * @param key the key pressed
   */
  const addKeyToHistory = (key: string) => {
    setHistory((prevHistory) => {
      return [...prevHistory, {
        type: "input",
        data: key
      }];
    });
    // setInput((prevInput) => {
    //   const newInput = prevInput + key;
    //   return newInput;
    // });
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
          addKeyToHistory(key);
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

  /**
   * Update the input when a key is pressed on the virtual keyboard
   * @param value the key pressed
   */
  const onKeyboardKeyPress = (value: string) => {
    addKeyToHistory(value);
  }

  /**
   * Callback called by the canvas when the image has been loaded
   */
  const onImageLoaded = () => {
    setLoadImage(false);
  }

  return (
    <div className="flex flex-col w-full h-full items-center gap-5">
      <FormCanvas
      history={history}
      setHistory={setHistory}
      layoutName={layoutName}
      setLayoutName={setLayoutName}
      paletteName={paletteName}
      setPaletteName={setPaletteName}
      buttonTheme={buttonTheme}
      setButtonTheme={setButtonTheme}
      canvasSize={canvasSize}
      setCanvasSize={setCanvasSize}
      canvasWidth={canvasWidth}
      setCanvasWidth={setCanvasWidth}
      canvasHeight={canvasHeight}
      setCanvasHeight={setCanvasHeight}
      cursorSize={cursorSize}
      setCursorSize={setCursorSize}
      cursorIncrement={cursorIncrement}
      setCursorIncrement={setCursorIncrement}
      opacity={opacity}
      setOpacity={setOpacity}
      hideCursor={hideCursor}
      setHideCursor={setHideCursor}
      loadImage={loadImage}
      setLoadImage={setLoadImage}
      blurRadius={blurRadius}
      setBlurRadius={setBlurRadius}
      clearing={clearing}
      setClearing={setClearing}
      actions={actions}
      setActions={setActions}
      
      ></FormCanvas>
      <Canvas
        width={canvasWidth}
        height={canvasHeight}
        cursorSize={cursorSize}
        cursorIncrement={cursorIncrement}
        history={history}
        hideCursor={hideCursor}
        loadImage={loadImage}
        onImageLoaded={onImageLoaded}
        clearing={clearing}
        setClearing={setClearing}
        actions={actions}
        setActions={setActions}
        opacity={opacity}
        layoutName={layoutName}
        paletteName={paletteName} />
      <div className="flex flex-col place-items-center w-full sm:w-2/5">
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