import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

interface PillButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  textClassName?: string;
}

export function PillButton({
  label,
  variant = 'secondary',
  className = '',
  textClassName = '',
  ...props
}: PillButtonProps) {
  let bgClass = 'bg-grayBorder';
  let labelClass = 'text-textPrimary';

  if (variant === 'primary') {
    bgClass = 'bg-teal';
    labelClass = 'text-white';
  } else if (variant === 'ghost') {
    bgClass = 'bg-transparent border border-grayBorder';
    labelClass = 'text-textMuted';
  } else {
    // secondary
    bgClass = 'bg-[#2C2C2E]';
    labelClass = 'text-white';
  }

  return (
    <TouchableOpacity
      className={`rounded-pill px-6 py-3 flex-row items-center justify-center ${bgClass} ${className}`}
      activeOpacity={0.8}
      {...props}
    >
      <Text className={`font-medium text-[15px] ${labelClass} ${textClassName}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
