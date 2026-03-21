import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

interface PillButtonProps extends TouchableOpacityProps {
  label?: string;
  title?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'default' | 'small' | 'large';
  className?: string;
  textClassName?: string;
}

export function PillButton({
  label,
  title,
  variant = 'secondary',
  size = 'default',
  className = '',
  textClassName = '',
  ...props
}: PillButtonProps) {
  const buttonLabel = label ?? title ?? '';
  let bgClass = 'bg-grayBorder';
  let labelClass = 'text-textPrimary';
  let paddingClass = 'px-6 py-3';
  let textSizeClass = 'text-[15px]';

  if (size === 'small') {
    paddingClass = 'px-4 py-2';
    textSizeClass = 'text-[13px]';
  } else if (size === 'large') {
    paddingClass = 'px-8 py-4';
    textSizeClass = 'text-[17px]';
  }

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
      className={`rounded-pill flex-row items-center justify-center ${paddingClass} ${bgClass} ${className}`}
      activeOpacity={0.8}
      {...props}
    >
      <Text className={`font-medium ${textSizeClass} ${labelClass} ${textClassName}`}>
        {buttonLabel}
      </Text>
    </TouchableOpacity>
  );
}
