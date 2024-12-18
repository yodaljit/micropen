import { h } from 'vue';

export interface IconProps {
  class?: string;
}

const iconStyle = {
  width: '1em',
  height: '1em',
  display: 'inline-block',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
};

const createIcon = (paths: string[]) => {
  return (props: IconProps = {}) => h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      style: iconStyle,
      class: props.class
    },
    paths.map(d => h('path', { d }))
  );
};

const createLineIcon = (lines: [number, number, number, number][]) => {
  return (props: IconProps = {}) => h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      style: iconStyle,
      class: props.class
    },
    lines.map(([x1, y1, x2, y2]) => h('line', { x1, y1, x2, y2 }))
  );
};

const icons = {
  bold: createIcon([
    'M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z',
    'M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z'
  ]),
  italic: createLineIcon([
    [19, 4, 10, 4],
    [14, 20, 5, 20],
    [15, 4, 9, 20]
  ]),
  underline: createIcon([
    'M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3',
    'M4 21h16'
  ]),
  link: createIcon([
    'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71',
    'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'
  ]),
  heading: createLineIcon([
    [6, 4, 6, 20],
    [18, 4, 18, 20],
    [6, 12, 18, 12]
  ]),
  list: createLineIcon([
    [8, 6, 21, 6],
    [8, 12, 21, 12],
    [8, 18, 21, 18],
    [3, 6, 3.01, 6],
    [3, 12, 3.01, 12],
    [3, 18, 3.01, 18]
  ]),
  code: createIcon([
    'M16 18l6-6-6-6',
    'M8 6l-6 6 6 6'
  ])
} as const;

export type IconType = keyof typeof icons;
export const Icons = icons;
