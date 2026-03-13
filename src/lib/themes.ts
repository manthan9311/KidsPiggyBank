export interface Theme {
  name: string;
  id: string;
  primary: string;
  secondary: string;
  accent: string;
  border: string;
  bg: string;
  hover: string;
  text: string;
}

export const themes: Record<string, Theme> = {
  pink: {
    name: 'Pink',
    id: 'pink',
    primary: 'bg-pink-500',
    secondary: 'bg-pink-600',
    accent: 'text-pink-500',
    border: 'border-pink-200',
    bg: 'from-pink-50 via-purple-50 to-blue-50',
    hover: 'hover:bg-pink-100',
    text: 'text-pink-600'
  },
  blue: {
    name: 'Blue',
    id: 'blue',
    primary: 'bg-blue-500',
    secondary: 'bg-blue-600',
    accent: 'text-blue-500',
    border: 'border-blue-200',
    bg: 'from-blue-50 via-indigo-50 to-cyan-50',
    hover: 'hover:bg-blue-100',
    text: 'text-blue-600'
  },
  purple: {
    name: 'Purple',
    id: 'purple',
    primary: 'bg-purple-500',
    secondary: 'bg-purple-600',
    accent: 'text-purple-500',
    border: 'border-purple-200',
    bg: 'from-purple-50 via-violet-50 to-fuchsia-50',
    hover: 'hover:bg-purple-100',
    text: 'text-purple-600'
  },
  green: {
    name: 'Green',
    id: 'green',
    primary: 'bg-green-500',
    secondary: 'bg-green-600',
    accent: 'text-green-500',
    border: 'border-green-200',
    bg: 'from-green-50 via-emerald-50 to-teal-50',
    hover: 'hover:bg-green-100',
    text: 'text-green-600'
  },
  orange: {
    name: 'Orange',
    id: 'orange',
    primary: 'bg-orange-500',
    secondary: 'bg-orange-600',
    accent: 'text-orange-500',
    border: 'border-orange-200',
    bg: 'from-orange-50 via-amber-50 to-yellow-50',
    hover: 'hover:bg-orange-100',
    text: 'text-orange-600'
  },
  grey: {
    name: 'Grey',
    id: 'grey',
    primary: 'bg-slate-500',
    secondary: 'bg-slate-600',
    accent: 'text-slate-500',
    border: 'border-slate-200',
    bg: 'from-slate-50 via-gray-50 to-zinc-50',
    hover: 'hover:bg-slate-100',
    text: 'text-slate-600'
  }
};

export const defaultTheme = themes.pink;

export const getTheme = (id?: string) => {
  return (id && themes[id]) || defaultTheme;
};
