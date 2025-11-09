#!/usr/bin/env python3
"""
Generate sprite atlas JSON files from PNG sprite sheets
"""

def generate_atlas_json(png_width, png_height, tile_size, atlas_name):
    """Generate atlas JSON with regular grid"""
    frames = {}
    frame_index = 0

    cols = png_width // tile_size
    rows = png_height // tile_size

    for row in range(rows):
        for col in range(cols):
            frame_name = f"{atlas_name}_{frame_index}"
            x = col * tile_size
            y = row * tile_size

            frames[frame_name] = {
                "frame": {
                    "x": x,
                    "y": y,
                    "w": tile_size,
                    "h": tile_size
                },
                "sourceSize": {
                    "w": tile_size,
                    "h": tile_size
                },
                "spriteSourceSize": {
                    "x": 0,
                    "y": 0,
                    "w": tile_size,
                    "h": tile_size
                }
            }
            frame_index += 1

    return {
        "frames": frames,
        "meta": {
            "image": f"{atlas_name}.png",
            "size": {"w": png_width, "h": png_height},
            "scale": "1"
        }
    }

import json

# fish_characters.png: 508 x 134 pixels
# Using 64x64 tiles: 7 cols x 2 rows = 14 sprites
TILE_SIZE = 64
fish_atlas = generate_atlas_json(508, 134, TILE_SIZE, "fish")

# terrain_flora.png: 464 x 224 pixels
# Using 64x64 tiles: 7 cols x 3 rows = 21 sprites
terrain_atlas = generate_atlas_json(464, 224, TILE_SIZE, "terrain")

# Save fish_characters.json
with open('fish_characters.json', 'w') as f:
    json.dump(fish_atlas, f, indent=2)
print(f"Generated fish_characters.json with {len(fish_atlas['frames'])} frames (64x64 grid)")

# Save terrain_flora.json
with open('terrain_flora.json', 'w') as f:
    json.dump(terrain_atlas, f, indent=2)
print(f"Generated terrain_flora.json with {len(terrain_atlas['frames'])} frames (64x64 grid)")

print("\nFrame naming scheme:")
print(f"Fish frames: fish_0 through fish_{len(fish_atlas['frames'])-1}")
print(f"Terrain frames: terrain_0 through terrain_{len(terrain_atlas['frames'])-1}")
