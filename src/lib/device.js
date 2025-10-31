export const isMobile = () => {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  return (/android|iphone|ipad|ipod/i.test(ua) && touch);
};
