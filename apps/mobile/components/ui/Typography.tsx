import { Text, TextProps } from 'react-native';

interface TypographyProps extends TextProps {
  children: React.ReactNode;
  className?: string;
}

export function TextHeader({ children, className = '', ...props }: TypographyProps) {
  return <Text className={`text-[13px] font-medium tracking-[0.5px] uppercase text-textMuted ${className}`} {...props}>{children}</Text>;
}

export function TextValueHuge({ children, className = '', ...props }: TypographyProps) {
  return <Text className={`text-[48px] font-normal tracking-[-1px] text-textPrimary leading-tight ${className}`} {...props}>{children}</Text>;
}

export function TextValueLarge({ children, className = '', ...props }: TypographyProps) {
  return <Text className={`text-[32px] font-medium tracking-[-0.5px] text-textPrimary ${className}`} {...props}>{children}</Text>;
}

export function TextRegular({ children, className = '', ...props }: TypographyProps) {
  return <Text className={`text-[15px] font-medium text-textPrimary ${className}`} {...props}>{children}</Text>;
}

export function TextSub({ children, className = '', ...props }: TypographyProps) {
  return <Text className={`text-[13px] font-normal uppercase tracking-[0.2px] text-textMuted ${className}`} {...props}>{children}</Text>;
}

export function TextCaption({ children, className = '', ...props }: TypographyProps) {
  return <Text className={`text-[12px] font-normal text-textMuted leading-relaxed ${className}`} {...props}>{children}</Text>;
}
