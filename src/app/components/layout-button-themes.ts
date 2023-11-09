import { KeyboardButtonTheme } from "react-simple-keyboard";
import { InlineLayout } from "../lib/models";

// LayoutButtonThemes interface to store button themes by keyboard layout name and by palette
export interface LayoutButtonThemes {
  [layout: string]: ButtonThemes;
}

// ButtomThemes to store button themes by palette
export interface ButtonThemes {
  [palette: string]: KeyboardButtonTheme[];
}

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
  for (let i=1; i<27; i++) {
    result.push({
      class: `hg-${paletteName}-${i}`,
      buttons: inlineLayouts[layoutName].charAt(i-1)
    })
  }
  return result;
}

// the object that stores the button classes
export const layoutButtonThemes: LayoutButtonThemes = {
  'en': {
    'rainbow': buildButtonThemeArray('en', 'rainbow'),
    "cool-warm": buildButtonThemeArray('en', 'cool-warm'),
    "original": buildButtonThemeArray('en', 'original')
  },
  'fr': {
    'rainbow': buildButtonThemeArray('fr', 'rainbow'),
    "cool-warm": buildButtonThemeArray('fr', 'cool-warm'),
    "original": buildButtonThemeArray('fr', 'original')
  }
}