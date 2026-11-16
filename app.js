
var BR=[[150000,0],[300000,5],[500000,10],[750000,15],[1000000,20],[2000000,25],[5000000,30],[null,35]];
var D={personal:60000,spouse:60000,parent:30000,child:30000,child2:30000,dis:60000,preg:60000,expPct:50,expCap:100000,grp:500000,donPct:10,hl:100000,cap3:100000};
var GL={personal:'ลดหย่อนส่วนตัว',spouse:'คู่สมรส',parent:'บิดามารดา (ต่อคน)',child:'บุตร (ต่อคน)',child2:'บุตรคนที่ 2+ เกิดปี 2561 (เพิ่มต่อคน)',dis:'ผู้พิการ (ต่อคน)',preg:'ค่าฝากครรภ์/คลอด (สูงสุด)',expPct:'หักค่าใช้จ่าย 40(1)(2) (%)',expCap:'เพดานค่าใช้จ่าย 40(1)(2)',grp:'เพดานกลุ่มกองทุนรวม',hl:'เพดานประกันชีวิต+สุขภาพรวม',donPct:'เพดานบริจาค (% ของเงินได้ก่อนบริจาค)',cap3:'เพดานค่าใช้จ่ายเหมา 40(3)'};
var FIELDS=[
{id:'ss',s:'ประกันสังคม',l:'ประกันสังคม',fx:9000},
{id:'hlth',s:'ประกันสุขภาพตนเอง',l:'เบี้ยประกันสุขภาพตนเอง',fx:25000},
{id:'life',s:'ประกันชีวิต',l:'เบี้ยประกันชีวิต',fx:100000},
{id:'phl',s:'ประกันสุขภาพพ่อแม่',l:'เบี้ยประกันสุขภาพบิดามารดา',fx:15000},
{id:'ann',s:'ประกันบำนาญ',l:'เบี้ยประกันชีวิตบำนาญ',g:1,fx:200000,pc:15},
{id:'pvd',s:'PVD',l:'กองทุนสำรองเลี้ยงชีพ (PVD)',g:1,pc:15},
{id:'nsf',s:'กอช.',l:'กองทุนการออมแห่งชาติ (กอช.)',g:1,fx:30000},
{id:'rmf',s:'RMF',l:'กองทุน RMF',g:1,pc:30},
{id:'ssf',s:'SSF',l:'กองทุน SSF',g:1,fx:200000,pc:30},
{id:'esg',s:'Thai ESG',l:'กองทุน Thai ESG (แยกจากกลุ่ม)',fx:300000,pc:30},
{id:'home',s:'ดอกเบี้ยบ้าน',l:'ดอกเบี้ยเงินกู้ซื้อที่อยู่อาศัย',fx:100000},
{id:'erc',s:'Easy e-Receipt',l:'Easy e-Receipt',fx:50000},
{id:'pty',s:'บริจาคพรรคการเมือง',l:'เงินบริจาคพรรคการเมือง',fx:10000}
];
var $=function(i){return document.getElementById(i)};
var n=function(i){var v=parseFloat($(i).value);return isNaN(v)||v<0?0:v};
var f=function(x){return Math.round(x).toLocaleString("th-TH")};
function gv(k){var v=parseFloat($('s_'+k).value);return isNaN(v)||v<0?0:v}
function sv(id){var v=parseFloat($(id).value);return isNaN(v)||v<0?null:v}
function capOf(x,inc,u){
 var c=Infinity,fx=sv('sf_'+x.id),pc=sv('sp_'+x.id);
 if(fx!==null)c=Math.min(c,fx);
 if(pc!==null)c=Math.min(c,inc*pc/100);
 if(x.id==='life')c=Math.min(c,gv('hl')-u.hlth);
 return Math.max(0,c);
}
var html='';
html='<div class="row">';FIELDS.forEach(function(x){html+='<div><label>'+x.s+'</label><input id="'+x.id+'" type="number" inputmode="decimal" value="'+(x.id==='ss'?9000:'')+'"></div>'});html+='</div>';
$("flds").innerHTML=html;
var TYPES=[
{k:'i3',n:'40(3) ค่าลิขสิทธิ์ สิทธิบัตร ค่าความนิยม',r:50},
{k:'i4',n:'40(4) ดอกเบี้ย เงินปันผล (ไม่มีค่าใช้จ่าย)',r:0,no:1},
{k:'i5',n:'40(5) ค่าเช่าทรัพย์สิน',r:30,o:[['บ้าน/อาคาร/สิ่งปลูกสร้าง/แพ/ยานพาหนะ 30%',30],['ที่ดินเพื่อเกษตรกรรม 20%',20],['ที่ดินอื่น 15%',15],['ทรัพย์สินอื่น 10%',10]]},
{k:'i6',n:'40(6) วิชาชีพอิสระ',r:60,o:[['ประกอบโรคศิลปะ 60%',60],['กฎหมาย/วิศวกรรม/สถาปัตย์/บัญชี/ประณีตศิลป์ 30%',30]]},
{k:'i7',n:'40(7) รับเหมา (จัดหาวัสดุสำคัญ)',r:70},
{k:'i8',n:'40(8) ธุรกิจ พาณิชย์ อุตสาหกรรม อื่น ๆ',r:60,o:[['เหมา 60%',60],['เหมา 70%',70],['เหมา 40%',40],['เหมา 30%',30],['เหมา 85%',85]]}
];
function trate(id){var k=id.slice(2),r=0;TYPES.forEach(function(t){if(t.k===k)r=t.r});return r}
var th='';
TYPES.forEach(function(t){
 th+='<div class="tp"><label><b>'+t.n+'</b></label>';
 if(t.o){th+='<select id="is'+t.k+'">';t.o.forEach(function(o){th+='<option value="'+o[1]+'">'+o[0]+'</option>'});th+='</select>'}
 th+='<div class="'+(t.no?'':'row3')+'"><div><div class="h">จำนวนเงิน</div><input id="ia'+t.k+'" type="number" inputmode="decimal" value=""></div>';
 if(!t.no)th+='<div><div class="h">หักเหมา %</div><input id="ir'+t.k+'" type="number" inputmode="decimal" value="'+t.r+'"></div><div><div class="h">หรือค่าใช้จ่ายจริง</div><input id="ie'+t.k+'" type="number" inputmode="decimal" value=""></div>';
 th+='</div></div>';
});
$("itypes").innerHTML=th;
TYPES.forEach(function(t){if(t.o)$("is"+t.k).addEventListener("input",function(){$("ir"+t.k).value=this.value})});
var sh='<div class="row">';
Object.keys(D).forEach(function(k){sh+='<div><label>'+GL[k]+'</label><input class="st" id="s_'+k+'" type="number" inputmode="decimal" value="'+D[k]+'"></div>'});
sh+='</div><h2 style="margin-top:14px">เพดานรายการประกัน/กองทุน</h2><div class="h">ช่องซ้าย = เพดานเป็นบาท · ช่องขวา = เพดานเป็น % ของรายได้ · เว้นว่าง = ไม่จำกัด</div>';
FIELDS.forEach(function(x){sh+='<label>'+x.l+'</label><div class="row"><input class="st" id="sf_'+x.id+'" type="number" inputmode="decimal" placeholder="บาท" value="'+(x.fx==null?'':x.fx)+'"><input class="st" id="sp_'+x.id+'" type="number" inputmode="decimal" placeholder="% ของรายได้" value="'+(x.pc==null?'':x.pc)+'"></div>'});
sh+='<h2 style="margin-top:14px">ขั้นบันไดภาษีเงินได้บุคคลธรรมดา</h2><div class="h">ช่องซ้าย = เงินได้สุทธิสูงสุดของขั้น (ขั้นสุดท้ายไม่จำกัด) · ช่องขวา = อัตรา % · ใช้กับห้างหุ้นส่วนสามัญด้วย</div>';
BR.forEach(function(b,i){var last=i===BR.length-1;sh+='<div class="row"><input class="st" id="b_u'+i+'" type="number" inputmode="decimal" '+(last?'disabled placeholder="ไม่จำกัด"':'value="'+b[0]+'"')+'><input class="st" id="b_r'+i+'" type="number" inputmode="decimal" value="'+b[1]+'"></div>'});
$("sets").innerHTML=sh;
function getB(){
 var r=[],prev=0;
 for(var i=0;i<BR.length;i++){
  var u=parseFloat($("b_u"+i).value),t=parseFloat($("b_r"+i).value);
  u=(i===BR.length-1||isNaN(u))?Infinity:Math.max(u,prev);
  r.push([u,(isNaN(t)||t<0?0:t)/100]);prev=u;
 }
 r[r.length-1][0]=Infinity;return r;
}
function resetSets(){
 BR.forEach(function(b,i){if(b[0]!=null)$("b_u"+i).value=b[0];$("b_r"+i).value=b[1]});
 Object.keys(D).forEach(function(k){$('s_'+k).value=D[k]});
 FIELDS.forEach(function(x){$('sf_'+x.id).value=x.fx==null?'':x.fx;$('sp_'+x.id).value=x.pc==null?'':x.pc});
}

function calc(){
 var i1=n("sal")*n("mon")+n("bon"),i2=n("fre");
 var inc=i1+i2,oth=i2,eo=0;
 TYPES.forEach(function(t){
  var a=n("ia"+t.k);if(!a)return;
  inc+=a;oth+=a;
  var act=t.no?0:n("ie"+t.k),e;
  if(act>0)e=Math.min(act,a);
  else{e=t.no?0:a*Math.min(n("ir"+t.k),100)/100;if(t.k==='i3')e=Math.min(e,gv("cap3"))}
  eo+=e;
 });
 var e12=Math.min((i1+i2)*gv("expPct")/100,gv("expCap"));
 var exp=e12+eo;
 var ch=n("ch"),ch2=Math.min(n("ch2"),ch);
 var fam=gv("personal")+(+$("sp").value)*gv("spouse")+(+$("par").value)*gv("parent")+ch*gv("child")+ch2*gv("child2")+n("dis")*gv("dis")+Math.min(n("preg"),gv("preg"));
 var used={},grp=0,rows=[],sum=0,details=[];
 FIELDS.forEach(function(x){
  var c=capOf(x,inc,used);
  if(x.g)c=Math.min(c,Math.max(0,gv("grp")-grp));
  $(x.id).placeholder="สูงสุด "+(isFinite(c)?f(c):"ไม่จำกัด");
  var a=Math.min(n(x.id),c);
  used[x.id]=a;sum+=a;if(x.g)grp+=a;
  details.push({l:x.l,a:a,c:c});
 });
 var pre=Math.max(0,inc-exp-fam-sum);
 var don=Math.min(n("dg")+n("de")*2,pre*gv("donPct")/100);
 var net=Math.max(0,pre-don);
 var tax=0,prev=0,marg=0;
 getB().forEach(function(b){
  var amt=Math.max(0,Math.min(net,b[0])-prev),t=amt*b[1];
  tax+=t;rows.push([prev,b[0],b[1],amt,t]);
  if(amt>0)marg=b[1];
  prev=b[0];
 });
 var other=oth,amt05=other>120000?other*.005:0,final=tax,amtNote='';
 if(amt05>tax){final=amt05;amtNote='<div class="warn">ภาษีขั้นต่ำ 0.5% ของเงินได้ประเภท 40(2)–(8) สูงกว่าภาษีปกติ จึงใช้ยอดนี้แทน</div>';}
 var diff=final-n("wht"),take=inc-final-used.ss;
 var pt=inc?Math.min(100,final/inc*100):0,pd=inc?Math.min(100-pt,(exp+fam+sum+don)/inc*100):0;
 $("sb3").textContent="③ ผล · "+f(final)+" ฿";
 LAST.p={inc:inc,net:net,tax:final};
 var r2=Math.max(0,100-pt-pd);
 $("don").style.background="conic-gradient(#ef4444 0 "+pt+"%,#14b8a6 "+pt+"% "+(pt+pd)+"%,#6366f1 "+(pt+pd)+"% 100%)";
 $("dleg").innerHTML='<div><i style="background:#ef4444"></i>ภาษี '+pt.toFixed(1)+'%</div><div><i style="background:#14b8a6"></i>ส่วนที่ไม่ต้องเสียภาษี '+pd.toFixed(1)+'%</div><div><i style="background:#6366f1"></i>เสียภาษีแล้วเหลือ '+r2.toFixed(1)+'%</div>';
 var bh="",mx=Math.max.apply(null,rows.map(function(r){return r[3]}).concat([1]));
 rows.forEach(function(r){if(r[3]>0)bh+='<div class="bl"><span>'+(r[2]*100)+'%</span><div class="bt"><div style="width:'+(r[3]/mx*100)+'%"></div></div><b>'+f(r[4])+'</b></div>'});
 $("bbars").innerHTML=bh||'<div class="h">ยังไม่มีเงินได้สุทธิที่ต้องเสียภาษี</div>';
 requestAnimationFrame(function(){cnt($("out").querySelector(".big"),final)});
 $("out").innerHTML='<div class="note">ภาษีที่ต้องชำระทั้งปี</div><div class="big">'+f(final)+' บาท</div>'+
 '<div class="bar"><i style="width:'+pt+'%;background:#dc2626"></i><i style="width:'+pd+'%;background:#0f766e"></i></div>'+
 '<div class="note">แดง = ภาษี · เขียว = ส่วนที่ได้ลดหย่อน</div>'+
 '<div class="kv"><span>รายได้รวมต่อปี</span><b>'+f(inc)+'</b></div>'+
 '<div class="kv"><span>ค่าใช้จ่ายที่หักได้</span><b>'+f(exp)+'</b></div>'+
 '<div class="kv"><span>ลดหย่อนครอบครัว (รวมส่วนตัว)</span><b>'+f(fam)+'</b></div>'+
 '<div class="kv"><span>ประกัน/กองทุน/สิทธิอื่น</span><b>'+f(sum)+'</b></div>'+
 '<div class="kv"><span>เงินบริจาคที่หักได้</span><b>'+f(don)+'</b></div>'+
 '<div class="kv"><span>เงินได้สุทธิ</span><b>'+f(net)+'</b></div>'+
 '<div class="kv"><span>อัตราภาษีขั้นสูงสุดที่ตก</span><b>'+(marg*100)+'%</b></div>'+
 '<div class="kv"><span>อัตราภาษีที่แท้จริง</span><b>'+(inc?(final/inc*100).toFixed(2):'0.00')+'%</b></div>'+
 '<div class="kv"><span>ภาษีเฉลี่ยต่อเดือน</span><b>'+f(final/12)+'</b></div>'+
 '<div class="kv"><span>รายได้หลังภาษีและประกันสังคม</span><b>'+f(take)+'</b></div>'+
 '<div class="kv"><span>'+(diff>=0?'ต้องจ่ายเพิ่ม':'ขอคืนภาษี')+'</span><b>'+f(Math.abs(diff))+' บาท</b></div>'+amtNote;
 var h='<tr><th>ช่วงเงินได้สุทธิ</th><th>อัตรา</th><th>เงินได้ในช่วง</th><th>ภาษี</th></tr>';
 rows.forEach(function(r){
  var lo=r[0]===0?'0':f(r[0]+1);
  h+='<tr'+(r[3]>0?' style="font-weight:600"':'')+'><td>'+lo+(r[1]===Infinity?'+':' – '+f(r[1]))+'</td><td>'+(r[2]*100)+'%</td><td>'+f(r[3])+'</td><td>'+f(r[4])+'</td></tr>';
 });
 $("tb").innerHTML=h;
 var g='<tr><th>รายการ</th><th>ใช้ไป</th><th>เพดาน</th><th>ประหยัดได้</th></tr>';
 details.forEach(function(d){
  var room=Math.max(0,d.c-d.a);
  g+='<tr><td>'+d.l+'</td><td>'+f(d.a)+'</td><td>'+(isFinite(d.c)?f(d.c):'ไม่จำกัด')+'</td><td>'+(room>0?'~'+f(Math.min(room,net)*marg):'-')+'</td></tr>';
 });
 $("hd").innerHTML=g;
}
document.querySelectorAll("input,select").forEach(function(e){e.addEventListener("input",function(){calc();ccalc()})});
$("rs").onclick=function(){document.querySelectorAll("input:not(.st):not(.cx)").forEach(function(e){e.value=e.id==='sal'?50000:e.id==='mon'?12:e.id.indexOf('ir')===0?trate(e.id):e.id==='ss'?9000:(FIELDS.some(function(x){return x.id===e.id})?'':0)});document.querySelectorAll("#pv select").forEach(function(e){e.selectedIndex=0});calc()};
function cv(i){var v=parseFloat($(i).value);return isNaN(v)||v<0?0:v}
function ccalc(){
 var ent=$("c_ent").value,gp=ent==="gp";
 $("c_smebox").hidden=gp;$("c_gpbox").hidden=!gp;
 var rev=cv("c_rev"),exp=cv("c_exp"),add=cv("c_add"),sub=cv("c_sub"),loss=cv("c_loss"),cap=cv("c_cap");
 var acc=rev-exp,tx=acc+add-sub;
 var used=Math.min(loss,Math.max(0,tx)),net=Math.max(0,tx-used);
 var tax=0,prev=0,rows=[],why='',title,extra='',base=net;
 function run(T,v){T.forEach(function(b){var a=Math.max(0,Math.min(v,b[0])-prev),t=a*b[1];tax+=t;rows.push([prev,b[0],b[1],a,t]);prev=b[0]})}
 if(gp){
  var al=cv("c_allow");base=Math.max(0,net-al);
  run(getB(),base);
  var m2=rev>=120000?rev*.005:0;
  if(m2>tax){tax=m2;extra='<div class="warn">ใช้วิธีคิด 0.5% ของรายได้ เพราะสูงกว่าภาษีตามขั้นบันได</div>'}
  title='ภาษีเงินได้ห้างหุ้นส่วน/คณะบุคคล (ภ.ง.ด.90 และ ภ.ง.ด.94 ครึ่งปี)';
  why='คิดอัตราก้าวหน้าแบบบุคคลธรรมดา หลังหักลดหย่อน '+f(al)+' บาท';
 }else{
  var mode=$("c_mode").value,elig=cap<=cv("c_capmax")&&rev<=cv("c_revmax");
  var sme=mode==="sme"||(mode==="auto"&&elig);
  var t1=cv("c_t1"),t2=cv("c_t2"),r2=cv("c_r2")/100,std=cv("c_std")/100;
  run(sme?[[t1,0],[t2,r2],[Infinity,std]]:[[Infinity,std]],net);
  title='ภาษีเงินได้นิติบุคคลประจำปี (ภ.ง.ด.50)';
  why=sme?'ใช้อัตรา SME':(mode==="std"?'ใช้อัตราปกติ (ตามที่เลือก)':'ใช้อัตราปกติ เพราะ'+(cap>cv("c_capmax")?' ทุนชำระแล้วเกินเกณฑ์':'')+(rev>cv("c_revmax")?' รายได้เกินเกณฑ์':''));
 }
 var cr=cv("c_wht")+cv("c_half"),diff=tax-cr;
 var lossNote=tx<0?'<div class="warn">รอบนี้ขาดทุนทางภาษี '+f(-tx)+' บาท ยกไปหักกำไรสุทธิได้ภายใน 5 รอบบัญชี</div>':'';
 $("sb2c").textContent="② ผล · "+f(tax)+" ฿";
 LAST.c={inc:rev,net:base,tax:tax};
 $("cout").innerHTML='<div class="note">'+title+'</div><div class="big">'+f(tax)+' บาท</div>'+
 '<div class="note">'+why+'</div>'+
 '<div class="kv"><span>กำไร (ขาดทุน) ตามบัญชี</span><b>'+f(acc)+'</b></div>'+
 '<div class="kv"><span>กำไรทางภาษีก่อนหักขาดทุนสะสม</span><b>'+f(tx)+'</b></div>'+
 '<div class="kv"><span>ขาดทุนสะสมที่ใช้หัก</span><b>'+f(used)+'</b></div>'+
 '<div class="kv"><span>'+(gp?'กำไรสุทธิหลังลดหย่อน':'กำไรสุทธิทางภาษี')+'</span><b>'+f(base)+'</b></div>'+
 '<div class="kv"><span>อัตราภาษีที่แท้จริง (เทียบกำไรบัญชี)</span><b>'+(acc>0?(tax/acc*100).toFixed(2):'0.00')+'%</b></div>'+
 '<div class="kv"><span>กำไรหลังภาษี</span><b>'+f(acc-tax)+'</b></div>'+
 '<div class="kv"><span>ภาษีครึ่งปีที่ควรชำระโดยประมาณ</span><b>'+f(tax/2)+'</b></div>'+
 '<div class="kv"><span>'+(diff>=0?'ต้องชำระเพิ่ม':'ขอคืน/เครดิตภาษี')+'</span><b>'+f(Math.abs(diff))+' บาท</b></div>'+extra+lossNote;
 var h='<tr><th>ช่วงกำไรสุทธิ</th><th>อัตรา</th><th>กำไรในช่วง</th><th>ภาษี</th></tr>';
 rows.forEach(function(r){h+='<tr'+(r[3]>0?' style="font-weight:600"':'')+'><td>'+(r[0]===0?'0':f(r[0]+1))+(r[1]===Infinity?'+':' – '+f(r[1]))+'</td><td>'+(+(r[2]*100).toFixed(2))+'%</td><td>'+f(r[3])+'</td><td>'+f(r[4])+'</td></tr>'});
 $("ctb").innerHTML=h;
}
function tab(n){
 $("pv").hidden=n!==0;$("co").hidden=n!==1;$("hist").hidden=n!==2;
 ["t1","t2","t3"].forEach(function(id,i){$(id).className=i===n?"on":""});
 window.scrollTo(0,0);stepSync();if(n===2){renderHist();loadAdmin()}
}
$("t1").onclick=function(){tab(0)};$("t2").onclick=function(){tab(1)};$("t3").onclick=function(){tab(2)};
$("rd").onclick=function(){resetSets();calc()};
function go(id){var e=$(id);if(e)e.scrollIntoView({behavior:"smooth",block:"start"})}
document.querySelectorAll("[data-go]").forEach(function(b){b.addEventListener("click",function(){go(b.getAttribute("data-go"))})});
function stepSync(){
 var co=!$("co").hidden,ids=co?["c1","cout","c3"]:["s1","s2","out"],a=0;
 ids.forEach(function(id,i){var e=$(id);if(e&&e.getBoundingClientRect().top<window.innerHeight*.45)a=i});
 if(window.innerHeight+window.scrollY>=document.body.scrollHeight-4)a=2;
 document.querySelectorAll((co?"#co":"#pv")+" .steps button").forEach(function(b,i){b.className=i===a?"on":""});
}
window.addEventListener("scroll",stepSync,{passive:true});
var LAST={p:null,c:null};
function esc(x){return String(x).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function lsGet(){try{return JSON.parse(localStorage.getItem("taxhist")||"[]")}catch(e){return []}}
function lsSet(a){try{localStorage.setItem("taxhist",JSON.stringify(a))}catch(e){}}
var ST={db:null,uid:localStorage.getItem("taxUserKey")||("guest-"+Math.random().toString(36).slice(2)),admin:false,mode:"local",items:lsGet()};
localStorage.setItem("taxUserKey",ST.uid);
async function initBack(){
 try{
  var r=await fetch("/api/records",{headers:{"x-user-key":ST.uid}});
  if(r.ok){ST.items=await r.json();ST.mode="cloud";}
 }catch(e){ST.mode="local";}
 renderHist();
}
async function persist(){
 if(ST.mode==="cloud"){
  try{
   var r=await fetch("/api/records",{method:"PUT",headers:{"Content-Type":"application/json","x-user-key":ST.uid},body:JSON.stringify({items:ST.items})});
   if(r.ok)return;
  }catch(e){}
  ST.mode="local";
 }
 lsSet(ST.items);
}
function saveRec(ty){
 var L=ty==="p"?LAST.p:LAST.c;if(!L)return;
 var root=ty==="p"?"pv":"co",lb=($(ty==="p"?"lb1":"lb2").value||"").trim(),sn={};
 document.querySelectorAll("#"+root+" input,#"+root+" select").forEach(function(e){
  if(e.id&&e.id.indexOf("lb")!==0&&(e.tagName==="SELECT"||e.value!==""))sn[e.id]=e.value;
 });
 ST.items.unshift({id:Date.now().toString(36),t:Date.now(),ty:ty,lb:lb,inc:Math.round(L.inc),net:Math.round(L.net),tax:Math.round(L.tax),sn:sn});
 ST.items=ST.items.slice(0,30);
 var b=$(ty==="p"?"sv1":"sv2");
 persist().then(function(){renderHist();b.textContent="✅ บันทึกแล้ว";setTimeout(function(){b.textContent="💾 บันทึกผลนี้"},1500)});
}
function renderHist(){
 $("hmode").textContent=ST.mode==="cloud"?"☁️ บันทึกบนเว็บ ใช้ได้ทุกเครื่องที่เข้าสู่ระบบบัญชีเดียวกัน · ผู้ดูแลเว็บจะเห็นตัวเลขสรุปและชื่อรายการที่คุณบันทึก":"💾 บันทึกในเบราว์เซอร์เครื่องนี้เท่านั้น (ไม่มีใครอื่นเห็น)";
 var h="";
 ST.items.forEach(function(r,i){
  h+='<div class="hi"><div><b>'+esc(r.lb||(r.ty==="p"?"บุคคลธรรมดา":"บริษัท/ห้างหุ้นส่วน"))+'</b><div class="h">'+new Date(r.t).toLocaleString("th-TH")+' · ภาษี '+f(r.tax)+' บาท</div></div><div><button class="ch" data-ld="'+i+'">เปิด</button><button class="ch" data-dl="'+i+'">ลบ</button></div></div>';
 });
 $("hl").innerHTML=h||'<div class="h">ยังไม่มีรายการ กดปุ่ม 💾 บันทึกผลนี้ ในหน้าผลลัพธ์ของแท็บบุคคลหรือบริษัท</div>';
}
function loadRec(i){
 var r=ST.items[i];if(!r)return;var root=r.ty==="p"?"pv":"co";
 document.querySelectorAll("#"+root+" input,#"+root+" select").forEach(function(e){
  if(!e.id||e.id.indexOf("lb")===0)return;
  e.value=(e.id in r.sn)?r.sn[e.id]:"";
 });
 tab(r.ty==="p"?0:1);calc();ccalc();
}
$("hl").addEventListener("click",function(e){
 var b=e.target.closest("button");if(!b)return;
 if(b.hasAttribute("data-ld"))loadRec(+b.getAttribute("data-ld"));
 if(b.hasAttribute("data-dl")){ST.items.splice(+b.getAttribute("data-dl"),1);persist().then(renderHist)}
});
$("hclr").onclick=function(){if(ST.items.length&&confirm("ล้างประวัติทั้งหมดของคุณ?")){ST.items=[];persist().then(renderHist)}};
$("sv1").onclick=function(){saveRec("p")};
$("sv2").onclick=function(){saveRec("c")};
async function loadAdmin(){
 var token=localStorage.getItem("taxAdminToken");
 if(!token){$("adm").hidden=true;return}
 try{
  var q=await fetch("/api/admin/records",{headers:{"Authorization":"Bearer "+token}});
  if(!q.ok){$("adm").hidden=true;return}
  var data=await q.json(),all=data.records||[];
  $("adm").hidden=false;window.ADM=all.map(r=>[r,r.user_key||""]);
  var users=new Set(all.map(r=>r.user_key)).size,n=all.length,np=all.filter(r=>r.ty==="p").length,nc=n-np,tp=all.filter(r=>r.ty==="p").reduce((s,r)=>s+(r.tax||0),0);
  $("akpi").innerHTML='<div><b>'+users+'</b>ผู้ใช้ที่บันทึก</div><div><b>'+n+'</b>รายการทั้งหมด</div><div><b>'+np+' / '+nc+'</b>บุคคล / นิติบุคคล</div><div><b>'+f(np?tp/np:0)+'</b>ภาษีบุคคลเฉลี่ย (บาท)</div>';
  var h='<tr><th>วันที่</th><th>ประเภท</th><th>ชื่อรายการ</th><th>ภาษี</th><th>ผู้ใช้</th></tr>';
  all.slice(0,50).forEach(function(r){h+='<tr><td>'+new Date(r.t).toLocaleDateString("th-TH")+'</td><td>'+(r.ty==="p"?"บุคคล":"นิติบุคคล")+'</td><td>'+esc(r.lb||"-")+'</td><td>'+f(r.tax)+'</td><td>'+esc((r.user_key||"").slice(-4))+'</td></tr>'});
  $("atb").innerHTML=h;
 }catch(e){$("adm").hidden=true}
}
$("arf").onclick=loadAdmin;
$("acsv").onclick=function(){
 if(!window.ADM)return;
 function cs(x){x=String(x??"");if(/^[=+\-@]/.test(x))x="'"+x;return '"'+x.replace(/"/g,'""')+'"'}
 var rows=[["วันที่","ประเภท","ชื่อรายการ","รายได้","เงินได้สุทธิ","ภาษี","ผู้ใช้"]];
 window.ADM.forEach(function(a){var r=a[0];rows.push([new Date(r.t).toISOString(),r.ty==="p"?"บุคคลธรรมดา":"นิติบุคคล",r.lb||"",r.inc,r.net,r.tax,a[1]])});
 var blob=new Blob(["\ufeff"+rows.map(r=>r.map(cs).join(",")).join("\n")],{type:"text/csv;charset=utf-8"});
 var url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="tax-records.csv";a.click();URL.revokeObjectURL(url);
};
var cT=0,cK=0;
function cnt(el,to){
 if(!el)return;var from=cT,t0=performance.now(),k=++cK;cT=to;
 function st(t){if(k!==cK)return;var x=Math.min(1,(t-t0)/450);el.textContent=f(from+(to-from)*x)+" บาท";if(x<1)requestAnimationFrame(st)}
 requestAnimationFrame(st);
}
var EX=[{sal:25000},{sal:80000,bon:160000,sp:1,par:2,ch:2,life:60000,hlth:20000,pvd:90000,rmf:100000,home:60000},{sal:40000,fre:300000,iai5:240000}];
document.querySelectorAll("[data-ex]").forEach(function(b){b.addEventListener("click",function(){
 $("rs").click();var o=EX[+b.getAttribute("data-ex")];for(var k in o)$(k).value=o[k];calc();go("out");
})});
$("cp").onclick=function(){
 var t="สรุปภาษีบุคคลธรรมดา\n"+$("out").innerText;
 function ok(){$("cp").textContent="✅ คัดลอกแล้ว";setTimeout(function(){$("cp").textContent="📋 คัดลอกสรุปผล"},1500)}
 function fb(){var a=document.createElement("textarea");a.value=t;document.body.appendChild(a);a.select();try{document.execCommand("copy");ok()}catch(e){}document.body.removeChild(a)}
 try{navigator.clipboard.writeText(t).then(ok,fb)}catch(e){fb()}
};
var QZ=[["เงินได้สุทธิ 300,000 บาท ต้องเสียภาษีเท่าไร",["0 บาท","7,500 บาท","15,000 บาท","30,000 บาท"],1,"150,000 บาทแรกยกเว้น ส่วนที่เหลือ 150,000 × 5% = 7,500 บาท"],
["ขั้นบันไดภาษีหมายความว่าอะไร",["ใช้อัตราสูงสุดคิดทั้งก้อน","แต่ละช่วงเงินได้คิดตามอัตราของช่วงนั้น","ยิ่งมีลดหย่อนยิ่งเสียอัตราสูงขึ้น"],1,"อัตราที่สูงขึ้นใช้เฉพาะส่วนที่เกินขั้น ไม่ใช่ทั้งก้อน"],
["ข้อใดลดเงินได้สุทธิได้โดยตรง",["ค่าอาหารประจำวัน","เงินออมกองทุนเพื่อการเกษียณ (ในเพดาน)","ค่าโทรศัพท์"],1,"กองทุนเกษียณเป็นค่าลดหย่อนภายในเพดานที่กฎหมายกำหนด"]];
var qh='<h2>📝 ทดสอบความเข้าใจ</h2><div class="h" id="qs">ตอบแล้วดูเฉลยทันที</div>';
QZ.forEach(function(q,i){qh+='<div class="q"><p><b>'+(i+1)+'. '+q[0]+'</b></p>';q[1].forEach(function(o,j){qh+='<button data-q="'+i+'" data-a="'+j+'">'+o+'</button>'});qh+='<div class="qa" id="qa'+i+'"></div></div>'});
$("quiz").innerHTML=qh;
var sc={};
document.querySelectorAll("[data-q]").forEach(function(b){b.addEventListener("click",function(){
 var i=+b.getAttribute("data-q"),ok=(+b.getAttribute("data-a"))===QZ[i][2];sc[i]=ok;
 $("qa"+i).textContent=(ok?"✅ ถูกต้อง! ":"❌ ยังไม่ถูก ")+QZ[i][3];
 var n=0,t=0;for(var k in sc){t++;if(sc[k])n++}
 $("qs").textContent="คะแนน "+n+"/"+QZ.length+" (ตอบแล้ว "+t+" ข้อ)";
})});
calc();ccalc();stepSync();
initBack();

// ผู้ดูแลสามารถตั้งรหัสผ่าน API ได้จากหน้าประวัติ โดยใช้รหัสที่กำหนดในไฟล์ .env
$("hmode").addEventListener("dblclick",function(){
 var token=prompt("กรอกรหัสผู้ดูแลระบบ");if(token){localStorage.setItem("taxAdminToken",token);loadAdmin();}
});
