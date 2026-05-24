// Merge this into your tailwind.config.ts theme.extend

const animations = {
  keyframes: {
    "fade-down": {
      "0%":   { opacity: "0", transform: "translateY(-12px)" },
      "100%": { opacity: "1", transform: "translateY(0)" },
    },
    "fade-right": {
      "0%":   { opacity: "0", transform: "translateX(-20px)" },
      "100%": { opacity: "1", transform: "translateX(0)" },
    },
    "fade-left": {
      "0%":   { opacity: "0", transform: "translateX(20px)" },
      "100%": { opacity: "1", transform: "translateX(0)" },
    },
    "fade-up": {
      "0%":   { opacity: "0", transform: "translateY(16px)" },
      "100%": { opacity: "1", transform: "translateY(0)" },
    },
  },
  animation: {
    "fade-down":  "fade-down  0.5s cubic-bezier(0.16,1,0.3,1) both",
    "fade-right": "fade-right 0.6s cubic-bezier(0.16,1,0.3,1) both",
    "fade-left":  "fade-left  0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both",
    "fade-up":    "fade-up    0.5s cubic-bezier(0.16,1,0.3,1) both",
  },
};

export default animations;
