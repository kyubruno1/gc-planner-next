import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  layoutType?: 'light' | 'dark';
  onClick?: () => void;
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    // <div className="grid grid-cols-1 sm:grid-cols-[1fr_1200px_1fr] gap-5 p-5">
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1400px)_1fr] gap-5 p-5">
      {children}
    </div>

  );
}
