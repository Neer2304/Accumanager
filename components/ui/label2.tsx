import React from 'react';
import { cn } from '../../lib/util';

interface Label2Props extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Label2 = React.forwardRef<HTMLLabelElement, Label2Props>(
  ({ className, children, required = false, size = 'md', ...props }, ref) => {
    const sizes = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };
    
    return (
      <label
        ref={ref}
        className={cn(
          "block font-medium text-gray-700 mb-1",
          sizes[size],
          required && "after:content-['*'] after:ml-1 after:text-red-500",
          className
        )}
        {...props}
      >
        {children}
      </label>
    );
  }
);

Label2.displayName = 'Label2';