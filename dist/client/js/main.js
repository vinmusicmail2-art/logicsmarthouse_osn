// Logo — direct path
document.getElementById('navLogo').src = '/assets/logo.png';
document.getElementById('footerLogo').src = '/assets/logo.png';

// Cursor — only on non-touch (pointer) devices
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
if (isTouchDevice) {
  cursor.style.display = 'none';
  ring.style.display = 'none';
  document.body.style.cursor = '';
} else {
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
  (function a(){
    cursor.style.left=mx+'px';cursor.style.top=my+'px';
    rx+=(mx-rx)*.12;ry+=(my-ry)*.12;
    ring.style.left=rx+'px';ring.style.top=ry+'px';
    requestAnimationFrame(a);
  })();
  document.querySelectorAll('button,a,.solution-card,.feature-item,.photo-cell,.func-card,.hotel-feat,.compare-row,.nav-cta,.dash-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>{ring.style.width='52px';ring.style.height='52px';});
    el.addEventListener('mouseleave',()=>{ring.style.width='34px';ring.style.height='34px';});
  });
}

// Nav scroll
window.addEventListener('scroll',()=>document.getElementById('navbar').classList.toggle('scrolled',scrollY>60));

// Reveal on scroll
const obs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}});
},{threshold:.08});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

// Toggles
document.querySelectorAll('.dash-card-toggle').forEach(t=>t.addEventListener('click',()=>{
  t.classList.toggle('on'); t.classList.toggle('off');
}));

// Burger
function toggleMenu(){
  const m=document.getElementById('mobileMenu');
  const b=document.getElementById('burger');
  m.classList.toggle('open');
  b.classList.toggle('active');
  document.body.style.overflow = m.classList.contains('open') ? 'hidden' : '';
}
function closeMenu(){
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('burger').classList.remove('active');
  document.body.style.overflow='';
}
document.addEventListener('click',e=>{
  const m=document.getElementById('mobileMenu');
  const b=document.getElementById('burger');
  if(m.classList.contains('open')&&!m.contains(e.target)&&!b.contains(e.target)) closeMenu();
});

// Modal
function openModal(){
  document.getElementById('formWrap').style.display='';
  document.getElementById('formSuccess').style.display='none';
  document.getElementById('fName').value='';
  document.getElementById('fPhone').value='';
  document.getElementById('fType').value='';
  const btn=document.getElementById('formSubmit');
  btn.disabled=false;
  btn.textContent='Отправить заявку →';
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeModal(){
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow='';
}
document.getElementById('modalClose').onclick=closeModal;
document.getElementById('modalOverlay').addEventListener('click',e=>{
  if(e.target===e.currentTarget) closeModal();
});

// Phone mask
document.getElementById('fPhone').addEventListener('input',function(e){
  let v=e.target.value.replace(/\D/g,'');
  if(v.startsWith('7')||v.startsWith('8')) v=v.slice(1);
  let r='+7 ';
  if(v.length>0) r+='('+v.slice(0,3);
  if(v.length>=4) r+=') '+v.slice(3,6);
  if(v.length>=7) r+='-'+v.slice(6,8);
  if(v.length>=9) r+='-'+v.slice(8,10);
  e.target.value=r;
});

// Form submit
document.getElementById('formSubmit').onclick=async function(){
  const n=document.getElementById('fName');
  const p=document.getElementById('fPhone');
  const t=document.getElementById('fType');
  const c=document.getElementById('fConsent');
  let ok=true;
  [n,p].forEach(f=>{
    f.classList.remove('err');
    if(!f.value.trim()){f.classList.add('err');ok=false;}
  });
  if(!c.checked){
    c.parentElement.style.outline='1px solid #e55';
    c.parentElement.style.borderRadius='4px';
    ok=false;
  } else {
    c.parentElement.style.outline='';
  }
  if(!ok) return;
  const btn=document.getElementById('formSubmit');
  btn.disabled=true;
  btn.textContent='Отправка...';
  try{
    const res=await fetch('/api/submit',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name:n.value.trim(),phone:p.value.trim(),type:t.value})
    });
    if(res.ok){
      document.getElementById('formWrap').style.display='none';
      document.getElementById('formSuccess').style.display='block';
    } else {
      btn.disabled=false;
      btn.textContent='Отправить заявку →';
      alert('Произошла ошибка. Пожалуйста, позвоните нам напрямую.');
    }
  } catch(e){
    btn.disabled=false;
    btn.textContent='Отправить заявку →';
    alert('Произошла ошибка. Пожалуйста, позвоните нам напрямую.');
  }
};

// Solution modal — delegates to per-modal overlays defined in index.html
function closeSolModal(id) {
  const el = id
    ? document.getElementById('solModalOverlay' + id)
    : document.querySelector('.sol-modal-overlay.open');
  if (el) {
    el.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Cookie banner
(function(){
  if(!localStorage.getItem('cookieAccepted')){
    document.getElementById('cookieBanner').style.display='flex';
  }
})();
function acceptCookies(){
  localStorage.setItem('cookieAccepted','1');
  var b=document.getElementById('cookieBanner');
  b.style.opacity='0';
  b.style.transform='translateY(20px)';
  setTimeout(function(){b.style.display='none';},350);
}
function openCookiePolicyFromBanner(e){
  if(e)e.preventDefault();
  openCookiePolicy(e);
}

// Partners popup
var _partnersTimer=null;
function showPartners(e){
  cancelHidePartners();
  var popup=document.getElementById('partnersPopup');
  var trigger=document.getElementById('partnersTrigger');
  var rect=trigger.getBoundingClientRect();
  var pw=420;
  var left=rect.left;
  if(left+pw>window.innerWidth-16) left=window.innerWidth-pw-16;
  if(left<8) left=8;
  var top=rect.bottom+10;
  if(top+400>window.innerHeight) top=rect.top-420;
  popup.style.left=left+'px';
  popup.style.top=top+'px';
  popup.classList.add('open');
}
function hidePartners(){
  document.getElementById('partnersPopup').classList.remove('open');
}
function scheduleHidePartners(){
  _partnersTimer=setTimeout(hidePartners,200);
}
function cancelHidePartners(){
  if(_partnersTimer){clearTimeout(_partnersTimer);_partnersTimer=null;}
}