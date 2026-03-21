import { Text, TextProps } from 'react-native';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  children: React.ReactNode;
  className?: string;
}

export function Typography({ variant = 'body', children, className = '', ...props }: TypographyProps) {
  const variantClass: Record<string, string> = {
    h1: 'text-[32px] font-medium tracking-[-0.5px] text-textPrimary',
    h2: 'text-[24px] font-medium tracking-[-0.3px] text-textPrimary',
    h3: 'text-[18px] font-medium text-textPrimary',
    body: 'text-[15px] font-medium text-textPrimary',
    caption: 'text-[12px] font-normal text-textMuted leading-relaxed',
    label: 'text-[13px] font-normal uppercase tracking-[0.2px] text-textMuted',
  };

  return (
    <Text className={`${variantClass[variant] ?? variantClass.body} ${className}`} {...props}>
      {children}
    </Text>
  );
}
