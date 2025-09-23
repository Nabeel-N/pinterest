"use client";

import React from "react";

// Button that forwards standard button attributes and works inside forms.
// Use `type="submit"` when you want the button to submit a form.

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export default function Button({
  children,
  type = "button",
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={className} {...rest}>
      {children}
    </button>
  );
}
