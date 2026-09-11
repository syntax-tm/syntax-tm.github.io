"use client";

import type { ComponentType, ReactNode } from "react";

type ProviderProps = {
  children: ReactNode;
};

type Provider = ComponentType<ProviderProps>;

type ProviderComposerProps = {
  providers: Provider[];
  children: ReactNode;
};

export function ProviderComposer({
  providers,
  children,
}: ProviderComposerProps) {
  return providers.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children,
  );
}