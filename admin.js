const ADMIN_EMAIL='admin@thelashhaus.co.uk';
const ADMIN_PASSWORD='admin123';
const STORAGE_SETTINGS='tlh_settings';
const STORAGE_REVIEWS='tlh_reviews';
const STORAGE_BOOKINGS='tlh_bookings';
const STORAGE_MESSAGES='tlh_messages';

const defaults={heroTitle:'Luxury Eyelash Extensions in Birmingham',heroSubtitle:'Bespoke lash artistry designed to enhance your natural beauty with soft, long-lasting, beautifully styled lash sets.',movingText:['New client appointments available this week','Luxury lash extensions in Birmingham','48-hour free cancellation window','Gift cards coming soon','Secure deposits through the website'],slots:['09:00','10:30','12:00','13:30','15:00','17:30'],instagram:'#',tiktok:'#',facebook:'#'};
const defaultReviews=[{name:'Amira',rating:'★★★★★',text:'My lashes lasted so well and looked amazing. The whole experience felt luxury.',status:'approved'},{name:'Chloe',rating:'★★★★★',text:'Beautiful studio, clean, professional and such lovely service.',status:'approved'},{name:'Leah',rating:'★★★★★',text:'The best lash set I’ve had. I felt comfortable from start to finish.',status:'approved'}];

function getSettings(){return {...defaults,...JSON.parse(localStorage.getItem(STORAGE_SETTINGS)||'{}')}}
function setSettings(s){localStorage.setItem(STORAGE_SETTINGS,JSON.stringify(s))}
function getReviews(){return JSON.parse(localStorage.getItem(STORAGE_REVIEWS)||'null')||defaultReviews}
function setReviews(r){localStorage.setItem(STORAGE_REVIEWS,JSON.stringify(r))}
function getBookings(){return JSON.parse(localStorage.getItem(STORAGE_BOOKINGS)||'[]')}
function setBookings(b){localStorage.setItem(STORAGE_BOOKINGS,JSON.stringify(b))}
function getMessages(){return JSON.parse(localStorage.getItem(STORAGE_MESSAGES)||'[]')}
function setMessages(m){localStorage.setItem(STORAGE_MESSAGES,JSON.stringify(m))}
function esc(str){return String(str||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function toast(message){const t=document.getElementById('toast');t.textContent=message;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),2400)}

const loginScreen=document.getElementById('loginScreen');
const adminApp=document.getElementById('adminApp');
function showApp(){loginScreen.classList.add('hidden');adminApp.classList.remove('hidden');render()}
if(sessionStorage.getItem('tlh_admin_logged_in')==='yes') showApp();

document.getElementById('loginForm').addEventListener('submit',e=>{
  e.preventDefault();
  const email=document.getElementById('loginEmail').value.trim();
  const password=document.getElementById('loginPassword').value;
  if(email===ADMIN_EMAIL && password===ADMIN_PASSWORD){sessionStorage.setItem('tlh_admin_logged_in','yes');showApp();toast('Logged in')}
  else toast('Incorrect email or password')
});
document.getElementById('logoutBtn').addEventListener('click',()=>{sessionStorage.removeItem('tlh_admin_logged_in');location.reload()});

document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  tab.classList.add('active');
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  document.getElementById(tab.dataset.tab).classList.add('active');
  render();
}));

function populateSettings(){
  const s=getSettings();
  heroTitle.value=s.heroTitle;
  heroSubtitle.value=s.heroSubtitle;
  movingText.value=s.movingText.join('\n');
  slotsInput.value=s.slots.join('\n');
  instagram.value=s.instagram;
  tiktok.value=s.tiktok;
  facebook.value=s.facebook;
}
function saveAll(){
  const s=getSettings();
  s.heroTitle=heroTitle.value;
  s.heroSubtitle=heroSubtitle.value;
  s.movingText=movingText.value.split('\n').map(x=>x.trim()).filter(Boolean);
  s.slots=slotsInput.value.split('\n').map(x=>x.trim()).filter(Boolean);
  s.instagram=instagram.value.trim()||'#';
  s.tiktok=tiktok.value.trim()||'#';
  s.facebook=facebook.value.trim()||'#';
  setSettings(s);
  toast('Published. Public website updated.');
  render();
}
document.getElementById('saveAllBtn').addEventListener('click',saveAll);
document.getElementById('saveSlotsBtn').addEventListener('click',saveAll);

function setBookingStatus(id,status){const list=getBookings();const item=list.find(x=>x.id===id);if(item)item.status=status;setBookings(list);toast('Booking '+status);render()}
function setMessageStatus(id,status){const list=getMessages();const item=list.find(x=>x.id===id);if(item)item.status=status;setMessages(list);toast('Message '+status);render()}
function setReviewStatus(index,status){const list=getReviews();list[index].status=status;setReviews(list);toast('Review '+status);render()}

function render(){
  populateSettings();
  const bookings=getBookings();
  const messages=getMessages();
  const reviews=getReviews();
  statBookings.textContent=bookings.length;
  statPendingReviews.textContent=reviews.filter(r=>r.status==='pending').length;
  statMessages.textContent=messages.length;

  bookingRows.innerHTML=bookings.length?bookings.map(b=>`<tr><td>${esc(b.name)}<br><small>${esc(b.email)}</small></td><td>${esc(b.treatment)}<br>${esc(b.date)} at ${esc(b.slot)}</td><td><span class="pill ${esc(b.status)}">${esc(b.status)}</span></td><td><button class="smallbtn" onclick="setBookingStatus(${b.id},'confirmed')">Confirm</button><button class="smallbtn" onclick="setBookingStatus(${b.id},'pending')">Pending</button><button class="smallbtn" onclick="setBookingStatus(${b.id},'cancelled')">Cancel</button></td></tr>`).join(''):'<tr><td colspan="4">No bookings yet.</td></tr>';

  reviewRows.innerHTML=reviews.map((r,i)=>`<tr><td>${esc(r.name)}</td><td>${esc(r.rating)}</td><td>${esc(r.text)}</td><td><span class="pill ${r.status==='hidden'?'hiddenstatus':esc(r.status)}">${esc(r.status)}</span></td><td><button class="smallbtn" onclick="setReviewStatus(${i},'approved')">Approve</button><button class="smallbtn" onclick="setReviewStatus(${i},'pending')">Pending</button><button class="smallbtn" onclick="setReviewStatus(${i},'hidden')">Hide</button></td></tr>`).join('');

  messageRows.innerHTML=messages.length?messages.map(m=>`<tr><td>${esc(m.name)}</td><td>${esc(m.email)}</td><td>${esc(m.text)}</td><td><span class="pill ${esc(m.status)}">${esc(m.status)}</span></td><td><button class="smallbtn" onclick="setMessageStatus(${m.id},'replied')">Replied</button><button class="smallbtn" onclick="setMessageStatus(${m.id},'new')">New</button></td></tr>`).join(''):'<tr><td colspan="5">No messages yet.</td></tr>';
}

document.getElementById('resetBtn').addEventListener('click',()=>{if(confirm('Reset all prototype data?')){localStorage.removeItem(STORAGE_SETTINGS);localStorage.removeItem(STORAGE_REVIEWS);localStorage.removeItem(STORAGE_BOOKINGS);localStorage.removeItem(STORAGE_MESSAGES);toast('Reset complete');render()}});
window.addEventListener('storage',render);
