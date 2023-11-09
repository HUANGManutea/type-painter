'use client';
import Sketch from "react-p5";
import p5Types from "p5";
import { useEffect } from "react";
import { Dot } from "../lib/models";

type CanvasProps = {
  width: number, // width of the canvas in pixels
  height: number, // height of the canvas in pixels
  cursorSize: number, // cursor size in pixels
  input: string, // the input string
  hideCursor: boolean, // hide/show cursor
  loadImage: boolean, // true if we have to load an image
  onImageLoaded: () => void, // callback to signal parent that the image load has been done
  clearing: boolean, // true if we have to clear the canvas
  setClearing: (value: boolean) => void, // callback to signal the parent that the canvas has been cleared
  dots: Dot[], // the dots to draw, also serves as bitmap-like array
  setDots: (dots: Dot[]) => void, // callback to update the bitmap
  opacity: number, // dot opacity
}

// these variables must be outside of the component, don't know why react-p5 does not update the values when it is inside the component
// cursor X coordinate
let cursorX = 0;
// cursor Y coordinate
let cursorY = 0;
// color of the current dot
let dotColor = '';
export default function Canvas(props: CanvasProps) {

  // trigger when input or clear has changed
  useEffect(() => {
    if (props.clearing) {
      clearCanvas();
    }
    else {
      handleInput(props.input);
    }
  }, [props.input, props.clearing]);

  // trigger when we have to load an image
  useEffect(() => {
    if (props.loadImage) {
      handleLoadImage(props.dots, props.input);
    }
  }, [props.loadImage, props.dots]);

  /**
   * Loads the dots and move the cursor
   * @param dots the dots to load
   * @param input the input to load
   */
  const handleLoadImage = (dots: Dot[], input: string) => {
    resetCursor();
    props.setDots(dots);
    for (let char of input.split("")) {
      // we read the input, if we have an arrow key, we move the cursor, else we move the cursor to the left
      if (char === "←" || char === "↑" || char === "→" || char === "↓") {
        moveCursor(char);
      } else {
        moveCursor("→");
      }
    }
    props.onImageLoaded();
  }

  /**
   * Create a dot or move the cursor depending on the last char of the input
   * @param input the input
   */
  const handleInput = (input: string) => {
    if (input.length > 0) {
      const key = input[input.length - 1];
      if (key === "←" || key === "↑" || key === "→" || key === "↓") {
        moveCursor(key);
      } else {
        dotColor = getDivColor(key);
        props.setDots([
          ...props.dots,
          {
            x: cursorX,
            y: cursorY,
            width: props.cursorSize,
            height: props.cursorSize,
            color: dotColor
          }
        ])
        moveCursor("→");
      }
    }
  }

  /**
   * Clear the canvas: reset the cursor, the dots, and signal to parent
   */
  const clearCanvas = () => {
    resetCursor();
    props.setDots([]);
    props.setClearing(false);
  }

  /**
   * Gets the background-color of the associated key pressed
   * @param key the key pressed
   * @returns the color string
   */
  const getDivColor = (key: string) => {
    if (document) {
      let button = document.querySelector(`[data-skbtn="${key}"]`);
      if (button) {
        // get the background rolor, returned as rgb() string
        const bgColor = getComputedStyle(button).backgroundColor;
        const matchedColors = bgColor.match(/\d+/g);
        if (matchedColors && matchedColors.length === 3) {
          // convert to rgba() string using opacity
          const computedOpacity = props.opacity / 100;
          const rgbaColor = `rgba(${matchedColors[0]}, ${matchedColors[1]}, ${matchedColors[2]}, ${computedOpacity})`;
          return rgbaColor;
        }
      }
    }
    return '';
  }

  /**
   * react-p5 setup function
   * @param p5 the p5 object
   * @param canvasParentRef the parent
   */
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(props.width, props.height).parent(canvasParentRef);
  };

  /**
   * Draw the cursor as a rect
   * @param p5 the p5 object
   * @param x the x coordinate
   * @param y the y coordinate
   */
  const drawCursor = (p5: p5Types, x: number, y: number) => {
    p5.stroke(0, 0, 0);
    p5.fill(0, 0, 0, 0);
    p5.rect(x, y, props.cursorSize, props.cursorSize);
    p5.noStroke();
  }

  /**
   * Draw the Dot as a rect
   * @param p5 the p5 object
   * @param dot the Dot to draw
   */
  const drawDot = (p5: p5Types, dot: Dot) => {
    p5.fill(dot.color);
    p5.rect(dot.x, dot.y, dot.width, dot.height);
  }

  /**
   * Resets the position of the cursor
   */
  const resetCursor = () => {
    cursorX = 0;
    cursorY = 0;
  }

  /**
   * Changes the cursor coordinates depending on the direction
   * @param direction the arrow key direction
   */
  const moveCursor = (direction: string) => {
    if (direction === "→") {
      if (cursorX + props.cursorSize < props.width) {
        cursorX += props.cursorSize;
      } else {
        // case out of bound x
        // move only if we can go to new line
        if (cursorY + props.cursorSize < props.height) {
          cursorX = 0;
          cursorY += props.cursorSize;
        }
      }
    } else if (direction === "↑") {
      if (cursorY - props.cursorSize >= 0) {
        cursorY -= props.cursorSize;
      }
    } else if (direction === "←") {
      if (cursorX - props.cursorSize >= 0) {
        cursorX -= props.cursorSize;
      } else {
        // Move to the end of the previous line if possible
        if (cursorY - props.cursorSize >= 0) {
          cursorY -= props.cursorSize;
          cursorX = props.width - props.cursorSize;
        }
      }
    } else if (direction === "↓") {
      if (cursorY + props.cursorSize < props.height) {
        cursorY += props.cursorSize;
      }
    }
  }

  /**
   * react-p5 draw function
   * @param p5 the p5 object
   */
  const draw = (p5: p5Types) => {
    p5.background(255);
    // first draw the dots
    for (let dot of props.dots) {
      drawDot(p5, dot);
    }
    // then draw the cursor if we have to show it
    if (!props.hideCursor) {
      drawCursor(p5, cursorX, cursorY);
    }
  };

  return (
    <div className="flex flex-col place-items-center">
      <div className="border border-black">
        <Sketch setup={setup} draw={draw} className="canvasContainer" />
      </div>
    </div>
  );
}