/**
 * A Dot is a representation of a square placed on the canvas
 */
export interface Dot {
  x: number,
  y: number,
  width: number,
  height: number,
  color: string
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
  input: string, // the input string
  dots: Dot[] // the dots
}

/**
 * Associate a layout name with an inline keyboard layout
 */
export interface InlineLayout {
  [key: string]: string
}