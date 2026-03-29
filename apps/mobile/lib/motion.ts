import { Easing, FadeIn, FadeInDown, FadeOut, FadeOutDown } from 'react-native-reanimated';

export const MOTION = {
  duration: {
    instant: 110,
    quick: 160,
    standard: 220,
    screen: 280,
  },
  easeOut: Easing.bezier(0.23, 1, 0.32, 1),
  easeInOut: Easing.bezier(0.77, 0, 0.175, 1),
  spring: {
    damping: 18,
    stiffness: 220,
    mass: 0.85,
  },
};

export const PRESS_FEEDBACK = {
  scale: 0.97,
  opacity: 0.92,
};

export const stagger = (
  index: number,
  start = 0,
  step = 55,
  maxDelay = 420,
) => Math.min(start + index * step, maxDelay);

export const enterFade = (delay = 0, duration = MOTION.duration.quick) =>
  FadeIn.duration(duration).delay(delay).easing(MOTION.easeOut);

export const enterRise = (delay = 0) =>
  FadeInDown.springify()
    .damping(MOTION.spring.damping)
    .stiffness(MOTION.spring.stiffness)
    .mass(MOTION.spring.mass)
    .delay(delay);

export const exitFade = (duration = MOTION.duration.quick) =>
  FadeOut.duration(duration).easing(MOTION.easeOut);

export const exitDrop = (duration = MOTION.duration.standard) =>
  FadeOutDown.duration(duration).easing(MOTION.easeOut);
