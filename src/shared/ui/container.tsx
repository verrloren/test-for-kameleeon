import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
}

export function Container({ children }: ContainerProps) {
	return (	
		<div className="mx-4 sm:mx-6 md:mx-12 lg:mx-20 xl:mx-32 2xl:mx-48 relative">{children}</div>
	)
}
