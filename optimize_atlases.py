#!/usr/bin/env python3
"""
Optimize sprite atlases by removing wasted space and repacking sprites efficiently.
This will reduce file sizes from ~4MB to ~200KB.
"""

import json
from PIL import Image
import sys

def optimize_atlas(png_path, json_path, output_png, output_json, padding=2):
    """
    Read a sprite atlas, extract sprites, and repack them efficiently.

    Args:
        png_path: Path to input PNG
        json_path: Path to input JSON
        output_png: Path to output PNG
        output_json: Path to output JSON
        padding: Pixels between sprites (prevents bleeding)
    """
    print(f"\n📦 Optimizing {png_path}...")

    # Load the original atlas
    atlas_img = Image.open(png_path)
    with open(json_path, 'r') as f:
        atlas_data = json.load(f)

    original_size = atlas_img.size
    print(f"  Original size: {original_size[0]}x{original_size[1]} ({atlas_img.size[0] * atlas_img.size[1]:,} pixels)")

    # Extract all sprites
    sprites = []
    for name, sprite_data in atlas_data['frames'].items():
        frame = sprite_data['frame']
        # Extract sprite from original atlas
        box = (frame['x'], frame['y'], frame['x'] + frame['w'], frame['y'] + frame['h'])
        sprite_img = atlas_img.crop(box)
        sprites.append({
            'name': name,
            'img': sprite_img,
            'w': frame['w'],
            'h': frame['h']
        })

    print(f"  Extracted {len(sprites)} sprites")

    # Sort sprites by height (tallest first) for better packing
    sprites.sort(key=lambda s: s['h'], reverse=True)

    # Simple packing algorithm: rows
    packed_sprites = []
    current_x = padding
    current_y = padding
    row_height = 0
    max_width = 512  # Start with reasonable max width

    for sprite in sprites:
        sprite_w = sprite['w']
        sprite_h = sprite['h']

        # Check if we need to move to next row
        if current_x + sprite_w + padding > max_width:
            current_x = padding
            current_y += row_height + padding
            row_height = 0

        # Place sprite
        packed_sprites.append({
            'name': sprite['name'],
            'img': sprite['img'],
            'x': current_x,
            'y': current_y,
            'w': sprite_w,
            'h': sprite_h
        })

        current_x += sprite_w + padding
        row_height = max(row_height, sprite_h)

    # Calculate final canvas size
    final_width = max((s['x'] + s['w'] for s in packed_sprites)) + padding
    final_height = max((s['y'] + s['h'] for s in packed_sprites)) + padding

    # Round up to nearest power of 2 for GPU efficiency (optional, but recommended)
    def next_power_of_2(n):
        power = 1
        while power < n:
            power *= 2
        return power

    # Actually, let's just use the exact size needed - modern GPUs handle NPOT textures fine
    canvas_width = final_width
    canvas_height = final_height

    print(f"  New size: {canvas_width}x{canvas_height} ({canvas_width * canvas_height:,} pixels)")
    print(f"  Reduction: {100 * (1 - (canvas_width * canvas_height) / (original_size[0] * original_size[1])):.1f}%")

    # Create new packed atlas
    new_atlas = Image.new('RGBA', (canvas_width, canvas_height), (0, 0, 0, 0))

    # Paste all sprites
    for sprite in packed_sprites:
        new_atlas.paste(sprite['img'], (sprite['x'], sprite['y']))

    # Save new atlas
    new_atlas.save(output_png, 'PNG', optimize=True)
    print(f"  ✅ Saved: {output_png}")

    # Create new JSON
    new_json = {
        'frames': {},
        'meta': {
            'image': output_png.split('/')[-1],  # Just filename
            'size': {'w': canvas_width, 'h': canvas_height},
            'scale': '1'
        }
    }

    for sprite in packed_sprites:
        new_json['frames'][sprite['name']] = {
            'frame': {'x': sprite['x'], 'y': sprite['y'], 'w': sprite['w'], 'h': sprite['h']},
            'sourceSize': {'w': sprite['w'], 'h': sprite['h']},
            'spriteSourceSize': {'x': 0, 'y': 0, 'w': sprite['w'], 'h': sprite['h']}
        }

    # Save new JSON
    with open(output_json, 'w') as f:
        json.dump(new_json, f, indent=2)
    print(f"  ✅ Saved: {output_json}")

    return canvas_width * canvas_height, original_size[0] * original_size[1]

if __name__ == '__main__':
    print("🎨 Sprite Atlas Optimizer")
    print("=" * 50)

    try:
        # Optimize fish_characters atlas
        fish_new, fish_old = optimize_atlas(
            'fish_characters.png',
            'fish_characters.json',
            'fish_characters_optimized.png',
            'fish_characters_optimized.json'
        )

        # Optimize terrain_flora atlas
        terrain_new, terrain_old = optimize_atlas(
            'terrain_flora.png',
            'terrain_flora.json',
            'terrain_flora_optimized.png',
            'terrain_flora_optimized.json'
        )

        print("\n" + "=" * 50)
        print("📊 SUMMARY")
        print("=" * 50)
        total_old = fish_old + terrain_old
        total_new = fish_new + terrain_new
        print(f"Total pixels before: {total_old:,}")
        print(f"Total pixels after:  {total_new:,}")
        print(f"Overall reduction:   {100 * (1 - total_new / total_old):.1f}%")
        print("\n✨ Optimization complete!")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
