import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  layoutType?: 'light' | 'dark';
  onClick?: () => void;
}

export function PageContainer({ children, layoutType = 'light', onClick }: PageContainerProps) {
  // const baseClasses = "gap-5 p-5 max-w-[1400px] mx-auto rounded-[10px] border-4 shadow-darkblue";
  // // const baseClasses = "gap-5 p-5 max-w-[1400px] mx-auto rounded-[10px] border-4 shadow-darkblue grid grid-cols[auto-1400px-auto]";

  // const lightClasses = "bg-bgpagelight border-primary";
  // const darkClasses = "bg-bgdarkblue border-primary";

  // const classes = `${baseClasses} ${layoutType === 'dark' ? darkClasses : lightClasses}`;

  return (
    <div className='gap-5 p-5 grid grid-cols-[auto_1400px_auto]'>
      {/* <div className={classes} onClick={onClick}> */}
      {children}
      {/* </div> */}
    </div>

  );
}
