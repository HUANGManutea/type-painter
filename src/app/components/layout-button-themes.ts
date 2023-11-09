import { KeyboardButtonTheme } from "react-simple-keyboard";

// LayoutButtonThemes interface to store button themes by keyboard layout name and by palette
export interface LayoutButtonThemes {
  [layout: string]: ButtomThemes;
}

// ButtomThemes to store button themes by palette
export interface ButtomThemes {
  [palette: string]: KeyboardButtonTheme[];
}

// the object that stores the button classes
export const layoutButtonThemes: LayoutButtonThemes = {
  'en': {
    'rainbow': [
      {
        class: "hg-rainbow-red",
        buttons: "q"
      },
      {
        class: "hg-rainbow-red-orange",
        buttons: "w"
      },
      {
        class: "hg-rainbow-orange-red",
        buttons: "e"
      },
      {
        class: "hg-rainbow-orange",
        buttons: "r"
      },
      {
        class: "hg-rainbow-yellow-orange",
        buttons: "t"
      },
      {
        class: "hg-rainbow-yellow",
        buttons: "y"
      },
      {
        class: "hg-rainbow-lime-green",
        buttons: "u"
      },
      {
        class: "hg-rainbow-lime-green-yellow",
        buttons: "i"
      },
      {
        class: "hg-rainbow-green",
        buttons: "o"
      },
      {
        class: "hg-rainbow-green-spring",
        buttons: "p"
      },
      {
        class: "hg-rainbow-spring-green",
        buttons: "a"
      },
      {
        class: "hg-rainbow-spring-green-cyan",
        buttons: "s"
      },
      {
        class: "hg-rainbow-cyan",
        buttons: "d"
      },
      {
        class: "hg-rainbow-cyan-sky-blue",
        buttons: "f"
      },
      {
        class: "hg-rainbow-sky-blue",
        buttons: "g"
      },
      {
        class: "hg-rainbow-blue",
        buttons: "h"
      },
      {
        class: "hg-rainbow-blue-indigo",
        buttons: "j"
      },
      {
        class: "hg-rainbow-indigo",
        buttons: "k"
      },
      {
        class: "hg-rainbow-violet",
        buttons: "l"
      },
      {
        class: "hg-rainbow-violet-magenta",
        buttons: "z"
      },
      {
        class: "hg-rainbow-magenta",
        buttons: "x"
      },
      {
        class: "hg-rainbow-magenta-pink",
        buttons: "c"
      },
      {
        class: "hg-rainbow-pink",
        buttons: "v"
      },
      {
        class: "hg-rainbow-pink-red",
        buttons: "b"
      },
      {
        class: "hg-rainbow-black",
        buttons: "n"
      },
      {
        class: "hg-rainbow-white",
        buttons: "m"
      }
    ],
    "cool-warm": [
      {
        class: "hg-cool-warm-light-blue",
        buttons: "q"
      },
      {
        class: "hg-cool-warm-cerulean",
        buttons: "w"
      },
      {
        class: "hg-cool-warm-sky-blue",
        buttons: "e"
      },
      {
        class: "hg-cool-warm-aquamarine",
        buttons: "r"
      },
      {
        class: "hg-cool-warm-mint-green",
        buttons: "t"
      },
      {
        class: "hg-cool-warm-light-green",
        buttons: "y"
      },
      {
        class: "hg-cool-warm-lime-green",
        buttons: "u"
      },
      {
        class: "hg-cool-warm-yellow-green",
        buttons: "i"
      },
      {
        class: "hg-cool-warm-pale-yellow",
        buttons: "o"
      },
      {
        class: "hg-cool-warm-yellow-orange",
        buttons: "p"
      },
      {
        class: "hg-cool-warm-orange",
        buttons: "a"
      },
      {
        class: "hg-cool-warm-burnt-orange",
        buttons: "s"
      },
      {
        class: "hg-cool-warm-orange-red",
        buttons: "d"
      },
      {
        class: "hg-cool-warm-red",
        buttons: "f"
      },
      {
        class: "hg-cool-warm-red-violet",
        buttons: "g"
      },
      {
        class: "hg-cool-warm-violet-red",
        buttons: "h"
      },
      {
        class: "hg-cool-warm-magenta",
        buttons: "j"
      },
      {
        class: "hg-cool-warm-orchid",
        buttons: "k"
      },
      {
        class: "hg-cool-warm-lavender",
        buttons: "l"
      },
      {
        class: "hg-cool-warm-blue-violet",
        buttons: "z"
      },
      {
        class: "hg-cool-warm-slate-blue",
        buttons: "x"
      },
      {
        class: "hg-cool-warm-powder-blue",
        buttons: "c"
      },
      {
        class: "hg-cool-warm-light-slate",
        buttons: "v"
      },
      {
        class: "hg-cool-warm-pastel-blue",
        buttons: "b"
      },
      {
        class: "hg-cool-warm-dark-gray",
        buttons: "n"
      },
      {
        class: "hg-cool-warm-light-gray",
        buttons: "m"
      }
    ]
  },
  'fr': {
    'rainbow': [
      {
        class: "hg-rainbow-red",
        buttons: "a"
      },
      {
        class: "hg-rainbow-red-orange",
        buttons: "z"
      },
      {
        class: "hg-rainbow-orange-red",
        buttons: "e"
      },
      {
        class: "hg-rainbow-orange",
        buttons: "r"
      },
      {
        class: "hg-rainbow-yellow-orange",
        buttons: "t"
      },
      {
        class: "hg-rainbow-yellow",
        buttons: "y"
      },
      {
        class: "hg-rainbow-lime-green",
        buttons: "u"
      },
      {
        class: "hg-rainbow-lime-green-yellow",
        buttons: "i"
      },
      {
        class: "hg-rainbow-green",
        buttons: "o"
      },
      {
        class: "hg-rainbow-green-spring",
        buttons: "p"
      },
      {
        class: "hg-rainbow-spring-green",
        buttons: "q"
      },
      {
        class: "hg-rainbow-spring-green-cyan",
        buttons: "s"
      },
      {
        class: "hg-rainbow-cyan",
        buttons: "d"
      },
      {
        class: "hg-rainbow-cyan-sky-blue",
        buttons: "f"
      },
      {
        class: "hg-rainbow-sky-blue",
        buttons: "g"
      },
      {
        class: "hg-rainbow-blue",
        buttons: "h"
      },
      {
        class: "hg-rainbow-blue-indigo",
        buttons: "j"
      },
      {
        class: "hg-rainbow-indigo",
        buttons: "k"
      },
      {
        class: "hg-rainbow-violet",
        buttons: "l"
      },
      {
        class: "hg-rainbow-violet-magenta",
        buttons: "m"
      },
      {
        class: "hg-rainbow-magenta",
        buttons: "w"
      },
      {
        class: "hg-rainbow-magenta-pink",
        buttons: "x"
      },
      {
        class: "hg-rainbow-pink",
        buttons: "c"
      },
      {
        class: "hg-rainbow-pink-red",
        buttons: "v"
      },
      {
        class: "hg-rainbow-black",
        buttons: "b"
      },
      {
        class: "hg-rainbow-white",
        buttons: "n"
      }
    ],
    'cool-warm': [
      {
        class: "hg-cool-warm-light-blue",
        buttons: "a"
      },
      {
        class: "hg-cool-warm-cerulean",
        buttons: "z"
      },
      {
        class: "hg-cool-warm-sky-blue",
        buttons: "e"
      },
      {
        class: "hg-cool-warm-aquamarine",
        buttons: "r"
      },
      {
        class: "hg-cool-warm-mint-green",
        buttons: "t"
      },
      {
        class: "hg-cool-warm-light-green",
        buttons: "y"
      },
      {
        class: "hg-cool-warm-lime-green",
        buttons: "u"
      },
      {
        class: "hg-cool-warm-yellow-green",
        buttons: "i"
      },
      {
        class: "hg-cool-warm-pale-yellow",
        buttons: "o"
      },
      {
        class: "hg-cool-warm-yellow-orange",
        buttons: "p"
      },
      {
        class: "hg-cool-warm-orange",
        buttons: "q"
      },
      {
        class: "hg-cool-warm-burnt-orange",
        buttons: "s"
      },
      {
        class: "hg-cool-warm-orange-red",
        buttons: "d"
      },
      {
        class: "hg-cool-warm-red",
        buttons: "f"
      },
      {
        class: "hg-cool-warm-red-violet",
        buttons: "g"
      },
      {
        class: "hg-cool-warm-violet-red",
        buttons: "h"
      },
      {
        class: "hg-cool-warm-magenta",
        buttons: "j"
      },
      {
        class: "hg-cool-warm-orchid",
        buttons: "k"
      },
      {
        class: "hg-cool-warm-lavender",
        buttons: "l"
      },
      {
        class: "hg-cool-warm-blue-violet",
        buttons: "m"
      },
      {
        class: "hg-cool-warm-slate-blue",
        buttons: "w"
      },
      {
        class: "hg-cool-warm-powder-blue",
        buttons: "x"
      },
      {
        class: "hg-cool-warm-light-slate",
        buttons: "c"
      },
      {
        class: "hg-cool-warm-pastel-blue",
        buttons: "v"
      },
      {
        class: "hg-cool-warm-dark-gray",
        buttons: "b"
      },
      {
        class: "hg-cool-warm-light-gray",
        buttons: "n"
      }
    ]
  }
}