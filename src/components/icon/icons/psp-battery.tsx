import * as React from "react";

export const PspBattery = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 26.307 13.28"
      fill="currentColor"
      {...props}
      className={`${props?.className}`}>
      <path
        id="battery"
        d="M3.213 0v3.345H0v6.59h3.213v3.345h23.094L26.284 0Zm1.323 1.323h20.448v10.634H4.536Zm1.168 1.255v8.125h4.962V2.578Zm6.575 0v8.125h4.962V2.578Zm6.575 0v8.125h4.962V2.578Z"
      />
    </svg>
  );
};

export { PspBattery as default };
