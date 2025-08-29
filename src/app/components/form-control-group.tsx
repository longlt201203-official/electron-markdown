import { PropsWithChildren } from "react";

export interface FormControlGroupProps extends PropsWithChildren {}

export default function FormControlGroup({ children }: FormControlGroupProps) {
  return <div className="flex flex-row gap-x-1">{children}</div>;
}
