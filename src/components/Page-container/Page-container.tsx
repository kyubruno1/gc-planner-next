import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  layoutType?: 'light' | 'dark';
  onClick?: () => void;
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className='gap-5 p-5 grid grid-cols-[1fr_1200px_1fr]'>
      {children}
    </div>

  );
}
