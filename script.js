const STORAGE_SETTINGS='tlh_settings';
const STORAGE_REVIEWS='tlh_reviews';
const STORAGE_BOOKINGS='tlh_bookings';
const STORAGE_MESSAGES='tlh_messages';

const defaults={
  heroTitle:'Luxury Eyelash Extensions in Birmingham',
  heroSubtitle:'Bespoke lash artistry designed to enhance your natural beauty with soft, long-lasting, beautifully styled lash sets.',
  movingText:['New client appointments available this week','Luxury lash extensions in Birmingham','48-hour free cancellation window','Gift cards coming soon','Secure deposits through the website'],
  slots:['09:00','10:30','12:00','13:30','15:00','17:30'],
  instagram:'#',
  tiktok:'#',
  facebook:'#'
};

const defaultReviews=[
  {name:'Amira',rating:'★★★★★',text:'My lashes lasted so well and looked amazing. The whole experience felt luxury.',status:'approved'},
  {name:'Chloe',rating:'★★★★★',text:'Beautiful studio, clean, professional and such lovely service.',status:'approved'},
  {name:'Leah',rating:'★★★★★',text:'The best lash set I’ve had. I felt comfortable from start to finish.',status:'approved'}
];

function getSettings(){return {...defaults,...JSON.parse(localStorage.getItem(STORAGE_SETTINGS)||'{}')}}
function getReviews(){return JSON.parse(localStorage.getItem(STORAGE_REVIEWS)||'null')||defaultReviews}
function setReviews(items){localStorage.setItem(STORAGE_REVIEWS,JSON.stringify(items))}
function getBookings(){return JSON.parse(localStorage.getItem(STORAGE_BOOKINGS)||'[]')}
function setBookings(items){localStorage.setItem(STORAGE_BOOKINGS,JSON.stringify(items))}
function getMessages(){return JSON.parse(localStorage.getItem(STORAGE_MESSAGES)||'[]')}
function setMessages(items){localStorage.setItem(STORAGE_MESSAGES,JSON.stringify(items))}
function esc(str){return String(str||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}

const toast=document.getElementById('toast');
function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>toast.classList.remove('show'),2600)}

const menuBtn=document.getElementById('menuBtn');
const navLinks=document.getElementById('navLinks');
if(menuBtn) menuBtn.addEventListener('click',()=>navLinks.classList.toggle('open'));
document.querySelectorAll('.links a').forEach(link=>link.addEventListener('click',()=>navLinks.classList.remove('open')));

function renderPublic(){
  const s=getSettings();
  const title=document.querySelector('.hero h1');
  const subtitle=document.querySelector('.hero .lead');
  if(title) title.textContent=s.heroTitle;
  if(subtitle) subtitle.textContent=s.heroSubtitle;

  const moving=document.querySelector('.moving-track');
  if(moving) moving.innerHTML=[...s.movingText,...s.movingText].map(x=>`<span>${esc(x)}</span>`).join('');

  const slotList=document.getElementById('slotList');
  if(slotList){
    slotList.innerHTML=s.slots.map((slot,i)=>`<button type="button" class="slot ${i===0?'active':''}">${esc(slot)}</button>`).join('');
    slotList.querySelectorAll('.slot').forEach(slot=>slot.addEventListener('click',()=>{
      slotList.querySelectorAll('.slot').forEach(item=>item.classList.remove('active'));
      slot.classList.add('active');
    }));
  }

  document.querySelectorAll('[data-social]').forEach(link=>{
    const key=link.dataset.social.toLowerCase();
    link.href=s[key]||'#';
  });

  const reviewList=document.getElementById('reviewList');
  if(reviewList){
    reviewList.innerHTML=getReviews().filter(r=>r.status==='approved').map(r=>`
      <article class="review-card">
        <p class="stars">${esc(r.rating)}</p>
        <p>“${esc(r.text)}”</p>
        <strong>${esc(r.name)}</strong>
      </article>
    `).join('');
  }
}

const beforeAfterSlider=document.getElementById('beforeAfterSlider');
const afterLayer=document.getElementById('afterLayer');
if(beforeAfterSlider&&afterLayer) beforeAfterSlider.addEventListener('input',event=>{afterLayer.style.right=`${100-event.target.value}%`});

const lightbox=document.getElementById('lightbox');
const lightboxImg=document.getElementById('lightboxImg');
const closeLightbox=document.getElementById('closeLightbox');
document.querySelectorAll('.photo').forEach(photo=>photo.addEventListener('click',()=>{
  lightboxImg.src=photo.dataset.img;
  lightbox.classList.add('show');
  lightbox.setAttribute('aria-hidden','false');
}));
function hideLightbox(){lightbox.classList.remove('show');lightbox.setAttribute('aria-hidden','true');lightboxImg.src=''}
if(closeLightbox) closeLightbox.addEventListener('click',hideLightbox);
if(lightbox) lightbox.addEventListener('click',event=>{if(event.target===lightbox)hideLightbox()});
document.addEventListener('keydown',event=>{if(event.key==='Escape')hideLightbox()});

function markMissingFields(form){
  let ok=true;
  form.querySelectorAll('input,select,textarea').forEach(field=>{
    if(!field.checkValidity()){field.classList.add('required-warning');ok=false}
    else field.classList.remove('required-warning');
  });
  return ok;
}

const bookingForm=document.getElementById('bookingForm');
if(bookingForm) bookingForm.addEventListener('submit',event=>{
  event.preventDefault();
  const form=event.currentTarget;
  if(!markMissingFields(form)){showToast('Please complete the booking form first.');return}
  const treatment=document.getElementById('treatment').value;
  const selectedSlot=document.querySelector('.slot.active')?.textContent||'No time selected';
  const booking={id:Date.now(),name:document.getElementById('name').value,email:document.getElementById('email').value,treatment,date:document.getElementById('date').value,slot:selectedSlot,status:'pending',created:new Date().toLocaleString()};
  const bookings=getBookings();
  bookings.push(booking);
  setBookings(bookings);
  showToast(`Booking request sent to admin for ${treatment} at ${selectedSlot}.`);
  form.reset();
  renderPublic();
});

const contactForm=document.getElementById('contactForm');
if(contactForm) contactForm.addEventListener('submit',event=>{
  event.preventDefault();
  const form=event.currentTarget;
  if(!markMissingFields(form)){showToast('Please complete the enquiry form first.');return}
  const msg={id:Date.now(),name:document.getElementById('contactName').value,email:document.getElementById('contactEmail').value,text:document.getElementById('message').value,status:'new',created:new Date().toLocaleString()};
  const messages=getMessages();
  messages.push(msg);
  setMessages(messages);
  showToast('Your enquiry has been sent to admin.');
  form.reset();
});

const reviewForm=document.getElementById('reviewForm');
if(reviewForm) reviewForm.addEventListener('submit',event=>{
  event.preventDefault();
  const form=event.currentTarget;
  if(!markMissingFields(form)){showToast('Please complete your review first.');return}
  const reviews=getReviews();
  reviews.push({name:document.getElementById('reviewName').value,rating:document.getElementById('reviewRating').value,text:document.getElementById('reviewText').value,status:'pending',created:new Date().toLocaleString()});
  setReviews(reviews);
  showToast('Review submitted for admin approval.');
  form.reset();
});

document.querySelectorAll('[data-social]').forEach(link=>link.addEventListener('click',event=>{
  if(link.getAttribute('href')==='#'){event.preventDefault();showToast(`Add your ${link.dataset.social} link in admin.`)}
}));

const revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}})},{threshold:.12});
document.querySelectorAll('.reveal').forEach(element=>revealObserver.observe(element));
window.addEventListener('storage',renderPublic);
renderPublic();
