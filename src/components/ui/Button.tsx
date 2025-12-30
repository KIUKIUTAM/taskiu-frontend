import React from 'react';

// 1. 定義介面 (Interface)
// 繼承 React 原生的 Button 屬性 (這樣 onClick, type, disabled 都能用)
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // 自定義屬性：限制開發者只能選這幾種樣式，不能隨便寫 CSS
  variant?: 'primary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  isLoading = false,
  className = '', // 允許外部傳入額外的 class (如 margin)
  ...props // 把剩下的 onClick, type 等等傳給底層 button
}: ButtonProps) => {
  // 2. 封裝樣式邏輯 (Implementation Details)
  const baseStyles =
    'px-6 py-2 font-bold rounded-lg transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    // 這是你原本的樣式 (我把它命名為 primary 或 outline，看你定義)
    primary:
      'bg-white border-2 border-blue-950 text-blue-950 hover:bg-blue-950 hover:text-white hover:border-blue-950',

    // 假設以後有另一種實心按鈕
    filled: 'bg-blue-950 text-white border-2 border-transparent hover:bg-blue-900',

    // 幽靈按鈕 (無邊框)
    ghost: 'bg-transparent text-blue-950 hover:bg-gray-100',
  };

  // 組合最終的 Class
  // 這裡用了簡單的字串串接，企業級專案通常會用 'clsx' 或 'tailwind-merge' 套件
  const finalClass = `${baseStyles} ${variants[variant === 'outline' ? 'primary' : variant]} ${className}`;

  return (
    <button className={finalClass} disabled={isLoading || props.disabled} {...props}>
      {/* 3. 處理 Loading 狀態 (額外加分題) */}
      {isLoading ? (
        <span className="mr-2">...</span> // 這裡可以放 Spinner Icon
      ) : null}
      {children}
    </button>
  );
};
