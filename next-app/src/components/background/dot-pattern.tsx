"use client";

import { useId } from "react";

interface DotPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  cr?: number;
  className?: string;
  [key: string]: any;
}

export function DotPattern({
  width = 40,
  height = 40,
  x = 0,
  y = 0,
  cx = 2,
  cy = 2,
  cr = 2,
  className,
  ...props
}: DotPatternProps) {
  const id = useId();

  return (
    <svg
      aria-hidden='true'
      className={`pointer-events-none absolute inset-0 h-full w-full fill-gray-200/80 ${className}`}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits='userSpaceOnUse'
          patternContentUnits='userSpaceOnUse'
          x={x}
          y={y}
        >
          <circle id='pattern-circle' cx={cx} cy={cy} r={cr} />
        </pattern>
      </defs>
      <rect width='100%' height='100%' strokeWidth={0} fill={`url(#${id})`} />
    </svg>
  );
}
