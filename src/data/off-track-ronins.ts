// Images and clips for the off-track-ronins page, migrated from the old portfolio site.
// Written by scripts/mocap-media.cjs; edit that script, not this file.
// Images: src/assets/work/off-track-ronins/<file>.webp. Clips: public/media/off-track-ronins/ (MP4 plus a WebP poster).
import type { ImageItem } from './private-jet';
import type { Clip } from '../components/Clips.astro';

export const week1: { images: ImageItem[]; clips: Clip[] } = {
  "images": [
    {
      "file": "w1-01-samurai-world-perspective-1",
      "title": "Samurai world, perspective 1"
    },
    {
      "file": "w1-02-samurai-world-perspective-2",
      "title": "Samurai world, perspective 2"
    },
    {
      "file": "w1-03-samurai-world-perspective-3",
      "title": "Samurai world, perspective 3"
    },
    {
      "file": "w1-04-samurai-world-perspective-4",
      "title": "Samurai world, perspective 4"
    },
    {
      "file": "w1-05-samurai-world-perspective-5",
      "title": "Samurai world, perspective 5"
    },
    {
      "file": "w1-06-samurai-world-perspective-6",
      "title": "Samurai world, perspective 6"
    },
    {
      "file": "w1-07-samurai-world-perspective-7",
      "title": "Samurai world, perspective 7"
    },
    {
      "file": "w1-08-samurai-world-perspective-8",
      "title": "Samurai world, perspective 8"
    },
    {
      "file": "w1-09-samurai-world-perspective-9",
      "title": "Samurai world, perspective 9"
    }
  ],
  "clips": [
    {
      "src": "/media/off-track-ronins/w1-01-samurai-world-walkthrough.mp4",
      "poster": "/media/off-track-ronins/w1-01-samurai-world-walkthrough.webp",
      "title": "Samurai world walkthrough",
      "ratio": "1280 / 720"
    }
  ]
};

export const week2: { images: ImageItem[]; clips: Clip[] } = {
  "images": [
    {
      "file": "w2-01-combat-choreography-rehearsal-with-prop-katanas",
      "title": "Combat choreography rehearsal with prop katanas"
    }
  ],
  "clips": [
    {
      "src": "/media/off-track-ronins/w2-01-motion-capture-previsualization.mp4",
      "poster": "/media/off-track-ronins/w2-01-motion-capture-previsualization.webp",
      "title": "Motion capture previsualization",
      "ratio": "1280 / 720",
      "sound": true
    }
  ]
};

export const week3: { images: ImageItem[]; clips: Clip[] } = {
  "images": [
    {
      "file": "w3-01-ik-retargeter-optitrack-skeleton-to-samurai",
      "title": "IK Retargeter: OptiTrack skeleton to Samurai"
    },
    {
      "file": "w3-02-ik-retargeter-optitrack-skeleton-to-ue5",
      "title": "IK Retargeter: OptiTrack skeleton to UE5 Manny"
    },
    {
      "file": "w3-03-animation-blueprint-retarget-pose-from-mesh",
      "title": "Animation Blueprint: retarget pose from mesh with the IK Retargeter"
    },
    {
      "file": "w3-04-animation-blueprint-live-link-pose-from",
      "title": "Animation Blueprint: Live Link pose from Motive to UE5 for the OptiTrack skeleton"
    },
    {
      "file": "w3-05-samurai-blueprint-source-to-target-live",
      "title": "Samurai Blueprint: source-to-target Live Link from Motive to UE5"
    },
    {
      "file": "w3-06-metahuman-blueprint-source-to-target-live",
      "title": "MetaHuman Blueprint: source-to-target Live Link from Motive to UE5"
    },
    {
      "file": "w3-07-troubleshooting-and-adjusting-the-ik-retargeter",
      "title": "Troubleshooting and adjusting the IK Retargeter on set"
    }
  ],
  "clips": [
    {
      "src": "/media/off-track-ronins/w3-01-short-demo-of-the-modular-live.mp4",
      "poster": "/media/off-track-ronins/w3-01-short-demo-of-the-modular-live.webp",
      "title": "Short demo of the modular Live Link setup for different skeletons",
      "ratio": "1600 / 900"
    }
  ]
};

export const week4: { images: ImageItem[]; clips: Clip[] } = {
  "images": [
    {
      "file": "w4-01-sword-fight-on-the-capture-stage",
      "title": "Sword fight on the capture stage, previewed live in Unreal Engine"
    },
    {
      "file": "w4-02-performance-capture-with-the-unreal-engine",
      "title": "Performance capture with the Unreal Engine preview on the LED wall"
    },
    {
      "file": "w4-03-performance-capture-blockout",
      "title": "Performance capture blockout"
    },
    {
      "file": "w4-04-performance-capture-stunt",
      "title": "Performance capture stunt"
    },
    {
      "file": "w4-05-performance-capture-team-photo",
      "title": "Performance capture team photo"
    }
  ],
  "clips": [
    {
      "src": "/media/off-track-ronins/w4-01-real-time-previsualization-from-motive-to.mp4",
      "poster": "/media/off-track-ronins/w4-01-real-time-previsualization-from-motive-to.webp",
      "title": "Real-time previsualization from Motive to UE5 (rigid body and skeleton)",
      "ratio": "1280 / 720"
    },
    {
      "src": "/media/off-track-ronins/w4-02-performance-capture-behind-the-scenes.mp4",
      "poster": "/media/off-track-ronins/w4-02-performance-capture-behind-the-scenes.webp",
      "title": "Performance capture behind the scenes",
      "ratio": "1280 / 720"
    },
    {
      "src": "/media/off-track-ronins/w4-03-performance-capture-timelapse.mp4",
      "poster": "/media/off-track-ronins/w4-03-performance-capture-timelapse.webp",
      "title": "Performance capture timelapse",
      "ratio": "1280 / 720"
    }
  ]
};

export const week5: { images: ImageItem[]; clips: Clip[] } = {
  "images": [
    {
      "file": "w5-01-dual-skeleton-retargeting-and-rigid-body",
      "title": "Dual-skeleton retargeting and rigid-body integration in MotionBuilder"
    },
    {
      "file": "w5-02-mocap-take-preview-and-selection-in",
      "title": "Mocap take preview and selection in UE5"
    },
    {
      "file": "w5-03-mocap-refinement-through-an-fk-ik",
      "title": "Mocap refinement through an FK/IK Control Rig workflow for precise blade contact"
    },
    {
      "file": "w5-04-raw-and-refined-mocap-animations-scenes",
      "title": "Raw and refined mocap animations (scenes 01–12)"
    },
    {
      "file": "w5-05-raw-and-refined-mocap-animations-scenes",
      "title": "Raw and refined mocap animations (scenes 13–29)"
    },
    {
      "file": "w5-06-control-rig-setup-for-each-mocap",
      "title": "Control Rig setup for each mocap scene"
    },
    {
      "file": "w5-07-level-sequencer-setup-for-each-mocap",
      "title": "Level Sequencer setup for each mocap scene"
    }
  ],
  "clips": [
    {
      "src": "/media/off-track-ronins/w5-01-cinematic-camera-configuration-and-shot-direction.mp4",
      "poster": "/media/off-track-ronins/w5-01-cinematic-camera-configuration-and-shot-direction.webp",
      "title": "Cinematic camera configuration and shot direction through Sequencer camera cuts",
      "ratio": "1600 / 900"
    }
  ]
};

export const week6: { images: ImageItem[]; clips: Clip[] } = {
  "images": [
    {
      "file": "w6-01-led-volume-shoot-for-the-office",
      "title": "LED volume shoot for the office scenes"
    },
    {
      "file": "w6-02-final-compositing-of-sfx-vfx-and",
      "title": "Final compositing of SFX, VFX and CGI with live-action footage in DaVinci Resolve"
    }
  ],
  "clips": [
    {
      "src": "/media/off-track-ronins/w6-01-led-volume-virtual-production-icvfx-with.mp4",
      "poster": "/media/off-track-ronins/w6-01-led-volume-virtual-production-icvfx-with.webp",
      "title": "LED volume virtual production (ICVFX) with camera tracking",
      "ratio": "1280 / 720"
    },
    {
      "src": "/media/off-track-ronins/w6-02-led-volume-behind-the-scenes.mp4",
      "poster": "/media/off-track-ronins/w6-02-led-volume-behind-the-scenes.webp",
      "title": "LED volume behind the scenes",
      "ratio": "1280 / 720"
    },
    {
      "src": "/media/off-track-ronins/w6-03-volumetric-capture-for-seamless-transitions-between.mp4",
      "poster": "/media/off-track-ronins/w6-03-volumetric-capture-for-seamless-transitions-between.webp",
      "title": "Volumetric capture for seamless transitions between live-action footage and CGI",
      "ratio": "1280 / 720"
    }
  ]
};
