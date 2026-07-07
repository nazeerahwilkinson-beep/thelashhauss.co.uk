const toast=document.getElementById('toast');const menuBtn=document.getElementById('menuBtn');const navLinks=document.getElementById('navLinks');const lightbox=document.getElementById('lightbox');const lightboxImg=document.getElementById('lightboxImg');const closeLightbox=document.getElementById('closeLightbox');const beforeAfterSlider=document.getElementById('beforeAfterSlider');const afterLayer=document.getElementById('afterLayer');

function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>toast.classList.remove('show'),2600)}

menuBtn.addEventListener('click',()=>navLinks.classList.toggle('open'));
document.querySelectorAll('.links a').forEach(link=>link.addEventListener('click',()=>navLinks.classList.remove('open')));

document.querySelectorAll('.slot').forEach(slot=>{slot.addEventListener('click',()=>{document.querySelectorAll('.slot').forEach(item=>item.classList.remove('active'));slot.classList.add('active')})});

if(beforeAfterSlider&&afterLayer){beforeAfterSlider.addEventListener('input',event=>{afterLayer.style.right=`${100-event.target.value}%`})}

document.querySelectorAll('.photo').forEach(photo=>{photo.addEventListener('click',()=>{lightboxImg.src=photo.dataset.img;lightbox.classList.add('show');lightbox.setAttribute('aria-hidden','false')})});

function hideLightbox(){lightbox.classList.remove('show');lightbox.setAttribute('aria-hidden','true');lightboxImg.src=''}
closeLightbox.addEventListener('click',hideLightbox);
lightbox.addEventListener('click',event=>{if(event.target===lightbox)hideLightbox()});
document.addEventListener('keydown',event=>{if(event.key==='Escape')hideLightbox()});

function markMissingFields(form){let isValid=true;form.querySelectorAll('input,select,textarea').forEach(field=>{if(!field.checkValidity()){field.classList.add('required-warning');isValid=false}else{field.classList.remove('required-warning')}});return isValid}

document.getElementById('bookingForm').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;if(!markMissingFields(form)){showToast('Please complete the booking form first.');return}const treatment=document.getElementById('treatment').value;const selectedSlot=document.querySelector('.slot.active')?.textContent||'No time selected';showToast(`Booking request prepared for ${treatment} at ${selectedSlot}.`);form.reset();document.querySelectorAll('.slot').forEach(slot=>slot.classList.remove('active'));document.querySelector('.slot').classList.add('active')});

document.getElementById('contactForm').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;if(!markMissingFields(form)){showToast('Please complete the enquiry form first.');return}showToast('Your enquiry has been prepared. Connect this form to email when live.');form.reset()});

document.querySelectorAll('[data-social]').forEach(link=>{link.addEventListener('click',event=>{event.preventDefault();showToast(`Add your ${link.dataset.social} link in the HTML.`)})});

const revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}})},{threshold:.12});
document.querySelectorAll('.reveal').forEach(element=>revealObserver.observe(element));
