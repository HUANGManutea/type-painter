'use client';
import Sketch from "react-p5";
import p5Types from "p5";
import { useEffect, useLayoutEffect, useState } from "react";
import { Command, Dot, DotColor, Action, Blur } from "../lib/models";

type CanvasProps = {
  width: number, // width of the canvas in pixels
  height: number, // height of the canvas in pixels
  cursorSize: number, // cursor size in pixels
  cursorIncrement: number, // cursor increment in pixels
  history: Command[], // the input string
  hideCursor: boolean, // hide/show cursor
  loadImage: boolean, // true if we have to load an image
  onImageLoaded: () => void, // callback to signal parent that the image load has been done
  clearing: boolean, // true if we have to clear the canvas
  setClearing: (value: boolean) => void, // callback to signal the parent that the canvas has been cleared
  actions: Action[],
  setActions: (value: Action[]) => void,
  opacity: number, // dot opacity
}

// these variables must be outside of the component, don't know why react-p5 does not update the values when it is inside the component
// cursor X coordinate
let cursorX = 0;
// cursor Y coordinate
let cursorY = 0;
// color of the current dot
let dotColor: DotColor | null = null;
export default function Canvas(props: CanvasProps) {
  const [p5, setP5] = useState<p5Types>();

  // trigger when input or clear has changed
  useEffect(() => {
    if (props.clearing) {
      clearCanvas();
    }
    else {
      handleHistory(props.history);
    }
  }, [props.history, props.clearing]);

  // trigger when we have to load an image
  useEffect(() => {
    if (props.loadImage) {
      handleLoadImage(props.actions, props.history);
    }
  }, [props.loadImage, props.actions]);

  useEffect(() => {
    p5?.resizeCanvas(props.width, props.height);
  }, [props.width, props.height])

  /**
   * Loads the dots and move the cursor
   * @param actions the actions to load
   * @param history the history to load
   */
  const handleLoadImage = (actions: Action[], history: Command[]) => {
    resetCursor();
    props.setActions(actions);
    for (let command of history) {
      if (command.type === "input") {
        const key = command.data!;
        // we read the input, if we have an arrow key, we move the cursor, else we move the cursor to the left
        if (key === "←" || key === "↑" || key === "→" || key === "↓") {
          moveCursor(key, props.cursorSize);
        } else {
          moveCursor("→", props.cursorSize);
        }
      }
    }
    props.onImageLoaded();
  }

  /**
   * Create a dot or move the cursor depending on the last command of the history
   * @param history the history
   */
  const handleHistory = (history: Command[]) => {
    if (history.length > 0) {
      const command = history[history.length - 1];
      if (command.type === "input") {
        const key = command.data!;
        if (key === "←" || key === "↑" || key === "→" || key === "↓") {
          moveCursor(key, props.cursorIncrement);
        } else {
          dotColor = getDivColor(key);
          if (dotColor) {
            props.setActions([
              ...props.actions,
              {
                type: "dot",
                data: {
                  x: cursorX,
                  y: cursorY,
                  width: props.cursorSize,
                  height: props.cursorSize,
                  color: dotColor
                }
              }
            ]);
          }
          moveCursor("→", props.cursorSize);
        }
      } else {
        if (command.type === "blur") {
          props.setActions([
            ...props.actions,
            {
              type: "blur",
              data: {
                radius: Number(command.data!)
              }
            }
          ]);
        }
      }
    }
  }

  /**
   * Clear the canvas: reset the cursor, the dots, and signal to parent
   */
  const clearCanvas = () => {
    resetCursor();
    props.setActions([]);
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
          return {
            r: Number(matchedColors[0]),
            g: Number(matchedColors[1]),
            b: Number(matchedColors[2]),
            a: computedOpacity,
          } as DotColor;
        }
      }
    }
    return null;
  }

  /**
   * react-p5 setup function
   * @param p5 the p5 object
   * @param canvasParentRef the parent
   */
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    setP5(p5);
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
    p5.fill(`rgba(${dot.color.r}, ${dot.color.g}, ${dot.color.b}, ${dot.color.a})`);
    p5.rect(dot.x, dot.y, dot.width, dot.height);
  }

  /**
   * Blurs the canvas depending on the blur action
   * @param p5 the p5 object
   * @param action the blur action
   */
  const blurCanvas = (p5: p5Types, action: Blur) => {
    console.log("blurring");
    // p5.filter(p5.BLUR, radius);
    p5.filter(p5.BLUR, action.radius);
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
   * @param increment by how much the cursor must move, in pixels
   */
  const moveCursor = (direction: string, increment: number) => {
    if (direction === "→") {
      if (cursorX + increment < props.width) {
        cursorX += increment;
      } else {
        // case out of bound x
        // move only if we can go to new line
        if (cursorY + increment < props.height) {
          cursorX = 0;
          cursorY += increment;
        }
      }
    } else if (direction === "↑") {
      if (cursorY - increment >= 0) {
        cursorY -= increment;
      }
    } else if (direction === "←") {
      if (cursorX - increment >= 0) {
        cursorX -= increment;
      } else {
        // Move to the end of the previous line if possible
        if (cursorY - increment >= 0) {
          cursorY -= increment;
          cursorX = props.width - increment;
        }
      }
    } else if (direction === "↓") {
      if (cursorY + increment < props.height) {
        cursorY += increment;
      }
    }
  }

  /**
   * react-p5 draw function
   * @param p5 the p5 object
   */
  const draw = (p5: p5Types) => {
    p5.background(255);
    // first do the actions
    for (let action of props.actions) {
      if (action.type === "dot") {
        drawDot(p5, action.data as Dot);
      } else if (action.type === "blur") {
        blurCanvas(p5, action.data as Blur);
      }
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