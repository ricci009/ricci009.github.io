/**
 * Shape-aware colored ASCII. Independent implementation of the techniques in:
 * https://alexharri.com/blog/ascii-rendering
 *
 * Measure the actual font in six staggered circular regions, normalize each
 * component, then match supersampled scene regions after directional and local
 * contrast enhancement. Matching happens once per cell on the GPU; a second
 * pass draws a glyph atlas at device resolution. There is no CPU pixel readback.
 */
import * as THREE from 'three';

// A restrained geometric alphabet avoids letter-like speckle on small objects.
const GLYPHS = ' .,:;-~=+*%#@/\\|_()[]<>!';
const TILE_W = 32;
const TILE_H = 56;
const ATLAS_COLUMNS = 16;
const ATLAS_ROWS = 6;
const REGIONS: readonly [number, number][] = [
  [.25, .20], [.75, .14], [.25, .53], [.75, .47], [.25, .86], [.75, .80],
];
const RADIUS = .40;

const vertexShader = `
  varying vec2 uvOut;
  void main() { uvOut = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

function buildFont() {
  const atlas = document.createElement('canvas');
  atlas.width = TILE_W * ATLAS_COLUMNS;
  atlas.height = TILE_H * ATLAS_ROWS;
  const ctx = atlas.getContext('2d', { willReadFrequently: true })!;
  ctx.fillStyle = '#ffffff';
  ctx.font = '48px Consolas, "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  for (let i = 1; i < GLYPHS.length; i++) {
    ctx.fillText(GLYPHS[i]!, (i % ATLAS_COLUMNS) * TILE_W + TILE_W / 2,
      Math.floor(i / ATLAS_COLUMNS) * TILE_H + 42);
  }
  const alpha = ctx.getImageData(0, 0, atlas.width, atlas.height).data;
  const vectors = new Float32Array(GLYPHS.length * 6);
  const maximum = new Float32Array(6);
  // Use the same font, bounds, and circles that the fragment shader will sample.
  for (let glyph = 0; glyph < GLYPHS.length; glyph++) {
    const left = (glyph % ATLAS_COLUMNS) * TILE_W;
    const top = Math.floor(glyph / ATLAS_COLUMNS) * TILE_H;
    for (let component = 0; component < 6; component++) {
      const [cx, cy] = REGIONS[component]!;
      let sum = 0, count = 0;
      for (let y = 0; y < TILE_H; y++) for (let x = 0; x < TILE_W; x++) {
        const dx = (x + .5) / TILE_W - cx;
        const dy = ((y + .5) / TILE_H - cy) * TILE_H / TILE_W;
        if (dx * dx + dy * dy <= RADIUS * RADIUS) {
          sum += alpha[((top + y) * atlas.width + left + x) * 4 + 3]! / 255;
          count++;
        }
      }
      const value = sum / count;
      vectors[glyph * 6 + component] = value;
      maximum[component] = Math.max(maximum[component]!, value);
    }
  }
  // RGB rows carry the first/last three dimensions; alpha is unused.
  const data = new Float32Array(GLYPHS.length * 2 * 4);
  for (let glyph = 0; glyph < GLYPHS.length; glyph++) for (let d = 0; d < 6; d++) {
    data[(Math.floor(d / 3) * GLYPHS.length + glyph) * 4 + d % 3] =
      vectors[glyph * 6 + d]! / maximum[d]!;
  }
  const descriptors = new THREE.DataTexture(data, GLYPHS.length, 2, THREE.RGBAFormat, THREE.FloatType);
  descriptors.minFilter = descriptors.magFilter = THREE.NearestFilter;
  descriptors.needsUpdate = true;
  const texture = new THREE.CanvasTexture(atlas);
  texture.minFilter = texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = THREE.NoColorSpace;
  return { texture, descriptors };
}

const matchShader = `
  uniform sampler2D sourceImage;
  uniform sampler2D glyphShapes;
  uniform vec2 grid;

  float lightAt(vec2 cell, vec2 location) {
    vec2 uv = (cell + vec2(location.x, 1.0 - location.y)) / grid;
    if (any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))) return 0.0;
    vec3 rgb = texture2D(sourceImage, uv).rgb;
    return pow(clamp(dot(rgb, vec3(.2126, .7152, .0722)), 0.0, 1.0), .8);
  }

  float disk(vec2 cell, vec2 p) {
    // Nine distributed taps in a circular footprint; the aspect matches the atlas.
    vec2 r = vec2(.28, .28 * ${TILE_W.toFixed(1)} / ${TILE_H.toFixed(1)});
    float v = lightAt(cell, p);
    v += lightAt(cell, p + vec2(r.x, 0.0));
    v += lightAt(cell, p - vec2(r.x, 0.0));
    v += lightAt(cell, p + vec2(0.0, r.y));
    v += lightAt(cell, p - vec2(0.0, r.y));
    v += lightAt(cell, p + r * vec2(.707, .707));
    v += lightAt(cell, p + r * vec2(-.707, .707));
    v += lightAt(cell, p + r * vec2(.707, -.707));
    v += lightAt(cell, p - r * .707);
    return v / 9.0;
  }

  float compress(float value, float reference, float strength) {
    float peak = max(value, reference);
    return peak < .00001 ? 0.0 : peak * pow(value / peak, strength);
  }

  void main() {
    vec2 cell = floor(gl_FragCoord.xy);
    float a[6];
    ${REGIONS.map(([x,y],i)=>`a[${i}] = disk(cell, vec2(${x.toFixed(3)}, ${y.toFixed(3)}));`).join('\n')}
    float peak = max(max(max(a[0],a[1]),max(a[2],a[3])),max(a[4],a[5]));
    if (peak < .025) { gl_FragColor = vec4(0.0,0.0,0.0,1.0); return; }

    // A ten-region halo. Each side influences more than one internal region,
    // which avoids abruptly stopping contrast enhancement at a cell boundary.
    float upperL = disk(cell, vec2(.18, -.28));
    float upperR = disk(cell, vec2(.82, -.28));
    float leftT  = disk(cell, vec2(-.35, .08));
    float rightT = disk(cell, vec2(1.35, .08));
    float leftM  = disk(cell, vec2(-.35, .50));
    float rightM = disk(cell, vec2(1.35, .50));
    float leftB  = disk(cell, vec2(-.35, .92));
    float rightB = disk(cell, vec2(1.35, .92));
    float lowerL = disk(cell, vec2(.18, 1.28));
    float lowerR = disk(cell, vec2(.82, 1.28));
    a[0] = compress(a[0], max(max(upperL,upperR),max(leftT,leftM)), 2.0);
    a[1] = compress(a[1], max(max(upperL,upperR),max(rightT,rightM)), 2.0);
    a[2] = compress(a[2], max(leftT,max(leftM,leftB)), 2.0);
    a[3] = compress(a[3], max(rightT,max(rightM,rightB)), 2.0);
    a[4] = compress(a[4], max(max(lowerL,lowerR),max(leftM,leftB)), 2.0);
    a[5] = compress(a[5], max(max(lowerL,lowerR),max(rightM,rightB)), 2.0);
    peak = max(max(max(a[0],a[1]),max(a[2],a[3])),max(a[4],a[5]));
    for (int d=0;d<6;d++) a[d]=compress(a[d],peak,1.65);
    vec3 upper=vec3(a[0],a[1],a[2]);
    vec3 lower=vec3(a[3],a[4],a[5]);
    float nearest=1000.0;
    float selected=0.0;
    // This pass runs once per CHARACTER, never once per output pixel.
    for (int glyph=0;glyph<${GLYPHS.length};glyph++) {
      float u=(float(glyph)+.5)/${GLYPHS.length.toFixed(1)};
      vec3 deltaA=upper-texture2D(glyphShapes,vec2(u,.25)).rgb;
      vec3 deltaB=lower-texture2D(glyphShapes,vec2(u,.75)).rgb;
      float error=dot(deltaA,deltaA)+dot(deltaB,deltaB);
      if(error<nearest){nearest=error;selected=float(glyph);}
    }
    gl_FragColor=vec4(selected/255.0,0.0,0.0,1.0);
  }
`;

const drawShader = `
  uniform sampler2D selectedGlyphs;
  uniform sampler2D atlas;
  uniform sampler2D sourceImage;
  uniform vec2 grid;
  uniform float mobileDetail;
  varying vec2 uvOut;
  void main() {
    vec2 cell=floor(uvOut*grid);
    float glyph=floor(texture2D(selectedGlyphs,(cell+.5)/grid).r*255.0+.5);
    vec2 local=fract(uvOut*grid);
    vec2 tile=vec2(mod(glyph,16.0),5.0-floor(glyph/16.0));
    float ink=texture2D(atlas,(tile+local)/vec2(16.0,6.0)).a;
    // Stable color per character, sampled across the cell rather than per output
    // pixel. A quiet color bed keeps broad surfaces solid between the glyphs.
    vec2 center=(cell+.5)/grid;
    vec2 offset=.27/grid;
    vec3 rgb=texture2D(sourceImage,center).rgb*2.0;
    rgb+=texture2D(sourceImage,center+offset).rgb;
    rgb+=texture2D(sourceImage,center-offset).rgb;
    rgb+=texture2D(sourceImage,center+vec2(offset.x,-offset.y)).rgb;
    rgb+=texture2D(sourceImage,center+vec2(-offset.x,offset.y)).rgb;
    rgb/=6.0;
    vec3 color=pow(clamp(rgb,0.0,1.0),vec3(1.0/2.2));
    float peak=max(color.r,max(color.g,color.b));
    vec3 inkColor=color/max(peak,.001)*(.65+.35*peak);
    vec3 surface=color*.24;
    vec3 asciiColor=mix(surface,inkColor,ink);
    // On the small desk, preserve continuous geometry and lighting beneath a
    // lighter character layer. Cell-averaged color alone erases thin features.
    vec3 detail=pow(clamp(texture2D(sourceImage,uvOut).rgb,0.0,1.0),vec3(1.0/2.2));
    gl_FragColor=vec4(mix(asciiColor,detail,mobileDetail),1.0);
  }
`;

export class AsciiShapeRenderer {
  private renderer: THREE.WebGLRenderer;
  private source = new THREE.WebGLRenderTarget(1,1,{ minFilter:THREE.LinearFilter, magFilter:THREE.LinearFilter, samples:4 });
  private selected = new THREE.WebGLRenderTarget(1,1,{ minFilter:THREE.NearestFilter, magFilter:THREE.NearestFilter, depthBuffer:false });
  private font = buildFont();
  private grid = new THREE.Vector2(1,1);
  private plane = new THREE.PlaneGeometry(2,2);
  private camera = new THREE.Camera();
  private passScene = new THREE.Scene();
  private match: THREE.ShaderMaterial;
  private draw: THREE.ShaderMaterial;
  private quad: THREE.Mesh;

  constructor(renderer:THREE.WebGLRenderer) {
    this.renderer=renderer;
    this.source.texture.colorSpace=THREE.NoColorSpace;
    this.match=new THREE.ShaderMaterial({vertexShader,fragmentShader:matchShader,depthTest:false,depthWrite:false,toneMapped:false,
      uniforms:{sourceImage:{value:this.source.texture},glyphShapes:{value:this.font.descriptors},grid:{value:this.grid}}});
    this.draw=new THREE.ShaderMaterial({vertexShader,fragmentShader:drawShader,depthTest:false,depthWrite:false,toneMapped:false,
      uniforms:{selectedGlyphs:{value:this.selected.texture},atlas:{value:this.font.texture},sourceImage:{value:this.source.texture},grid:{value:this.grid},mobileDetail:{value:0}}});
    this.quad=new THREE.Mesh(this.plane,this.match);this.quad.frustumCulled=false;this.passScene.add(this.quad);
  }

  resize(width:number,height:number,large:boolean,mobileDesk=false) {
    // Exact atlas aspect, square sampling in physical space, and high-DPI output.
    const cellWidth=mobileDesk ? (large?5:3) : (large?9:5);
    const columns=Math.max(24,Math.floor(width/cellWidth));
    const rows=Math.max(20,Math.round(height/(width/columns*TILE_H/TILE_W)));
    this.grid.set(columns,rows);
    const pixelRatio=Math.min(devicePixelRatio||1,mobileDesk?3:2);
    this.source.setSize(
      Math.max(columns*8,mobileDesk?Math.round(width*pixelRatio):0),
      Math.max(rows*14,mobileDesk?Math.round(height*pixelRatio):0),
    );
    this.selected.setSize(columns,rows);
    this.draw.uniforms.mobileDetail!.value=mobileDesk ? 0.6 : 0;
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(width,height,false);
  }

  render(scene:THREE.Scene,camera:THREE.Camera) {
    const r=this.renderer;
    r.setRenderTarget(this.source);r.render(scene,camera);
    this.quad.material=this.match;r.setRenderTarget(this.selected);r.render(this.passScene,this.camera);
    this.quad.material=this.draw;r.setRenderTarget(null);r.render(this.passScene,this.camera);
  }

  dispose() {
    this.source.dispose();this.selected.dispose();this.font.texture.dispose();this.font.descriptors.dispose();
    this.match.dispose();this.draw.dispose();this.plane.dispose();
  }
}
