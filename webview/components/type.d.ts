export interface IButtonProps {
  children: string | ReactNode;
  buttonType?: "button" | "submit" | "reset" | undefined;
  buttonStatus?: string;
  primary: boolean;
  handleButtonClick?: () => void;
}

export interface IButtonStyledProps {
  primary: boolean;
  type?: string;
}

export interface ICopyIconProps {
  handleClick: (value: string | undefined) => void;
  value: string | undefined;
}

export interface IDetailOptionProps {
  children: ReactNode;
  requestMenu?: boolean;
}

export interface ICommonChildProps {
  children: ReactNode;
}

export interface IMenuOptionProps {
  children: ReactElement;
  currentOption: string | null;
  menuOption: string;
}

export interface IMessageProps {
  children: ReactNode;
  primary?: boolean;
}

export interface IMessageStyledProps {
  primary?: boolean;
}

export interface ISelectWrapperProps {
  children: ReactNode;
  requestMenu?: boolean;
  primary?: boolean;
  secondary?: boolean;
}

export interface ISelectWrapperStyledProps {
  primary?: boolean;
  secondary?: boolean;
  border?: boolean;
}