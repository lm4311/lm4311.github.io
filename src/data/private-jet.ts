// Image lists for the Private Jet page. Written by scripts/private-jet-images.cjs; edit that script, not this file.
// `file` is an image in src/assets/work/private-jet/<dir>/ without its extension.

export interface ImageItem {
  file: string;
  title: string;
  note?: string;
}
export interface ImageGroup {
  dir: string;
  title: string;
  items: ImageItem[];
}

/** The 13 final stills. The lighting-only (clay) versions use the same file names in clay/. */
export const stills: ImageItem[] = [
  {
    "file": "01-galley-countertop",
    "title": "Galley countertop"
  },
  {
    "file": "02-galley",
    "title": "Galley"
  },
  {
    "file": "03-main-lounge",
    "title": "Main lounge"
  },
  {
    "file": "04-club-seat",
    "title": "Club seat"
  },
  {
    "file": "05-side-ledge",
    "title": "Side ledge"
  },
  {
    "file": "06-dining-table",
    "title": "Dining table"
  },
  {
    "file": "07-dining-area",
    "title": "Dining area"
  },
  {
    "file": "08-divan",
    "title": "Divan"
  },
  {
    "file": "09-divan-shelves",
    "title": "Divan shelves"
  },
  {
    "file": "10-bedroom",
    "title": "Bedroom"
  },
  {
    "file": "11-bedroom-detail",
    "title": "Bedroom detail"
  },
  {
    "file": "12-lavatory-vanity",
    "title": "Lavatory vanity"
  },
  {
    "file": "13-seat-stitching",
    "title": "Seat stitching"
  }
];

/** Render passes for the six hero stills. */
export const passes: ImageGroup[] = [
  {
    "dir": "passes/03-main-lounge",
    "title": "Main lounge",
    "items": [
      {
        "file": "01-final-image",
        "title": "Final image"
      },
      {
        "file": "02-lighting-only",
        "title": "Lighting only"
      },
      {
        "file": "03-detail-lighting",
        "title": "Detail lighting"
      },
      {
        "file": "04-reflections-only",
        "title": "Reflections only"
      },
      {
        "file": "05-unlit",
        "title": "Unlit"
      },
      {
        "file": "06-roughness",
        "title": "Roughness"
      },
      {
        "file": "07-specular",
        "title": "Specular"
      },
      {
        "file": "08-world-normal",
        "title": "World normal"
      },
      {
        "file": "09-scene-depth",
        "title": "Scene depth",
        "note": "Levels raised"
      }
    ]
  },
  {
    "dir": "passes/01-galley-countertop",
    "title": "Galley countertop",
    "items": [
      {
        "file": "01-final-image",
        "title": "Final image"
      },
      {
        "file": "02-lighting-only",
        "title": "Lighting only"
      },
      {
        "file": "03-detail-lighting",
        "title": "Detail lighting"
      },
      {
        "file": "04-reflections-only",
        "title": "Reflections only"
      },
      {
        "file": "05-unlit",
        "title": "Unlit"
      },
      {
        "file": "06-roughness",
        "title": "Roughness"
      },
      {
        "file": "07-specular",
        "title": "Specular"
      },
      {
        "file": "08-world-normal",
        "title": "World normal"
      },
      {
        "file": "09-scene-depth",
        "title": "Scene depth",
        "note": "Levels raised"
      }
    ]
  },
  {
    "dir": "passes/04-club-seat",
    "title": "Club seat",
    "items": [
      {
        "file": "01-final-image",
        "title": "Final image"
      },
      {
        "file": "02-lighting-only",
        "title": "Lighting only"
      },
      {
        "file": "03-detail-lighting",
        "title": "Detail lighting"
      },
      {
        "file": "04-reflections-only",
        "title": "Reflections only"
      },
      {
        "file": "05-unlit",
        "title": "Unlit"
      },
      {
        "file": "06-roughness",
        "title": "Roughness"
      },
      {
        "file": "07-specular",
        "title": "Specular"
      },
      {
        "file": "08-world-normal",
        "title": "World normal"
      },
      {
        "file": "09-scene-depth",
        "title": "Scene depth",
        "note": "Levels raised"
      }
    ]
  },
  {
    "dir": "passes/06-dining-table",
    "title": "Dining table",
    "items": [
      {
        "file": "01-final-image",
        "title": "Final image"
      },
      {
        "file": "02-lighting-only",
        "title": "Lighting only"
      },
      {
        "file": "03-detail-lighting",
        "title": "Detail lighting"
      },
      {
        "file": "04-reflections-only",
        "title": "Reflections only"
      },
      {
        "file": "05-unlit",
        "title": "Unlit"
      },
      {
        "file": "06-roughness",
        "title": "Roughness"
      },
      {
        "file": "07-specular",
        "title": "Specular"
      },
      {
        "file": "08-world-normal",
        "title": "World normal"
      },
      {
        "file": "09-scene-depth",
        "title": "Scene depth",
        "note": "Levels raised"
      }
    ]
  },
  {
    "dir": "passes/12-lavatory-vanity",
    "title": "Lavatory vanity",
    "items": [
      {
        "file": "01-final-image",
        "title": "Final image"
      },
      {
        "file": "02-lighting-only",
        "title": "Lighting only"
      },
      {
        "file": "03-detail-lighting",
        "title": "Detail lighting"
      },
      {
        "file": "04-reflections-only",
        "title": "Reflections only"
      },
      {
        "file": "05-unlit",
        "title": "Unlit"
      },
      {
        "file": "06-roughness",
        "title": "Roughness"
      },
      {
        "file": "07-specular",
        "title": "Specular"
      },
      {
        "file": "08-world-normal",
        "title": "World normal"
      },
      {
        "file": "09-scene-depth",
        "title": "Scene depth",
        "note": "Levels raised"
      }
    ]
  },
  {
    "dir": "passes/13-seat-stitching",
    "title": "Seat stitching",
    "items": [
      {
        "file": "01-final-image",
        "title": "Final image"
      },
      {
        "file": "02-lighting-only",
        "title": "Lighting only"
      },
      {
        "file": "03-detail-lighting",
        "title": "Detail lighting"
      },
      {
        "file": "04-reflections-only",
        "title": "Reflections only"
      },
      {
        "file": "05-unlit",
        "title": "Unlit"
      },
      {
        "file": "06-roughness",
        "title": "Roughness"
      },
      {
        "file": "07-specular",
        "title": "Specular"
      },
      {
        "file": "08-world-normal",
        "title": "World normal"
      },
      {
        "file": "09-scene-depth",
        "title": "Scene depth",
        "note": "Levels raised"
      }
    ]
  }
];

/** Texture maps behind the nine hero materials. */
export const textures: ImageGroup[] = [
  {
    "dir": "textures/01-galley-marble-countertop",
    "title": "Galley countertop",
    "items": [
      {
        "file": "01-diffuse-colour",
        "title": "Diffuse colour",
        "note": "4096 × 4096"
      },
      {
        "file": "02-normal",
        "title": "Normal",
        "note": "4096 × 4096"
      },
      {
        "file": "03-roughness-gloss",
        "title": "Roughness (gloss)",
        "note": "4096 × 4096"
      },
      {
        "file": "04-f0-reflectance",
        "title": "F0 (reflectance)",
        "note": "4096 × 4096"
      },
      {
        "file": "05-topcoat-thickness",
        "title": "Topcoat thickness",
        "note": "4096 × 4096"
      },
      {
        "file": "06-fingerprints-detail",
        "title": "Fingerprints detail",
        "note": "2048 × 2048, levels raised"
      }
    ]
  },
  {
    "dir": "textures/02-galley-oak-veneer-gloss",
    "title": "Galley backsplash",
    "items": [
      {
        "file": "01-diffuse-colour",
        "title": "Diffuse colour",
        "note": "4096 × 2048"
      },
      {
        "file": "02-normal",
        "title": "Normal",
        "note": "4096 × 2048"
      },
      {
        "file": "03-roughness",
        "title": "Roughness",
        "note": "4096 × 2048"
      },
      {
        "file": "04-f0-reflectance",
        "title": "F0 (reflectance)",
        "note": "4096 × 2048"
      },
      {
        "file": "05-topcoat-thickness",
        "title": "Topcoat thickness",
        "note": "4096 × 2048"
      },
      {
        "file": "06-scratches-detail",
        "title": "Scratches detail",
        "note": "2048 × 2048, levels raised"
      }
    ]
  },
  {
    "dir": "textures/03-galley-chrome-tap",
    "title": "Galley tap",
    "items": [
      {
        "file": "01-normal",
        "title": "Normal",
        "note": "4096 × 4096"
      },
      {
        "file": "02-roughness",
        "title": "Roughness",
        "note": "4096 × 4096"
      },
      {
        "file": "03-colour-blend-mask",
        "title": "Colour blend mask",
        "note": "4096 × 4096, levels raised"
      },
      {
        "file": "04-fingerprints-detail",
        "title": "Fingerprints detail",
        "note": "2048 × 2048, levels raised"
      },
      {
        "file": "05-dust-detail",
        "title": "Dust detail",
        "note": "2048 × 2048, levels raised"
      },
      {
        "file": "06-scratches-detail",
        "title": "Scratches detail",
        "note": "2048 × 2048, levels raised"
      }
    ]
  },
  {
    "dir": "textures/04-clubseat-fabric",
    "title": "Club seat fabric",
    "items": [
      {
        "file": "01-diffuse-colour",
        "title": "Diffuse colour",
        "note": "4096 × 4096"
      },
      {
        "file": "02-normal",
        "title": "Normal",
        "note": "4096 × 4096"
      },
      {
        "file": "03-roughness",
        "title": "Roughness",
        "note": "4096 × 4096"
      },
      {
        "file": "04-f0-reflectance",
        "title": "F0 (reflectance)",
        "note": "4096 × 4096"
      },
      {
        "file": "05-sheen-control",
        "title": "Sheen control",
        "note": "4096 × 4096"
      },
      {
        "file": "06-microfibre-height",
        "title": "Microfibre height",
        "note": "4096 × 4096"
      }
    ]
  },
  {
    "dir": "textures/05-ledge-burl-veneer",
    "title": "Side ledge inset",
    "items": [
      {
        "file": "01-base-colour",
        "title": "Base colour",
        "note": "4096 × 4096"
      },
      {
        "file": "02-normal",
        "title": "Normal",
        "note": "4096 × 4096"
      },
      {
        "file": "03-roughness",
        "title": "Roughness",
        "note": "4096 × 4096"
      },
      {
        "file": "04-coat-normal-orange-peel",
        "title": "Coat normal (orange peel)",
        "note": "4096 × 4096"
      }
    ]
  },
  {
    "dir": "textures/06-dining-table-mahogany",
    "title": "Dining table",
    "items": [
      {
        "file": "01-base-colour-8k",
        "title": "Base colour (8K)",
        "note": "4096 × 8192"
      },
      {
        "file": "02-normal-8k",
        "title": "Normal (8K)",
        "note": "4096 × 8192"
      },
      {
        "file": "03-roughness-8k",
        "title": "Roughness (8K)",
        "note": "4096 × 8192"
      },
      {
        "file": "04-specular-8k",
        "title": "Specular (8K)",
        "note": "4096 × 8192"
      }
    ]
  },
  {
    "dir": "textures/07-lavatory-black-marble",
    "title": "Lavatory vanity",
    "items": [
      {
        "file": "01-diffuse-colour",
        "title": "Diffuse colour",
        "note": "4096 × 4096"
      },
      {
        "file": "02-normal",
        "title": "Normal",
        "note": "4096 × 4096"
      },
      {
        "file": "03-roughness-gloss",
        "title": "Roughness (gloss)",
        "note": "4096 × 4096"
      },
      {
        "file": "04-f0-reflectance",
        "title": "F0 (reflectance)",
        "note": "4096 × 4096"
      },
      {
        "file": "05-topcoat-thickness",
        "title": "Topcoat thickness",
        "note": "4096 × 4096"
      }
    ]
  },
  {
    "dir": "textures/08-seat-shell-and-stitching",
    "title": "Seat back shell and stitching",
    "items": [
      {
        "file": "01-shell-normal-noise",
        "title": "Shell normal (noise)",
        "note": "4096 × 4096"
      },
      {
        "file": "02-shell-roughness-mask",
        "title": "Shell roughness mask",
        "note": "4096 × 4096, levels raised"
      },
      {
        "file": "03-stitch-normal",
        "title": "Stitch normal",
        "note": "2048 × 1024"
      },
      {
        "file": "04-thread-colour",
        "title": "Thread colour",
        "note": "4096 × 4096"
      },
      {
        "file": "05-thread-roughness",
        "title": "Thread roughness",
        "note": "4096 × 4096"
      },
      {
        "file": "06-thread-fuzz",
        "title": "Thread fuzz",
        "note": "4096 × 4096"
      }
    ]
  },
  {
    "dir": "textures/09-cabin-carpet",
    "title": "Cabin carpet",
    "items": [
      {
        "file": "01-diffuse-colour",
        "title": "Diffuse colour",
        "note": "2048 × 2048"
      },
      {
        "file": "02-normal",
        "title": "Normal",
        "note": "2048 × 2048"
      },
      {
        "file": "03-roughness",
        "title": "Roughness",
        "note": "2048 × 2048"
      },
      {
        "file": "04-height-sheen-control",
        "title": "Height / sheen control",
        "note": "2048 × 2048"
      },
      {
        "file": "05-f0-from-ao-map",
        "title": "F0 (from AO map)",
        "note": "2048 × 2048"
      },
      {
        "file": "06-pile-depth",
        "title": "Pile depth",
        "note": "4096 × 4096"
      }
    ]
  }
];
