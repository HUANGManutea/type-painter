import { KeyboardButtonTheme, KeyboardLayoutObject } from "react-simple-keyboard";
import { InlineLayout } from "../lib/models";

// LayoutButtonThemes interface to store button themes by keyboard layout name and by palette
export interface LayoutButtonThemes {
  [layout: string]: ButtonThemes;
}

// ButtomThemes to store button themes by palette
export interface ButtonThemes {
  [palette: string]: KeyboardButtonTheme[];
}


/**
 * the keyboard layouts
 */
export const layouts: KeyboardLayoutObject = {
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
export const validInputKey = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ←→↓↑";

// the keyboard layouts in inline form
export const inlineLayouts: InlineLayout = {
  'en': "qwertyuiopasdfghjklzxcvbnm←↓↑→",
  'fr': "azertyuiopqsdfghjklmwxcvbn←↓↑→"
}

/**
 * Build the array of keyboard button theme depending on the layout name and the palette name
 * Used to associate a button with a css class
 * 
 * @param layoutName the keyboard layout name
 * @param paletteName the color palette name
 * @returns the array of KeyboardButtonTheme
 */
const buildButtonThemeArray = (layoutName: string, paletteName: string) => {
  const result: KeyboardButtonTheme[] = [];
  for (let i = 1; i < 27; i++) {
    result.push({
      class: `hg-${paletteName}-${i}`,
      buttons: inlineLayouts[layoutName].charAt(i - 1)
    })
  }
  return result;
}

// the object that stores the button classes
export const layoutButtonThemes: LayoutButtonThemes = {
  'en': {
    'rainbow': buildButtonThemeArray('en', 'rainbow'),
    "original": buildButtonThemeArray('en', 'original')
  },
  'fr': {
    'rainbow': buildButtonThemeArray('fr', 'rainbow'),
    "original": buildButtonThemeArray('fr', 'original')
  }
}

export interface InlinePalettes {
  [key: string]: string[]
}

export const inlinePalettes: InlinePalettes = {
  "rainbow": [
    "rgb(255, 0, 0)",
    "rgb(255, 63, 0)",
    "rgb(255, 127, 0)",
    "rgb(255, 191, 0)",
    "rgb(254, 255, 0)",
    "rgb(191, 255, 0)",
    "rgb(127, 255, 0)",
    "rgb(63, 255, 0)",
    "rgb(0, 255, 0)",
    "rgb(0, 255, 63)",
    "rgb(0, 255, 127)",
    "rgb(0, 255, 191)",
    "rgb(0, 254, 255)",
    "rgb(0, 191, 255)",
    "rgb(0, 127, 255)",
    "rgb(0, 63, 255)",
    "rgb(0, 0, 255)",
    "rgb(63, 0, 255)",
    "rgb(127, 0, 255)",
    "rgb(191, 0, 255)",
    "rgb(255, 0, 254)",
    "rgb(255, 0, 191)",
    "rgb(255, 0, 127)",
    "rgb(255, 0, 63)",
    "rgb(0, 0, 0)",
    "rgb(255, 255, 255)",
  ],
  "original": [
    "rgb(164, 65, 118)",
    "rgb(202, 76, 62)",
    "rgb(201, 68, 53)",
    "rgb(204, 74, 44)",
    "rgb(217, 142, 67)",
    "rgb(112, 60, 45)",
    "rgb(82, 100, 86)",
    "rgb(59, 98, 134)",
    "rgb(54, 80, 144)",
    "rgb(60, 59, 123)",
    "rgb(205, 90, 97)",
    "rgb(227, 102, 53)",
    "rgb(224, 199, 76)",
    "rgb(160, 153, 73)",
    "rgb(164, 188, 92)",
    "rgb(45, 107, 99)",
    "rgb(52, 99, 156)",
    "rgb(47, 78, 141)",
    "rgb(58, 149, 201)",
    "rgb(249, 199, 214)",
    "rgb(245, 213, 197)",
    "rgb(246, 238, 85)",
    "rgb(175, 222, 211)",
    "rgb(90, 174, 205)",
    "rgb(255, 255, 255)",
    "rgb(0, 0, 0)"
  ]
}

export const getButtonColor = (layoutName: string, paletteName: string, key: string) => {
  // find the key index
  const charIndex = inlineLayouts[layoutName].indexOf(key);
  return inlinePalettes[paletteName][charIndex];
}