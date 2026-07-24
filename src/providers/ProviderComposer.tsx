import React, { Component } from "react";

type ProviderEntry = React.ElementType;

export const ProviderComposer = ({
  providers,
  children,
}: {
  providers: ProviderEntry[];
  children: React.ReactNode;
}) => {
  return providers.reduceRight<React.ReactNode>((nestedChildren, ProviderItem) => {
    // standard component fallback
    return <ProviderItem>{nestedChildren}</ProviderItem>;
  }, children);
};