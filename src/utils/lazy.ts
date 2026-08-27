import React from "react";

export function lazyImport<
  T extends React.ComponentType<unknown>,
  I extends { [K2 in K]: T },
  K extends keyof I,
>(
  factory: () => Promise<I>,
  name: K,
): I {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return Object.create({
    [name]: React.lazy(() => factory().then(module => ({ default:  module[name] }))),
  });
}
