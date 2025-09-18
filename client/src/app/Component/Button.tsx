"use client";

import { ReactNode } from "react";

type ButtonProps = {
  onclick: () => void;
  children: ReactNode;
  classname: string;
};

export default function Button({ onclick, children, classname }: ButtonProps) {
  return (
    <button className={classname} onClick={onclick}>
      {children}
    </button>
  );
}
