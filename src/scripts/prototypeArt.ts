// Original, code-drawn pixel art. No remote assets or image-generation dependency.
type Context = CanvasRenderingContext2D;
const rect = (
  c: Context,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
) => {
  c.fillStyle = color;
  c.fillRect(Math.round(x), Math.round(y), w, h);
};
const text = (
  c: Context,
  value: string,
  x: number,
  y: number,
  size = 10,
  color = '#344e3d',
) => {
  c.fillStyle = color;
  c.font = `${size}px "Pixelify Sans", monospace`;
  c.fillText(value, x, y);
};
function polygon(c: Context, points: number[][], color: string) {
  c.fillStyle = color;
  c.beginPath();
  points.forEach(([x, y], i) => (i ? c.lineTo(x!, y!) : c.moveTo(x!, y!)));
  c.closePath();
  c.fill();
}
function tree(c: Context, x: number, y: number, scale = 1, autumn = false) {
  c.save();
  c.translate(Math.round(x), Math.round(y));
  c.scale(scale, scale);
  rect(c, -8, 23, 21, 4, '#385c4935');
  rect(c, 1, 10, 4, 16, '#785e42');
  rect(c, -7, 3, 19, 17, autumn ? '#9c6b38' : '#426b47');
  rect(c, -3, -2, 12, 25, autumn ? '#b98141' : '#54824e');
  rect(c, -9, 8, 22, 10, autumn ? '#b98141' : '#54824e');
  rect(c, -5, 2, 10, 8, autumn ? '#d9a45a' : '#78a364');
  rect(c, 6, 9, 7, 10, autumn ? '#966238' : '#365e41');
  rect(c, -3, 12, 5, 4, autumn ? '#dcb366' : '#8aad6c');
  c.restore();
}
function pine(c: Context, x: number, y: number, scale = 1) {
  c.save();
  c.translate(Math.round(x), Math.round(y));
  c.scale(scale, scale);
  rect(c, 0, 16, 3, 9, '#746342');
  rect(c, -3, 0, 8, 7, '#41694b');
  rect(c, -6, 6, 14, 8, '#41694b');
  rect(c, -9, 13, 20, 8, '#41694b');
  rect(c, -3, 2, 4, 5, '#83a166');
  rect(c, -6, 9, 6, 3, '#739558');
  rect(c, -8, 16, 8, 3, '#739558');
  c.restore();
}
function person(c: Context, x: number, y: number, t: number, graduate = false) {
  const bob = Math.floor(t * 2) % 2;
  c.save();
  c.translate(Math.round(x), Math.round(y) + bob);
  rect(c, -4, 18, 16, 3, '#3a4c4233');
  rect(c, 0, 10, 4, 9, '#314b56');
  rect(c, 7, 10, 4, 9, '#314b56');
  rect(c, -1, 18, 6, 3, '#2c403e');
  rect(c, 7, 18, 6, 3, '#2c403e');
  rect(c, -1, 3, 12, 10, graduate ? '#283f56' : '#b96c43');
  rect(c, -4, 5, 3, 8, '#dbb081');
  rect(c, 11, 5, 3, 8, '#dbb081');
  rect(c, 0, -6, 10, 11, '#e7bd8a');
  rect(c, -1, -8, 12, 5, '#58483b');
  rect(c, -1, -4, 3, 4, '#58483b');
  rect(c, 8, -2, 2, 2, '#243d34');
  if (graduate) {
    rect(c, -5, -12, 20, 4, '#263b4c');
    rect(c, 0, -15, 10, 4, '#263b4c');
    rect(c, 12, -10, 2, 9, '#e9be4a');
  }
  c.restore();
}
function house(c: Context, x: number, y: number, scale = 1, roof = '#b36f50') {
  c.save();
  c.translate(Math.round(x), Math.round(y));
  c.scale(scale, scale);
  rect(c, -4, 40, 65, 5, '#52775135');
  rect(c, 0, 8, 55, 34, '#e8d9a8');
  rect(c, 43, 10, 12, 32, '#c4b68d');
  rect(c, -4, 3, 63, 8, roof);
  rect(c, 1, -3, 53, 8, roof);
  rect(c, 7, -10, 41, 8, roof);
  rect(c, 14, -16, 28, 8, roof);
  rect(c, 17, -13, 23, 3, '#d29b6a');
  rect(c, 4, 0, 50, 2, '#d29b6a');
  rect(c, 8, -6, 40, 2, '#d29b6a');
  rect(c, 37, -19, 7, 13, '#8c6450');
  rect(c, 21, 22, 13, 20, '#7a6952');
  rect(c, 23, 24, 8, 18, '#a98a59');
  rect(c, 7, 17, 9, 12, '#597f7e');
  rect(c, 38, 17, 9, 12, '#597f7e');
  rect(c, 8, 18, 5, 5, '#b4d7bd');
  rect(c, 39, 18, 5, 5, '#b4d7bd');
  rect(c, 5, 29, 13, 3, '#957c4e');
  rect(c, 36, 29, 13, 3, '#957c4e');
  rect(c, 18, 42, 19, 4, '#f5e6bd');
  c.restore();
}
function cloud(c: Context, x: number, y: number, scale = 1) {
  c.save();
  c.translate(Math.round(x), Math.round(y));
  c.scale(scale, scale);
  rect(c, 0, 6, 48, 9, '#eff2d9');
  rect(c, 7, 0, 16, 8, '#eff2d9');
  rect(c, 24, -4, 16, 12, '#eff2d9');
  rect(c, 4, 15, 39, 3, '#b6ccc3');
  c.restore();
}
function car(c: Context, x: number, y: number, color = '#c5754e') {
  rect(c, x - 2, y + 17, 55, 4, '#233d4333');
  rect(c, x + 7, y, 30, 4, color);
  rect(c, x + 3, y + 4, 40, 5, color);
  rect(c, x - 3, y + 9, 52, 9, color);
  rect(c, x + 9, y + 3, 11, 7, '#b9dbcf');
  rect(c, x + 23, y + 3, 11, 7, '#b9dbcf');
  rect(c, x - 3, y + 11, 5, 3, '#f4d98d');
  rect(c, x + 44, y + 11, 4, 3, '#ad4939');
  rect(c, x + 3, y + 15, 10, 8, '#314249');
  rect(c, x + 33, y + 15, 10, 8, '#314249');
  rect(c, x + 6, y + 17, 4, 4, '#9ea8a0');
  rect(c, x + 36, y + 17, 4, 4, '#9ea8a0');
}
function flag(c: Context, x: number, y: number, t: number) {
  rect(c, x, y, 2, 42, '#7b8164');
  rect(c, x + 2, y, 25, 15, '#243f58');
  rect(c, x + 25, y + (Math.floor(t * 2) % 2), 4, 13, '#243f58');
  text(c, 'M', x + 7, y + 12, 14, '#f3c748');
}
function backdrop(c: Context, t: number, night: boolean = false) {
  rect(c, 0, 0, 480, 260, night ? '#233e43' : '#c9dfd6');
  rect(c, 0, 96, 480, 30, night ? '#35544d' : '#b7ccb2');
  for (let i = 0; i < 14; i++) {
    const h = 12 + ((i * 13) % 28);
    rect(c, i * 37, 105 - h, 40, h + 20, night ? '#3b594e' : '#b0c5a8');
  }
  rect(c, 0, 119, 480, 141, night ? '#4b654b' : '#adc78a');
  for (let i = 0; i < 130; i++) {
    const x = (i * 97) % 480,
      y = 127 + ((i * 59) % 131);
    rect(c, x, y, 3, 2, i % 3 ? '#8eae7180' : '#d0daa580');
  }
  cloud(c, ((t * 3 + 18) % 570) - 60, 24);
  cloud(c, ((t * 2 + 287) % 570) - 60, 43, 0.7);
  rect(c, 418, 23, 17, 17, '#f2dca1');
  rect(c, 414, 27, 25, 9, '#f2dca1');
}
function campus(c: Context, t: number, graduation: boolean) {
  backdrop(c, t);
  rect(c, 0, 210, 480, 18, '#e4d2a3');
  rect(c, 220, 175, 34, 46, '#e4d2a3');
  for (let i = 0; i < 8; i++)
    tree(c, 20 + i * 66, 107 + (i % 2) * 17, 0.85, graduation);
  rect(c, 102, 110, 241, 71, '#d2b889');
  rect(c, 100, 104, 245, 9, '#806747');
  rect(c, 109, 92, 225, 13, '#9b7750');
  rect(c, 100, 178, 247, 8, '#e8d7ae');
  rect(c, 109, 184, 229, 4, '#8da879');
  for (let i = 0; i < 11; i++) {
    rect(c, 112 + i * 20, 121, 9, 14, '#587977');
    rect(c, 112 + i * 20, 146, 9, 17, '#587977');
    rect(c, 113 + i * 20, 122, 5, 6, '#b3ceae');
  }
  rect(c, 201, 51, 47, 132, '#d6c497');
  rect(c, 195, 49, 59, 8, '#8e7753');
  rect(c, 207, 35, 35, 14, '#b4a37b');
  rect(c, 212, 19, 25, 17, '#66806b');
  rect(c, 218, 12, 13, 7, '#567260');
  rect(c, 223, 4, 3, 10, '#57684c');
  rect(c, 210, 66, 29, 27, '#f2e5bb');
  rect(c, 222, 69, 3, 14, '#5f684d');
  rect(c, 224, 80, 9, 3, '#5f684d');
  rect(c, 211, 115, 27, 39, '#5b776c');
  rect(c, 220, 112, 8, 42, '#d6c497');
  rect(c, 214, 160, 21, 23, '#746a50');
  rect(c, 194, 187, 63, 5, '#e6d2a8');
  rect(c, 187, 193, 76, 5, '#ddd0a7');
  flag(c, 302, 65, t);
  text(c, 'UNIVERSITY OF MICHIGAN', 142, 204, 9, '#455c44');
  tree(c, 71, 147, 1.5, graduation);
  tree(c, 387, 145, 1.6, graduation);
  tree(c, 17, 187, 1.2);
  tree(c, 446, 194, 1.2);
  // A reader under the trees; the book pages turn every other second.
  rect(c, 64, 192, 45, 4, '#8d7651');
  rect(c, 67, 198, 3, 10, '#705e45');
  rect(c, 100, 198, 3, 10, '#705e45');
  person(c, 86, 177, t);
  rect(c, 79, 183, 19, 9, '#f3e1b2');
  rect(c, 88, 183, 2, 9, Math.floor(t) % 2 ? '#b49b72' : '#d0b17b');
  person(c, 235 + Math.sin(t * 0.5) * 12, 213, t, graduation);
  person(c, 322, 228, t + 1);
  if (graduation) {
    const cy = 43 - Math.abs(Math.sin(t)) * 18;
    rect(c, 293, cy, 23, 4, '#243a51');
    rect(c, 299, cy - 4, 12, 4, '#243a51');
    rect(c, 313, cy + 3, 2, 8, '#ebc653');
    for (let i = 0; i < 14; i++)
      rect(
        c,
        260 + i * 6,
        40 + ((i * 13 + t * 12) % 67),
        2,
        3,
        i % 2 ? '#edc74d' : '#405b78',
      );
    text(c, 'GO BLUE! CLASS OF 2024', 287, 76, 9, '#3f5b54');
  } else {
    rect(c, 317, 229, 26, 12, '#315369');
    text(c, 'M', 324, 239, 12, '#edc349');
  }
  text(c, 'ANN ARBOR / A PLACE TO BEGIN', 15, 247, 8);
}
function garage(c: Context, t: number) {
  backdrop(c, t);
  rect(c, 0, 225, 480, 35, '#65756a');
  rect(c, 0, 228, 480, 2, '#dfd4b2');
  for (let i = 0; i < 12; i++)
    rect(c, i * 45 - ((t * 8) % 45), 245, 21, 2, '#d1d3b4');
  // Ingolstadt townhouses and two towers beyond the workshop.
  for (let i = 0; i < 5; i++) {
    const x = 280 + i * 37;
    rect(c, x, 65, 30, 67, '#cdb78e');
    rect(c, x - 3, 58, 36, 8, '#a56e4e');
    rect(c, x + 4, 51, 22, 8, '#a56e4e');
    for (let j = 0; j < 3; j++) rect(c, x + 9, 76 + j * 15, 10, 7, '#6a8a80');
  }
  rect(c, 305, 30, 16, 77, '#b0a07b');
  rect(c, 304, 20, 18, 13, '#5b7262');
  rect(c, 354, 30, 16, 77, '#b0a07b');
  rect(c, 353, 20, 18, 13, '#5b7262');
  rect(c, 49, 96, 236, 101, '#e0d1a7');
  rect(c, 43, 87, 248, 13, '#496758');
  rect(c, 54, 72, 226, 16, '#668775');
  for (let i = 0; i < 15; i++) rect(c, 57 + i * 15, 75, 1, 12, '#93a38b');
  rect(c, 65, 112, 110, 74, '#334b44');
  rect(c, 71, 119, 98, 5, '#90a794');
  rect(c, 71, 129, 98, 3, '#566f60');
  rect(c, 65, 184, 116, 5, '#a09470');
  rect(c, 191, 111, 74, 41, '#416259');
  rect(c, 196, 116, 64, 31, '#b7cbb0');
  text(c, 'EDAG', 204, 134, 19, '#334e42');
  rect(c, 201, 161, 10, 29, '#927e59');
  rect(c, 207, 166, 2, 3, '#ded5a6');
  rect(c, 194, 193, 78, 5, '#bda87f');
  rect(c, 198, 200, 76, 5, '#d8c798');
  // Workshop display: incoming CAN values and a pulsing signal.
  rect(c, 82, 130, 31, 21, '#a7b5a0');
  rect(c, 85, 133, 25, 15, '#203d39');
  text(c, 'CAN', 87, 140, 5, '#d5d887');
  for (let i = 0; i < 5; i++)
    rect(c, 87 + i * 4, 142 + ((i + Math.floor(t * 4)) % 3), 3, 1, '#a7c982');
  rect(c, 96, 151, 4, 7, '#adb697');
  rect(c, 76, 158, 48, 4, '#af9261');
  rect(c, 79, 162, 3, 20, '#816c4c');
  rect(c, 119, 162, 3, 20, '#816c4c');
  car(c, 121 + Math.sin(t * 0.8) * 4, 163);
  person(c, 62, 191, t);
  person(c, 185, 205, t);
  tree(c, 25, 142, 1.3);
  tree(c, 421, 140, 1.1);
  pine(c, 462, 130, 1.5);
  car(c, ((t * 28) % 580) - 70, 231, '#d8b15c');
  text(c, 'INGOLSTADT / SOFTWARE MEETS THE ROAD', 15, 219, 8, '#3e6247');
  rect(c, 339, 155, 44, 17, '#b29465');
  text(c, 'WERKSTATT', 341, 166, 7, '#f4e6b7');
  rect(c, 360, 172, 3, 29, '#816e4d');
}
function broadcast(c: Context, t: number) {
  backdrop(c, t);
  rect(c, 0, 212, 480, 48, '#9ab27e');
  tree(c, 26, 135, 1.5);
  tree(c, 448, 129, 1.5);
  pine(c, 470, 166, 1.3);
  tree(c, 61, 166, 1.1);
  rect(c, 83, 187, 318, 12, '#829567');
  rect(c, 83, 64, 318, 123, '#4c635d');
  rect(c, 90, 70, 304, 112, '#253d3c');
  rect(c, 101, 81, 281, 81, '#53834e');
  for (let i = 0; i < 10; i++) rect(c, 104 + i * 28, 83, 13, 76, '#5e8f53');
  for (let i = 0; i < 9; i++) rect(c, 114 + i * 31, 86, 1, 68, '#b1c58d');
  rect(c, 110, 87, 260, 1, '#d7dfac');
  rect(c, 110, 153, 260, 1, '#d7dfac');
  rect(c, 349, 103, 2, 31, '#ebd476');
  rect(c, 338, 101, 25, 3, '#ebd476');
  rect(c, 337, 90, 3, 14, '#ebd476');
  rect(c, 361, 90, 3, 14, '#ebd476');
  // The kick trail is progressively rendered on the broadcast monitor.
  const progress = (t * 0.28) % 1;
  for (let i = 0; i < Math.floor(progress * 48); i++) {
    const p = i / 48;
    rect(
      c,
      147 + p * 199,
      145 - Math.sin(p * Math.PI * 0.87) * 49,
      3,
      3,
      '#eada79',
    );
  }
  rect(
    c,
    147 + progress * 199,
    145 - Math.sin(progress * Math.PI * 0.87) * 49,
    4,
    3,
    '#fbf1c7',
  );
  for (let i = 0; i < 8; i++) {
    rect(
      c,
      140 + ((i * 23) % 151),
      121 + ((i * 11) % 25),
      4,
      6,
      i % 2 ? '#f1dfb2' : '#b56845',
    );
  }
  rect(c, 106, 166, 145, 10, '#d5dabe');
  text(c, 'LIVE  |  KICK TRAJECTORY', 111, 174, 7, '#2a453c');
  rect(c, 315, 166, 63, 10, '#b86842');
  text(c, 'ON AIR', 328, 174, 8, '#f6e6b8');
  rect(c, 181, 194, 109, 6, '#69826b');
  rect(c, 228, 196, 12, 13, '#536a56');
  rect(c, 203, 207, 61, 4, '#526b58');
  text(c, 'SMT', 97, 61, 15, '#3e6451');
  text(c, 'LIVE SPORTS. REAL-TIME CODE.', 267, 60, 7, '#3e6451');
  // The engineer's little production desk.
  rect(c, 124, 220, 231, 6, '#967a51');
  rect(c, 132, 226, 5, 30, '#796445');
  rect(c, 342, 226, 5, 30, '#796445');
  rect(c, 169, 201, 39, 23, '#3d5752');
  rect(c, 173, 204, 31, 16, '#bed1b1');
  text(c, 'x y z', 176, 211, 6, '#3c6550');
  for (let i = 0; i < 3; i++)
    rect(
      c,
      176,
      214 + i * 2,
      12 + ((i * 7 + Math.floor(t * 3)) % 15),
      1,
      '#668877',
    );
  person(c, 234, 224, t);
  rect(c, 229, 231, 21, 24, '#557363');
  rect(c, 237, 250, 5, 9, '#344e47');
  rect(c, 302, 211, 9, 10, '#f0dfaf');
  rect(c, 311, 213, 3, 6, '#d6c699');
  rect(c, 305, 207 - (Math.floor(t * 2) % 3), 2, 3, '#e7ebd1');
  text(c, 'DURHAM / THE BROADCAST BOOTH', 15, 252, 8, '#35573f');
}
function housing(c: Context, t: number) {
  backdrop(c, t);
  tree(c, 19, 138, 1.4);
  tree(c, 451, 150, 1.5);
  pine(c, 469, 114, 1.4);
  // A browser window lives inside the pixel landscape, with a 3D neighborhood.
  rect(c, 65, 41, 347, 173, '#546f61');
  rect(c, 69, 45, 339, 164, '#eee4c7');
  rect(c, 69, 45, 339, 18, '#d9d8b8');
  for (let i = 0; i < 3; i++)
    rect(c, 76 + i * 8, 51, 4, 4, ['#b37151', '#cfb45f', '#8ca36c'][i]!);
  rect(c, 105, 49, 219, 9, '#f2ebd4');
  text(c, 'quantum / explore your next home', 112, 56, 7, '#60725b');
  rect(c, 75, 68, 238, 134, '#b2c995');
  rect(c, 319, 68, 82, 134, '#f7efd8');
  polygon(
    c,
    [
      [84, 156],
      [191, 92],
      [304, 148],
      [196, 199],
    ],
    '#88aa79',
  );
  polygon(
    c,
    [
      [90, 160],
      [191, 102],
      [300, 148],
      [196, 193],
    ],
    '#a6c18a',
  );
  polygon(
    c,
    [
      [99, 153],
      [194, 107],
      [199, 111],
      [106, 158],
    ],
    '#e4d6ac',
  );
  polygon(
    c,
    [
      [171, 122],
      [177, 118],
      [270, 165],
      [263, 169],
    ],
    '#e4d6ac',
  );
  house(c, 132, 133, 0.67);
  house(c, 204, 144, 0.75, '#6a8c80');
  house(c, 182, 102, 0.51, '#bca162');
  tree(c, 112, 158, 0.55);
  tree(c, 255, 157, 0.6);
  tree(c, 216, 113, 0.45);
  tree(c, 169, 175, 0.5);
  // Selection outline sweeps around the featured property, like a site inspection.
  c.strokeStyle = '#f9edab';
  c.lineWidth = 1;
  c.setLineDash([3, 3]);
  c.strokeRect(201, 127, 48, 53);
  c.setLineDash([]);
  text(c, 'YOUR NEXT', 327, 83, 8, '#4e6b54');
  text(c, 'CHAPTER.', 327, 94, 8, '#4e6b54');
  rect(c, 327, 103, 65, 34, '#d3dbb8');
  house(c, 346, 116, 0.35);
  text(c, 'HOME 03', 327, 149, 8, '#4e6b54');
  text(c, '3D SHOWROOM', 327, 161, 6, '#6f7f5e');
  rect(c, 327, 171, 63, 16, '#527963');
  text(c, 'EXPLORE  >', 335, 182, 7, '#f4ebc3');
  const cx = 238 + Math.sin(t) * 9,
    cy = 169 + Math.cos(t) * 4;
  polygon(
    c,
    [
      [cx, cy],
      [cx, cy + 13],
      [cx + 4, cy + 9],
      [cx + 8, cy + 9],
    ],
    '#faf1c8',
  );
  if (Math.floor(t) % 3 === 0) {
    rect(c, 210, 122, 33, 3, '#f7e99c');
    text(c, 'SELECTED', 206, 117, 6, '#466c55');
  }
  rect(c, 203, 214, 70, 5, '#6b8266');
  rect(c, 233, 219, 10, 11, '#5c755c');
  rect(c, 206, 231, 66, 4, '#5c755c');
  person(c, 311, 234, t);
  house(c, 36, 214, 0.6);
  tree(c, 399, 204, 1.1);
  text(c, 'QUANTUM / A WORLD WITHIN A WORLD', 117, 251, 8, '#3f6047');
}
export function drawScene(c: Context, scene: string, t: number) {
  c.imageSmoothingEnabled = false;
  if (scene === 'garage') garage(c, t);
  else if (scene === 'broadcast') broadcast(c, t);
  else if (scene === 'houses') housing(c, t);
  else campus(c, t, scene === 'graduation');
}

// Simplified geographic outlines in longitude / latitude, rasterized onto a 4px grid.
const continents: number[][][] = [
  [
    [-168, 70],
    [-144, 72],
    [-129, 69],
    [-121, 75],
    [-99, 78],
    [-82, 73],
    [-60, 55],
    [-65, 47],
    [-78, 35],
    [-81, 25],
    [-89, 29],
    [-96, 20],
    [-86, 16],
    [-78, 8],
    [-91, 14],
    [-107, 24],
    [-118, 33],
    [-126, 49],
    [-139, 59],
    [-158, 58],
    [-166, 63],
  ],
  [
    [-73, 82],
    [-24, 82],
    [-20, 68],
    [-43, 59],
    [-54, 63],
    [-62, 72],
  ],
  [
    [-80, 11],
    [-64, 10],
    [-51, 2],
    [-35, -6],
    [-40, -22],
    [-53, -34],
    [-66, -55],
    [-73, -49],
    [-75, -28],
    [-81, -6],
  ],
  [
    [-11, 36],
    [-10, 44],
    [-1, 49],
    [5, 53],
    [8, 58],
    [18, 70],
    [30, 71],
    [38, 62],
    [54, 70],
    [90, 77],
    [120, 73],
    [140, 72],
    [179, 65],
    [172, 52],
    [155, 50],
    [142, 37],
    [129, 34],
    [123, 23],
    [109, 19],
    [107, 7],
    [100, 2],
    [94, 17],
    [86, 22],
    [78, 7],
    [70, 23],
    [58, 25],
    [51, 14],
    [43, 12],
    [35, 29],
    [28, 36],
    [23, 39],
    [17, 40],
    [13, 45],
    [7, 43],
    [2, 42],
  ],
  [
    [-17, 35],
    [10, 37],
    [29, 32],
    [35, 22],
    [42, 12],
    [51, 11],
    [42, -9],
    [34, -22],
    [25, -35],
    [16, -34],
    [10, -18],
    [8, 0],
    [-5, 5],
    [-17, 15],
  ],
  [
    [112, -12],
    [129, -11],
    [136, -15],
    [145, -13],
    [154, -26],
    [148, -38],
    [131, -33],
    [114, -35],
  ],
  [
    [-180, -72],
    [-135, -70],
    [-90, -74],
    [-55, -65],
    [-30, -73],
    [15, -70],
    [65, -67],
    [110, -70],
    [155, -74],
    [180, -73],
    [180, -88],
    [-180, -88],
  ],
  [
    [-8, 58],
    [-2, 59],
    [2, 51],
    [-6, 50],
  ],
  [
    [130, 32],
    [139, 36],
    [145, 45],
    [141, 30],
  ],
  [
    [47, -13],
    [51, -17],
    [47, -27],
    [43, -24],
  ],
  [
    [167, -35],
    [178, -38],
    [171, -46],
    [166, -47],
  ],
  [
    [96, 5],
    [106, -6],
    [119, -8],
    [125, -9],
    [117, -2],
    [109, 7],
  ],
  [
    [120, 19],
    [124, 17],
    [126, 7],
    [121, 5],
  ],
];
function inside(x: number, y: number, points: number[][]) {
  let hit = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const a = points[i]!,
      b = points[j]!;
    if (
      a[1]! > y !== b[1]! > y &&
      x < ((b[0]! - a[0]!) * (y - a[1]!)) / (b[1]! - a[1]!) + a[0]!
    )
      hit = !hit;
  }
  return hit;
}
const bases = new Map<string, HTMLCanvasElement>();
function makeMap(night: boolean) {
  const canvas = document.createElement('canvas');
  canvas.width = 960;
  canvas.height = 480;
  const c = canvas.getContext('2d')!;
  rect(c, 0, 0, 960, 480, night ? '#142a28' : '#e5eddb');
  // A subtle navigational grid and broken wavelets keep the ocean alive without noise.
  for (let y = 0; y < 480; y += 40)
    for (let x = 0; x < 960; x += 40)
      rect(c, x, y, 1, 1, night ? '#45665b' : '#bbcfb6');
  for (let i = 0; i < 160; i++) {
    const x = (i * 137) % 960,
      y = (i * 73) % 480;
    rect(c, x, y, 5 + (i % 5), 1, night ? '#22463d' : '#c9d9c5');
  }
  const land: boolean[][] = Array.from({ length: 120 }, () =>
    Array(240).fill(false),
  );
  for (let gy = 0; gy < 120; gy++)
    for (let gx = 0; gx < 240; gx++) {
      const lon = gx * 1.5 - 180,
        lat = 90 - gy * 1.5;
      land[gy]![gx] = continents.some((p) => inside(lon, lat, p));
    }
  for (let gy = 0; gy < 120; gy++)
    for (let gx = 0; gx < 240; gx++) {
      if (!land[gy]![gx]) continue;
      const edge =
        !land[gy + 1]?.[gx] ||
        !land[gy]?.[gx + 1] ||
        !land[gy - 1]?.[gx] ||
        !land[gy]?.[gx - 1];
      const hash = (gx * 73 + gy * 137) % 23;
      let color = night
        ? hash < 5
          ? '#466545'
          : '#3b593f'
        : hash < 5
          ? '#a7bc7d'
          : '#b5c98f';
      if (edge) color = night ? '#607753' : '#ccd5a0';
      if (gy < 21 || gy > 105) color = night ? '#7b9174' : '#d5ddbd';
      // Sahara / Arabian peninsula and the Australian interior.
      if (
        (gx > 113 && gx < 143 && gy > 39 && gy < 55) ||
        (gx > 198 && gx < 219 && gy > 72 && gy < 84)
      )
        color = night ? '#726f46' : '#d5ca91';
      rect(c, gx * 4, gy * 4, 4, 4, color);
      if (!edge && hash === 0 && gy > 20 && gy < 95 && color !== '#d5ca91')
        rect(c, gx * 4, gy * 4, 2, 2, night ? '#55734b' : '#91ae72');
    }
  // Tiny forests, stepped mountains, and towns, spread across the world.
  for (let i = 0; i < 140; i++) {
    const x = (i * 173 + 63) % 930,
      y = (i * 89 + 37) % 400,
      gx = Math.floor(x / 4),
      gy = Math.floor(y / 4);
    if (land[gy]?.[gx] && land[gy + 3]?.[gx] && gy > 22 && gy < 93) {
      if (i % 5 === 0) {
        rect(c, x, y, 4, 3, night ? '#b7b077' : '#e4d7ac');
        rect(c, x - 1, y - 2, 6, 2, night ? '#786852' : '#a58b63');
      } else pine(c, x, y, 0.28);
    }
  }
  for (const [mx, my] of [
    [185, 120],
    [191, 139],
    [204, 160],
    [311, 286],
    [318, 305],
    [588, 144],
    [664, 150],
    [675, 154],
    [690, 155],
  ]) {
    rect(c, mx! - 4, my! + 5, 16, 6, night ? '#83916c' : '#9eaf85');
    rect(c, mx!, my!, 8, 6, night ? '#a7af8a' : '#c0cbb0');
    rect(c, mx! + 2, my! - 3, 4, 5, '#e3e6c6');
  }
  // Great Lakes, deliberately visible around the Michigan marker.
  polygon(
    c,
    [
      [244, 117],
      [260, 113],
      [267, 117],
      [258, 120],
      [260, 127],
      [257, 133],
      [253, 129],
      [254, 123],
    ],
    night ? '#193a35' : '#d5e5d3',
  );
  text(
    c,
    'N O R T H  A M E R I C A',
    128,
    199,
    9,
    night ? '#b0bc86' : '#74865f',
  );
  text(c, 'S O U T H', 271, 279, 9, night ? '#b0bc86' : '#778663');
  text(c, 'A M E R I C A', 265, 290, 9, night ? '#b0bc86' : '#778663');
  text(c, 'E U R O P E', 496, 86, 9, night ? '#b0bc86' : '#778663');
  text(c, 'A F R I C A', 480, 245, 10, night ? '#b0bc86' : '#778663');
  text(c, 'A S I A', 682, 119, 12, night ? '#b0bc86' : '#778663');
  text(c, 'A U S T R A L I A', 782, 347, 9, night ? '#b0bc86' : '#778663');
  text(c, 'P A C I F I C', 50, 278, 9, night ? '#607f72' : '#9ab29c');
  text(c, 'A T L A N T I C', 364, 225, 9, night ? '#607f72' : '#9ab29c');
  text(c, 'I N D I A N  O C E A N', 617, 315, 9, night ? '#607f72' : '#9ab29c');
  bases.set(night ? 'night' : 'day', canvas);
  return canvas;
}
const points = [
  [256, 126],
  [509, 109],
  [256, 126],
  [270, 145],
  [270, 145],
];
export function flightPoint(
  from: number[],
  to: number[],
  p: number,
  returning = false,
) {
  const arc = Math.abs(to[0]! - from[0]!) > 100 ? (returning ? 70 : 92) : 23;
  return [
    from[0]! + (to[0]! - from[0]!) * p,
    from[1]! + (to[1]! - from[1]!) * p - Math.sin(p * Math.PI) * arc,
  ];
}
function plane(c: Context, x: number, y: number, t: number, direction: number) {
  c.save();
  c.translate(Math.round(x), Math.round(y));
  c.scale(direction, 1);
  rect(c, -8, 9, 22, 3, '#34534122');
  rect(c, -10, -2, 23, 5, '#fbf0c9');
  rect(c, 10, -1, 6, 3, '#fbf0c9');
  rect(c, -3, -5, 6, 11, '#fbf0c9');
  rect(c, -5, -11, 5, 20, '#fbf0c9');
  rect(c, -10, -7, 4, 13, '#c17649');
  rect(c, 5, -2, 5, 2, '#537e70');
  rect(c, -3, 8, 3, 2, '#bd7754');
  rect(c, -16, -1, Math.floor(t * 8) % 2 ? 3 : 5, 1, '#c1cca7');
  c.restore();
}
export function drawMap(
  c: Context,
  night: boolean,
  t: number,
  active: number,
  flight: {
    from: number[];
    to: number[];
    progress: number;
    returning: boolean;
  } | null,
) {
  c.imageSmoothingEnabled = false;
  c.drawImage(bases.get(night ? 'night' : 'day') ?? makeMap(night), 0, 0);
  const routeColor = night ? '#c7b574' : '#aa8259';
  for (let leg = 0; leg < 3; leg++) {
    for (let i = 0; i < 50; i++) {
      if (i % 3 === 2) continue;
      const p = flightPoint(points[leg]!, points[leg + 1]!, i / 49, leg === 1);
      rect(c, p[0]!, p[1]!, 2, 2, routeColor);
    }
  }
  for (const p of [points[0]!, points[1]!, points[3]!]) {
    rect(c, p[0]! - 4, p[1]! - 4, 9, 9, night ? '#d7c27f' : '#f6e9b6');
    rect(c, p[0]! - 2, p[1]! - 2, 5, 5, night ? '#6b8357' : '#a6603d');
  }
  if (flight && flight.progress < 1) {
    const p = flightPoint(
      flight.from,
      flight.to,
      flight.progress,
      flight.returning,
    );
    plane(c, p[0]!, p[1]!, t, flight.to[0]! < flight.from[0]! ? -1 : 1);
  } else {
    const p = points[active]!;
    person(c, p[0]! + 4, p[1]! - 10, t, active === 2);
  }
  // Tiny ship crossing the Atlantic.
  const sx = 380 + Math.sin(t * 0.08) * 18;
  rect(c, sx, 274, 18, 5, night ? '#8c805d' : '#a38a60');
  rect(c, sx + 4, 265, 8, 9, night ? '#afac7d' : '#eee1b3');
  rect(c, sx + 7, 260, 2, 5, '#8c805d');
  if (Math.floor(t) % 2 === 0)
    rect(c, sx - 7, 281, 10, 1, night ? '#405f4a' : '#bdcfb6');
}

export function resetMapArt() {
  bases.clear();
}
