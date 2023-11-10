/**
 * A Dot is a representation of a square placed on the canvas
 */
export interface Dot {
  x: number,
  y: number,
  width: number,
  height: number,
  color: DotColor
}

export interface DotColor {
  r: number,
  g: number,
  b: number,
  a: number
}

export interface Blur {
  radius: number
}

export interface Action {
  type: string,
  data: Dot | Blur
}

/**
 * Option interface used for various selects
 */
export interface Option {
  name: string;
  value: string;
}

/**
 * The object storing all of the typepainter information
 */
export interface TypePainterFileData {
  layoutName: string, // the name of the keyboard layout
  paletteName: string, // the name of the color palette
  history: Command[], // the history
  actions: Action[] // the actions
}

/**
 * Associate a layout name with an inline keyboard layout
 */
export interface InlineLayout {
  [key: string]: string
}

/**
 * The command storing action info for memento-like pattern
 */
export interface Command {
  type: string,
  data?: string
}