import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  layoutType?: 'light' | 'dark';
  onClick?: () => void;
}

export function PageContainer({ children, layoutType = 'light', onClick }: PageContainerProps) {
  const baseClasses = "gap-5 p-5 max-w-[1400px] mx-auto rounded-[10px] border-4 shadow-darkblue";

  const lightClasses = "bg-bgpagelight border-primary";
  const darkClasses = "bg-bgdarkblue border-primary";

  const classes = `${baseClasses} ${layoutType === 'dark' ? darkClasses : lightClasses}`;

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
}
