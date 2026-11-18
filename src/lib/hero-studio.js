// The homepage opening: the name as a 3D object in a dark studio, rendered live with three.js.
//
// - The letters are the real outlines of Instrument Sans (src/data/hero-glyphs.json, made by scripts/hero-glyphs.mjs),
//   extruded, with painted faces and polished metal edges, standing on a polished floor that mirrors them.
// - On load the lights come on one after another: the edge lights, the wall light, then the key.
// - The cursor moves the key light (and the camera, very slightly).
// - The scroll wipes the frame from the final render to "lighting only": the same scene with every material
//   replaced by matte grey clay. Each frame is drawn in two passes, one per side of the divider.
//
// Loaded on demand by HeroStudio.astro, so three.js is only fetched on the homepage, after the text is on screen.
// three is pinned to 0.128.0: the look was tuned against that version's lights and materials.
import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import G from '../data/hero-glyphs.json';

const ease = (t) => { t = Math.min(1, Math.max(0, t)); return t * t * (3 - 2 * t); };

/** A 1D gradient as a texture: stops are [position 0..1, css colour]. */
function ramp(stops) {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 4;
  const g = c.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 256, 0);
  stops.forEach(([at, colour]) => gr.addColorStop(at, colour));
  g.fillStyle = gr; g.fillRect(0, 0, 256, 4);
  return new THREE.CanvasTexture(c);
}

/**
 * Starts the scene.
 * @param {HTMLElement} stage  the sticky frame ([data-hero]); its parent is the tall element that gives the scroll distance
 * @param {{ reduced?: boolean, coarse?: boolean, forcedSplit?: number | null, onLive?: () => void }} [options]
 * @returns {() => void} stop and free everything
 */
export function start(stage, options = {}) {
  const { reduced = false, coarse = false, forcedSplit = null, onLive } = options;
  const pin = stage.parentElement;
  const canvas = stage.querySelector('[data-hero-canvas]');
  const wipe = stage.querySelector('[data-hero-wipe]');
  const cue = stage.querySelector('[data-hero-cue]');
  const copy = stage.querySelector('[data-hero-copy]');

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x040506, 1);
  RectAreaLightUniformsLib.init();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(24, 2, 0.1, 120);
  const disposables = [];
  const keep = (thing) => { disposables.push(thing); return thing; };

  // What the paint and the metal reflect: a dark room with long soft boxes.
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x010102);
  const strip = (w, h, x, y, z, colour) => {
    const m = new THREE.Mesh(keep(new THREE.PlaneGeometry(w, h)), keep(new THREE.MeshBasicMaterial({ color: colour, side: THREE.DoubleSide })));
    m.position.set(x, y, z); m.lookAt(0, 0.5, 0); envScene.add(m);
  };
  strip(14, 2.2, 0, 8, 3, 0xffffff); // overhead soft box
  strip(1.2, 9, -9, 2.5, 1, 0xcfe0ff); // left strip
  strip(1.2, 9, 9, 2.5, -1, 0xffffff); // right strip
  strip(22, 1.0, 0, 0.6, -9, 0x6f8fb5); // horizon glow
  // Behind the camera: a soft gradient, bright on the left and dark on the right, so the paint is never one flat tone.
  const backTexture = keep(ramp([[0, '#0b0c0e'], [0.38, '#30353c'], [0.72, '#aab3bd'], [1, '#d9dee4']]));
  const back = new THREE.Mesh(keep(new THREE.PlaneGeometry(44, 14)), keep(new THREE.MeshBasicMaterial({ map: backTexture, side: THREE.DoubleSide })));
  back.position.set(0, 4, 13); back.lookAt(0, 4, 0); envScene.add(back);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTarget = keep(pmrem.fromScene(envScene, 0.02));
  const env = envTarget.texture;
  pmrem.dispose();

  // The studio: a floor, and a wall that curves up from it.
  const WALL_Z = -5, R = 2.4;
  const floorGeo = keep(new THREE.PlaneGeometry(90, 60));
  const floorClay = new THREE.Mesh(floorGeo, keep(new THREE.MeshStandardMaterial({ color: 0x8b8d90, roughness: 0.96 })));
  floorClay.rotation.x = -Math.PI / 2; floorClay.position.z = 20; floorClay.receiveShadow = true; scene.add(floorClay);
  const profile = [], positions = [], index = [];
  for (let i = 0; i <= 18; i++) { const a = ((i / 18) * Math.PI) / 2; profile.push([WALL_Z + R - R * Math.sin(a), R - R * Math.cos(a)]); }
  profile.push([WALL_Z, 16]);
  profile.forEach((p, i) => {
    positions.push(-45, p[1], p[0], 45, p[1], p[0]);
    if (i) { const k = i * 2; index.push(k - 2, k - 1, k, k - 1, k + 1, k); }
  });
  const wallGeo = keep(new THREE.BufferGeometry());
  wallGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); wallGeo.setIndex(index); wallGeo.computeVertexNormals();
  const wallClay = keep(new THREE.MeshStandardMaterial({ color: 0x8b8d90, roughness: 0.96, side: THREE.DoubleSide }));
  const wallFinal = keep(new THREE.MeshStandardMaterial({ color: 0x14171b, roughness: 0.75, side: THREE.DoubleSide }));
  const wall = new THREE.Mesh(wallGeo, wallFinal); wall.position.y = 0.002; wall.receiveShadow = true; scene.add(wall);

  // The final floor: polished, so it mirrors the name. The reflection blurs and fades toward the camera, in the
  // mirror's own shader (three 0.128 does not draw transparent layers over a mirror).
  const taps = coarse ? 1 : 2; // blur samples each way: 3x3 on phones, 5x5 elsewhere
  const mirror = new Reflector(floorGeo, {
    textureWidth: coarse ? 1024 : 1536,
    textureHeight: coarse ? 1024 : 1536,
    color: 0xffffff,
    clipBias: 0.003,
    shader: {
      uniforms: { color: { value: null }, tDiffuse: { value: null }, textureMatrix: { value: null } },
      vertexShader: `
        uniform mat4 textureMatrix; varying vec4 vUv; varying vec3 vWorld;
        void main() {
          vUv = textureMatrix * vec4(position, 1.0);
          vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        uniform vec3 color; uniform sampler2D tDiffuse; varying vec4 vUv; varying vec3 vWorld;
        void main() {
          vec2 uv = vUv.xy / vUv.w;
          float d = clamp(vWorld.z / 7.0, 0.0, 1.0);            // 0 under the letters, 1 near the camera
          float r = (0.0012 + 0.0075 * d) * ${(2 / taps).toFixed(1)};
          vec3 acc = vec3(0.0);
          for (int i = -${taps}; i <= ${taps}; i++) for (int j = -${taps}; j <= ${taps}; j++) acc += texture2D(tDiffuse, uv + vec2(float(i), float(j) * 1.6) * r).rgb;
          acc /= ${((taps * 2 + 1) ** 2).toFixed(1)};
          acc = pow(acc / (acc + vec3(0.55)), vec3(1.0 / 2.2));  // the mirror image is linear light; bring it to screen values
          float keep = mix(0.52, 0.0, smoothstep(0.0, 0.8, d));
          float far = 1.0 - smoothstep(-1.0, -2.6, vWorld.z) * 0.25;
          gl_FragColor = vec4(acc * color * keep * far + vec3(0.012, 0.014, 0.017), 1.0);
        }`,
    },
  });
  mirror.rotation.x = -Math.PI / 2; mirror.position.set(0, 0, 20); scene.add(mirror);
  keep(mirror.material); keep(mirror.getRenderTarget());

  // The name.
  const S = 1.3 / G.cap; // capital letters are 1.3 units tall
  const W = G.width * S;
  const clay = keep(new THREE.MeshStandardMaterial({ color: 0xc9c9c6, roughness: 0.9 }));
  const paint = keep(new THREE.MeshPhysicalMaterial({ color: 0x3c70b0, metalness: 0.78, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.08, envMap: env, envMapIntensity: 1.25 }));
  const metal = keep(new THREE.MeshStandardMaterial({ color: 0xe9ecf0, metalness: 1, roughness: 0.16, envMap: env, envMapIntensity: 1.5 }));
  const finalMaterials = [paint, metal]; // [faces, sides and bevels]
  const name = new THREE.Group();
  const letters = [];
  const v2 = (p) => new THREE.Vector2(p[0], p[1]);
  G.glyphs.forEach((glyph) => {
    const shapes = glyph.p.map((poly) => {
      const shape = new THREE.Shape(poly.o.map(v2));
      poly.h.forEach((hole) => shape.holes.push(new THREE.Path(hole.map(v2))));
      return shape;
    });
    // Font units: 110 deep, with a small rounded bevel that is taken back out of the outline so the weight stays true.
    const geo = keep(new THREE.ExtrudeGeometry(shapes, { depth: 110, bevelEnabled: true, bevelThickness: 8, bevelSize: 6, bevelOffset: -6, bevelSegments: 5 }));
    const mesh = new THREE.Mesh(geo, finalMaterials);
    mesh.position.x = glyph.x; mesh.castShadow = true; mesh.receiveShadow = true;
    name.add(mesh); letters.push(mesh);
  });
  name.scale.setScalar(S); name.position.set(-W / 2, 12 * S, -0.12); scene.add(name);

  // Lights. Each has an "on" level; the load sequence raises them one group after another.
  const lights = [];
  const on = (light, level, group) => { light.userData.level = level; light.userData.group = group; light.intensity = 0; lights.push(light); scene.add(light); return light; };
  scene.add(new THREE.HemisphereLight(0xaab6c6, 0x040506, 0.035));
  const area = (colour, level, w, h, x, y, z, tx, ty, tz, group) => {
    const l = new THREE.RectAreaLight(colour, 0, w, h);
    l.position.set(x, y, z); l.lookAt(tx, ty, tz);
    return on(l, level, group);
  };
  area(0xdfeaff, 7, 0.5, 6, 7.4, 2.8, -1.0, 0.8, 0.6, 0, 'rim'); // edge light, back right
  area(0xc4d8f2, 4.5, 0.5, 5, -7.6, 2.4, -1.0, -0.8, 0.6, 0, 'rim'); // edge light, back left
  area(0xfff5e8, 1.25, 8, 3.2, -2.5, 5.6, 5.5, 0, 0.5, 0, 'key'); // big soft box, front left
  const wash = new THREE.SpotLight(0x9fbfe6, 0, 0, 0.8, 1, 1); // the halo on the wall behind the name
  wash.position.set(0, 0.3, -1.2); wash.target.position.set(0, 1.5, WALL_Z); scene.add(wash.target); on(wash, 0.55, 'wash');
  const key = new THREE.SpotLight(0xffffff, 0, 0, 0.5, 1, 1); // the light the cursor carries
  key.position.set(-2, 4, 7); key.target.position.set(0, 0.5, 0); scene.add(key.target);
  key.castShadow = true; key.shadow.mapSize.set(coarse ? 1024 : 2048, coarse ? 1024 : 2048); key.shadow.bias = -0.0004; key.shadow.radius = 7;
  key.shadow.camera.near = 2; key.shadow.camera.far = 30; on(key, 0.32, 'key');

  // Frame the name: about two thirds of the width on a wide screen, more of it on a narrow one.
  let dist = 12;
  const layout = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    const aspect = w / h;
    renderer.setSize(w, h, false);
    camera.aspect = aspect;
    const fill = aspect < 1 ? 1.2 : 1.5;
    dist = Math.max(11.5, (W * fill) / (2 * Math.tan(THREE.MathUtils.degToRad(12)) * aspect));
    // Put the name in the free space above the text, whatever the text's height (it is much taller on a phone).
    // The view is shifted, not the camera, so the perspective on the letters stays the same.
    camera.clearViewOffset();
    camera.position.set(0, 0.78, dist); camera.lookAt(0, 0.02, 0);
    camera.updateProjectionMatrix(); camera.updateMatrixWorld();
    const centre = new THREE.Vector3(0, 0.65, 0).project(camera); // the middle of the letters, in screen space
    const now = (1 - centre.y) * 0.5 * h;
    const want = (h - (copy ? copy.offsetHeight : 0)) * (aspect < 1 ? 0.55 : 0.6);
    camera.setViewOffset(w, h, 0, Math.round(now - want), w, h);
    camera.updateProjectionMatrix();
  };
  layout();
  const resizeObserver = new ResizeObserver(layout);
  resizeObserver.observe(stage);

  // The cursor says where the key light goes. The scroll says how much of the frame is lighting only.
  let px = -0.3, py = 0.3, tx = px, ty = py, lastMove = -1e9;
  const onMove = (e) => {
    if (e.pointerType === 'touch') return;
    const r = stage.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width) * 2 - 1; ty = 1 - ((e.clientY - r.top) / r.height) * 2; lastMove = performance.now();
  };
  stage.addEventListener('pointermove', onMove);
  const progress = () => {
    if (forcedSplit != null) return forcedSplit;
    const travel = pin.offsetHeight - stage.offsetHeight;
    return travel > 0 ? Math.min(1, Math.max(0, -pin.getBoundingClientRect().top / travel)) : 0;
  };

  let visible = true;
  const intersectionObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
  intersectionObserver.observe(stage);

  const pass = (final, x, w, h) => {
    floorClay.visible = !final; mirror.visible = final;
    wall.material = final ? wallFinal : wallClay;
    for (const letter of letters) letter.material = final ? finalMaterials : clay;
    renderer.setScissor(x, 0, w, h);
    renderer.render(scene, camera);
  };

  const t0 = performance.now();
  let raf = 0, live = false, stopped = false;
  const frame = (now) => {
    if (stopped) return;
    raf = requestAnimationFrame(frame);
    if (!visible) return;
    const t = reduced || forcedSplit != null ? 99 : (now - t0) / 1000;
    // Lights on, one after another: the edges first, then the wall, then the key.
    const level = { rim: ease((t - 0.3) / 0.8), wash: ease((t - 0.9) / 0.8), key: ease((t - 1.5) / 0.9) };
    for (const light of lights) light.intensity = light.userData.level * level[light.userData.group];
    // With no cursor for a while, the key light drifts slowly on its own.
    if (!reduced && now - lastMove > 2500) { tx = Math.sin(now / 2900) * 0.5 - 0.1; ty = 0.25 + Math.sin(now / 4100) * 0.2; }
    px += (tx - px) * 0.05; py += (ty - py) * 0.05;
    key.position.set(px * 6.5, 3.2 + (py + 1) * 1.3, 7);
    camera.position.set(reduced ? 0 : px * 0.55, 0.78 + (reduced ? 0 : py * 0.08), dist);
    camera.lookAt(0, 0.02, 0);

    const split = ease((progress() - 0.03) / 0.9); // the share of the frame, from the left, that is lighting only
    const w = stage.clientWidth, h = stage.clientHeight, sx = Math.round(w * split);
    if (wipe) { wipe.style.transform = `translateX(${sx}px)`; wipe.style.opacity = split > 0.002 && split < 0.998 ? '1' : '0'; }
    if (cue) cue.style.setProperty('--p', split.toFixed(3));
    renderer.setScissorTest(true);
    if (sx > 0) pass(false, 0, sx, h);
    if (sx < w) pass(true, sx, w - sx, h);
    if (!live) { live = true; onLive?.(); }
  };
  raf = requestAnimationFrame(frame);

  return () => {
    stopped = true;
    cancelAnimationFrame(raf);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    stage.removeEventListener('pointermove', onMove);
    for (const thing of disposables) thing.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  };
}
