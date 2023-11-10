'use client';
import Sketch from "react-p5";
import p5Types from "p5";
import { useEffect, useLayoutEffect, useState } from "react";
import { Dot, DotColor } from "../lib/models";

type CanvasProps = {
  width: number, // width of the canvas in pixels
  height: number, // height of the canvas in pixels
  cursorSize: number, // cursor size in pixels
  cursorIncrement: number, // cursor increment in pixels
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
let dotColor: DotColor | null = null;
export default function Canvas(props: CanvasProps) {
  const [p5, setP5] = useState<p5Types>();

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

  useEffect(() => {
    p5?.resizeCanvas(props.width, props.height);
  }, [props.width, props.height])

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
        moveCursor(char, props.cursorSize);
      } else {
        moveCursor("→", props.cursorSize);
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
        moveCursor(key, props.cursorIncrement);
      } else {
        dotColor = getDivColor(key);
        if (dotColor) {
          props.setDots([
            ...props.dots,
            {
              x: cursorX,
              y: cursorY,
              width: props.cursorSize,
              height: props.cursorSize,
              color: dotColor
            }
          ]);
        }
        moveCursor("→", props.cursorSize);
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
    const originalColor = `rgba(${dot.color.r}, ${dot.color.g}, ${dot.color.b}, ${dot.color.a})`;
    if (dot.color.a === 1) {
      // if it's a hard color, just draw the rect
      p5.fill(originalColor);
      p5.rect(dot.x, dot.y, dot.width, dot.height);
    } else {
      // if the alpha channel is not 1, we draw a rect that has a "fill gradient"
      // for that we will draw multiple rects, lerping the color between the original and the transparent color

      // distance from the center of the rectangle to one of its corners
      const maxRadius = Math.sqrt(dot.width * dot.width + dot.height * dot.height) / 2;
      // we will modify these values in the loop to reduce the size of the rectangles
      let x = dot.x;
      let y = dot.y;
      let w = dot.width;
      let h = dot.height;

      for(let r=0; r < maxRadius; r++) {
        // remap r between 0-1 for lerp
        const inter = p5.map(r, 0, maxRadius, 0, 1);
        // lerp between original color and transparent
        const gradientColor = p5.lerpColor(p5.color(originalColor), p5.color(0,0), inter);
        // draw the rect
        p5.fill(gradientColor);
        p5.noStroke();
        p5.rect(x, y, w, h);

        // Shrink the rectangle dimensions
        x += 1;
        y += 1;
        w -= 2;
        h -= 2;
      }
    }
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