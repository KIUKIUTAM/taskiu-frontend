import React from 'react';

// 1. Define Interface
// Inherit React native Button props (so onClick, type, disabled work)
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Custom props: limit developers to specific styles, prevent arbitrary CSS
  variant?: 'primary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  isLoading = false,
  className = '', // Allow external class injection (e.g., margin)
  ...props // Pass remaining props (onClick, type, etc.) to underlying button
}: ButtonProps) => {
  // 2. Encapsulate style logic (Implementation Details)
  const baseStyles =
    'px-6 py-2 font-bold rounded-lg transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    // This is your original style (named primary or outline, as defined)
    primary:
      'bg-white border-2 border-blue-950 text-blue-950 hover:bg-blue-950 hover:text-white hover:border-blue-950',

    // Assuming another filled button style in the future
    filled: 'bg-blue-950 text-white border-2 border-transparent hover:bg-blue-900',

    // Ghost button (borderless)
    ghost: 'bg-transparent text-blue-950 hover:bg-gray-100',
  };

  // Combine final Class
  // Using simple string concatenation here; enterprise projects usually use 'clsx' or 'tailwind-merge'
  const finalClass = `${baseStyles} ${variants[variant === 'outline' ? 'primary' : variant]} ${className}`;

  return (
    <button className={finalClass} disabled={isLoading || props.disabled} {...props}>
      {/* 3. Handle Loading state (Bonus) */}
      {isLoading ? (
        <span className="mr-2">...</span> // Spinner Icon can be placed here
      ) : null}
      {children}
    </button>
  );
};
