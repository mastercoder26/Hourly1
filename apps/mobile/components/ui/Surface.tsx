import { View, ViewProps } from 'react-native';

interface SurfaceProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function Surface({ children, className = '', ...props }: SurfaceProps) {
  return (
    <View
      className={`bg-white dark:bg-[#1C1C1E] border-[0.5px] border-grayBorder rounded-card ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
