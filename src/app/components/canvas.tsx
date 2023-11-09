'use client';
import Sketch from "react-p5";
import p5Types from "p5";
import { useEffect, useState } from "react";
import { Dot } from "../lib/models";

type CanvasProps = {
  width: number,
  height: number,
  cursorSize: number,
  input: string,
  hideCursor: boolean,
  loadImage: boolean,
  onImageLoaded: () => void,
  clearing: boolean,
  setClearing: (value: boolean) => void,
  dots: Dot[],
  setDots: (dots: Dot[]) => void
}

let cursorX = 0;
let cursorY = 0;
let dotColor = '';
export default function Canvas(props: CanvasProps) {

  useEffect(() => {
    if (props.clearing) {
      clearCanvas();
    }
    else {
      handleInput(props.input);
    }
  }, [props.input, props.clearing]);

  useEffect(() => {
    if (props.loadImage) {
      handleLoadImage(props.dots, props.input);
    }
  }, [props.loadImage, props.dots])

  const handleLoadImage = (dots: Dot[], input: string) => {
    resetCursor();
    props.setDots(dots);
    for (let char of input.split("")) {
      if (char === "←" || char === "↑" || char === "→" || char === "↓") {
        moveCursor(char);
      } else {
        moveCursor("→");
      }
    }
    console.log("dots", dots);
    console.log("props.dots", props.dots);
    props.onImageLoaded();
  }

  const handleInput = (input: string) => {
    console.log("handleInput", input);
    if (input.length > 0) {
      const lastChar = input[input.length - 1];
      handleKey(lastChar);
    }
  }

  const handleKey = (key: string) => {
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

  const clearCanvas = () => {
    resetCursor();
    props.setDots([]);
    props.setClearing(false);
  }

  const getDivColor = (key: string) => {
    if (document) {
      let button = document.querySelector(`[data-skbtn="${key}"]`);
      if (button) {
        const css = getComputedStyle(button);
        return css.backgroundColor;
      }
    }
    return '';
  }

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    // use parent to render the canvas in this ref
    // (without that p5 will render the canvas outside of your component)
    p5.createCanvas(props.width, props.height).parent(canvasParentRef);
  };

  const drawCursor = (p5: p5Types, x: number, y: number) => {
    p5.stroke(0, 0, 0);
    p5.fill(0, 0, 0, 0);
    p5.rect(x, y, props.cursorSize, props.cursorSize);
    p5.noStroke();
    // p5.noFill();
  }

  const drawDot = (p5: p5Types, dot: Dot) => {
    p5.fill(dot.color);
    p5.rect(dot.x, dot.y, dot.width, dot.height);
    // p5.noFill();
  }

  const resetCursor = () => {
    cursorX = 0;
    cursorY = 0;
  }

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

  const draw = (p5: p5Types) => {
    p5.background(255);
    for (let dot of props.dots) {
      drawDot(p5, dot);
    }
    if (!props.hideCursor) {
      drawCursor(p5, cursorX, cursorY);
    }
    // p5.ellipse(x, y, 70,70);
    // NOTE: Do not use setState in the draw function or in functions that are executed
    // in the draw function...
    // please use normal variables or class properties for these purposes
    //x++;
  };

  return (
    <div className="flex flex-col place-items-center">
      <div className="border border-black">
        <Sketch setup={setup} draw={draw} className="canvasContainer" />
      </div>
    </div>
  );
}