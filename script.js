const API_BASE='https://thelashhauss-co-uk-2.onrender.com';
const STORAGE_SETTINGS='tlh_settings',STORAGE_REVIEWS='tlh_reviews',STORAGE_BOOKINGS='tlh_bookings',STORAGE_MESSAGES='tlh_messages';

const defaults={
  heroTitle:'Luxury Eyelash Extensions in Birmingham',
  heroSubtitle:'Bespoke lash artistry designed to enhance your natural beauty with soft, long-lasting, beautifully styled lash sets.',
  homeLayout:'split',
  bannerSpeed:'medium',
  movingText:['New client appointments available this week','Luxury lash extensions in Birmingham','48-hour free cancellation window','Gift cards coming soon','Secure deposits through the website'],
  slots:['09:00','10:30','12:00','13:30','15:00','17:30'],
  instagram:'#',
  tiktok:'#',
  facebook:'#',
  cancellationPolicy:'Free cancellation up to 48 hours before your appointment. Inside 48 hours, deposits are normally non-refundable unless approved by admin.',
  paymentMethod:'stripe_deposit',
  depositAmount:'20',
  galleryImages:[
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1605980776566-0486c3ac7617?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=900&q=80'
  ]
};
const treatments=[
  ['Classic Lashes','From £55','Natural one-to-one lash extensions for a soft everyday look.'],
  ['Hybrid Lashes','From £65','A mix of classic and volume lashes for soft fullness and texture.'],
  ['Russian Volume','From £75','Full, fluffy, glamorous lashes using lightweight fans.'],
  ['Mega Volume','From £90','Maximum glam for clients who love a bold lash look.'],
  ['Lash Lift','From £45','Enhance your natural lashes with curl, lift and definition.'],
  ['Brow Lamination','From £40','Soft, lifted brows shaped to suit your face and style.']
];
const defaultReviews=[
  {name:'Amira',rating:'★★★★★',text:'My lashes lasted so well and looked amazing. The whole experience felt luxury.',status:'approved'},
  {name:'Chloe',rating:'★★★★★',text:'Beautiful studio, clean, professional and such lovely service.',status:'approved'}
];

function getSettings(){return {...defaults,...JSON.parse(localStorage.getItem(STORAGE_SETTINGS)||'{}')}}
function getReviews(){return JSON.parse(localStorage.getItem(STORAGE_REVIEWS)||'null')||defaultReviews}
function setReviews(x){localStorage.setItem(STORAGE_REVIEWS,JSON.stringify(x))}
function getBookings(){return JSON.parse(localStorage.getItem(STORAGE_BOOKINGS)||'[]')}
function setBookings(x){localStorage.setItem(STORAGE_BOOKINGS,JSON.stringify(x))}
function getMessages(){return JSON.parse(localStorage.getItem(STORAGE_MESSAGES)||'[]')}
function setMessages(x){localStorage.setItem(STORAGE_MESSAGES,JSON.stringify(x))}
function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}

const toast=document.getElementById('toast');
function showToast(m){toast.textContent=m;toast.classList.add('show');clearTimeout(window.tt);window.tt=setTimeout(()=>toast.classList.remove('show'),2600)}
async function postToBackend(endpoint,payload){
  try{
    const res=await fetch(`${API_BASE}${endpoint}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    return await res.json();
  }catch(e){
    console.warn(e);
    showToast('Server connection issue. Please try again.');
  }
}

menuBtn.addEventListener('click',()=>navLinks.classList.toggle('open'));
document.querySelectorAll('.links a').forEach(a=>a.addEventListener('click',()=>navLinks.classList.remove('open')));

function renderPublic(){
  const s=getSettings();
  heroTitle.textContent=s.heroTitle;
  heroSubtitle.textContent=s.heroSubtitle;

  const hero=document.querySelector('.hero');
  hero.classList.remove('layout-centered','layout-full');
  if(s.homeLayout==='centered') hero.classList.add('layout-centered');
  if(s.homeLayout==='full') hero.classList.add('layout-full');

  const speed=s.bannerSpeed==='fast'?'14s':s.bannerSpeed==='slow'?'42s':'28s';
  document.documentElement.style.setProperty('--banner-speed',speed);
  movingTrack.innerHTML=[...s.movingText,...s.movingText].map(x=>`<span>${esc(x)}</span>`).join('');

  treatmentCards.innerHTML=treatments.map(t=>`<article class="card"><h3>${t[0]}</h3><p class="price">${t[1]}</p><p>${t[2]}</p><a class="btn light full" href="#booking">Book Now</a></article>`).join('');
  treatment.innerHTML='<option value="">Select treatment</option>'+treatments.map(t=>`<option>${t[0]}</option>`).join('');

  slotList.innerHTML=s.slots.map((slot,i)=>`<button type="button" class="slot ${i===0?'active':''}">${esc(slot)}</button>`).join('');
  slotList.querySelectorAll('.slot').forEach(slot=>slot.addEventListener('click',()=>{slotList.querySelectorAll('.slot').forEach(x=>x.classList.remove('active'));slot.classList.add('active')}));

  galleryGrid.innerHTML=s.galleryImages.map(img=>`<button class="photo" data-img="${esc(img)}" style="background-image:url('${esc(img)}')"></button>`).join('');
  document.querySelectorAll('.photo').forEach(p=>p.addEventListener('click',()=>{lightboxImg.src=p.dataset.img;lightbox.classList.add('show')}));

  instagramLink.href=s.instagram;
  tiktokLink.href=s.tiktok;
  facebookLink.href=s.facebook;
  policyBox.textContent=s.cancellationPolicy;
  footerPolicy.textContent=s.cancellationPolicy;
  payDepositBtn.textContent=s.paymentMethod==='stripe_full'?'Pay Full Amount':`Pay £${s.depositAmount} Deposit`;

  reviewList.innerHTML=getReviews().filter(r=>r.status==='approved').map(r=>`<article class="review-card"><p class="stars">${esc(r.rating)}</p><p>“${esc(r.text)}”</p><strong>${esc(r.name)}</strong></article>`).join('');
}
beforeAfterSlider.addEventListener('input',e=>afterLayer.style.right=`${100-e.target.value}%`);
function hideLightbox(){lightbox.classList.remove('show');lightboxImg.src=''}
closeLightbox.addEventListener('click',hideLightbox);
lightbox.addEventListener('click',e=>{if(e.target===lightbox)hideLightbox()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')hideLightbox()});
function markMissing(form){let ok=true;form.querySelectorAll('input,select,textarea').forEach(f=>{if(!f.checkValidity()){f.classList.add('required-warning');ok=false}else f.classList.remove('required-warning')});return ok}

bookingForm.addEventListener('submit',async e=>{
  e.preventDefault();
  if(!markMissing(bookingForm)){showToast('Please complete the booking form.');return}
  const booking={id:Date.now(),name:name.value,email:email.value,treatment:treatment.value,date:date.value,slot:document.querySelector('.slot.active')?.textContent||'',status:'pending',created:new Date().toLocaleString()};
  const list=getBookings(); list.push(booking); setBookings(list);
  await postToBackend('/api/booking',booking);
  showToast('Booking request sent.');
  bookingForm.reset(); renderPublic();
});
payDepositBtn.addEventListener('click',async()=>{
  const s=getSettings();
  const result=await postToBackend('/api/payment-link',{amount:s.depositAmount,method:s.paymentMethod});
  if(result?.url) window.location.href=result.url;
  else showToast('Payment is not active yet. Add Stripe keys in Render.');
});
contactForm.addEventListener('submit',async e=>{
  e.preventDefault();
  if(!markMissing(contactForm)){showToast('Please complete the enquiry form.');return}
  const msg={id:Date.now(),name:contactName.value,email:contactEmail.value,text:message.value,status:'new',created:new Date().toLocaleString()};
  const list=getMessages(); list.push(msg); setMessages(list);
  await postToBackend('/api/contact',msg);
  showToast('Message sent.');
  contactForm.reset();
});
reviewForm.addEventListener('submit',async e=>{
  e.preventDefault();
  if(!markMissing(reviewForm)){showToast('Please complete your review.');return}
  const review={name:reviewName.value,rating:reviewRating.value,text:reviewText.value,status:'pending',created:new Date().toLocaleString()};
  const list=getReviews(); list.push(review); setReviews(list);
  await postToBackend('/api/review',review);
  showToast('Review submitted.');
  reviewForm.reset();
});
[instagramLink,tiktokLink,facebookLink].forEach(a=>a.addEventListener('click',e=>{if(a.getAttribute('href')==='#'){e.preventDefault();showToast('Social link coming soon.')}}));
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
window.addEventListener('storage',renderPublic);
renderPublic();
