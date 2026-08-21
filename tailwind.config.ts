import type { Config } from "tailwindcss";
import tailwindScrollbar from 'tailwind-scrollbar';

console.log('Importing tailwind.config.ts');

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      cursor: {
        'wii-auto': 'url(/cursors/wii/default.png), auto',
        'wii-default': 'url(/cursors/wii/default.png), default',
        'wii-pointer': 'url(/cursors/wii/link_select.png), pointer',
        'wii-wait': 'url(/cursors/wii/busy.png), wait',
        'wii-text': 'url(/cursors/wii/text_select.png), text',
        'wii-move': 'url(/cursors/wii/move.png), move',
        'wii-help': 'url(/cursors/wii/help_select.png), help',
        'wii-not-allowed': 'url(/cursors/wii/unavailable.png), not-allowed',
        'wii-none': 'none',
        'wii-context-menu': 'url(/cursors/wii/working_in_background.png), context-menu',
        'wii-progress': 'url(/cursors/wii/busy.png),  progress',
        'wii-cell': 'cell',
        'wii-crosshair': 'url(/cursors/wii/precision_select.png), crosshair',
        'wii-vertical-text': 'url(/cursors/wii/text_select.png), vertical-text',
        'wii-alias': 'alias',
        'wii-copy': 'copy',
        'wii-no-drop': 'url(/cursors/wii/unavailable.png), no-drop',
        'wii-grab': 'url(/cursors/wii/wii_cursor_grab.png), grab',
        'wii-grabbing': 'url(/cursors/wii/wii_cursor_grab.png), grabbing',
        'wii-all-scroll': 'url(/cursors/wii/move.png), all-scroll',
        'wii-col-resize': 'url(/cursors/wii/horizontal_resize.png), col-resize',
        'wii-row-resize': 'url(/cursors/wii/vertical_resize.png), row-resize',
        'wii-n-resize': 'url(/cursors/wii/vertical_resize.png), n-resize',
        'wii-e-resize': 'url(/cursors/wii/horizontal_resize.png), e-resize',
        'wii-s-resize': 'url(/cursors/wii/vertical_resize.png), s-resize',
        'wii-w-resize': 'url(/cursors/wii/horizontal_resize.png), w-resize',
        'wii-ne-resize': 'url(/cursors/wii/diagonal_resize_2.png), ne-resize',
        'wii-nw-resize': 'url(/cursors/wii/diagonal_resize_1.png), nw-resize',
        'wii-se-resize': 'url(/cursors/wii/diagonal_resize_1.png), se-resize',
        'wii-sw-resize': 'url(/cursors/wii/diagonal_resize_2.png), sw-resize',
        'wii-ew-resize': 'url(/cursors/wii/horizontal_resize.png), ew-resize',
        'wii-ns-resize': 'url(/cursors/wii/vertical_resize.png), ns-resize',
        'wii-nesw-resize': 'url(/cursors/wii/move.png), nesw-resize',
        'wii-nwse-resize': 'url(/cursors/wii/move.png), nwse-resize',
        'wii-zoom-in': 'url(/cursors/wii/zoom_in.png), zoom-in',
        'wii-zoom-out': 'url(/cursors/wii/zoom_out.png), zoom-out',
      }
    },
  },
  plugins: [
    tailwindScrollbar,
  ],
};
export default config;
