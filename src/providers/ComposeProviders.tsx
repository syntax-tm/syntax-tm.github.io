// import React, { ComponentType, ReactNode } from 'react';

// interface ProviderComposerProps {
//   providers: Array<[ComponentType<any>, Record<string, any>] | ComponentType<any>>;
//   children: ReactNode;
// }

// const composeProviders = (providers: ProviderComposerProps['providers']) => {
//   return ({ children }: { children: ReactNode }) =>
//     providers.reduceRight<ReactNode>((acc, Current) => {
//       if (Array.isArray(Current)) {
//         const [Provider, providerProps] = Current;
//         return <Provider {...providerProps}>{acc}</Provider>;
//       }

//       const Provider = Current;
//       return <Provider>{acc}</Provider>;
//     }, children);
// };

// // providers/appProviders.jsx
// import { SnackbarProvider } from '@context/SnackbarContext';
// import { AudioProvider } from '@context/AudioContext';

// // Create providers with their respective configs
// const createProviders = () => [
//   SnackbarProvider,
//   AudioProvider,
// ];

// // Compose them into a single provider component
// export const AppProviders = ({ children }) => {
//   const providers = createProviders(config);
//   const ComposedProviders = composeProviders(providers);
  
//   return <ComposedProviders>{children}</ComposedProviders>;
// };