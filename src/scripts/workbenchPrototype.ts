// THROWAWAY: three visual compositions, shared pixel objects, in-memory discovery only.
export {};
const root = document.querySelector<HTMLElement>('#workbench-prototype')!;
const canvas = root.querySelector<HTMLCanvasElement>('canvas')!;
const ctx = canvas.getContext('2d')!;
ctx.imageSmoothingEnabled = false;
type Key = 'smt' | 'edag' | 'quantum' | 'michigan' | 'notes' | 'rust';
type Bounds = [number, number, number, number];
type Variant = 'A' | 'B' | 'C';
const visited = new Set<Key>();
const variants: Variant[] = ['A', 'B', 'C'];
const names = { A: 'The front-row desk', B: 'The overhead workbench', C: 'The studio corner' };
const titles: Record<Key, string> = { smt: 'SMT', edag: 'EDAG', quantum: 'Quantum', michigan: 'Michigan', notes: 'Field notes', rust: 'Open source' };
const objectNames: Record<Key, string> = { smt: 'THE BROADCAST MONITOR', edag: 'THE CIRCUIT BOARD', quantum: 'THE ARCHITECTURAL MODEL', michigan: 'THE DIPLOMA', notes: 'THE NOTEBOOK', rust: 'THE LITTLE CARTRIDGE' };
const bounds: Record<Variant, Record<Key, Bounds>> = {
  A: { smt: [307,143,179,130], edag: [132,264,92,61], quantum: [510,238,112,79], michigan: [127,142,90,69], notes: [250,290,75,49], rust: [552,162,39,47] },
  B: { smt: [308,39,190,115], edag: [238,212,103,70], quantum: [518,155,116,88], michigan: [485,292,91,63], notes: [379,239,77,69], rust: [615,288,39,48] },
  C: { smt: [332,151,154,113], edag: [242,260,85,57], quantum: [503,218,103,73], michigan: [177,89,83,65], notes: [392,301,70,46], rust: [541,127,36,44] },
};
let variant: Variant = 'A';
function r(x:number,y:number,w:number,h:number,color:string) {ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function poly(points:number[][],color:string) {ctx.fillStyle=color;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x!,y!):ctx.moveTo(x!,y!));ctx.closePath();ctx.fill();}
function line(points:number[][],color:string,width=1) {ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x!,y!):ctx.moveTo(x!,y!));ctx.stroke();}
function oval(x:number,y:number,rx:number,ry:number,color:string) {for(let dy=-ry;dy<=ry;dy+=2){const dx=Math.floor(rx*Math.sqrt(1-dy*dy/(ry*ry)));r(x-dx,y+dy,dx*2,2,color);}}
function text(str:string,x:number,y:number,size:number,color:string) {ctx.fillStyle=color;ctx.font=`bold ${size}px monospace`;ctx.fillText(str,x,y);}
function sprite(box:Bounds,w:number,h:number,fn:()=>void) {ctx.save();ctx.translate(box[0],box[1]);ctx.scale(box[2]/w,box[3]/h);fn();ctx.restore();}
function plant(x:number,y:number,s=1) {ctx.save();ctx.translate(x,y);ctx.scale(s,s);r(10,21,3,27,'#637454');poly([[10,32],[0,24],[1,18],[8,19],[12,28]],'#758260');poly([[12,26],[17,13],[23,12],[24,17],[16,28]],'#89956a');poly([[10,21],[4,13],[5,7],[11,9],[14,20]],'#536c52');poly([[13,17],[12,4],[17,0],[20,5],[17,18]],'#74825a');r(2,38,24,5,'#a1694f');r(5,43,19,18,'#ba805f');r(8,45,4,13,'#cf9873');r(7,61,15,3,'#895943');ctx.restore();}
function house(x:number,y:number,s=1) {ctx.save();ctx.translate(x,y);ctx.scale(s,s);poly([[0,12],[15,17],[15,36],[0,31]],'#e5cfaa');poly([[15,17],[33,8],[33,27],[15,36]],'#b6b6a1');poly([[-3,11],[12,0],[21,4],[15,20]],'#a75f45');poly([[12,0],[30,-8],[39,5],[21,14]],'#c18561');poly([[21,14],[39,5],[39,8],[21,18]],'#805c49');r(4,19,5,6,'#5e7875');r(17,25,5,8,'#61716a');r(26,15,4,6,'#718a86');r(23,-7,4,10,'#9b7054');ctx.restore();}
function windowAt(x:number,y:number,w:number,h:number) {r(x-5,y-5,w+10,h+10,'#cec2a8');r(x,y,w,h,'#6d8f91');r(x+4,y+4,w-8,h-8,'#c3d5ca');r(x+5,y+h*.6,w-10,h*.35,'#a5b6a2');r(x+w*.65,y+12,12,12,'#ecdda3');r(x+w*.65+3,y+9,6,18,'#ecdda3');for(let i=0;i<5;i++){const bx=x+6+i*(w-14)/5;r(bx,y+h*.7-i%2*6,13,h*.25,'#9aaa93');r(bx+2,y+h*.7-i%2*6+3,3,5,'#c3cbb4');}r(x+w/2-2,y,4,h,'#e1d5b7');r(x,y+h*.49,w,4,'#e1d5b7');r(x-8,y+h,w+16,5,'#a89473');r(x-5,y+h+5,w+10,3,'#c4b08b');}
function monitor(box:Bounds) {sprite(box,180,130,()=>{
  r(6,9,176,94,'#b6b09a');r(2,3,174,96,'#5d685e');r(0,8,178,84,'#6b776b');r(5,3,166,4,'#86907d');r(3,91,172,8,'#4c5c51');r(9,11,158,72,'#233e34');r(13,15,150,64,'#43694f');
  for(let i=0;i<9;i++)r(14+i*17,16,8,62,i%2?'#557955':'#4b7050');
  for(let i=1;i<6;i++)r(15+i*24,18,1,58,'#9caf77');r(14,19,148,1,'#b4c98e');r(14,74,148,1,'#b4c98e');r(87,18,1,57,'#b4c98e');
  line([[62,39],[69,32],[79,30],[89,34],[94,42],[92,50],[83,55],[72,54],[63,48],[62,39]],'#b4c98e');
  const players=[[34,43],[55,31],[71,58],[107,47],[120,28],[139,55],[97,29],[44,60]];
  players.forEach(([x,y],i)=>{r(x!,y!,3,2,'#dccb9c');r(x!-1,y!+2,5,4,i%2?'#e6d7ae':'#b57554');r(x!,y!+6,1,3,'#223e33');r(x!+3,y!+6,1,3,'#223e33');});
  line([[39,58],[58,51],[77,40],[92,37],[112,38],[132,44]],'#e1bf62',2);for(let i=0;i<6;i++)r(49+i*16,53-i*2,2,2,'#f3e1a1');r(110,23,2,47,'#d5bb6b');
  r(15,16,37,9,'#234138');text('SMT',18,23,7,'#dfe5be');r(130,16,30,8,'#b27353');text('LIVE',133,22,6,'#f0dfb7');
  r(15,66,59,10,'#243e37');r(15,66,3,10,'#c2a35d');text('SPORTS GRAPHICS',22,73,5,'#e1e2bc');
  for(let i=0;i<5;i++)r(13+i*5,89,3,2,'#394d42');r(158,88,3,3,visited.has('smt')?'#cce693':'#91af76');r(144,88,7,3,'#2c4438');
  r(72,99,31,17,'#657365');r(76,99,22,15,'#85917c');poly([[66,113],[110,113],[122,124],[52,124]],'#63725f');r(54,124,67,4,'#4d5e4e');r(62,117,48,3,'#8b967d');
});}
function circuit(box:Bounds) {sprite(box,100,68,()=>{
  r(3,4,98,65,'#896c4e');r(0,0,97,64,'#3f6650');r(3,3,91,58,'#4c7759');
  for(let i=0;i<7;i++){const y=8+i*7;line([[5,y],[20+i%3*4,y],[27+i%3*4,y+5],[84,y+5]],'#91a66e');r(88,y,3,2,'#c8b378');}
  r(32,18,34,28,'#273e35');r(36,22,26,20,'#3c4c3e');text('MCU',40,35,6,'#899978');
  for(let i=0;i<7;i++){r(33+i*5,14,2,4,'#b6b281');r(33+i*5,46,2,4,'#b6b281');}
  for(let i=0;i<5;i++){r(28,21+i*5,4,2,'#b6b281');r(66,21+i*5,4,2,'#b6b281');}
  r(6,8,14,12,'#a5a78c');r(4,11,12,7,'#314b40');r(75,9,9,14,'#2b453c');r(77,8,5,3,'#b2b69a');
  for(let i=0;i<5;i++){r(13+i*5,57,3,9,'#c5b16f');r(74+i*3,45,2,9,'#d0c29a');}r(9,31,5,8,'#c3b278');r(9,34,5,2,'#9a654d');
  [[5,5],[90,5],[5,56],[90,56]].forEach(([x,y])=>{r(x!,y!,3,3,'#ccd2a9');r(x!+1,y!+1,1,1,'#314e3b');});
});}
function model(box:Bounds) {sprite(box,120,90,()=>{
  poly([[2,41],[66,14],[119,38],[119,62],[53,90],[2,65]],'#a78d64');poly([[2,37],[65,9],[119,34],[55,65]],'#8caa7b');poly([[2,37],[55,65],[55,83],[2,57]],'#c5b68a');poly([[55,65],[119,34],[119,53],[55,83]],'#9f9e79');
  poly([[18,41],[79,17],[87,21],[28,46]],'#d0c9a5');poly([[53,24],[63,20],[98,42],[88,47]],'#d0c9a5');
  house(15,31,.7);house(55,19,.7);house(72,41,.65);r(103,25,2,16,'#7c6c48');oval(104,23,7,8,'#5b7f55');r(39,49,2,13,'#7c6c48');oval(40,45,6,7,'#668958');r(55,72,13,2,'#d6cba5');
});}
function diploma(box:Bounds) {sprite(box,100,76,()=>{
  r(3,4,98,74,'#c5b69a');r(0,0,98,73,'#765d43');r(3,3,92,67,'#bd9e6e');r(7,7,84,59,'#f2e6c3');r(10,10,78,53,'#faf0d0');r(10,10,78,1,'#d0b889');r(10,62,78,1,'#d0b889');
  r(42,18,5,14,'#3e5673');r(55,18,5,14,'#3e5673');r(46,21,4,6,'#3e5673');r(52,21,4,6,'#3e5673');r(49,24,4,5,'#3e5673');
  text('MICHIGAN',29,40,7,'#8f7c58');r(24,44,53,1,'#bdb08b');r(33,48,34,1,'#bdb08b');r(37,51,26,1,'#bdb08b');r(47,55,6,6,'#c9a255');r(49,56,2,3,'#ecd898');
});}
function notebook(box:Bounds) {sprite(box,80,54,()=>{
  r(7,5,73,50,'#a68a63');r(4,3,73,48,'#ded3ae');r(0,0,73,47,'#bb825e');r(5,2,66,42,'#c6946e');r(4,0,3,47,'#815e47');r(13,8,47,27,'#e2d4ac');text('FIELD',22,20,7,'#846f50');text('NOTES',22,29,7,'#846f50');r(64,0,3,49,'#6e6e4f');r(12,49,60,1,'#b9aa87');
  poly([[71,14],[74,14],[80,46],[77,47]],'#4f6f68');r(76,39,3,5,'#d6b66c');
});}
function cartridge(box:Bounds) {sprite(box,42,51,()=>{
  r(4,3,38,48,'#9c8269');r(0,0,38,47,'#a76f56');r(3,3,32,38,'#bc8666');r(5,10,28,24,'#ede0ba');r(12,16,14,12,'#815740');text('R',16,25,10,'#eadbb3');r(7,4,24,3,'#8b5c48');r(8,40,22,7,'#5f5b45');for(let i=0;i<5;i++)r(10+i*4,42,2,5,'#bca36b');
});}
const drawObject: Record<Key,(box:Bounds)=>void> = {smt:monitor,edag:circuit,quantum:model,michigan:diploma,notes:notebook,rust:cartridge};
function keyboard(x:number,y:number,w=110) {r(x+3,y+4,w,26,'#897b60');poly([[x+3,y],[x+w-5,y],[x+w,y+23],[x,y+23]],'#b6b7a1');for(let row=0;row<3;row++)for(let i=0;i<14;i++)r(x+5+i*(w-12)/14,y+3+row*5,4,3,'#e0ddbd');r(x+28,y+19,w-56,2,'#d5d0ae');}
function mug(x:number,y:number) {r(x+4,y+4,17,21,'#b6b39a');r(x+1,y+1,18,22,'#e4dfbd');r(x+3,y,14,3,'#b8b28c');r(x+5,y+1,10,2,'#6b5d42');r(x+19,y+5,7,12,'#d7d3b0');r(x+19,y+8,4,6,'#c0b28b');r(x+6,y+8,6,7,'#73876b');}
function dust(x:number,y:number,w:number,h:number,c:string,n=65) {for(let i=0;i<n;i++)r(x+(i*73%w),y+(i*47%h),i%3+1,1,c);}
function VariantA() {
  r(0,0,720,400,'#f3eee1');r(95,67,560,237,'#ece6d5');r(95,300,560,3,'#d6ccb5');r(95,303,560,54,'#e6ddc7');
  for(let i=0;i<12;i++)r(95+i*48,304,1,51,'#ded3ba');
  windowAt(523,37,105,87);poly([[532,132],[625,132],[691,292],[581,292]],'#f3e9cf');
  r(115,219,125,6,'#b49770');r(122,225,4,12,'#9b805b');r(229,225,4,12,'#9b805b');r(527,213,86,5,'#b99a70');r(534,218,4,10,'#9b805b');
  oval(375,368,251,13,'#dcd3bc');r(123,323,12,47,'#9a805e');r(610,323,12,47,'#9a805e');r(131,326,7,41,'#b09870');r(600,326,12,43,'#b09870');
  poly([[107,251],[621,251],[648,305],[87,305]],'#c6a276');r(87,305,561,19,'#ab835b');r(87,305,561,4,'#dcc194');r(90,322,556,3,'#8f704f');r(353,311,66,4,'#866b4e');r(353,309,66,2,'#c2a378');
  for(let i=0;i<8;i++)r(109+i*67,259+i%3*8,43,1,'#b9956d');dust(115,258,508,43,'#be986a',80);
  line([[396,261],[396,276],[468,276],[468,264],[510,264]],'#7b7b5d',2);
  keyboard(346,281,110);mug(467,262);plant(99,212,.8);plant(594,123,.8);
  r(273,203,24,29,'#d6c99d');r(276,205,18,1,'#c6b98b');text('build',277,216,5,'#8a8565');text('things.',276,222,5,'#8a8565');
}
function VariantB() {
  r(0,0,720,400,'#e9dfc6');r(198,11,510,374,'#ae8b62');r(192,5,510,374,'#d6b78b');r(192,5,510,5,'#ead0a0');
  for(let row=0;row<6;row++){r(193,22+row*61,508,1,'#bd9c71');for(let i=0;i<14;i++)r(200+i*36,28+row*61+i%3*7,20,1,'#ccaa7c');}dust(200,12,495,360,'#cfad7e',200);
  r(230,179,244,148,'#557568');r(232,181,240,144,'#638273');for(let i=0;i<18;i++)r(233+i*14,182,1,142,'#72907a');for(let i=0;i<11;i++)r(233,182+i*14,238,1,'#72907a');
  r(585,27,70,83,'#e8d8ac');r(582,24,70,83,'#f1e5bf');for(let i=0;i<7;i++)r(591,42+i*7,48-i%3*7,1,'#d4c89f');r(602,18,25,11,'#657468');r(607,20,15,6,'#bdc1a4');
  keyboard(345,164,115);mug(533,81);plant(243,30,1.1);
  line([[302,136],[282,136],[282,174],[262,174],[262,197]],'#646b51',2);
  r(215,340,150,13,'#e6cf96');for(let i=0;i<30;i++)r(219+i*5,341,1,i%5?4:7,'#a68c58');
  poly([[356,219],[359,218],[373,306],[370,307]],'#c26d4e');r(355,213,3,7,'#3b5750');r(371,304,2,5,'#f3deaa');
  r(552,119,34,23,'#cfb865');text('hello!',556,132,6,'#7f744d');
}
function VariantC() {
  r(0,0,720,400,'#f3eee1');poly([[125,114],[396,32],[666,126],[395,229]],'#ede1c7');poly([[125,114],[395,201],[395,345],[125,258]],'#e3d4b8');poly([[395,201],[666,126],[666,268],[395,345]],'#d8c9a8');
  poly([[125,258],[395,345],[666,268],[393,183]],'#c2aa86');for(let i=0;i<7;i++)line([[146+i*32,265+i*10],[413+i*32,187+i*10]],'#b29a78');
  poly([[188,283],[376,341],[581,284],[393,229]],'#7e967b');poly([[203,282],[376,333],[565,283],[393,237]],'#93a487');
  windowAt(548,49,66,64);r(508,174,105,6,'#9b815b');r(514,180,4,13,'#b19770');
  r(222,266,12,62,'#8e7759');r(597,266,11,58,'#8e7759');r(233,266,7,57,'#ad926b');r(586,266,10,53,'#ad926b');
  poly([[242,238],[587,209],[623,271],[210,296]],'#c7a475');poly([[210,296],[623,271],[623,284],[210,309]],'#a17d55');r(211,296,13,3,'#d2b689');
  keyboard(356,269,92);mug(469,263);plant(166,194,1.3);plant(617,229,.7);
  r(272,124,38,2,'#ad936b');r(275,126,3,25,'#ad936b');r(281,128,24,17,'#e6d49f');text('IDEAS',284,139,5,'#8f7e59');
  r(292,157,29,27,'#c4b174');r(295,161,22,1,'#9d925e');r(295,166,16,1,'#9d925e');r(295,171,19,1,'#9d925e');
}
function draw() {
  ctx.clearRect(0,0,720,400);({A:VariantA,B:VariantB,C:VariantC}[variant])();
  const entries=Object.entries(bounds[variant]) as [Key,Bounds][];
  entries.sort((a,b)=>(a[1][1]+a[1][3])-(b[1][1]+b[1][3])).forEach(([key,box])=>drawObject[key](box));
  for(const [key,box] of entries){const button=root.querySelector<HTMLElement>(`[data-object="${key}"]`)!;button.style.left=`${box[0]/720*100}%`;button.style.top=`${box[1]/400*100}%`;button.style.width=`${box[2]/720*100}%`;button.style.height=`${box[3]/400*100}%`;}
}
function setVariant(next:Variant,updateUrl=true){
  variant=next;root.dataset.view=next;
  const nameLabel=root.querySelector('[data-wb-name]');
  const countLabel=root.querySelector('[data-wb-count]');
  if(nameLabel)nameLabel.textContent=`${next} · ${names[next]}`;
  if(countLabel)countLabel.textContent=`${variants.indexOf(next)+1} / 3`;
  if(updateUrl){const url=new URL(location.href);url.searchParams.set('variant',next);history.replaceState({},'',url);}
  draw();console.info('Workbench prototype state',{variant:next,composition:names[next],explored:[...visited],activeObject:null});
}
function cycle(delta:number){setVariant(variants[(variants.indexOf(variant)+delta+3)%3]!);}
const dialog=root.querySelector<HTMLDialogElement>('.wb-dialog')!;
function openObject(key:Key){
  root.querySelectorAll<HTMLElement>('[data-panel]').forEach(panel=>panel.hidden=panel.dataset.panel!==key);
  root.querySelector('#wb-dialog-title')!.textContent=titles[key];root.querySelector('[data-dialog-object]')!.textContent=objectNames[key];
  root.querySelector('.wb-dialog-channel')!.textContent=key==='smt'?'SMT / SPORTS GRAPHICS':'THE WORKBENCH / PROJECT STORIES';
  visited.add(key);root.querySelector<HTMLElement>(`[data-object="${key}"]`)!.dataset.visited='true';root.querySelector('.wb-discovery')!.textContent=`${visited.size} / 6 explored`;
  draw();dialog.showModal();dialog.scrollTop=0;
  console.info('Workbench prototype state',{variant,explored:[...visited],activeObject:key});
}
root.querySelectorAll<HTMLButtonElement>('[data-object],[data-open]').forEach(button=>button.addEventListener('click',()=>openObject((button.dataset.object??button.dataset.open) as Key)));
root.querySelector('.wb-close')!.addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
dialog.addEventListener('close',()=>console.info('Workbench prototype state',{variant,explored:[...visited],activeObject:null}));
root.querySelector('[data-wb-prev]')?.addEventListener('click',()=>cycle(-1));root.querySelector('[data-wb-next]')?.addEventListener('click',()=>cycle(1));
document.addEventListener('keydown',event=>{if(dialog.open||(event.target instanceof Element&&event.target.closest('input,textarea,select,[contenteditable]')))return;if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();cycle(event.key==='ArrowRight'?1:-1);}});
window.addEventListener('popstate',()=>{const value=new URLSearchParams(location.search).get('variant') as Variant;setVariant(variants.includes(value)?value:'A',false);});
const initial=new URLSearchParams(location.search).get('variant') as Variant;
setVariant(variants.includes(initial)?initial:'A',false);
