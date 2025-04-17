import { AnimationType } from './types';

export const getInitialValues = (type: AnimationType) => {
  switch (type) {
    case 'fade-in':
      return { opacity: 0 };
    case 'slide-up':
      return { translateY: 50 };
    case 'scale-in':
      return { scale: 0.8 };
    case 'rotate-in':
      return { rotate: 90 };
    case 'plus-to-cross':
      return { rotate: 0 };
    case 'fade-out':
      return { opacity: 1 };
    case 'slide-out':
      return { translateY: 0 };
    case 'scale-out':
      return { scale: 1 };
    case 'rotate-out':
      return { rotate: 0 };
    case 'cross-to-plus':
      return { rotate: 45 };
    default:
      return {};
  }
};

export const getFinalValues = (type: AnimationType) => {
  switch (type) {
    case 'fade-in':
      return { opacity: 1 };
    case 'slide-up':
      return { translateY: 0 };
    case 'scale-in':
      return { scale: 1 };
    case 'rotate-in':
      return { rotate: 0 };
    case 'plus-to-cross':
      return { rotate: 45 };
    case 'fade-out':
      return { opacity: 0 };
    case 'slide-out':
      return { translateY: 50 };
    case 'scale-out':
      return { scale: 0.8 };
    case 'rotate-out':
      return { rotate: -90 };
    case 'cross-to-plus':
      return { rotate: 0 };
    default:
      return {};
  }
};

export const getOppositeAnimation = (type: AnimationType): AnimationType => {
  switch (type) {
    case 'fade-in':
      return 'fade-out';
    case 'fade-out':
      return 'fade-in';
    case 'slide-up':
      return 'slide-out';
    case 'slide-out':
      return 'slide-up';
    case 'scale-in':
      return 'scale-out';
    case 'scale-out':
      return 'scale-in';
    case 'rotate-in':
      return 'rotate-out';
    case 'rotate-out':
      return 'rotate-in';
    case 'plus-to-cross':
      return 'cross-to-plus';
    case 'cross-to-plus':
      return 'plus-to-cross';
    default:
      return type;
  }
};
