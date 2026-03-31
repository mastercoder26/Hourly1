import { Easing, FadeIn, FadeInDown, FadeOut, FadeOutDown, FadeInUp, SlideInRight, SlideOutLeft } from 'react-native-reanimated';

// Timing constants
export const MOTION = {
  duration: {
    instant: 100,
    quick: 150,
    standard: 200,
    emphasized: 300,
    screen: 350,
    reveal: 500,
  },
  // Bezier curves
  easeOut: Easing.bezier(0.23, 1, 0.32, 1),        // Decelerate
  easeIn: Easing.bezier(0.55, 0, 1, 0.45),         // Accelerate
  easeInOut: Easing.bezier(0.77, 0, 0.175, 1),    // Smooth both ends
  bounce: Easing.bezier(0.34, 1.56, 0.64, 1),     // Overshoot
  // Spring config for natural motion
  spring: {
    damping: 18,
    stiffness: 200,
    mass: 0.9,
  },
  springSnappy: {
    damping: 22,
    stiffness: 280,
    mass: 0.8,
  },
  springGentle: {
    damping: 16,
    stiffness: 150,
    mass: 1.0,
  },
};

// Press feedback config
export const PRESS_FEEDBACK = {
  scale: 0.97,
  opacity: 0.85,
  brightness: 1.1,  // For hover states
};

// Stagger delay calculator
export const stagger = (
  index: number,
  start = 0,
  step = 50,
  maxDelay = 400,
) => Math.min(start + index * step, maxDelay);

// Entrance animations
export const enterFade = (delay = 0, duration = MOTION.duration.quick) =>
  FadeIn.duration(duration).delay(delay).easing(MOTION.easeOut);

export const enterRise = (delay = 0) =>
  FadeInDown.springify()
    .damping(MOTION.spring.damping)
    .stiffness(MOTION.spring.stiffness)
    .mass(MOTION.spring.mass)
    .delay(delay);

export const enterRiseSnappy = (delay = 0) =>
  FadeInDown.springify()
    .damping(MOTION.springSnappy.damping)
    .stiffness(MOTION.springSnappy.stiffness)
    .mass(MOTION.springSnappy.mass)
    .delay(delay);

export const enterDrop = (delay = 0) =>
  FadeInUp.springify()
    .damping(MOTION.spring.damping)
    .stiffness(MOTION.spring.stiffness)
    .mass(MOTION.spring.mass)
    .delay(delay);

export const enterSlide = (delay = 0) =>
  SlideInRight.duration(MOTION.duration.emphasized).delay(delay).easing(MOTION.easeOut);

// Exit animations
export const exitFade = (duration = MOTION.duration.quick) =>
  FadeOut.duration(duration).easing(MOTION.easeIn);

export const exitDrop = (duration = MOTION.duration.standard) =>
  FadeOutDown.duration(duration).easing(MOTION.easeIn);

export const exitSlide = (duration = MOTION.duration.standard) =>
  SlideOutLeft.duration(duration).easing(MOTION.easeIn);

// Utility: Create staggered entrance for list items
export const createStaggeredEntrance = (baseDelay = 0, staggerStep = 45) => {
  return (index: number) => enterRise(stagger(index, baseDelay, staggerStep));
};

// Utility: Timing config for animated values
export const timingConfig = (duration = MOTION.duration.standard) => ({
  duration,
  easing: MOTION.easeOut,
});

export const springConfig = () => ({
  damping: MOTION.spring.damping,
  stiffness: MOTION.spring.stiffness,
  mass: MOTION.spring.mass,
});
