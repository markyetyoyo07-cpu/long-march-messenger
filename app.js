'use strict';
(() => {
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
 const read=k=>{try{return localStorage.getItem('xiang-story-'+k)}catch{return null}};
 const save=(k,v)=>{try{localStorage.setItem('xiang-story-'+k,v);return true}catch{return false}};
 const page=document.body.dataset.page;
 let visited=[];try{const stored=JSON.parse(read('visited-v2')||'[]');if(Array.isArray(stored))visited=stored.filter(v=>['profile','messenger','snow','grass','cinema','reflection','action'].includes(v))}catch{}
 if(page!=='index'&&!visited.includes(page))visited.push(page);save('visited-v2',JSON.stringify(visited));
 $('#visit-status').textContent=visited.length?'已经走过 '+visited.length+' 处故事场景':'点击路标，开始这段旅程';
 const menu=$('#mobile-menu'), menuButton=$('#menu-toggle');
 function setMenu(open){menu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'关闭场景目录':'打开场景目录')}
 menuButton.addEventListener('click',()=>setMenu(menu.hidden));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){setMenu(false);menuButton.focus()}});
 document.addEventListener('click',e=>{if(!menu.hidden&&!menu.contains(e.target)&&!menuButton.contains(e.target))setMenu(false)});
 const source=$('#sources-dialog');$$('[data-source]').forEach(b=>b.addEventListener('click',()=>source.showModal()));
 $('#sources-close').addEventListener('click',()=>source.close());
 source.addEventListener('click',e=>{const r=source.getBoundingClientRect();if(e.target===source&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))source.close()});
 function mark(buttons,index){buttons.forEach((b,i)=>{b.classList.toggle('active',i===index);b.setAttribute('aria-pressed',String(i===index))})}
 function tabs(buttons,activate){buttons.forEach((b,i)=>{b.addEventListener('click',()=>activate(i));b.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(i+1)%buttons.length;if(e.key==='ArrowLeft')n=(i+buttons.length-1)%buttons.length;if(e.key==='Home')n=0;if(e.key==='End')n=buttons.length-1;if(n!==undefined){e.preventDefault();activate(n);buttons[n].focus()}})})}
 function selectTabs(buttons,index){buttons.forEach((b,i)=>{b.setAttribute('aria-selected',String(i===index));b.tabIndex=i===index?0:-1})}
 function query(key,value){try{const url=new URL(location.href);url.searchParams.set(key,String(value));history.replaceState(null,'',url)}catch{}}
 if(page==='profile'){
  const bs=$$('[data-profile]');function profileTab(i){selectTabs(bs,i);$('#family-panel').hidden=i!==0;$('#arrival-panel').hidden=i!==1;query('part',i?'arrival':'family')}
  tabs(bs,profileTab);if(new URLSearchParams(location.search).get('part')==='arrival')profileTab(1);
  const dates=[['从家乡踏上长征','1935年11月，向轩随红二、六军团从湖南桑植出发，跟随队伍一路向前。'],['甘孜会师','1936年7月，红二、六军团在甘孜与红四方面军会师，随后编为红二方面军。'],['少年走进课堂','1936年10月，向轩随部队抵达陕北。后来，他留在延安学习，开始新的生活。']];
  const db=$$('[data-date]');db.forEach((b,i)=>b.addEventListener('click',()=>{mark(db,i);$('#date-title').textContent=dates[i][0];$('#date-copy').textContent=dates[i][1]}));
 }
 if(page==='messenger'){
  const bag=$('#satchel');function openBag(open){bag.setAttribute('aria-expanded',String(open));$('#letter-front').hidden=open;$('#work-record').hidden=!open;$('#bag-prompt').textContent=open?'点击收起工作记录 −':'点击打开通信包 ＋'}
  bag.addEventListener('click',()=>openBag(bag.getAttribute('aria-expanded')!=='true'));$('#open-letter').addEventListener('click',()=>{openBag(true);$('#task-0').focus()});
  const data=[['记录一','赶路，也是每天的考验。','行军中，通信班的少年们要跟上不断前进的队伍，同时承担日常勤务。年纪最小的向轩，也在其中。','除了走了多远，你还能看到他承担了什么？'],['记录二','把消息送到需要的人手中。','少年们负责传递消息。遇到敌人的封锁，他们有时需要冒着炮火穿过去。通信班的任务，必须在艰难的路上继续。','你觉得，完成这样的任务需要什么？'],['记录三','年纪小，也承担着责任。','向轩完成通信任务，后来被任命为通信班副班长。他既是被照顾的孩子，也是承担职责的战士。','当伙伴需要你时，你会怎样做好自己的那一部分？']];
  const bs=$$('[data-task]');tabs(bs,i=>{selectTabs(bs,i);$('#task-panel').setAttribute('aria-labelledby',bs[i].id);['#task-count','#task-title','#task-copy','#task-question'].forEach((id,k)=>$(id).textContent=data[i][k])});
 }
 if(page==='snow'){
  const data=[['第一幕','给孩子们的一头骡子','部队照顾年幼的孩子，特意给他们分配了一头骡子。起初，向轩和伙伴们轮流骑一段，缓一缓脚上的力气。'],['第二幕','把骡子让给伤病员','后来，孩子们把骡子让给了伤病员。原本帮助自己赶路的骡子，现在先去帮助更需要它的人。'],['第三幕','借着骡尾，一步一步向上爬','翻越雪山时，山顶空气稀薄，几个年幼的孩子实在走不动，就拉着骡子的尾巴，借一点力量，一步一步向上爬。']];
  let step=0;const bs=$$('[data-snow]');function setStep(i){step=i;mark(bs,i);['#snow-count','#snow-title','#snow-copy'].forEach((id,k)=>$(id).textContent=data[i][k]);$('#snow-next').innerHTML=i===2?'走向草地 <span>→</span>':'翻开下一幕 <span>→</span>';query('step',i)}
  bs.forEach((b,i)=>b.addEventListener('click',()=>setStep(i)));$('#snow-next').addEventListener('click',()=>{if(step<2)setStep(step+1);else location.href='grass.html'});
  const q=new URLSearchParams(location.search).get('step');if(q!==null&&['0','1','2'].includes(q))setStep(Number(q));
 }
 if(page==='grass'){
  function reveal(){ $('#care-answer').hidden=false;$('#care-conclusion').hidden=false;$('#care-reveal').hidden=true;query('reveal',1)}
  $('#care-reveal').addEventListener('click',reveal);if(new URLSearchParams(location.search).get('reveal')==='1')reveal();
 }
 if(page==='cinema'){
  const v=$('#story-video');v.addEventListener('ended',()=>{$('#recall-heading').textContent='影片看完了，你记住了哪一刻？';$('.film-after').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'})});window.addEventListener('pagehide',()=>v.pause());document.addEventListener('visibilitychange',()=>{if(document.hidden)v.pause()});
 }
 if(page==='reflection'){
  const data=[['九岁的向轩和伙伴们既要赶路，也要承担勤务、传递消息。他后来担任通信班副班长。','你怎样理解他肩上的责任？','messenger.html'],['孩子们把原本帮助自己的骡子让给伤病员。翻雪山时，他们拉着骡尾继续向上爬。','自己也很累时，为什么仍愿意让出骡子？','snow.html?step=2'],['草地上缺少食物，战友们仍把找到的食物先分给孩子。有人把食物留给战友，自己却没能走出草地。','为什么多年以后，向轩仍记得这份照顾？','grass.html?reveal=1']];const bs=$$('[data-memory]');bs.forEach((b,i)=>b.addEventListener('click',()=>{mark(bs,i);$('#memory-fact').textContent=data[i][0];$('#memory-question').textContent=data[i][1];$('#memory-link').href=data[i][2]}));
 }
 if(page==='action'){
  const text=$('#action-text'),topic=$('#action-topic');text.value=(read('action')||'').slice(0,120);const stored=read('topic');if([...topic.options].some(o=>o.value===stored))topic.value=stored;
  function update(){ $('#wordcount').textContent=text.value.length+' / 120';save('action',text.value);save('topic',topic.value)}text.addEventListener('input',update);topic.addEventListener('change',update);update();
  function wrap(ctx,value,width){const lines=[];let line='';for(const ch of value){if(ch==='\n'){lines.push(line);line='';continue}if(line&&ctx.measureText(line+ch).width>width){lines.push(line);line=ch}else line+=ch}if(line)lines.push(line);return lines}
  $('#action-form').addEventListener('submit',async e=>{e.preventDefault();const value=text.value.trim();if(!value){$('#action-status').textContent='先写下一件你愿意做的小事。';text.focus();return}const b=$('button[type=submit]');b.disabled=true;try{
   if(document.fonts?.ready)await document.fonts.ready;
   const canvas=document.createElement('canvas');canvas.width=1200;const ctx=canvas.getContext('2d');if(!ctx)throw new Error('canvas');ctx.font='34px "Microsoft YaHei",sans-serif';const lines=wrap(ctx,value,960);canvas.height=Math.max(850,530+lines.length*58);
   ctx.fillStyle='#fff6e3';ctx.fillRect(0,0,1200,canvas.height);ctx.fillStyle='#167d7f';ctx.fillRect(0,0,1200,28);ctx.fillStyle='#f2c35c';ctx.fillRect(0,28,1200,13);ctx.fillStyle='#c84332';ctx.fillRect(75,90,12,650);ctx.font='25px "Microsoft YaHei",sans-serif';ctx.fillText('长征路上的通信员 · 把一点力量带回今天',115,140);ctx.font='bold 65px SimSun,serif';ctx.fillStyle='#163951';ctx.fillText('我的行动卡',115,255);ctx.font='27px "Microsoft YaHei",sans-serif';ctx.fillStyle='#738166';ctx.fillText(topic.value,115,330);ctx.fillStyle='#263b40';ctx.font='34px "Microsoft YaHei",sans-serif';lines.forEach((line,i)=>ctx.fillText(line,115,420+i*58));ctx.fillStyle='#c84332';ctx.font='30px SimSun,serif';ctx.fillText('把答应的事做好，给同伴一点力量。',115,canvas.height-125);ctx.fillStyle='#8b9573';ctx.font='21px "Microsoft YaHei",sans-serif';ctx.fillText('从一件可以做到的小事开始',115,canvas.height-75);
   const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw new Error('blob');const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='我的行动卡.png';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);$('#action-status').textContent=save('action',value)?'行动卡已生成，文字已保存在当前浏览器。':'行动卡已生成。此浏览器不允许保存文字，请保留下载的图片。';
  }catch{$('#action-status').textContent='图片暂时无法生成，请复制并保存你写下的文字。'}finally{b.disabled=false}});
 }
})();
