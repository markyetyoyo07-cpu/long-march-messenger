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
})();
