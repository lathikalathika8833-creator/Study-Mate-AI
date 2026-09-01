import React from 'react';

export const Card = ({
  children,
  className = '',
  glow = false,
  hover = true,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        ${glow ? 'glass-panel-glow' : 'glass-panel'}
        ${hover ? 'hover:border-brand-500/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        rounded-2xl p-5 sm:p-6
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
