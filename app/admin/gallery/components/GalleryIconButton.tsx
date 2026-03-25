"use client";
import type { ReactNode } from "react";

type Props = {
  onClick?: () => void;
  disabled?: boolean;
  title: string;
  className?: string;
  children: ReactNode;
};

export default function GalleryIconButton({ onClick, disabled, title, className, children }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      aria-label={title}
      title={title}
      type="button"
    >
      {children}
    </button>
  );
}
