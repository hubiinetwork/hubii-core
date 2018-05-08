import { ReactNode } from "react";

export interface IPropTypes {
  dPath?: string;
  children?: ReactNode;
  viewBox?: string;
  color?: string;
  hoverColor?: string;
  size?: number;
  style?: {};
}
