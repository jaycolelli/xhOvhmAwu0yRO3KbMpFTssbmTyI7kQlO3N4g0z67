/* ABC Sand & Rock · Order 24/7 — a JayCo preview. 100% client-side; nothing is sent anywhere. */
(function(){
'use strict';
var P=window.ABC_DATA.products, I=window.ABC_I18N, PBY={}; P.forEach(function(p){PBY[p.id]=p;});
var MAG='https://jaycolelli.github.io/q6aqIHg8hG1i86apw3eGvI2zfDrFfoBVI5qSabVN/', VIZ='https://jaycolelli.github.io/jXkP8VZ9t95xbMc9Jikk6UM5ZcxQ2iqkGq1KmDEC/';
var TEL='+16022721792';
var DENS={ds:1.4,rr:1.4,rr6:1.1,dg:1.4,sand:1.3,mix:1.8,soil:1.3,nf:1.4};
var CATS=['stone','dg','river','sand','mix','soil','base'];
var WINS=['w1','w2','w3'];
var LS='abcOrder247.v1';
var $=function(s,r){return (r||document).querySelector(s);}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});};
var r2=function(v){return Math.round(v*100)/100;};
var f2=function(v){return (Math.round(v*100)/100).toFixed(2);};
var fN=function(v){ return String(r2(v)); };
var fD=function(v){ return f2(v); };
function toast(m){var t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(function(){t.classList.remove('show');},2600);}

/* ------------------------------------------------------------------ deadline / ribbon / end card (same as the magazine and visualizer) */
var DEADLINE_MS=Date.parse('2026-12-02T18:00:00Z');
function daysLeft(now){ if(now>=DEADLINE_MS) return -1;
  var fmt=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Phoenix',year:'numeric',month:'2-digit',day:'2-digit'});
  var t0=Date.parse(fmt.format(new Date(now))+'T00:00:00Z'), t1=Date.parse('2026-12-02T00:00:00Z');
  return Math.round((t1-t0)/86400000); }
function countdownLabel(d){return d>=2?d+' days left':d===1?'1 day left':d===0?'last day':'';}
function endCard(){
  var c=String(window.JAY_CONTACT||'').trim(), ch='';
  if(c){ ch=/^https?:\/\//i.test(c)?'<a href="'+esc(c)+'">'+esc(c)+'</a>':c.indexOf('@')>0?'<a href="mailto:'+esc(c)+'">'+esc(c)+'</a>':esc(c); ch='<p style="margin:14px 0 0;font-size:16px;color:#D4AF5F;word-break:break-word">'+ch+'</p>'; }
  var e=$('#endcard'); e.innerHTML='<div class="bar"></div><div class="k">Preview edition</div><h1>This preview has closed.</h1><p class="p">Want ABC taking delivery requests 24/7, on the web and on the phone, in English and Spanish, with every request waiting on one board in the morning?</p><div class="j">JayCo</div><div class="s">AI Consulting &amp; Services</div><p style="margin:0;font-size:16px;line-height:1.5">Let\'s talk.</p>'+ch;
  e.hidden=false; $('#app').hidden=true; if(window.speechSynthesis) try{speechSynthesis.cancel();}catch(_){} }
function tickRibbon(){ var d=daysLeft(Date.now()); if(d<0){endCard();return false;} var l=countdownLabel(d); $('#ribbon-days').textContent=l?' · '+l:''; return true; }
if(!tickRibbon()) return;
setInterval(tickRibbon,60000);
$('#ribbon-x').onclick=function(){ $('#ribbon').remove(); };

/* ------------------------------------------------------------------ Phoenix time + delivery calendar (Phoenix is UTC-7 all year, no DST) */
function phxParts(ms){ var d=new Date(ms-7*3600000); return {y:d.getUTCFullYear(),m:d.getUTCMonth(),d:d.getUTCDate(),wd:d.getUTCDay(),h:d.getUTCHours(),mi:d.getUTCMinutes()}; }
function iso(y,m,d){ var t=new Date(Date.UTC(y,m,d)); return t.toISOString().slice(0,10); }
function addDays(s,n){ var t=new Date(s+'T12:00:00Z'); t.setUTCDate(t.getUTCDate()+n); return t.toISOString().slice(0,10); }
function wday(s){ return new Date(s+'T12:00:00Z').getUTCDay(); }
function todayISO(){ var p=phxParts(Date.now()); return iso(p.y,p.m,p.d); }
function winsFor(s){ var w=wday(s); return w===0?[]:w===6?['w1','w2']:WINS.slice(); }
function nextDeliveryDay(from){ var s=addDays(from,1); while(wday(s)===0) s=addDays(s,1); return s; }
function prevDeliveryDay(from){ var s=addDays(from,-1); while(wday(s)===0) s=addDays(s,-1); return s; }
function yardOpen(ms){ var p=phxParts(ms), m=p.h*60+p.mi; if(p.wd>=1&&p.wd<=5) return m>=300&&m<990; if(p.wd===6) return m>=360&&m<720; return false; }
function fmtDay(s,opt){ return new Intl.DateTimeFormat(t('dayFmt'),Object.assign({timeZone:'UTC'},opt||{weekday:'short',month:'short',day:'numeric'})).format(new Date(s+'T12:00:00Z')); }
function fmtTime(ms){ return new Intl.DateTimeFormat(t('dayFmt'),{timeZone:'America/Phoenix',hour:'numeric',minute:'2-digit'}).format(new Date(ms)); }
function fmtRecv(ms){ return new Intl.DateTimeFormat(t('dayFmt'),{timeZone:'America/Phoenix',weekday:'short',hour:'numeric',minute:'2-digit'}).format(new Date(ms)); }
function phxMs(dateISO,h,mi){ var a=dateISO.split('-'); return Date.UTC(+a[0],+a[1]-1,+a[2],h+7,mi); }

/* ------------------------------------------------------------------ state */
var S={lang:'en',tab:'order',
  o:{pid:null,size:'',cat:'all',q:'',more:false,mode:'lw',L:'',W:'',SF:'',T:'',depth:2,depthC:'',date:'',win:'',zip:'',name:'',phone:'',notes:''},
  confirm:null, b:{date:'all',win:'all',st:'all',sort:'dw'}, freshId:null};
try{ var sl=localStorage.getItem('abcOrder247.lang'); if(sl==='es'||sl==='en') S.lang=sl; else if((navigator.language||'').toLowerCase().indexOf('es')===0) S.lang='es'; }catch(_){}
function t(k){ var v=I[S.lang][k]; return v===undefined?I.en[k]:v; }
function load(){ try{ var j=JSON.parse(localStorage.getItem(LS)||'{}'); return {mine:j.mine||[],status:j.status||{}}; }catch(_){ return {mine:[],status:{}}; } }
function save(db){ try{ localStorage.setItem(LS,JSON.stringify(db)); }catch(_){} }
var DB=load();

/* ------------------------------------------------------------------ tonnage math — mirrors ABC's public calculator:
   cu yd = cu ft / 27 rounded to 2 places; tons = cu yd × density, rounded to 2 places */
function calc(o){
  var p=PBY[o.pid]; if(!p) return null;
  var dens=DENS[p.dens], depth=o.depth==='c'?parseFloat(o.depthC):o.depth;
  var r={p:p,dens:dens,depth:depth,mode:o.mode};
  if(o.mode==='t'){ var tt=parseFloat(o.T); if(!(tt>0)) return r; r.tons=r2(tt); r.yd=r2(tt/dens); }
  else{
    var sq=o.mode==='lw'?(parseFloat(o.L)*parseFloat(o.W)):parseFloat(o.SF);
    if(!(sq>0)||!(depth>0)) return r;
    r.sqft=r2(sq); r.cuft=r2(sq*depth/12); r.yd=r2(sq*depth/12/27); r.tons=r2(r.yd*dens);
  }
  r.req=Math.max(1,r.tons); r.under=r.tons<1; r.loads=Math.ceil(r.req/24);
  return r;
}

/* ------------------------------------------------------------------ example board data (clearly labeled, fake first names, made-up orders) */
function examples(){
  var td=todayISO(), D1=nextDeliveryDay(td), D2=nextDeliveryDay(D1), D0=prevDeliveryDay(td), yd=addDays(td,-1);
  var X=[
   ['ex1','Maria','Glendale','85301','desert-gold','1/2" Screened',6.3,D1,'w1','web',21,12,'new','h'],
   ['ex2','Dave','Mesa','85201','madison-gold-crushed','1/4" Minus',14,D1,'w1','call',18,5,'quoted','c'],
   ['ex3','Rick','Gilbert','85234','mag-spec-abc','',24,D1,'w1','web',19,15,'scheduled','c'],
   ['ex4','Luis','Peoria','85345','3-8-natural-pea-gravel','',4,D1,'w2','web',22,48,'new','h'],
   ['ex5','Kim','Chandler','85224','concrete-sand','',30,D1,'w2','web',17,51,'new','c'],
   ['ex6','Jen','Phoenix','85009','concrete-mix','',1,D1,'w2','web',20,44,'quoted','h'],
   ['ex7','Tony','Goodyear','85338','fill-dirt','',48,D1,'w3','call',20,20,'quoted','c'],
   ['ex8','Ana','Tempe','85281','apache-red','1/2" Screened',3,D1,'w3','web',23,37,'new','h'],
   ['ex9','Elena','Avondale','85323','table-mesa-brown','1" Screened',8.5,D2,'w1','call',21,2,'new','h'],
   ['ex10','Sam','Scottsdale','85251','black-cherry','1/2" Screened',5.2,D2,'w2','web',1,14,'new','h'],
   ['ex11','Rosa','Laveen','85339','screened-top-soil','',10,D2,'w2','web',0,40,'quoted','h'],
   ['ex12','Mike','Surprise','85374','1-2-3-4-natural-river-rock','',36,D2,'w3','call',19,58,'new','c'],
   ['ex13','Carlos','Maryvale','85031','sedona-red','1/2" Screened',7,D0,'w2','phone',9,30,'delivered','h']
  ];
  return X.map(function(x){
    var date=x[7], win=x[8]; if(winsFor(date).indexOf(win)<0) win='w2';
    var recvDay=x[0]==='ex13'?prevDeliveryDay(D0):(x[10]<5?td:yd);
    return {id:x[0],ex:true,name:x[1],area:x[2],zip:x[3],pid:x[4],size:x[5],tons:x[6],date:date,win:win,src:x[9],created:phxMs(recvDay,x[10],x[11]),status:x[12],kind:x[13],phone:'(602) 555-01'+String(10+X.indexOf(x)).slice(-2)};
  });
}
function allReqs(){ var ex=examples(); var mine=DB.mine.slice(); var all=mine.concat(ex); all.forEach(function(r){ if(DB.status[r.id]) r.status=DB.status[r.id]; }); return all; }

/* ------------------------------------------------------------------ chrome: tabs, story, footer, language */
var ICON={
  order:'<svg viewBox="0 0 24 24"><path d="M7 3h10l1 4H6zM5 7h14l-1.5 13h-11z M9.5 11v5M14.5 11v5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  call:'<svg viewBox="0 0 24 24"><path d="M6.6 3.5l3 3.1-1.9 2.6a12 12 0 0 0 7.1 7.1l2.6-1.9 3.1 3-1.6 2.9C11.3 21 3 12.7 3.7 5.1z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M15 3.5a5.5 5.5 0 0 1 5.5 5.5M15 7a2 2 0 0 1 2 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  board:'<svg viewBox="0 0 24 24"><path d="M4 4h16v16H4zM4 9h16M9 9v11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  truck:'<svg viewBox="0 0 24 24"><path d="M2 6h11v9H2zM13 9h4l3 3v3h-7z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="6" cy="17" r="2" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="17" cy="17" r="2" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
  check:'<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  warn:'<svg viewBox="0 0 24 24"><path d="M12 3l10 18H2z M12 10v5 M12 17.5v.5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round"/></svg>',
  phone:'<svg viewBox="0 0 24 24"><path d="M6.6 3.5l3 3.1-1.9 2.6a12 12 0 0 0 7.1 7.1l2.6-1.9 3.1 3-1.6 2.9C11.3 21 3 12.7 3.7 5.1z" fill="currentColor"/></svg>',
  play:'<svg viewBox="0 0 24 24"><path d="M7 4.5v15l12-7.5z" fill="currentColor"/></svg>',
  spk:'<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  arrow:'<svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  ext:'<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};
function renderTabs(){
  var n=allReqs().filter(function(r){return r.status==='new';}).length;
  $('#tabs').innerHTML=[['order',t('tabOrder')],['call',t('tabCall')],['board',t('tabBoard')]].map(function(x){
    return '<button type="button" role="tab" class="tab'+(S.tab===x[0]?' on':'')+'" data-tab="'+x[0]+'" aria-selected="'+(S.tab===x[0])+'">'+ICON[x[0]]+'<span>'+esc(x[1])+'</span>'+(x[0]==='board'?'<b class="cnt">'+n+'</b>':'')+'</button>';
  }).join('');
}
function go(tab,scroll){
  S.tab=tab; renderTabs();
  ['order','call','board'].forEach(function(v){ $('#v-'+v).hidden=v!==tab; });
  if(tab==='board') renderBoard();
  if(tab!=='call') stopCall(true);
  if(scroll!==false){ var y=$('#main .view:not([hidden])').getBoundingClientRect().top+window.scrollY-$('#topbar').offsetHeight-8; if(window.scrollY>y||scroll==='force') window.scrollTo({top:Math.max(0,y),behavior:'smooth'}); }
  try{ history.replaceState(null,'','#'+tab); }catch(_){}
}
$('#tabs').addEventListener('click',function(e){ var b=e.target.closest('[data-tab]'); if(b) go(b.dataset.tab); });
function renderStory(){
  var open=yardOpen(Date.now());
  $('#story').innerHTML='<div class="hero"><div class="hero-bg" role="img" aria-label="ABC Sand &amp; Rock dump trucks lined up at night"></div><div class="hero-in">'+
    '<div class="kicker">'+esc(t('kicker'))+'</div>'+
    '<h1>'+esc(t('h1a'))+'<br><em>'+esc(t('h1b'))+'</em></h1>'+
    '<p class="lede">'+esc(t('lede'))+'</p>'+
    '<div class="flow">'+[['s1t','s1','order','try1'],['s2t','s2','call','try2'],['s3t','s3','board','try3']].map(function(s,i){
      return '<button type="button" class="fstep" data-go="'+s[2]+'"><span class="fnum">'+(i+1)+'</span><span class="ftime">'+esc(t(s[0]))+'</span><span class="ftxt">'+esc(t(s[1]))+'</span><span class="fcta">'+esc(t(s[3]))+ICON.arrow+'</span></button>';
    }).join('')+'</div>'+
    '<div class="yard '+(open?'open':'shut')+'"><i></i>'+esc(open?t('openNow'):t('closedNow'))+'<span class="hrs">'+esc(t('hoursLine'))+'</span></div>'+
  '</div></div>';
}
$('#story').addEventListener('click',function(e){ var b=e.target.closest('[data-go]'); if(b) go(b.dataset.go,'force'); });
function renderFoot(){
  $('#foot').innerHTML='<div class="sis"><div class="sis-h">'+esc(t('sister'))+' <span class="part">'+esc(t('part'))+'</span></div>'+
    '<div class="sis-l"><a href="'+MAG+'" target="_blank" rel="noopener">'+esc(t('mag'))+ICON.ext+'</a><a href="'+VIZ+'" target="_blank" rel="noopener">'+esc(t('viz'))+ICON.ext+'</a></div></div>'+
    '<p class="src">'+esc(t('srcLine'))+'</p><p class="by"><b>JayCo</b> · '+esc(t('by'))+'</p>';
}
function setLang(l){
  S.lang=l; document.documentElement.lang=l; try{localStorage.setItem('abcOrder247.lang',l);}catch(_){}
  $$('.lang button').forEach(function(b){ b.classList.toggle('on',b.dataset.lang===l); b.setAttribute('aria-pressed',b.dataset.lang===l); });
  if(!CALL.running) CALL.lang=l;
  renderAll();
}
$$('.lang button').forEach(function(b){ b.onclick=function(){ setLang(b.dataset.lang); }; });
function renderAll(){ renderTabs(); renderStory(); renderOrder(); renderCall(); renderBoard(); renderFoot(); }

/* ------------------------------------------------------------------ ORDER */
function renderOrder(){
  var v=$('#v-order');
  if(S.confirm){ v.innerHTML=confirmHTML(S.confirm); return; }
  v.innerHTML='<div class="vh"><h2>'+esc(t('oTitle'))+'</h2><p>'+esc(t('oSub'))+'</p></div>'+
   '<div class="ogrid"><div class="ocol">'+
    card(1,t('st1'),'<div id="o-mat"></div>')+
    card(2,t('st2'),'<div id="o-area"></div>')+
   '</div><div class="ocol">'+
    card(3,t('st3'),'<div id="o-math" aria-live="polite"></div>','tons-card')+
    card(4,t('st4'),'<div id="o-del"></div>')+
    card(5,t('st5'),'<div id="o-who"></div>')+
    '<div class="submit-wrap"><div class="pricebar"><span>'+esc(t('price'))+'</span><a href="tel:'+TEL+'">'+esc(t('callPrice'))+'</a></div>'+
    '<button type="button" class="btn copper lg block" id="o-submit">'+ICON.truck+'<span>'+esc(t('submit'))+'</span></button>'+
    '<p class="fine">'+esc(t('notQuote'))+'</p><div id="o-err" class="err-sum" hidden></div></div>'+
   '</div></div>';
  renderMat(); renderArea(); renderMath(); renderDel(); renderWho();
  $('#o-submit').onclick=submit;
}
function card(n,title,body,cls){ return '<div class="card '+(cls||'')+'" id="card'+n+'"><div class="ch"><span class="num">'+n+'</span><h3>'+esc(title)+'</h3></div>'+body+'</div>'; }
function filtered(){
  var o=S.o, q=o.q.trim().toLowerCase();
  return P.filter(function(p){ return (o.cat==='all'||p.cat===o.cat)&&(!q||(p.name+' '+t('cats')[p.cat]+' '+I.en.cats[p.cat]).toLowerCase().indexOf(q)>=0); });
}
function renderMat(){
  var o=S.o, box=$('#o-mat'); if(!box) return;
  var sel=PBY[o.pid];
  box.innerHTML='<div class="search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M16 16l4.5 4.5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg><input type="search" id="o-q" placeholder="'+esc(t('search'))+'" value="'+esc(o.q)+'" autocomplete="off" enterkeyhint="search"></div>'+
    '<div class="chips" id="o-cats">'+['all'].concat(CATS).map(function(c){ return '<button type="button" class="chip'+(o.cat===c?' on':'')+'" data-cat="'+c+'">'+esc(c==='all'?t('all'):t('cats')[c])+'</button>'; }).join('')+'</div>'+
    '<div id="o-grid"></div>'+
    (sel?'<div class="selbox"><img src="img/p/'+sel.id+'.jpg" alt=""><div class="sb-t"><div class="sb-k">'+esc(t('selected'))+' · '+esc(t('cats')[sel.cat])+'</div><div class="sb-n">'+esc(sel.name)+'</div>'+
      (sel.sizes.length?'<label class="sb-s">'+esc(t('size'))+' <select id="o-size"><option value="">'+esc(t('sizeAny'))+'</option>'+sel.sizes.map(function(s){return '<option'+(o.size===s?' selected':'')+'>'+esc(s)+'</option>';}).join('')+'</select></label>':'')+
      '<a class="sb-l" href="'+esc(sel.url)+'" target="_blank" rel="noopener">'+esc(t('details'))+ICON.ext+'</a></div></div>':'');
  renderGrid();
  var q=$('#o-q'); q.oninput=function(){ o.q=q.value; o.more=false; renderGrid(); };
  $('#o-cats').onclick=function(e){ var b=e.target.closest('[data-cat]'); if(!b) return; o.cat=b.dataset.cat; o.more=false; $$('#o-cats .chip').forEach(function(c){c.classList.toggle('on',c===b);}); renderGrid(); };
  var sz=$('#o-size'); if(sz) sz.onchange=function(){ o.size=sz.value; };
}
function renderGrid(){
  var o=S.o, list=filtered(), lim=(o.more||list.length<=12)?list.length:9, g=$('#o-grid');
  if(!list.length){ g.innerHTML='<p class="empty">'+esc(t('noMatch'))+'</p>'; return; }
  g.innerHTML='<div class="pgrid">'+list.slice(0,lim).map(function(p){
    return '<button type="button" class="pc'+(o.pid===p.id?' on':'')+'" data-pid="'+p.id+'" aria-pressed="'+(o.pid===p.id)+'"><img src="img/p/'+p.id+'.jpg" alt="" loading="lazy"><span>'+esc(p.name)+'</span></button>';
  }).join('')+'</div>'+(list.length>12?'<button type="button" class="more" id="o-more">'+esc(o.more?t('showLess'):t('showMore')(list.length))+'</button>':'');
  g.onclick=function(e){ var b=e.target.closest('[data-pid]'); if(b){ o.pid=b.dataset.pid; o.size=''; renderMat(); renderMath(); clearErr('mat'); return; } if(e.target.closest('#o-more')){ o.more=!o.more; renderGrid(); } };
}
function renderArea(){
  var o=S.o, box=$('#o-area');
  var depths=[1,2,3,4,6];
  box.innerHTML='<div class="seg" id="o-mode">'+[['lw',t('mLW')],['sf',t('mSF')],['t',t('mT')]].map(function(m){ return '<button type="button" data-mode="'+m[0]+'" class="'+(o.mode===m[0]?'on':'')+'">'+esc(m[1])+'</button>'; }).join('')+'</div>'+
   (o.mode==='lw'?'<div class="row2"><label class="fld"><span>'+esc(t('len'))+'</span><input inputmode="decimal" id="o-L" value="'+esc(o.L)+'" placeholder="20"></label><span class="x">×</span><label class="fld"><span>'+esc(t('wid'))+'</span><input inputmode="decimal" id="o-W" value="'+esc(o.W)+'" placeholder="30"></label></div>':
    o.mode==='sf'?'<label class="fld"><span>'+esc(t('sqft'))+'</span><input inputmode="decimal" id="o-SF" value="'+esc(o.SF)+'" placeholder="600"></label>':
    '<label class="fld"><span>'+esc(t('tonsIn'))+'</span><input inputmode="decimal" id="o-T" value="'+esc(o.T)+'" placeholder="12"></label>')+
   (o.mode!=='t'?'<div class="dlab">'+esc(t('depth'))+'</div><div class="chips depth" id="o-depth">'+depths.map(function(d){ return '<button type="button" class="chip'+(o.depth===d?' on':'')+'" data-d="'+d+'">'+d+' '+esc(t('inch'))+'</button>'; }).join('')+
     '<button type="button" class="chip'+(o.depth==='c'?' on':'')+'" data-d="c">'+esc(t('custom'))+'</button>'+(o.depth==='c'?'<input inputmode="decimal" id="o-dc" class="dc" value="'+esc(o.depthC)+'" placeholder="5" aria-label="'+esc(t('depth'))+'"><span class="dcu">'+esc(t('inch'))+'</span>':'')+'</div>':'');
  $('#o-mode').onclick=function(e){ var b=e.target.closest('[data-mode]'); if(!b) return; o.mode=b.dataset.mode; renderArea(); renderMath(); };
  ['L','W','SF','T'].forEach(function(k){ var i=$('#o-'+k); if(i) i.oninput=function(){ o[k]=i.value.replace(',','.'); renderMath(); clearErr('tons'); }; });
  var dp=$('#o-depth'); if(dp) dp.onclick=function(e){ var b=e.target.closest('[data-d]'); if(!b) return; o.depth=b.dataset.d==='c'?'c':+b.dataset.d; renderArea(); renderMath(); if(o.depth==='c') $('#o-dc').focus(); };
  var dc=$('#o-dc'); if(dc) dc.oninput=function(){ o.depthC=dc.value.replace(',','.'); renderMath(); };
}
function renderMath(){
  var box=$('#o-math'); if(!box) return;
  var r=calc(S.o);
  if(!r){ box.innerHTML='<p class="hintline">'+esc(t('pickMat'))+'</p>'; return; }
  if(r.tons==null){ box.innerHTML='<p class="hintline">'+esc(t('enterArea'))+'</p><div class="dens">'+esc(r.p.name)+' · '+esc(t('densOf')[r.p.dens])+' = <b>'+fN(r.dens)+'</b> '+esc(t('tPerYd'))+'</div>'; return; }
  var lines=[];
  if(r.mode==='lw') lines.push([fN(+S.o.L)+' ft × '+fN(+S.o.W)+' ft', fN(r.sqft)+' '+t('sqftU')]);
  if(r.mode!=='t'){ lines.push([fN(r.sqft)+' '+t('sqftU')+' × '+fN(r.depth)+' '+t('inch')+' ÷ 12', fN(r.cuft)+' '+t('cuftU')]); lines.push([fN(r.cuft)+' '+t('cuftU')+' ÷ 27', fD(r.yd)+' '+t('ydU')]); lines.push([fD(r.yd)+' '+t('ydU')+' × '+fN(r.dens)+' '+t('tPerYd'), fD(r.tons)+' '+t('tU')]); }
  else lines.push([fD(r.tons)+' '+t('tU')+' ÷ '+fN(r.dens)+' '+t('tPerYd'), '≈ '+fD(r.yd)+' '+t('ydU')]);
  box.innerHTML='<div class="math">'+lines.map(function(l){ return '<div class="ml"><span>'+esc(l[0])+'</span><b>= '+esc(l[1])+'</b></div>'; }).join('')+'</div>'+
    '<div class="dens">'+esc(t('densOf')[r.p.dens])+': <b>'+fN(r.dens)+'</b> '+esc(t('tPerYd'))+' <span class="srcchip">ABC</span></div>'+
    (r.p.dens==='nf'?'<p class="note">'+esc(t('nfNote'))+'</p>':'')+
    '<div class="big"><div><div class="bk">'+esc(r.mode==='t'?t('request'):t('youNeed'))+'</div><div class="bn"><span id="o-tons">'+fD(r.req)+'</span> <small>'+esc(t('tU'))+'</small></div></div><div class="trucks">'+truckIcons(r.loads)+'</div></div>'+
    (r.under?'<div class="flag min">'+ICON.warn+'<span>'+esc(t('minNote'))+'</span></div>':'')+
    (r.loads>1?'<div class="flag over">'+ICON.warn+'<span>'+esc(t('loadsNote')(r.loads))+'</span></div>':'<div class="flag ok">'+ICON.check+'<span>'+esc(t('oneLoad'))+'</span></div>')+
    '<p class="fine">'+esc(t('estNote'))+'</p>';
}
function truckIcons(n){ var s=''; for(var i=0;i<Math.min(n,6);i++) s+='<span class="tk">'+ICON.truck+'</span>'; if(n>6) s+='<span class="tk more">+'+(n-6)+'</span>'; return s; }
function renderDel(){
  var o=S.o, box=$('#o-del'), first=nextDeliveryDay(todayISO()), days=[];
  for(var i=0,s=addDays(todayISO(),1);i<14;i++,s=addDays(s,1)) days.push(s);
  if(o.date&&(o.date<first||wday(o.date)===0)) o.date='';
  if(o.date&&o.win&&winsFor(o.date).indexOf(o.win)<0) o.win='';
  box.innerHTML='<p class="hintline">'+esc(t('nextDay'))+'</p><div class="days" id="o-days">'+days.map(function(d){
      var sun=wday(d)===0;
      return '<button type="button" class="day'+(o.date===d?' on':'')+'" data-date="'+d+'"'+(sun?' disabled':'')+'><span class="dw">'+esc(fmtDay(d,{weekday:'short'}))+'</span><span class="dd">'+esc(fmtDay(d,{day:'numeric'}))+'</span><span class="dm">'+esc(sun?t('closed'):fmtDay(d,{month:'short'}))+'</span></button>';
    }).join('')+'</div>'+
    '<div class="dlab">'+esc(t('winLbl'))+(o.date?' · '+esc(fmtDay(o.date,{weekday:'long',month:'long',day:'numeric'})):'')+'</div>'+
    '<div class="wins" id="o-wins">'+WINS.map(function(w){
      var ok=!o.date||winsFor(o.date).indexOf(w)>=0;
      return '<button type="button" class="win'+(o.win===w?' on':'')+'" data-win="'+w+'"'+(ok?'':' disabled')+'><b>'+esc(t('win')[w])+'</b>'+(ok?'':'<small>'+esc(t('satNo'))+'</small>')+'</button>';
    }).join('')+'</div>';
  $('#o-days').onclick=function(e){ var b=e.target.closest('[data-date]'); if(!b||b.disabled) return; o.date=b.dataset.date; var sl=$('#o-days').scrollLeft; renderDel(); $('#o-days').scrollLeft=sl; clearErr('date'); };
  $('#o-wins').onclick=function(e){ var b=e.target.closest('[data-win]'); if(!b||b.disabled) return; o.win=b.dataset.win; var sl=$('#o-days').scrollLeft; renderDel(); $('#o-days').scrollLeft=sl; clearErr('win'); };
}
function renderWho(){
  var o=S.o;
  $('#o-who').innerHTML='<div class="demo-note">'+ICON.warn+'<span>'+esc(t('demoFields'))+'</span></div>'+
   '<label class="fld" data-f="zip"><span>'+esc(t('zip'))+'</span><input id="o-zip" value="'+esc(o.zip)+'" placeholder="'+esc(t('zipPh'))+'" autocomplete="off"></label>'+
   '<div class="row2"><label class="fld" data-f="name"><span>'+esc(t('name'))+'</span><input id="o-name" value="'+esc(o.name)+'" placeholder="'+esc(t('namePh'))+'" autocomplete="off"></label>'+
   '<label class="fld" data-f="phone"><span>'+esc(t('phone'))+'</span><input id="o-phone" type="tel" inputmode="tel" value="'+esc(o.phone)+'" placeholder="'+esc(t('phonePh'))+'" autocomplete="off"></label></div>'+
   '<label class="fld"><span>'+esc(t('notes'))+'</span><textarea id="o-notes" rows="2" placeholder="'+esc(t('notesPh'))+'">'+esc(o.notes)+'</textarea></label>';
  ['zip','name','phone','notes'].forEach(function(k){ var i=$('#o-'+k); i.oninput=function(){ o[k]=i.value; clearErr(k); }; });
}
function clearErr(k){ var c={mat:'#card1',tons:'#card2',date:'#card4',win:'#card4'}[k]; if(c&&$(c)) $(c).classList.remove('bad'); var f=$('[data-f="'+k+'"]'); if(f) f.classList.remove('bad'); }
function submit(){
  var o=S.o, r=calc(o), errs=[];
  $$('.card.bad,.fld.bad').forEach(function(x){x.classList.remove('bad');});
  if(!r){ errs.push(['#card1',t('errMat')]); } else if(r.tons==null){ errs.push(['#card2',t('errTons')]); }
  if(!o.date) errs.push(['#card4',t('errDate')]); else if(!o.win) errs.push(['#card4',t('errWin')]);
  if(o.zip.trim().length<3) errs.push(['[data-f="zip"]',t('errZip')]);
  if(!o.name.trim()) errs.push(['[data-f="name"]',t('errName')]);
  var digits=o.phone.replace(/\D/g,''); if(digits.length===11&&digits[0]==='1') digits=digits.slice(1);
  if(digits.length!==10) errs.push(['[data-f="phone"]',t('errPhone')]);
  var es=$('#o-err');
  if(errs.length){ errs.forEach(function(e){ $(e[0]).classList.add('bad'); });
    es.hidden=false; es.innerHTML='<b>'+esc(t('fixErr'))+'</b><ul>'+errs.map(function(e){return '<li>'+esc(e[1])+'</li>';}).join('')+'</ul>';
    var y=$(errs[0][0]).getBoundingClientRect().top+window.scrollY-$('#topbar').offsetHeight-14; window.scrollTo({top:y,behavior:'smooth'}); return; }
  es.hidden=true;
  var zipm=o.zip.match(/\b(8\d{4})\b/);
  var req={id:'w'+Date.now().toString(36),ref:'ABC-'+String(Math.floor(1000+Math.random()*9000)),mine:true,src:'web',lang:S.lang,
    name:o.name.trim().split(/\s+/)[0].slice(0,24),area:zipm?o.zip.replace(zipm[1],'').replace(/[,·\s]+$/,'').replace(/^[,·\s]+/,'').trim():o.zip.trim().slice(0,30),zip:zipm?zipm[1]:'',
    phone:'('+digits.slice(0,3)+') '+digits.slice(3,6)+'-'+digits.slice(6),pid:o.pid,size:o.size,tons:r.req,calc:r.tons,date:o.date,win:o.win,created:Date.now(),status:'new',kind:'h',notes:o.notes.trim().slice(0,200)};
  DB.mine.unshift(req); save(DB); S.freshId=req.id;
  S.confirm=req; renderOrder(); renderTabs();
  var y=$('#v-order').getBoundingClientRect().top+window.scrollY-$('#topbar').offsetHeight-8; window.scrollTo({top:Math.max(0,y),behavior:'smooth'});
}
function confirmHTML(q){
  var p=PBY[q.pid], sat=wday(q.date)===6, opens=t('cOpens')[sat?'sat':'wk'];
  // the office opens the delivery day before; show the next opening
  return '<div class="confirm"><div class="ck">'+ICON.check+'</div><h2>'+esc(t('cTitle'))+'</h2><div class="ref">'+esc(t('cRef'))+esc(q.ref)+'</div><p class="csub">'+esc(t('cSub'))+'</p>'+
   '<div class="csum"><div class="cs-p"><img src="img/p/'+p.id+'.jpg" alt=""><div><div class="k">'+esc(t('cMat'))+'</div><b>'+esc(p.name)+'</b>'+(q.size?' · '+esc(q.size):'')+'</div></div>'+
   '<div class="cs-g"><div><div class="k">'+esc(t('cTons'))+'</div><b>'+fD(q.tons)+'</b>'+(q.tons>24?' <span class="pill warn">'+esc(t('loadsN')(Math.ceil(q.tons/24)))+'</span>':'')+'</div>'+
   '<div><div class="k">'+esc(t('cWhen'))+'</div><b>'+esc(fmtDay(q.date,{weekday:'short',month:'short',day:'numeric'}))+'</b><br>'+esc(t('win')[q.win])+'</div>'+
   '<div><div class="k">'+esc(t('cWhere'))+'</div><b>'+esc([q.area,q.zip].filter(Boolean).join(' '))+'</b></div>'+
   '<div><div class="k">'+esc(t('cWho'))+'</div><b>'+esc(q.name)+'</b><br>'+esc(q.phone)+'</div></div>'+
   '<div class="pricebar"><span>'+esc(t('price'))+'</span><a href="tel:'+TEL+'">'+esc(t('callPrice'))+'</a></div></div>'+
   '<div class="cnext"><h3>'+esc(t('cNext'))+'</h3><ol><li>'+esc(t('cN1')(nextOpenLabel()))+'</li><li>'+esc(t('cN2'))+'</li><li>'+esc(t('cN3'))+'</li></ol></div>'+
   '<div class="cbtns"><button type="button" class="btn copper lg" data-act="board">'+ICON.board+'<span>'+esc(t('cSeeBoard'))+'</span></button><button type="button" class="btn ghost lg" data-act="new">'+esc(t('cNew'))+'</button></div></div>';
}
function nextOpenLabel(){
  var now=Date.now(); if(yardOpen(now)) return S.lang==='es'?'ya está abierto':'it\'s open now';
  var d=todayISO();
  for(var k=0;k<8;k++,d=addDays(d,1)){ var w=wday(d); if(w===0) continue; var ms=phxMs(d,w===6?6:5,0); if(ms>now) return fmtDay(d,{weekday:'long'})+' '+fmtTime(ms); }
  return '';
}
$('#v-order').addEventListener('click',function(e){ var b=e.target.closest('[data-act]'); if(!b) return;
  if(b.dataset.act==='board'){ go('board','force'); }
  if(b.dataset.act==='new'){ S.confirm=null; var keep=S.o; S.o={pid:null,size:'',cat:'all',q:'',more:false,mode:'lw',L:'',W:'',SF:'',T:'',depth:2,depthC:'',date:'',win:'',zip:'',name:'',phone:'',notes:''}; renderOrder(); }
});

/* ------------------------------------------------------------------ DISPATCH BOARD */
var WRANK={w1:1,w2:2,w3:3};
function renderBoard(){
  var v=$('#v-board'), b=S.b, all=allReqs();
  var dates=all.map(function(r){return r.date;}).filter(function(d,i,a){return a.indexOf(d)===i;}).sort();
  var D1=nextDeliveryDay(todayISO());
  var totDate=b.date!=='all'?b.date:(dates.indexOf(D1)>=0?D1:dates[0]);
  var list=all.filter(function(r){ return (b.date==='all'||r.date===b.date)&&(b.win==='all'||r.win===b.win)&&(b.st==='all'||r.status===b.st); });
  var cmp={dw:function(a,c){ return a.date<c.date?-1:a.date>c.date?1:(WRANK[a.win]-WRANK[c.win])||(a.created-c.created); },
           'new':function(a,c){ return c.created-a.created; }, t:function(a,c){ return c.tons-a.tons; }}[b.sort];
  var mine=list.filter(function(r){return r.mine;}).sort(function(a,c){return c.created-a.created;}), ex=list.filter(function(r){return !r.mine;}).sort(cmp);
  list=mine.concat(ex);
  var dayReqs=all.filter(function(r){return r.date===totDate&&r.status!=='delivered';});
  var tot=WINS.filter(function(w){return winsFor(totDate).indexOf(w)>=0;}).map(function(w){ var rs=dayReqs.filter(function(r){return r.win===w;}); var tn=rs.reduce(function(s,r){return s+r.tons;},0), ld=rs.reduce(function(s,r){return s+Math.ceil(r.tons/24);},0), big=rs.filter(function(r){return r.tons>24;}).length;
    return '<div class="tot"><div class="tw">'+esc(t('win')[w])+'</div><div class="tt">'+fN(tn)+' <small>'+esc(t('tU'))+'</small></div><div class="tm">'+esc(t('reqs')(rs.length))+' · '+esc(t('loads')(ld))+'</div>'+(big?'<div class="tf">'+ICON.warn+esc(t('needsTrucks'))+' ×'+big+'</div>':'')+'</div>'; }).join('');
  var newN=all.filter(function(r){return r.status==='new';}).length;
  v.innerHTML='<div class="vh bh"><div><h2>'+esc(t('bTitle'))+' <span class="badge ex">'+esc(t('exBadge'))+'</span></h2><p>'+esc(t('bSub'))+' · <b class="newc">'+esc(t('newCount')(newN))+'</b></p></div><button type="button" class="btn ghost sm" id="b-reset">'+esc(t('reset'))+'</button></div>'+
   '<p class="exnote">'+esc(t('exNote'))+'</p>'+
   '<div class="totals"><div class="tot-h">'+esc(t('totFor')(fmtDay(totDate,{weekday:'long',month:'short',day:'numeric'})))+'</div><div class="tot-g">'+tot+'</div></div>'+
   '<div class="filters">'+
     fsel('b-date',t('fDate'),[['all',t('allDates')]].concat(dates.map(function(d){return [d,fmtDay(d)];})),b.date)+
     fsel('b-win',t('fWin'),[['all',t('allWin')]].concat(WINS.map(function(w){return [w,t('win')[w]];})),b.win)+
     fsel('b-st',t('fStatus'),[['all',t('allSt')]].concat(['new','quoted','scheduled','delivered'].map(function(s){return [s,t('stat')[s]];})),b.st)+
     fsel('b-sort',t('fSort'),[['dw',t('sortDW')],['new',t('sortNew')],['t',t('sortT')]],b.sort)+
   '</div>'+
   '<div class="tbl" role="table"><div class="tr th" role="row"><div>'+esc(t('colReq'))+'</div><div>'+esc(t('colCust'))+'</div><div>'+esc(t('colArea'))+'</div><div>'+esc(t('colMat'))+'</div><div>'+esc(t('colTons'))+'</div><div>'+esc(t('colWhen'))+'</div><div>'+esc(t('colStat'))+'</div></div>'+
   (list.length?list.map(rowHTML).join(''):'<p class="empty">'+esc(t('none'))+'</p>')+'</div>';
  ['date','win','st','sort'].forEach(function(k){ $('#b-'+k).onchange=function(){ b[k]=this.value; renderBoard(); }; });
  $('#b-reset').onclick=function(){ DB={mine:[],status:{}}; save(DB); S.freshId=null; S.confirm=null; renderOrder(); renderBoard(); renderTabs(); toast(t('resetDone')); };
}
function fsel(id,lbl,opts,val){ return '<label class="fs"><span>'+esc(lbl)+'</span><select id="'+id+'">'+opts.map(function(o){return '<option value="'+o[0]+'"'+(o[0]===val?' selected':'')+'>'+esc(o[1])+'</option>';}).join('')+'</select></label>'; }
function rowHTML(r){
  var p=PBY[r.pid], loads=Math.ceil(r.tons/24), after=!yardOpen(r.created);
  var ref=r.ref||('EX-'+r.id.slice(2).padStart(3,'0'));
  return '<div class="tr'+(r.mine?' mine':' exr')+(r.id===S.freshId?' fresh':'')+'" role="row" data-id="'+r.id+'">'+
   '<div class="c-req"><div class="ref">'+esc(ref)+'</div><div class="tags">'+(r.mine?'<span class="pill hot">'+esc(t('justIn'))+'</span>':'<span class="pill exm">'+esc(t('src').ex)+'</span>')+'<span class="pill src-'+r.src+'">'+esc(t('src')[r.src])+'</span></div><div class="rcv">'+esc(t('recv'))+' '+esc(fmtRecv(r.created))+(after?' · <span class="ah">'+esc(t('afterH'))+'</span>':'')+'</div></div>'+
   '<div class="c-cust"><b>'+esc(r.name)+'</b><span>'+esc(r.kind==='c'?t('contractor'):t('homeowner'))+' · <i class="nw">'+esc(r.phone)+'</i></span></div>'+
   '<div class="c-area"><b>'+esc(r.area||'')+'</b><span>'+esc(r.zip||'')+'</span></div>'+
   '<div class="c-mat"><img src="img/p/'+p.id+'.jpg" alt="" loading="lazy"><div><b>'+esc(p.name)+'</b><span>'+esc(r.size||t('cats')[p.cat])+'</span></div></div>'+
   '<div class="c-tons"><b>'+fN(r.tons)+'</b><small>'+esc(t('tU'))+'</small>'+(r.tons>24?'<span class="pill warn">'+ICON.warn+esc(t('needsTrucks'))+' · '+esc(t('loadsN')(loads))+'</span>':'')+'</div>'+
   '<div class="c-when"><b>'+esc(fmtDay(r.date))+'</b><span>'+esc(t('win')[r.win])+'</span></div>'+
   '<div class="c-st"><select class="st st-'+r.status+'" data-st="'+r.id+'" aria-label="'+esc(t('colStat'))+' '+esc(ref)+'">'+['new','quoted','scheduled','delivered'].map(function(s){return '<option value="'+s+'"'+(r.status===s?' selected':'')+'>'+esc(t('stat')[s])+'</option>';}).join('')+'</select></div>'+
  '</div>';
}
$('#v-board').addEventListener('change',function(e){ var s=e.target.closest('[data-st]'); if(!s) return;
  var id=s.dataset.st, val=s.value, m=DB.mine.filter(function(r){return r.id===id;})[0];
  if(m) m.status=val; else DB.status[id]=val; save(DB);
  var r=allReqs().filter(function(x){return x.id===id;})[0];
  renderBoard(); renderTabs(); toast(t('statSaved')(r.ref||('EX-'+id.slice(2).padStart(3,'0')),t('stat')[val]));
});

/* ------------------------------------------------------------------ AFTER-HOURS CALL DEMO */
var CALL={lang:S.lang,running:false,step:0,timer:null,voice:false,done:false,card:{},startMs:0,clock:null,gen:0};
function script(lang){
  var D=nextDeliveryDay(todayISO()), wins=winsFor(D), dn=new Intl.DateTimeFormat(lang==='es'?'es-MX':'en-US',{timeZone:'UTC',weekday:'long'}).format(new Date(D+'T12:00:00Z'));
  var W=I[lang].win, wl=wins.map(function(w){return W[w];});
  var spokenEN={w1:'6 to 9',w2:'9 to 12',w3:'12 to 4'}, spokenES={w1:'de 6 a 9',w2:'de 9 a 12',w3:'de 12 a 4'};
  var list=function(a,and){ return a.length>1?a.slice(0,-1).join(', ')+' '+and+' '+a[a.length-1]:a[0]; };
  if(lang==='en'){ var p=PBY['desert-gold'];
    return {name:'Dan',caller:'(602) 555-0148',zip:'85308',area:'Glendale',pid:p.id,tons:5.18,date:D,win:'w2',lines:[
    ['ai','Thanks for calling ABC Sand & Rock. The yard is closed right now, but I\u2019m ABC\u2019s after-hours assistant and I can take a delivery request. ¿Prefiere español?'],
    ['c','English is fine. I need rock for my front yard. Desert Gold, I think.'],
    ['ai','Desert Gold, got it. How big is the area? Length by width is perfect.',{mat:p.name}],
    ['c','About 20 by 30 feet.'],
    ['ai','That\u2019s 600 square feet. How deep do you want it? For example, 2 or 3 inches.',{area:'20 × 30 ft = 600 sq ft'}],
    ['c','Let\u2019s do 2 inches.'],
    ['ai','600 square feet at 2 inches is 100 cubic feet, or 3.70 cubic yards. ABC figures decorative stone at 1.4 tons per cubic yard, so that\u2019s about 5.18 tons. That fits on one truck.',{depth:'2 in',tons:'3.70 cu yd × 1.4 = 5.18 tons'}],
    ['c','Can you bring it tomorrow?'],
    ['ai','ABC delivers next day across the Valley. For '+dn+' the windows are '+list(wins.map(function(w){return spokenEN[w];}),'or')+'. Which works best?',{day:fmtDayL(D,'en-US')}],
    ['c','9 to 12.'],
    ['ai','9 to 12 on '+dn+'. What\u2019s the ZIP code for the delivery?',{win:W.w2}],
    ['c','85308.'],
    ['ai','And your first name and a good callback number?',{zip:'85308'}],
    ['c','Dan. 602-555-0148.'],
    ['ai','Thanks, Dan. To be clear, this is a delivery request, not a price quote. ABC\u2019s office will call you in the morning to confirm the price and your 9 to 12 window. I\u2019m putting your request on their dispatch board now.',{name:'Dan · (602) 555-0148'}],
    ['c','Perfect, thanks!'],
    ['ai','Thanks for calling ABC Sand & Rock. Have a good night.']]}; }
  var q=PBY['apache-red'];
  return {name:'Lupe',caller:'(623) 555-0172',zip:'85037',area:'Phoenix',pid:q.id,tons:3.89,date:D,win:'w1',lines:[
    ['ai','Gracias por llamar a ABC Sand & Rock. El patio está cerrado ahorita, pero soy el asistente nocturno de ABC y puedo tomar su solicitud de entrega. Would you prefer English?'],
    ['c','En español, por favor. Necesito piedra roja para el patio de atrás. Apache Red.'],
    ['ai','Apache Red, perfecto. ¿Qué tan grande es el área? Largo por ancho está bien.',{mat:q.name}],
    ['c','Como 15 por 20 pies.'],
    ['ai','Son 300 pies cuadrados. ¿Qué profundidad quiere? Por ejemplo, 2 o 3 pulgadas.',{area:'15 × 20 pies = 300 pies²'}],
    ['c','Tres pulgadas.'],
    ['ai','300 pies cuadrados a 3 pulgadas son 75 pies cúbicos, o sea 2.78 yardas cúbicas. ABC calcula la piedra decorativa a 1.4 toneladas por yarda cúbica, así que son unas 3.89 toneladas. Cabe en un solo camión.',{depth:'3 pulg',tons:'2.78 yd³ × 1.4 = 3.89 toneladas'}],
    ['c','¿Me la pueden llevar mañana temprano?'],
    ['ai','ABC entrega al día siguiente en todo el Valle. Para el '+dn+' los horarios son '+list(wins.map(function(w){return spokenES[w];}),'o')+'. ¿Cuál le conviene?',{day:fmtDayL(D,'es-MX')}],
    ['c','De 6 a 9.'],
    ['ai','De 6 a 9 el '+dn+'. ¿Cuál es el código postal de la entrega?',{win:W.w1}],
    ['c','85037.'],
    ['ai','¿Y su nombre y un teléfono para regresarle la llamada?',{zip:'85037'}],
    ['c','Lupe. 623-555-0172.'],
    ['ai','Gracias, Lupe. Para que quede claro, esto es una solicitud de entrega, no una cotización de precio. La oficina de ABC le llama en la mañana para confirmar el precio y su horario de 6 a 9. Ya estoy poniendo su solicitud en el tablero de despacho.',{name:'Lupe · (623) 555-0172'}],
    ['c','Muy bien, gracias.'],
    ['ai','Gracias por llamar a ABC Sand & Rock. Que pase buena noche.']]};
}
function fmtDayL(d,loc){ return new Intl.DateTimeFormat(loc,{timeZone:'UTC',weekday:'long',month:'long',day:'numeric'}).format(new Date(d+'T12:00:00Z')); }
var hasTTS=('speechSynthesis' in window)&&typeof SpeechSynthesisUtterance!=='undefined';
function renderCall(){
  var v=$('#v-call'), L=I[CALL.lang], sc=script(CALL.lang);
  v.innerHTML='<div class="vh"><h2>'+esc(t('kTitle'))+'</h2><p>'+esc(t('kSub'))+'</p></div>'+
   '<div class="kctl"><div class="seg sm" id="k-lang"><span class="seglbl">'+esc(t('kLang'))+'</span><button type="button" data-cl="en" class="'+(CALL.lang==='en'?'on':'')+'">English</button><button type="button" data-cl="es" class="'+(CALL.lang==='es'?'on':'')+'">Español</button></div>'+
   '<div class="kbtns"><button type="button" class="btn copper" id="k-play">'+ICON.play+'<span>'+esc(CALL.done||CALL.running?t('kReplay'):t('kPlay'))+'</span></button>'+
   '<button type="button" class="btn ghost" id="k-skip">'+esc(t('kSkip'))+'</button>'+
   (hasTTS?'<button type="button" class="btn dark tts'+(CALL.voice?' on':'')+'" id="k-voice" aria-pressed="'+CALL.voice+'">'+ICON.spk+'<span>'+esc(CALL.voice?t('kVoice'):t('kVoiceOff'))+'</span></button>':'')+'</div></div>'+
   '<p class="klabel">'+esc(t('kLabel'))+'</p>'+
   '<div class="kgrid"><div class="phone"><div class="ph-top"><div class="ph-time">7:40 PM</div><div class="ph-who"><div class="ph-av">'+ICON.phone+'</div><div><div class="ph-n">'+esc(L.kIncoming)+' · '+esc(sc.caller)+'</div><div class="ph-s"><span class="dot"></span>'+esc(L.kYardClosed)+' · <span id="k-clock">0:00</span></div></div></div></div>'+
     '<div class="ph-body" id="k-log"><button type="button" class="answer" id="k-answer"><span class="ans-c">'+ICON.phone+'</span><span>'+esc(t('kAnswer'))+'</span></button></div></div>'+
   '<div class="kcard" id="k-card"></div></div>';
  $('#k-lang').onclick=function(e){ var b=e.target.closest('[data-cl]'); if(!b) return; stopCall(true); CALL.lang=b.dataset.cl; CALL.done=false; CALL.card={}; renderCall(); };
  $('#k-play').onclick=function(){ startCall(false); };
  $('#k-skip').onclick=function(){ startCall(true); };
  var ka=$('#k-answer'); if(ka) ka.onclick=function(){ startCall(false); };
  var vb=$('#k-voice'); if(vb) vb.onclick=function(){ CALL.voice=!CALL.voice; if(!CALL.voice) try{speechSynthesis.cancel();}catch(_){} vb.classList.toggle('on',CALL.voice); vb.setAttribute('aria-pressed',CALL.voice); vb.querySelector('span').textContent=CALL.voice?t('kVoice'):t('kVoiceOff'); };
  if(CALL.done) { $('#k-log').innerHTML=''; $('#k-clock').textContent='1:52'; var s2=script(CALL.lang); s2.lines.forEach(function(l){ addLine(l,s2,true); if(l[2]) Object.assign(CALL.card,l[2]); }); endLine(); }
  renderCard();
}
function renderCard(){
  var L=I[CALL.lang], c=CALL.card, box=$('#k-card'); if(!box) return; var sc=script(CALL.lang);
  var f=[['fMat','mat'],['fArea','area'],['fDepth','depth'],['fTons','tons'],['fDay','day'],['fWin2','win'],['fZip','zip'],['fName','name']];
  var any=Object.keys(c).length;
  box.innerHTML='<div class="kc-h">'+ICON.board+'<span>'+esc(L.kCard)+'</span>'+(c.mat?'<img src="img/p/'+sc.pid+'.jpg" alt="">':'')+'</div>'+
    (any?'':'<p class="hintline">'+esc(L.kIdle)+'</p>')+
    '<div class="kc-f">'+f.map(function(x){ return '<div class="kf'+(c[x[1]]?' got':'')+'"><span>'+esc(L[x[0]])+'</span><b>'+esc(c[x[1]]||'—')+'</b></div>'; }).join('')+'</div>'+
    '<div class="pricebar"><span>'+esc(L.price)+'</span><a href="tel:'+TEL+'">'+esc(L.callPrice)+'</a></div>'+
    (CALL.done?'<div class="stampw"><div class="stamp">'+esc(L.kStamp)+'</div></div><div class="dropped">'+ICON.check+'<span>'+esc(L.kDropped)+'</span></div><button type="button" class="btn copper block" id="k-board">'+ICON.board+'<span>'+esc(L.kOpenBoard)+'</span></button>':'');
  var kb=$('#k-board'); if(kb) kb.onclick=function(){ go('board','force'); };
}
function addLine(l,sc,instant){
  var log=$('#k-log'); if(!log) return; var L=I[CALL.lang];
  var d=document.createElement('div'); d.className='msg '+l[0]+(instant?'':' in');
  d.innerHTML='<div class="who">'+esc(l[0]==='ai'?L.kAI:L.kCaller+' · '+sc.name)+'</div><div class="bub">'+esc(l[1])+'</div>';
  log.appendChild(d); log.scrollTop=log.scrollHeight;
}
function typing(on){ var log=$('#k-log'); if(!log) return; var x=$('.typing',log); if(on&&!x){ x=document.createElement('div'); x.className='typing'; x.innerHTML='<i></i><i></i><i></i>'; log.appendChild(x); log.scrollTop=log.scrollHeight; } if(!on&&x) x.remove(); }
function endLine(){ var log=$('#k-log'); if(!log) return; var d=document.createElement('div'); d.className='ended'; d.textContent=I[CALL.lang].kDone+' · 1:52'; log.appendChild(d); log.scrollTop=log.scrollHeight; }
function stopCall(silent){ CALL.gen++; clearTimeout(CALL.timer); clearInterval(CALL.clock); CALL.running=false; if(hasTTS) try{speechSynthesis.cancel();}catch(_){} typing(false); }
function speak(text,who,cb){
  if(!(CALL.voice&&hasTTS)){ cb(); return; }
  try{ var u=new SpeechSynthesisUtterance(text.replace(/&/g,CALL.lang==='es'?' y ':' and ')); u.lang=CALL.lang==='es'?'es-MX':'en-US';
    var vs=speechSynthesis.getVoices().filter(function(v){return v.lang&&v.lang.toLowerCase().indexOf(CALL.lang)===0;});
    if(vs.length){ u.voice=vs[who==='ai'?0:Math.min(1,vs.length-1)]; } u.pitch=who==='ai'?1:1.15; u.rate=1.04;
    var done=false, fin=function(){ if(done) return; done=true; cb(); }; u.onend=fin; u.onerror=fin;
    setTimeout(fin, 1500+text.length*95); speechSynthesis.speak(u);
  }catch(_){ cb(); }
}
function startCall(instant){
  stopCall(true); CALL.card={}; CALL.done=false; CALL.running=true; var gen=CALL.gen; var sc=script(CALL.lang);
  renderCall(); CALL.running=true; var log=$('#k-log'); log.innerHTML='';
  if(instant){ sc.lines.forEach(function(l){ addLine(l,sc,true); if(l[2]) Object.assign(CALL.card,l[2]); }); finishCall(sc); return; }
  $('#k-play span').textContent=t('kReplay');
  var t0=Date.now(); CALL.clock=setInterval(function(){ var s=Math.floor((Date.now()-t0)/1000*2.2); var ck=$('#k-clock'); if(ck) ck.textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0'); },250);
  var i=0;
  (function next(){
    if(gen!==CALL.gen) return;
    if(i>=sc.lines.length){ finishCall(sc); return; }
    var l=sc.lines[i++];
    typing(true);
    CALL.timer=setTimeout(function(){ if(gen!==CALL.gen) return; typing(false); addLine(l,sc,false); if(l[2]){ Object.assign(CALL.card,l[2]); renderCard(); var g=$$('#k-card .kf.got'); g.forEach(function(x){x.classList.add('pop');}); }
      speak(l[1],l[0],function(){ if(gen!==CALL.gen) return; CALL.timer=setTimeout(next, CALL.voice?250:Math.min(1900,600+l[1].length*12)); });
    }, l[0]==='ai'?750:520);
  })();
}
function finishCall(sc){
  clearInterval(CALL.clock); var ck=$('#k-clock'); if(ck) ck.textContent='1:52'; CALL.running=false; CALL.done=true; endLine();
  var id='call-'+CALL.lang;
  DB.mine=DB.mine.filter(function(r){return r.id!==id;});
  var req={id:id,ref:'ABC-'+(CALL.lang==='en'?'7401':'7402'),mine:true,src:'call',lang:CALL.lang,name:sc.name,area:sc.area,zip:sc.zip,phone:sc.caller,pid:sc.pid,size:'',tons:sc.tons,date:sc.date,win:sc.win,created:Date.now(),status:'new',kind:'h'};
  // received at 7:40 PM tonight (Phoenix) in the story
  var td=todayISO(); req.created=phxMs(td,19,41); if(req.created>Date.now()) req.created=phxMs(addDays(td,-1),19,41);
  DB.mine.unshift(req); delete DB.status[id]; save(DB); S.freshId=id;
  renderCard(); renderTabs(); toast(I[CALL.lang].toastCall);
}

/* ------------------------------------------------------------------ boot */
document.documentElement.lang=S.lang;
$$('.lang button').forEach(function(b){ b.classList.toggle('on',b.dataset.lang===S.lang); });
CALL.lang=S.lang;
renderAll();
var h=(location.hash||'').slice(1); if(h==='call'||h==='board'||h==='order') go(h,false);
window.ORDER247={state:S,calc:calc,reqs:allReqs,setLang:setLang,go:go,call:CALL};
})();
