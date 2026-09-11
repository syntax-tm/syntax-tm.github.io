import React from "react";

export type CSSVariable = `--${string}`;
export type CSSVariables = Record<CSSVariable, string | number>;

export type StyleProps = React.CSSProperties & CSSVariables;
