import { ReactNode } from "react";

export interface BaseModalProps {
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
  maxHeight?: string;
  title?: string;
  titleColor?: string;
}