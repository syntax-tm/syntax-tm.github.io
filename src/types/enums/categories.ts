type CategoryNames = 'Home' | 'Dev' | 'Gaming' | 'Social' | 'Settings' | 'Music' | 'Secret' | 'Unknown' | 'Misc';
type CategoryPages = '1' | '2' | '3' | '4' | '5';
export type Category = CategoryNames | `${CategoryNames}${CategoryPages}`;
