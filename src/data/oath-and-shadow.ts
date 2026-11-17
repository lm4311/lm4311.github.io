// Images and clips for the oath-and-shadow page, migrated from the old portfolio site.
// Written by scripts/mocap-media.cjs; edit that script, not this file.
// Images: src/assets/work/oath-and-shadow/<file>.webp. Clips: public/media/oath-and-shadow/ (MP4 plus a WebP poster).
import type { ImageItem } from './private-jet';
import type { Clip } from '../components/Clips.astro';

export const week1: { images: ImageItem[]; clips: Clip[] } = {
  "images": [
    {
      "file": "w1-01-sword-fight-capture-session-on-the",
      "title": "Sword-fight capture session on the OptiTrack stage"
    },
    {
      "file": "w1-02-sword-fight-storyboard",
      "title": "Sword fight storyboard"
    }
  ],
  "clips": [
    {
      "src": "/media/oath-and-shadow/w1-01-motion-capture-behind-the-scenes-execution.mp4",
      "poster": "/media/oath-and-shadow/w1-01-motion-capture-behind-the-scenes-execution.webp",
      "title": "Motion capture behind the scenes: execution scene",
      "ratio": "1280 / 720",
      "sound": true
    },
    {
      "src": "/media/oath-and-shadow/w1-02-motion-capture-behind-the-scenes-last.mp4",
      "poster": "/media/oath-and-shadow/w1-02-motion-capture-behind-the-scenes-last.webp",
      "title": "Motion capture behind the scenes: last fight",
      "ratio": "1280 / 720",
      "sound": true
    },
    {
      "src": "/media/oath-and-shadow/w1-03-motion-capture-behind-the-scenes-sword.mp4",
      "poster": "/media/oath-and-shadow/w1-03-motion-capture-behind-the-scenes-sword.webp",
      "title": "Motion capture behind the scenes: sword-fight practice",
      "ratio": "1280 / 720",
      "sound": true
    },
    {
      "src": "/media/oath-and-shadow/w1-04-motion-capture-behind-the-scenes-walk.mp4",
      "poster": "/media/oath-and-shadow/w1-04-motion-capture-behind-the-scenes-walk.webp",
      "title": "Motion capture behind the scenes: walk cycle",
      "ratio": "1280 / 720",
      "sound": true
    }
  ]
};

export const week2: { images: ImageItem[]; clips: Clip[] } = {
  "images": [
    {
      "file": "w2-01-motionbuilder-to-unreal-engine-5-over",
      "title": "MotionBuilder to Unreal Engine 5 over Live Link"
    }
  ],
  "clips": [
    {
      "src": "/media/oath-and-shadow/w2-01-live-link-real-time-streaming-test.mp4",
      "poster": "/media/oath-and-shadow/w2-01-live-link-real-time-streaming-test.webp",
      "title": "Live Link real-time streaming test",
      "ratio": "1600 / 900"
    }
  ]
};

export const week3: { images: ImageItem[]; clips: Clip[] } = {
  "images": [
    {
      "file": "w3-01-two-character-setup-in-motionbuilder-and",
      "title": "Two-character setup in MotionBuilder and Unreal Engine 5"
    },
    {
      "file": "w3-02-cg-character-blueprint",
      "title": "CG character Blueprint"
    },
    {
      "file": "w3-03-motionbuilder-two-character-scene-setup",
      "title": "MotionBuilder: two-character scene setup"
    },
    {
      "file": "w3-04-motionbuilder-to-unreal-engine-live-link",
      "title": "MotionBuilder to Unreal Engine Live Link"
    }
  ],
  "clips": [
    {
      "src": "/media/oath-and-shadow/w3-01-sword-fight-mocap-over-live-link.mp4",
      "poster": "/media/oath-and-shadow/w3-01-sword-fight-mocap-over-live-link.webp",
      "title": "Sword fight mocap over Live Link",
      "ratio": "1600 / 900"
    }
  ]
};

export const week4: { images: ImageItem[]; clips: Clip[] } = {
  "images": [
    {
      "file": "w4-01-ue5-keyframing-camera-movement-and-manual",
      "title": "UE5: keyframing camera movement and manual focus distance in each sequencer"
    },
    {
      "file": "w4-02-motionbuilder-sword-attachment-parent-child-constraint",
      "title": "MotionBuilder: sword attachment (parent/child constraint)"
    },
    {
      "file": "w4-03-motionbuilder-f-curve-noise-filtering",
      "title": "MotionBuilder: F-curve noise filtering"
    },
    {
      "file": "w4-04-motionbuilder-take-selection-and-baking-before",
      "title": "MotionBuilder: take selection and baking before export"
    },
    {
      "file": "w4-05-ue5-control-rig-created-in-the",
      "title": "UE5: Control Rig created in the Level Sequencer"
    },
    {
      "file": "w4-06-ue5-keyframe-deletion-to-remove-major",
      "title": "UE5: keyframe deletion to remove major noise and jitter"
    },
    {
      "file": "w4-07-ue5-additive-layer-to-adjust-animation",
      "title": "UE5: additive layer to adjust animation creatively and precisely"
    },
    {
      "file": "w4-08-metahuman-creator-customizing-the-assassins-head",
      "title": "MetaHuman Creator: customizing the Assassin’s head"
    },
    {
      "file": "w4-09-metahuman-creator-customizing-the-knights-head",
      "title": "MetaHuman Creator: customizing the Knight’s head"
    },
    {
      "file": "w4-10-ue5-final-heads-for-both-characters",
      "title": "UE5: final heads for both characters"
    },
    {
      "file": "w4-11-ue5-raw-and-fine-tuned-mocap",
      "title": "UE5: raw and fine-tuned mocap animations"
    },
    {
      "file": "w4-12-ue5-control-rig-level-sequencer-for",
      "title": "UE5: Control Rig Level Sequencer for each mocap scene"
    },
    {
      "file": "w4-13-ue5-all-level-sequencers-created-for",
      "title": "UE5: all Level Sequencers created for the final render"
    },
    {
      "file": "w4-14-ue5-composition-of-the-master-sequencer",
      "title": "UE5: composition of the master sequencer"
    }
  ],
  "clips": []
};
