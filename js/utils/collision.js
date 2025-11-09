/**
 * Collision detection utilities
 */

/**
 * Check if two rectangles overlap
 */
export function rectOverlap(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y;
}

/**
 * Check if a point is inside a rectangle
 */
export function pointInRect(x, y, rect) {
  return x >= rect.x &&
         x <= rect.x + rect.width &&
         y >= rect.y &&
         y <= rect.y + rect.height;
}

/**
 * Check if two circles overlap
 */
export function circleOverlap(c1, c2) {
  const dx = c1.x - c2.x;
  const dy = c1.y - c2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < c1.radius + c2.radius;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Check distance between two points
 */
export function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Get a random integer between min (inclusive) and max (inclusive)
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get a random element from an array
 */
export function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}
