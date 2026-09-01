import React from 'react';

export const Skeleton = ({ className = "h-4 w-full", rounded = "rounded-lg" }) => {
  return (
    <div className={`bg-slate-800/80 animate-pulse ${rounded} ${className} relative overflow-hidden`}>
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite]" />
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="glass-panel p-6 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
};
