import * as THREE from "three";
import { ARTWORKS, EXHIBITS, FINAL_MESSAGE, INTRO, NAME } from "./content.js";
import {
  isAudioMuted,
  playSoundEffect,
  startBackgroundMusic,
  toggleAudio,
} from "./audio.js";
import "./styles.css";

const $ = (id) => document.getElementById(id);
$("ititle").textContent = NAME;
$("itext").textContent = INTRO;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
document.body.prepend(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf3e2d6);
scene.fog = new THREE.Fog(0xf3e2d6, 16, 55);
const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 100);
function rs() {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
}
addEventListener("resize", rs);
rs();
scene.add(
  new THREE.AmbientLight(0xffffff, 0.7),
  new THREE.HemisphereLight(0xfff0e0, 0x8a6a4a, 0.6),
);
const dl = new THREE.DirectionalLight(0xffffff, 0.4);
dl.position.set(3, 8, 5);
scene.add(dl);
const L = (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.8 }),
  box = (w, h, d, c, x, y, z, p = scene) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), L(c));
    m.position.set(x, y, z);
    p.add(m);
    return m;
  },
  cy = (a, b, h, s = 12) => new THREE.CylinderGeometry(a, b, h, s),
  sp = (r) => new THREE.SphereGeometry(r, 16, 12),
  add = (geo, m, x, y, z, p = scene) => {
    const s = new THREE.Mesh(geo, m);
    s.position.set(x, y, z);
    p.add(s);
    return s;
  };
const Z0 = 8,
  Z1 = -84,
  finalExhibitIndex = EXHIBITS.length,
  finalZoneZ = -74;
const walls = [],
  exhibitSpots = [],
  imageCropOffsets = [0.35, 0.26, 0.15, 0.3, 0.5, 0.57, 0.23],
  heartPositions = [
    [-12, -4],
    [-4, -4],
    [4, -4],
    [12, -4],
    [12, -22],
    [4, -22],
    [-4, -22],
    [-12, -22],
    [-12, -38],
    [-4, -38],
    [4, -38],
    [12, -38],
    [12, -54],
    [-4, -54],
  ];
const hit = (x, z, r = 0.45) =>
  walls.some(
    (w) => x > w[0] - r && x < w[2] + r && z > w[1] - r && z < w[3] + r,
  );
const ftx = (() => {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const x = c.getContext("2d");
  for (let i = 0; i < 8; i++)
    for (let k = -1; k < 5; k++) {
      x.fillStyle =
        "hsl(28," +
        (38 + ((i * 7 + k * 13) % 12)) +
        "%," +
        (36 + ((i * 5 + k * 11) % 10)) +
        "%)";
      x.fillRect(k * 64 + (i % 2) * 32, i * 32, 63, 31);
    }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(14, 30);
  t.encoding = THREE.sRGBEncoding;
  return t;
})();
scene.background = (() => {
  const c = document.createElement("canvas");
  c.width = 2;
  c.height = 256;
  const x = c.getContext("2d"),
    g = x.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, "#2a2060");
  g.addColorStop(0.6, "#c4506a");
  g.addColorStop(1, "#ffc08a");
  x.fillStyle = g;
  x.fillRect(0, 0, 2, 256);
  const t = new THREE.CanvasTexture(c);
  t.encoding = THREE.sRGBEncoding;
  return t;
})();
scene.fog.color.set(0xe9cfc3);
scene.fog.far = 70;
add(
  new THREE.PlaneGeometry(40, 92),
  new THREE.MeshStandardMaterial({ map: ftx, roughness: 0.55 }),
  0,
  0,
  -38,
).rotation.x = -Math.PI / 2;
box(0.3, 4.4, 92, 0xf0dccf, -20.15, 2.2, -38);
box(0.3, 4.4, 92, 0xf0dccf, 20.15, 2.2, -38);
box(40.6, 4.4, 0.3, 0xf0dccf, 0, 2.2, -84.15);
box(40.6, 4.4, 0.3, 0xf0dccf, 0, 2.2, 8.15);
box(40.6, 0.2, 70.4, 0xf6ece6, 0, 4.5, -27);
function wall(x1, x2, z, c) {
  box(x2 - x1, 3.6, 0.3, c, (x1 + x2) / 2, 1.8, z);
  box(x2 - x1 + 0.02, 0.25, 0.34, 0xd8c2b0, (x1 + x2) / 2, 0.125, z);
  walls.push([x1, z - 0.15, x2, z + 0.15]);
}
wall(-20, 10, -14, 0xf3d9d9);
wall(-10, 20, -30, 0xdde8dc);
wall(-20, 10, -46, 0xe6dcef);
wall(-10, 20, -62, 0xf8ecd0);
[-6, -22, -38, -54].forEach((z, r) => {
  add(
    new THREE.BoxGeometry(30, 0.05, 0.5),
    new THREE.MeshBasicMaterial({ color: 0xfff6dc }),
    0,
    4.37,
    z,
  );
  box(
    10,
    0.02,
    3,
    [0xa82a45, 0x2f6a6a, 0x6a4a9a, 0xc49a3c][r],
    r % 2 ? -6 : 6,
    0.012,
    z - 2,
  );
  const bx = r % 2 ? 6 : -6;
  box(2, 0.1, 0.6, 0x6a4a3a, bx, 0.5, z - 3);
  box(0.1, 0.5, 0.5, 0x6a4a3a, bx - 0.9, 0.25, z - 3);
  box(0.1, 0.5, 0.5, 0x6a4a3a, bx + 0.9, 0.25, z - 3);
  [-18.5, 18.5].forEach((x, k) => {
    add(cy(0.35, 0.28, 0.6), L(0xb5653a), x, 0.3, z + (k ? -1 : 1) * 2);
    [
      [0, 0.9, 0.5],
      [-0.25, 1.3, 0.4],
      [0.25, 1.35, 0.4],
    ].forEach((f) =>
      add(sp(f[2]), L(0x4f9a56), x + f[0], f[1], z + (k ? -1 : 1) * 2),
    );
  });
});
[
  [-14, -13.78, 0],
  [-6, -13.78, 0],
  [2, -13.78, 0],
  [-14, -14.22, Math.PI],
  [-6, -14.22, Math.PI],
  [2, -14.22, Math.PI],
  [-2, -29.78, 0],
  [6, -29.78, 0],
  [14, -29.78, 0],
  [-2, -30.22, Math.PI],
  [6, -30.22, Math.PI],
  [14, -30.22, Math.PI],
  [-14, -45.78, 0],
  [-6, -45.78, 0],
].forEach((f, i) => {
  frameAt(i, f[0], f[1], f[2]);
  exhibitSpots.push([f[0], f[1] + (f[2] ? -1.9 : 1.9)]);
});
function lab(t, w, h, cs, fs) {
  const c = document.createElement("canvas");
  c.width = cs[0];
  c.height = cs[1];
  const x = c.getContext("2d");
  x.textAlign = "center";
  x.fillStyle = cs[2] || "#c4506a";
  x.font = "bold " + fs + "px Georgia";
  t.forEach((l, i) => x.fillText(l, c.width / 2, fs * (i + 1.1)));
  const tx = new THREE.CanvasTexture(c);
  tx.encoding = THREE.sRGBEncoding;
  return tx;
}
const bx = lab(["🎂 JOYEUX ANNIVERSAIRE 🎂"], 0, 0, [1024, 128], 64);
const bn = add(
  new THREE.PlaneGeometry(7, 0.875),
  new THREE.MeshBasicMaterial({ map: bx, transparent: true }),
  0,
  3.2,
  Z1 + 0.05,
);
const en = lab(
  ["Le Musée de l’Amour", "pour " + NAME + " 💕"],
  0,
  0,
  [768, 200, "#b88a3c"],
  64,
);
add(
  new THREE.PlaneGeometry(5, 1.3),
  new THREE.MeshBasicMaterial({ map: en, transparent: true }),
  0,
  3,
  Z0 - 0.05,
).rotation.y = Math.PI;
const cols = [0xe8365d, 0xffb347, 0x6ad4ff, 0xb57edc, 0x7be07b];
for (let k = 0; k < 13; k++) {
  const f = add(
    new THREE.ConeGeometry(0.2, 0.4, 3),
    L(cols[k % 5]),
    -6 + k,
    3.9 - Math.sin((k / 12) * Math.PI) * 0.4,
    finalZoneZ - 3,
  );
  f.rotation.x = Math.PI;
}
const bl = [];
for (let k = 0; k < 8; k++) {
  const b = add(
    sp(0.3),
    L(cols[k % 5]),
    -5.5 + k * 1.5,
    2.6,
    finalZoneZ - 2 + (k % 2) * 1.5,
  );
  b.scale.y = 1.25;
  b.userData.y = 2.6;
  bl.push(b);
}
add(cy(0.8, 0.8, 0.8, 16), L(0xfff5e8), 3, 0.4, finalZoneZ);
add(cy(0.5, 0.5, 0.3, 16), L(0xf2a5b5), 3, 0.95, finalZoneZ);
add(cy(0.32, 0.32, 0.25, 16), L(0xffffff), 3, 1.2, finalZoneZ);
add(cy(0.02, 0.02, 0.2, 6), L(0xe8365d), 3, 1.4, finalZoneZ);
const flame = add(
  sp(0.045),
  new THREE.MeshBasicMaterial({ color: 0xffc83c }),
  3,
  1.55,
  finalZoneZ,
);
[
  [-3, 0.3],
  [-2.2, 0.22],
  [-3.6, 0.2],
].forEach((g, i) => {
  box(g[1] * 2, g[1] * 2, g[1] * 2, cols[i + 1], g[0], g[1], finalZoneZ - 1);
  box(g[1] * 2.1, g[1] * 2.1, 0.08, 0xe8365d, g[0], g[1], finalZoneZ - 1);
});
// personnages
const OUT = [
  { t: 0xa9c4b4, l: 0x2c2a35, k: 0 },
  { t: 0xe5cfd6, l: 0x4a6a9a, k: 0 },
  { t: 0x2456b0, l: 0x4a6a9a, k: 1, g: 0x35504f },
  { t: 0xb7bcc9, l: 0x2c2a35, k: 0 },
  { t: 0x1a1a22, l: 0x4a6a9a, k: 1 },
  { t: 0x1d2b4b, l: 0, k: 2, g: 0x35504f },
];
function rp(p, w, h, r) {
  p.moveTo(-w / 2 + r, -h / 2);
  p.lineTo(w / 2 - r, -h / 2);
  p.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  p.lineTo(w / 2, h / 2 - r);
  p.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  p.lineTo(-w / 2 + r, h / 2);
  p.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  p.lineTo(-w / 2, -h / 2 + r);
  p.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  return p;
}
const GM = L(0x5a1a2e);
function mk(girl) {
  const g = new THREE.Group(),
    sk = L(girl ? 0xf3cdb0 : 0xd9a47c),
    top = L(girl ? 0x888888 : 0xc8c6c2),
    leg = L(girl ? 0x333333 : 0x4a6a9a),
    arm = L(girl ? 0x888888 : 0xd9a47c),
    hair = L(girl ? 0xcfa466 : 0x2a1e1a),
    dk = L(0x2a1a1a),
    ad = (a, b, x, y, z, p = g) => add(a, b, x, y, z, p);
  const legs = [-1, 1].map((s) => {
    const p = new THREE.Group();
    p.position.set(s * 0.12, 0.8, 0);
    g.add(p);
    ad(cy(0.1, 0.09, 0.8), leg, 0, -0.4, 0, p);
    ad(new THREE.BoxGeometry(0.2, 0.1, 0.3), L(0xf2efe9), 0, -0.82, 0.05, p);
    return p;
  });
  ad(cy(0.26, 0.3, 0.62), top, 0, 1.12, 0);
  const skirt = ad(cy(0.3, 0.5, 0.55), top, 0, 0.8, 0);
  skirt.visible = false;
  const arms = [-1, 1].map((s) => {
    const p = new THREE.Group();
    p.position.set(s * 0.36, 1.38, 0);
    g.add(p);
    ad(cy(0.075, 0.07, 0.3), top, 0, -0.15, 0, p);
    ad(cy(0.065, 0.06, 0.3), arm, 0, -0.45, 0, p);
    ad(sp(0.07), sk, 0, -0.62, 0, p);
    return p;
  });
  ad(
    new THREE.CircleGeometry(0.42, 16),
    new THREE.MeshBasicMaterial({ color: 0, transparent: true, opacity: 0.25 }),
    0,
    0.015,
    0,
  ).rotation.x = -Math.PI / 2;
  ad(cy(0.07, 0.07, 0.12), sk, 0, 1.46, 0);
  ad(sp(0.25), sk, 0, 1.72, 0).scale.y = 1.05;
  [-1, 1].forEach((s) => ad(sp(0.025), dk, s * 0.09, 1.74, 0.232));
  const m = ad(
    new THREE.TorusGeometry(0.065, 0.012, 6, 12, Math.PI),
    L(0xb0454f),
    0,
    1.69,
    0.232,
  );
  m.rotation.z = Math.PI;
  const cap = ad(
    new THREE.SphereGeometry(
      0.27,
      16,
      12,
      0,
      Math.PI * 2,
      0,
      Math.PI * (girl ? 0.55 : 0.45),
    ),
    hair,
    0,
    1.74,
    -0.02,
  );
  cap.rotation.x = -0.3;
  let nl = new THREE.Group();
  g.add(nl);
  if (girl) {
    ad(cy(0.26, 0.2, 0.6), hair, 0, 1.45, -0.1).scale.z = 0.6;
    [-1, 1].forEach((s) => {
      ad(new THREE.BoxGeometry(0.05, 0.42, 0.14), hair, s * 0.245, 1.55, 0.02);
      ad(
        new THREE.ExtrudeGeometry(
          rp(new THREE.Shape(), 0.2, 0.19, 0.05).constructor === 0
            ? 0
            : (() => {
                const s2 = rp(new THREE.Shape(), 0.2, 0.19, 0.05);
                s2.holes.push(rp(new THREE.Path(), 0.16, 0.15, 0.035));
                return s2;
              })(),
          { depth: 0.02, bevelEnabled: false },
        ),
        GM,
        s * 0.105,
        1.74,
        0.235,
      );
    });
    ad(new THREE.BoxGeometry(0.04, 0.02, 0.02), GM, 0, 1.76, 0.245);
    [-1, 1].forEach((s) => {
      const e = ad(
        new THREE.TorusGeometry(0.05, 0.01, 6, 12),
        L(0xe6b94a),
        s * 0.255,
        1.62,
        0,
      );
      e.rotation.y = Math.PI / 2;
      ad(sp(0.11), hair, s * 0.27, 1.3, -0.02);
      ad(sp(0.09), hair, s * 0.22, 1.15, -0.05);
    });
    ad(
      new THREE.TorusGeometry(0.07, 0.015, 6, 12),
      L(0xe6b94a),
      0,
      -0.55,
      0,
      arms[0],
    );
    ad(new THREE.BoxGeometry(0.3, 0.12, 0.1), hair, 0, 1.86, 0.2).rotation.x =
      0.5;
    [
      [-0.1, 1.36],
      [-0.05, 1.33],
      [0, 1.31],
      [0.05, 1.33],
      [0.1, 1.36],
    ].forEach((f, i) =>
      ad(
        sp(0.035),
        L([0xe6b94a, 0xf4e0c8, 0x3a6ea8, 0x7bc47b, 0xe6b94a][i]),
        f[0],
        f[1],
        0.245,
        nl,
      ),
    );
    nl.visible = false;
  } else {
    [-1, 1].forEach((s) => {
      const b = ad(
        new THREE.BoxGeometry(0.12, 0.025, 0.02),
        dk,
        s * 0.09,
        1.8,
        0.235,
      );
      b.rotation.z = -s * 0.1;
    });
    ad(new THREE.BoxGeometry(0.06, 0.04, 0.1), L(0x222222), -0.36, 0.72, 0);
  }
  return { g, legs, arms, top, leg, arm, skirt, nl };
}
const she = mk(true),
  him = mk(false);
scene.add(she.g, him.g);
him.g.position.set(0, 0, finalZoneZ);
she.g.position.set(0, 0, 2);
she.g.rotation.y = Math.PI;
let oi = 0;
function setO(i) {
  const o = OUT[i];
  she.top.color.setHex(o.t);
  she.leg.color.setHex(o.k == 2 ? 0xf3cdb0 : o.l);
  she.arm.color.setHex(o.k == 0 ? o.t : 0xf3cdb0);
  she.skirt.visible = o.k == 2;
  she.nl.visible = o.k == 1;
  GM.color.setHex(o.g || 0x5a1a2e);
}
setO(0);
// bulle
const bc = document.createElement("canvas");
bc.width = 512;
bc.height = 200;
const bq = bc.getContext("2d");
bq.fillStyle = "#fff";
bq.beginPath();
bq.roundRect(6, 6, 500, 150, 28);
bq.fill();
bq.beginPath();
bq.moveTo(230, 155);
bq.lineTo(256, 195);
bq.lineTo(282, 155);
bq.fill();
bq.fillStyle = "#c4506a";
bq.textAlign = "center";
bq.font = "bold 46px Georgia";
bq.fillText("Joyeux Anniversaire", 256, 70);
bq.fillText("Mon amour !!! ❤️", 256, 126);
const bub = new THREE.Sprite(
  new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(bc) }),
);
bub.scale.set(2.6, 1.02, 1);
bub.position.set(0, 3, finalZoneZ);
bub.visible = false;
scene.add(bub);
// cœurs
const hs = new THREE.Shape();
hs.moveTo(0, -0.4);
hs.bezierCurveTo(-0.6, 0.1, -0.3, 0.6, 0, 0.25);
hs.bezierCurveTo(0.3, 0.6, 0.6, 0.1, 0, -0.4);
const hg = new THREE.ExtrudeGeometry(hs, { depth: 0.2, bevelEnabled: false });
hg.scale(0.4, 0.4, 0.4);
hg.translate(0, 0, -0.04);
const hm = new THREE.MeshLambertMaterial({
    color: 0xff5d8a,
    emissive: 0x771133,
  }),
  hearts = [];
for (let i = 0; i < 14; i++) {
  const h = new THREE.Mesh(hg, hm);
  h.position.set(
    heartPositions[i][0],
    [1.1, 2, 1.6][i % 3],
    heartPositions[i][1],
  );
  scene.add(h);
  hearts.push(h);
}
// particules
const NP = 800,
  pp = new Float32Array(NP * 3),
  pc = new Float32Array(NP * 3),
  pv = [],
  pl_ = new Float32Array(NP);
let pi = 0;
for (let i = 0; i < NP; i++) {
  pp[i * 3 + 1] = -99;
  pv.push([0, 0, 0]);
}
const pg = new THREE.BufferGeometry();
pg.setAttribute("position", new THREE.BufferAttribute(pp, 3));
pg.setAttribute("color", new THREE.BufferAttribute(pc, 3));
const pts = new THREE.Points(
  pg,
  new THREE.PointsMaterial({ size: 0.22, vertexColors: true }),
);
pts.frustumCulled = false;
scene.add(pts);
function burst(x, y, z, n) {
  for (let k = 0; k < n; k++) {
    const i = pi++ % NP,
      c = new THREE.Color(cols[k % 5]);
    pp.set([x, y, z], i * 3);
    pc.set([c.r, c.g, c.b], i * 3);
    pv[i] = [
      (Math.random() - 0.5) * 5,
      Math.random() * 5 + 1,
      (Math.random() - 0.5) * 5,
    ];
    pl_[i] = 1.6;
  }
}
// contrôles
let jx = 0,
  jy = 0,
  jid = null,
  jump = false,
  yaw = 0,
  pit = 0.35,
  started = false,
  near = -1,
  got = 0,
  said = false;
const K = {};
const joy = $("joy"),
  kn = $("knob");
function mvj(e) {
  const r = joy.getBoundingClientRect(),
    dx = e.clientX - r.left - r.width / 2,
    dy = e.clientY - r.top - r.height / 2,
    l = Math.hypot(dx, dy),
    k = l ? Math.min(l, 45) / l : 0;
  jx = (dx * k) / 45;
  jy = (dy * k) / 45;
  kn.style.transform = "translate(" + dx * k + "px," + dy * k + "px)";
}
joy.onpointerdown = (e) => {
  jid = e.pointerId;
  joy.setPointerCapture(jid);
  mvj(e);
};
joy.onpointermove = (e) => {
  if (e.pointerId === jid) mvj(e);
};
joy.onpointerup = joy.onpointercancel = () => {
  jid = null;
  jx = jy = 0;
  kn.style.transform = "";
};
let lk = null;
renderer.domElement.onpointerdown = (e) => (lk = [e.clientX, e.clientY]);
renderer.domElement.onpointermove = (e) => {
  if (lk) {
    yaw -= (e.clientX - lk[0]) * 0.007;
    pit = Math.max(0.05, Math.min(1.1, pit + (e.clientY - lk[1]) * 0.004));
    lk = [e.clientX, e.clientY];
  }
};
renderer.domElement.onpointerup = () => (lk = null);
$("J").onpointerdown = (e) => {
  e.preventDefault();
  jump = true;
};
$("J").onpointerup = $("J").onpointercancel = () => (jump = false);
addEventListener("keydown", (e) => {
  K[e.key.toLowerCase()] = 1;
  if (e.key === " ") jump = true;
});
addEventListener("keyup", (e) => {
  K[e.key.toLowerCase()] = 0;
  if (e.key === " ") jump = false;
});
$("O").onclick = () => {
  oi = (oi + 1) % OUT.length;
  setO(oi);
  const p = she.g.position;
  burst(p.x, 1.2, p.z, 30);
  playEffect("wardrobe");
};
const pn = $("panel"),
  rd = $("read");
$("go").onclick = () => {
  $("intro").style.display = "none";
  started = true;
  playEffect("start");
  void startBackgroundMusic().catch((error) => {
    console.error("La musique de fond n'a pas pu démarrer.", error);
    toast("La musique n’a pas pu démarrer. Vérifie le volume de ton appareil.");
  });
};
$("close").onclick = () => (pn.style.display = "none");
function open() {
  const f = near === finalExhibitIndex,
    p = f ? FINAL_MESSAGE : EXHIBITS[near],
    im = $("pimg");
  $("ptitle").textContent = p.title;
  $("pmsg").textContent = p.message;
  if (f) im.style.display = "none";
  else {
    im.src = ARTWORKS[near];
    im.style.display = "block";
  }
  pn.style.display = "flex";
  const q = she.g.position;
  burst(q.x, 1.5, q.z, 40);
  playEffect("reveal");
  if (!f && !seen[near]) {
    seen[near] = 1;
    seenN++;
    toast("📷 Photo découverte ! " + seenN + "/" + EXHIBITS.length);
  }
}
rd.onclick = open;

imageCropOffsets.push(0.15, 0.2, 0.5, 0.75, 0.3, 0.1, 0.43);
function frameAt(i, x, z, ry) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = ry;
  scene.add(g);
  box(2.7, 2.1, 0.1, 0xb88a3c, 0, 1.9, 0, g);
  const tex = new THREE.Texture();
  tex.encoding = THREE.sRGBEncoding;
  const im = new Image();
  im.onload = () => {
    tex.image = im;
    const ia = im.width / im.height,
      pa = 4 / 3;
    if (ia < pa) {
      tex.repeat.set(1, ia / pa);
      tex.offset.y = (1 - ia / pa) * (1 - imageCropOffsets[i]);
    } else {
      tex.repeat.set(pa / ia, 1);
      tex.offset.x = (1 - pa / ia) * imageCropOffsets[i];
    }
    tex.needsUpdate = true;
  };
  im.src = ARTWORKS[i];
  add(
    new THREE.PlaneGeometry(3.6, 2.8),
    new THREE.MeshBasicMaterial({
      color: 0xffe9b0,
      transparent: true,
      opacity: 0.14,
    }),
    0,
    1.9,
    0.01,
    g,
  );
  box(0.5, 0.08, 0.2, 0xe8c36a, 0, 3.35, 0.12, g);
  add(
    new THREE.PlaneGeometry(2.4, 1.8),
    new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }),
    0,
    1.9,
    0.06,
    g,
  );
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 128;
  const q = c.getContext("2d");
  q.fillStyle = "#fffaf0";
  q.fillRect(0, 0, 512, 128);
  q.strokeStyle = "#b88a3c";
  q.lineWidth = 6;
  q.strokeRect(3, 3, 506, 122);
  q.fillStyle = "#4a2a2f";
  q.font = "italic 36px Georgia";
  q.textAlign = "center";
  q.fillText(EXHIBITS[i].title, 256, 76);
  const pt = new THREE.CanvasTexture(c);
  pt.encoding = THREE.sRGBEncoding;
  add(
    new THREE.PlaneGeometry(1.7, 0.425),
    new THREE.MeshBasicMaterial({ map: pt }),
    0,
    0.7,
    0.04,
    g,
  );
}
let fs = 0;
function playEffect(name, variation) {
  void playSoundEffect(name, variation).catch((error) => {
    console.error(`L’effet sonore « ${name} » n’a pas pu être joué.`, error);
  });
}
function updateAudioControls() {
  const muted = isAudioMuted();
  $("S").textContent = muted ? "🔇" : "🔊";
  $("menu-sound").querySelector("span").textContent = muted
    ? "Son coupé"
    : "Son activé";
  $("menu-sound").setAttribute("aria-pressed", String(!muted));
}
async function toggleSound() {
  try {
    await toggleAudio();
  } catch (error) {
    console.error("Le son n’a pas pu être activé.", error);
    toast("Le son n’a pas pu démarrer. Vérifie le volume de ton appareil.");
  }
  updateAudioControls();
}
$("menu-sound").onclick = toggleSound;
$("S").onclick = toggleSound;
function fw(x, y, z) {
  const c = new THREE.Color(cols[(Math.random() * 5) | 0]);
  for (let k = 0; k < 70; k++) {
    const i = pi++ % NP,
      a = Math.random() * 6.28,
      b = Math.acos(Math.random() * 2 - 1),
      s = 4 + Math.random() * 3;
    pp.set([x, y, z], i * 3);
    pc.set([c.r, c.g, c.b], i * 3);
    pv[i] = [
      Math.sin(b) * Math.cos(a) * s,
      Math.sin(b) * Math.sin(a) * s,
      Math.cos(b) * s,
    ];
    pl_[i] = 1.8;
  }
  playEffect("firework");
}
$("G").onclick = () => {
  playEffect("start");
  game();
};
function game() {
  const g = $("game");
  g.style.display = "block";
  g.innerHTML =
    '<div id="gs" style="position:absolute;top:50px;left:0;right:0;text-align:center;font-size:22px;color:#fff"></div>';
  let n = 0;
  const t0 = Date.now(),
    iv = setInterval(() => {
      const left = 20 - (Date.now() - t0) / 1000;
      if (left <= 0) {
        clearInterval(iv);
        fin();
        return;
      }
      $("gs").textContent =
        "Attrape les cœurs ! 💗 " + n + " · " + Math.ceil(left) + "s";
      const e = document.createElement("div");
      e.textContent = ["❤️", "💗", "💌", "🍕"][(Math.random() * 4) | 0];
      e.style.cssText =
        "position:absolute;top:-60px;font-size:46px;left:" +
        Math.random() * (innerWidth - 60) +
        "px;transition:top 3s linear";
      g.appendChild(e);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => (e.style.top = innerHeight + "px")),
      );
      e.onpointerdown = () => {
        n++;
        e.remove();
        playEffect("collect", n);
      };
      setTimeout(() => e.remove(), 3100);
    }, 400);
  function fin() {
    const w = n >= 15;
    g.innerHTML =
      '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:20px"><div class="box"><h2>' +
      (w ? "Bravo ! 🎉" : "Presque !") +
      "</h2><p>Score : " +
      n +
      "\n" +
      (w
        ? "🎁 Bon pour un dîner en amoureux, pizza incluse 🍕"
        : "Il faut 15 cœurs pour gagner ton cadeau. Réessaie !") +
      '</p><button class="main" id="gr">' +
      (w ? "Fermer" : "Rejouer") +
      "</button></div></div>";
    $("gr").onclick = () => {
      if (w) g.style.display = "none";
      else game();
    };
    if (w) {
      fw(playerPosition.x, 6, playerPosition.z - 8);
      fw(playerPosition.x + 4, 8, playerPosition.z - 9);
      playEffect("victory");
    }
  }
}
for (let i = 0; i < 14; i++) {
  const s = document.createElement("span");
  s.className = "floating-heart";
  s.textContent = ["💗", "💕", "✨", "🌸"][i % 4];
  s.style.left = i * 7 + "%";
  s.style.animationDelay = -i * 0.9 + "s";
  $("intro").appendChild(s);
}
const seen = [],
  mm = $("mm"),
  mq = mm.getContext("2d");
let seenN = 0;
$("hn").textContent = NAME;
function toast(t) {
  const e = document.createElement("div");
  e.className = "toast-message";
  e.textContent = t;
  $("toast").appendChild(e);
  setTimeout(() => e.remove(), 2600);
}
function ui() {
  const T = EXHIBITS.length;
  $("bf").style.width = (got / 14) * 100 + "%";
  $("hs").textContent = "💗 " + got + "/14  ·  📷 " + seenN + "/" + T;
  $("quest").textContent =
    seenN < T
      ? "🎯 Découvre toutes les photos (" + seenN + "/" + T + ")"
      : got < 14
        ? "🎯 Attrape tous les cœurs (" + got + "/14)"
        : "🎯 Rejoins-moi tout au bout du musée 🎁";
  mq.clearRect(0, 0, 80, 184);
  mq.fillStyle = "rgba(30,15,25,.6)";
  mq.fillRect(0, 0, 80, 184);
  mq.fillStyle = "#fff";
  walls.forEach((w) =>
    mq.fillRect((w[0] + 20) * 2, (8 - w[3]) * 2, (w[2] - w[0]) * 2, 2),
  );
  exhibitSpots.forEach((s, i) => {
    mq.fillStyle = seen[i] ? "#ffd36a" : "#fff";
    mq.fillRect((s[0] + 20) * 2 - 2, (8 - s[1]) * 2 - 2, 4, 4);
  });
  hearts.forEach((h) => {
    if (h.visible) {
      mq.fillStyle = "#ff5d8a";
      mq.fillRect(
        (h.position.x + 20) * 2 - 1,
        (8 - h.position.z) * 2 - 1,
        3,
        3,
      );
    }
  });
  mq.font = "12px serif";
  mq.fillText("⭐", 34, (8 - finalZoneZ) * 2 + 4);
  mq.save();
  mq.translate((playerPosition.x + 20) * 2, (8 - playerPosition.z) * 2);
  mq.rotate(she.g.rotation.y);
  mq.fillStyle = "#6ad4ff";
  mq.beginPath();
  mq.moveTo(0, -5);
  mq.lineTo(4, 4);
  mq.lineTo(-4, 4);
  mq.fill();
  mq.restore();
}
let vy = 0,
  py = 0,
  wt = 0,
  last = 0;
const playerPosition = she.g.position,
  V = new THREE.Vector3();
function frame(ts) {
  const dt = Math.min((ts - last) / 1000, 0.05);
  last = ts;
  const t = ts / 1000,
    run = started && pn.style.display !== "flex";
  let ix = jx + (K.d || K.arrowright ? 1 : 0) - (K.a || K.arrowleft ? 1 : 0),
    iy = jy + (K.s || K.arrowdown ? 1 : 0) - (K.w || K.arrowup ? 1 : 0);
  const il = Math.hypot(ix, iy),
    mov = run && il > 0.15;
  if (run) {
    if (mov) {
      const f = -iy,
        r = ix,
        dx = -Math.sin(yaw) * f + Math.cos(yaw) * r,
        dz = -Math.cos(yaw) * f - Math.sin(yaw) * r,
        l = Math.min(il, 1) / Math.hypot(dx, dz);
      {
        const nx = Math.max(
            -19.4,
            Math.min(19.4, playerPosition.x + dx * l * 4.2 * dt),
          ),
          nz = Math.max(
            -83,
            Math.min(7.2, playerPosition.z + dz * l * 4.2 * dt),
          );
        if (!hit(nx, playerPosition.z)) playerPosition.x = nx;
        if (!hit(playerPosition.x, nz)) playerPosition.z = nz;
      }
      let a = Math.atan2(dx, dz),
        d = a - she.g.rotation.y;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      she.g.rotation.y += d * Math.min(1, dt * 12);
      wt += dt * 9;
      if (Math.floor(wt / Math.PI) !== fs) {
        fs = Math.floor(wt / Math.PI);
        playEffect("step");
      }
    }
    if (jump && py === 0) {
      vy = 8;
      playEffect("jump");
    }
    py += vy * dt;
    vy -= 18 * dt;
    if (py <= 0) {
      py = 0;
      vy = 0;
    }
    hearts.forEach((h) => {
      if (
        h.visible &&
        Math.hypot(
          playerPosition.x - h.position.x,
          playerPosition.z - h.position.z,
        ) < 0.9 &&
        Math.abs(py + 1 - h.position.y) < 1
      ) {
        h.visible = false;
        got++;
        toast("💗 Cœur " + got + "/14");
        burst(h.position.x, h.position.y, h.position.z, 14);
        playEffect("collect", got);
        if (got === 14) {
          burst(0, 2, finalZoneZ, 100);
          toast("🎉 Tous les cœurs !");
          for (let k = 0; k < 5; k++)
            setTimeout(
              () =>
                fw(
                  (Math.random() - 0.5) * 14,
                  6 + Math.random() * 3,
                  finalZoneZ - 4,
                ),
              k * 500,
            );
        }
      }
    });
  }
  playerPosition.y = py;
  const s = mov ? Math.sin(wt) * 0.7 : 0;
  she.legs[0].rotation.x = s;
  she.legs[1].rotation.x = -s;
  she.arms[0].rotation.x = -s * 0.8;
  she.arms[1].rotation.x = s * 0.8;
  him.arms[1].rotation.z = 2.6 + Math.sin(t * 6) * 0.3;
  him.g.rotation.y = Math.atan2(
    playerPosition.x - him.g.position.x,
    playerPosition.z - finalZoneZ,
  );
  hearts.forEach((h, i) => {
    h.rotation.y = t * 2 + i;
    h.position.y += Math.sin(t * 3 + i) * 0.003;
  });
  bl.forEach((b, i) => (b.position.y = b.userData.y + Math.sin(t + i) * 0.15));
  flame.scale.setScalar(0.8 + 0.3 * Math.sin(t * 20));
  near = -1;
  let closestExhibitDistance = 3.4;
  exhibitSpots.forEach((s, i) => {
    const distance = Math.hypot(
      playerPosition.x - s[0],
      playerPosition.z - s[1],
    );
    if (distance < closestExhibitDistance) {
      near = i;
      closestExhibitDistance = distance;
    }
  });
  const nb = Math.hypot(playerPosition.x, playerPosition.z - finalZoneZ) < 5;
  if (nb) near = finalExhibitIndex;
  bub.visible = nb;
  if (nb && !said) {
    said = true;
    burst(0, 2, finalZoneZ, 80);
    playEffect("reveal");
    [0, 1, 2].forEach((k) =>
      setTimeout(() => fw((k - 1) * 5, 6, finalZoneZ - 3), k * 400),
    );
  }
  if (Math.hypot(playerPosition.x, playerPosition.z - finalZoneZ) > 9)
    said = false;
  rd.style.display = near >= 0 && run ? "block" : "none";
  rd.textContent = near === finalExhibitIndex ? "🎁 Mon message" : "💌 Lire";
  ui();
  for (let i = 0; i < NP; i++)
    if (pl_[i] > 0) {
      pl_[i] -= dt;
      pv[i][1] -= 7 * dt;
      pp[i * 3] += pv[i][0] * dt;
      pp[i * 3 + 1] += pv[i][1] * dt;
      pp[i * 3 + 2] += pv[i][2] * dt;
      if (pl_[i] <= 0) pp[i * 3 + 1] = -99;
    }
  pg.attributes.position.needsUpdate = true;
  pg.attributes.color.needsUpdate = true;
  const D = 4.2;
  V.set(
    playerPosition.x + Math.sin(yaw) * Math.cos(pit) * D,
    1.5 + py * 0.5 + Math.sin(pit) * D,
    playerPosition.z + Math.cos(yaw) * Math.cos(pit) * D,
  );
  for (let k = 0; k < 10 && hit(V.x, V.z, 0.35); k++) {
    V.x = playerPosition.x + (V.x - playerPosition.x) * 0.8;
    V.z = playerPosition.z + (V.z - playerPosition.z) * 0.8;
  }
  V.x = Math.max(-19.6, Math.min(19.6, V.x));
  V.z = Math.min(7.6, Math.max(-83.6, V.z));
  V.y = Math.max(0.5, Math.min(3.9, V.y));
  camera.position.lerp(V, Math.min(1, dt * 10));
  camera.lookAt(playerPosition.x, 1.4 + py * 0.5, playerPosition.z);
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
