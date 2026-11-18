// The homepage opening: the name as a 3D object in a dark studio, rendered live with three.js.
//
// - The letters are the real outlines of Instrument Sans (src/data/hero-glyphs.json, made by scripts/hero-glyphs.mjs),
//   extruded with rounded edges and finished in car paint (a metallic base under a clear coat), standing on a
//   polished floor that mirrors them. What makes paint read as paint is what it reflects, so the scene carries
//   its own studio for that: see "What the paint reflects" below.
// - On load the lights come on one after another: the edge lights, the wall light, then the key.
// - The cursor moves the key light (and the camera, very slightly).
// - The scroll wipes the frame from the final render to "lighting only": the same scene with every material
//   replaced by matte grey clay. Each frame is drawn in two passes, one per side of the divider.
//
// On a phone or tablet (a touch screen, no cursor to move the light) nothing in the scene changes once the lights
// are on, so it is drawn once in each version and kept as two still pictures. Scrolling then only slides one
// picture across the other, which costs almost nothing, instead of drawing the 3D scene twice on every frame.
//
// The divider must move as smoothly as the page does:
// - With stills, where the browser supports scroll-driven animations (CSS in HeroStudio.astro), the browser itself
//   moves the divider with the scroll, in step with it, without any script.
// - Otherwise the divider glides toward where the scroll says it should be, a little each frame, so a stepped
//   scroll (a mouse wheel, late scroll events on a phone) still reads as one continuous movement.
//
// Loaded on demand by HeroStudio.astro, so three.js is only fetched on the homepage, after the text is on screen.
// three is pinned to 0.128.0: the look was tuned against that version's lights and materials.
import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import G from '../data/hero-glyphs.json';

const ease = (t) => { t = Math.min(1, Math.max(0, t)); return t * t * (3 - 2 * t); };

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
  const still = stage.querySelector('[data-hero-still]'); // holds the lighting-only picture on touch screens

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  // Phones have very dense screens; 1.5x is sharp enough there and nearly halves the pixels to shade.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2));
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

  // ---- What the paint reflects ----
  // A dark studio with soft boxes far brighter than white (the clear coat on paint reflects only a few percent of
  // what is in front of it, so only very bright lights show up crisply in it, as on a real car).
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x010102);
  const box = (w, h, x, y, z, colour, power = 1) => {
    const material = keep(new THREE.MeshBasicMaterial({ color: colour, side: THREE.DoubleSide }));
    material.color.multiplyScalar(power);
    const m = new THREE.Mesh(keep(new THREE.PlaneGeometry(w, h)), material);
    m.position.set(x, y, z); m.lookAt(0, 0.5, 0); envScene.add(m);
  };
  box(16, 2.6, 0, 8.5, 2.5, 0xffffff, 9); // overhead soft box: the long highlight along the tops of the letters
  box(1.1, 9, -9.5, 2.5, 1, 0xd6e4ff, 7); // left strip: catches the rounded edges on the left
  box(1.1, 9, 9.5, 2.5, -1, 0xffffff, 7); // right strip
  box(24, 1.0, 0, 0.6, -9, 0x6f8fb5, 1.2); // horizon glow behind the name
  // Behind the camera: a dim glow, so the faces are never black. The sharp reflections on the faces (the horizon
  // and the strip light) are drawn by the paint itself, below: a reflection map this size is too coarse to hold a
  // crisp line across a flat letter, which only looks at a few degrees of the room.
  box(46, 14, 0, 4, 13, 0x8d97a3, 0.16);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTarget = keep(pmrem.fromScene(envScene, 0.012));
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
    textureWidth: coarse ? 768 : 1536,
    textureHeight: coarse ? 768 : 1536,
    color: 0xffffff,
    clipBias: 0.003,
    shader: {
      uniforms: { color: { value: null }, tDiffuse: { value: null }, textureMatrix: { value: null }, reach: { value: 7 } },
      vertexShader: `
        uniform mat4 textureMatrix; varying vec4 vUv; varying vec3 vWorld;
        void main() {
          vUv = textureMatrix * vec4(position, 1.0);
          vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        uniform vec3 color; uniform sampler2D tDiffuse; uniform float reach; varying vec4 vUv; varying vec3 vWorld;
        void main() {
          vec2 uv = vUv.xy / vUv.w;
          // 0 under the letters, 1 where the reflection has faded out. "reach" grows with the camera's distance:
          // on a narrow screen the camera stands far back and the reflection stretches further along the floor.
          float d = clamp(vWorld.z / reach, 0.0, 1.0);
          // The blur is sized against the letters: it shrinks as the camera stands further back.
          float r = (0.0012 + 0.0075 * d) * ${(2 / taps).toFixed(1)} * (7.0 / reach);
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
  // Some phone GPUs cannot render into a three-channel picture; four channels work everywhere.
  mirror.getRenderTarget().texture.format = THREE.RGBAFormat;

  // The name.
  const S = 1.3 / G.cap; // capital letters are 1.3 units tall
  const W = G.width * S;
  const clay = keep(new THREE.MeshStandardMaterial({ color: 0xc9c9c6, roughness: 0.9 }));
  // Car paint, in two layers as on a car. Underneath, a metallic base coat in deep blue, smooth enough to mirror
  // the studio, so the reflections come back tinted with the paint's colour. On top, a clear coat: perfectly
  // smooth, adding the small white highlights of the lights themselves.
  // (No flake texture: at this size it only reads as grain, and any bumpiness makes the renderer blur the
  // reflections, which is the opposite of a polished finish.)
  const paint = keep(new THREE.MeshPhysicalMaterial({
    color: 0x1450b4, metalness: 1, roughness: 0.06,
    clearcoat: 1, clearcoatRoughness: 0.02,
    envMap: env, envMapIntensity: 1.0,
  }));
  // The studio as the polished faces see it, worked out per pixel so it stays sharp at any size: a wall of light
  // above a dark floor, meeting in a horizon, and one long strip light above it. A flat face mirrors them as a
  // line partway up the letters, deep below and bright above, with a thin highlight running through the whole
  // name: what the side of a car shows in a studio. On the rounded edges the same lights wrap into fine glints.
  // Heights are given on the letters (0 = the floor, 1.3 = the top of a capital); frame() turns them into the
  // slopes the shader compares against, which depend on where the camera is.
  const REFLECT = { horizon: 0.46, strip: 0.8, edge: 0.022, fade: 1.0 };
  const studio = { horizon: { value: 0 }, strip: { value: 0 }, edge: { value: 0.001 }, fade: { value: 0.1 }, on: { value: 0 } };
  paint.onBeforeCompile = (shader) => {
    shader.uniforms.uHorizon = studio.horizon;
    shader.uniforms.uStrip = studio.strip;
    shader.uniforms.uEdge = studio.edge;
    shader.uniforms.uFade = studio.fade;
    shader.uniforms.uOn = studio.on;
    shader.fragmentShader = shader.fragmentShader
      .replace('void main() {', 'uniform float uHorizon; uniform float uStrip; uniform float uEdge; uniform float uFade; uniform float uOn;\nvoid main() {')
      .replace('#include <lights_fragment_end>', `#include <lights_fragment_end>
        {
          vec3 seen = inverseTransformDirection(reflect(-normalize(vViewPosition), normal), viewMatrix); // where this pixel's mirror image comes from
          float toward = smoothstep(0.25, 0.7, seen.z);            // only the side of the room behind the camera
          // How far above or below level it looks. The lines lean a little across the name (the 0.034), as a
          // light set at an angle would; dead level, they read as a painted stripe instead of a reflection.
          float slope = seen.y / max(seen.z, 0.05) - seen.x * 0.034;
          float above = smoothstep(uHorizon - uEdge, uHorizon + uEdge, slope);
          // The wall of light: strongest just above the horizon, falling away toward the top of the letters.
          float wall = above * mix(1.0, 0.16, smoothstep(0.0, 1.0, (slope - uHorizon) / uFade));
          // The floor: dark, lifting slightly as it nears the horizon.
          float ground = (1.0 - above) * 0.13 * smoothstep(-uFade * 0.55, 0.0, slope - uHorizon);
          // The strip light: a fine core with a soft glow around it.
          float away = abs(slope - uStrip) / uEdge;
          float strip = (1.0 - smoothstep(0.3, 1.0, away)) + 0.22 * exp(-away * away * 0.09);
          // The base coat tints what it mirrors; the clear coat adds a little of the strip light untinted.
          reflectedLight.indirectSpecular += uOn * toward * (material.specularColor * ((wall + ground) * 0.9 + strip * 6.5) + vec3(strip * 0.42));
        }`);
  };
  const name = new THREE.Group();
  const letters = [];
  const v2 = (p) => new THREE.Vector2(p[0], p[1]);
  G.glyphs.forEach((glyph) => {
    const shapes = glyph.p.map((poly) => {
      const shape = new THREE.Shape(poly.o.map(v2));
      poly.h.forEach((hole) => shape.holes.push(new THREE.Path(hole.map(v2))));
      return shape;
    });
    // Font units: 100 deep, with wide rounded edges, like a pressed panel. Curved surfaces are what catch a
    // studio's lights; a flat face only shows one patch of it. The rounding is taken back out of the outline
    // (bevelOffset) so the letters keep their true weight.
    const geo = keep(new THREE.ExtrudeGeometry(shapes, { depth: 100, bevelEnabled: true, bevelThickness: 22, bevelSize: 17, bevelOffset: -17, bevelSegments: 10 }));
    const mesh = new THREE.Mesh(geo, paint);
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
  let dist = 12, resized = false;
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
    mirror.material.uniforms.reach.value = dist * 0.58;
    resized = true;
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
  const stickTop = parseFloat(getComputedStyle(stage).top) || 0; // where the sticky frame rests: under the navigation bar
  const progress = () => {
    if (forcedSplit != null) return forcedSplit;
    // 0 when the frame starts to stay in place (its top meets the navigation bar), 1 when it lets go.
    const travel = pin.offsetHeight - stage.offsetHeight;
    return travel > 0 ? Math.min(1, Math.max(0, (stickTop - pin.getBoundingClientRect().top) / travel)) : 0;
  };

  let visible = true;
  const intersectionObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
  intersectionObserver.observe(stage);

  const pass = (final, x, w, h) => {
    floorClay.visible = !final; mirror.visible = final;
    wall.material = final ? wallFinal : wallClay;
    for (const letter of letters) letter.material = final ? paint : clay;
    renderer.setScissor(x, 0, w, h);
    renderer.render(scene, camera);
  };

  const drawLights = (t) => {
    // Lights on, one after another: the edges first, then the wall, then the key.
    const level = { rim: ease((t - 0.3) / 0.8), wash: ease((t - 0.9) / 0.8), key: ease((t - 1.5) / 0.9) };
    for (const light of lights) light.intensity = light.userData.level * level[light.userData.group];
    // The paint's reflections come on with the lights it reflects: a little with the edge lights, the rest with the key.
    paint.envMapIntensity = 0.3 * level.rim + 0.7 * level.key;
    studio.on.value = level.key;
  };
  // A flat face at height h mirrors the room at a slope of (h - camera height) / camera distance.
  const aimReflections = () => {
    studio.horizon.value = (REFLECT.horizon - camera.position.y) / dist;
    studio.strip.value = (REFLECT.strip - camera.position.y) / dist;
    studio.edge.value = REFLECT.edge / dist;
    studio.fade.value = REFLECT.fade / dist;
  };
  // Where the divider should be: the share of the frame, from the left, that is lighting only.
  const wanted = () => ease((progress() - 0.03) / 0.9);
  // Where it is drawn. It glides toward the wanted place, closing most of the gap every `ms` milliseconds
  // whatever the frame rate (0 = jump straight there).
  let shown = wanted(), glidedAt = performance.now();
  const glide = (ms) => {
    const target = wanted(), now = performance.now();
    const settle = ms > 0 ? 1 - Math.exp(-(now - glidedAt) / ms) : 1;
    glidedAt = now;
    shown += (target - shown) * settle;
    if (Math.abs(target - shown) < 0.0004) shown = target;
    stage.style.setProperty('--split', shown.toFixed(4));
    stage.style.setProperty('--wipe-on', shown > 0.002 && shown < 0.998 ? '1' : '0');
    return shown !== target; // still moving
  };

  // ---- Touch screens: once the lights are on, keep two still pictures and let the scroll slide one across. ----
  const stills = coarse && !!still;
  // The browser can tie an animation to the scroll position itself (see "Scroll-driven" in HeroStudio.astro).
  const scrollDriven = stills && forcedSplit == null && typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()');
  let frozen = false, gliding = false;
  const freeze = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    drawLights(99);
    key.position.set(px * 6.5, 3.2 + (py + 1) * 1.3, 7);
    camera.position.set(0, 0.78, dist); camera.lookAt(0, 0.02, 0);
    aimReflections();
    renderer.setScissorTest(false);
    // The lighting-only version first, copied into the still picture straight away; then the final version stays
    // on the 3D canvas underneath it.
    pass(false, 0, w, h);
    still.width = canvas.width; still.height = canvas.height;
    still.getContext('2d').drawImage(canvas, 0, 0);
    pass(true, 0, w, h);
    stage.classList.add('is-still');
    if (scrollDriven) stage.classList.add('is-scroll-driven');
    frozen = true; resized = false;
    glide(0);
  };
  // Without scroll-driven animations: each scroll event starts a short glide that runs until the divider arrives.
  const onScroll = () => {
    if (!frozen || gliding || scrollDriven) return;
    gliding = true;
    glidedAt = performance.now();
    const step = () => {
      if (stopped) return;
      if (glide(reduced ? 0 : 70)) requestAnimationFrame(step);
      else gliding = false;
    };
    requestAnimationFrame(step);
  };
  if (stills) addEventListener('scroll', onScroll, { passive: true });

  const t0 = performance.now();
  let raf = 0, live = false, stopped = false;
  const frame = (now) => {
    if (stopped) return;
    raf = requestAnimationFrame(frame);
    if (!visible) return;
    const t = reduced || forcedSplit != null ? 99 : (now - t0) / 1000;
    if (stills && frozen) {
      // Nothing moves any more. Draw again only if the screen was turned or resized.
      if (resized) freeze();
      return;
    }
    drawLights(t);
    // With no cursor for a while, the key light drifts slowly on its own (not on touch screens, where the
    // picture is about to be frozen).
    if (!reduced && !stills && now - lastMove > 2500) { tx = Math.sin(now / 2900) * 0.5 - 0.1; ty = 0.25 + Math.sin(now / 4100) * 0.2; }
    px += (tx - px) * 0.05; py += (ty - py) * 0.05;
    key.position.set(px * 6.5, 3.2 + (py + 1) * 1.3, 7);
    camera.position.set(reduced || stills ? 0 : px * 0.55, 0.78 + (reduced || stills ? 0 : py * 0.08), dist);
    camera.lookAt(0, 0.02, 0);
    aimReflections();

    // The first frame starts in place; after that the divider glides.
    glide(reduced || !live || forcedSplit != null ? 0 : 95);
    const w = stage.clientWidth, h = stage.clientHeight, sx = Math.round(w * shown);
    renderer.setScissorTest(true);
    if (sx > 0) pass(false, 0, sx, h);
    if (sx < w) pass(true, sx, w - sx, h);
    resized = false;
    if (!live) { live = true; onLive?.(); }
    // The lights are fully on after about two and a half seconds: from then on a touch screen shows stills.
    if (stills && t > 2.6) freeze();
  };
  raf = requestAnimationFrame(frame);

  return () => {
    stopped = true;
    cancelAnimationFrame(raf);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    stage.removeEventListener('pointermove', onMove);
    removeEventListener('scroll', onScroll);
    for (const thing of disposables) thing.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  };
}
