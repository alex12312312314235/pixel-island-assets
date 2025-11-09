/**
 * Frame name mapping - maps old semantic names to new grid-based names
 *
 * Since the sprite sheets were regenerated with a 64x64 grid,
 * we map the old frame names to the new grid positions.
 *
 * Grid layout (64x64 tiles):
 * fish_characters.png: 7 cols × 2 rows = fish_0 to fish_13
 * terrain_flora.png: 7 cols × 3 rows = terrain_0 to terrain_20
 */

export const FRAME_MAP = {
  // Fish atlas mappings (you'll need to adjust these based on actual sprite positions)
  'char_child': 'fish_0',
  'char_adult': 'fish_1',
  'fish_blue': 'fish_2',
  'fish_yellow': 'fish_3',
  'fish_orange': 'fish_4',
  'fish_red': 'fish_5',
  'fish_green': 'fish_6',
  'fish_purple': 'fish_7',
  'fish_gray': 'fish_8',
  'fish_spotted': 'fish_9',
  'angelfish': 'fish_10',
  'fish_shark_small': 'fish_11',
  'octopus_orange': 'fish_12',
  'crab_blue': 'fish_13',
  'seahorse_yellow': 'fish_13',  // Fallback
  'seahorse_green': 'fish_12',   // Fallback

  // Terrain atlas mappings
  'palm_big': 'terrain_0',
  'palm_small': 'terrain_1',
  'bush_large': 'terrain_2',
  'bush_medium': 'terrain_3',
  'bush_small': 'terrain_4',
  'rock_cluster': 'terrain_5',
  'rock_small_1': 'terrain_6',
  'rock_small_2': 'terrain_7',
  'wave_shallow': 'terrain_8',
  'wave_deep': 'terrain_9',
  'sand_irregular': 'terrain_10',
  'sand_rect': 'terrain_11',
  'log_large': 'terrain_12',
  'branch_1': 'terrain_13',
  'branch_2': 'terrain_14',
  'branch_3': 'terrain_15',
};

/**
 * Map an old frame name to new grid-based name
 * If no mapping exists, return the original name (for backward compatibility)
 */
export function mapFrameName(frameName) {
  return FRAME_MAP[frameName] || frameName;
}
