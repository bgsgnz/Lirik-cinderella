/* ================= 1. LIRIK / TIMELINE (ISI SENDIRI) =================
   Tiap objek = satu "layar".
   d    : durasi (detik)
   type : "text" (default) | "carriage" (kuda+kereta) | "hand" (tangan) | "door" (pintu)
   rows : daftar baris; tiap baris = daftar [teks, warna]; segmen dalam satu baris dipisah spasi otomatis
   Ganti teks contoh di bawah dengan lirik yang kamu punya hak/izin untuk pakai. */
const Y = "#e8d44d", W = "#f2f2f2", P = "#c45bd0";
const LYRICS = [
  
  {d:3.3, rows:[[["CINDERELLA", Y]], [["MAC MILLER", W]]]},
  {d:0.80, rows:[]},                     
  {d:0.75, rows:[[["I Been Waitin'", W]]]},
  {d:1.29, rows:[[["All Night For", W]], [["This", Y]]]},
  {s:0.8, w:400, d:0.16, rows:[[["Moment", "#F70D1A"]]]},
  {s:1.7, w:800, d:0.205, rows:[[["Moment", "#1589FF"]]]},
  {s:1.0, w:500, d:0.195, rows:[[["Moment", "#8fd19e"]]]},
  {s:1.9, w:800, d:0.1, rows:[[["Moment", "#e0c820"]]]},
  {s:0.85, w:500, d:0.204, rows:[[["Moment", "#e07070"]]]},
  {s:1.4, w:700, d:0.096, rows:[[["Moment", "#c77dc4"]]]},
  {s:1.1, w:600, d:0.4, rows:[[["Moment", "#3C565B"]]]},
  {d:0.78, rows:[[["I Been Waitin'", W]]]},
  {d:1.22, rows:[[["All Year For", W]], [["This", W]]]},
  {s:1.0, w:500, d:0.2, rows:[[["Moment", "#F70D1A"]]]},
  {s:1.9, w:800, d:0.2, rows:[[["Moment", "#1589FF"]]]},
  {s:0.8, w:400, d:0.1, rows:[[["Moment", "#8fd19e"]]]},
  {s:1.5, w:700, d:0.2, rows:[[["Moment", "#e0c820"]]]},
  {s:1.1, w:600, d:0.226, rows:[[["Moment", "#e07070"]]]},
  {s:0.85, w:400, d:0.174, rows:[[["Moment", "#c77dc4"]]]},
  {s:1.6, w:800, d:0.3, rows:[[["Moment", "#3C565B"]]]},
  {d:0.20, rows:[]},
  {d:0.9, rows:[[["I Been", W]], [["Picturin'", W]]]},
  {d:1.1, rows:[[["You Takin'", W]], [["Off", W]]]},
  {d:0.9, rows:[[["Your Clothes", W]], [["For Me", Y]]]},
  {d:0.50, rows:[]},
  {d:1.065, rows:[[["I Been", W]], [["Literally", W]]]},
  {d:1.287, rows:[[["Curvin' All", Y]], [["These Hoes", W]]]},
  {d:0.928, type:"paper", w:700, rows:[[["For You", "#2a2a2a"]]]},
  {d:1.217, rows:[[["Daddy Told", W]], [["You, Better", W]]]},
  {d:1.716, rows:[[["Bring", W]], [["Your A** Home", W]]]},
  {d:0.43, type:"carriage", rows:[]},    
  {d:0.858, type:"carriage", rows:[[["Cinderella", Y]]]},
  {d:0.7, type:"carriage", rows:[[["Better Get", W]]]},
  {d:1.8, type:"carriage", rows:[[["Your A**", W]], [["Home", "#FF5F1F"]]]},
  {d:0.922, rows:[[["Man I'", W], ["Swear", Y]]]},
  {d:0.678, rows:[[["That", W]], [["Parents", W]]]},
  {d:1.467, rows:[[["Just", W], ["Dont", W]], [["Undesrtand", P]]]},
  {d:0.44, rows:[]},
  {d:1.394, rows:[[["You", P], ["Ain't", W]], [["Gotta Be", W]]]},
  {d:1.5, rows:[[["Old To Be", W]], [["A", W], ["Man", Y]]]},
  {d:0.30, rows:[]},
  {d:1.75, textDelay:.3, type:"hand",     rows:[[["Take My", Y], ["Hand", Y]]]},
  {d:1.65, textEnd:.4, type:"hand",     rows:[[["Come W", Y], ["Me", Y]]]},
  {d:1, rows:[[["To My", W]]]},
  {d:2.6,   type:"door",     rows:[[["ROOM", W]]]},
  {d:2.6, type:"album", delay:0.3, fade:0.45, out:0.25, rows:[]}, 
  {d:1.4, fadeIn:.45, fadeOut:.45, rows:[[["Wtf.Hexx", W]]]},  
];


const cv = document.getElementById("c"), ctx = cv.getContext("2d");
const buf = document.createElement("canvas"), b = buf.getContext("2d", {willReadFrequently:true});
let CELL = 6, cols, rows_;
const albumImg = new Image();
let albumReady = false, albumLo = null, doorLayer = null, doorCtx = null;
const ALBUM_GRID = 110; 
const ALBUM_SIZE = 0.94; 

albumImg.onload = () => {
  albumReady = true;
};

albumImg.onerror = () => {
  albumReady = false;
  console.warn("Foto album gagal dimuat.");
};

albumImg.src = (typeof ALBUM_SRC !== "undefined") ? ALBUM_SRC : "The Divine Feminine (2016) Mac Miller.jpg";


const handImgs = { L: new Image(), R: new Image() };
let handsReady = 0;
if (typeof HAND_DATA !== "undefined"){
  ["L", "R"].forEach(kk => { handImgs[kk].onload = () => { handsReady++; }; handImgs[kk].src = HAND_DATA[kk].src; });
}

function resize(){
  const dpr = Math.min(devicePixelRatio || 1, 2);
  cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
  CELL = (innerWidth < 600 ? 4 : 5) * dpr;
  cols = Math.floor(cv.width / CELL); rows_ = Math.floor(cv.height / CELL);
  buf.width = cols; buf.height = rows_;
}
addEventListener("resize", resize); resize();

const hash = (x, y) => { let h = (x * 374761393 + y * 668265263) | 0; h = (h ^ (h >> 13)) * 1274126177; return ((h ^ (h >> 16)) >>> 0) / 4294967295; };
const ease = t => t < .5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2) / 2;
const clamp = (v, a=0, z=1) => Math.max(a, Math.min(z, v));


function drawText(rows, cy, outline, maxH, opt){
  opt = opt || {};
  let fs = cols * 0.15 * (opt.s || 1);   /* opt.s = pengali ukuran huruf (1 = normal) */
  if (maxH) fs = Math.min(fs, maxH / (rows.length * 1.2)); /* batasi tinggi blok teks */
  const rowW = () => Math.max(...rows.map(r => b.measureText(r.map(s => s[0]).join(" ")).width));
  const FW = opt.w || 600; /* ketebalan huruf: 400 tipis, 500 sedang, 600 agak tebal, 700 tebal, 800 sangat tebal (opt.w mengganti per layar) */
  b.font = `${FW} ${fs}px Montserrat, system-ui, sans-serif`;
  while (rowW() > cols * 0.88 && fs > 6){ fs -= 1; b.font = `${FW} ${fs}px Montserrat, system-ui, sans-serif`; }
  const lh = fs * 1.2, top = cy - (rows.length * lh) / 2 + lh / 2;
  b.textBaseline = "middle"; b.textAlign = "left";
  rows.forEach((r, i) => {
    const gap = b.measureText(" ").width;
    const ws = r.map(s => b.measureText(s[0]).width);
    let x = (cols - (ws.reduce((a, c) => a + c, 0) + gap * (r.length - 1))) / 2;
    r.forEach((s, k) => {
      if (outline){ b.lineWidth = Math.max(1.5, fs * .06); b.strokeStyle = "#1a1200"; b.strokeText(s[0], x, top + i * lh); }
      b.fillStyle = s[1]; b.fillText(s[0], x, top + i * lh);
      x += ws[k] + gap;
    });
  });
}

/* --- sprite pixel: kuda & kereta bawaan (cadangan) --- */
const R = (x, y, w, h, c, o) => { b.fillStyle = c; b.fillRect(Math.round(o.x + x * o.s), Math.round(o.y + y * o.s), Math.max(1, Math.round(w * o.s)), Math.max(1, Math.round(h * o.s))); };

function horse(o, t){
  const c = "#f4f4f4", sh = "#b9b9c4";
  R(0, 6, 14, 6, c, o); R(12, 1, 4, 8, c, o); R(14, 0, 5, 3, c, o); R(17, 2, 4, 3, c, o);
  R(14, -1, 1, 2, c, o); R(11, 1, 1, 7, sh, o);
  R(-3, 6, 3, 2, sh, o); R(-4, 8, 2, 5, sh, o);
  const legs = [[12, 0], [9, Math.PI], [4, Math.PI * .5], [1, Math.PI * 1.5]];
  legs.forEach(([lx, ph]) => {
    const sw = Math.sin(t * 9 + ph) * 2.2, lift = Math.max(0, Math.cos(t * 9 + ph)) * 1.2;
    R(lx, 12, 2, 3, c, o);
    R(lx + sw * .6, 15 - lift, 2, 4, sh, o);
  });
}
function carriage(o, t){
  R(0, 3, 17, 9, "#d94f7b", o); R(-1, 1, 19, 2, "#f2c14e", o);
  R(3, 5, 4, 4, "#ffe9a8", o); R(10, 5, 4, 4, "#ffe9a8", o); R(0, 11, 17, 1, "#f2c14e", o);
  [[3, 0], [14, 1]].forEach(([wx]) => {
    const cx = o.x + (wx + .5) * o.s, cy = o.y + 14 * o.s, r = 3.2 * o.s;
    b.strokeStyle = "#f2c14e"; b.lineWidth = Math.max(1, o.s * .8);
    b.beginPath(); b.arc(cx, cy, r, 0, 7); b.stroke();
    for (let k = 0; k < 4; k++){ const a = t * 9 + k * Math.PI / 2; b.beginPath(); b.moveTo(cx, cy); b.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); b.stroke(); }
  });
}
function hand(o, t, curl){
  const sk = "#e9b878", dk = "#b9803f";
  R(-34, 4, 34, 6, sk, o); R(-34, 9, 34, 1, dk, o);
  R(0, 2, 9, 8, sk, o);
  for (let i = 0; i < 4; i++){
    const w = Math.sin(t * 5 + i) * .8 * curl;
    R(9, 2 + i * 2, 7 - i * .6 + w, 1.8, sk, o);
  }
  R(2, -1, 5, 3, sk, o); R(0, 9, 9, 1, dk, o);
}
/* ===== PINTU besi lengkung warna biru (model dari foto referensi) =====
   Tekstur digambar SEKALI ke canvas: F = rangka (lengkung + panel hias + kaca samping), L = dua daun pintu.
   Lalu daun pintu diayunkan per kolom (perspektif), rangka diam. */
const DOOR_TW = 300, DOOR_TH = 400;
let doorTex = null;
function buildDoorTex(){
  const ax = 1;                                                  /* tekstur tidak diregangkan: proporsi pintu asli 3:4 */
  const mk = () => { const c = document.createElement("canvas"); c.width = Math.round(DOOR_TW * ax); c.height = DOOR_TH; return c; };
  const BL = "#2b7bbf", BH = "#58aef0", BD = "#133f66", GL = "#a9baa8", PI = Math.PI;
  const F = mk(), L = mk(), f = F.getContext("2d"), l = L.getContext("2d");
  f.scale(ax, 1); l.scale(ax, 1);
  const arch = (g, x0, x1, cy, yb) => { const r = (x1 - x0) / 2; g.beginPath(); g.moveTo(x0, yb); g.lineTo(x0, cy); g.arc((x0 + x1) / 2, cy, r, PI, 2 * PI); g.lineTo(x1, yb); g.closePath(); };
  /* garis besi tempa: kontur gelap, badan biru, kilau tipis */
  const iron = (g, path, w) => {
    g.lineCap = "round"; g.lineJoin = "round";
    g.strokeStyle = BD; g.lineWidth = w + 3; path(); g.stroke();
    g.strokeStyle = BL; g.lineWidth = w; path(); g.stroke();
    g.strokeStyle = BH; g.lineWidth = Math.max(1, w * .28); g.translate(-.9, -.9); path(); g.stroke(); g.translate(.9, .9);
  };
  const spiral = (cx, cy, r0, turns, dir, a0) => () => { const g = spiral.g; g.beginPath(); for (let i = 0; i <= 40; i++){ const t = i / 40, r = r0 * (1 - .88 * t), a = a0 + dir * t * turns * 2 * PI, x = cx + r * Math.cos(a), y = cy + r * Math.sin(a); i ? g.lineTo(x, y) : g.moveTo(x, y); } };
  const curve = (pts) => () => { const g = spiral.g; g.beginPath(); g.moveTo(pts[0], pts[1]); g.bezierCurveTo(pts[2], pts[3], pts[4], pts[5], pts[6], pts[7]); };
  const sp = (g, cx, cy, r, turns, dir, a0, w) => { spiral.g = g; iron(g, spiral(cx, cy, r, turns, dir, a0), w); };
  const cv = (g, pts, w) => { spiral.g = g; iron(g, curve(pts), w); };
  const noise = (g, x0, y0, x1, y1, n, seed) => { for (let i = 0; i < n; i++){ g.fillStyle = hash(i, seed + 9) > .5 ? "rgba(255,255,255,.22)" : "rgba(50,75,55,.22)"; g.fillRect(x0 + hash(i, seed) * (x1 - x0), y0 + hash(i, seed + 3) * (y1 - y0), 2 + hash(i, seed + 5) * 3, 2 + hash(i, seed + 7) * 3); } };

  /* ---------- RANGKA ---------- */
  arch(f, 0, 300, 150, 400); f.fillStyle = BL; f.fill();
  f.strokeStyle = BD; f.lineWidth = 3; f.stroke();
  arch(f, 9, 291, 150, 400); f.strokeStyle = BD; f.lineWidth = 2; f.stroke();
  f.fillStyle = "#1d609c"; f.fillRect(0, 385, 300, 15);                 /* ambang bawah */
  /* 5 panel hias di lengkungan atas */
  for (let i = 0; i < 5; i++){
    const th = PI * (1 - (i + .5) / 5), r = 122;
    f.save(); f.translate(150 + r * Math.cos(th), 150 - r * Math.sin(th)); f.rotate(PI / 2 - th);
    f.beginPath(); f.rect(-31, -18, 62, 36); f.fillStyle = GL; f.fill(); f.save(); f.clip(); noise(f, -31, -18, 31, 18, 60, 40 + i); 
    sp(f, -13, 0, 9, 1.5, 1, 0, 2.6); sp(f, 13, 0, 9, 1.5, -1, PI, 2.6); cv(f, [-22, 10, -8, 8, 8, 8, 22, 10], 2.4);
    f.restore(); f.strokeStyle = BD; f.lineWidth = 3; f.strokeRect(-31, -18, 62, 36); f.restore();
  }
  /* kaca samping kiri & kanan, dengan rantai ukiran */
  [22, 252].forEach((sx, si) => {
    f.save(); f.beginPath(); f.rect(sx, 165, 26, 212); f.fillStyle = GL; f.fill(); f.clip(); noise(f, sx, 165, sx + 26, 377, 90, 70 + si);
    cv(f, [sx + 13, 165, sx + 13, 230, sx + 13, 300, sx + 13, 377], 2.6);
    for (let k = 0; k < 5; k++){ spiral.g = f; iron(f, () => { f.beginPath(); f.arc(sx + 13, 190 + k * 40, 7, 0, 2 * PI); }, 2.6); }
    f.restore(); f.strokeStyle = BD; f.lineWidth = 3; f.strokeRect(sx, 165, 26, 212);
  });
  /* lubang tempat daun pintu */
  f.globalCompositeOperation = "destination-out"; arch(f, 51, 249, 150, 385); f.fill(); f.globalCompositeOperation = "source-over";
  arch(f, 51, 249, 150, 385); f.strokeStyle = BD; f.lineWidth = 2; f.stroke();

  /* ---------- DAUN PINTU ---------- */
  arch(l, 51, 249, 150, 385); l.fillStyle = BL; l.fill(); l.strokeStyle = BD; l.lineWidth = 3; l.stroke();
  /* kaca + ukiran besi (kiri digambar, kanan = cerminan) */
  l.save(); arch(l, 60, 240, 150, 284); l.fillStyle = GL; l.fill(); l.clip(); noise(l, 60, 60, 240, 284, 380, 11);
  const scrolls = g => {
    cv(g, [146, 282, 100, 262, 66, 210, 78, 150], 4.6);
    cv(g, [78, 150, 86, 112, 120, 92, 142, 66], 4.2);
    cv(g, [146, 250, 118, 236, 104, 222, 112, 205], 3.6);
    sp(g, 92, 248, 22, 1.7, -1, 0.3, 4.4);  sp(g, 114, 204, 17, 1.6, 1, PI, 4);
    sp(g, 76, 184, 18, 1.7, -1, 0.6, 4);    sp(g, 99, 141, 15, 1.5, 1, PI * .8, 3.8);
    sp(g, 124, 103, 12, 1.5, -1, 0, 3.4);   sp(g, 71, 118, 11, 1.4, 1, PI / 2, 3.4);
    g.fillStyle = BD; g.beginPath(); g.ellipse(112, 270, 15, 6, -.5, 0, 2 * PI); g.fill();
    g.fillStyle = BL; g.beginPath(); g.ellipse(112, 270, 12, 4, -.5, 0, 2 * PI); g.fill();
  };
  scrolls(l);
  l.save(); l.translate(300, 0); l.scale(-1, 1); scrolls(l); l.restore();
  l.restore();
  arch(l, 60, 240, 150, 284); l.strokeStyle = BD; l.lineWidth = 3; l.stroke();
  /* tiang tengah & palang bawah kaca */
  l.fillStyle = BL; l.fillRect(146, 52, 8, 333); l.fillStyle = BD; l.fillRect(146, 52, 1.5, 333); l.fillRect(152.5, 52, 1.5, 333);
  l.fillStyle = BL; l.fillRect(58, 284, 184, 12); l.fillStyle = BD; l.fillRect(58, 284, 184, 1.5); l.fillRect(58, 295, 184, 1.5);
  /* panel bawah timbul */
  [[66, 76], [158, 76]].forEach(([x, w]) => {
    l.fillStyle = "#1f68a6"; l.fillRect(x, 304, w, 70); l.strokeStyle = BD; l.lineWidth = 2.5; l.strokeRect(x, 304, w, 70);
    l.fillStyle = BL; l.fillRect(x + 8, 312, w - 16, 54);
    l.fillStyle = BH; l.fillRect(x + 8, 312, w - 16, 2.5); l.fillRect(x + 8, 312, 2.5, 54);
    l.fillStyle = BD; l.fillRect(x + 8, 363.5, w - 16, 2.5); l.fillRect(x + w - 10.5, 312, 2.5, 54);
  });
  doorTex = { F, L, ax, key: cols + "x" + rows_ };
}
function doorGeom(){   /* pintu proporsional 3:4 (tidak diregangkan), diperbesar sampai MENUTUP SELURUH layar; kelebihannya terpotong di tepi */
  const s = Math.max(cols / DOOR_TW, rows_ / DOOR_TH);
  const DW = Math.round(DOOR_TW * s), DH = Math.round(DOOR_TH * s);
  return { DW, DH, x0: Math.round((cols - DW) / 2), y0: Math.round((rows_ - DH) / 2) };
}
function doorFrame(B){
  if (!doorTex || doorTex.key !== cols + "x" + rows_) buildDoorTex();
  const G = doorGeom(); B.imageSmoothingEnabled = true; B.imageSmoothingQuality = "high";
  B.drawImage(doorTex.F, G.x0, G.y0, G.DW, G.DH);
}
function doorAll(angle, B){ doorFrame(B); door(true, angle, B); door(false, angle, B); }

/* satu daun pintu berayun pada engsel di tepi luarnya (angle 0 = tertutup) */
function door(left, angle, B = b){
  if (!doorTex || doorTex.key !== cols + "x" + rows_) buildDoorTex();
  const G = doorGeom(), k = G.DW / DOOR_TW, leafTW = 99, leafW = leafTW * k;
  const wp = Math.round(leafW * Math.cos(angle)), sn = Math.sin(angle);
  if (wp < 1) return;
  const hsAt = t => 1 - .24 * sn * t;                       /* sisi bebas lebih pendek: pintu membuka menjauh */
  const hingeTX = left ? 51 : 249, hingeX = Math.round(G.x0 + hingeTX * k);
  B.imageSmoothingEnabled = true; B.imageSmoothingQuality = "high";
  for (let px = 0; px < wp; px++){
    const t = px / wp, h = G.DH * hsAt(t), top = G.y0 + (G.DH - h) / 2;
    const X = left ? hingeX + px : hingeX - 1 - px;
    const sx = left ? hingeTX + t * leafTW : hingeTX - (t + 1 / wp) * leafTW;
    B.drawImage(doorTex.L, sx * doorTex.ax, 0, leafTW / wp * doorTex.ax, DOOR_TH, X, top, 1, h);
  }
  /* gagang tuas (bentuk TIDAK diubah); hanya posisinya mengikuti model pintu baru */
  const t = .86, hs = hsAt(t), f = Math.max(.35, wp / leafW);
  const R = Math.max(2.4, Math.min(cols, rows_ * .9) * .019) * hs, px = wp * t;
  if (px < R * 2.5) return;
  const cx = left ? hingeX + px : hingeX - px, cy = G.y0 + G.DH / 2 + (.66 - .5) * G.DH * hs, toHinge = left ? -1 : 1;
  const rx = R * f, thick = R * .55;
  const L = Math.min(R * 5 * f, px - rx * .5);                      /* panjang tuas, tidak melewati engsel */
  /* bayangan tuas & rosette */
  B.fillStyle = "#3a2810";
  B.fillRect(toHinge > 0 ? cx : cx - L, cy - thick * .35 + R * .25, L, thick);
  B.beginPath(); B.ellipse(cx, cy + R * .25, rx * 1.1, R * 1.1, 0, 0, 7); B.fill();
  /* tuas: badan, sisi atas terang, sisi bawah gelap */
  const lx = toHinge > 0 ? cx : cx - L;
  B.fillStyle = "#b99a58"; B.fillRect(lx, cy - thick / 2, L, thick);
  B.fillStyle = "#f3e8c4"; B.fillRect(lx, cy - thick / 2, L, Math.max(1, thick * .35));
  B.fillStyle = "#7a5f2c"; B.fillRect(lx, cy + thick * .2, L, Math.max(1, thick * .3));
  B.fillStyle = "#e6d49a"; B.beginPath(); B.ellipse(toHinge > 0 ? cx + L : cx - L, cy, Math.max(1, thick * .45 * f), thick / 2, 0, 0, 7); B.fill(); /* ujung tuas bulat */
  /* rosette: cincin terang, bagian dalam gelap, titik kilau di tengah */
  B.fillStyle = "#f4ead0"; B.beginPath(); B.ellipse(cx, cy, rx, R, 0, 0, 7); B.fill();
  B.fillStyle = "#8a7040"; B.beginPath(); B.ellipse(cx, cy, rx * .72, R * .72, 0, 0, 7); B.fill();
  B.fillStyle = "#d8c283"; B.beginPath(); B.ellipse(cx, cy, rx * .5, R * .5, 0, 0, 7); B.fill();
  B.fillStyle = "#fffbe8"; B.beginPath(); B.ellipse(cx - rx * .15, cy - R * .2, rx * .18, R * .18, 0, 0, 7); B.fill();
  /* lubang kunci kecil di bawah rosette */
  const ky = cy + R * 2.4;
  B.fillStyle = "#e8d9a8"; B.beginPath(); B.ellipse(cx, ky, rx * .42, R * .42, 0, 0, 7); B.fill();
  B.fillStyle = "#1a1200"; B.beginPath(); B.ellipse(cx, ky, rx * .16, R * .16, 0, 0, 7); B.fill();
  B.fillRect(cx - rx * .05, ky, Math.max(1, rx * .1), R * .3);
}

/* ===== DATA SPRITE KUDA+KERETA (dari video), jangan diubah ===== */
const CAR_W=112, CAR_H=42;
const CAR_PAL=["#fdfdfd", "#ecedeb", "#ddddda", "#cfcdcb", "#c2bfbd", "#b2b2af", "#a3a29d", "#93918b", "#57a1aa", "#7e807a", "#6d6f65", "#903854", "#5b5d53", "#276165", "#4a4b42", "#621324"];
const CAR_FRAMES=[
".112|.81jdo.28|.82m.29|.81cm2.28|.81h.30|.81o.e.28|.80jhcb.28|.81jdj.28|.81hce.28|.81ca2.f.26|.78kaoeaema.26|.79h.ok.o.27|.17m.61kcg.3g.26|.17jda2fkm.51cd.2bh.bkc2mcm.23|.17da6h.49da3j.2o2aoabkfam.21|.17a2bda4dj.46a2fm.2p2.omjdbdkda.21|.4c2dae.7fa2fhfgca3b.41d.2a2ek.2pl2p.oakaedhcb.20|.4a6e.5jcfh6ca3f.38oa.ba2km.l2pl2pmdocdfgfa2.19|.3fa2dca3cm.3e2f2jkfhjgba3e.37bgoa2e.o.l2.l2pomkfbfefgao.18|.3a2ejgf2da2dm.ab2f.oefcb2a4cmj.34ajea2mop3.2l2plkjkbf2g.ac.18|.3fhj2kjh3bacdaef.3ha4dca5ceh.19d.10jafdbc.k.pl.3lplmehbegdma2.18|.3k2gjoh2jhdcb3ej.4a2cbed3a6ca3g.5ojm.5oa.10aedcac.gp2.4p2lofhbegbmea.18|.2bad2o.hgdc3d2ecf.4hbd4ecbc2dcba13jbc.2ac.9gamcdac2kpl.5lombhcega.hae.17|.2a2jo.3eabcefdeca3d.fcded3ae3d3cd3c5bc2ba3dcaea2.7ad.c2aje.l2.5p.kajbega.gae.17|.2abm.4eacdfe3dba2c3d5cbed9c2d2c3ed2ca2cbjmcajkg3a2.2acaof.lp.4lpkfbocdea.fag.17|.2a2.6cbefef2cefed7ede2d3ed2ba8cd2b2ac2g.3ja6f.2a3.fop.5p2kcbocdca.f2.18|.2eh.6haef3ede8d2ed2ed6cadgc4e2cb3c2ej.5g2.6a2bkjkhkhghf2lodbkbcde.jo.2o.12mo.|.11acefec4efede5d2cb2d3edbah2m.jfba4cakf.13jabgh2ecbcfdm.mbdhbdjo2khm.2o.9o.4|.11kbe3c4e7caba2e2dedcba2cjk.2kjb2e3hoh.14a2dhac.j2.adgcahfbkm.j3.18|.12adefdcd2cdfe3da2g3jfe2cb2a2ego.2hj.o.2ok2h3o.11ba2.a2.pl.a2eb2ofhom2jbm.18|.12ace2bgkecfe2cb2dghghkdcdb3adhem.2caefo2jo.o2m.kj.9cegmfa.p3achc2mjmokhdg.10m2.7|.12faecdjkd2e2cbdfhgfh.2dbecb3hgdk.2ka2hoko2jm2j.3j.7g.jeh2al.peacebfom2jg2f.11o2.7|.12obd3gjgcdbdhg4k.3cbdcadgjhem.3bgkmjk.hmofh.3j.ga2.m.3kdjfe.habch2m.m2fm.14o.7|.13fdech3dbdghfgj.5fa2dgh2j2fkj.2mkjk2.ojmokd.4j2b3j.4i4hg2jh2mino.n.14o.8|.13d4hg2e2ghjk.7oa2gjg2okgme.3jkhk.k.2kme.4em.hf2g.3n3i2keh3kinm.2n.13j.5fk.|.12fbcbdjm.3o2.10cdhg2j.j2mg2.2oheh.k.2omgj.3fk.2o.2gjfin3i2bn2i2nm.8k2.6oj.4odm.|.11cacf2k.14o.2odfgj.2k.k2f.k.mf2mk.4kf.3km.7hfm.jfo.ni3no.3k.3kdek.6h.5k.2|.10babgh.5ka.7kj.5cgj.m.2m2g.j.2ojkg.2o.2ef.3o.2m.5oho2.4n.njmgjg.4fhe.7g.8|.9cafjm.2m2.2g2.7em.5gehok.3kej2.3kho.j2o.cf.6k.o.3fam.5m.2m.8dfgo.6g.8|.8acj.5cm.2ao.6of.7cfh2.4fjk.4ko.ah2.jfm.5j.6o.2o.mjk.11kgo.7j.8|.7jc.7f.3a.7jf.7md2h.5mgk.3mjoaeg.2kj.2o.2f.44|.7e.8k.2cj.7fg.9mo.6h2.2okj.kjo.54",
".112|.81hd.29|.82m.29|.81amk.28|.81g.30|.81o.d.28|.80h2cb.28|.81jck.28|.81gbe.28|.81ca2.d.26|.78japdafka.26|.79h.ok.o.27|.79jcf.2og.26|.16f.bagmk.52ac.2bh.bkc2mcm.23|.16a7f.50ca3j.2o2aoabkfak.21|.15ga3ca5d.47a2gm.2p2.omhdbdjea.21|.2kmgcbd.7babg2fgda4d.43ma2fm.2lplp.mamad2hb2o.19|.2jea5e.5fcgh2gh3fa4j.41a3km.l2.l2pkdoc2egea2.19|.2a3fca4do.2dgf2jkfh2ea5ho.38ja2f.o.l2.hlpomkgafefgam.18|.2a2fjge2fba2mhafcg.2dfca2cdba3gh.36a3mo.p2.2l2plkjkbf3.ab.18|.2bg2j2hj2hca3bef.3ja3bec2ba4d2k.32ka2c.k.pl.3lplmehbefdma2.18|.2j2fjoghj2c2b2cdm.4bac2dceda7ca3o.hcad2mkh2m.mcabo.10ba2cogpl.4p2lodhbdgbmeao.17|.oade.2jfdc2ded3bam.3acd3ecabdedb2a16bcba4m.8abadbkpl.5lo2agcegb.had.17|.2ah.4dabcdfdfca4hkcd4ecbcd4cdcdc2b2c3dcd3abo.3ea3.6macaje.l2.5l.makbega.gad.17|.2ak.4hace2fefdcbac4ed4cded3ed4bcbc2ace2dc2abo.4mca2h.3jfada.d.lp.4lpkfb.cdea.gae.17|.2a.6eadfefede2fed4ed2e2d9cbhmkfdab5abhoj.4kba5fb2a.eop.5p2mcaobeda.fak.17|.2c.7acef2ec2e3d2ede2d2e2d8c2j2km2fba2babcfe2h.5oebg2.babmjkgjhfhe2lodajcedb.ch.18|.10ebdf2ecbcd2ede4dc2babcd2ecb2ah2g2jmj2dbabc2dak.11jabgh2ecbcfdm.mbdhc2dcmgjk.mj.9m.4|.11acefec4e5dcb2abe2cd2eb2a2ghk2hdfkmhcacfjh.13a2dgac.j2.aefcahgbcgjmjm.4kg.5k.6|.11acefdbdfce4dba2fg2h2ed2cb2aeg2.3ba2e.okjk3.13ba2.ab.pl.a2eb2.gbgk.me.7gk.2k.7|.11abdfdch2dfedbacfghghghdab3abhgf.3hca2m2.kjm2kjmk.9gdgmfa.p3achc2ofdkmjgh.8g.m.8|.11oaded2jgcedb2fghg2hmkjcab3afjf2o.3fbgkgm.jfkg.2ob.7o.feh2al.peacecf.hjmkhj.10jm.8|.12b2edehjecbfh2g3j.4cabacghjgfj.4khg2m.kgjh2.3e.fa2.m.3jdje2.habchjkojko.13oh.8|.12jbfd2jhge2ghg2jo.5hcbdh3j2fjh.3ok3mkj2kogej.2gjab2j.4iji2hg2jh2oinjmo.13kg.8|.13bdbfhg2fgjkmo.8hcehg2okfjfk.2k.2mk2jhm.2hch.cm.hef2o.2n3i2kdj2hninj.2n.13m.4of.2|.13b2chk.16j2f3h.mfj2d.k.4khgj.4fdm2j.2m.2gkfin3i2bn2i2n2k.14o.2o.3fem.|.12kbdfk.15m2o.mhjk.jejmh2d.5km.6fg.h.7g2m.hfo.ni3.2m.2m2.3kg2.4m.2j.3fe.2|.12gaej.4k.4mj.4o2m2.3omkgfk.2mke.7o.o.2mo.jo.m.6gko.4k.njm3go.3k2g2.7j.4m.2|.12eafk.2omk.3obc.7m.4kjfh.4kck.5dfh.m.3dok.3k.4bm.5f.3jm.6kged.5o.k.7|.12deh.3om3.3cm.7o2.4h2j.3hohc.4hgeg.m.3agj.o.13d.3jo.7cbc.15|.11odg.6o.3od.7mom.9mh.2f2.3mdcj.2k.2mghkg.13j.30|.11ofj.10mh.17o.2h.3ao.4jo.54",
".112|.81gd.29|.82m.29|.81bmk.28|.81g.30|.81o.e.28|.80h2cb.28|.81hcm.28|.81gcf.28|.81cab.g.26|.78hapdagka.26|.79g.mk.k.27|.79heg.2mh.26|.16cma3gk.52bd.objocmbekco.23|.16a8o.49ba3k.2omamackfao.21|.2m.12ga2bca5e.47a2hm.2p2.mk2bcekca.21|.2gca4f.6babghghea4.44ka2fm.2lplp.majae2had.20|.2hbaba3cm.4hfgh2g2j2fa4.42a3m2.l2.lp2kdocdfgfa2.19|.2a2bgdba4.3egegmhfhgfa5o.39fa2g.3l2.glpojmebfegea.19|.jcdfj2g3a3jfabck.odebabcda3jhj.36a2bom.p2.2l2pmhmhbgehoae.18|.ohjfj2hjkjba3dh.4ha2b2ecba5faf.7ma2j.ojg.2ad2ak.10oa2e.k.p2.3lpljg2cfgema2.18|.mghfjmghjhc3bceo.4a2fcdefcba3ba2ba8ba5dcac2a3h.8a3eohp2.4p2lkgfbegboba.18|.dbfj.2f2bc2de3a2.4gadede2bce3d3b7cded5ab.4ea3.7abadckp2.4p2ojdgcfga.fah.17|.ec.5cac2e2dfca4mhde2de2bcde3d3ec3b2cbefed2eac.6ga2.6acakd.lp.4p2.hbjbeha.eah.17|.fc.5gae2f4dbab3cde6f2ede5beo.2fc7abe.6ma2k.4aca.a.l.5lpjfcmcdfa.dak.17|.jg.6abf4edf3ede3de3fe7febgk3mofcb5edo.7dag.3aba.ap2.5p2kc2mceda.ej.18|.9dadf3ed2f2e9fcb2de3cdb2hef2hokhdbadhck.8eadacb2a.gkhkjhjegloc2jcecb.kf.2o.jco.11|.10bcef2dc3de2f2e2dba2bgdcefeb3ajhjhgcfomgag2eh.9ogcbfbajfhdcbcfco.hafgcbek2ogo.5mh.10|.10jadfe2c2d2efe2f2cbf2gjhcde2cbacgk.2ocabm.f2bhj.11oh.a2f2ac.fo.afhbakfcdo2kaj.7og.4odbj.|.11ade2fced2efecabcgh3ghcac2bacgej.3kdba.m.kjem2o.11cac.ae.pl.abebc.dcg.ofa.2o.7j.2o.5|.11acef2cfecfedbadghfhmhgea2b2ch2fd.4kecjg2.3o.ojo.8mdehmfd.p2lachcd.dekjkcg.10k.o.6|.11faefd3ed2c2fh2g3o.2ofdcabghjhc.6kemj.h.mo.om2.6mj.gfh2ap.pdaceajmhjo3m.4m.7f.7|.12abef2dh2ecg2hg2m.5ofgegh3kb.6go.2mehfdfg.2j.a2b.m.3hdjeh.fabcjhmokmk.2m.4o.7h.7|.12hae4ghgeghgho.8hdfefj.fg.4fj.4hegjfd.3mha2cm.4gkj2hg2h2jmknmho.15o.7|.13d2cdghkmkjmo.9o.hfefkohed.3e.7j.keg.2j.2fgdjm.2n4ikeh2j2inkh.o.15m.6|.13oabgj.12j.ok2o.4oje2dch2e.ok.7fa.2gm.5gocin3i2bn2i2n2h.7kbh.8m.3f.2|.14dehj.10jmh.2mk2.5mcdg2hg.11odh.2h.5k.dgo.fg.ni3n.2f.2m.m.2dca.5o.2m.2kc.2|.14dagm.2kj.6ae.4kh.9ofd.12jg.2h.2o.6jm2.4n.ij.fmjk.4hjem.4o.2j.3d.2|.14cagm.m2h.6cd.5je.9d2.6hah.3hcm.k.2e.m.3fam.5g.2o.bo2.5hg2.8k.6|.14fcm.3kjm.5fd.5kam.8fje.2m.2ba2o.2hcfem.2a.5m2.6e.4bo.7jk.7o.7|.15dk.4kh.5d2.6fc.8kmh2.4ghfk.3hjao.2g.18o.25|.15f2.5jg.4ch.7ag.8mjc.4k.ko.54",
".112|.81hdo.28|.82m.29|.81bm2.28|.81g.30|.81o.e.28|.80h2ca.28|.81hdk.28|.81gcf.28|.81ca2.g.26|.78haodafka.26|.79g.mjpmo.26|.79jdh.2oh.26|.16ka5k.52df.obg.cmbcobo.23|.16ha7.50ca3j.2m2amackea.22|.16a2cdba4c.47a2gmo.p2.mkjcbekda.21|.3ha4g.6mdcghg2ea3d.44ma2fm.2p2lp.objafehbd.20|.3fa5cf.4ochgjg2h2fa3.43a3m2.l2plp2kcocdfgfa2.19|.2ma2efca3d.3gbgdjkeghfda3m.40ga2f.3l2.l2pok2eafef2a.19|.2ocgh3gea3.2adeh.2geda6oj2.11baejgk.4kjbd.12a3omp3.2l2pljkjbgeg.ad.18|.2j8hda2gaco.3ka3bd2b2a3jhcbkbcea10bckbe2a4.9a2d.k.p2.3lplkfhcfgdma2.18|.mce2jk2hgh2eab2h.4oabc2dc2ba7ba2bab2cd2ed3ca2.4ga3m.6a3e.g.p.4p2lmfgbegbmca.18|.hbfj.2mcbcdcbc2g.5b2d3e3ded8b2c2bcde2cb2a2.6ha2.6abadckp2.4p2okcgbegb.haf.17|.gdk.4dac2d4a4e.jce3de11cdmokhcb3cb2a2g.6ma2m.4acajd.lp.5p.jajbega.gad.17|.hg.5fad2efe2ca4bcd2e12fdbdjk2okhdcb2a2ed.8a2o.3aca.b.lp.4lpkfbmcdea.fag.17|.k2.5madfefe2dce2d4e3f2edb2de2b2cb2fd2gh2mjecadgc.9bc.3a3.bp2.5p2kbcmc2ba.fk.18|.9dbef3dfe2fde5dc2baec2deb2cb2jg2jhbckjgdg2dk.8oea.2a3.gkjlkhkg2locbkbcdf.mh3f2j.10j2.|.9made3ce2dfe4f2ca2dfjgc5badjk.3eaekmg3e.11eb.ja2jghdcb2ecm.kbdgado.3k.4jck.6kh.3|.10b2ef2edc2def2edbaefgh2gbabc2acgfm.3mdce.kf2e.11ofdja2efac.gk.aghcahe2o2.oac.6gj.4j.o.3|.10kbef2ecd2e2fdbabfhgfhj2dab3ch2eo.4kc2f.k.2jhko.9hjcab.ad.pl.a2db2.dm.3hdh.7k2.2mo.2g.2|.11c2f2e2fcde2badghfejo.mgb2acgh2e.6mfeo2k.4beg.9cfgodb.p3acjc2.fm2gkdk.9h.2h.3mk.|.11jade2fdcb3dfg2fhk.4mfedghgkgj.7je.2mefjm2jh2.6j.hfh2ap.peabebg.jkhf3.2k.8ko.5g.|.11mabce3f2gfg5.7of5ojbk.6g.2m.2homcf.k2hbc.5gejdg.ha2chgj.mgfm.4k.8m2.7|.12kd2edefh3g2km.9oe2dhojc2jo.3e.9ma.2mhbacm.4fji2hfgh2jmknm2n.5o.17|.13jd2bf2km2km.8j2m.3o2mecj2fmok.11gf.2k.gebj.3n4ikehj2kim2.2n.12k.o.4h2.|.14fgfgh.11kafjom.5m2.2mde.9m.3fko.6e.din3i2bn2i2nm.8ojm.4j.2o.4em.|.15jhfjo.10mdjm2j.8m.2hm.13e.7o.dfo.gfoni4nk.7cbeg.3j2.2o2j.2ho.|.15omdhmoj.8omk.kmk.7h.2jb.8o2.3mo.mo.7hoh.4n.ijk3h.m.2afeo.6ho.7|.16mgdjk2.10m.okg.7j.2mkb.6go.5c.fk.2mo2.ba.9mj.2m.4deb.7fo.7|.17ogkm3.8o.3jgc.6j.k.2cf.3maeg.4m.2ef.2k.4o.6o.3g.2o.14o.8|.18k2.k2.14j2mo.3hmh.3a.3dagh.b2.4m.m.o.15k.26|.21oh2.8o.6mjmjmk2o.3gkjcjmk2.54",
".83o.28|.81ge.29|.82o.29|.81aom.28|.81h.30|.81o.d.28|.80jgb2.28|.81hcm.28|.81fbf.28|.81ba2.e.26|.78gapcagka.26|.79h.ok.m.27|.18j.o.58hcf.2mh.26|.17ma4ho.51bd.obj.bkbdmbo.23|.17ka6j.49a4k.2omamabkgam.21|.16ka2bca5.47a2hm.2p2.mkjdbdkda.21|.4ha3eo.7ce2ghgca2d.44ja2fk.2lplp.makaedhbc.20|.3kcaba3f.4omfhfhgh2fa3.43a3m2.l2.lp2kdmcdfgfa2.19|.2kmadfca4.3mabcgmhfhjhba2o.14ka2cm.7gfk.11fa2g.3l2.hlpok2fafef2a.19|.3keh4da3.2kadfo.ke3fga3.11ma9bkj2ea6.8a2bom.p2.2l2pljkjbgeg.ac.18|.3kmj2hj2gda3dch.4ea3cba2cgh2ea4b2a2bcd5cba2h.3hca3m.5ma2d.k.p2.3lplkfgbfgdka2.18|.2fachkj2hj2fcabj.5ea2bcecdca4b6c2d5cdcba2k.5ofa2.5a3fohp2.4p2lmfgbegbmda.18|.2acgo.ohgfjhec2h.5jacede4d7edc2egbacdb3a3e.7ha2o.3abaebkp2.4p2okcgcfga.haf.17|.hamo.3kabc2dedbcmo.ojcde3de3de6cedbghomhecba2be.8jbc.3acake.lp.4p2.jajbfga.fae.17|.kc.5oa2cd2e3ba4cde7dbe3dc2b2dfg2kfhkhcacge.9hbe.2aca.b.lp.4lpjfbmbdea.fag.17|.2k.5ofbdfefed7e5dcbc2dfdb5g2fhjeafkhf2g2.10eao.a3.bop.5p2kbcmbd2a.fbj.17|.9kbdf2e4fe7dcacdgfd2cbc2bch2k.2ga2fkjgfh.11ce.ba2.gkhjhgjeflocbjcedb.dgm.13fhk.|.9mebef3e8f2cacg2hgcab2cbcdjk.3mda2j3fm.11jckha2jfhdcbcfcm.kbdhbd2emdf.3k.8g.5|.10jcdfefe2de2f2ecb2eg3kjeab4dfh.5gcfgk2egkhef.8f2jbaefac.gm.afhcahfcfj2ohk.5h.5e.6|.10oecef2e3de3b2aeg3k.2hca2dfg2k.5mde2kojg3fe.9fkeab.ad.pl.a2dcb.ecjm.ofm.6g.3jk.6|.11kadegefecdeb2eg4o.3mdach2gj.7kj2k.2hfo.h.10kjfgmeb.p2lachc2.fjm.2jf.8g.m.8|.11macef2edcb2cfhg2ho.5jcfhfkomjgfh.3j.4kdmofo.k.7kmhfh2ap.pdabebgohmok2g.10f.5o.3|.12gabdcdfdf2g3fjo.6mg2ef.mef2eb.3k.4mhf.d.2k2.cab.5jejeg.habchgmom2jk.m.10j.6o.2|.13fcd5g2kjk2.6mfkmkgk.gk.3c.2k.2o.2ojo.g.3ekgbabo.4gji2hg2h2jmikm.o.11k.2g.5o.2|.14gehd2efk.9mfegm.6o.2c.km.4k.o.2dm.2og.2gebj.3n.n2ikdhj2ki.j.7o.5m.2b.5dj.|.14mghfegho.10fdeg.5kd.2emh.5g.4cm.2oj.2o.3f.din3i2bn2i2no.8m.4o.3e.4eam.|.17jkghko.9ofegj.5k.2hoj.4oh.4hk.kj.f.5o.dgo.fg.2ni3.j.3m.3ohg.3o.3f.4kf.2|.17omh2jh.11egf.4ok.2mj.5j.6gjk.2a.2o.6gk2.4i.n2jojf.4dkcj.6j.8|.19jf2g.11kfgo.4c2.2f.5m.khbk.km2.2c.4o.o.oah.5d.2mh.7cgem.6fm.7|.19ogf2o.11g3.hgkf2.2co.3em.jgfh.6h.6o.3o.5c.3d.7odcj.6h.8|.21fj2.11hfdh2gm.4efo2.jg.2acf.6g.2f.7o2.4g.3o.26|.22hg.5dej.5hfm.7m2.6kdm.54",
".112|.81fe.29|.82o.29|.81aom.28|.81g.30|.81o.d.28|.80hgb2.28|.81hco.28|.81fcf.28|.81ba2.f.26|.78gapcagka.26|.79g.mk.m.27|.18jk.59gdg.2mh.26|.18ga2dm.52be.mbjocmaekco.23|.18dba4j.49a4k.2omamackfao.21|.17ga2ba4m.47a2jmp.p2.mkjcbekca.21|.5badho.7jbdfgda3e.44ja2fm.2lplp.oajaedhbc.20|.3m.ba4f.5ojgfghg2ea3.43a3m2.l2.lp2kcocdfgfa2.19|.3mfaeca3d.3mhafejkghjhca2.16a3m.11kdk.7fa2g.3l2.hlpok2ebfef2a.19|.3oe2h3ea3.2ocabh.mfg3ha3m.11ab2a7.m.2gedba3d.6a2bomp3.2l2pmjmjbgeg.ad.18|.3jk2jhj2gcabfeaeo.3fbcbcba3k2jfb2abc2a3cdcd3cba2g2fa2j2ea3g.3ma2e.k.p2.3lplkfgbfgdma2.18|.2kabgjhjh2jgba2gm.4ja5bcba5ba3b2cd2c3d2ba3d.8ga3.2a3fohp2.4p2lmfgaegbmda.18|.2cbdj.okgfhjgcaf.6abcde3d2c2d4edb2cba2c2d2ba3b.10gah.abaebkp2.4p2okcgbfga.haf.17|.oafo.3oec3e2cak.4kd2e2d3e2d2e5dbejkjmjmogb2abdo.10e2.acakd.lp.4p2.jajbfha.gae.17|.oam.5fabc2dedca4bcde3de2cbce2dc2bafmok2gcfgkgecbm.10kemada.a.lp.4lpkfbmbdea.faf.17|.2g.6hace5c2dc2d2e4c4d2fdbab2aegfjohacbgejgao.11fhaba.aop.5p2kbcmbd2a.eaj.17|.9mc2f3e3f2d2e4dcb2cfjdcb2c2bcfhk.2jabacehgdm.11oga3.fk2lkhkfgloc2jce2b.bh.18|.10faefefefe7fcabehgjdb3cd2ehk.3oa2ehghjgf.12kda2jfhdcb2fcm.kbdhcd2bmjf2khfhm.12|.10kadfef2e2de4dcbceg2jmgbcb3dej.5bdg3o.jfk.12ga2f2ac.fm.afhcahgbcfjhm2khgkmf2k.5o.3m|.11ebef3e2cdefcb2ceghk.2ja2bdg3m.5def2.3ha2ch.11bac.ad.pl.a2db2.fbck.oeo.6mjf.2o.6|.11mcbe2fe2c2edc2f2g2m.3ma2fjgfm.6khgm.gbm.3ebd.9dfgmdc.p3abhc2.gbjk.he.7o.2k.k.6|.12jadef2dc2b2dfhghk.5abg2fm.10mgo.2ocg.2keo.6h.fgh2ap.peacebg.gfm3f.8m.3omko.4|.12oabcd2ece2g5k.6gf3o.kf2co.4jf.k.2faj.4d.ebc.o.3hejeg.ha2bhgmogk2.m2.8k.3k.7|.13jcd2cde3j4m.5oj2kjk.kjkmac.4f.2h.2ak.6h2a2co.4fijihg2h2jmkijko3.9e.4k.6|.14jfgfdcdek.9keh.8bm.3e.3fo.a.7gk.febk.3n4ikeh2jnikmg.n.4o.4ok.k.2g.6|.15gfgfefho.8ohefj.2om.2ka.4g.og2kga.4o.2ko.o.3f.fin3i2an2i2n2.13h.2d.2h.2mhm.|.16k2mhghj.9chgfkokf.2ae.3mjfbh.koh.6k.k.5m.dfo.f2o.ni3.2g.2o.6cjm.3c.2h.2jcj.|.19j3hk.8chmhgk2dk.a.3h2fo.3j.8o.j.7o.k.k.4n.ik.akh.5geaf.4c.2k.3ak.|.18ojhgfe.8gb.2g2hfjfa.3bk.6kfag.6k.4o.3d2.6f.2o.h.7gebj.4b.2km.5|.19gkghe.8md.2fem.2ca.2ge.7cjad.6k.5o.2o.7g.4k.7g3.5g.2k.6|.19ejmkfh.7odmhkj2.2cj.2af.7hjao.6h.5j.4o2.3k.31|.19ef.2jg.mag.4aj.3bd.h.2ohm.7kgm.7m.47",
".112|.81e2.29|.81om.29|.81aom.28|.81g.30|.81o.e.28|.80hgbc.28|.81hco.28|.81ech.28|.81ba2.g.26|.78fapcafka.26|.79g.mj.k.27|.19em.58geg.2mj.26|.19da4k.50eg.majmcoaemc.24|.18ha6f.48ba3k.2m2amabkea.22|.5k.11oa2deca3o.46a2jmo.p2.mjkb2dkba.21|.5kaback.7adgh2fca2h.43ka2fm.2lplp.obhaedhac.20|.4hbaba4.5mfghjgh2fa2o.42a3m2.l2plp2kbocdfhfa2.19|.4a2cfea3h.4adbemhfhjfa2b.40fa2f.3l2.glpojkdbfefea.19|.4cdgjhgfbab.2hadem.kdf2hga2f.13a6.11d2ba4.2a2b.kp2l.2hlpmhmjbgeg.ad.18|.3kgmhj2hj2dahja2g.3ka3dea3m2khfe2ac2b3ab4a3hm.5ha4cdba2ocaf.k.p2.3lpljg2cfgdma2.18|.3b2f2k2ghkjea2c2m.3oa5ceca10b2cded2cdb2a2j2ca3bh.5ba2caf.gp2.4lplmf2aegbmca.18|.2madfm.2g2hjkeb2g.5cabce3d3c2d6e2dc2bd5a3hjcah.7meadaebjpl.4p2okcfbfga.gae.17|.2gafj.3gb2cegcae.5gde13f2c3b2ec2bcegkfcah.12acakc.lp.4p2.jajbfha.ead.17|.oa2j.4ha2bcd4ba4bde3defedbefdefeabd3ebh.3hd2gbam.11aca.a.lp.4lpkfbmbdea.dag.17|.9mad3e3dc2bcd2e5d2c3e2cb3aehmkhm.gb2cehkga2.11aba.ap2.5p2kc2mbdba.g.2mj.15|.10adf3e6de3fe2c2abegdeb4aghko.hda2dcfho2hbo.10a3.eklm2jmh2loc2jc2dg.eo.4fm.12|.10fadefe4fe5f2dacdfjhcdbcfg2hjm.2ga2fhg2ko.2ag.10ba2kfhdbabdbm.kbdhbcjm.gd.5ojm.8h.|.11adfe2fedede4dcacg2homd2b4fhk.3hadhgeo.m.2eb.10ma2fead.em.agjcahebgo.hac.7ko.4hdo.2|.11jbe2f2e2c2egecbadg2h.2jb3cdchmk.3jcfg2o.6h.11a2c.ae.pl.a2db2.dgo.mfbk.5o.2j.3fo.4|.12abef2dec2dedbceg3.3ea2fjhem2.4oegjo.fo.3obk.10adfoc2.p3abhc2.fj.khd2.10j.h.6|.12dadef2ec3b2eghg2o.3fadhgek.o.5h2ojoj.7ej.7k.f2h2a.2pfabebgohjog2h.7o.3km.7|.12kacded2fdf3g4o.4jeg3k.8omg.kgm.7kf.edf.k.3fekdh.ha2bgfm.hkjo.14g.j.5|.13gbd2cfebgjg2jko.5mfgk.11hm.3fj.7omga2c.5ej2ihf2hgjmkik.hm.o.12f.7|.14g3fdb2gkmkm.6hfkj2mkh.7om2.3f2o.7ho2f2bm.3n4ikfjhjmij2.om.13oj.5j.|.15g2hgfg2.10gb.2kgdcm.6c.jo.afm.8gh.2m.ofmdin3i2an2i2n2h.7cfm.6mo.4jk.|.16o2jh3m.6hf.2dk.5fd.5jkhfbf.6m.2m.e.5m.dfo.g2oni4.2e.6ma3o.7m.3fj.|.18oefk2.5jbh.3fmk2.2kb.4k.ha2g.10o.jom.5m.koh.4n.n2.b.jm.3hfkhm.5o2m.3k.2|.16fjofcef.5jg.4jg2h.abk.4ghdae.3om.9k2.2k.3hbj.5o.2m.a.7gcm.7k.7|.16ch.2fej.5kh.5f2deb.5e2dcm.4a3j.7hmh.5oj.6j.4c.8ko.7m.2o.4|.15kdm.3fjm.4gc2dcgjfecf.3bf.ohe.6abef.7g.e.13j.4j.25|.15kj.4geo.8j2gedfb2kjah.2mh.6khkh.7o.46",
".112|.81gd.29|.82m.29|.81aom.28|.81h.30|.81o.d.28|.80h2b2.28|.81hcm.28|.81fbf.28|.81ba2.f.26|.78gapdafka.26|.19a.59g.ok.m.27|.19a3c.56hdg.2mh.26|.19a6h.49ce.objobmbdkcm.23|.5h.12ha3ba3.48ba3k.2m2amabkgam.21|.5oa3g.8a2cega4o.45a2hmo.p2.mkjcbdkda.21|.5kfa4f.6chg2hg3a2o.42ka2fm.2lplp.oakad2hb2.20|.4fabc2a3h.4fajfhmfehea2.42a3m2.l2pl2pkcoc2fgfa2.19|.4jadfhe2a2j.3a2baomegh2ga2.35aba2oga2f.3l2.hlpok2ebfef2ao.18|.4mhkhjhjga2e.2abgk.2bdefhca2.32ja5bda2omp2l.2l2pljkjbfeg.ab.18|.4afg2mh4eakcabj.3a4cba2fokjgedcdaba8ck.10a2cm.3dcbd.k.p2.3lplkfgcegdma2.18|.3faedk.ghgjkea2dg.4a2b2cdeda7babab2cb2c2ba2dh2cgm.2oa2d.5b2ae.gp2.4p2lmfgaegbmdao.17|.3a2ej.2jfcdjhabj.5hadbde3d9e5dcdedcacba4fja2h.6abadbkpl.4p2ombgbegb.had.17|.3a2k.3ma2bcdbcbh.4kbede4de3de2de2deca2ed2cbh.h2gha2bh.8abakd.lp.4p2.kajbfga.gac.17|.2mado.4a2c2ded2ba4bd2e11fefcba2dh2ed2h.g3h.gak.9aba.c.lp.4lpkfbmbdea.fae.17|.10abede2fedc2d3ede6cbde4cafdegjhdejkjfghf.2jo.9a3.c.p.5p2kb2obdba.hah.17|.10dae2fe6de7cbacececba2eh2gcfdhkjbfg2ja.13a3ogkjljhkg2locbjbde2.mko.13gjo.|.10mace5fe2de6babefjbeb4h3mom2ege2g2j2c.13dabjghebabecm.kbchadhk2fk.12o.5|.11baef4gdce3f2dcacfj2medabgfhgf.3gabhg2jomk.14a2efadpgj.afhcagfchm3fj.12k.4o|.12ade2fedc2df2db2cefgk.kcbabcfh2b.3abegeh.2hfgko.11a2b.ac.pl.a2db2.hgo.kheo.11o.6|.12a2e2fedc3e2badg2fk.2ea2dhgfjmb.3d2gj2mom.4mfm.9d2godb.p3abhb2ogj.2hdh.8o.6o2.2|.12jacde2d2cbcbcghgfj.3daeh2egokh.3mbjk.ho.8m.7k.dfh2ap.pgabdaeohomjeh.o.7om.6m.2|.13abd3e2cf2dfhgfj.4daf4.2m.5ako.3o.8o.ecd.m.3gekdf.hab2g2m.mohk.3o2.7o.9|.13mdg2fc3ghg4j.5hghf2o.8jho.4m.7koea2co.4fji2hf2h3miko3.5m.6k.o.8|.14jghjfefhkj2km.6kgh2o.9j2m.12mjo2fdbj.3n3i2kfh3mi.k.nk.11h.g.5de.|.15m2kghgk.10cghfj.10k2o.12fk.2om.2d.fin3i2an2i2no.9o.4j.2h.4mag.|.14om.2cfhk.9oh2jg2m.9kjgh.11b.o.5o.dfo.hfo.ni3.k.4o.3f2m.6h.5hm.|.12o.fg.2hbfm.3ak.5kmkjgj.9hacf.4k.5fm.k.9jmj.4n.nohmkg.4cfck.6kj.7|.14ko.2kfh.4faj.6jhm.7h2kmdj.5mam.2kg.2m.2o.m.3jah.5j.3f.7bcek.6kj.7|.19jk.6a2o.4ogjkj.4ga2k2.6kbdj.2m.3m.2j.6o.6d.3d.4k.2keko.6om.7|.12o.5ok.8kacehmkahgb.ohjh.2km.6kafg.6k.2j.13k.3h.26|.12e2.4m.12geabf.2hkekj.8o.3deh.54",
".83o.28|.81gd.29|.82m.29|.81amk.28|.81g.30|.81o.c.28|.80h2ca.28|.81jck.28|.81gbd.28|.81ba2.e.26|.78japdaema.26|.19b.59h.ok.o.27|.19ba3.m.54jcg.2og.26|.19eba4g.49bd.obh.bkc2mck.23|.5o.12a4ca3h.47ca3j.2o2aoabkfam.21|.5ma2ba.8a2dfgba4.45a2hop.p2.omjdbdjea.21|.5aba5.6cegh2g2ha3.39me.2a2fm.2l3p.makaedhcao.19|.4ka2cea4.4jcjehogfh2ba2.37ca2bda2km.l2plp2mdodcfgfa2.19|.4cadhjfeba2.3a2ecmodg2hjda2.35a2edbcae.o.l2.hlpomjgbfe2gam.18|.4ogkhkjghea2.2a2go.2aed2fea2d.24fk.6ocaf.2cbamop2l.2l2plkjkbgf2.a2.18|.4cg3okgj2ga2fa2g.3a5cabagmjhbd.8ob2o2.3ga3cj.4baf.3abc.k.pl.3lplmdhbegcma2.18|.3jaebk.hghjkgbacf.4da3cdbfa7dba7ba3gohadjdak.3cac.3ea2c.gp2.4p2loehadgbmeam.17|.3a2gf.2ocbcfgcbdk.5ad2e2dfdabcd2cb5c2d2c2dca3f.7dah.4a3dbkpl.5l2oahbegb.jb2.17|.3a2hm.3a2bced4a2c.2bde2d2e7d3e2de2cbadedbcho.6kab.5abaje.pl.5l.majbegb.ha2.17|.3abj.4a2dce4cba2b2cde2de3d2e8ba2bge3dchofhj.2mb2am.5acaoe.lp.4p2kfbobdfa.hab.17|.3k.6fae3defc2ed4e7d2e3feda3bg2jge2dhjhf2kea3jm.6a3.fop.5p2kcboceda.gah.17|.11acefe2defe2de3d2e4cbcecb2aegfg2k.d2cfogfge.2hm.9a3mjkhkjhjf2lodakcedb.bh.18|.11a2efe2cfece2de4cba2cfbeba2ejhjgemkbdgkjfgfc.13gacg2heca2eck.mbchc4oefk.mjo.7ofk.3|.11mace3d2cbe3fe3bad2fke2b2cejghofdaekomf2kjd.14a2dgabojh.aegcaghc2dhohg.2o.ham.4m2.5|.12c2efedcecdfe2dbabf2hkocdabfg2fe.3ejf2gfjo2dk.13ba2.a2.pl.a2db2ogbch.mej.6eo.2m.7|.12hadfedehdbefcbaeg2fm.hcb2dcfgfb.3dce2fhkoko.oack.9jegofa.p3abhcbohago2fd.8j.o.8|.13ac2bcfedc2db2fhf2m.2a2bgjhfhjb.3beg2km.2o.5gf.7k.f2jhal.pgabdbd.gho.of.10jko.o.5|.13fe3dc2g2dbeg4m.3a2bdhfgokg.3adho.11hc.hab.ohf.gfked.jab2g2k.jm.hkf.10jk.8|.14gj2hebj2gf2h3o.4acef2g.2ko.3adko.o.8o.h2ka2ck.3miji2hf2h3mi2m2.o.3m.5o.2og.8|.14komjgfghgf2km.6aghfg.3m.4cfmjcdmk.6k.2b.2hecj.3n3i2kfh3minko.15g.5dm.|.11ojbjo.fdhj.3o.8afhfm.8jf.2o.2ho.5d.2dh.2k.2goi2n3i2an2i2n.j.14o.m2.3gcj.|.9okb2fhgmacg.13achm.9oj.3o.2j.5j.2oc.7f2m.jeo.ni3.2g.2o2.3khk.4m.2g.3eco.|.9jmkmomjgbem.2o2k.3o.4bag.10k2okom.7g.4e.2o.6kjm.4n.nkmjkfm.3mkdg.7g.4m.2|.9k.6mgm.3m.k.2kj.4mbjo.8gfmjh.m.2mfbm.6ok.k.4m.bd.5g.3m.7jgbg.5m.c.o.5|.10m.5mk.4j.m.3hg.4d.mo.5ha2jo.j.f.2f2be.7a.j.4m.8b.3k.7mca2.5o.h.o.5|.10o.6o.7o.4h2.2c.mjo.2hmae.m.4j.2jda2.7a.g.3j.5j.3g.30|.14j.8m.2j.4bhbcokmfmdaf.13g.8m.46",
".112|.81fd.29|.82o.29|.81amk.28|.81h.30|.81o.c.28|.80hgb2.28|.81hck.28|.81gbd.28|.81ba2.e.26|.78hapdafka.26|.79h.ok.m.27|.18hm.59hcg.2of.26|.18da3chm.50cd.obh.akcbkck.23|.18da6j.44m.3ca3k.2o2amabkfak.21|.17fa2bca4c.42md.2a2hmp.p2.omjdbdjdao.20|.4kcbdajo.6baeg2fgca3.40ka.mbafm.2pl2p.makaedhcao.19|.4ba6j.5gfhgjg2hfa3k.37kag.ca2km.l2pl2pmdmc2egfa2.19|.4a2efba3gm.3bgefog2h3ca2d.26j.9ac.ma2f.o.l2.l2pomjgafefgam.18|.3jadhjfeda3o.kadbj.he2cdca3fo.22maf.8eam.ca2mop3.2l2plkhmbf3.a2.18|.4ejhjkjh2fabjbagk.2oa4bc2a4jfm.18a2.9a2.2ab2.j.pl.3lplmdhbefcma2.18|.3jg2fkmgj3dba2bg.4a3bc2d2a5bdb2a2j.2kj2gh.4cah.8hah.hbac.gp2.4p2loehadgbmfak.17|.3adfh.kfgdc2dcbco.4hadcd2edbabc2ba2ba10dem.af.8obam.b2acbkpl.5l2oahbegb.jab.17|.3abh.3gab2cd3cdbak.hacd3ecde3d2cd5c3bcdcba2dak.8eaf.2abaje.l2.5l.majbega.hab.17|.2fabm.3habdce3dba3baced4cd3ed4e2dc3bacd2ca2cfkj2.4obaf.3abaoe.l2.4p2kfaobdea.gad.17|.2daf.5a2fefefebcdc3d6e2d5ecaba4fgedcb2c2jhjba3ga2g.4a3.fop.5p2kb2obd2a.hfo.17|.2gh.6hace2f2cef2d2e2d9cd3abfecghjme2dbdefhg.2og2bao.5a3kjkhkjhjgflodakcedb.h2o.3jko.11|.11a2e2fdbcd5ed2e2c2ba2d4b2ghgdbfgbd2cdj2fd.13gabg2hecabdck.obchcbdfmjhgo2.3eo.10|.11kadfedbc3e4de2ba3fgdc2b4hjmgc2a2bdgkgf2.14a2cgabojh.adgcag2cdgm2dg.7oh.4ogj.2|.12ace2dcedcde2d3bacfgj2cecb3agf.3k2memkm.hgkmj.11ba2.a2.pl.a2db2ohcfmojam.9j.2j.5|.12fbefdcjhbce2da2befgjokbdb3cfgc.3dghjm2bkm.3dgh.9fdfmfa.p3abhcbohdko2gd.10ok.7|.12kacdcfkhcdfebadghfh.2gbc2b2dhgb.3a3jgk.2m3.3hg.7c.heh2al.pgabdbd.hjmjhd.12fo.6|.13cec2dgh2d2bdg2fgh.3a3dfgfj2co.2bdhgko.2om.5od.gab.j.3kdkfd.jab2g2k.jmjh.o.7o.4ko.6|.14gfecgj2cbdg3fm.4a2cegfhm2em.2hehko.4o.7k2a2ck.4iji2jf2h3mik2jo.10o.3mkm.6|.14ged2h3e2fgjko.5a2ef2go.mhm.2jgh.6k.7jo.hf2h2.2n3i2jfh3minkf.o.15h.6|.12gcdb2cfgkjhko.8dehgfk.3o2.2mcmk2mo2.m.7ge.2k.2gmein3i2an2i2n2mk.6kjh.8h.3kg.|.10fa2cec2fk.14jchg2.5o.3bok2mko.9og.7gem.jdm.ni3.2gm.mo.3hdaj.4o.2k.3hg.|.9acgfgh2k.17ag2j.4m2.3amkho.3mo2.6m.2k.5omom.4n.ni.ekh.5jg3.4m.2j.3j2.|.8hf.2m.9h.3hm.6cdj.3o2m.3jdkm.4mfeo2.6h.h.5jbj.5h.2o.g.7kd2k.4k.2h.6|.8o.3m.8fh.2okm.6fbk.5m.3gf.6c2ak.7d.g.6m.6h.4mo.6ojg.6o.m.6|.8ko.3m2.6c.3m3.6jfm.5mog.hg.6g2ck.7e.j.3j.9m.30|.8j2.3o.7g.2oj.8m.8j2m.m.6mjho.54"
];

/* ===== DEKODER SPRITE ===== */
const carCanvases = (() => {
  if (typeof CAR_FRAMES === "undefined") return [];
  return CAR_FRAMES.map(str => {
    const c = document.createElement("canvas"); c.width = CAR_W; c.height = CAR_H;
    const x = c.getContext("2d"), id = x.createImageData(CAR_W, CAR_H);
    str.split("|").forEach((row, y) => {
      let px = 0; const re = /([a-x.])(\d*)/g; let m;
      while ((m = re.exec(row))){
        const n = m[2] ? +m[2] : 1;
        if (m[1] !== "."){
          const hex = CAR_PAL[m[1].charCodeAt(0) - 97];
          const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), bl = parseInt(hex.slice(5, 7), 16);
          for (let k = 0; k < n; k++){ const i = (y * CAR_W + px + k) * 4; id.data[i] = r; id.data[i+1] = g; id.data[i+2] = bl; id.data[i+3] = 255; }
        }
        px += n;
      }
    });
    x.putImageData(id, 0, 0);
    return c;
  });
})();

/* ===== SUMBER GIF KUDA (OPSIONAL) =====
   Tempel link gif di bawah ini. Kosongkan = pakai sprite dari video. */
const HORSE_GIF_URL = "";
let gifImg = null, gifOK = false;
if (HORSE_GIF_URL){
  gifImg = new Image();
  gifImg.crossOrigin = "anonymous";
  gifImg.style.cssText = "position:fixed;left:0;top:0;width:64px;opacity:.01;z-index:-1;pointer-events:none";
  gifImg.onload = () => { gifOK = true; };
  gifImg.onerror = () => { gifOK = false; console.warn("GIF gagal dimuat, memakai sprite bawaan"); };
  gifImg.src = HORSE_GIF_URL;
  document.body.appendChild(gifImg);
}

/* ================= 3. LOOP ================= */
const starts = []; let total = 0;
LYRICS.forEach(l => { starts.push(total); total += l.d; });
let t0 = 0, running = false, audio = null, fadeK = 1; /* fadeK: kecerahan titik (0..1) untuk efek memudar masuk */

function frame(now){
  if (!running) return;
  const el = (now - t0) / 1000;
  if (el > total){ t0 = now; if (audio){ audio.currentTime = 0; audio.play(); } requestAnimationFrame(frame); return; }
  let idx = starts.findIndex((s, i) => el >= s && el < s + LYRICS[i].d);
  if (idx < 0) idx = LYRICS.length - 1;
  const L = LYRICS[idx], p = clamp((el - starts[idx]) / L.d), type = L.type || "text";

  b.clearRect(0, 0, cols, rows_); b.globalAlpha = 1; fadeK = 1;
  const cy = rows_ / 2;
  let pIn = 1, pOut = 0, spr = null;

  if (type === "text"){
    pIn = clamp(p / .3); pOut = clamp((p - .75) / .25);
    drawText(L.rows, cy, false, undefined, { s: L.s, w: L.w });
    if (L.fadeIn || L.fadeOut){   /* memudar masuk (gelap -> terang) lalu memudar keluar di akhir layar */
      const tt = el - starts[idx], fi = L.fadeIn || 0, fo = L.fadeOut || 0;
      fadeK = (fi ? ease(clamp(tt / fi)) : 1) * (fo ? 1 - ease(clamp((tt - (L.d - fo)) / fo)) : 1);
    }
  } else if (type === "carriage"){
    let zoneBottom = rows_ * .3; /* batas bawah area teks (di atas kereta) */
    if (gifOK && gifImg.naturalWidth){
      const gw = cols * .7, gh = gw * gifImg.naturalHeight / gifImg.naturalWidth;
      const gx = -gw + ease(clamp(p / .9)) * (cols + gw);
      b.drawImage(gifImg, gx, rows_ * .62 - gh / 2, gw, gh);
    } else if (carCanvases.length){
      /* kuda+kereta digambar TERPISAH dari grid teks, supaya bisa besar dan tetap tajam:
         1 piksel sprite = 2x2 titik pendek (gaya garis-scan seperti di video) */
      const CAR_FILL = .98, CAR_MAXH = .6;
      const gw = Math.min(cols * CAR_FILL, rows_ * CAR_MAXH * CAR_W / CAR_H), gh = gw * CAR_H / CAR_W;
      const gx = (cols - gw) / 2, gy = rows_ * .96 - gh; zoneBottom = gy;
      spr = { fi: Math.floor(el * 10) % carCanvases.length, x: gx * CELL, y: gy * CELL, p: gw * CELL / (CAR_W * 2) };
    } else {
      const s = cols * .7 / 46, o = { s, x: 0, y: 0 };
      const x = -48 * s + ease(clamp(p / .9)) * (cols + 40 * s);
      o.x = x; o.y = rows_ * .52; horse(o, el);
      o.x = x + 27 * s; o.y = rows_ * .52 - 2 * s; carriage(o, el);
      b.fillStyle = "#555"; b.fillRect(x + 20 * s, rows_ * .52 + 9 * s, 8 * s, Math.max(1, s * .6));
    }
    const wide = cols >= rows_ * 1.2; /* layar lebar: gabungkan baris jadi satu baris panjang seperti di video */
    drawText(wide ? [L.rows.flat()] : L.rows, zoneBottom / 2, false, zoneBottom * .95);
  } else if (type === "hand"){
    if (handsReady >= 2){
      /* tangan dari video: baris 1 = tangan kiri masuk; baris 2 = tangan kiri diam + tangan kanan masuk */
      const HD = HAND_DATA, k = Math.min(cols / HD.CW, rows_ / 124); /* sel per piksel sprite */
      const nth = LYRICS.slice(0, idx + 1).filter(x => x.type === "hand").length; /* 1 atau 2 */
      const midY = rows_ / 2;
      b.imageSmoothingEnabled = true; b.imageSmoothingQuality = "high";
      /* tangan kiri: bagian perpanjangan lengan ada di luar layar sebelah kiri */
      const lw = HD.L.w * k, lh = HD.L.h * k, lRest = -HD.L.ext * k;
      const lx = nth === 1 ? lRest - lw * (1 - ease(clamp(p / .65))) : lRest;   /* .65 = tangan masuk lebih pelan (dulu .45) */
      b.drawImage(handImgs.L, lx, midY + (HD.L.cy - HD.MID) * k - lh / 2, lw, lh);
      if (nth >= 2){
        const rw = HD.R.w * k, rh = HD.R.h * k, rRest = cols - (HD.R.w - HD.R.ext) * k;
        const rx = rRest + (cols - rRest) * (1 - ease(clamp(p / .65)));
        const rise = 14 * k * (1 - ease(clamp((p - .5) / .45))); /* tangan kanan naik pelan setelah masuk */
        b.drawImage(handImgs.R, rx, midY + (HD.R.cy - HD.MID) * k - rh / 2 + rise, rw, rh);
      }
      const portrait = cols < rows_ * .8; /* layar portrait (HP): teks di atas tangan supaya tetap terbaca */
      const textY = portrait ? midY - 59 * k - cols * .1 : midY - 7 * k;
      const tLeft = L.d * (1 - p), tIn = el - starts[idx];
      const hideText = (L.textDelay && tIn < L.textDelay) || (nth >= 2 && tLeft < (L.textEnd !== undefined ? L.textEnd : L.d * .12));
      if (!hideText) drawText(L.rows, textY, true); /* di video teks muncul sedikit setelah tangan & hilang sesaat sebelum adegan berakhir */
    } else {
      const s = cols * .55 / 34, o = { s };
      const slide = ease(clamp(p / .3)) * (1 - ease(clamp((p - .8) / .2)));
      o.x = -cols * .1 + slide * cols * .42; o.y = cy - 4 * s;
      hand(o, el, 1);
      drawText(L.rows, cy + 4 * s, true);
    }

    } else if (type === "album") {
  b.fillStyle = "#000";
  b.fillRect(0, 0, cols, rows_);

  /* seperti di video: layar hitam sebentar, lalu sampul memudar masuk (gelap -> terang) dan ditahan.
     di video sampulnya tampil persegi (gambar sedikit diregangkan), jadi di sini juga dibuat persegi */
  const aDelay = L.delay !== undefined ? L.delay : .3, aFade = L.fade !== undefined ? L.fade : .6;
  fadeK = ease(clamp((el - starts[idx] - aDelay) / Math.max(.01, aFade)));
  const aOut = L.out !== undefined ? L.out : 0;   /* memudar keluar (terang -> gelap) di akhir layar, cermin dari fade masuk */
  if (aOut > 0) fadeK *= 1 - ease(clamp((el - starts[idx] - (L.d - aOut)) / aOut));

  if (albumReady && fadeK > 0) {
    const side = Math.min(cols, rows_) * ALBUM_SIZE;
    /* diperkecil dulu ke grid kasar (ALBUM_GRID x ALBUM_GRID) lalu dibesarkan tanpa penghalusan: tampilan "pixel" yang tebal seperti di video */
    if (!albumLo){
      albumLo = document.createElement("canvas"); albumLo.width = albumLo.height = ALBUM_GRID;
      const l = albumLo.getContext("2d"); l.imageSmoothingQuality = "high";
      l.filter = "contrast(1.2) brightness(1.08)"; /* sedikit lebih tajam & terang */
      l.drawImage(albumImg, 0, 0, ALBUM_GRID, ALBUM_GRID);
    }
    b.imageSmoothingEnabled = false;
    b.drawImage(albumLo, (cols - side) / 2, (rows_ - side) / 2, side, side);
  }

  } else if (type === "paper"){
    const hh = cols * .15 * L.rows.length * .75;
    const edge = (x, seed) => (hash(Math.floor(x / 4), seed) - .5) + .5 * (hash(Math.floor(x / 11), seed + 5) - .5);
    b.save();
    b.beginPath(); b.rect(0, 0, cols, rows_); b.clip();
    b.fillStyle = "#d8d0c0";
    b.beginPath();
    b.moveTo(0, cy - hh);
    for (let x = 0; x <= cols; x += 2) b.lineTo(x, cy - hh + edge(x, 1) * hh * .3);
    for (let x = cols; x >= 0; x -= 2) b.lineTo(x, cy + hh + edge(x, 2) * hh * .3);
    b.closePath(); b.fill();
    b.fillStyle = "#b9b09c";
    for (let i = 0; i < cols * 6; i++){
      b.fillRect(hash(i, 7) * cols, cy - hh + hash(i, 8) * hh * 2, 1, 1);
    }
    b.restore();
    drawText(L.rows, cy, false);
  } else if (type === "door"){
    drawText(L.rows, cy, false);
    /* berayun terbuka, lalu pintu menghilang (luruh) dan hanya tulisan "Room" yang tersisa */
    const angle = ease(clamp(p / .55)) * 1.3;   /* pintu membuka lebih pelan (dulu p / .4) */
    const vis = 1 - ease(clamp((p - .58) / .3));
    /* tulisan di luar bingkai pintu tersembunyi selama pintu ada, lalu muncul pelan-pelan saat pintu luruh */
    if (vis > 0){
      const G = doorGeom(), td = b.getImageData(0, 0, cols, rows_), tp = td.data;
      for (let y = 0; y < rows_; y++) for (let x = 0; x < cols; x++){
        const i = (y * cols + x) * 4; if (!tp[i + 3]) continue;
        const u = (x - G.x0) / G.DW * DOOR_TW, v = (y - G.y0) / G.DH * DOOR_TH;
        const inside = u >= 0 && u < DOOR_TW && v >= 0 && v < DOOR_TH && (v >= 150 || (u - 150) * (u - 150) + (v - 150) * (v - 150) <= 22500);
        if (!inside && hash(x, y) < vis) tp[i + 3] = 0;
      }
      b.putImageData(td, 0, 0);
    }
    if (vis >= 1){ doorAll(angle, b); }
    else if (vis > 0){
      /* pintu + gagang digambar ke layer terpisah, lalu titiknya luruh bersamaan */
      if (!doorLayer || doorLayer.width !== cols || doorLayer.height !== rows_){ doorLayer = document.createElement("canvas"); doorLayer.width = cols; doorLayer.height = rows_; doorCtx = doorLayer.getContext("2d", {willReadFrequently:true}); }
      doorCtx.clearRect(0, 0, cols, rows_);
      doorAll(angle, doorCtx);
      const dd = doorCtx.getImageData(0, 0, cols, rows_), px4 = dd.data;
      for (let y = 0; y < rows_; y++) for (let x = 0; x < cols; x++){ const i = (y * cols + x) * 4; if (px4[i + 3] && hash(x, y) > vis) px4[i + 3] = 0; }
      doorCtx.putImageData(dd, 0, 0); b.drawImage(doorLayer, 0, 0);
    }
  }

  let img;
  try { img = b.getImageData(0, 0, cols, rows_).data; }
  catch (e) { gifOK = false; resize(); requestAnimationFrame(frame); return; } /* gif dari domain tanpa CORS */
  ctx.fillStyle = "#000"; ctx.fillRect(0, 0, cv.width, cv.height);
  const dissolve = false;
  for (let y = 0; y < rows_; y++) for (let x = 0; x < cols; x++){
    const i = (y * cols + x) * 4, a = img[i + 3];
    if (a < 150) continue; /* buang tepi huruf yang samar supaya garis lebih tipis */
    if (dissolve){ const h = hash(x, y); if (h > pIn || h < pOut) continue; }
    const lum = Math.max(img[i], img[i + 1], img[i + 2]) / 255;
    if (lum < .12) continue;
    const dw = CELL * .9, dh = CELL * .5; /* titik berbentuk garis pendek seperti di video */
    ctx.fillStyle = `rgb(${img[i] * fadeK | 0},${img[i + 1] * fadeK | 0},${img[i + 2] * fadeK | 0})`;
    ctx.fillRect(x * CELL + (CELL - dw) / 2, y * CELL + (CELL - dh) / 2, dw, dh);
  }
  if (spr) drawSprite(spr);
  requestAnimationFrame(frame);
}

/* --- gambar sprite kuda+kereta sebagai titik pendek 2x2 per piksel sprite --- */
const carData = [];
function drawSprite(S){
  if (!carData[S.fi]) carData[S.fi] = carCanvases[S.fi].getContext("2d").getImageData(0, 0, CAR_W, CAR_H).data;
  const d = carData[S.fi], p = S.p, dw = p * .9, dh = p * .5;
  for (let j = 0; j < CAR_H * 2; j++){
    const sy = j >> 1, y = S.y + j * p + (p - dh) / 2;
    for (let i = 0; i < CAR_W * 2; i++){
      const k = (sy * CAR_W + (i >> 1)) * 4;
      if (d[k + 3] < 150) continue;
      ctx.fillStyle = `rgb(${d[k]},${d[k + 1]},${d[k + 2]})`;
      ctx.fillRect(S.x + i * p + (p - dw) / 2, y, dw, dh); /* koordinat pecahan, sama seperti titik teks */
    }
  }
}

async function start(){
  try { await Promise.all([400,500,600,700,800].map(w => document.fonts.load(w + " 40px Montserrat"))); } catch (e) {}
  const ui = document.getElementById("ui"); if (ui) ui.style.display = "none";
  running = true; t0 = performance.now();
  if (audio){ audio.currentTime = 0; audio.play().catch(() => {}); }
  requestAnimationFrame(frame);
}
/* Audio (opsional): isi nama file lagu yang ada di folder yang sama, mis. "lagu.mp3". Kosongkan kalau tanpa suara.
   Catatan: browser memblokir suara otomatis, jadi lagu baru berbunyi setelah layar disentuh/diklik sekali. */
const AUDIO_SRC = "cinderella.mp3"; /* potongan lagu mulai dari menit 3:48,84 (saat judul muncul), jadi 0 detik audio = 0 detik animasi */
if (AUDIO_SRC){
  audio = new Audio(AUDIO_SRC);
  const unlock = () => { audio.currentTime = (performance.now() - t0) / 1000; audio.play().catch(() => {}); };
  addEventListener("pointerdown", unlock, { once: true });
  addEventListener("keydown", unlock, { once: true });
}
cv.onclick = () => { t0 = performance.now(); if (audio){ audio.currentTime = 0; audio.play().catch(() => {}); } };

/* langsung jalan saat halaman dibuka */
start();
