// Trucking Planner SPA
// State & persistence
const ACCOUNTS = {
  "Almira@app.co.id": { password: "1110", role: "admin" },
  "cakraindo@vendor.com": { password: "123", role: "vendor", vendor: "PT Cakraindo Mitra International" },
  "argotm@vendor.com": { password: "123", role: "vendor", vendor: "PT Argo Trans Mandiri" },
  "puninar@vendor.com": { password: "123", role: "vendor", vendor: "PT Puninar Logistics" },
  "elang@vendor.com": { password: "123", role: "vendor", vendor: "PT Elang Transportasi Indonesia" },
  "tangguhkj@vendor.com": { password: "123", role: "vendor", vendor: "PT Tangguh Karimata Jaya" },
  "bsa@vendor.com": { password: "123", role: "vendor", vendor: "PT BSA Logistics Indonesia" },
  "intipm@vendor.com": { password: "123", role: "vendor", vendor: "PT Inti Persada Mandiri" },
  "lintasbk@vendor.com": { password: "123", role: "vendor", vendor: "PT Lintas Buana Karya" },
  "putrass@vendor.com": { password: "123", role: "vendor", vendor: "PT Putra Sejahtera Sentosa" },
  "lintasmn@vendor.com": { password: "123", role: "vendor", vendor: "PT Lintas Marindo Nusantara" },
  "glorybu@vendor.com": { password: "123", role: "vendor", vendor: "PT Glory Bahana Universal" },
  "megast@vendor.com": { password: "123", role: "vendor", vendor: "PT Mega Samudra Transportasi" },
  "trisindo@vendor.com": { password: "123", role: "vendor", vendor: "PT Trisindo" },
  "bimaruna@vendor.com": { password: "123", role: "vendor", vendor: "PT Bimaruna Jaya" },
};
const STATUS_TRUCKING = [
  "Pending","Confirm Order","otw depo","muat depo","otw pabrik","muat gudang","gate in port"
];
const VENDORS_DEFAULT = ["PT Cakraindo Mitra International","PT Argo Trans Mandiri","PT Puninar Logistics","PT Elang Transportasi Indonesia","PT Tangguh Karimata Jaya","PT BSA Logistics Indonesia","PT Inti Persada Mandiri","PT Lintas Buana Karya","PT Putra Sejahtera Sentosa","PT Lintas Marindo Nusantara","PT Glory Bahana Universal","PT Mega Samudra Transportasi","PT Trisindo","PT Bimaruna Jaya"];
const DATE_FMT = "YYYY-MM-DD";
const TIME_FMT = "HH:MM";

function todayStr(){
  const d = new Date();
  return toISODate(d);
}
function genId(prefix="ORD"){
  return `${prefix}-${crypto.randomUUID().slice(0,8).toUpperCase()}`;
}
function toISODate(date){
  const y = date.getFullYear();
  const m = String(date.getMonth()+1).padStart(2,'0');
  const d = String(date.getDate()).padStart(2,'0');
  return `${y}-${m}-${d}`;
}
function parseISODate(s){
  if(!s) return new Date();
  const [y,m,d] = s.split("-").map(Number);
  return new Date(y, (m||1)-1, d||1);
}
// REVISION 4: New date formatting helper
function formatDisplayDate(isoDate) {
    if (!isoDate || typeof isoDate !== 'string' || !isoDate.includes('-')) {
        return isoDate; // Return original if invalid, null, or not a string
    }
    const parts = isoDate.split('-');
    if (parts.length !== 3) return isoDate; // Return original if format is wrong
    const [y, m, d] = parts;
    return `${d}-${m}-${y}`;
}
function fmtDT(dateStr, timeStr){
  try { 
      const formattedDate = formatDisplayDate(dateStr);
      return `${formattedDate} ${timeStr||""}`.trim(); 
    } catch(e){ return dateStr; }
}
function saveState(){
  localStorage.setItem("tps_state", JSON.stringify(state));
  setLastUpdate();
}
function loadState(){
  try{
    const raw = localStorage.getItem("tps_state");
    if(!raw) return null;
    return JSON.parse(raw);
  }catch(e){ return null; }
}
function toast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(()=> t.classList.remove("show"), 1800);
}

const defaultState = {
  authenticated:false, user_role:null, username:null, vendor_name:null,
  order_vendor_prefill:null, availability:{}, orders:[], containers:{},
  selected_date_admin: todayStr(), selected_date_vendor: todayStr(),
  active_order_for_detail:null, attachments:{}, outstanding_data:[], outstanding_file:null,
  show_vendor_detail_admin:false, menu_admin:"Home", menu_vendor:"Home",
  outstanding_files:[], active_preview_file_id: null, active_parent_menu: "Report",
  editing_order_id: null
};
let state = Object.assign({}, defaultState, loadState()||{});

// UI scaffolding
const content = document.getElementById("content");
const menuBox = document.getElementById("menu");
const sbUser = document.getElementById("sb-username");
const sbRole = document.getElementById("sb-role");
const sbVendorWrap = document.getElementById("sb-vendor-wrap");
const sbVendor = document.getElementById("sb-vendor");
const sidebarEl = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");

if (sidebarToggle) {
  sidebarToggle.addEventListener("click", () => {
    // This now toggles the icon-only collapsed state
    const collapsed = document.body.classList.toggle("sidebar-collapsed");
    sidebarToggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
    sidebarToggle.textContent = collapsed ? "»" : "«";
  });
  // Initialize button state on load
  const collapsedInit = document.body.classList.contains("sidebar-collapsed");
  sidebarToggle.setAttribute("aria-expanded", collapsedInit ? "false" : "true");
  sidebarToggle.textContent = collapsedInit ? "»" : "«";
}


document.getElementById("logoutBtn").onclick = ()=>{
  state = Object.assign({}, defaultState, {authenticated:false});
  saveState();
  render();
};
function setLastUpdate(){
  const el = document.getElementById("lastUpdate");
  const now = new Date();
  el.textContent = `Last Update: ${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')} | v2.0`;
}
setLastUpdate();

// ======== Modal Helpers ========
function openModal(title, html, options = {}){
  const m = document.getElementById('modal'); if(!m) return;
  const t = document.getElementById('modalTitle'); const b = document.getElementById('modalBody');
  const closeBtn = document.getElementById('modalClose');

  if(t) t.textContent = title || 'Detail';
  if(b) b.innerHTML = html || '';
  
  if (closeBtn) {
    if (options.closeBtnText) {
      closeBtn.textContent = options.closeBtnText;
      closeBtn.className = `btn ${options.closeBtnClass || 'danger'}`;
    } else {
      closeBtn.textContent = 'Tutup';
      closeBtn.className = 'btn danger';
    }

    // Clone and replace the button to remove old event listeners
    const newCloseBtn = closeBtn.cloneNode(true);
    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
    
    if (options.onClose) {
        newCloseBtn.onclick = options.onClose;
    } else {
        newCloseBtn.onclick = closeModal;
    }
  }

  m.classList.add('show'); m.setAttribute('aria-hidden','false');
}
function closeModal(){
  const m = document.getElementById('modal'); if(!m) return;
  m.classList.remove('show'); m.setAttribute('aria-hidden','true');
}
document.addEventListener('click', (e)=>{
  if(e.target && e.target.hasAttribute('data-close')) closeModal();
});


// Routing
function render(){
  sbUser.textContent = state.username || "-";
  sbRole.textContent = state.user_role ? (state.user_role==="vendor" ? "EMKL" : state.user_role.toUpperCase()) : "-";
  if(state.user_role==="vendor"){
    sbVendorWrap.style.display = "block";
    sbVendor.textContent = state.vendor_name || "-";
  } else {
    sbVendorWrap.style.display = "none";
  }

  if(!state.authenticated){
    if (sidebarEl) sidebarEl.style.display = 'none';
    document.body.classList.add('login-only');
    return renderLogin();
  }
  renderSidebar();
  document.body.classList.remove('login-only'); if (sidebarEl) sidebarEl.style.display = ''; if(state.user_role==="admin"){
    switch(state.menu_admin){
      case "Home": return renderAdminHome();
      case "Order to EMKL": return renderAdminOrder();
      case "Status Truck": return renderAdminStatus();
      case "Data Outstanding": return renderOutstanding();
      case "Rate Transporter": return renderRateTransporter(); // <-- BARU DITAMBAHKAN
      case "BOC": return renderReport();
      case "DCR": return renderDCR();
      case "DDCR": return renderDDCR();
      case "Report Durasi": return renderReportDurasi(); 
      default: return renderAdminHome();
    }
  } else {
    switch(state.menu_vendor){
      case "Home": return renderVendorHome();
      case "Orderan": return renderVendorOrderan();
      case "List Orderan (Add Detail)": return renderVendorListDetail();
      default: return renderVendorHome();
    }
  }
}

// Sidebar
function renderSidebar(){
    // --- PERUBAHAN DI SINI ---
    const itemsAdmin = [
        { icon: "🏠", text: "Home" },
        { icon: "📦", text: "Order to EMKL" },
        { icon: "🚛", text: "Status Truck" },
        { icon: "🧾", text: "Data Outstanding" },
        { icon: "💰", text: "Rate Transporter" }, // <-- BARU DITAMBAHKAN
        { 
            icon: "📊", 
            text: "Report",
            children: [
                { icon: "📄", text: "BOC" },
                { icon: "📑", text: "DCR" },
                { icon: "📋", text: "DDCR" },
                { icon: "⏱️", text: "Report Durasi" }
            ]
        }
    ];
    // --- AKHIR PERUBAHAN ---

    const itemsVendor = [
        { icon: "🏠", text: "Home" },
        { icon: "📑", text: "Orderan" },
        { icon: "📋", text: "List Orderan (Add Detail)" }
    ];

  const items = state.user_role==="admin" ? itemsAdmin : itemsVendor;
  const currentMenu = state.user_role === "admin" ? state.menu_admin : state.menu_vendor;
  
  let menuHtml = "";
  items.forEach(item => {
    if (!item.children) {
      // Regular menu item
      const active = currentMenu === item.text ? "active" : "";
      menuHtml += `<button class="menu-item ${active}" data-menu="${item.text}">
                      <span class="icon">${item.icon}</span>
                      <span class="text">${item.text}</span>
                   </button>`;
    } else {
      // Parent menu item with children
      const isChildActive = item.children.some(child => child.text === currentMenu);
      const isParentOpen = state.active_parent_menu === item.text || isChildActive;
      const parentClass = (isParentOpen) ? 'parent-active' : '';

      menuHtml += `<button class="menu-item is-parent ${parentClass}" data-parent-menu="${item.text}">
                      <span class="icon">${item.icon}</span>
                      <span class="text">${item.text}</span>
                      <span class="arrow">${isParentOpen ? '▼' : '►'}</span>
                   </button>`;
      
      if (isParentOpen) {
        menuHtml += `<div class="submenu-container">`;
        item.children.forEach(child => {
          const active = currentMenu === child.text ? "active" : "";
          menuHtml += `<button class="menu-item submenu-item ${active}" data-menu="${child.text}">
                          <span class="icon">${child.icon}</span>
                          <span class="text">${child.text}</span>
                       </button>`;
        });
        menuHtml += `</div>`;
      }
    }
  });

  menuBox.innerHTML = menuHtml;
  
  // Attach event listeners
  menuBox.querySelectorAll(".menu-item").forEach(btn=>{
    if (btn.dataset.parentMenu) {
      // Parent button
      btn.onclick = () => {
        const menuName = btn.dataset.parentMenu;
        // Toggle submenu
        state.active_parent_menu = state.active_parent_menu === menuName ? null : menuName;
        saveState();
        renderSidebar(); // Just re-render the sidebar, not the whole app
      };
    } else {
      // Regular or child button
      btn.onclick = ()=>{
        const v = btn.dataset.menu;
        if(state.user_role==="admin") {
            state.menu_admin = v;
            // Also update active parent if a child is clicked
            const parent = itemsAdmin.find(item => item.children && item.children.some(child => child.text === v));
            if (parent) {
                state.active_parent_menu = parent.text;
            }
        } else {
            state.menu_vendor = v;
        }
        saveState(); 
        render();
      };
    }
  });
}

// Login
function renderLogin(){
  // 1. Mengubah class body agar sesuai dengan style.css baru
  //    (menggunakan 'login-page' bukan 'login-only')
  document.body.classList.remove('login-only');
  document.body.classList.add('login-page');

  // 2. Menggunakan struktur HTML dari file index.html baru Anda
  content.innerHTML = `
    <div class="container right-panel-active" id="container">
        
        <div class="form-container sign-up-container">
            <form action="#" id="adminLoginForm">
                <h1>Admin Login</h1>
                <span>Gunakan akun admin Anda</span>
                <input type="email" id="login_user_admin" placeholder="Email" required />
                <input type="password" id="login_pass_admin" placeholder="Password" required />
                <a href="#" id="adminHelp" style="margin-top: 10px;">Contoh: Almira@app.co.id / 1110</a>
                <button type="submit" style="margin-top: 10px;">Login</button>
            </form>
        </div>

        <div class="form-container sign-in-container">
            <form action="#" id="vendorLoginForm">
                <h1>Vendor Login</h1>
                <span>Gunakan akun vendor Anda</span>
                <input type="email" id="login_user_vendor" placeholder="Email" required />
                <input type="password" id="login_pass_vendor" placeholder="Password" required />
                <a href="#" id="vendorHelp" style="margin-top: 10px;">Contoh: argotm@vendor.com / 123</a>
                <button type="submit" style="margin-top: 10px;">Login</button>
            </form>
        </div>

        <div class="overlay-container">
            <div class="overlay">
                
                <div class="overlay-panel overlay-left">
                    <h1>Welcome, Admin!</h1>
                    <p>Masukkan detail Anda untuk mengakses dashboard</p>
                    <button class="ghost" id="signIn">Login sebagai Vendor?</button>
                </div>

                <div class="overlay-panel overlay-right">
                    <h1>Welcome, Vendor!</h1>
                    <p>Masukkan detail Anda untuk mengakses portal</p>
                    <button class="ghost" id="signUp">Login sebagai Admin?</button>
                </div>

            </div>
        </div>
    </div>
  `;

  // 3. Menambahkan logika animasi dari file script.js baru Anda
  const signUpButton = document.getElementById('signUp');
  const signInButton = document.getElementById('signIn');
  const container = document.getElementById('container');

  if(signUpButton) {
    signUpButton.addEventListener('click', (e) => {
        e.preventDefault();
        container.classList.add('right-panel-active');
    });
  }
  
  if(signInButton) {
    signInButton.addEventListener('click', (e) => {
        e.preventDefault();
        container.classList.remove('right-panel-active');
    });
  }

  // 4. Menghubungkan logika otentikasi (dari app.js lama) ke DUA tombol login baru
  
  // Helper fungsi untuk pengecekan login (diambil dari app.js lama)
  const attemptLogin = (username, password, expectedRole) => {
    const u = username.trim();
    const acc = ACCOUNTS[u]; // ACCOUNTS dari scope global app.js
    if(acc && acc.password === password && acc.role === expectedRole){
      state.authenticated = true;
      state.username = u;
      state.user_role = acc.role;
      state.vendor_name = acc.vendor || null;
      
      // Hapus class login setelah berhasil
      document.body.classList.remove('login-page'); 
      
      saveState(); 
      render();
    } else {
      toast("Login gagal. Cek email, password, atau role Anda.");
    }
  };

  // Listener untuk form login Admin
  const adminForm = document.getElementById('adminLoginForm');
  if(adminForm) {
    adminForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = document.getElementById('login_user_admin').value;
      const p = document.getElementById('login_pass_admin').value;
      attemptLogin(u, p, 'admin');
    });
  }

  // Listener untuk form login Vendor
  const vendorForm = document.getElementById('vendorLoginForm');
  if(vendorForm) {
    vendorForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = document.getElementById('login_user_vendor').value;
      const p = document.getElementById('login_pass_vendor').value;
      attemptLogin(u, p, 'vendor');
    });
  }

  // Listener untuk teks bantuan
  const adminHelp = document.getElementById('adminHelp');
  if(adminHelp) adminHelp.onclick = (e) => { e.preventDefault(); toast('Admin: Almira@app.co.id / 1110'); };
  
  const vendorHelp = document.getElementById('vendorHelp');
  if(vendorHelp) vendorHelp.onclick = (e) => { e.preventDefault(); toast('Vendor: argotm@vendor.com / 123'); };
}

// Helpers
function monthMatrix(year, month){
  const first = new Date(year, month-1, 1);
  let startOffset = first.getDay();
  startOffset = (startOffset===0) ? 6 : startOffset-1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const rows = [];
  let week = new Array(7).fill(0);
  let day = 1;
  for(let i=0;i<startOffset;i++) week[i]=0;
  for(let i=startOffset;i<7;i++) week[i]=day++;
  rows.push(week);
  while(day<=daysInMonth){
    week = new Array(7).fill(0);
    for(let i=0;i<7 && day<=daysInMonth;i++){
      week[i]=day++;
    }
    rows.push(week);
  }
  return rows;
}
// REVISION 3: Updated to include 'Combo'
function sumAvailForDate(dateStr){
  const data = state.availability[dateStr] || {};
  let total20 = 0, total40 = 0, totalCombo = 0;
  for(const v of Object.keys(data)){
    total20 += Number(data[v]["20ft"]||0);
    total40 += Number(data[v]["40ft/HC"]||0);
    totalCombo += Number(data[v]["Combo"]||0);
  }
  return {total20, total40, totalCombo, totalAll: total20 + total40 + totalCombo};
}
function updateOrderSummary(orderId){
  const items = state.containers[orderId] || [];
  let acc=0, rej=0, pen=0;
  for(const r of items){
    if(r.accept===true) acc++; else if(r.accept===false) rej++; else pen++;
  }
  let status="Pending";
  if(pen===0 && acc>0 && rej===0) status="Accepted";
  else if(pen===0 && rej>0 && acc===0) status="Rejected";
  else if(pen===0 && acc>0 && rej>0) status="Partial";
  const o = state.orders.find(x=>x.order_id===orderId);
  if(o){ o.summary_status = status; saveState(); }
}
function attachFile(orderId, key, file){
  const reader = new FileReader();
  reader.onload = () => {
    state.attachments[orderId] = state.attachments[orderId] || {};
    state.attachments[orderId][key] = {name:file.name, dataUrl:reader.result};
    saveState(); render();
    toast(`${key==='booking_confirmation'?'BC':'SI'} tersimpan.`);
  };
  reader.readAsDataURL(file);
}
function downloadDataUrl(name, dataUrl){
  const a = document.createElement("a");
  a.href = dataUrl; a.download = name; a.click();
}

/* ===================== ADMIN: HOME (Kalender) ===================== */
/* ===================== ADMIN: HOME (Kalender) ===================== */
function buildStatusDashboardInner(){
  const counts = {};
  // Inisialisasi semua status dengan hitungan 0
  STATUS_TRUCKING.forEach(s => counts[s] = 0);

  for (const oid in state.containers){
    const rows = state.containers[oid] || [];
    rows.forEach(r => {
      // Ambil status yang tersimpan, ubah ke huruf kecil untuk perbandingan
      const savedStatus = (r.status || STATUS_TRUCKING[0]).toLowerCase();
      
      // Cari status yang benar (dengan kapitalisasi yang sesuai) dari array utama
      // Ini akan mencocokkan "otw depo" (dari data lama) dengan "otw depo" (di array)
      // dan "confirm order" dengan "Confirm Order"
      const correctKey = STATUS_TRUCKING.find(k => k.toLowerCase() === savedStatus);

      if (correctKey) {
        // Tambahkan hitungan ke key yang benar
        counts[correctKey] = (counts[correctKey] || 0) + 1;
      } else {
        // Jika karena alasan aneh tidak ditemukan, anggap sebagai "Pending"
        counts[STATUS_TRUCKING[0]] = (counts[STATUS_TRUCKING[0]] || 0) + 1;
      }
    });
  }
  let html = '<div class="row">';
  STATUS_TRUCKING.forEach(s => {
    const val = counts[s] || 0;
    // Tampilkan nama status dengan huruf kapital di awal kata agar rapi
    const displayStatus = s.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    html += `
      <div class="col" style="grid-column: span 3;">
        <div class="stat-card">
          <div class="stat-num">${val}</div>
          <div class="stat-label">${displayStatus}</div>
        </div>
      </div>`;
  });
  html += '</div>';
  return html;
}

// ====================================================================
// PERBAIKAN FUNGSI INI (RATA TENGAH)
// ====================================================================
function buildVendorPerformanceCard(){
  let rows = VENDORS_DEFAULT.map(v => {
    let acc = 0, rej = 0;
    for (const oid in state.containers){
      const order = state.orders.find(o => o.order_id === oid);
      if (!order || order.vendor !== v) continue;
      (state.containers[oid] || []).forEach(r => {
        if (r.accept === true) acc++;
        else if (r.accept === false) rej++;
      });
    }
    const total = acc + rej;
    const perf = total > 0 ? Math.round((acc / total) * 100) : 0;
    
    // PERBAIKAN: Menambahkan class "center" pada sel data (td)
    return `<tr>
      <td>${v}</td>
      <td class="center">${acc}</td>
      <td class="center">${rej}</td>
      <td class="perf-small center">${perf}%</td>
    </tr>`;
  }).join("");

  // PERBAIKAN: Menambahkan class "center" pada sel header (th)
  return `
    <div class="card">
      <h3 style="margin:0 0 10px 0">📈 Performa Vendor</h3>
      <div class="table-wrap">
        <table class="table small-table">
          <thead>
            <tr><th>EMKL</th><th class="center">Accept</th><th class="center">Reject</th><th class="center">Performa</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
}
// ====================================================================
// AKHIR PERBAIKAN FUNGSI
// ====================================================================

function renderAdminHome(){
  const dt = parseISODate(state.selected_date_admin);
  const month = dt.getMonth()+1;
  const year = dt.getFullYear();

  content.innerHTML = `
    <div class="main-header"><h3 style="margin:0">🏠 Admin — Home</h3>
      <div class="small">Pilih tanggal pada kalender untuk melihat ketersediaan EMKL per jenis container.</div></div>
    <div class="card">
      <div class="row">
        <div class="col" style="grid-column: span 6;">
          <label>Pilih Bulan</label>
          <select id="home_month" class="input"></select>
        </div>
        <div class="col" style="grid-column: span 6;">
          <label>Pilih Tahun</label>
          <select id="home_year" class="input"></select>
        </div>
      </div>
      <div class="cal-wrap" style="margin-top:10px">
        <h3 style="margin:0 0 10px 0" id="monthTitle"></h3>
        <div class="cal-grid" id="calHead"></div>
        <div id="calBody"></div>
        <div class="legend small" style="margin-top:.5rem">
          <span class="dot green"></span> Tersedia Banyak (>50% container)
          <span class="dot red"></span> Tersedia Sedikit (≤50% container)
          <span class="dot blue"></span> Hari ini
        </div>
      </div>
    </div>
    <div id="vendorDetail"></div>
  `;
  
  try{
    const headerEl = document.querySelector('.main-header');
    if(headerEl && !document.querySelector('.card:has(.stat-card)')){
      const dash = `<div class=\"card\"><h3 style=\"margin:0 0 10px 0\">📊 Dashboard Status</h3>${buildStatusDashboardInner()}</div>`;
      headerEl.insertAdjacentHTML('afterend', dash);
    }
  }catch(e){ console.warn('Dashboard inject fail', e); }

  try{
    const vdet = document.getElementById('vendorDetail');
    if(vdet && !Array.from(document.querySelectorAll('.card h3')).some(h=>h.textContent.includes('Performa Vendor'))){
      vdet.insertAdjacentHTML('afterend', buildVendorPerformanceCard());
    }
  }catch(e){ console.warn('Performance inject fail', e); }

  const mSel = document.getElementById("home_month");
  for(let i=1;i<=12;i++){ const opt=document.createElement("option"); opt.value=i; opt.textContent=new Date(2000,i-1,1).toLocaleString('id-ID',{month:'long'}); if(i===month) opt.selected=true; mSel.appendChild(opt); }
  const ySel = document.getElementById("home_year");
  for(let y=year-1;y<=year+1;y++){ const opt=document.createElement("option"); opt.value=y; opt.textContent=y; if(y===year) opt.selected=true; ySel.appendChild(opt); }

  const calHead = document.getElementById("calHead");
  ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU", "MINGGU"].forEach(n=>{
    const d=document.createElement("div"); d.className="cal-head"; d.textContent=n; calHead.appendChild(d);
  });

  function drawCalendar(y,m){
    document.getElementById("monthTitle").textContent = `${new Date(y,m-1,1).toLocaleString('id-ID',{month:'long'})} ${y}`;
    const body = document.getElementById("calBody");
    body.innerHTML = "";
    const cal = monthMatrix(y,m);
    const todayISO = todayStr();
    cal.forEach(week=>{
      const row = document.createElement("div");
      row.className="cal-grid";
      week.forEach(d=>{
        const cell = document.createElement("div");
        if(d===0){ cell.innerHTML=""; row.appendChild(cell); return; }
        const s = toISODate(new Date(y,m-1,d));
        const sums = sumAvailForDate(s);
        const ok = sums.totalAll > (156*0.5);
        const isToday = (s===todayISO);
        const isSelected = (s===state.selected_date_admin);
        cell.className = "cal-cell"+(ok?" ok":"")+(isToday?" today":"")+(isSelected?" selected":"");
        // REVISION 3: Display 'Combo' availability in calendar
        cell.innerHTML = `<div class="cal-num">${d}</div><div class="labels">20ft = ${sums.total20}<br>40ft/HC = ${sums.total40}<br>Combo = ${sums.totalCombo}</div><button class="btn pick" data-pick="${s}">Pilih</button>`;
        row.appendChild(cell);
      });
      body.appendChild(row);
    });
    body.querySelectorAll("button[data-pick]").forEach(b=>{
      b.onclick = ()=>{
        state.selected_date_admin = b.dataset.pick;
        state.show_vendor_detail_admin = true;
        saveState(); renderAdminHome();
      };
    });
  }
  drawCalendar(year, month);
  
  const _pickBtns = document.querySelectorAll('#calBody button[data-pick]');
  _pickBtns.forEach(btn=>{
    btn.onclick = ()=>{
      const date = btn.dataset.pick;
      state.selected_date_admin = date;
      const avail = state.availability[date] || {};
      const list = VENDORS_DEFAULT.filter(v=>{
        const r = avail[v];
        if(!r) return false;
        // REVISION 3: Check 'Combo' for availability
        const a = Number(r["20ft"]||0), b = Number(r["40ft/HC"]||0), c = Number(r["Combo"]||0);
        return (a + b + c) > 0;
      });
      let html = "";
      // REVISION 4: Format date display
      if(list.length===0){
        html = `<div class="small">Belum ada EMKL yang mengisi ketersediaan pada tanggal <b>${formatDisplayDate(date)}</b>.</div>`;
      } else {
        const rows = list.map(v=>{
          const r = avail[v] || {"20ft":0,"40ft/HC":0,"Combo":0};
          // REVISION 3: Show 'Combo' in modal
          return `<tr><td>${v}</td><td><span class="badge">${r["20ft"]||0}</span></td><td><span class="badge">${r["40ft/HC"]||0}</span></td><td><span class="badge">${r["Combo"]||0}</span></td></tr>`;
        }).join("");
        html = `<div class="table-wrap">
          <table class="table">
            <thead><tr><th>EMKL</th><th>20ft</th><th>40ft/HC</th><th>Combo</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>`;
      }
      openModal(`Ketersediaan — ${formatDisplayDate(date)}`, html, { // REVISION 4: Format date display
        closeBtnText: 'Order',
        closeBtnClass: 'danger',
        onClose: () => {
            state.menu_admin = 'Order to EMKL';
            saveState();
            render();
            closeModal();
        }
      });
    };
  });

  mSel.onchange = ()=>{ const y=Number(ySel.value), m=Number(mSel.value); state.selected_date_admin = toISODate(new Date(y,m-1,1)); saveState(); renderAdminHome(); };
  ySel.onchange = ()=>{ const y=Number(ySel.value), m=Number(mSel.value); state.selected_date_admin = toISODate(new Date(y,m-1,1)); saveState(); renderAdminHome(); };

  if(state.show_vendor_detail_admin){
    const target = state.selected_date_admin;
    const avail = state.availability[target] || {};
    let rows = VENDORS_DEFAULT.map(v=>{
      // REVISION 3: Add 'Combo' to detail view
      const r = avail[v] || {"20ft":0,"40ft/HC":0,"Combo":0};
      return `<tr><td>${v}</td><td><span class="badge">${r["20ft"]||0}</span></td><td><span class="badge">${r["40ft/HC"]||0}</span></td><td><span class="badge">${r["Combo"]||0}</span></td></tr>`;
    }).join("");
    document.getElementById("vendorDetail").innerHTML = `
      <div class="card">
        <h3 style="margin:.2rem 0 .6rem 0">Detail Ketersediaan — ${formatDisplayDate(target)}</h3>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>EMKL</th><th>20ft</th><th>40ft/HC</th><th>Combo</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>`;
  }
}

/* ===================== ADMIN: ORDER TO VENDOR ===================== */
function renderAdminOrder(){
  const showDate = state.selected_date_admin;

  content.innerHTML = `
    <div class="main-header"><h3 style="margin:0">📦 Admin — Order to EMKL</h3>
      <div class="small">Pilih EMKL dari tabel ketersediaan, tanggalnya sinkron dengan Home.</div></div>
    <div id="emkl-availability-card" class="card">
      <div class="small">Menampilkan ketersediaan untuk tanggal: <b>${formatDisplayDate(showDate)}</b></div>
      <div id="availTableContainer" class="table-wrap" style="margin-top: 8px;"></div>
    </div>
    <div class="card">
      <h3 style="margin:0 0 12px 0">Buat Order Baru</h3>
      <div class="form-section">
        <div class="section-title">1. Informasi Utama</div>
        <div class="form-grid">
          <div class="span-4">
            <label>EMKL</label>
            <select id="order_vendor" class="input"></select>
          </div>
          <div class="span-4">
            <div style="display:flex; justify-content:space-between; align-items:flex-end;">
                <label>DN</label>
                <div style="display:flex; align-items:center; gap:5px; margin-bottom: .25rem;">
                    <input type="checkbox" id="order_is_combo">
                    <label for="order_is_combo" style="margin:0; font-size:.8rem; font-weight:normal;">Combo</label>
                </div>
            </div>
            <input id="order_dn1" class="input" placeholder="Contoh: DN0001">
            <div id="dn_combo_extra" style="display:none; margin-top:8px;">
                <input id="order_dn2" class="input" placeholder="DN ke-2">
            </div>
          </div>
          <div class="span-4">
            <label>Tanggal Stuffing</label>
            <input id="order_tglstuff" type="date" class="input" value="${showDate}">
          </div>
        </div>
      </div>
      <div class="form-section">
        <div class="section-title">2. Lokasi & Tujuan</div>
        <div class="form-grid">
          <div class="span-6">
            <label>Shipping Point</label>
            <input id="order_shippoint" class="input" placeholder="Auto warehouse...">
          </div>
          <div class="span-6">
            <label>Destination Port</label>
            <input id="order_pod" class="input" placeholder="Liverpool,UK">
          </div>
          <div class="span-6">
            <label>Terminal</label>
            <select id="order_terminal" class="input">
                <option>JICT</option>
                <option>NPCT</option>
                <option>KOJA</option>
                <option>TMAL</option>
                <option>IPC</option>
            </select>
          </div>
          <div class="span-6">
            <label>Depo</label>
            <input id="order_depo" class="input" placeholder="Puninar, BRJ...">
          </div>
        </div>
      </div>
      <div class="form-section">
        <div class="section-title">3. Jadwal & Waktu</div>
        <div class="form-grid">
          <div class="span-4">
            <label>Open CY</label>
            <input id="order_open_cy" type="date" class="input" value="${showDate}">
          </div>
          <div class="span-4">
            <label>Tanggal Closing</label>
            <input id="order_closing_date" type="date" class="input" placeholder="dd/mm/yyyy">
          </div>
          <div class="span-4">
            <label>Jam Closing</label>
            <input id="order_closing_time" type="time" class="input" placeholder="--:--">
          </div>
        </div>
      </div>
      <div class="form-section">
        <div class="section-title">4. Detail Kontainer & Catatan</div>
        <div class="form-grid">
            <div class="span-4">
                <label>Jumlah Container 20ft</label>
                <input id="order_j20" type="number" class="input" value="0" min="0">
            </div>
            <div class="span-4">
                <label>Jumlah Container 40ft/HC</label>
                <input id="order_j40" type="number" class="input" value="0" min="0">
            </div>
            <div class="span-4">
                <label>Jumlah Container Combo</label>
                <input id="order_jCombo" type="number" class="input" value="0" min="0">
            </div>
            <div class="span-12">
                <label>Remarks</label>
                <textarea id="order_remarks" class="input" placeholder="Catatan tambahan..."></textarea>
            </div>
        </div>
      </div>
      <div style="margin-top:16px">
        <button id="btnCreateOrder" class="btn cta">✓ Buat Order</button>
      </div>
    </div>
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <h3 style="margin:0;">Rekap List Orderan</h3>
        <button id="btnDownloadRekap" class="btn success">⬇️ Download Excel</button>
      </div>
      <div class="row">
        <div class="col" style="grid-column: span 4;">
          <label>Filter EMKL</label>
          <select id="rekap_vendor" class="input">
            <option>-- Semua --</option>
          </select>
        </div>
        <div class="col" style="grid-column: span 4;">
          <label>Tgl Stuffing (start)</label>
          <input id="rekap_start" type="date" class="input">
        </div>
        <div class="col" style="grid-column: span 4;">
          <label>Tgl Stuffing (end)</label>
          <input id="rekap_end" type="date" class="input">
        </div>
      </div>
      <div class="rekap-wrap">
        <table class="table rekap" id="rekapTable">
          <thead>
            <tr class="top">
              <th rowspan="2">No</th>
              <th rowspan="2">DN</th>
              <th rowspan="2">EMKL</th>
              <th rowspan="2">Tanggal Stuffing</th>
              <th rowspan="2">Shipping Point</th>
              <th rowspan="2">Destination Port</th>
              <th rowspan="2">Terminal</th>
              <th rowspan="2">Depo</th>
              <th colspan="2">CY</th>
              <th rowspan="2">Container</th>
              <th rowspan="2">Jumlah</th>
              <th rowspan="2">Remarks</th>
              <th colspan="2">Status</th>
              <th colspan="2">Attach File</th>
              <th rowspan="2">Email</th>
              <th rowspan="2">Aksi</th>
            </tr>
            <tr class="top">
              <th>Open</th>
              <th>Closing (Date Time)</th>
              <th class="acc">Accept</th>
              <th class="rej">Reject</th>
              <th>BC</th>
              <th>SI</th>
            </tr>
          </thead>
          <tbody id="rekapBody"></tbody>
        </table>
      </div>
    </div>
  `;

  const avail = state.availability[showDate] || {};
  const availContainer = document.getElementById("availTableContainer");
  
  // REVISION 3: Include 'Combo' in filter
  const availableVendors = VENDORS_DEFAULT.filter(v => {
    const vendorData = avail[v];
    if (!vendorData) return false;
    return (Number(vendorData["20ft"] || 0) + Number(vendorData["40ft/HC"] || 0) + Number(vendorData["Combo"] || 0)) > 0;
  });

  if (availableVendors.length === 0) {
    availContainer.innerHTML = `<div style="padding:1rem; text-align:center; color: var(--muted);">Tidak ada EMKL yang tersedia pada tanggal ini.</div>`;
  } else {
    const tableRows = availableVendors.map(v => {
      const rowData = avail[v];
      // REVISION 3: Display 'Combo' availability
      return `<tr>
        <td>${v}</td>
        <td>${rowData["20ft"] || 0}</td>
        <td>${rowData["40ft/HC"] || 0}</td>
        <td>${rowData["Combo"] || 0}</td>
        <td><button class="btn secondary" data-prefill="${v}">Order</button></td>
      </tr>`;
    }).join("");

    availContainer.innerHTML = `
      <table class="table">
        <thead>
          <tr><th>EMKL</th><th>20ft</th><th>40ft/HC</th><th>Combo</th><th>Aksi</th></tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
    `;
  }
  
  availContainer.querySelectorAll("button[data-prefill]").forEach(b=>{
    b.onclick = ()=>{ state.order_vendor_prefill = b.dataset.prefill; saveState(); renderAdminOrder(); toast(`Prefill EMKL: ${b.dataset.prefill}`); };
  });

  document.getElementById('order_is_combo').addEventListener('change', e => {
    document.getElementById('dn_combo_extra').style.display = e.target.checked ? 'block' : 'none';
  });

  const vSel = document.getElementById("order_vendor");
  VENDORS_DEFAULT.forEach(v=>{
    const opt = document.createElement("option"); opt.textContent=v; vSel.appendChild(opt);
  });
  if(state.order_vendor_prefill){
    vSel.value = state.order_vendor_prefill;
  }
  
  const rVend = document.getElementById("rekap_vendor");
  VENDORS_DEFAULT.forEach(v=>{ const o=document.createElement("option"); o.textContent=v; rVend.appendChild(o); });
  const rStart = document.getElementById("rekap_start");
  const rEnd   = document.getElementById("rekap_end");
  const now = new Date();
  rStart.value = toISODate(new Date(now.getFullYear(), now.getMonth(), now.getDate()-30));
  rEnd.value   = toISODate(new Date(now.getFullYear(), now.getMonth(), now.getDate()+7));

  document.getElementById("btnCreateOrder").onclick = ()=>{
    const vendor = vSel.value;
    const isCombo = document.getElementById('order_is_combo').checked;
    const dn1 = document.getElementById('order_dn1').value.trim();
    let no_dn;

    if (isCombo) {
      const dn2 = document.getElementById('order_dn2').value.trim();
      if (!dn1 || !dn2) {
        toast("Untuk order Combo, kedua DN wajib diisi.");
        return;
      }
      no_dn = [dn1, dn2];
    } else {
      if (!dn1) {
        toast("DN wajib diisi.");
        return;
      }
      no_dn = [dn1];
    }

    const tgl_stuff = document.getElementById("order_tglstuff").value || showDate;
    const shipping_point = document.getElementById("order_shippoint").value.trim();
    const pod = document.getElementById("order_pod").value.trim();
    const terminal = document.getElementById("order_terminal").value.trim();
    const depo = document.getElementById("order_depo").value.trim();
    const open_cy = document.getElementById("order_open_cy").value || showDate;
    const closing_date = document.getElementById("order_closing_date").value;
    const closing_time = document.getElementById("order_closing_time").value;
    const j20 = Number(document.getElementById("order_j20").value||0);
    const j40 = Number(document.getElementById("order_j40").value||0);
    const jCombo = Number(document.getElementById("order_jCombo").value||0);
    const remarks = document.getElementById("order_remarks").value.trim();

    if(j20+j40+jCombo===0){ toast("Minimal pesan 1 container."); return; }

    const avForDate = state.availability[tgl_stuff] || {};
    const vendorAv = avForDate[vendor] || {"20ft":0,"40ft/HC":0, "Combo":0};
    const hasAny = Number(vendorAv["20ft"]||0) + Number(vendorAv["40ft/HC"]||0) + Number(vendorAv["Combo"]||0) > 0;
    if(!hasAny){ toast(`EMKL ${vendor} belum mengisi ketersediaan untuk ${tgl_stuff}.`); return; }
    const avail20 = Number(vendorAv["20ft"]||0), avail40 = Number(vendorAv["40ft/HC"]||0), availCombo = Number(vendorAv["Combo"]||0);
    if(j20 > avail20){ toast(`Jumlah 20ft dipesan (${j20}) > ketersediaan (${avail20}).`); return; }
    if(j40 > avail40){ toast(`Jumlah 40ft/HC dipesan (${j40}) > ketersediaan (${avail40}).`); return; }
    if(jCombo > availCombo){ toast(`Jumlah Combo dipesan (${jCombo}) > ketersediaan (${availCombo}).`); return; }

    const oid = genId("ORD");
    const order = {
      order_id: oid, vendor, tgl_stuffing: tgl_stuff, closing_date, closing_time,
      open_cy, no_dn, shipping_point, pod, terminal, depo, remarks,
      jml_20ft: j20, jml_40ft: j40, jml_combo: jCombo,
      created_at: new Date().toISOString(), summary_status:"Pending"
    };
    state.orders.push(order);
    state.containers[oid] = [];
    for(let i=0;i<j20;i++){
      state.containers[oid].push({no: state.containers[oid].length+1, size:"20ft", accept:null,
        no_container:"", no_seal:"", no_mobil:"", nama_supir:"", contact:"", depo:"", status:STATUS_TRUCKING[0]});
    }
    for(let i=0;i<j40;i++){
      state.containers[oid].push({no: state.containers[oid].length+1, size:"40ft/HC", accept:null,
        no_container:"", no_seal:"", no_mobil:"", nama_supir:"", contact:"", depo:"", status:STATUS_TRUCKING[0]});
    }
    for(let i=0;i<jCombo;i++){
      state.containers[oid].push({no: state.containers[oid].length+1, size:"Combo", accept:null,
        no_container:"", no_seal:"", no_mobil:"", nama_supir:"", contact:"", depo:"", status:STATUS_TRUCKING[0]});
    }
    state.order_vendor_prefill = null;
    saveState(); renderAdminOrder();
    toast(`Order berhasil dibuat: ${oid}`);
  };

  function buildRekap(){
    const vend = rVend.value;
    const start = parseISODate(rStart.value);
    const end   = parseISODate(rEnd.value);
    const orders = [...state.orders].reverse().filter(o=>{
      const d = parseISODate(o.tgl_stuffing);
      return d>=start && d<=end && (vend==="-- Semua --" || o.vendor===vend);
    });
    const tbody = document.getElementById("rekapBody");
    if(orders.length===0){
      tbody.innerHTML = `<tr><td colspan="18">Tidak ada data</td></tr>`;
      return;
    }

    let html = "";
    orders.forEach((o, idx)=>{
        const isEditing = state.editing_order_id === o.order_id;
        const containerTypes = [];
        if(o.jml_20ft > 0) containerTypes.push("20ft");
        if(o.jml_40ft > 0) containerTypes.push("40ft/HC");
        if(o.jml_combo > 0) containerTypes.push("Combo");
        
        const rowSpan = containerTypes.length || 1;
        
        // PERBAIKAN FINAL: Menambahkan class 'row-pending' jika statusnya 'Pending'
        const isPending = o.summary_status === "Pending";
        const rowClass = isPending ? 'class="row-pending"' : '';

        const items = state.containers[o.order_id] || [];
        function agg(sz){
            const acc = items.filter(r=>r.size===sz && r.accept===true).length;
            const rej = items.filter(r=>r.size===sz && r.accept===false).length;
            let total = 0;
            if(sz === "20ft") total = o.jml_20ft || 0;
            if(sz === "40ft/HC") total = o.jml_40ft || 0;
            if(sz === "Combo") total = o.jml_combo || 0;
            return {total, acc, rej};
        }
        
        const dnHtml = isEditing 
            ? `<textarea id="edit_dn_${o.order_id}" style="width: 100%;">${(o.no_dn || []).join('\n')}</textarea>` 
            : (o.no_dn || []).join('<br>');

        if (containerTypes.length > 0) {
            containerTypes.forEach((sz, i) => {
                const {total, acc, rej} = agg(sz); // Panggil agg di sini
                html += `<tr ${rowClass}>`;
                if (i === 0) { // Kolom yang di-span
                    html += `
                        <td rowspan="${rowSpan}">${idx + 1}</td>
                        <td rowspan="${rowSpan}">${dnHtml}</td>
                        <td rowspan="${rowSpan}">${o.vendor}</td>
                        <td rowspan="${rowSpan}">${isEditing ? `<input type="date" id="edit_tglstuff_${o.order_id}" value="${o.tgl_stuffing}">` : formatDisplayDate(o.tgl_stuffing)}</td>
                        <td rowspan="${rowSpan}">${isEditing ? `<input id="edit_shippoint_${o.order_id}" value="${o.shipping_point}">` : o.shipping_point}</td>
                        <td rowspan="${rowSpan}">${isEditing ? `<input id="edit_pod_${o.order_id}" value="${o.pod || ''}">` : o.pod || '-'}</td>
                        <td rowspan="${rowSpan}">${isEditing ? `<input id="edit_terminal_${o.order_id}" value="${o.terminal || ''}">` : o.terminal || '-'}</td>
                        <td rowspan="${rowSpan}">${isEditing ? `<input id="edit_depo_${o.order_id}" value="${o.depo || ''}">` : o.depo || '-'}</td>
                        <td rowspan="${rowSpan}">${isEditing ? `<input type="date" id="edit_opency_${o.order_id}" value="${o.open_cy || ''}">` : (o.open_cy ? formatDisplayDate(o.open_cy) : '-')}</td>
                        <td rowspan="${rowSpan}">${isEditing ? `<div><input type="date" id="edit_closingdate_${o.order_id}" value="${o.closing_date || ''}"><input type="time" id="edit_closingtime_${o.order_id}" value="${o.closing_time || ''}"></div>` : fmtDT(o.closing_date, o.closing_time)}</td>`;
                }
                html += `
                    <td>${sz}</td>
                    <td>${total}</td>`;
                if (i === 0) {
                    html += `<td rowspan="${rowSpan}">${isEditing ? `<textarea id="edit_remarks_${o.order_id}">${o.remarks || ''}</textarea>` : o.remarks || "-"}</td>`;
                }
                html += `
                    <td class="acc">${acc||0}</td>
                    <td class="rej">${rej||0}</td>`;
                if (i === 0) {
                    html += `
                        <td rowspan="${rowSpan}" id="bc_${o.order_id}"></td>
                        <td rowspan="${rowSpan}" id="si_${o.order_id}"></td>
                        <td rowspan="${rowSpan}"><button class="btn warn" data-email="${o.order_id}">Send</button></td>
                        <td rowspan="${rowSpan}">
                            ${isEditing ? `
                                <div>
                                    <button class="btn success" data-save-id="${o.order_id}">Save</button>
                                    <button class="btn secondary" data-cancel-id="${o.order_id}">Cancel</button>
                                </div>
                            ` : `
                                <button class="btn warn" data-edit-id="${o.order_id}">Edit</button>
                            `}
                        </td>`;
                }
                html += `</tr>`;
            });
        } else {
             html += `<tr ${rowClass}><td colspan="18">Order ini tidak memiliki detail container.</td></tr>`;
        }
    });
    tbody.innerHTML = html;


    // Attach file inputs and listeners AFTER rendering main table
    state.orders.forEach(o=>{
      const att = state.attachments[o.order_id]||{};
      const bcCell = document.getElementById(`bc_${o.order_id}`);
      if(!bcCell) return;
      bcCell.innerHTML = "";
      if(att.booking_confirmation){
        const a = document.createElement("button"); a.className="btn success"; a.textContent="✔ BC";
        a.onclick = ()=> downloadDataUrl(att.booking_confirmation.name, att.booking_confirmation.dataUrl);
        bcCell.appendChild(a);
      } else {
        const input = document.createElement("input"); input.type="file"; input.accept=".pdf,.png,.jpg,.jpeg";
        input.onchange = (e)=> attachFile(o.order_id, "booking_confirmation", e.target.files[0]);
        bcCell.appendChild(input);
      }
      const siCell = document.getElementById(`si_${o.order_id}`);
      siCell.innerHTML = "";
      if(att.si){
        const a = document.createElement("button"); a.className="btn success"; a.textContent="✔ SI";
        a.onclick = ()=> downloadDataUrl(att.si.name, att.si.dataUrl);
        siCell.appendChild(a);
      } else {
        const input = document.createElement("input"); input.type="file"; input.accept=".pdf,.png,.jpg,.jpeg";
        input.onchange = (e)=> attachFile(o.order_id, "si", e.target.files[0]);
        siCell.appendChild(input);
      }
    });

    tbody.querySelectorAll("button[data-email]").forEach(btn=>{
      btn.onclick = ()=>{
        const oid = btn.dataset.email;
        const o = state.orders.find(x=>x.order_id===oid);
        toast(`Email untuk DN ${o.no_dn.join(' & ')} disimulasikan.`);
      };
    });

    tbody.querySelectorAll('button[data-edit-id]').forEach(btn => {
        btn.onclick = () => {
            state.editing_order_id = btn.dataset.editId;
            buildRekap();
        };
    });
    tbody.querySelectorAll('button[data-cancel-id]').forEach(btn => {
        btn.onclick = () => {
            state.editing_order_id = null;
            buildRekap();
        };
    });
    tbody.querySelectorAll('button[data-save-id]').forEach(btn => {
        btn.onclick = () => {
            const orderId = btn.dataset.saveId;
            const orderToUpdate = state.orders.find(o => o.order_id === orderId);
            if (orderToUpdate) {
                // Read values and update
                const dnValue = document.getElementById(`edit_dn_${orderId}`).value.trim();
                orderToUpdate.no_dn = dnValue.split('\n').filter(dn => dn.trim() !== '');
                orderToUpdate.tgl_stuffing = document.getElementById(`edit_tglstuff_${orderId}`).value;
                orderToUpdate.shipping_point = document.getElementById(`edit_shippoint_${orderId}`).value;
                orderToUpdate.pod = document.getElementById(`edit_pod_${orderId}`).value;
                orderToUpdate.terminal = document.getElementById(`edit_terminal_${orderId}`).value;
                orderToUpdate.depo = document.getElementById(`edit_depo_${orderId}`).value;
                orderToUpdate.open_cy = document.getElementById(`edit_opency_${orderId}`).value;
                orderToUpdate.closing_date = document.getElementById(`edit_closingdate_${orderId}`).value;
                orderToUpdate.closing_time = document.getElementById(`edit_closingtime_${orderId}`).value;
                orderToUpdate.remarks = document.getElementById(`edit_remarks_${orderId}`).value;
                
                toast(`Order ${orderId.split('-')[1]} berhasil diupdate.`);
            }
            state.editing_order_id = null;
            saveState();
            buildRekap();
        };
    });
  }

  buildRekap();
  document.getElementById("rekap_vendor").onchange = buildRekap;
  document.getElementById("rekap_start").onchange = buildRekap;
  document.getElementById("rekap_end").onchange = buildRekap;

  // REVISION 1: Excel Download Logic for Rekap
  document.getElementById("btnDownloadRekap").onclick = () => {
    const vend = document.getElementById("rekap_vendor").value;
    const startInput = document.getElementById("rekap_start").value;
    const endInput = document.getElementById("rekap_end").value;
    
    if (!startInput || !endInput) {
        toast("Harap tentukan rentang tanggal.");
        return;
    }

    const start = parseISODate(startInput);
    const end   = parseISODate(endInput);
    const orders = state.orders.filter(o=>{
      const d = parseISODate(o.tgl_stuffing);
      return d>=start && d<=end && (vend==="-- Semua --" || o.vendor===vend);
    });

    if (orders.length === 0) {
        toast("Tidak ada data untuk diunduh pada filter ini.");
        return;
    }

    const dataToExport = [];
    orders.forEach(o => {
        const items = state.containers[o.order_id] || [];
        const accepted20 = items.filter(r => r.size === '20ft' && r.accept === true).length;
        const rejected20 = items.filter(r => r.size === '20ft' && r.accept === false).length;
        const accepted40 = items.filter(r => r.size === '40ft/HC' && r.accept === true).length;
        const rejected40 = items.filter(r => r.size === '40ft/HC' && r.accept === false).length;
        const acceptedCombo = items.filter(r => r.size === 'Combo' && r.accept === true).length;
        const rejectedCombo = items.filter(r => r.size === 'Combo' && r.accept === false).length;
        
        const row = {
            "DN": (o.no_dn || []).join(', '),
            "EMKL": o.vendor,
            "Tgl Stuffing": formatDisplayDate(o.tgl_stuffing),
            "Shipping Point": o.shipping_point,
            "Destination Port": o.pod || '',
            "Terminal": o.terminal || '',
            "Depo": o.depo || '',
            "Open CY": o.open_cy ? formatDisplayDate(o.open_cy) : '',
            "Closing": fmtDT(o.closing_date, o.closing_time),
            "Remarks": o.remarks || '',
            "Total 20ft": o.jml_20ft || 0,
            "Accept 20ft": accepted20,
            "Reject 20ft": rejected20,
            "Total 40ft/HC": o.jml_40ft || 0,
            "Accept 40ft/HC": accepted40,
            "Reject 40ft/HC": rejected40,
            "Total Combo": o.jml_combo || 0,
            "Accept Combo": acceptedCombo,
            "Reject Combo": rejectedCombo,
            "Status": o.summary_status
        };
        dataToExport.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Orderan");
    XLSX.writeFile(workbook, "Rekap_List_Orderan.xlsx");
  };
}


/* ===================== ADMIN: STATUS TRUCK ===================== */
// *** PERUBAHAN DIMULAI DI SINI ***

// PERUBAHAN: Popup sekarang dikembalikan untuk menampilkan DETAIL PER CONTAINER
function showCompactContainerDetailsModal(orderId) {
    const order = state.orders.find(o => o.order_id === orderId);
    if (!order) return;

    const acceptedContainers = (state.containers[orderId] || []).filter(c => c.accept === true);
    if (acceptedContainers.length === 0) {
        toast("Tidak ada kontainer yang di-accept untuk order ini.");
        return;
    }

    let tableRows = acceptedContainers.map((r, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${r.size || '-'}</td>
            <td>${r.no_container || '-'}</td>
            <td>${r.no_seal || '-'}</td>
            <td>${r.no_mobil || '-'}</td>
            <td>${r.nama_supir || '-'}</td>
            <td>${r.contact || '-'}</td>
            <td>${r.depo || '-'}</td>
            <td>${r.status || 'Confirm Order'}</td>
        </tr>
    `).join('');

    // Ini adalah layout popup dari 'Screenshot 2025-10-31 082452.png'
    const modalHtml = `
        <div class="table-wrap" style="max-height: 60vh; overflow-y: auto;">
            <table class="table compact" style="width: 100%;">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Jenis</th>
                        <th>No. Container</th>
                        <th>No. Seal</th>
                        <th>No. Mobil</th>
                        <th>Supir</th>
                        <th>Contact</th>
                        <th>Depo</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </div>
    `;
    openModal(`Detail untuk DN: ${(order.no_dn || []).join(' / ')}`, modalHtml);
}

// PERUBAHAN: Halaman "Status Truck" diubah menjadi Laporan Besar
function renderAdminStatus(){
  content.innerHTML = `
    <div class="main-header"><h3 style="margin:0">🚛 Admin — Status Truck</h3>
      <div class="small">Tampilan status berdasarkan order yang sudah di-accept oleh EMKL. Klik angka pada kolom jumlah untuk melihat detail.</div></div>
    <div class="card">
       <div class="row">
        <div class="col" style="grid-column: span 4;">
          <label>Filter EMKL</label>
          <select id="status_vendor" class="input">
            <option>-- Semua --</option>
          </select>
        </div>
        <div class="col" style="grid-column: span 4;">
          <label>Tgl Stuffing (start)</label>
          <input id="status_start" type="date" class="input">
        </div>
        <div class="col" style="grid-column: span 4;">
          <label>Tgl Stuffing (end)</label>
          <input id="status_end" type="date" class="input">
        </div>
      </div>
      <div class="rekap-wrap" style="margin-top: 12px;">
        <table class="table rekap" id="statusTable" style="font-size: 11px;">
          <thead>
            <tr class="top">
                <th>No</th>
                <th>SO</th>
                <th>Ocean BL</th>
                <th>DN</th>
                <th>Final Destination</th>
                <th>ETD</th>
                <th>Shipping Line</th>
                <th>Vessel Name</th>
                <th>Open CT</th>
                <th>Closing DC</th>
                <th>CI</th>
                <th>EMKL</th>
                <th>WWF - Trans</th>
                <th>20ft</th>
                <th>40ftHC</th>
                <th>Combo</th>
                <th>Surat Cont</th>
                <th>Belum Picking</th>
                <th>Muat Depo</th>
                <th>OTW Pabrik</th>
                <th>Muat Gudang</th>
                <th>Gate In (Terminal)</th>
                <th>Tonase Order</th>
                <th>Remarks</th>
            </tr>
          </thead>
          <tbody id="statusBody"></tbody>
        </table>
      </div>
    </div>
  `;

  const rVend = document.getElementById("status_vendor");
  VENDORS_DEFAULT.forEach(v=>{ const o=document.createElement("option"); o.textContent=v; rVend.appendChild(o); });
  const rStart = document.getElementById("status_start");
  const rEnd   = document.getElementById("status_end");
  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);
  rStart.value = toISODate(thirtyDaysAgo);
  rEnd.value = toISODate(now);

  function buildStatusTable() {
    const vend = rVend.value;
    const start = parseISODate(rStart.value);
    const end = parseISODate(rEnd.value);
    const orders = state.orders.filter(o => {
        if (o.summary_status === "Pending") return false; // Filter out pending
        const d = parseISODate(o.tgl_stuffing);
        return d >= start && d <= end && (vend === "-- Semua --" || o.vendor === vend);
    }).reverse();

    const tbody = document.getElementById("statusBody");
    if (orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="24" class="center">Tidak ada data order yang sudah di-accept pada periode ini.</td></tr>`;
        return;
    }

    let displayedIdx = 0;
    tbody.innerHTML = orders.map((o) => {
        const items = (state.containers[o.order_id] || []).filter(c => c.accept === true);
        
        const accepted20 = items.filter(r => r.size === '20ft').length;
        const accepted40 = items.filter(r => r.size === '40ft/HC').length;
        const acceptedCombo = items.filter(r => r.size === 'Combo').length;
        const totalAccepted = accepted20 + accepted40 + acceptedCombo;

        if (totalAccepted === 0) return ''; // Don't show if nothing was accepted
        
        // Hitung status
        const muatDepo = items.filter(r => (r.status || '').toLowerCase() === 'muat depo').length;
        const otwPabrik = items.filter(r => (r.status || '').toLowerCase() === 'otw pabrik').length;
        const muatGudang = items.filter(r => (r.status || '').toLowerCase() === 'muat gudang').length;
        const gateIn = items.filter(r => (r.status || '').toLowerCase() === 'gate in port').length;
        const belumPicking = items.filter(r => 
            (r.status || '').toLowerCase() === 'confirm order' || 
            (r.status || '').toLowerCase() === 'otw depo'
        ).length;
        
        // Fungsi untuk membuat tombol klik
        const createClickableCell = (count, orderId) => {
             return `<button style="background:none; border:none; color:var(--blue); text-decoration:underline; cursor:pointer; padding:0; font-size:inherit;" data-modal-id="${orderId}">${count}</button>`;
        };
        
        displayedIdx++;
        return `
            <tr>
                <td>${displayedIdx}</td>
                <td>-</td>
                <td>-</td>
                <td>${(o.no_dn || []).join('<br>')}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>${o.open_cy ? formatDisplayDate(o.open_cy) : '-'}</td>
                <td>${fmtDT(o.closing_date, o.closing_time)}</td>
                <td>-</td>
                <td>${o.vendor || '-'}</td>
                <td>-</td>
                <td class="center">${accepted20 > 0 ? createClickableCell(accepted20, o.order_id) : 0}</td>
                <td class="center">${accepted40 > 0 ? createClickableCell(accepted40, o.order_id) : 0}</td>
                <td class="center">${acceptedCombo > 0 ? createClickableCell(acceptedCombo, o.order_id) : 0}</td>
                <td>-</td>
                <td class="center">${belumPicking || 0}</td>
                <td class="center">${muatDepo || 0}</td>
                <td class="center">${otwPabrik || 0}</td>
                <td class="center">${muatGudang || 0}</td>
                <td class="center">${gateIn || 0}</td>
                <td>-</td>
                <td>${o.remarks || '-'}</td>
            </tr>
        `;
    }).join("");

    // Pasang event listener ke tombol-tombol baru
    tbody.querySelectorAll('button[data-modal-id]').forEach(btn => {
        btn.onclick = () => {
            showCompactContainerDetailsModal(btn.dataset.modalId);
        };
    });
  }

  buildStatusTable();
  rVend.onchange = buildStatusTable;
  rStart.onchange = buildStatusTable;
  rEnd.onchange = buildStatusTable;
}

// *** PERUBAHAN SELESAI DI SINI ***


/* ===================== VENDOR: HOME (Calendar + availability) ===================== */
function renderVendorHome(){
  const vendor = state.vendor_name || "UNKNOWN";
  const base = parseISODate(state.selected_date_vendor);
  const month = base.getMonth()+1;
  const year = base.getFullYear();

  content.innerHTML = `
    <div class="main-header"><h3 style="margin:0">🏠 EMKL — Home</h3>
      <div class="small">Kalender & update ketersediaan container</div></div>
    <div class="card">
      <div class="row">
        <div class="col" style="grid-column: span 6;">
          <label>Pilih Bulan</label>
          <select id="v_home_month" class="input"></select>
        </div>
        <div class="col" style="grid-column: span 6;">
          <label>Pilih Tahun</label>
          <select id="v_home_year" class="input"></select>
        </div>
      </div>
      <div class="cal-wrap" style="margin-top:10px">
        <div class="cal-grid" id="vCalHead"></div>
        <div id="vCalBody"></div>
      </div>
    </div>

    <div class="card">
      <h3 style="margin-top:0">Ketersediaan Container Anda — <span id="selDate">${formatDisplayDate(state.selected_date_vendor)}</span></h3>
      <div class="row">
        <div class="col" style="grid-column: span 4;">
            <label>Jumlah container 20ft</label>
            <input id="av20" type="number" class="input" min="0">
        </div>
        <div class="col" style="grid-column: span 4;">
            <label>Jumlah container 40ft/HC</label>
            <input id="av40" type="number" class="input" min="0">
        </div>
        <div class="col" style="grid-column: span 4;">
            <label>Jumlah container Combo</label>
            <input id="avCombo" type="number" class="input" min="0">
        </div>
      </div>
      <div style="margin-top:10px">
        <button id="btnSaveAvail" class="btn primary">Simpan Ketersediaan</button>
      </div>
    </div>
  `;
  const mSel = document.getElementById("v_home_month");
  for(let i=1;i<=12;i++){ const opt=document.createElement("option"); opt.value=i; opt.textContent=new Date(2000,i-1,1).toLocaleString('id-ID',{month:'long'}); if(i===month) opt.selected=true; mSel.appendChild(opt); }
  const ySel = document.getElementById("v_home_year");
  for(let y=year-1;y<=year+1;y++){ const opt=document.createElement("option"); opt.value=y; opt.textContent=y; if(y===year) opt.selected=true; ySel.appendChild(opt); }
  const head = document.getElementById("vCalHead");
  ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU", "MINGGU"].forEach(n=>{
    const d=document.createElement("div"); d.className="cal-head"; d.textContent=n; head.appendChild(d);
  });
  function draw(y,m){
    const body = document.getElementById("vCalBody");
    body.innerHTML="";
    const cal = monthMatrix(y,m);
    const todayISO = todayStr();
    cal.forEach(week=>{
      const row = document.createElement("div"); row.className="cal-grid";
      week.forEach(d=>{
        const cell = document.createElement("div");
        if(d===0){ row.appendChild(cell); return; }
        const s = toISODate(new Date(y,m-1,d));
        const data = state.availability[s]||{};
        const rowv = data[vendor] || {"20ft":0,"40ft/HC":0,"Combo":0};
        const t20 = Number(rowv["20ft"]||0), t40 = Number(rowv["40ft/HC"]||0), tCombo = Number(rowv["Combo"]||0);
        const ok = (t20+t40+tCombo)>0, isToday=(s===todayISO), isSelected=(s===state.selected_date_vendor);
        cell.className = "cal-cell"+(ok?" ok":"")+(isToday?" today":"")+(isSelected?" selected":"");
        cell.innerHTML = `<div class="cal-num">${d}</div><div class="labels">20ft = ${t20}<br>40ft/HC = ${t40}<br>Combo = ${tCombo}</div><button class="btn pick" data-pick="${s}">Pilih</button>`;
        row.appendChild(cell);
      });
      body.appendChild(row);
    });
    body.querySelectorAll("button[data-pick]").forEach(b=>{
      b.onclick = ()=>{ state.selected_date_vendor = b.dataset.pick; saveState(); renderVendorHome(); };
    });
  }
  draw(year, month);
  mSel.onchange = ()=>{ state.selected_date_vendor = toISODate(new Date(Number(ySel.value), Number(mSel.value)-1, 1)); saveState(); renderVendorHome(); };
  ySel.onchange = ()=>{ state.selected_date_vendor = toISODate(new Date(Number(ySel.value), Number(mSel.value)-1, 1)); saveState(); renderVendorHome(); };

  const sel = state.selected_date_vendor;
  const current = (state.availability[sel]||{})[vendor] || {"20ft":0,"40ft/HC":0,"Combo":0};
  document.getElementById("av20").value = Number(current["20ft"]||0);
  document.getElementById("av40").value = Number(current["40ft/HC"]||0);
  document.getElementById("avCombo").value = Number(current["Combo"]||0);
  document.getElementById("btnSaveAvail").onclick = ()=>{
    const a20 = Number(document.getElementById("av20").value||0);
    const a40 = Number(document.getElementById("av40").value||0);
    const aCombo = Number(document.getElementById("avCombo").value||0);
    state.availability[sel] = state.availability[sel] || {};
    state.availability[sel][vendor] = {"20ft":a20, "40ft/HC":a40, "Combo":aCombo};
    saveState(); toast(`Ketersediaan ${vendor} diperbarui.`); renderVendorHome();
  };
}

/* ===================== VENDOR: ORDERAN (accept/reject/partial) ===================== */
function renderVendorOrderan(){
  const vendor = state.vendor_name;
  content.innerHTML = `
    <div class="main-header"><h3 style="margin:0">📑 EMKL — Orderan</h3>
      <div class="small">Isikan jumlah kontainer yang akan Anda <b>Accept</b>. Jumlah Reject akan dihitung otomatis.</div></div>
    <div id="vendor-orderan-card" class="card">
      <div class="rekap-wrap">
        <table class="table rekap">
          <thead>
            <tr class="top">
              <th rowspan="2">No</th><th rowspan="2">DN</th><th rowspan="2">EMKL</th><th rowspan="2">Tanggal Stuffing</th>
              <th rowspan="2">Closing (Date Time)</th><th rowspan="2">Shipping Point</th><th rowspan="2">Open CY / Destination Port</th>
              <th rowspan="2">Terminal</th><th rowspan="2">Container</th><th rowspan="2">Jumlah</th><th rowspan="2">Remarks</th>
              <th colspan="2">Status</th><th rowspan="2">Submit</th>
            </tr>
            <tr class="top">
              <th class="acc">Accept</th><th class="rej">Reject</th>
            </tr>
          </thead>
          <tbody id="vendBody"></tbody>
        </table>
      </div>
    </div>
  `;

  const orders = state.orders
    .filter(o => o.vendor === vendor)
    .filter(o => !o.submitted_vendor);

  const tbody = document.getElementById("vendBody");
  if (orders.length === 0){
    tbody.innerHTML = `<tr><td colspan="14" style="text-align:center">Belum ada order menunggu konfirmasi.</td></tr>`;
    return;
  }

  function cellInput(id, val, max, readonly = false){
    const readOnlyAttr = readonly ? 'readonly style="background:#e9ecef; cursor:not-allowed;"' : '';
    return `<input id="${id}" class="input tiny center" type="number" min="0" max="${max}" value="${val||0}" ${readOnlyAttr}>`;
  }

  let html = "";
  orders.forEach((o, idx) => {
    const openPod = `${o.open_cy ? formatDisplayDate(o.open_cy) : '-'} / ${o.pod||'-'}`;
    const closingFull = fmtDT(o.closing_date, o.closing_time);
    const types = [];
    if (o.jml_20ft > 0) types.push("20ft");
    if (o.jml_40ft > 0) types.push("40ft/HC");
    if (o.jml_combo > 0) types.push("Combo");
    const rowSpan = types.length || 1;
    const dnDisplay = (o.no_dn || []).join('<br>');

    function currentAgg(sz){
      let total = 0;
      if (sz === '20ft') total = o.jml_20ft || 0;
      else if (sz === '40ft/HC') total = o.jml_40ft || 0;
      else if (sz === 'Combo') total = o.jml_combo || 0;
      const acc = total;
      const rej = 0;
      return {total, acc, rej};
    }

    types.forEach((sz, i)=>{
      const key = (sz==="20ft"?"20" : (sz==="40ft/HC"?"40" : "Combo"));
      const agg = currentAgg(sz);
      html += `<tr>`;
      if (i === 0) { // This part is only added for the first container type row
        html += `
          <td rowspan="${rowSpan}">${idx+1}</td>
          <td rowspan="${rowSpan}">${dnDisplay}</td>
          <td rowspan="${rowSpan}">${o.vendor}</td>
          <td rowspan="${rowSpan}">${formatDisplayDate(o.tgl_stuffing)}</td>
          <td rowspan="${rowSpan}">${closingFull}</td>
          <td rowspan="${rowSpan}">${o.shipping_point||'-'}</td>
          <td rowspan="${rowSpan}">${openPod}</td>
          <td rowspan="${rowSpan}">${o.terminal||'-'}</td>`;
      }
      html += `
        <td>${sz}</td>
        <td>${agg.total}</td>`;
      if (i === 0) {
        html += `<td rowspan="${rowSpan}">${o.remarks||"-"}</td>`;
      }
      html +=`
        <td class="acc">${cellInput(`acc_${o.order_id}_${key}`, agg.acc, agg.total)}</td>
        <td class="rej">${cellInput(`rej_${o.order_id}_${key}`, agg.rej, agg.total, true)}</td>`;
      if (i === 0) {
        html += `<td rowspan="${rowSpan}"><button class="btn primary" data-submit="${o.order_id}">Submit</button></td>`;
      }
      html += `</tr>`;
    });
  });
  tbody.innerHTML = html;

  orders.forEach(o => {
      const total20 = o.jml_20ft || 0;
      const total40 = o.jml_40ft || 0;
      const totalCombo = o.jml_combo || 0;

      const acc20_el = document.getElementById(`acc_${o.order_id}_20`);
      const rej20_el = document.getElementById(`rej_${o.order_id}_20`);
      if (acc20_el && rej20_el) {
          acc20_el.oninput = () => {
              let accepted = Number(acc20_el.value);
              if (accepted < 0) accepted = 0;
              if (accepted > total20) {
                  accepted = total20;
                  acc20_el.value = total20;
              }
              rej20_el.value = total20 - accepted;
          };
      }

      const acc40_el = document.getElementById(`acc_${o.order_id}_40`);
      const rej40_el = document.getElementById(`rej_${o.order_id}_40`);
      if (acc40_el && rej40_el) {
          acc40_el.oninput = () => {
              let accepted = Number(acc40_el.value);
              if (accepted < 0) accepted = 0;
              if (accepted > total40) {
                  accepted = total40;
                  acc40_el.value = total40;
              }
              rej40_el.value = total40 - accepted;
          };
      }
      
      const accCombo_el = document.getElementById(`acc_${o.order_id}_Combo`);
      const rejCombo_el = document.getElementById(`rej_${o.order_id}_Combo`);
      if (accCombo_el && rejCombo_el) {
          accCombo_el.oninput = () => {
              let accepted = Number(accCombo_el.value);
              if (accepted < 0) accepted = 0;
              if (accepted > totalCombo) {
                  accepted = totalCombo;
                  accCombo_el.value = totalCombo;
              }
              rejCombo_el.value = totalCombo - accepted;
          };
      }
  });

  tbody.querySelectorAll("button[data-submit]").forEach(btn=>{
    btn.onclick = ()=>{
      const oid = btn.dataset.submit;
      const o = state.orders.find(x=>x.order_id===oid);
      if(!o) return;
      const items = state.containers[oid] || [];

      function readVal(id){ const el=document.getElementById(id); return el?Number(el.value||0):0; }
      const acc20 = readVal(`acc_${oid}_20`), rej20 = readVal(`rej_${oid}_20`);
      const acc40 = readVal(`acc_${oid}_40`), rej40 = readVal(`rej_${oid}_40`);
      const accCombo = readVal(`acc_${oid}_Combo`), rejCombo = readVal(`rej_${oid}_Combo`);

      const total20 = o.jml_20ft || 0;
      const total40 = o.jml_40ft || 0;
      const totalCombo = o.jml_combo || 0;
      if(acc20 < 0 || rej20 < 0 || acc40 < 0 || rej40 < 0 || accCombo < 0 || rejCombo < 0){ toast("Nilai tidak boleh negatif."); return; }
      
      if (acc20 + rej20 !== total20) {
          toast("Jumlah Accept/Reject 20ft tidak sesuai dengan total order.");
          return;
      }
      if (acc40 + rej40 !== total40) {
          toast("Jumlah Accept/Reject 40ft/HC tidak sesuai dengan total order.");
          return;
      }
      if (accCombo + rejCombo !== totalCombo) {
          toast("Jumlah Accept/Reject Combo tidak sesuai dengan total order.");
          return;
      }

      function assign(sz, aCount, rCount){
        const rows = items.filter(r=>r.size===sz);
        rows.forEach(r=> r.accept = null);
        
        let accepted = 0;
        let rejected = 0;
        rows.forEach(r=>{
          if(accepted < aCount){
            r.accept = true;
            if(r.status===STATUS_TRUCKING[0]) r.status = STATUS_TRUCKING[1];
            accepted++;
          } else if (rejected < rCount) {
            r.accept = false;
            rejected++;
          }
        });
      }
      assign("20ft", acc20, rej20);
      assign("40ft/HC", acc40, rej40);
      assign("Combo", accCombo, rejCombo);

      updateOrderSummary(oid);
      o.submitted_vendor = true;
      saveState();
      state.menu_vendor = "List Orderan (Add Detail)";
      toast("Order disubmit. Data masuk ke List Orderan.");
      render();
    };
  });
}

/* ===================== VENDOR: LIST ORDERAN (Add Detail) ===================== */
function renderVendorListDetail(){
  const vendor = state.vendor_name;
  const myOrders = state.orders
    .filter(o => o.vendor === vendor)
    .filter(o => o.submitted_vendor === true);

  content.innerHTML = `
    <div class="main-header"><h3 style="margin:0">📋 EMKL — List Orderan (Add Detail)</h3>
      <div class="small">Klik <b>Add Detail</b> pada DN lalu isi tabel detail di panel bawah.</div>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table class="table rekap">
          <thead>
            <tr class="top">
              <th>No</th><th>DN</th><th>EMKL</th><th>Tanggal Stuffing</th><th>Closing (Date Time)</th>
              <th>Shipping Point</th><th>Open CY / Destination Port</th><th>Terminal</th><th>Remarks</th>
              <th class="center">20FT</th><th class="center">40FT/HC</th><th class="center">Combo</th><th class="center">Aksi</th>
            </tr>
          </thead>
          <tbody id="sum_rows"></tbody>
        </table>
      </div>
    </div>
    <div id="detailPanel" class="card" style="margin-top:12px; display:none"></div>
  `;

  const sum = document.getElementById("sum_rows");
  if (myOrders.length === 0){
    sum.innerHTML = `<tr><td colspan="13" class="center">Belum ada data.</td></tr>`;
  } else {
    let idx = 1;
    sum.innerHTML = myOrders.map(o=>{
      const rows = (state.containers[o.order_id] || []).filter(r=>r.accept===true);
      const c20 = rows.filter(r=>String(r.size).toLowerCase()==="20ft").length;
      const c40 = rows.filter(r=>String(r.size).toLowerCase().includes("40")).length;
      const cCombo = rows.filter(r=>r.size === "Combo").length;
      const dnDisplay = (o.no_dn || []).join('<br>');
      return `
        <tr>
          <td>${idx++}</td>
          <td>${dnDisplay}</td>
          <td style="white-space:pre-line">${o.vendor||"-"}</td>
          <td>${formatDisplayDate(o.tgl_stuffing)}</td>
          <td>${fmtDT(o.closing_date,o.closing_time)}</td>
          <td>${o.shipping_point||"-"}</td>
          <td>${(o.open_cy ? formatDisplayDate(o.open_cy) : '-')} / ${o.pod||'-'}</td>
          <td>${o.terminal||"-"}</td>
          <td>${o.remarks||"-"}</td>
          <td class="center">${c20}</td>
          <td class="center">${c40}</td>
          <td class="center">${cCombo}</td>
          <td class="center">
            <button class="btn secondary tiny" data-detail="${o.order_id}">Add Detail</button>
          </td>
        </tr>
      `;
    }).join("");
  }

  document.querySelectorAll('button[data-detail]').forEach(btn=>{
    btn.onclick = ()=> openDetailPanel(btn.dataset.detail);
  });

  function openDetailPanel(orderId){
    const order = state.orders.find(x=>x.order_id===orderId);
    const panel = document.getElementById("detailPanel");
    panel.style.display = "block";
    const dnDisplay = (order.no_dn || []).join(' / ');

    panel.innerHTML = `
      <div class="row" style="margin-bottom:8px">
        <div class="col" style="grid-column: span 12;">
          <div class="small"><b>DN:</b> ${dnDisplay} | <b>EMKL:</b> ${order.vendor} | <b>Stuffing:</b> ${formatDisplayDate(order.tgl_stuffing)}</div>
        </div>
      </div>
      <div class="table-wrap">
        <table class="table rekap">
          <thead>
            <tr>
              <th>No</th><th>Container No</th><th>No. Seal</th><th>Plat Mobil</th><th>Nama Driver</th>
              <th>Contact</th><th>Depo</th><th>Size</th><th>Status</th><th class="center">OK</th>
            </tr>
          </thead>
          <tbody id="ld_rows"></tbody>
        </table>
      </div>
      <div style="display:flex; justify-content:flex-end; margin-top:10px">
        <button id="btnSaveAllRows" class="btn cta">Simpan Semua Baris</button>
      </div>
    `;

    const rowsAcc = (state.containers[orderId] || []).filter(r=>r.accept===true);
    const wrap = document.getElementById("ld_rows");

    if(rowsAcc.length===0){
      wrap.innerHTML = `<tr><td colspan="10" class="center">Belum ada kontainer yang di-ACCEPT pada DN ini.</td></tr>`;
      return;
    }

    function statusSelect(id, val){
      const opts = ["Confirm Order","OTW Depo","Muat Depo","OTW Pabrik","Muat Gudang","Gate in Port"];
      const optHtml = opts.map(o=>`<option ${String(val||STATUS_TRUCKING[1])===o?'selected':''}>${o}</option>`).join("");
      return `<select id="${id}" class="input tiny">${optHtml}</select>`;
    }

    wrap.innerHTML = rowsAcc.map((r, idx)=>{
      const key = `${orderId}_${idx}`;
      return `
        <tr data-row="${key}">
          <td>${r.no}</td>
          <td><input id="nc_${key}" class="input tiny" placeholder="e.g. FSCU1234567" value="${r.no_container||''}"></td>
          <td><input id="ns_${key}" class="input tiny" placeholder="e.g. SEAL1234" value="${r.no_seal||''}"></td>
          <td><input id="pm_${key}" class="input tiny" placeholder="e.g. B 1234 CD" value="${r.no_mobil||''}"></td>
          <td><input id="nd_${key}" class="input tiny" placeholder="Nama driver" value="${r.nama_supir||''}"></td>
          <td><input id="ct_${key}" class="input tiny" placeholder="08xxxxxxxxxx" value="${r.contact||''}"></td>
          <td><input id="dp_${key}" class="input tiny" placeholder="Depo" value="${r.depo||''}"></td>
          <td class="center">${r.size}</td>
          <td>${statusSelect('st_'+key, r.status)}</td>
          <td class="center">
            <button class="btn primary tiny" data-ok="${key}">OK</button>
          </td>
        </tr>
      `;
    }).join("");

    wrap.querySelectorAll("button[data-ok]").forEach(btn=>{
      btn.onclick = ()=>{
        const key = btn.dataset.ok;
        const [oid, iStr] = key.split("_");
        const rowData = (state.containers[oid]||[]).find(c => `${oid}_${c.no-1}` === key);
        if(!rowData) return;
        rowData.no_container = document.getElementById("nc_"+key).value.trim();
        rowData.no_seal      = document.getElementById("ns_"+key).value.trim();
        rowData.no_mobil     = document.getElementById("pm_"+key).value.trim();
        rowData.nama_supir   = document.getElementById("nd_"+key).value.trim();
        rowData.contact      = document.getElementById("ct_"+key).value.trim();
        rowData.depo         = document.getElementById("dp_"+key).value.trim();
        rowData.status       = document.getElementById("st_"+key).value;
        saveState();
        toast(`Baris ${rowData.no} disimpan.`);
      };
    });

    document.getElementById("btnSaveAllRows").onclick = ()=>{
      rowsAcc.forEach((r, idx)=>{
        const key = `${orderId}_${idx}`;
        const target = (state.containers[orderId]||[]).find(c=>c.no === r.no);
        if(!target) return;
        target.no_container = (document.getElementById("nc_"+key)?.value || "").trim();
        target.no_seal      = (document.getElementById("ns_"+key)?.value || "").trim();
        target.no_mobil     = (document.getElementById("pm_"+key)?.value || "").trim();
        target.nama_supir   = (document.getElementById("nd_"+key)?.value || "").trim();
        target.contact      = (document.getElementById("ct_"+key)?.value || "").trim();
        target.depo         = (document.getElementById("dp_"+key)?.value || "").trim();
        target.status       = document.getElementById("st_"+key)?.value || target.status;
      });
      saveState();
      toast("Semua baris tersimpan.");
    };
  }
}

// NEW: Helper function to parse file on upload
function parseAndStoreOutstandingData(fileObject) {
    if (typeof XLSX === "undefined") {
        console.error("XLSX library not loaded.");
        return;
    }
    try {
        const b64 = fileObject.dataUrl.split('base64,')[1];
        const workbook = XLSX.read(b64, { type: 'base64' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        // Parse to array of arrays to preserve raw structure for export
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        fileObject.parsedData = jsonData;
    } catch (err) {
        console.error("Gagal mem-parsing file Excel:", err);
        toast(`Gagal memproses file ${fileObject.name}.`);
        fileObject.parsedData = null;
    }
}

// NEW: Helper function to display file preview inline
function displayInlinePreview(file) {
    if (typeof XLSX === "undefined") {
        toast("Library XLSX belum termuat.");
        return;
    }
    const container = document.getElementById("outstandingPreviewContainer");
    if (!container) return;

    try {
        const b64 = file.dataUrl.split('base64,')[1];
        const workbook = XLSX.read(b64, { type: 'base64' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const tableHtml = XLSX.utils.sheet_to_html(worksheet, { id: 'previewTable', editable: false });

        container.innerHTML = `
            <div class="preview-header">
                <h4>Preview: ${file.name}</h4>
                <button id="hidePreviewBtn" class="btn secondary">Hide</button>
            </div>
            <div class="table-wrap">
                <style>#previewTable{width:100%;border-collapse:collapse;} #previewTable td, #previewTable th{border:1px solid #ccc;padding:4px 8px;text-align:left;}</style>
                ${tableHtml}
            </div>
        `;
        container.style.display = 'block';
        document.getElementById('hidePreviewBtn').onclick = () => {
            state.active_preview_file_id = null;
            saveState();
            renderOutstanding();
        };
    } catch (err) {
        console.error("Gagal membaca file Excel:", err);
        toast("Gagal memproses file. Pastikan format Excel valid.");
        container.style.display = 'none';
        container.innerHTML = '';
    }
}

/* ===================== ADMIN: DATA OUTSTANDING ===================== */
function renderOutstanding(){
  content.innerHTML = `
    <div class="main-header">
      <h3 style="margin:0">🧾 Data Outstanding</h3>
      <div class="small">Unggah file Excel/CSV sebagai database. Klik 'Tampilkan' untuk melihat isinya.</div>
    </div>
    <div class="card">
      <div class="toolbar" style="display:flex; gap:12px; flex-wrap:wrap; align-items:center">
        <label class="btn primary">
          ⬆️ Upload File
          <input id="outUpload" type="file" accept=".csv,.xlsx" multiple style="display:none">
        </label>
        <button id="outDeleteAll" class="btn danger">🗑️ Hapus Semua</button>
      </div>
      <div id="outList" style="margin-top:12px"></div>
    </div>
    <div id="outstandingPreviewContainer" class="card" style="display:none; margin-top:16px;"></div>
  `;

  if(!Array.isArray(state.outstanding_files)) state.outstanding_files = [];

  const input = document.getElementById("outUpload");
  input.onchange = (e)=>{
    const files = Array.from(e.target.files||[]);
    if(!files.length) return;
    let pending = files.length;
    files.forEach(f=>{
      const reader = new FileReader();
      reader.onload = ()=>{
        const fileObject = {
          id: genId("OUT"),
          name: f.name,
          size: f.size,
          type: f.type || (/\.(xlsx|xls)$/i.test(f.name) ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : "text/csv"),
          uploadedAt: new Date().toISOString(),
          dataUrl: reader.result
        };
        
        parseAndStoreOutstandingData(fileObject);
        state.outstanding_files.push(fileObject);

        pending--;
        if(pending===0){
          saveState();
          drawList();
          toast("Upload berhasil.");
          input.value="";
        }
      };
      reader.readAsDataURL(f);
    });
  };

  document.getElementById("outDeleteAll").onclick = ()=>{
    if(confirm("Hapus semua file Data Outstanding?")){
      state.outstanding_files = [];
      state.active_preview_file_id = null;
      saveState();
      renderOutstanding();
      toast("Semua file dihapus.");
    }
  };

  function drawList(){
    const box = document.getElementById("outList");
    const list = state.outstanding_files;
    if(!list.length){
      box.innerHTML = '<div class="empty">Belum ada file. Klik <b>Upload File</b> untuk menambahkan.</div>';
      return;
    }
    box.innerHTML = list.map(f=>`
      <div class="file-row" data-id="${f.id}">
        <div class="file-main">
          <div class="file-name">📄 <b>${f.name}</b></div>
          <div class="file-meta small">${(f.size/1024).toFixed(1)} KB • ${new Date(f.uploadedAt).toLocaleString()}</div>
        </div>
        <div class="file-actions">
          <button class="btn success" data-act="view">Tampilkan</button>
          <button class="btn secondary" data-act="download">📥 Unduh</button>
          <button class="btn danger" data-act="delete">🗑️ Hapus</button>
        </div>
      </div>
    `).join("");

    box.querySelectorAll(".file-row").forEach(row=>{
      const id = row.dataset.id;
      const f = state.outstanding_files.find(x=>x.id===id);
      
      row.querySelector('[data-act="view"]').onclick = ()=>{
        if (f) {
          state.active_preview_file_id = f.id;
          saveState();
          displayInlinePreview(f);
        }
      };
      row.querySelector('[data-act="download"]').onclick = ()=>{
        if(f) downloadDataUrl(f.name, f.dataUrl);
      };
      row.querySelector('[data-act="delete"]').onclick = ()=>{
        if(confirm("Hapus file ini?")){
          state.outstanding_files = state.outstanding_files.filter(x=>x.id!==id);
          if (state.active_preview_file_id === id) {
            state.active_preview_file_id = null;
          }
          saveState();
          renderOutstanding();
          toast("File dihapus.");
        }
      };
    });
    setLastUpdate();
  }
  
  drawList();

  if (state.active_preview_file_id) {
    const fileToPreview = state.outstanding_files.find(f => f.id === state.active_preview_file_id);
    if (fileToPreview) {
      displayInlinePreview(fileToPreview);
    } else {
      state.active_preview_file_id = null;
      saveState();
    }
  }
}

// --- FUNGSI BARU DITAMBAHKAN DI SINI ---
/* ===================== ADMIN: RATE TRANSPORTER ===================== */
function renderRateTransporter(){
  content.innerHTML = `
    <div class="main-header">
      <h3 style="margin:0">💰 Admin — Rate Transporter</h3>
      <div class="small">Tampilan ranking rate transporter berdasarkan jenis container.</div>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table class="table rate-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Transporter Name</th>
              <th>Container Type</th>
              <th>Handling</th>
              <th>Trucking</th>
              <th>Total</th>
              <th>Allocation (%)</th>
              <th>Allocation (Qty)</th>
            </tr>
          </thead>
          <tbody>
            <tr class="rate-section-header"><td colspan="8">20ft</td></tr>
            <tr><td>TOP1</td><td>PT Cakraindo Mitra International</td><td>20ft</td><td>100,000</td><td>1,500,000</td><td>1,600,000</td><td>4%</td><td>15</td></tr>
            <tr><td>TOP1</td><td>PT Argo Trans Mandiri</td><td>20ft</td><td>80,000</td><td>1,550,000</td><td>1,630,000</td><td>8%</td><td>30</td></tr>
            <tr><td>TOP2</td><td>PT Puninar Logistics</td><td>20ft</td><td>140,000</td><td>1,600,000</td><td>1,740,000</td><td>8%</td><td>30</td></tr>
            <tr><td>TOP3</td><td>PT Elang Transportasi Indonesia</td><td>20ft</td><td>115,000</td><td>1,645,000</td><td>1,760,000</td><td>8%</td><td>30</td></tr>
            <tr><td>TOP4</td><td>PT Tangguh Karimata Jaya</td><td>20ft</td><td>100,000</td><td>1,750,000</td><td>1,850,000</td><td>5%</td><td>20</td></tr>
            <tr><td>TOP5</td><td>PT BSA Logistics Indonesia</td><td>20ft</td><td>135,000</td><td>1,720,000</td><td>1,855,000</td><td>5%</td><td>20</td></tr>
            <tr><td>TOP6</td><td>PT Inti Persada Mandiri</td><td>20ft</td><td>160,000</td><td>1,720,000</td><td>1,880,000</td><td>13%</td><td>50</td></tr>
            <tr><td>TOP7</td><td>PT Lintas Buana Karya</td><td>20ft</td><td>160,000</td><td>1,720,000</td><td>1,880,000</td><td>13%</td><td>50</td></tr>
            <tr><td>TOP8</td><td>PT Putra Sejahtera Sentosa</td><td>20ft</td><td>150,000</td><td>1,800,000</td><td>1,950,000</td><td>8%</td><td>30</td></tr>
            <tr><td>TOP9</td><td>PT Lintas Marindo Nusantara</td><td>20ft</td><td>107,500</td><td>1,875,000</td><td>1,982,500</td><td>27%</td><td>100</td></tr>

            <tr class="rate-section-header"><td colspan="8">40ft/HC</td></tr>
            <tr><td>TOP1</td><td>PT Cakraindo Mitra International</td><td>40ft/HC</td><td>100,000</td><td>1,600,000</td><td>1,700,000</td><td>3%</td><td>50</td></tr>
            <tr><td>TOP1</td><td>PT Argo Trans Mandiri</td><td>40ft/HC</td><td>80,000</td><td>1,750,000</td><td>1,830,000</td><td>10%</td><td>200</td></tr>
            <tr><td>TOP2</td><td>PT Puninar Logistics</td><td>40ft/HC</td><td>140,000</td><td>1,800,000</td><td>1,940,000</td><td>10%</td><td>200</td></tr>
            <tr><td>TOP3</td><td>PT BSA Logistics Indonesia</td><td>40ft/HC</td><td>135,000</td><td>1,825,000</td><td>1,960,000</td><td>10%</td><td>200</td></tr>
            <tr><td>TOP4</td><td>PT Elang Transportasi Indonesia</td><td>40ft/HC</td><td>115,000</td><td>1,845,000</td><td>1,960,000</td><td>10%</td><td>200</td></tr>
            <tr><td>TOP5</td><td>PT Tangguh Karimata Jaya</td><td>40ft/HC</td><td>100,000</td><td>1,900,000</td><td>2,000,000</td><td>10%</td><td>200</td></tr>
            <tr><td>TOP6</td><td>PT Glory Bahana Universal</td><td>40ft/HC</td><td>125,000</td><td>2,000,000</td><td>2,125,000</td><td>10%</td><td>200</td></tr>
            <tr><td>TOP7</td><td>PT Mega Samudra Transportasi</td><td>40ft/HC</td><td>150,000</td><td>2,000,000</td><td>2,150,000</td><td>10%</td><td>200</td></tr>
            <tr><td>TOP8</td><td>PT Putra Sejahtera Sentosa</td><td>40ft/HC</td><td>150,000</td><td>2,000,000</td><td>2,150,000</td><td>10%</td><td>200</td></tr>
            <tr><td>TOP9</td><td>PT Trisindo</td><td>40ft/HC</td><td>150,000</td><td>2,000,000</td><td>2,150,000</td><td>10%</td><td>200</td></tr>
            <tr><td>TOP10</td><td>PT Lintas Marindo Nusantara</td><td>40ft/HC</td><td>107,500</td><td>2,170,000</td><td>2,277,500</td><td>5%</td><td>100</td></tr>

            <tr class="rate-section-header"><td colspan="8">Combo</td></tr>
            <tr><td>TOP1</td><td>PT Cakraindo Mitra International</td><td>Combo</td><td>200,000</td><td>2,350,000</td><td>2,550,000</td><td>20%</td><td>50</td></tr>
            <tr><td>TOP1</td><td>PT Argo Trans Mandiri</td><td>Combo</td><td>160,000</td><td>2,700,000</td><td>2,860,000</td><td>20%</td><td>50</td></tr>
            <tr><td>TOP2</td><td>PT Bimaruna Jaya</td><td>Combo</td><td>320,000</td><td>2,700,000</td><td>3,020,000</td><td>20%</td><td>50</td></tr>
            <tr><td>TOP3</td><td>PT Tangguh Karimata Jaya</td><td>Combo</td><td>200,000</td><td>2,900,000</td><td>3,100,000</td><td>20%</td><td>50</td></tr>
            <tr><td>TOP4</td><td>PT Inti Persada Mandiri</td><td>Combo</td><td>320,000</td><td>2,850,000</td><td>3,170,000</td><td>10%</td><td>25</td></tr>
            <tr><td>TOP5</td><td>PT Lintas Buana Karya</td><td>Combo</td><td>320,000</td><td>2,850,000</td><td>3,170,000</td><td>10%</td><td>25</td></tr>

          </tbody>
        </table>
      </div>
    </div>
  `;
}
// --- AKHIR FUNGSI BARU ---

// NEW: Helper function to export all outstanding data from the Report page
function exportOutstandingData() {
    if (typeof XLSX === "undefined") {
        toast("Library XLSX belum termuat.");
        return;
    }
    const outstandingFiles = state.outstanding_files || [];
    if (outstandingFiles.length === 0) {
        toast("Tidak ada data outstanding untuk diekspor.");
        return;
    }

    try {
        const wb = XLSX.utils.book_new();
        outstandingFiles.forEach((file, index) => {
            if (file.parsedData && Array.isArray(file.parsedData)) {
                let sheetName = file.name.replace(/[\.\[\]\*\/\\?\:]/g, "").substring(0, 25);
                if (!sheetName) sheetName = `Sheet${index + 1}`;
                
                let finalSheetName = sheetName;
                let counter = 1;
                while(wb.SheetNames.includes(finalSheetName)){
                  finalSheetName = `${sheetName.substring(0, 28)}_${counter}`;
                  counter++;
                }

                const ws = XLSX.utils.aoa_to_sheet(file.parsedData);
                XLSX.utils.book_append_sheet(wb, ws, finalSheetName);
            }
        });

        if (wb.SheetNames.length === 0) {
            toast("Tidak ada data valid yang bisa diekspor dari file outstanding.");
            return;
        }

        XLSX.writeFile(wb, "report_data_outstanding.xlsx");
        toast("Ekspor Data Outstanding berhasil.");
    } catch (err) {
        console.error("Gagal mengekspor data outstanding:", err);
        toast("Terjadi kesalahan saat mengekspor data.");
    }
}

// MODIFIED: Smarter function to find headers in multi-level header Excel files
function getDataFromOutstanding(dnToFind) {
  const defaultResult = {
    partie20: null, partie40: null, sc: null,
    forwardingAgent: null, productGroup: null, productForm: null,
    nw: null
  };
  
  if (!state.outstanding_files || state.outstanding_files.length === 0) {
    return defaultResult;
  }
  
  const targetDn = String(dnToFind).trim().toLowerCase();
  if (!targetDn) return defaultResult;

  // Define aliases for column headers
  const dnAliases = ['dn', 'no dn', 'delivery note'];
  const p20Aliases = ['20', '20ft', 'partie 20', "20'"];
  const p40Aliases = ['40', '40hc', "40'hc", '40 hc', "40' hc", 'partie 40', '40ft/hc'];
  const scAliases = ['sc', 'no sc'];
  const fwdAgentAliases = ['forwarding agent', 'fwd agent', 'forwarder'];
  const prodGroupAliases = ['product group', 'grup'];
  const prodFormAliases = ['product form', 'form'];
  const nwAliases = ['nw', 'net weight'];

  for (const file of state.outstanding_files) {
    if (!file.parsedData || file.parsedData.length < 1) continue;

    let headers = null;
    let dataStartIndex = -1;

    // Search for the header row in the first 5 rows of the file
    for (let i = 0; i < Math.min(5, file.parsedData.length); i++) {
        const potentialHeaders = file.parsedData[i].map(h => String(h || '').trim().toLowerCase());
        
        // A row is considered a header if it contains a DN alias
        const hasDn = dnAliases.some(alias => potentialHeaders.includes(alias));
        
        if (hasDn) {
            headers = potentialHeaders;
            dataStartIndex = i + 1;
            break; // Found the header row, stop searching
        }
    }

    // If no valid header row was found in this file, skip to the next file
    if (!headers) {
        continue;
    }

    // Find indices of the required columns using aliases
    const findIndex = (aliases) => {
      for (const alias of aliases) {
        const index = headers.indexOf(alias);
        if (index !== -1) return index;
      }
      return -1;
    };
    
    const dnIndex = findIndex(dnAliases);
    const p20Index = findIndex(p20Aliases);
    const p40Index = findIndex(p40Aliases);
    const scIndex = findIndex(scAliases);
    const fwdAgentIndex = findIndex(fwdAgentAliases);
    const prodGroupIndex = findIndex(prodGroupAliases);
    const prodFormIndex = findIndex(prodFormAliases);
    const nwIndex = findIndex(nwAliases);

    // Loop through the data rows (starting after the header row)
    for (let i = dataStartIndex; i < file.parsedData.length; i++) {
      const row = file.parsedData[i];
      if (!row || row.length <= dnIndex) continue;
      
      const currentDn = String(row[dnIndex] || '').trim().toLowerCase();
      
      if (currentDn === targetDn) {
        // Found the matching row, extract all data
        return {
          partie20: p20Index !== -1 && row[p20Index] !== undefined ? row[p20Index] : null,
          partie40: p40Index !== -1 && row[p40Index] !== undefined ? row[p40Index] : null,
          sc: scIndex !== -1 && row[scIndex] !== undefined ? row[scIndex] : null,
          forwardingAgent: fwdAgentIndex !== -1 && row[fwdAgentIndex] !== undefined ? row[fwdAgentIndex] : null,
          productGroup: prodGroupIndex !== -1 && row[prodGroupIndex] !== undefined ? row[prodGroupIndex] : null,
          productForm: prodFormIndex !== -1 && row[prodFormIndex] !== undefined ? row[prodFormIndex] : null,
          nw: nwIndex !== -1 && row[nwIndex] !== undefined ? row[nwIndex] : null,
        };
      }
    }
  }

  return defaultResult; // Return default if no match is found across all files
}

/* ===================== ADMIN: REPORT ===================== */
function renderReport() {
  content.innerHTML = `
    <div class="main-header">
      <h3 style="margin:0">📊 Admin — Report BOC</h3>
      <div class="small">Tarik data berdasarkan rentang tanggal untuk membuat laporan harian/mingguan.</div>
    </div>

    <div class="card">
      <h3 style="margin:0 0 10px 0">Laporan Harian / Mingguan</h3>
      <div class="form-grid">
        <div class="span-5">
            <label>Tanggal Mulai (Stuffing)</label>
            <input type="date" id="report_start_date" class="input">
        </div>
        <div class="span-5">
            <label>Tanggal Selesai (Stuffing)</label>
            <input type="date" id="report_end_date" class="input">
        </div>
        <div class="span-2" style="display:flex; align-items:flex-end;">
            <button id="btnGenerateReport" class="btn primary full">Tarik Data</button>
        </div>
      </div>
      <div id="reportContainer" style="margin-top:16px;"></div>
    </div>

    <div class="card">
      <h3 style="margin:0 0 10px 0">Download Data</h3>
      <div style="display:flex; gap:10px; flex-wrap:wrap">
        <button id="btnReportRaw" class="btn secondary">⬇️ Download Semua Data Order (XLSX)</button>
        <button id="btnDownloadOutstanding" class="btn secondary">⬇️ Download Data Outstanding (XLSX)</button>
      </div>
      <div class="small muted" style="margin-top:8px">
        • <b>Download Semua Data Order:</b> Mengekspor 2 sheet: <i>ORDERS</i> dan <i>CONTAINERS</i> dari semua data yang ada.<br>
        • <b>Download Data Outstanding:</b> Mengekspor semua file yang di-upload di menu 'Data Outstanding' ke dalam satu file Excel, masing-masing dalam sheet terpisah.
      </div>
    </div>
  `;

  const endDateEl = document.getElementById('report_end_date');
  const startDateEl = document.getElementById('report_start_date');
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);
  endDateEl.value = toISODate(today);
  startDateEl.value = toISODate(sevenDaysAgo);

  document.getElementById('btnGenerateReport').onclick = () => {
    const startDate = startDateEl.value;
    const endDate = endDateEl.value;
    if (!startDate || !endDate) {
      toast("Pilih rentang tanggal terlebih dahulu.");
      return;
    }
    
    const filteredOrders = state.orders.filter(o => {
        const stuffingDate = parseISODate(o.tgl_stuffing);
        return stuffingDate >= parseISODate(startDate) && stuffingDate <= parseISODate(endDate);
    });

    buildStandardReport(filteredOrders, startDate, endDate);
  };

  function buildStandardReport(orders, startDateStr, endDateStr) {
    const reportContainer = document.getElementById('reportContainer');

    if (orders.length === 0) {
        reportContainer.innerHTML = `<div class="empty">Tidak ada data order pada rentang tanggal tersebut.</div>`;
        return;
    }

    const start = parseISODate(startDateStr);
    const end = parseISODate(endDateStr);
    const dateArray = [];
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
        dateArray.push(new Date(dt));
    }
    
    if(dateArray.length > 14) {
        reportContainer.innerHTML = `<div class="empty">Rentang tanggal terlalu lebar (maksimal 14 hari). Harap pilih rentang yang lebih pendek.</div>`;
        return;
    }

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const planningHeaderDates = dateArray.map(dt => {
        const day = String(dt.getDate()).padStart(2, '0');
        return `<th colspan="2">${day}-${monthNames[dt.getMonth()]}</th>`;
    }).join('');
    
    const planningHeaderTypes = dateArray.map(() => `<th>20'</th><th>40'HC</th>`).join('');

    const formatNumberCell = (val) => {
        if (val === null || val === undefined || String(val).trim() === '') return '';
        const num = parseFloat(val);
        if (isNaN(num)) return val; // Return original value if it's not a number
        // Round to 3 decimal places, then convert back to a number to remove trailing zeros
        return Number(num.toFixed(3));
    };

    const tableBody = orders.map((order, index) => {
        const defaultOutstandingData = { sc: null, forwardingAgent: null, productGroup: null, productForm: null, partie20: null, partie40: null, nw: null };
        let outstandingData = {...defaultOutstandingData};
        const dnsForOrder = order.no_dn || [];

        for (const dn of dnsForOrder) {
            if (!dn) continue;
            const foundData = getDataFromOutstanding(dn);
            
            const hasData = Object.values(foundData).some(val => val !== null && val !== undefined && String(val).trim() !== '');
            
            if (hasData) {
                outstandingData = foundData;
                break; 
            }
        }

        const planningCells = dateArray.map(dt => {
            if (order.tgl_stuffing === toISODate(dt)) {
                return `<td class="acc">${order.jml_20ft || ''}</td><td class="acc">${order.jml_40ft || ''}</td>`;
            } else {
                return `<td></td><td></td>`;
            }
        }).join('');

        return `
            <tr>
                <td>${index + 1}</td>
                <td>${outstandingData.sc || ''}</td>
                <td>${(order.no_dn || []).join('<br>')}</td>
                <td>${order.vendor || '-'}</td>
                <td>${outstandingData.forwardingAgent || ''}</td>
                <td>${order.pod || '-'}</td>
                <td>${outstandingData.productGroup || ''}</td>
                <td>${outstandingData.productForm || ''}</td>
                <td>${formatNumberCell(outstandingData.partie20)}</td>
                <td>${formatNumberCell(outstandingData.partie40)}</td>
                ${planningCells}
                <td>${formatNumberCell(outstandingData.nw)}</td>
                <td>${formatDisplayDate(order.closing_date) || '-'}</td>
                <td>${order.closing_time || '-'}</td>
                <td>${order.remarks || '-'}</td>
            </tr>
        `;
    }).join('');

    const tableHTML = `
      <div class="rekap-wrap">
        <table class="table rekap report-table" id="standardReportTable">
          <thead>
            <tr>
              <th rowspan="3">No.</th>
              <th rowspan="3">SC</th>
              <th rowspan="3">DN</th>
              <th rowspan="3">EMKL</th>
              <th rowspan="3">FORWARDING AGENT</th>
              <th rowspan="3">DESTINATION PORT</th>
              <th colspan="2">PRODUCT</th>
              <th colspan="2">PARTIE</th>
              <th colspan="${dateArray.length * 2}">PLANNING</th>
              <th rowspan="3">NW</th>
              <th colspan="2">CLOSING CY</th>
              <th rowspan="3">REMARKS</th>
            </tr>
            <tr>
              <th rowspan="2">Grup</th>
              <th rowspan="2">Form</th>
              <th rowspan="2">20'</th>
              <th rowspan="2">40' HC</th>
              ${planningHeaderDates}
              <th rowspan="2">TGL</th>
              <th rowspan="2">TIME</th>
            </tr>
            <tr>
              ${planningHeaderTypes}
            </tr>
          </thead>
          <tbody>
            ${tableBody}
          </tbody>
        </table>
      </div>
      <div style="margin-top:10px; display:flex; justify-content:flex-end;">
        <button id="btnDownloadStandardReport" class="btn success">⬇️ Download Laporan (XLSX)</button>
      </div>
    `;
    
    reportContainer.innerHTML = tableHTML;
    
    document.getElementById('btnDownloadStandardReport').onclick = () => {
        const table = document.getElementById('standardReportTable');
        const wb = XLSX.utils.table_to_book(table, {sheet: "Laporan"});
        XLSX.writeFile(wb, `Laporan_Periode_${startDateStr}_hingga_${endDateStr}.xlsx`);
    };
  }

  function buildOrders() {
    return state.orders.map(o=>({
      order_id: o.order_id, no_dn: (o.no_dn || []).join(', '), EMKL: o.vendor,
      tgl_stuffing: formatDisplayDate(o.tgl_stuffing), 
      closing: fmtDT(o.closing_date, o.closing_time),
      shipping_point: o.shipping_point || "", 
      open_cy: o.open_cy ? formatDisplayDate(o.open_cy) : "", 
      pod: o.pod || "",
      terminal: o.terminal || "", 
      jml_20ft: o.jml_20ft || 0, 
      jml_40ft_HC: o.jml_40ft || 0,
      jml_combo: o.jml_combo || 0,
      remarks: o.remarks || "", 
      status_order: o.summary_status || "Pending",
      created_at: o.created_at || ""
    }));
  }
  function buildContainers() {
    const rows = [];
    state.orders.forEach(o=>{
      (state.containers[o.order_id] || []).forEach(r=>{
        rows.push({
          order_id: o.order_id, no_dn: (o.no_dn || []).join(', '), EMKL: o.vendor, size: r.size,
          accept: r.accept===true ? "Accept" : (r.accept===false ? "Reject" : "Pending"),
          no_container: r.no_container || "", no_seal: r.no_seal || "", no_mobil: r.no_mobil || "",
          nama_supir: r.nama_supir || "", contact: r.contact || "", depo: r.depo || "",
          status_trucking: r.status || ""
        });
      });
    });
    return rows;
  }
  function exportRaw(){
    if(typeof XLSX==="undefined"){ toast("Library XLSX belum termuat."); return; }
    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet(buildOrders());
    const ws2 = XLSX.utils.json_to_sheet(buildContainers());
    XLSX.utils.book_append_sheet(wb, ws1, "ORDERS");
    XLSX.utils.book_append_sheet(wb, ws2, "CONTAINERS");
    XLSX.writeFile(wb, "report_data_mentah.xlsx");
  }

  document.getElementById("btnReportRaw").onclick = exportRaw;
  document.getElementById("btnDownloadOutstanding").onclick = exportOutstandingData;
}

// DCR Report
function renderDCR() {
  content.innerHTML = `
    <div class="main-header">
      <h3 style="margin:0">📑 DCR Report</h3>
      <div class="small">Laporan Daily Container Requirement</div>
    </div>
    <div class="card">
      <div class="form-grid">
        <div class="span-5">
            <label>Tanggal Mulai</label>
            <input type="date" id="dcr_start_date" class="input">
        </div>
        <div class="span-5">
            <label>Tanggal Selesai</label>
            <input type="date" id="dcr_end_date" class="input">
        </div>
        <div class="span-2" style="display:flex; align-items:flex-end;">
            <button id="btnGenerateDCR" class="btn primary full">Tarik Data</button>
        </div>
      </div>
      <div id="dcrReportContainer" class="rekap-wrap" style="margin-top:16px;"></div>
    </div>
  `;

  const endDateEl = document.getElementById('dcr_end_date');
  const startDateEl = document.getElementById('dcr_start_date');
  const today = new Date();
  const threeDaysLater = new Date();
  threeDaysLater.setDate(today.getDate() + 3);
  startDateEl.value = toISODate(today);
  endDateEl.value = toISODate(threeDaysLater);

  document.getElementById('btnGenerateDCR').onclick = () => {
    const startDate = startDateEl.value;
    const endDate = endDateEl.value;
    if (!startDate || !endDate) {
      toast("Pilih rentang tanggal terlebih dahulu.");
      return;
    }
    
    const filteredOrders = state.orders.filter(o => {
        const d = o.tgl_stuffing;
        return d >= startDate && d <= endDate;
    });

    const shippingPoints = [...new Set(filteredOrders.map(o => o.shipping_point).filter(sp => sp))];

    const dates = [];
    for (let dt = parseISODate(startDate); dt <= parseISODate(endDate); dt.setDate(dt.getDate() + 1)) {
        dates.push(new Date(dt));
    }
    
    if (dates.length > 7) {
        document.getElementById('dcrReportContainer').innerHTML = `<div class="empty">Rentang tanggal terlalu lebar (maksimal 7 hari).</div>`;
        return;
    }
    
    buildDCRReport(dates, shippingPoints, filteredOrders);
  };

  function buildDCRReport(dates, shippingPoints, filteredOrders) {
    const container = document.getElementById('dcrReportContainer');
    
    if (shippingPoints.length === 0) {
        container.innerHTML = `<div class="empty">Tidak ada data Shipping Point pada rentang tanggal yang dipilih.</div>`;
        return;
    }

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Header
    let headerHtml = `
      <table class="table rekap report-table">
        <thead>
          <tr>
            <th rowspan="3">No.</th>
            <th rowspan="3">EMKL</th>
            ${shippingPoints.map(sp => `<th colspan="${dates.length * 2 + 1}">${sp}</th>`).join('')}
          </tr>
          <tr>
            ${shippingPoints.map(() => 
              dates.map(d => `<th colspan="2">${String(d.getDate()).padStart(2,'0')} ${monthNames[d.getMonth()]} '${String(d.getFullYear()).slice(-2)}</th>`).join('') + 
              `<th rowspan="2">MT</th>`
            ).join('')}
          </tr>
          <tr>
            ${shippingPoints.map(() => dates.map(() => `<th>20'</th><th>40'</th>`).join('')).join('')}
          </tr>
        </thead>
    `;

    // Body
    let bodyHtml = `<tbody>`;
    const grandTotals = {};

    VENDORS_DEFAULT.forEach((vendor, index) => {
        bodyHtml += `<tr><td>${index + 1}</td><td>${vendor}</td>`;
        shippingPoints.forEach(sp => {
            dates.forEach(date => {
                const dateStr = toISODate(date);
                let total20 = 0;
                let total40 = 0;
                
                filteredOrders
                    .filter(o => o.vendor === vendor && o.shipping_point === sp && o.tgl_stuffing === dateStr)
                    .forEach(order => {
                        total20 += order.jml_20ft || 0;
                        total40 += order.jml_40ft || 0;
                    });
                
                bodyHtml += `<td>${total20 || '-'}</td><td>${total40 || '-'}</td>`;

                const key = `${sp}_${dateStr}`;
                if (!grandTotals[key]) grandTotals[key] = { total20: 0, total40: 0 };
                grandTotals[key].total20 += total20;
                grandTotals[key].total40 += total40;
            });
            bodyHtml += `<td>-</td>`; // MT Column
        });
        bodyHtml += `</tr>`;
    });
    bodyHtml += `</tbody>`;

    // Footer
    let footerHtml = `
        <tfoot>
            <tr style="background-color: yellow; font-weight: bold;">
                <td colspan="2">Grand Total</td>
                ${shippingPoints.map(sp => 
                    dates.map(date => {
                        const key = `${sp}_${toISODate(date)}`;
                        const totals = grandTotals[key] || { total20: 0, total40: 0 };
                        return `<td>${totals.total20 || '-'}</td><td>${totals.total40 || '-'}</td>`;
                    }).join('') + `<td>-</td>`
                ).join('')}
            </tr>
        </tfoot>
      </table>
    `;

    container.innerHTML = headerHtml + bodyHtml + footerHtml;
  }
}


function renderDDCR() {
  content.innerHTML = `
    <div class="main-header"><h3 style="margin:0">📋 DDCR Report</h3><div class="small">Laporan Daily Kebutuhan Container</div></div>
    <div class="card">
       <div class="form-grid">
        <div class="span-5">
            <label>Tanggal Mulai</label>
            <input type="date" id="ddcr_start_date" class="input">
        </div>
        <div class="span-5">
            <label>Tanggal Selesai</label>
            <input type="date" id="ddcr_end_date" class="input">
        </div>
        <div class="span-2" style="display:flex; align-items:flex-end;">
            <button id="btnGenerateDDCR" class="btn primary full">Tarik Data</button>
        </div>
      </div>
    </div>
    <div id="ddcrReportContainer" class="card" style="margin-top:16px;">
        <table class="table rekap" style="max-width: 600px;">
            <thead>
                <tr>
                    <th style="background:#eef2ff; text-align:center;">REPORT BY MT</th>
                    <th style="background:#eef2ff; text-align:center;">QTY</th>
                    <th style="background:#eef2ff; text-align:center;"></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="text-align:left; color:black;">CARGO READY TO SHIP OUT</td>
                    <td style="text-align:left; color:black;">4,831</td>
                    <td style="text-align:left; color:black;">Mt</td>
                </tr>
                <tr>
                    <td style="text-align:left; color:black;">PLANNING DCR</td>
                    <td style="text-align:left; color:black;">-</td>
                    <td style="text-align:left; color:black;">Mt</td>
                </tr>
                <tr>
                    <td style="text-align:left; color:black;">CONTAINER ALREADY ARRIVED</td>
                    <td style="text-align:left; color:black;">1,500</td>
                    <td style="text-align:left; color:black;">Mt</td>
                </tr>
                <tr>
                    <td style="text-align:left; color:black;">Additional Planning for Incoming</td>
                    <td style="text-align:left; color:black;">(1,500)</td>
                    <td style="text-align:left; color:black;">Mt</td>
                </tr>
                 <tr>
                    <td style="text-align:left; color:black;">WAIT CONFIRMATION LINER / DETENTION / HOLD / RESCHEDULE</td>
                    <td style="text-align:left; color:black;">4,831</td>
                    <td style="text-align:left; color:black;">Mt</td>
                </tr>
            </tbody>
        </table>
    </div>
  `;

    const endDateEl = document.getElementById('ddcr_end_date');
    const startDateEl = document.getElementById('ddcr_start_date');
    const today = new Date();
    const fiveDaysLater = new Date();
    fiveDaysLater.setDate(today.getDate() + 5);
    startDateEl.value = toISODate(today);
    endDateEl.value = toISODate(fiveDaysLater);

    // Placeholder for future logic
    document.getElementById('btnGenerateDDCR').onclick = () => {
        toast("Fungsi kalkulasi untuk DDCR belum diimplementasikan.");
    };
}


// ====================================================================
// PERBAIKAN FUNGSI INI (TOMBOL "CARI" & FILTER)
// ====================================================================
function renderReportDurasi() {
  // Data statis (demo) berdasarkan HTML Anda
  const dummyData = [
    { no: 1, iml: "44008784", jenis: "MUAT", type: "LOCAL", t1: "9/10/2025 8:26:00 PM", t2: "9/10/2025 8:34:18 PM", s1: "00:08:18", t3: "9/11/2025 1:28:19 AM", s2: "04:54:01", t4: "9/11/2025 12:20:19 PM", s3: "10:52:00", t5: "9/11/2025 12:48:18 PM", s4: "00:28:00", t6: "9/11/2025 5:35:16 PM", s5: "04:46:57", total: "21:09:16" },
    { no: 2, iml: "44008785", jenis: "MUAT", type: "LOCAL", t1: "9/10/2025 9:00:00 PM", t2: "9/10/2025 9:15:30 PM", s1: "00:15:30", t3: "9/11/2025 2:00:00 AM", s2: "04:44:30", t4: "9/11/2025 1:00:00 PM", s3: "11:00:00", t5: "9/11/2025 1:30:15 PM", s4: "00:30:15", t6: "9/11/2025 6:09:18 PM", s5: "04:15:03", total: "18:19:12" },
    { no: 3, iml: "44008786", jenis: "MUAT", type: "LOCAL", t1: "9/10/2025 10:00:00 PM", t2: "9/10/2025 10:10:10 PM", s1: "00:10:10", t3: "9/11/2025 3:00:00 AM", s2: "04:49:50", t4: "9/11/2025 10:00:00 AM", s3: "07:00:00", t5: "9/11/2025 10:30:00 AM", s4: "00:30:00", t6: "9/11/2025 11:59:29 AM", s5: "02:43:02", total: "14:24:35" },
    { no: 4, iml: "44008787", jenis: "MUAT", type: "LOCAL", t1: "9/10/2025 11:00:00 PM", t2: "9/10/2025 11:05:00 PM", s1: "00:05:00", t3: "9/11/2025 4:00:00 AM", s2: "04:55:00", t4: "9/11/2025 9:00:00 AM", s3: "05:00:00", t5: "9/11/2025 9:30:00 AM", s4: "00:30:00", t6: "9/11/2025 12:44:44 AM", s5: "01:38:33", total: "12:47:41" },
    { no: 5, iml: "44008788", jenis: "MUAT", type: "LOCAL", t1: "9/10/2025 11:30:00 PM", t2: "9/10/2025 11:35:00 PM", s1: "00:05:00", t3: "9/11/2025 5:00:00 AM", s2: "05:25:00", t4: "9/11/2025 10:00:00 AM", s3: "05:00:00", t5: "9/11/2025 10:30:00 AM", s4: "00:30:00", t6: "9/11/2025 12:30:06 PM", s5: "02:06:31", total: "12:58:43" }
  ];

  // Konten HTML ini didasarkan pada CSS di styles.css DAN screenshot baru
  content.innerHTML = `
    <div id="report-durasi-page">
      <div class="topbar">
        <div class="brand">
          <div class="dot"></div>
          <h3>Report Durasi Trucking</h3>
        </div>
        <div class="clock" id="rd_clock">--:--:--</div>
      </div>
      
      <div class="container">
        
        <div class="controls-bar">
          <div class="control-group">
            <label class="switch-label">Tampilkan semua kolom <b>Selisih Waktu</b></label>
            <label class="switch">
              <input type="checkbox" id="rd_toggle_selisih" checked>
              <span class="slider"></span>
            </label>
          </div>
          <details class="details">
            <summary>► Pengaturan kolom selisih (opsional)</summary>
            </details>
          <div class="control-group-spacer"></div>
          <div class="control-group">
            <input type="text" id="rd_search" class="input" placeholder="Cari No IML..." style="min-width: 220px;">
            <select id="rd_filter_jenis" class="input" style="min-width: 160px;">
              <option value="">Semua Jenis IML</option>
              <option value="MUAT">MUAT</option>
            </select>
            <select id="rd_filter_type" class="input" style="min-width: 160px;">
              <option value="">Semua Type</option>
              <option value="LOCAL">LOCAL</option>
            </select>
            <button id="rd_filter_btn" class="btn primary">Cari</button>
          </div>
        </div>
        
        <div class="legend-bar">
          <span class="legend-item"><b class="green">Hijau</b>: ≤ 6 jam (waktu normal)</span>
          <span class="legend-item"><b class="yellow">Kuning</b>: ≤ 24 jam (perlu perhatian)</span>
          <span class="legend-item"><b class="red">Merah</b>: > 24 jam (melebihi batas wajar)</span>
        </div>

        <div class="controls">
          </div>

        <div class="table-wrap">
          <table id="grid">
            <thead>
              <tr>
                <th>No.</th>
                <th>No IML</th>
                <th>Jenis IML</th>
                <th>Type IML</th>
                <th>Tgl Timbang 1</th>
                <th>Tgl Masuk Gudang</th>
                <th class="col-selisih">Selisih Waktu</th>
                <th>Tgl Start Muat</th>
                <th class="col-selisih">Selisih Waktu</th>
                <th>Tgl End Muat</th>
                <th class="col-selisih">Selisih Waktu</th>
                <th>Tgl Keluar Gudang</th>
                <th class="col-selisih">Selisih Waktu</th>
                <th>Tgl Timbang 2</th>
                <th class="col-selisih">Selisih Waktu</th>
                <th>Durasi Keseluruhan</th>
              </tr>
            </thead>
            <tbody id="rd_body">
              <tr><td colspan="16" class="center">Memuat data...</td></tr>
            </tbody>
          </table>
        </div>
        
        <div class="legend">
          </div>

      </div>
    </div>
  `;

  // --- LOGIC (Diperbarui) ---

  // Helper untuk menentukan warna badge
  const getBadgeClass = (timeStr) => {
    if (!timeStr) return 'diff-ok';
    try {
        const parts = timeStr.split(':').map(Number);
        const hours = parts[0] + (parts[1]/60) + (parts[2]/3600);
        if (hours > 24) return 'diff-bad'; // Merah
        if (hours > 6) return 'diff-warn'; // Kuning
        return 'diff-ok'; // Hijau
    } catch(e) {
        return 'diff-ok';
    }
  };

  // Fungsi untuk menggambar tabel
  function drawDurasiTable(data) {
    const tbody = document.getElementById("rd_body");
    if (!data.length) {
        tbody.innerHTML = `<tr><td colspan="16" class="center">Tidak ada data yang cocok dengan pencarian.</td></tr>`;
        return;
    }
    
    tbody.innerHTML = data.map(d => `
      <tr>
        <td>${d.no}</td>
        <td>${d.iml}</td>
        <td>${d.jenis}</td>
        <td>${d.type}</td>
        <td>${d.t1}</td>
        <td>${d.t2}</td>
        <td class="col-selisih"><span class="diff-badge ${getBadgeClass(d.s1)}">${d.s1}</span></td>
        <td>${d.t3}</td>
        <td class="col-selisih"><span class="diff-badge ${getBadgeClass(d.s2)}">${d.s2}</span></td>
        <td>${d.t4}</td>
        <td class="col-selisih"><span class="diff-badge ${getBadgeClass(d.s3)}">${d.s3}</span></td>
        <td>${d.t5}</td>
        <td class="col-selisih"><span class="diff-badge ${getBadgeClass(d.s4)}">${d.s4}</span></td>
        <td>${d.t6}</td>
        <td class="col-selisih"><span class="diff-badge ${getBadgeClass(d.s5)}">${d.s5}</span></td>
        <td><span class="diff-badge diff-total">${d.total}</span></td>
      </tr>
    `).join('');
  }
  
  // Update clock (logic ini sudah ada dan bagus)
  const clockEl = document.getElementById("rd_clock");
  if (clockEl) {
      const updateClock = () => {
          const now = new Date();
          const h = String(now.getHours()).padStart(2,'0');
          const m = String(now.getMinutes()).padStart(2,'0');
          const s = String(now.getSeconds()).padStart(2,'0');
          clockEl.textContent = `${h}:${m}:${s}`;
      };
      updateClock();
      const clockInterval = setInterval(updateClock, 1000);
      // Anda mungkin perlu menyimpan interval ini untuk di-clear saat render() dipanggil lagi
  }
  
  // Logic untuk toggle "Selisih Waktu"
  const toggle = document.getElementById("rd_toggle_selisih");
  const page = document.getElementById("report-durasi-page");
  if (toggle && page) {
    const applyToggle = () => {
      if (toggle.checked) {
        page.classList.remove('hide-selisih');
      } else {
        page.classList.add('hide-selisih');
      }
    };
    toggle.onchange = applyToggle;
    applyToggle(); // Terapkan state awal saat render
  }
  
  // PERBAIKAN: Event listener untuk tombol filter baru
  document.getElementById("rd_filter_btn").onclick = () => {
    const tbody = document.getElementById("rd_body");
    tbody.innerHTML = `<tr><td colspan="16" class="center">...Mencari data...</td></tr>`;

    const searchTerm = document.getElementById("rd_search").value.trim().toLowerCase();
    const jenis = document.getElementById("rd_filter_jenis").value;
    const type = document.getElementById("rd_filter_type").value;

    // Filter data
    const filteredData = dummyData.filter(d => {
      const matchIML = d.iml.toLowerCase().includes(searchTerm);
      const matchJenis = (jenis === "" || d.jenis === jenis);
      const matchType = (type === "" || d.type === type);
      return matchIML && matchJenis && matchType;
    });

    // Tunda sedikit untuk simulasi pencarian
    setTimeout(() => {
      drawDurasiTable(filteredData);
      toast(`Menampilkan ${filteredData.length} hasil.`);
    }, 250); // 250ms delay
  };

  // PERBAIKAN: Tampilkan semua data saat pertama kali dimuat
  drawDurasiTable(dummyData);
}
// ====================================================================
// AKHIR PERBAIKAN FUNGSI
// ====================================================================


// Boot
render();