"use client";

import dynamic from 'next/dynamic';
import { ComponentType, ReactNode } from 'react';

interface NoSSRProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const NoSSRWrapper = ({ children }: NoSSRProps) => {
  return <>{children}</>;
};

export const NoSSR = dynamic(() => Promise.resolve(NoSSRWrapper), {
  ssr: false,
  loading: () => null
});

// HOC for wrapping components to disable SSR
export function withNoSSR<T extends object>(
  Component: ComponentType<T>,
  fallback?: ReactNode
) {
  const NoSSRComponent = (props: T) => (
    <NoSSR fallback={fallback}>
      <Component {...props} />
    </NoSSR>
  );
  
  NoSSRComponent.displayName = `withNoSSR(${Component.displayName || Component.name})`;
  
  return NoSSRComponent;
} 