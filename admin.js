const ADMIN_EMAIL='admin@thelashhaus.co.uk';
const ADMIN_PASSWORD='nazeerahelvos';
const ADMIN_PASSWORD_STORAGE='tlh_admin_password';
function getAdminPassword(){return localStorage.getItem(ADMIN_PASSWORD_STORAGE)||ADMIN_PASSWORD;}

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
const defaultReviews=[{name:'Amira',rating:'★★★★★',text:'My lashes lasted so well and looked amazing. The whole experience felt luxury.',status:'approved'}];

function getSettings(){return {...defaults,...JSON.parse(localStorage.getItem(STORAGE_SETTINGS)||'{}')}}
function setSettings(x){localStorage.setItem(STORAGE_SETTINGS,JSON.stringify(x))}
function getReviews(){return JSON.parse(localStorage.getItem(STORAGE_REVIEWS)||'null')||defaultReviews}
function setReviews(x){localStorage.setItem(STORAGE_REVIEWS,JSON.stringify(x))}
function getBookings(){return JSON.parse(localStorage.getItem(STORAGE_BOOKINGS)||'[]')}
function setBookings(x){localStorage.setItem(STORAGE_BOOKINGS,JSON.stringify(x))}
function getMessages(){return JSON.parse(localStorage.getItem(STORAGE_MESSAGES)||'[]')}
function setMessages(x){localStorage.setItem(STORAGE_MESSAGES,JSON.stringify(x))}
function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function toast(m){toastEl.textContent=m;toastEl.classList.add('show');setTimeout(()=>toastEl.classList.remove('show'),2000)}
const toastEl=document.getElementById('toast');

function showApp(){loginScreen.classList.add('hidden');adminApp.classList.remove('hidden');render()}
if(sessionStorage.getItem('tlh_admin_logged_in')==='yes')showApp();
loginForm.addEventListener('submit',e=>{
  e.preventDefault();
  if(loginEmail.value===ADMIN_EMAIL&&loginPassword.value===getAdminPassword()){sessionStorage.setItem('tlh_admin_logged_in','yes');showApp()}
  else toast('Incorrect login')
});
logoutBtn.addEventListener('click',()=>{sessionStorage.clear();location.reload()});
document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.getElementById(tab.dataset.tab).classList.add('active');
}));

function populate(){
  const s=getSettings();
  heroTitleInput.value=s.heroTitle;
  heroSubtitleInput.value=s.heroSubtitle;
  homeLayoutInput.value=s.homeLayout;
  bannerSpeedInput.value=s.bannerSpeed;
  movingTextInput.value=s.movingText.join('\n');
  slotsInput.value=s.slots.join('\n');
  instagramInput.value=s.instagram;
  tiktokInput.value=s.tiktok;
  facebookInput.value=s.facebook;
  cancellationPolicyInput.value=s.cancellationPolicy;
  paymentMethodInput.value=s.paymentMethod;
  depositAmountInput.value=s.depositAmount;
  galleryImagesInput.value=s.galleryImages.join('\n');
}
function saveAll(){
  const s=getSettings();
  s.heroTitle=heroTitleInput.value;
  s.heroSubtitle=heroSubtitleInput.value;
  s.homeLayout=homeLayoutInput.value;
  s.bannerSpeed=bannerSpeedInput.value;
  s.movingText=movingTextInput.value.split('\n').map(x=>x.trim()).filter(Boolean);
  s.slots=slotsInput.value.split('\n').map(x=>x.trim()).filter(Boolean);
  s.instagram=instagramInput.value||'#';
  s.tiktok=tiktokInput.value||'#';
  s.facebook=facebookInput.value||'#';
  s.cancellationPolicy=cancellationPolicyInput.value;
  s.paymentMethod=paymentMethodInput.value;
  s.depositAmount=depositAmountInput.value||'20';
  s.galleryImages=galleryImagesInput.value.split('\n').map(x=>x.trim()).filter(Boolean);
  setSettings(s);
  toast('Published');
  render();
}
saveAllBtn.addEventListener('click',saveAll);
saveSlotsBtn.addEventListener('click',saveAll);
savePolicyBtn.addEventListener('click',saveAll);
savePaymentBtn.addEventListener('click',saveAll);
saveGalleryBtn.addEventListener('click',saveAll);

function setBookingStatus(id,status){const list=getBookings();const item=list.find(x=>x.id===id);if(item)item.status=status;setBookings(list);render()}
function setReviewStatus(i,status){const list=getReviews();list[i].status=status;setReviews(list);render()}
function setMessageStatus(id,status){const list=getMessages();const item=list.find(x=>x.id===id);if(item)item.status=status;setMessages(list);render()}

function render(){
  populate();
  const b=getBookings(),r=getReviews(),m=getMessages();
  statBookings.textContent=b.length;
  statPendingReviews.textContent=r.filter(x=>x.status==='pending').length;
  statMessages.textContent=m.length;
  bookingRows.innerHTML=b.length?b.map(x=>`<tr><td>${esc(x.name)}<br>${esc(x.treatment)} ${esc(x.date)} at ${esc(x.slot)}</td><td>${esc(x.status)}</td><td><button onclick="setBookingStatus(${x.id},'confirmed')">Confirm</button> <button onclick="setBookingStatus(${x.id},'cancelled')">Cancel</button></td></tr>`).join(''):'<tr><td>No bookings yet</td></tr>';
  reviewRows.innerHTML=r.map((x,i)=>`<tr><td>${esc(x.name)} - ${esc(x.rating)}<br>${esc(x.text)}</td><td>${esc(x.status)}</td><td><button onclick="setReviewStatus(${i},'approved')">Approve</button> <button onclick="setReviewStatus(${i},'hidden')">Hide</button></td></tr>`).join('');
  messageRows.innerHTML=m.length?m.map(x=>`<tr><td>${esc(x.name)} ${esc(x.email)}<br>${esc(x.text)}</td><td>${esc(x.status)}</td><td><button onclick="setMessageStatus(${x.id},'replied')">Replied</button></td></tr>`).join(''):'<tr><td>No messages yet</td></tr>';
}


// Reset password function
if (typeof showResetBtn !== 'undefined') {
  showResetBtn.addEventListener('click', () => {
    loginForm.classList.add('hidden');
    resetPasswordForm.classList.remove('hidden');
  });
}

if (typeof backToLoginBtn !== 'undefined') {
  backToLoginBtn.addEventListener('click', () => {
    resetPasswordForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  });
}

if (typeof resetPasswordForm !== 'undefined') {
  resetPasswordForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (resetEmail.value !== ADMIN_EMAIL) {
      toast('Email does not match admin account');
      return;
    }

    if (resetNewPassword.value.length < 8) {
      toast('Password must be at least 8 characters');
      return;
    }

    if (resetNewPassword.value !== resetConfirmPassword.value) {
      toast('Passwords do not match');
      return;
    }

    localStorage.setItem(ADMIN_PASSWORD_STORAGE, resetNewPassword.value);
    toast('Password updated. Please log in.');
    resetPasswordForm.reset();
    resetPasswordForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  });
}
