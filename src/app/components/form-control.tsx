import { PropsWithChildren } from "react";

export interface FormControlProps extends PropsWithChildren {}

export default function FormControl({ children }: FormControlProps) {
  return <div className="flex flex-col gap-y-1 justify-end">{children}</div>;
}
