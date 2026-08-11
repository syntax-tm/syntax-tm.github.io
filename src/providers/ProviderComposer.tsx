import React from "react";

type ProviderEntry = React.ElementType;

export const ProviderComposer = ({
  providers,
  children,
}: {
  providers: React.ReactNode[];
  children: React.ReactNode;
}) => {
  return providers.reduceRight<React.ReactNode>((nestedChildren, ProviderItem) => {
    // standard component fallback
    return <>
      {ProviderItem}
    </>;
  }, children);
};