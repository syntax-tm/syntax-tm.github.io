declare module '*.css';

declare module '*.svg' {
  import { FC, SVGProps } from 'react'
  const content: FC<SVGProps<SVGElement>>
  export default content
}

declare module '*.svg?url' {
  const content: any
  export default content
}

declare module '*.mp3' {
  const content: string;
  export default content;
}

declare module '*.glsl' {
  const content: string;
  export default content;
}

declare module '*.hlsl' {
  const content: string;
  export default content;
}

declare module '*.vert' {
  const content: string;
  export default content;
}

declare global {
  interface string {
    equalsIgnoreCase(other: string): boolean;
  }
}

string.prototype.equalsIgnoreCase = function (this: string, other: string | undefined | null): boolean {
  if (!other) return false;
  return this.toLowerCase() === other.toLowerCase();
};
