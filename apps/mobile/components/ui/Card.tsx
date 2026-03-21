import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  metric?: boolean;
}

export function Card({ children, className = '', metric = false, ...props }: CardProps) {
  return (
    <View
      className={`bg-white dark:bg-[#1C1C1E] border-[0.5px] border-grayBorder rounded-card ${
        metric ? 'p-7 flex-col gap-3' : 'p-8 flex-col'
      } ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
