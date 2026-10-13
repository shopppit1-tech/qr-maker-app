const state={type:'url',otherKind:'phone',data:'',qr:null,logo:null};
const $=selector=>document.querySelector(selector);
const fields=$('#fields');
const typeNames={url:'URL',text:'teks',wifi:'Wi-Fi',email:'email',contact:'kontak',other:'lainnya'};
const otherKinds={phone:'Telepon',sms:'SMS',location:'Lokasi',whatsapp:'WhatsApp'};

function otherFields(kind){
  if(kind==='phone')return '<div class="field"><label for="otherPhone">Nomor telepon</label><input id="otherPhone" type="tel" inputmode="tel" placeholder="Masukkan nomor telepon" required></div>';
  if(kind==='sms')return '<div class="field"><label for="otherPhone">Nomor tujuan</label><input id="otherPhone" type="tel" inputmode="tel" placeholder="Masukkan nomor tujuan" required></div><div class="field"><label for="otherMessage">Pesan SMS</label><textarea id="otherMessage" placeholder="Tulis pesan" required></textarea></div>';
  if(kind==='location')return '<div class="field-row"><div class="field"><label for="latitude">Latitude</label><input id="latitude" type="number" step="any" placeholder="-6.200000" required></div><div class="field"><label for="longitude">Longitude</label><input id="longitude" type="number" step="any" placeholder="106.816666" required></div></div>';
  return '<div class="field"><label for="otherPhone">Nomor WhatsApp</label><input id="otherPhone" type="tel" inputmode="tel" placeholder="Masukkan nomor WhatsApp" required></div><div class="field"><label for="otherMessage">Pesan awal (opsional)</label><textarea id="otherMessage" placeholder="Tulis pesan"></textarea></div>';
}
const fieldSets={
  url:'<div class="field"><label for="url">Tautan URL</label><input id="url" type="url" placeholder="Tempelkan atau ketik URL Anda" autocomplete="url" required></div>',
  text:'<div class="field"><label for="text">Teks yang akan dibagikan</label><textarea id="text" placeholder="Tulis teks Anda" required></textarea></div>',
  wifi:'<div class="field"><label for="ssid">Nama jaringan Wi-Fi</label><input id="ssid" placeholder="Nama jaringan" autocomplete="off" required></div><div class="field-row"><div class="field"><label for="password">Kata sandi</label><input id="password" type="password" placeholder="Kata sandi Wi-Fi"></div><div class="field"><label for="security">Keamanan</label><select id="security"><option value="WPA">WPA / WPA2</option><option value="WEP">WEP</option><option value="nopass">Tanpa kata sandi</option></select></div></div>',
  email:'<div class="field"><label for="email">Alamat email tujuan</label><input id="email" type="email" placeholder="nama@email.com" required></div><div class="field-row"><div class="field"><label for="subject">Subjek (opsional)</label><input id="subject" placeholder="Subjek email"></div><div class="field"><label for="body">Pesan (opsional)</label><input id="body" placeholder="Isi pesan"></div></div>',
  contact:'<div class="field"><label for="contactName">Nama lengkap</label><input id="contactName" autocomplete="name" placeholder="Nama kontak" required></div><div class="field-row"><div class="field"><label for="contactPhone">Nomor telepon</label><input id="contactPhone" type="tel" placeholder="Nomor telepon"></div><div class="field"><label for="contactEmail">Email (opsional)</label><input id="contactEmail" type="email" placeholder="nama@email.com"></div></div><div class="field"><label for="organization">Organisasi (opsional)</label><input id="organization" placeholder="Nama perusahaan"></div>',
  other:'<div class="field"><label for="otherKind">Jenis QR lainnya</label><select id="otherKind"><option value="phone">Telepon</option><option value="sms">SMS</option><option value="location">Lokasi</option><option value="whatsapp">WhatsApp</option></select></div><div id="otherFields">'+otherFields('phone')+'</div>'
};
function setError(message=''){const box=$('#formError');box.textContent=message;box.hidden=!message;}
function clearOutput(){state.qr=null;state.data='';const canvas=$('#qrCanvas');canvas.width=640;canvas.height=640;canvas.getContext('2d').clearRect(0,0,640,640);$('.qr-frame').classList.remove('has-qr');$('#qrEmpty').hidden=false;$('#downloadBtn').disabled=true;$('#shareBtn').disabled=true;$('#shareQuickBtn').disabled=true;$('#statusBadge').textContent='Siap dipindai';$('#qrCaption').textContent='Buat QR Code setelah memasukkan data.';}
function setType(type){state.type=type;renderFields();clearOutput();setError('');}
function renderFields(){fields.innerHTML=fieldSets[state.type]||fieldSets.url;document.querySelectorAll('.type-option').forEach(button=>{const active=button.dataset.type===state.type;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active));});}
function value(id){return(document.getElementById(id)?.value||'').trim();}
function escapeWifi(text){return text.replace(/([\\;,:])/g,'\\$1');}
function escapeVCard(text){return text.replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');}
function payload(){
  if(state.type==='url')return value('url');
  if(state.type==='text')return value('text');
  if(state.type==='wifi'){const security=$('#security').value;return`WIFI:T:${security};S:${escapeWifi(value('ssid'))};P:${security==='nopass'?'':escapeWifi(value('password'))};;`;}
  if(state.type==='email'){const address=value('email');return`mailto:${address}?subject=${encodeURIComponent(value('subject'))}&body=${encodeURIComponent(value('body'))}`;}
  if(state.type==='contact'){const name=value('contactName'),phone=value('contactPhone'),email=value('contactEmail'),org=value('organization');return['BEGIN:VCARD','VERSION:3.0',`FN:${escapeVCard(name)}`,`N:${escapeVCard(name)}`,phone?`TEL:${escapeVCard(phone)}`:'',email?`EMAIL:${escapeVCard(email)}`:'',org?`ORG:${escapeVCard(org)}`:'','END:VCARD'].filter(Boolean).join('\n');}
  if(state.type==='other'){const kind=$('#otherKind')?.value||state.otherKind,phone=value('otherPhone'),message=value('otherMessage');if(kind==='phone')return`tel:${phone}`;if(kind==='sms')return`SMSTO:${phone}:${message}`;if(kind==='location')return`geo:${value('latitude')},${value('longitude')}`;return`https://wa.me/${phone.replace(/\D/g,'')}?text=${encodeURIComponent(message)}`;}
  return'';
}
function validPayload(data){
  if(state.type==='url'){if(!data){setError('Masukkan URL terlebih dahulu.');return false;}try{const parsed=new URL(data);if(!['http:','https:'].includes(parsed.protocol))throw new Error();}catch{setError('Masukkan URL lengkap yang diawali http:// atau https://.');return false;}}
  if(state.type==='text'&&!value('text')){setError('Masukkan teks terlebih dahulu.');return false;}
  if(state.type==='wifi'){if(!value('ssid')){setError('Masukkan nama jaringan Wi-Fi.');return false;}if($('#security').value!=='nopass'&&!value('password')){setError('Masukkan kata sandi Wi-Fi atau pilih jaringan tanpa kata sandi.');return false;}}
  if(state.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value('email'))){setError('Periksa kembali alamat email yang dimasukkan.');return false;}
  if(state.type==='contact'&&!value('contactName')){setError('Masukkan nama kontak.');return false;}
  if(state.type==='other'){
    const kind=$('#otherKind').value;
    if(['phone','sms','whatsapp'].includes(kind)&&!value('otherPhone')){setError('Masukkan nomor telepon terlebih dahulu.');return false;}
    if(kind==='sms'&&!value('otherMessage')){setError('Masukkan pesan SMS.');return false;}
    if(kind==='location'){const latText=value('latitude'),lonText=value('longitude'),lat=Number(latText),lon=Number(lonText);if(!latText||!lonText||!Number.isFinite(lat)||lat < -90||lat > 90||!Number.isFinite(lon)||lon < -180||lon > 180){setError('Masukkan koordinat latitude dan longitude yang valid.');return false;}}
    if(kind==='whatsapp'&&phoneNumberDigits(value('otherPhone')).length<7){setError('Masukkan nomor WhatsApp yang valid beserta kode negaranya.');return false;}
  }
  if(!data){setError('Masukkan data terlebih dahulu sebelum membuat QR code.');return false;}
  return true;
}
function phoneNumberDigits(text){return text.replace(/\D/g,'');}
function drawLogo(ctx,size){if(!state.logo)return;const mark=Math.round(size*.17),x=Math.round((size-mark)/2),y=x,pad=Math.round(mark*.14);ctx.fillStyle='#fff';ctx.fillRect(x-pad,y-pad,mark+pad*2,mark+pad*2);ctx.drawImage(state.logo,x,y,mark,mark);}
function draw(save=true){const data=payload();if(!validPayload(data))return false;try{if(typeof qrcode!=='function')throw new Error('QR library belum termuat');const qr=qrcode(0,'H');qr.addData(data);qr.make();state.qr=qr;state.data=data;const canvas=$('#qrCanvas'),size=Number($('#sizeInput').value)||512;canvas.width=size;canvas.height=size;const ctx=canvas.getContext('2d'),count=qr.getModuleCount(),pad=Math.max(16,Math.round(size*.075)),side=size-2*pad,cell=side/count;ctx.fillStyle='#fff';ctx.fillRect(0,0,size,size);ctx.fillStyle=$('#colorInput').value;for(let row=0;row<count;row++)for(let col=0;col<count;col++)if(qr.isDark(row,col))ctx.fillRect(Math.round(pad+col*cell),Math.round(pad+row*cell),Math.ceil(cell),Math.ceil(cell));drawLogo(ctx,size);$('.qr-frame').classList.add('has-qr');$('#qrEmpty').hidden=true;$('#statusBadge').textContent='Siap dipindai';$('#downloadBtn').disabled=false;$('#shareBtn').disabled=false;$('#shareQuickBtn').disabled=false;$('#qrCaption').textContent='Pindai QR code untuk membuka konten';setError('');if(save)saveHistory(data);return true;}catch(error){console.error(error);setError('QR code tidak dapat dibuat. Periksa kembali data Anda, lalu coba lagi.');$('#statusBadge').textContent='Perlu diperiksa';return false;}}
function escapeHtml(text){return String(text).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
function saveHistory(data){try{let history=JSON.parse(localStorage.getItem('qr-history')||'[]');history=[{type:state.type,data,at:new Date().toISOString()},...history.filter(item=>item.data!==data)].slice(0,12);localStorage.setItem('qr-history',JSON.stringify(history));renderHistory();}catch(error){console.warn('Riwayat tidak dapat disimpan pada perangkat ini.',error);}}
function renderHistory(){const list=$('#historyList');let history=[];try{history=JSON.parse(localStorage.getItem('qr-history')||'[]');}catch{}if(!history.length){list.innerHTML='<p class="history-empty">QR code yang Anda buat akan tampil di sini.</p>';return;}list.innerHTML=history.map((item,index)=>`<button class="history-item" type="button" data-history="${index}"><span class="history-thumb"><svg><use href="#i-qr"/></svg></span><span class="history-meta"><strong>QR ${escapeHtml(typeNames[item.type]||'konten')}</strong><span>${escapeHtml(item.data)}</span></span><span class="history-arrow">›</span></button>`).join('');}
function showScreen(name){document.querySelectorAll('.screen').forEach(screen=>screen.classList.toggle('active',screen.id===`screen-${name}`));document.querySelectorAll('.nav-item').forEach(button=>button.classList.toggle('active',button.dataset.screen===name));window.scrollTo({top:0,behavior:'smooth'});}
async function shareQR(){if(!state.qr)return;try{const blob=await new Promise(resolve=>$('#qrCanvas').toBlob(resolve,'image/png'));if(!blob)throw new Error('PNG tidak dapat dibuat');const file=new File([blob],'qr-maker.png',{type:'image/png'});if(navigator.canShare?.({files:[file]}))await navigator.share({title:'QR Code dari QR Maker',files:[file]});else if(navigator.share)await navigator.share({title:'QR Code dari QR Maker',text:state.data});else setError('Fitur berbagi tidak tersedia di browser ini. Silakan unduh PNG.');}catch(error){if(error.name!=='AbortError')setError('QR code tidak dapat dibagikan dari browser ini. Silakan unduh PNG.');}}
function startTemplate(type){setType(type);showScreen('buat');document.querySelectorAll('#fields input,#fields textarea').forEach(input=>input.focus({preventScroll:true}));}

document.querySelector('.type-grid').addEventListener('click',event=>{const button=event.target.closest('.type-option');if(button)setType(button.dataset.type);});
fields.addEventListener('input',event=>{if(event.target.id==='otherKind'){state.otherKind=event.target.value;$('#otherFields').innerHTML=otherFields(state.otherKind);clearOutput();}else if(state.qr&&payload()!==state.data)clearOutput();});
fields.addEventListener('change',event=>{if(event.target.id==='otherKind'){state.otherKind=event.target.value;$('#otherFields').innerHTML=otherFields(state.otherKind);clearOutput();}});
$('#qrForm').addEventListener('submit',event=>{event.preventDefault();if(!draw(true))fields.querySelector('input:not([type="hidden"]),textarea')?.focus();});
$('#colorInput').addEventListener('input',()=>{if(state.qr)draw(false);});
$('#sizeInput').addEventListener('change',()=>{if(state.qr)draw(false);});
$('#customizeBtn').addEventListener('click',()=>{const options=$('#customOptions'),open=options.hidden;options.hidden=!open;$('#customizeBtn').setAttribute('aria-expanded',String(open));});
$('#logoInput').addEventListener('change',event=>{const file=event.target.files?.[0];if(!file)return;if(!file.type.startsWith('image/')){setError('Pilih file gambar untuk logo.');return;}if(file.size>2*1024*1024){setError('Ukuran logo maksimal 2 MB.');event.target.value='';return;}const reader=new FileReader();reader.onload=()=>{const image=new Image();image.onload=()=>{state.logo=image;if(state.qr)draw(false);setError('');};image.onerror=()=>setError('Logo tidak dapat dibaca. Coba pilih gambar lain.');image.src=reader.result;};reader.readAsDataURL(file);});
$('#downloadBtn').addEventListener('click',()=>{if(!state.qr)return;const anchor=document.createElement('a');anchor.download=`qr-maker-${Number($('#sizeInput').value)||512}px.png`;anchor.href=$('#qrCanvas').toDataURL('image/png');anchor.click();});
$('#shareBtn').addEventListener('click',shareQR);$('#shareQuickBtn').addEventListener('click',shareQR);
$('#clearHistoryBtn').addEventListener('click',()=>{localStorage.removeItem('qr-history');renderHistory();});
$('#historyList').addEventListener('click',event=>{const button=event.target.closest('[data-history]');if(button){const history=JSON.parse(localStorage.getItem('qr-history')||'[]');const item=history[Number(button.dataset.history)];if(item){setType('text');$('#text').value=item.data;showScreen('buat');draw(false);}}});
document.querySelector('.bottom-nav').addEventListener('click',event=>{const button=event.target.closest('.nav-item');if(button)showScreen(button.dataset.screen);});
document.querySelectorAll('.template-card').forEach(button=>button.addEventListener('click',()=>startTemplate(button.dataset.template)));
$('#profileInstallBtn').addEventListener('click',()=>{if(deferredPrompt)installApp();else showScreen('buat');});
let deferredPrompt;window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredPrompt=event;});
async function installApp(){if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;}
$('#refreshBtn')?.addEventListener('click',()=>location.reload());
renderFields();renderHistory();
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js'));
