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
// REVISI: Mengubah urutan Status Trucking
const STATUS_TRUCKING = [
  "Pending","Confirm Order","Reject","sudah muat","muat gudang","Revo","gate in port"
];
const VENDORS_DEFAULT = ["PT Cakraindo Mitra International","PT Argo Trans Mandiri","PT Puninar Logistics","PT Elang Transportasi Indonesia","PT Tangguh Karimata Jaya","PT BSA Logistics Indonesia","PT Inti Persada Mandiri","PT Lintas Buana Karya","PT Putra Sejahtera Sentosa","PT Lintas Marindo Nusantara","PT Glory Bahana Universal","PT Mega Samudra Transportasi","PT Trisindo","PT Bimaruna Jaya"];

const VENDOR_RANK_DATA = {
    "20ft": [
        { rank: "TOP1", name: "PT Cakraindo Mitra International" },
        { rank: "TOP1", name: "PT Argo Trans Mandiri" },
        { rank: "TOP2", name: "PT Puninar Logistics" },
        { rank: "TOP3", name: "PT Elang Transportasi Indonesia" },
        { rank: "TOP4", name: "PT Tangguh Karimata Jaya" },
        { rank: "TOP5", name: "PT BSA Logistics Indonesia" },
        { rank: "TOP6", name: "PT Inti Persada Mandiri" },
        { rank: "TOP7", name: "PT Lintas Buana Karya" },
        { rank: "TOP8", name: "PT Putra Sejahtera Sentosa" },
        { rank: "TOP9", name: "PT Lintas Marindo Nusantara" }
    ],
    "40ft/HC": [
        { rank: "TOP1", name: "PT Cakraindo Mitra International" },
        { rank: "TOP1", name: "PT Argo Trans Mandiri" },
        { rank: "TOP2", name: "PT Puninar Logistics" },
        { rank: "TOP3", name: "PT BSA Logistics Indonesia" },
        { rank: "TOP4", name: "PT Elang Transportasi Indonesia" },
        { rank: "TOP5", name: "PT Tangguh Karimata Jaya" },
        { rank: "TOP6", name: "PT Glory Bahana Universal" },
        { rank: "TOP7", name: "PT Mega Samudra Transportasi" },
        { rank: "TOP8", name: "PT Putra Sejahtera Sentosa" },
        { rank: "TOP9", name: "PT Trisindo" },
        { rank: "TOP10", name: "PT Lintas Marindo Nusantara" }
    ],
    "Combo": [
        { rank: "TOP1", name: "PT Cakraindo Mitra International" },
        { rank: "TOP1", name: "PT Argo Trans Mandiri" },
        { rank: "TOP2", name: "PT Bimaruna Jaya" },
        { rank: "TOP3", name: "PT Tangguh Karimata Jaya" },
        { rank: "TOP4", name: "PT Inti Persada Mandiri" },
        { rank: "TOP5", name: "PT Lintas Buana Karya" }
    ]
};

// BARU: Data Rate Transporter dari gambar user (Digunakan sebagai sumber Ranking baru)
const RATE_TRANSPORTER_DATA = [
    { rank: 1, name: "PT Cakraindo Mitra International", '20FT': 10, '40FT': 10, total: 20, alokasi: '12%' },
    { rank: 2, name: "PT Argo Trans Mandiri", '20FT': 2, '40FT': 5, total: 7, alokasi: '4%' },
    { rank: 3, name: "PT Puninar Logistics", '20FT': 5, '40FT': 5, total: 10, alokasi: '6%' },
    { rank: 4, name: "PT Elang Transportasi Indonesia", '20FT': null, '40FT': 5, total: 5, alokasi: '3%' },
    { rank: 5, name: "PT Bimaruna Jaya", '20FT': 10, '40FT': 20, total: 30, alokasi: '18%' },
    { rank: 6, name: "PT BSA Logistics Indonesia", '20FT': 5, '40FT': 5, total: 10, alokasi: '6%' },
    { rank: 7, name: "PT Tangguh Karimata Jaya", '20FT': 2, '40FT': 5, total: 7, alokasi: '4%' },
    { rank: 8, name: "PT Inti Persada Mandiri", '20FT': 5, '40FT': 20, total: 25, alokasi: '15%' },
    { rank: 9, name: "PT Glory Bahana Universal", '20FT': 5, '40FT': 10, total: 15, alokasi: '9%' },
    { rank: 10, name: "PT Putra Sejahtera Sentosa", '20FT': 3, '40FT': 10, total: 13, alokasi: '8%' },
    { rank: 11, name: "PT Trisindo", '20FT': null, '40FT': 5, total: 5, alokasi: '3%' },
    { rank: 12, name: "PT Lintas Marindo Nusantara", '20FT': 3, '40FT': 20, total: 23, alokasi: '14%' },
];

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

// ====================================================================
// --- REVISI 1: FORMAT TANGGAL diubah menjadi dd/mm/yyyy ---
// ====================================================================
function formatDisplayDate(isoDate) {
    if (!isoDate || typeof isoDate !== 'string' || !isoDate.includes('-')) {
        return isoDate; // Return original if invalid, null, or not a string
    }
    const parts = isoDate.split('-');
    if (parts.length !== 3) return isoDate; // Return original if format is wrong
    const [y, m, d] = parts;
    return `${d}/${m}/${y}`; // Menggunakan / sebagai pemisah
}
// ====================================================================
// --- AKHIR REVISI 1 ---
// ====================================================================

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
  active_order_for_detail:null, attachments:{}, outstanding_data:[], outstanding_files:[], // Mengubah outstanding_data/file
  show_vendor_detail_admin:false, menu_admin:"Home", menu_vendor:"Home",
  active_preview_file_id: null, active_parent_menu: "Report",
  notifications: [], 
  editing_order_id: null, 
  editing_container_id_vendor: null, 
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
const notificationBell = document.getElementById("notificationBell"); 

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
  // Hapus innerHTML lama sebelum diset baru
  if(b) b.innerHTML = ''; 
  if(b) b.innerHTML = html || '';
  
  if (closeBtn) {
    if (options.closeBtnText) {
      closeBtn.textContent = options.closeBtnText;
      closeBtn.className = `btn ${options.closeBtnClass || 'danger'}`;
      closeBtn.style.display = 'inline-flex'; 
    } else {
      closeBtn.textContent = 'Tutup';
      closeBtn.className = 'btn danger';
      closeBtn.style.display = 'inline-flex'; 
    }

    const newCloseBtn = closeBtn.cloneNode(true);
    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
    
    if (options.onClose) {
        newCloseBtn.onclick = options.onClose;
    } else {
        newCloseBtn.onclick = closeModal;
    }
  }

  m.classList.add('show'); m.setAttribute('aria-hidden','false');
  const modalBody = document.getElementById('modalBody');
  if (modalBody && options.setupListeners) {
      options.setupListeners(modalBody);
  }
}
function closeModal(){
  const m = document.getElementById('modal'); if(!m) return;
  m.classList.remove('show'); m.setAttribute('aria-hidden','true');
}
document.addEventListener('click', (e)=>{
  if(e.target && e.target.hasAttribute('data-close')) closeModal();
});

// ====================================================================
// --- BARU: FUNGSI LONCENG NOTIFIKASI (REVISI 4: BOLD/BADGE) ---
// ====================================================================
function getMyNotifications() {
    if (!state.authenticated) return [];
    // Filter notifikasi berdasarkan role atau target vendor
    return state.notifications.filter(n => 
        n.role === 'all' || 
        (n.role === state.user_role) ||
        (n.role === 'vendor' && n.targetVendor === state.vendor_name) ||
        (n.role === 'admin' && state.user_role === 'admin')
    ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function formatNotificationTime(isoTime) {
    const d = new Date(isoTime);
    const date = formatDisplayDate(toISODate(d));
    const time = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    return `${date} ${time}`;
}

function handleNotificationClick(n) {
    // TANDAI SUDAH DIBACA SEBELUM NAVIGASI
    n.isRead = true;
    saveState();
    setupNotificationBell(); // Update bell to remove badge/bolding
    toast(`Membuka Notifikasi: ${n.message.substring(0, 50)}...`);

    // Logika Navigasi
    if (state.user_role === 'admin') {
        if (n.relatedOrder) {
            state.menu_admin = 'Status Truck'; // Navigasi ke Status Truck
        } else if (n.message.includes('memperbarui ketersediaan')) {
            state.menu_admin = 'Home';
            state.selected_date_admin = todayStr(); 
        } else if (n.message.includes('Data Outstanding')) {
            state.menu_admin = 'Data Outstanding';
        }
    } else if (state.user_role === 'vendor') {
        if (n.message.includes('Order baru') || n.message.includes('BC/SI')) {
            state.menu_vendor = 'Orderan';
            if(n.relatedOrder) state.active_order_for_detail = n.relatedOrder;
        } else if (n.message.includes('GATE IN PORT') || n.message.includes('Rejected')) {
            state.menu_vendor = 'List Orderan (Add Detail)';
        }
    }
    render();
}

function setupNotificationBell() {
    const bell = document.getElementById('notificationBell');
    const content = document.getElementById('notificationContent');
    // Cek keberadaan elemen
    if (!bell || !content || !state.authenticated) {
        if(bell) bell.style.display = 'none';
        return;
    }

    bell.style.display = 'flex'; 

    const myNotifs = getMyNotifications();
    const unreadCount = myNotifs.filter(n => !n.isRead).length;

    // Update Badge
    let badge = bell.querySelector('.badge');
    if (unreadCount > 0) {
        if (!badge) {
            badge = document.createElement('span');
            badge.classList.add('badge');
            bell.appendChild(badge);
        }
        badge.textContent = unreadCount;
    } else if (badge) {
        if(bell.contains(badge)) bell.removeChild(badge);
    }

    // Update Content
    content.innerHTML = `<h4>🔔 Notifikasi (${unreadCount} Baru)</h4>`;
    
    if (myNotifs.length === 0) {
        content.innerHTML += `<div class="notification-item" style="color: ${getComputedStyle(document.body).getPropertyValue('--muted')}; text-align: center;">Tidak ada notifikasi baru.</div>`;
    }

    myNotifs.forEach(n => {
        const item = document.createElement('div');
        item.classList.add('notification-item');
        // KORREKSI 4: Kontrol font-weight berdasarkan isRead
        item.innerHTML = `
            <span class="message" style="${!n.isRead ? 'font-weight: 700;' : 'font-weight: 500;'}" title="${n.message}">${n.message}</span>
            <span class="time">${formatNotificationTime(n.timestamp)}</span>
        `;
        item.onclick = (e) => {
            e.stopPropagation(); 
            handleNotificationClick(n);
        };
        content.appendChild(item);
    });

    // Toggle logic
    let isContentVisible = false;
    bell.onclick = (e) => {
        e.stopPropagation();
        isContentVisible = !isContentVisible;
        if (isContentVisible) {
            content.classList.add('show');
            // Tandai SEMUA notifikasi yang sedang ditampilkan sebagai dibaca saat dibuka
            myNotifs.filter(n => !n.isRead).forEach(n => n.isRead = true);
            saveState();
            // Re-render bell untuk hapus badge dan bold
            setTimeout(() => setupNotificationBell(), 100); 
        } else {
            content.classList.remove('show');
        }
    };
    
    // Klik di luar content untuk menutup
    document.addEventListener('click', (e) => {
        if (bell.contains(e.target) || content.contains(e.target)) return;
        if (content.classList.contains('show')) {
            content.classList.remove('show');
            isContentVisible = false;
        }
    });
}
// ====================================================================
// --- AKHIR BARU: FUNGSI LONCENG NOTIFIKASI (REVISI 4) ---
// ====================================================================


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
  
  setupNotificationBell();

  if(!state.authenticated){
    if (sidebarEl) sidebarEl.style.display = 'none';
    document.body.classList.add('login-only');
    return renderLogin();
  }
  renderSidebar();
  document.body.classList.remove('login-only'); 
  if (sidebarEl) sidebarEl.style.display = ''; 
  if(state.user_role==="admin"){
    switch(state.menu_admin){
      case "Home": return renderAdminHome();
      case "Order to EMKL": return renderAdminOrder();
      case "Status Truck": return renderAdminStatus();
      case "Data Outstanding": return renderOutstanding();
      case "Rate Transporter": return renderRateTransporter(); 
      case "Port": return renderPort();
      case "BOC": return renderReport();
      case "DCR": return renderDCR();
      case "DDCR": return renderDDCR();
      case "Container Revo": return renderContainerRevo(); 
      case "Report Durasi": return renderReportDurasi(); 
      case "Performa Vendor": return renderReportPerformaVendor(); 
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
    let pendingOrderCount = 0;
    if (state.user_role === 'vendor') {
        pendingOrderCount = state.orders
            .filter(o => o.vendor === state.vendor_name)
            .filter(o => o.summary_status === 'Pending' || o.summary_status === 'Partial')
            .length;
    }

    const itemsAdmin = [
        { icon: "🏠", text: "Home" },
        { icon: "📦", text: "Order to EMKL" },
        { icon: "🚛", text: "Status Truck" },
        { icon: "🧾", text: "Data Outstanding" },
        { icon: "💰", text: "Rate Transporter" },
        { icon: "🚢", text: "Port" },
        { 
            icon: "📊", 
            text: "Report",
            children: [
                { icon: "📄", text: "BOC" },
                { icon: "📑", text: "DCR" },
                { icon: "📋", text: "DDCR" },
                { icon: "🔄", text: "Container Revo" }, 
                { icon: "⏱️", text: "Report Durasi" },
                { icon: "📈", text: "Performa Vendor" }
            ]
        }
    ];

    const itemsVendor = [
        { icon: "🏠", text: "Home" },
        { icon: "📑", text: "Orderan", badge: pendingOrderCount }, 
        { icon: "📋", text: "List Orderan (Add Detail)" }
    ];

  const items = state.user_role==="admin" ? itemsAdmin : itemsVendor;
  const currentMenu = state.user_role === "admin" ? state.menu_admin : state.menu_vendor;
  
  let menuHtml = "";
  items.forEach(item => {
    if (!item.children) {
      const active = currentMenu === item.text ? "active" : "";
      const badgeHtml = item.badge > 0 ? `<span class="badge-count">${item.badge}</span>` : ''; 
      menuHtml += `<button class="menu-item ${active}" data-menu="${item.text}">
                      <span class="icon">${item.icon}</span>
                      <span class="text">${item.text}</span>
                      ${badgeHtml}
                   </button>`;
    } else {
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
  
  menuBox.querySelectorAll(".menu-item").forEach(btn=>{
    if (btn.dataset.parentMenu) {
      btn.onclick = () => {
        const menuName = btn.dataset.parentMenu;
        state.active_parent_menu = state.active_parent_menu === menuName ? null : menuName;
        saveState();
        renderSidebar(); 
      };
    } else {
      btn.onclick = ()=>{
        const v = btn.dataset.menu;
        if(state.user_role==="admin") {
            state.menu_admin = v;
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
  else if(pen>0 && acc>0 || pen>0 && rej>0) status="Partial";
  else if(rej > 0 && acc === 0 && pen === 0) status="Rejected";
  else if(pen > 0 && acc === 0 && rej === 0) status="Pending";

  const o = state.orders.find(x=>x.order_id===orderId);
  if(o){ o.summary_status = status; saveState(); }
}
function attachFile(orderId, key, file){
  const reader = new FileReader();
  reader.onload = () => {
    state.attachments[orderId] = state.attachments[orderId] || {};
    state.attachments[orderId][key] = {name:file.name, dataUrl:reader.result};
    
    const order = state.orders.find(x=>x.order_id===orderId);
    if (order) {
        const fileType = key === 'booking_confirmation' ? 'BC' : 'SI';
        const newNotif = {
            id: genId("NOTIF"),
            message: `Admin telah mengunggah ${fileType} untuk DN ${order.no_dn.join(' & ')}.`,
            timestamp: new Date().toISOString(),
            isRead: false,
            role: 'vendor',
            targetVendor: order.vendor,
            relatedOrder: orderId,
            link: 'Orderan'
        };
        state.notifications.push(newNotif);
    }
    
    saveState(); render();
    toast(`${key==='booking_confirmation'?'BC':'SI'} tersimpan.`);
  };
  reader.readAsDataURL(file);
}
function downloadDataUrl(name, dataUrl){
  const a = document.createElement("a");
  a.href = dataUrl; a.download = name; a.click();
}

function sendEmailToVendor(orderId) {
    const order = state.orders.find(x => x.order_id === orderId);
    if (!order) {
        toast("Order tidak ditemukan.");
        return;
    }

    const attachments = state.attachments[orderId] || {};
    const hasBC = attachments.booking_confirmation;
    const hasSI = attachments.si;

    if (!hasBC && !hasSI) {
        toast("Tidak ada BC atau SI yang di-upload untuk dikirim.");
        return;
    }

    const vendorEmail = Object.keys(ACCOUNTS).find(email => ACCOUNTS[email].vendor === order.vendor);
    if (!vendorEmail) {
        toast(`Email untuk EMKL ${order.vendor} tidak ditemukan.`);
        return;
    }

    const subject = `Order Trucking - DN ${order.no_dn.join(' & ')} | Stuffing ${formatDisplayDate(order.tgl_stuffing)}`;
    const body = `
Kepada Tim ${order.vendor},

Terlampir adalah dokumen untuk Order Trucking dengan detail sebagai berikut:

No. DN: ${order.no_dn.join(' / ')}
Tanggal Stuffing: ${formatDisplayDate(order.tgl_stuffing)}
Closing CY: ${fmtDT(order.closing_date, order.closing_time)}
Shipping Point: ${order.shipping_point}
Container: 20ft (${order.jml_20ft || 0}), 40ft/HC (${order.jml_40ft || 0}), Combo (${order.jml_combo || 0})

Harap segera proses order ini.

Terima kasih,
Admin Trucking Planner

Lampiran: 
- ${hasBC ? `Booking Confirmation (${attachments.booking_confirmation.name})` : 'Tidak ada BC'}
- ${hasSI ? `Shipping Instruction (${attachments.si.name})` : 'Tidak ada SI'}
    `;

    console.log("SIMULASI EMAIL TERKIRIM:");
    console.log(`To: ${vendorEmail}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    
    state.notifications.push({
        id: genId("NOTIF"),
        message: `Email BC/SI untuk DN ${order.no_dn.join(' & ')} berhasil dikirim ke ${order.vendor}.`,
        timestamp: new Date().toISOString(),
        isRead: false,
        role: 'admin',
        relatedOrder: orderId
    });
    
    toast(`Email order DN ${order.no_dn.join(' & ')} berhasil disimulasikan terkirim!`);
    saveState();
}

const TERMINAL_OPTIONS = ["JICT", "NPCT", "KOJA", "TMAL", "IPC"];
function buildTerminalSelect(id, currentValue) {
    const options = TERMINAL_OPTIONS.map(opt => 
        `<option value="${opt}" ${opt === currentValue ? 'selected' : ''}>${opt}</option>`
    ).join('');
    return `<select id="${id}" class="input">${options}</select>`;
}


function buildRankTable(containerType, title, showDate) {
    const avail = state.availability[showDate] || {}; 
    
    // REVISI 2: Gunakan RATE_TRANSPORTER_DATA sebagai basis ranking
    const rankedList = RATE_TRANSPORTER_DATA
        .map(item => ({ 
            rank: item.rank, 
            name: item.name, 
            ketersediaan: Number(avail[item.name] ? (avail[item.name][containerType] || 0) : 0),
            totalAlokasi: item.total 
        }))
        .filter(item => item.ketersediaan > 0);

    rankedList.sort((a, b) => a.rank - b.rank);
    
    let rowsHtml = "";
    
    rankedList.forEach(item => {
        rowsHtml += `<tr>
                        <td style="width: 80px;">TOP ${item.rank}</td>
                        <td>${item.name}</td>
                        <td style="text-align: center; width: 120px;">${item.ketersediaan}</td>
                        <td style="text-align: center; width: 100px;">
                            <button class="btn secondary tiny" data-prefill="${item.name}">Order</button>
                        </td>
                    </tr>`;
    });

    if (rankedList.length === 0) {
        return `<h4 style="margin: 10px 0 5px 0;">${title}</h4><div class="small muted" style="padding: 10px; border: 1px solid var(--border); border-radius: 8px; background: #f9fafb;">Tidak ada EMKL yang mengisi ketersediaan untuk jenis ${title} ini.</div>`;
    }

    return `
        <h4 style="margin: 10px 0 5px 0;">${title}</h4>
        <div class="table-wrap no-scroll-internal">
          <table class="table">
              <thead>
                  <tr>
                      <th>Rank</th>
                      <th>EMKL</th>
                      <th style="text-align: center;">Ketersediaan</th>
                      <th style="text-align: center;">Aksi</th>
                  </tr>
              </thead>
              <tbody>
                  ${rowsHtml}
              </tbody>
          </table>
        </div>
    `;
}
/* ===================== ADMIN: HOME (Kalender) ===================== */

function showStatusDetailsModal(status) {
    const targetStatus = status.toLowerCase();
    const filteredContainers = [];
    
    for (const orderId in state.containers) {
        const order = state.orders.find(o => o.order_id === orderId);
        if (!order) continue;

        (state.containers[orderId] || []).forEach(c => {
            const currentStatus = (c.status || 'Confirm Order').toLowerCase();
            const containerIsRelevant = (
                (targetStatus === 'pending' && (c.accept === null)) ||
                (targetStatus === 'reject' && c.accept === false) ||
                (targetStatus !== 'pending' && targetStatus !== 'reject' && c.accept === true && currentStatus === targetStatus) ||
                (targetStatus === 'confirm order' && c.accept === true && currentStatus === 'confirm order')
            );

            if (containerIsRelevant) {
                let displayStatus;
                if (targetStatus === 'pending' && c.accept === null) {
                    displayStatus = 'Pending Respon';
                } else if (targetStatus === 'reject' && c.accept === false) {
                    displayStatus = 'Rejected';
                } else {
                    displayStatus = c.status || 'Confirm Order';
                }
                
                filteredContainers.push({
                    dn: (order.no_dn || []).join(' / '),
                    vendor: order.vendor,
                    size: c.size,
                    containerNo: c.no_container || '-',
                    status: displayStatus,
                    noMobil: c.no_mobil || '-'
                });
            }
        });
    }

    if (filteredContainers.length === 0) {
        toast(`Tidak ada kontainer dengan status '${status}'.`);
        return;
    }

    let tableRows = filteredContainers.map((r, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${r.dn}</td>
            <td>${r.vendor}</td>
            <td>${r.size}</td>
            <td>${r.containerNo}</td>
            <td>${r.noMobil}</td>
            <td style="font-weight:700; color: ${r.status.toLowerCase().includes('reject') || r.status.toLowerCase().includes('revo') ? 'var(--red)' : 'var(--ink)'};">${r.status}</td>
        </tr>
    `).join('');

    const modalTitle = `Detail Status: ${status}`;
    const modalHtml = `
        <div class="table-wrap" style="max-height: 60vh; overflow-y: auto;">
            <table class="table compact" style="width: 100%;">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>DN</th>
                        <th>EMKL</th>
                        <th>Size</th>
                        <th>Container No.</th>
                        <th>Plat Mobil</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </div>
    `;
    
    openModal(modalTitle, modalHtml);
}


function buildStatusDashboardInner(){
  const counts = {};
  const displayStatuses = ["Pending", "Confirm Order", "Reject", "sudah muat", "muat gudang", "Revo", "gate in port"];
  displayStatuses.forEach(s => counts[s] = 0);
  
  for (const oid in state.containers){
    const items = state.containers[oid] || [];
    
    items.forEach(r => {
        
        if (r.accept === null) {
             counts["Pending"]++;
             return;
        }

        if(r.accept === false) {
            counts["Reject"]++;
            return;
        }

        if(r.accept === true) {
            const savedStatus = (r.status || 'Confirm Order').toLowerCase();
            const correctKey = displayStatuses.find(k => k.toLowerCase() === savedStatus);

            if (correctKey && correctKey !== "Pending" && correctKey !== "Reject") {
                counts[correctKey] = (counts[correctKey] || 0) + 1;
            } else if (correctKey === "Confirm Order") {
                 counts["Confirm Order"] = (counts["Confirm Order"] || 0) + 1;
            }
        }
    });
  }

  let html = '<div class="row" id="dashboard-status-rows">';
  
  displayStatuses.forEach(s => {
      const val = counts[s] || 0;
      const displayStatus = s.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      
      html += `
        <div class="col" style="grid-column: span 1.71;"> 
          <div class="stat-card" data-status-key="${displayStatus}" style="${val > 0 ? 'border-color: var(--blue-2);' : ''}">
            <div class="stat-num">${val}</div>
            <div class="stat-label">${displayStatus}</div>
          </div>
        </div>`;
  });
  
  html += '</div>';
  return html;
}

function buildVendorPerformanceCard(isReportView = false){
  let data = VENDORS_DEFAULT.map(v => {
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
    
    return { name: v, accept: acc, reject: rej, total: total, performa: perf };
  });

  let rows = data.map(item => {
    return `<tr>
      <td>${item.name}</td>
      <td class="center">${item.accept}</td>
      <td class="center">${item.reject}</td>
      <td class="perf-small center">${item.performa}%</td>
    </tr>`;
  }).join("");

  return {
      html: `
        <div class="card" style="padding: 0;">
          <div class="table-wrap no-scroll"> <table class="table small-table">
              <thead>
                <tr><th>EMKL</th><th class="center">Accept</th><th class="center">Reject</th><th class="center">Performa</th></tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>`,
      data: data
  };
}


function getDnAndContainerCounts() {
    const todayISO = todayStr();
    const now = new Date();
    
    const count = { dn_today: 0, dn_monthly: 0, dn_overall: 0, cont_today: 0, cont_monthly: 0, cont_overall: 0 };

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);
    oneMonthAgo.setHours(0, 0, 0, 0); 

    const dnFinal = { today: new Set(), monthly: new Set(), overall: new Set() };
    let processedContainers = { today: 0, monthly: 0, overall: 0 }; 

    state.orders.forEach(order => {
        const createdAt = order.created_at ? new Date(order.created_at) : parseISODate(order.tgl_stuffing);
        const orderDateISO = toISODate(createdAt);
        const dnKey = order.order_id; 

        dnFinal.overall.add(dnKey);
        if (createdAt >= oneMonthAgo) dnFinal.monthly.add(dnKey);
        if (orderDateISO === todayISO) dnFinal.today.add(dnKey);
        
        const containers = state.containers[order.order_id] || [];
        containers.forEach(container => {
            processedContainers.overall++;
            if (createdAt >= oneMonthAgo) {
                processedContainers.monthly++;
            }
            if (orderDateISO === todayISO) {
                processedContainers.today++;
            }
        });
    });
    
    count.dn_today = dnFinal.today.size;
    count.dn_monthly = dnFinal.monthly.size;
    count.cont_today = processedContainers.today;
    count.cont_monthly = processedContainers.monthly;
    count.cont_overall = processedContainers.overall;
    count.dn_overall = dnFinal.overall.size;

    return count;
}


function buildCountDashboard() {
    const counts = getDnAndContainerCounts();
    
    return `
        <div class="row" style="margin: 16px;">
          <div class="col" style="grid-column: span 6;">
            <div class="card count-card">
              <h3 style="margin:0 0 10px 0">Count DN</h3>
              <div class="row">
                ${['today', 'monthly', 'overall'].map(period => `
                  <div class="col">
                    <div class="stat-card" style="border-color: #fee2e2; padding: 15px 10px;">
                      <div class="stat-num" style="font-size: 2rem; color: var(--ink);">${counts[`dn_${period}`]}</div>
                      <div class="stat-label" style="font-weight: 600; color: #92400e; background-color: #fef3c7; padding: 2px 6px; border-radius: 4px; display: block; width: fit-content; margin: 0 auto;">${period.charAt(0).toUpperCase() + period.slice(1)}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
          <div class="col" style="grid-column: span 6;">
            <div class="card count-card">
              <h3 style="margin:0 0 10px 0">Count Container</h3>
              <div class="row">
                ${['today', 'monthly', 'overall'].map(period => `
                  <div class="col">
                    <div class="stat-card" style="border-color: #fee2e2; padding: 15px 10px;">
                      <div class="stat-num" style="font-size: 2rem; color: var(--ink);">${counts[`cont_${period}`]}</div>
                      <div class="stat-label" style="font-weight: 600; color: var(--blue-2); background-color: var(--blue-light); padding: 2px 6px; border-radius: 4px; display: block; width: fit-content; margin: 0 auto;">${period.charAt(0).toUpperCase() + period.slice(1)}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
    `;
}


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
      const dash = `<div class="card"><h3 style="margin:0 0 10px 0">📊 Dashboard Status</h3>${buildStatusDashboardInner()}</div>`;
      headerEl.insertAdjacentHTML('afterend', dash);
      
      const countDash = buildCountDashboard();
      document.querySelector('.card:has(.stat-card)').insertAdjacentHTML('afterend', countDash);

      document.getElementById('dashboard-status-rows').querySelectorAll('.stat-card').forEach(card => {
          card.onclick = () => showStatusDetailsModal(card.dataset.statusKey);
      });
      
    }
  }catch(e){ console.warn('Dashboard inject fail', e); }

  const mSel = document.getElementById("home_month");
  for(let i=1;i<=12;i++){ const opt=document.createElement("option"); opt.value=i; opt.textContent=new Date(2000,i-1,1).toLocaleString('id-ID',{month:'long'}); if(i===month) opt.selected=true; mSel.appendChild(opt); }
  
  const currentYear = new Date().getFullYear();
  const startYear = Math.max(currentYear, 2025); 
  const ySel = document.getElementById("home_year");
  for(let y=startYear-1;y<=startYear+1;y++){ 
    if (y < 2025) continue;
    const opt=document.createElement("option"); 
    opt.value=y; 
    opt.textContent=y; 
    if(y===year) opt.selected=true; 
    ySel.appendChild(opt); 
  }

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
        cell.innerHTML = `<div class="cal-num">${d}</div><div class="labels">20ft = ${sums.total20}<br>40ft/HC = ${sums.total40}<br>Combo = ${sums.totalCombo}</div><button class="btn pick" data-pick="${s}">Pilih</button>`;
        row.appendChild(cell);
      });
      body.appendChild(row);
    });
  }
  drawCalendar(year, month);
  
  const _pickBtns = document.querySelectorAll('#calBody button[data-pick]');
  _pickBtns.forEach(btn=>{
    btn.onclick = (e)=>{
      e.stopPropagation(); 
      const date = btn.dataset.pick;
      state.selected_date_admin = date;

      const table20ft = buildRankTable("20ft", "20ft", date);
      const table40ft = buildRankTable("40ft/HC", "40ft/HC", date);
      const tableCombo = buildRankTable("Combo", "Combo", date);
        
      const allHtml = table20ft + table40ft + tableCombo;
      
      const avail = state.availability[date] || {};
      const vendorsWithAvail = VENDORS_DEFAULT.filter(v => {
          const r = avail[v];
          if (!r) return false;
          return (Number(r["20ft"]||0) + Number(r["40ft/HC"]||0) + Number(r["Combo"]||0)) > 0;
      });

      const html = `<div class="table-wrap-modal">
          ${allHtml}
          ${vendorsWithAvail.length === 0 ? 
            `<div class="small empty">Belum ada EMKL yang mengisi ketersediaan pada tanggal <b>${formatDisplayDate(date)}</b>.</div>` 
            : ''
          }
      </div>`;

      const setupModalListeners = (modalBody) => {
          modalBody.querySelectorAll("button[data-prefill]").forEach(b => {
              b.onclick = (event) => {
                  event.stopPropagation(); 
                  const prefillVendor = b.dataset.prefill;
                  state.order_vendor_prefill = prefillVendor;
                  closeModal();
                  state.menu_admin = 'Order to EMKL';
                  saveState();
                  render();
                  toast(`Prefill EMKL: ${prefillVendor}`);
              };
          });
      };
      
      openModal(`Ketersediaan — ${formatDisplayDate(date)}`, html, {
        closeBtnText: 'Lanjut Order',
        closeBtnClass: 'cta',
        onClose: () => {
             const modalBody = document.getElementById('modalBody');
             const firstPrefillBtn = modalBody ? modalBody.querySelector("button[data-prefill]") : null;
             
             if(firstPrefillBtn) {
                 const firstVendor = firstPrefillBtn.dataset.prefill;
                 state.order_vendor_prefill = firstVendor;
                 toast(`Prefill EMKL: ${firstVendor}`);
             } else {
                 state.order_vendor_prefill = null;
                 toast("Tidak ada EMKL dengan ketersediaan. Lanjut ke halaman Order.");
             }
             
             closeModal();
             state.menu_admin = 'Order to EMKL';
             saveState();
             render();
        },
        setupListeners: setupModalListeners 
      });
    };
  });

  mSel.onchange = ()=>{ 
    const y=Number(ySel.value), m=Number(mSel.value); 
    state.selected_date_admin = toISODate(new Date(y,m-1,1)); 
    saveState(); 
    renderAdminHome(); 
  };
  ySel.onchange = ()=>{ 
    const y=Number(ySel.value), m=Number(mSel.value); 
    state.selected_date_admin = toISODate(new Date(y,m-1,1)); 
    saveState(); 
    renderAdminHome(); 
  };

  if(state.show_vendor_detail_admin){
    const target = state.selected_date_admin;
    const avail = state.availability[target] || {};
    let rows = VENDORS_DEFAULT.map(v=>{
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
      <div id="availTableContainer" style="margin-top: 8px;"></div>
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
          <div class="span-3">
            <label>Open CY</label>
            <input id="order_open_cy" type="date" class="input" value="${showDate}">
          </div>
          <div class="span-3">
            <label>Tanggal Closing</label>
            <input id="order_closing_date" type="date" class="input" placeholder="dd/mm/yyyy">
          </div>
          <div class="span-3">
            <label>Jam Closing</label>
            <input id="order_closing_time" type="time" class="input" placeholder="--:--">
          </div>
          <div class="span-3">
            <label>ETD (Estimasi)</label>
            <input id="order_etd" type="date" class="input">
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
              <th class="acc" style="min-width: 65px;">Accept</th> <th class="rej" style="min-width: 65px;">Reject</th> <th>BC</th>
              <th>SI</th>
            </tr>
          </thead>
          <tbody id="rekapBody"></tbody>
        </table>
      </div>
    </div>
  `;
  const availContainer = document.getElementById("availTableContainer");
  
  const table20ft = buildRankTable("20ft", "20ft", showDate);
  const table40ft = buildRankTable("40ft/HC", "40ft/HC", showDate);
  const tableCombo = buildRankTable("Combo", "Combo", showDate);

  const allHtml = table20ft + table40ft + tableCombo;
  
  if (allHtml.includes("<tr>") === false) {
       availContainer.innerHTML = `<div style="padding:1rem; text-align:center; color: var(--muted);">Tidak ada EMKL yang mengisi ketersediaan pada tanggal ini.</div>`;
  } else {
       availContainer.innerHTML = allHtml;
  }
  
  availContainer.querySelectorAll("button[data-prefill]").forEach(b=>{
    b.onclick = ()=>{ state.order_vendor_prefill = b.dataset.prefill; saveState(); renderAdminOrder(); toast(`Prefill EMKL: ${b.dataset.prefill}`); };
  });

  const isComboCheckbox = document.getElementById('order_is_combo');
  const dnComboExtraDiv = document.getElementById('dn_combo_extra');
  const j20Input = document.getElementById('order_j20');
  const j40Input = document.getElementById('order_j40');
  const jComboInput = document.getElementById('order_jCombo');
  
  isComboCheckbox.checked = false;
  dnComboExtraDiv.style.display = 'none';

  isComboCheckbox.addEventListener('change', e => {
    const isChecked = e.target.checked;
    dnComboExtraDiv.style.display = isChecked ? 'block' : 'none';
    
    if (isChecked) {
        jComboInput.value = '1';
        j20Input.value = '0';
        j40Input.value = '0';
    } else {
        jComboInput.value = '0';
    }
  });

  j20Input.addEventListener('input', e => {
      if (Number(e.target.value) > 0) {
          isComboCheckbox.checked = false;
          dnComboExtraDiv.style.display = 'none';
          jComboInput.value = '0';
      }
  });
  j40Input.addEventListener('input', e => {
      if (Number(e.target.value) > 0) {
          isComboCheckbox.checked = false;
          dnComboExtraDiv.style.display = 'none';
          jComboInput.value = '0';
      }
  });
  jComboInput.addEventListener('input', e => {
      if (Number(e.target.value) > 0) {
          if (!isComboCheckbox.checked) {
              isComboCheckbox.checked = true;
              dnComboExtraDiv.style.display = 'block';
          }
          j20Input.value = '0';
          j40Input.value = '0';
      } else if (Number(e.target.value) == 0 && isComboCheckbox.checked) {
          isComboCheckbox.checked = false;
          dnComboExtraDiv.style.display = 'none';
      }
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
    const isCombo = isComboCheckbox.checked;
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
    const etd = document.getElementById("order_etd").value;
    let j20 = Number(j20Input.value||0);
    let j40 = Number(j40Input.value||0);
    let jCombo = Number(jComboInput.value||0);

    if (isCombo) {
        j20 = 0; j40 = 0; jCombo = Math.max(jCombo, 1);
    } else {
        jCombo = 0;
    }

    const remarks = document.getElementById("order_remarks").value.trim();

    if(j20+j40+jCombo===0){ toast("Minimal pesan 1 container."); return; }
    
    const totalContainersToOrder = j20 + j40 + jCombo;
    if (totalContainersToOrder > 0) {
        const avForDate = state.availability[tgl_stuff] || {};
        const vendorAv = avForDate[vendor] || {"20ft":0,"40ft/HC":0, "Combo":0};
        const hasAny = Number(vendorAv["20ft"]||0) + Number(vendorAv["40ft/HC"]||0) + Number(vendorAv["Combo"]||0) > 0;
        if(!hasAny){ toast(`EMKL ${vendor} belum mengisi ketersediaan untuk ${tgl_stuff}.`); return; }
        const avail20 = Number(vendorAv["20ft"]||0), avail40 = Number(vendorAv["40ft/HC"]||0), availCombo = Number(vendorAv["Combo"]||0);
        if(j20 > avail20){ toast(`Jumlah 20ft dipesan (${j20}) > ketersediaan (${avail20}).`); return; }
        if(j40 > avail40){ toast(`Jumlah 40ft/HC dipesan (${j40}) > ketersediaan (${avail40}).`); return; }
        if(jCombo > availCombo){ toast(`Jumlah Combo dipesan (${jCombo}) > ketersediaan (${availCombo}).`); return; }
    }


    const oid = genId("ORD");
    const order = {
      order_id: oid, vendor, tgl_stuffing: tgl_stuff, closing_date, closing_time,
      open_cy, no_dn, shipping_point, pod, terminal, depo, remarks,
      etd,
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
    
    const totalContainers = j20 + j40 + jCombo;
    state.notifications.push({
        id: genId("NOTIF"),
        message: `Order baru DN ${order.no_dn.join(' & ')} (${totalContainers} kontainer) masuk dari Indah Kiat Karawang.`,
        timestamp: new Date().toISOString(),
        isRead: false,
        role: 'vendor',
        targetVendor: vendor,
        relatedOrder: oid,
        link: 'Orderan'
    });
    
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
        
        const rejectedCount = (state.containers[o.order_id] || []).filter(c => c.accept === false).length;
        const isRejected = rejectedCount > 0;
        
        const isPending = o.summary_status === "Pending";
        let rowClass = '';
        if (isPending) {
            rowClass = 'class="row-pending"';
        } else if (isRejected) {
             rowClass = 'class="row-danger" style="background-color: #fee2e2;"';
        }

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
        
        const dnArray = o.no_dn || [];
        const isComboOrder = o.jml_combo > 0;

        const dnHtml = isEditing 
            ? (isComboOrder ? 
                `<textarea id="edit_dn_${o.order_id}" class="input" style="height: 40px; line-height: 1.2; padding: 6px; resize:none;">${dnArray.join('\n')}</textarea>` :
                `<input type="text" id="edit_dn_${o.order_id}" class="input" value="${dnArray[0] || ''}">`)
            : dnArray.join('<br>');

        if (containerTypes.length > 0) {
            containerTypes.forEach((sz, i) => {
                const {total, acc, rej} = agg(sz);
                html += `<tr ${rowClass}>`;
                if (i === 0) {
                    html += `
                        <td rowspan="${rowSpan}">${idx + 1}</td>
                        <td rowspan="${rowSpan}">${dnHtml}</td>
                        <td rowspan="${rowSpan}">${o.vendor}</td>
                        <td rowspan="${rowSpan}">${isEditing ? `<input type="date" id="edit_tglstuff_${o.order_id}" value="${o.tgl_stuffing}">` : formatDisplayDate(o.tgl_stuffing)}</td>
                        <td rowspan="${rowSpan}">${isEditing ? `<input id="edit_shippoint_${o.order_id}" value="${o.shipping_point}">` : o.shipping_point}</td>
                        <td rowspan="${rowSpan}">${isEditing ? `<input id="edit_pod_${o.order_id}" value="${o.pod || ''}">` : o.pod || '-'}</td>
                        <td rowspan="${rowSpan}">${isEditing ? buildTerminalSelect(`edit_terminal_${o.order_id}`, o.terminal) : o.terminal || '-'}</td>
                        <td rowspan="${rowSpan}">${isEditing ? `<input id="edit_depo_${o.order_id}" value="${o.depo || ''}">` : o.depo || '-'}</td>
                        <td rowspan="${rowSpan}">${isEditing ? `<input type="date" id="edit_opency_${o.order_id}" value="${o.open_cy || ''}">` : (o.open_cy ? formatDisplayDate(o.open_cy) : '-')}</td>
                        <td rowspan="${rowSpan}">${isEditing ? `
                            <div class="closing-dt-wrap">
                                <input type="date" id="edit_closingdate_${o.order_id}" class="input" value="${o.closing_date || ''}">
                                <input type="time" id="edit_closingtime_${o.order_id}" class="input" value="${o.closing_time || ''}">
                            </div>` : fmtDT(o.closing_date, o.closing_time)}</td>`;
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
                                    <button class="btn success tiny" data-save-id="${o.order_id}">Save</button>
                                    <button class="btn secondary tiny" data-cancel-edit-id="${o.order_id}">Batal</button>
                                </div>
                            ` : `
                                <div>
                                    <button class="btn warn tiny" data-edit-id="${o.order_id}">Edit</button>
                                    <button class="btn danger tiny" data-cancel-order-id="${o.order_id}">Cancel</button>
                                </div>
                            `}
                        </td>`;
                }
                html += `</tr>`;
            });
        } else {
             html += `<tr class="row-empty"><td colspan="18">Order ini tidak memiliki detail container.</td></tr>`;
        }
    });
    tbody.innerHTML = html;


    state.orders.forEach(o=>{
      const att = state.attachments[o.order_id]||{};
      const bcCell = document.getElementById(`bc_${o.order_id}`);
      if(!bcCell) return;
      bcCell.innerHTML = "";
      if(att.booking_confirmation){
        const a = document.createElement("button"); a.className="btn success"; a.textContent="✔ BC";
        a.onclick = ()=> downloadDataUrl(att.booking_id, att.booking_confirmation.dataUrl);
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
        sendEmailToVendor(oid);
      };
    });

    tbody.querySelectorAll('button[data-edit-id]').forEach(btn => {
        btn.onclick = () => {
            state.editing_order_id = btn.dataset.editId;
            saveState();
            buildRekap();
        };
    });
    
    tbody.querySelectorAll('button[data-cancel-edit-id]').forEach(btn => {
        btn.onclick = () => {
            state.editing_order_id = null;
            saveState();
            buildRekap();
        };
    });
    
    tbody.querySelectorAll('button[data-cancel-order-id]').forEach(btn => {
        btn.onclick = () => {
            const orderId = btn.dataset.cancelOrderId;
            const order = state.orders.find(o => o.order_id === orderId);

            if (confirm(`Apakah Anda yakin ingin melakukan CANCEL ORDER untuk DN: ${(order.no_dn || []).join(' & ')}? Aksi ini akan me-REJECT semua kontainer.`)) {
                if (order) {
                    state.containers[orderId] = (state.containers[orderId] || []).map(c => ({
                        ...c,
                        accept: false,
                        status: 'Reject',
                        no_container: "", no_seal: "", no_mobil: "", nama_supir: "", contact: "", depo: ""
                    }));
                    
                    updateOrderSummary(orderId);
                    
                    state.notifications.push({
                        id: genId("NOTIF"),
                        message: `Admin telah melakukan CANCEL ORDER (Reject) untuk DN ${order.no_dn.join(' & ')}.`,
                        timestamp: new Date().toISOString(),
                        isRead: false,
                        role: 'vendor',
                        targetVendor: order.vendor,
                        relatedOrder: orderId,
                        link: 'Orderan'
                    });

                    state.editing_order_id = null;
                    saveState();
                    buildRekap();
                    toast(`Order DN ${(order.no_dn || []).join(' & ')} berhasil di-CANCEL (Rejected).`);
                }
            } 
        };
    });
    
    tbody.querySelectorAll('button[data-save-id]').forEach(btn => {
        btn.onclick = () => {
            const orderId = btn.dataset.saveId;
            const orderToUpdate = state.orders.find(o => o.order_id === orderId);
            if (orderToUpdate) {
                const dnInputEl = document.getElementById(`edit_dn_${orderId}`);
                let dnValue = '';
                
                if (dnInputEl) {
                    if (dnInputEl.tagName === 'INPUT') {
                        dnValue = dnInputEl.value.trim();
                        orderToUpdate.no_dn = dnValue ? [dnValue] : [];
                    } else if (dnInputEl.tagName === 'TEXTAREA') {
                        dnValue = dnInputEl.value.trim();
                        orderToUpdate.no_dn = dnValue.split('\n').filter(dn => dn.trim() !== '');
                    }
                }
                
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

function showFilteredContainerDetailsModal(orderId, filterFn, title) {
    const order = state.orders.find(o => o.order_id === orderId);
    if (!order) return;

    const allContainers = (state.containers[orderId] || []); 
    const filteredContainers = allContainers.filter(filterFn);

    if (filteredContainers.length === 0) {
        toast("Tidak ada kontainer yang cocok dengan filter ini.");
        return;
    }

    let tableRows = filteredContainers.map((r, index) => {
        let containerCellHtml;
        let sealCellHtml;

        if (r.size === 'Combo') {
            const containers = (r.no_container || '').split(/[\n,]/).map(s => s.trim()).filter(s => s);
            const seals = (r.no_seal || '').split(/[\n,]/).map(s => s.trim()).filter(s => s);

            const c1 = containers[0] || '-';
            const c2 = containers[1] || '';
            containerCellHtml = `<td>${c1}${c2 ? '<hr style="margin: 2px 0; border-top-color: #ccc;">' + c2 : ''}</td>`;
            
            const s1 = seals[0] || '-';
            const s2 = seals[1] || '';
            sealCellHtml = `<td>${s1}${s2 ? '<hr style="margin: 2px 0; border-top-color: #ccc;">' + s2 : ''}</td>`;
            
        } else {
            containerCellHtml = `<td>${r.no_container || '-'}</td>`;
            sealCellHtml = `<td>${r.no_seal || '-'}</td>`;
        }
        
        let statusDisplay;
        if (r.accept === false) {
             statusDisplay = 'Reject';
        } else if (r.accept === null) {
             statusDisplay = 'Pending Respon';
        } else {
             statusDisplay = r.status || 'Confirm Order';
        }


        return `
            <tr>
                <td>${index + 1}</td>
                <td>${r.size || '-'}</td>
                ${containerCellHtml}
                ${sealCellHtml}
                <td>${r.no_mobil || '-'}</td>
                <td>${r.nama_supir || '-'}</td>
                <td>${r.contact || '-'}</td>
                <td>${r.depo || '-'}</td>
                <td style="font-weight:700; color: ${r.status.toLowerCase().includes('reject') || statusDisplay.toLowerCase().includes('revo') ? 'var(--red)' : 'var(--ink)'};">${statusDisplay}</td>
            </tr>
        `;
    }).join('');

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
    
    const fullTitle = `Detail ${title} (DN: ${(order.no_dn || []).join(' / ')})`;
    openModal(fullTitle, modalHtml);
}

function renderAdminStatus(){
  content.innerHTML = `
    <div class="main-header"><h3 style="margin:0">🚛 Admin — Status Truck</h3>
      <div class="small">Tampilan status berdasarkan order. Klik angka pada kolom jumlah untuk melihat detail.</div></div>
    <div class="card">
       <div class="row">
        <div class="col" style="grid-column: span 3;">
          <label>Filter EMKL</label>
          <select id="status_vendor" class="input">
            <option>-- Semua --</option>
          </select>
        </div>
        <div class="col" style="grid-column: span 3;">
          <label>Tgl Stuffing (start)</label>
          <input id="status_start" type="date" class="input">
        </div>
        <div class="col" style="grid-column: span 3;">
          <label>Tgl Stuffing (end)</label>
          <input id="status_end" type="date" class="input">
        </div>
        
        <div class="col" style="grid-column: span 3;">
          <label>ETD (start)</label>
          <input id="status_etd_start" type="date" class="input">
        </div>
        <div class="col" style="grid-column: span 3;">
          <label>ETD (end)</label>
          <input id="status_etd_end" type="date" class="input">
        </div>
        <div class="col" style="grid-column: span 3; display:flex; align-items:flex-end;">
            <button id="btnDownloadStatusTruck" class="btn success full">⬇️ Download Excel</button>
        </div>
      </div>
      <div class="rekap-wrap" style="margin-top: 12px;">
        <table class="table rekap" id="statusTable" style="font-size: 11px;">
          <thead>
            <tr class="top">
                <th>No</th>
                <th>Ocean BL</th>
                <th>DN</th>
                <th>Final Destination</th>
                <th>ETD</th>
                <th>Shipping Line</th>
                <th>Vessel Name</th>
                <th>Open CY</th>
                <th>Closing Fisik</th> 
                <th>Closing CY</th>
                <th>EMKL</th>
                <th>W/H</th>
                <th>Term</th>
                <th>20ft</th>
                <th>40ft/HC</th>
                <th>Combo</th>
                <th>Sum Cont</th>
                
                <th>Pending</th>
                <th>Confirm Order</th>
                <th>Reject</th>
                <th>Sudah Muat</th>
                <th>Muat Gudang</th>
                <th>Revo</th> 
                <th>Gate In Port</th>
                
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

  function createClickableCell(count, orderId, filterType, filterTitle) {
      if (count === 0 || !count) {
          return '0';
      }
      return `<button 
                class="btn-link" 
                data-order-id="${orderId}" 
                data-filter-type="${filterType}"
                data-filter-title="${filterTitle}"
              >${count}</button>`;
  }

  function getFilteredStatusData() {
    const vend = rVend.value;
    const start = parseISODate(rStart.value);
    const end = parseISODate(rEnd.value);

    const etdStartEl = document.getElementById("status_etd_start");
    const etdEndEl = document.getElementById("status_etd_end");
    const etdStart = etdStartEl.value ? parseISODate(etdStartEl.value) : null;
    const etdEnd = etdEndEl.value ? parseISODate(etdEndEl.value) : null;

    const orders = state.orders.filter(o => {
        const d = parseISODate(o.tgl_stuffing);
        const stuffingOk = d >= start && d <= end;
        
        const vendorOk = (vend === "-- Semua --" || o.vendor === vend);

        let etdOk = true; 
        if (etdStart || etdEnd) {
            if (!o.etd) {
                etdOk = false;
            } else {
                const orderEtd = parseISODate(o.etd);
                if (etdStart && orderEtd < etdStart) etdOk = false;
                if (etdEnd && orderEtd > etdEnd) etdOk = false;
            }
        }
        
        return stuffingOk && vendorOk && etdOk;
        
    }).reverse();

    const data = [];
    let displayedIdx = 0;
    
    orders.forEach((o) => {
        const items = state.containers[o.order_id] || [];
        
        const acceptedItems = items.filter(c => c.accept === true); 
        const accepted20 = acceptedItems.filter(c => c.size === '20ft').length;
        const accepted40 = acceptedItems.filter(c => c.size === '40ft/HC').length;
        const acceptedCombo = acceptedItems.filter(c => c.size === 'Combo').length;
        const totalAccepted = accepted20 + accepted40 + acceptedCombo;

        const totalOrderedContainers = items.length; 

        if (totalOrderedContainers === 0) return;
        
        const countPending = items.filter(c => c.accept === null).length;
        const countReject = items.filter(c => c.accept === false).length;
        
        const countConfirmOrder = acceptedItems.filter(c => (c.status || '').toLowerCase() === 'confirm order').length;
        const countSudahMuat = acceptedItems.filter(c => (c.status || '').toLowerCase() === 'sudah muat').length;
        const countMuatGudang = acceptedItems.filter(c => (c.status || '').toLowerCase() === 'muat gudang').length;
        const countRevo = acceptedItems.filter(c => (c.status || '').toLowerCase() === 'revo').length;
        const countGateIn = acceptedItems.filter(c => (c.status || '').toLowerCase() === 'gate in port').length;

        
        displayedIdx++;
        
        data.push({
            idx: displayedIdx,
            order: o,
            accepted20, accepted40, acceptedCombo, 
            totalAccepted: totalAccepted,
            countPending, countConfirmOrder, countReject, countSudahMuat, countMuatGudang, countRevo, countGateIn
        });
    });
    return data;
  }

  function buildStatusTable() {
    const tbody = document.getElementById("statusBody");
    const filteredData = getFilteredStatusData();

    if (filteredData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="26" class="center">Tidak ada data order pada periode ini.</td></tr>`;
        return;
    }

    tbody.innerHTML = filteredData.map(({ idx, order: o, ...counts }) => `
            <tr>
                <td>${idx}</td>
                <td>-</td>
                <td>${(o.no_dn || []).join('<br>')}</td>
                <td>${o.pod || '-'}</td>
                <td>${formatDisplayDate(o.etd) || '-'}</td> 
                <td>-</td>
                <td>-</td>
                <td>${o.open_cy ? formatDisplayDate(o.open_cy) : '-'}</td>
                <td>-</td> 
                <td>${fmtDT(o.closing_date, o.closing_time)}</td>
                <td>${o.vendor || '-'}</td>
                <td>${o.shipping_point || '-'}</td>
                <td>${o.terminal || '-'}</td>
                <td class="center">${counts.accepted20 || '0'}</td>
                <td class="center">${counts.accepted40 || '0'}</td>
                <td class="center">${counts.acceptedCombo || '0'}</td>
                <td class="center">${counts.totalAccepted || '0'}</td>
                
                <td class="center">${createClickableCell(counts.countPending, o.order_id, 'status_pending_null', 'Pending (Respon)')}</td>
                <td class="center">${createClickableCell(counts.countConfirmOrder, o.order_id, 'status_confirm_order', 'Confirm Order')}</td>
                <td class="center">${createClickableCell(counts.countReject, o.order_id, 'status_reject', 'Reject')}</td>
                <td class="center">${createClickableCell(counts.countSudahMuat, o.order_id, 'status_sudah_muat', 'Sudah Muat')}</td>
                <td class="center">${createClickableCell(counts.countMuatGudang, o.order_id, 'status_muat_gudang', 'Muat Gudang')}</td>
                <td class="center">${createClickableCell(counts.countRevo, o.order_id, 'status_revo', 'Revo')}</td> 
                <td class="center">${createClickableCell(counts.countGateIn, o.order_id, 'status_gate_in', 'Gate In Port')}</td>

                <td>-</td>
                <td>${o.remarks || '-'}</td>
            </tr>
        `).join("");
  }

  buildStatusTable();
  
  const statusBody = document.getElementById("statusBody");
  statusBody.onclick = function(e) {
      const target = e.target;
      if (target.tagName === 'BUTTON' && target.classList.contains('btn-link')) {
          const orderId = target.dataset.orderId;
          const filterType = target.dataset.filterType;
          const title = target.dataset.filterTitle;
          if (!orderId || !filterType) return;
          let filterFunction;
          switch (filterType) {
              case 'size_20ft': filterFunction = c => c.size === '20ft'; break;
              case 'size_40ft': filterFunction = c => c.size === '40ft/HC'; break;
              case 'size_combo': filterFunction = c => c.size === 'Combo'; break;
              case 'all_accepted': filterFunction = c => c.accept === true; break;
              case 'status_pending_null': filterFunction = c => c.accept === null; break;
              case 'status_confirm_order': filterFunction = c => c.accept === true && (c.status || '').toLowerCase() === 'confirm order'; break;
              case 'status_reject': filterFunction = c => c.accept === false; break; 
              case 'status_sudah_muat': filterFunction = c => c.accept === true && (c.status || '').toLowerCase() === 'sudah muat'; break;
              case 'status_muat_gudang': filterFunction = c => c.accept === true && (c.status || '').toLowerCase() === 'muat gudang'; break;
              case 'status_revo': filterFunction = c => c.accept === true && (c.status || '').toLowerCase() === 'revo'; break;
              case 'status_gate_in': filterFunction = c => c.accept === true && (c.status || '').toLowerCase() === 'gate in port'; break;
              default: filterFunction = c => true;
          }
          showFilteredContainerDetailsModal(orderId, filterFunction, title);
      }
  };

  const style = document.createElement('style');
  style.innerHTML = `.btn-link{background:none;border:none;color:var(--blue);text-decoration:underline;cursor:pointer;padding:0;font-size:inherit;font-family:inherit;}.btn-link:hover{color:var(--blue-2);}`;
  document.head.appendChild(style);

  rVend.onchange = buildStatusTable;
  rStart.onchange = buildStatusTable;
  rEnd.onchange = buildStatusTable;
  document.getElementById("status_etd_start").onchange = buildStatusTable;
  document.getElementById("status_etd_end").onchange = buildStatusTable;

  document.getElementById("btnDownloadStatusTruck").onclick = () => {
    const dataToExport = [];
    const filteredData = getFilteredStatusData();

    if (filteredData.length === 0) {
        toast("Tidak ada data untuk diunduh.");
        return;
    }

    filteredData.forEach(({ idx, order: o, ...counts }) => {
        dataToExport.push({
            "No": idx,
            "DN": (o.no_dn || []).join(', '),
            "Final Destination": o.pod || '-',
            "ETD": formatDisplayDate(o.etd) || '-',
            "Open CY": o.open_cy ? formatDisplayDate(o.open_cy) : '-',
            "Closing CY": fmtDT(o.closing_date, o.closing_time),
            "EMKL": o.vendor || '-',
            "W/H": o.shipping_point || '-',
            "Term": o.terminal || '-',
            "20ft": counts.accepted20,
            "40ft/HC": counts.accepted40,
            "Combo": counts.acceptedCombo,
            "Sum Cont": counts.totalAccepted,
            "Pending Respon": counts.countPending,
            "Reject": counts.countReject,
            "Confirm Order": counts.countConfirmOrder,
            "Sudah Muat": counts.countSudahMuat,
            "Muat Gudang": counts.countMuatGudang,
            "Revo": counts.countRevo,
            "Gate In Port": counts.countGateIn,
            "Remarks": o.remarks || '-'
        });
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Status Truck");
    const fileName = `Status_Truck_Admin_${rStart.value}_to_${rEnd.value}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };
}

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
  
  const currentYear = new Date().getFullYear();
  const startYear = Math.max(currentYear, 2025); 
  const ySel = document.getElementById("v_home_year");
  for(let y=startYear-1;y<=startYear+1;y++){ 
    if (y < 2025) continue;
    const opt=document.createElement("option"); 
    opt.value=y; 
    opt.textContent=y; 
    if(y===year) opt.selected=true; 
    ySel.appendChild(opt); 
  }

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
    
    const oldAvail = (state.availability[sel] || {})[vendor] || {"20ft":0, "40ft/HC":0, "Combo":0};
    
    state.availability[sel] = state.availability[sel] || {};
    state.availability[sel][vendor] = {"20ft":a20, "40ft/HC":a40, "Combo":aCombo};
    
    const totalChange = (a20 - oldAvail["20ft"]) + (a40 - oldAvail["40ft/HC"]) + (aCombo - oldAvail["Combo"]);
    if (totalChange !== 0) {
        state.notifications.push({
            id: genId("NOTIF"),
            message: `EMKL ${vendor} telah memperbarui ketersediaan untuk tanggal ${formatDisplayDate(sel)}.`,
            timestamp: new Date().toISOString(),
            isRead: false,
            role: 'admin',
            link: 'Home'
        });
    }
    
    saveState(); toast(`Ketersediaan ${vendor} diperbarui.`); renderVendorHome();
  };
}

/* ===================== VENDOR: ORDERAN (Accept/Reject Order - REVISI 1) ===================== */

// --- BARU: Helper untuk menangani Aksi Accept/Reject di Modal Detail Kontainer ---
function handleContainerAction(orderId, containerIndex, action) {
    const order = state.orders.find(o => o.order_id === orderId);
    if (!order || !state.containers[orderId] || !state.containers[orderId][containerIndex]) return;
    
    const c = state.containers[orderId][containerIndex];
    const isAccept = action === 'accept';

    if (isAccept) {
        c.status = STATUS_TRUCKING.find(s => s.toLowerCase() === 'confirm order') || 'Confirm Order';
    } else {
        c.status = STATUS_TRUCKING.find(s => s.toLowerCase() === 'reject') || 'Reject';
    }
    
    c.accept = isAccept;
    
    state.notifications.push({
        id: genId("NOTIF"),
        message: `${state.vendor_name} merespon kontainer ${c.size} di DN ${(order.no_dn || []).join(' & ')}: ${isAccept ? 'Accepted' : 'Rejected'}.`,
        timestamp: new Date().toISOString(),
        isRead: false,
        role: 'admin',
        relatedOrder: orderId
    });
    
    updateOrderSummary(orderId);
    saveState();
    closeModal();
    renderVendorOrderan();
    toast(`Kontainer #${c.no} di- ${isAccept ? 'Accept' : 'Reject'}.`);
}

// --- BARU: Helper untuk menampilkan Modal Detail Kontainer (Dipanggil dari Tabel Rekap Vendor) ---
function showContainerActionModal(orderId, containerIndex) {
    const order = state.orders.find(o => o.order_id === orderId);
    const container = state.containers[orderId][containerIndex];
    if (!order || !container) return;

    let actionButtons;
    let statusBadge;
    
    if (container.accept === true) {
        actionButtons = `<button class="btn danger full" data-action="reject">Batalkan Accept</button>`;
        statusBadge = `<span class="badge success">ACCEPTED</span>`;
    } else if (container.accept === false) {
        actionButtons = `<button class="btn success full" data-action="accept">Batalkan Reject</button>`;
        statusBadge = `<span class="badge danger">REJECTED</span>`;
    } else {
        actionButtons = `
            <button class="btn success full" data-action="accept">Accept Order</button>
            <button class="btn danger full" data-action="reject" style="margin-top: 8px;">Reject Order</button>
        `;
        statusBadge = `<span class="badge warn">PENDING</span>`;
    }

    const modalHtml = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h4 style="margin: 0 0 5px 0;">Kontainer #${container.no} (${container.size})</h4>
            ${statusBadge}
        </div>
        <div class="form-section">
             <div class="section-title">Detail Order</div>
             <div style="font-size: 0.9rem; line-height: 1.6;">
                <p>DN: <b>${(order.no_dn || []).join(' & ')}</b></p>
                <p>Stuffing: <b>${formatDisplayDate(order.tgl_stuffing)}</b></p>
                <p>Closing CY: <b>${fmtDT(order.closing_date, order.closing_time)}</b></p>
                <p>Shipping Point: <b>${order.shipping_point}</b></p>
                <p>Remarks Admin: ${order.remarks || '-'}</p>
             </div>
        </div>
        
        <div style="margin-top: 15px;">
            ${actionButtons}
        </div>
    `;

    openModal(`Aksi Kontainer #${container.no}`, modalHtml, {
        closeBtnText: 'Tutup',
        closeBtnClass: 'secondary',
        setupListeners: (modalBody) => {
            modalBody.querySelectorAll('button[data-action]').forEach(btn => {
                btn.onclick = () => {
                    handleContainerAction(orderId, containerIndex, btn.dataset.action);
                };
            });
        }
    });
}
function renderVendorOrderan() {
    const vendor = state.vendor_name;

    content.innerHTML = `
        <div class="main-header"><h3 style="margin:0">📒 EMKL – Orderan</h3>
            <div class="small">Input jumlah Accept per baris. Reject akan otomatis terhitung. Klik Submit untuk menyimpan.</div></div>
        <div class="card">
            <h3 style="margin-top:0">List Order yang Perlu Direspons</h3>
            
            <div class="rekap-wrap" style="max-height: 70vh;">
                <table class="table rekap" id="vendorOrderTable" style="min-width: 900px;">
                    <thead>
                        <tr>
                            <th rowspan="2">EMKL</th>
                            <th rowspan="2">Tanggal Stuffing</th>
                            <th rowspan="2">Closing (Date Time)</th>
                            <th rowspan="2">Shipping Point</th>
                            <th rowspan="2">Open CY / Destination Port</th>
                            <th rowspan="2">Terminal</th>
                            <th rowspan="2">Container</th>
                            <th rowspan="2">Jumlah</th>
                            <th rowspan="2">Remarks</th>
                            <th colspan="2" style="text-align: center;">Status</th>
                            <th rowspan="2">Submit</th>
                        </tr>
                        <tr>
                            <th style="background-color: #dcfce7;">Accept</th>
                            <th style="background-color: #fee2e2;">Reject</th>
                        </tr>
                    </thead>
                    <tbody id="vendorOrderBody"></tbody>
                </table>
            </div>
        </div>
    `;
    
    const ordersToRespond = state.orders.filter(o => 
        o.vendor === vendor && 
        (o.summary_status === 'Pending' || o.summary_status === 'Partial')
    ).reverse();

    const tbody = document.getElementById("vendorOrderBody");
    
    if (ordersToRespond.length === 0) {
        tbody.innerHTML = `<tr><td colspan="12">Tidak ada order yang perlu direspons.</td></tr>`;
        return;
    }

    let rowsHtml = "";
    
    ordersToRespond.forEach((order, orderIdx) => {
        const containers = state.containers[order.order_id] || [];
        const containerGroups = {};

        // Group containers by size
        containers.forEach(c => {
            if (!containerGroups[c.size]) {
                containerGroups[c.size] = { 
                    total: 0, 
                    accepted: 0, 
                    rejected: 0, 
                    pending: 0,
                    containers: []
                };
            }
            containerGroups[c.size].total++;
            containerGroups[c.size].containers.push(c);
            if (c.accept === true) containerGroups[c.size].accepted++;
            else if (c.accept === false) containerGroups[c.size].rejected++;
            else containerGroups[c.size].pending++;
        });
        
        const sizes = Object.keys(containerGroups).sort();
        const rowSpan = sizes.length;
        
        const hasPending = containers.some(c => c.accept === null);
        
        sizes.forEach((sz, sizeIdx) => {
            const group = containerGroups[sz];
            const isFirstRow = sizeIdx === 0;
            
            rowsHtml += `<tr>`;
            
            if (isFirstRow) {
                rowsHtml += `
                    <td rowspan="${rowSpan}">${order.vendor}</td>
                    <td rowspan="${rowSpan}">${formatDisplayDate(order.tgl_stuffing)}</td>
                    <td rowspan="${rowSpan}">${fmtDT(order.closing_date, order.closing_time)}</td>
                    <td rowspan="${rowSpan}">${order.shipping_point || '-'}</td>
                    <td rowspan="${rowSpan}">${(order.open_cy ? formatDisplayDate(order.open_cy) : '-') + ' / ' + (order.pod || '-')}</td>
                    <td rowspan="${rowSpan}">${order.terminal || '-'}</td>
                `;
            }

            rowsHtml += `
                <td>${sz}</td>
                <td>${group.total}</td>
            `;
            
            if (isFirstRow) {
                rowsHtml += `<td rowspan="${rowSpan}">${order.remarks || '-'}</td>`;
            }
            
            // Input Accept dengan auto-calculate Reject
            rowsHtml += `
                <td class="acc" style="padding: 8px;">
                    <input 
                        type="number" 
                        class="input-accept" 
                        data-order-id="${order.order_id}"
                        data-container-size="${sz}"
                        data-max="${group.total}"
                        value="${group.accepted}"
                        min="0"
                        max="${group.total}"
                        style="width: 60px; text-align: center; padding: 6px; border: 1px solid #86efac; background: #dcfce7; font-weight: 600; border-radius: 6px;"
                        ${!hasPending ? 'disabled' : ''}
                    />
                </td>
                <td class="rej" style="padding: 8px;">
                    <div 
                        class="reject-display" 
                        data-order-id="${order.order_id}"
                        data-container-size="${sz}"
                        style="width: 60px; text-align: center; padding: 6px; background: #fee2e2; color: #991b1b; font-weight: 600; border-radius: 6px; border: 1px solid #fca5a5;"
                    >${group.rejected}</div>
                </td>
            `;
            
            if (isFirstRow) {
                rowsHtml += `
                    <td rowspan="${rowSpan}">
                        ${hasPending ? 
                            `<button class="btn primary" data-order-id-submit="${order.order_id}" style="padding: 8px 16px;">Submit</button>` : 
                            `<button class="btn secondary" disabled style="padding: 8px 16px;">Done</button>`
                        }
                    </td>
                `;
            }
            
            rowsHtml += `</tr>`;
        });
    });

    tbody.innerHTML = rowsHtml;

    // Event listener untuk input Accept - auto calculate Reject
    tbody.querySelectorAll('.input-accept').forEach(input => {
        input.addEventListener('input', (e) => {
            const orderId = e.target.dataset.orderId;
            const containerSize = e.target.dataset.containerSize;
            const maxValue = parseInt(e.target.dataset.max);
            let acceptValue = parseInt(e.target.value) || 0;
            
            // Validate input
            if (acceptValue < 0) acceptValue = 0;
            if (acceptValue > maxValue) acceptValue = maxValue;
            
            e.target.value = acceptValue;
            
            // Calculate and update Reject
            const rejectValue = maxValue - acceptValue;
            const rejectDisplay = tbody.querySelector(`.reject-display[data-order-id="${orderId}"][data-container-size="${containerSize}"]`);
            if (rejectDisplay) {
                rejectDisplay.textContent = rejectValue;
            }
        });
    });
    
    // Event listener untuk tombol Submit
    tbody.querySelectorAll('button[data-order-id-submit]').forEach(btn => {
        btn.onclick = () => {
            const orderId = btn.dataset.orderIdSubmit;
            const order = ordersToRespond.find(o => o.order_id === orderId);
            if (!order) return;

            const containers = state.containers[orderId] || [];
            
            // Collect accept values from inputs
            const acceptInputs = {};
            tbody.querySelectorAll(`.input-accept[data-order-id="${orderId}"]`).forEach(input => {
                const size = input.dataset.containerSize;
                acceptInputs[size] = parseInt(input.value) || 0;
            });
            
            // Validate: Check if user has made decisions
            const totalInputAccept = Object.values(acceptInputs).reduce((sum, val) => sum + val, 0);
            if (totalInputAccept === 0) {
                if (!confirm('Anda belum accept satupun kontainer. Semua akan di-reject. Lanjutkan?')) {
                    return;
                }
            }
            
            // Apply accept/reject to containers
            let acceptedCount = 0;
            let rejectedCount = 0;
            
            Object.keys(acceptInputs).forEach(size => {
                const acceptAmount = acceptInputs[size];
                const sizeContainers = containers.filter(c => c.size === size && c.accept === null);
                
                sizeContainers.forEach((c, idx) => {
                    if (idx < acceptAmount) {
                        c.accept = true;
                        c.status = STATUS_TRUCKING.find(s => s.toLowerCase() === 'confirm order') || 'Confirm Order';
                        acceptedCount++;
                    } else {
                        c.accept = false;
                        c.status = STATUS_TRUCKING.find(s => s.toLowerCase() === 'reject') || 'Reject';
                        rejectedCount++;
                    }
                });
            });
            
            // Send notification to admin
            state.notifications.push({
                id: genId("NOTIF"),
                message: `${vendor} merespon order DN ${(order.no_dn || []).join(' & ')}: ${acceptedCount} Accept, ${rejectedCount} Reject.`,
                timestamp: new Date().toISOString(),
                isRead: false,
                role: 'admin',
                relatedOrder: orderId
            });

            updateOrderSummary(orderId);
            saveState();
            renderVendorOrderan();
            toast(`Order berhasil disubmit: ${acceptedCount} Accept, ${rejectedCount} Reject`);
        };
    });
}

/* ===================== VENDOR: LIST ORDERAN (Add Detail) ===================== */
function renderVendorListDetail() {
    const vendor = state.vendor_name;
    const allOrders = state.orders.filter(o => o.vendor === vendor && o.summary_status !== 'Pending' && o.summary_status !== 'Rejected');
    
    content.innerHTML = `
        <div class="main-header"><h3 style="margin:0">📋 EMKL — List Orderan (Add Detail)</h3>
            <div class="small">Isi detail kontainer, mobil, dan supir untuk order yang sudah di-Accept.</div></div>
        <div class="card">
            <h3 style="margin-top:0">Order yang Perlu Diisi Detail Trucking</h3>
            <div class="rekap-wrap" style="max-height: 75vh;" id="detailPanel">
                <table class="table rekap" id="detailOrderTable">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>DN</th>
                            <th>Tgl Stuffing</th>
                            <th>Container No</th>
                            <th>No Seal</th>
                            <th>Plat Mobil</th>
                            <th>Nama Supir</th>
                            <th>Contact</th>
                            <th>Depo</th>
                            <th>Status Trucking</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="detailOrderBody"></tbody>
                </table>
            </div>
        </div>
    `;

    const tbody = document.getElementById("detailOrderBody");
    let rowsHtml = "";
    let rowIndex = 0;
    let editingContainerId = state.editing_container_id_vendor;

    allOrders.forEach(order => {
        const acceptedContainers = (state.containers[order.order_id] || []).filter(c => c.accept === true);
        
        acceptedContainers.forEach(container => {
            const uniqueId = `${order.order_id}_${container.no}`;
            const isEditing = editingContainerId === uniqueId;
            rowIndex++;
            
            let containerHtml;
            let sealHtml;
            if (container.size === 'Combo') {
                const containers = (container.no_container || '').split('\n').map(s => s.trim()).filter(s => s);
                const seals = (container.no_seal || '').split('\n').map(s => s.trim()).filter(s => s);
                
                if (isEditing) {
                     containerHtml = `<textarea id="edit_cont_${uniqueId}" class="input" style="height: 4em; font-size: 0.8rem;" placeholder="Container 1\nContainer 2">${containers.join('\n')}</textarea>`;
                     sealHtml = `<textarea id="edit_seal_${uniqueId}" class="input" style="height: 4em; font-size: 0.8rem;" placeholder="Seal 1\nSeal 2">${seals.join('\n')}</textarea>`;
                } else {
                    containerHtml = (containers || []).join('<br>') || '-';
                    sealHtml = (seals || []).join('<br>') || '-';
                }

            } else {
                 if (isEditing) {
                     containerHtml = `<input id="edit_cont_${uniqueId}" class="input no-tiny" type="text" value="${container.no_container || ''}">`;
                     sealHtml = `<input id="edit_seal_${uniqueId}" class="input no-tiny" type="text" value="${container.no_seal || ''}">`;
                 } else {
                     containerHtml = container.no_container || '-';
                     sealHtml = container.no_seal || '-';
                 }
            }
            
            rowsHtml += `
                <tr data-unique-id="${uniqueId}" class="${isEditing ? 'row-active' : ''}">
                    <td>${rowIndex}</td>
                    <td>${(order.no_dn || []).join('<br>')}</td>
                    <td>${formatDisplayDate(order.tgl_stuffing)}</td>
                    <td style="min-width: 150px; text-align: center;">${containerHtml}</td>
                    <td style="min-width: 150px; text-align: center;">${sealHtml}</td>
                    <td>${isEditing ? `<input id="edit_mobil_${uniqueId}" class="input tiny" value="${container.no_mobil || ''}">` : container.no_mobil || '-'}</td>
                    <td>${isEditing ? `<input id="edit_supir_${uniqueId}" class="input tiny" value="${container.nama_supir || ''}">` : container.nama_supir || '-'}</td>
                    <td>${isEditing ? `<input id="edit_contact_${uniqueId}" class="input tiny" value="${container.contact || ''}">` : container.contact || '-'}</td>
                    <td>${isEditing ? `<input id="edit_depo_${uniqueId}" class="input tiny" value="${container.depo || ''}">` : container.depo || '-'}</td>
                    <td>
                        ${isEditing ? `
                            <select id="edit_status_${uniqueId}" class="input tiny" style="min-width: 100px;">
                                ${STATUS_TRUCKING.filter(s => s !== 'Pending' && s !== 'Reject').map(s => 
                                    `<option value="${s}" ${s === container.status ? 'selected' : ''}>${s}</option>`
                                ).join('')}
                            </select>
                        ` : container.status || 'Confirm Order'}
                    </td>
                    <td>
                        ${isEditing ? `
                            <div style="display:flex; flex-direction:column; gap:4px">
                                <button class="btn success tiny" data-save-id="${uniqueId}">Save</button>
                                <button class="btn secondary tiny" data-cancel-id="${uniqueId}">Cancel</button>
                            </div>
                        ` : `
                            <button class="btn warn tiny" data-edit-id="${uniqueId}">Edit</button>
                        `}
                    </td>
                </tr>
            `;
        });
    });

    if (rowIndex === 0) {
        tbody.innerHTML = `<tr><td colspan="11">Tidak ada order yang di-Accept atau semua order sudah diselesaikan.</td></tr>`;
    } else {
        tbody.innerHTML = rowsHtml;
    }

    tbody.querySelectorAll('button[data-edit-id]').forEach(btn => {
        btn.onclick = () => {
            state.editing_container_id_vendor = btn.dataset.editId;
            saveState();
            renderVendorListDetail();
        };
    });
    tbody.querySelectorAll('button[data-cancel-id]').forEach(btn => {
        btn.onclick = () => {
            state.editing_container_id_vendor = null;
            saveState();
            renderVendorListDetail();
        };
    });
    tbody.querySelectorAll('button[data-save-id]').forEach(btn => {
        btn.onclick = () => {
            const uniqueId = btn.dataset.saveId;
            const [orderId, containerNo] = uniqueId.split('_');
            const containerIndex = Number(containerNo) - 1;

            if (state.containers[orderId] && state.containers[orderId][containerIndex]) {
                const c = state.containers[orderId][containerIndex];
                
                const contEl = document.getElementById(`edit_cont_${uniqueId}`);
                const sealEl = document.getElementById(`edit_seal_${uniqueId}`);

                c.no_container = contEl ? (contEl.tagName === 'TEXTAREA' ? contEl.value.trim() : contEl.value.trim()) : c.no_container;
                c.no_seal = sealEl ? (sealEl.tagName === 'TEXTAREA' ? sealEl.value.trim() : sealEl.value.trim()) : c.no_seal;
                
                c.no_mobil = document.getElementById(`edit_mobil_${uniqueId}`).value.trim();
                c.nama_supir = document.getElementById(`edit_supir_${uniqueId}`).value.trim();
                c.contact = document.getElementById(`edit_contact_${uniqueId}`).value.trim();
                c.depo = document.getElementById(`edit_depo_${uniqueId}`).value.trim();
                
                const newStatus = document.getElementById(`edit_status_${uniqueId}`).value;
                const oldStatus = c.status;
                c.status = newStatus;

                if (newStatus.toLowerCase() !== oldStatus.toLowerCase() && newStatus.toLowerCase() === 'gate in port') {
                    const order = allOrders.find(o => o.order_id === orderId);
                    state.notifications.push({
                        id: genId("NOTIF"),
                        message: `Kontainer ${c.no_container || 'No.'+c.no} (DN: ${(order.no_dn||[]).join(' & ')}) sudah GATE IN PORT.`,
                        timestamp: new Date().toISOString(),
                        isRead: false,
                        role: 'admin',
                        relatedOrder: orderId
                    });
                }

                toast(`Detail kontainer ${containerNo} berhasil diupdate.`);
            }
            state.editing_container_id_vendor = null;
            saveState();
            renderVendorListDetail();
        };
    });
}

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
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); 
        fileObject.parsedData = jsonData;
    } catch (err) {
        console.error("Gagal mem-parsing file Excel:", err);
        toast(`Gagal memproses file ${fileObject.name}.`);
        fileObject.parsedData = null;
    }
}

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
      <h3 style="margin:0">🧾 Admin — Data Outstanding</h3>
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
          state.notifications.push({
              id: genId("NOTIF"),
              message: `(${files.length}) file Data Outstanding baru telah diupload.`,
              timestamp: new Date().toISOString(),
              isRead: false,
              role: 'admin',
              link: 'Data Outstanding'
          });
          
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

/* ===================== ADMIN: RATE TRANSPORTER ===================== */
function renderRateTransporter(){
  
  const RATE_TRANSPORTER_DATA = [
    { rank: 1, name: "PT Cakraindo Mitra International", '20FT': 10, '40FT': 10, total: 20, alokasi: '12%' },
    { rank: 2, name: "PT Argo Trans Mandiri", '20FT': 2, '40FT': 5, total: 7, alokasi: '4%' },
    { rank: 3, name: "PT Puninar Logistics", '20FT': 5, '40FT': 5, total: 10, alokasi: '6%' },
    { rank: 4, name: "PT Elang Transportasi Indonesia", '20FT': null, '40FT': 5, total: 5, alokasi: '3%' },
    { rank: 5, name: "PT Bimaruna Jaya", '20FT': 10, '40FT': 20, total: 30, alokasi: '18%' },
    { rank: 6, name: "PT BSA Logistics Indonesia", '20FT': 5, '40FT': 5, total: 10, alokasi: '6%' },
    { rank: 7, name: "PT Tangguh Karimata Jaya", '20FT': 2, '40FT': 5, total: 7, alokasi: '4%' },
    { rank: 8, name: "PT Inti Persada Mandiri", '20FT': 5, '40FT': 20, total: 25, alokasi: '15%' },
    { rank: 9, name: "PT Glory Bahana Universal", '20FT': 5, '40FT': 10, total: 15, alokasi: '9%' },
    { rank: 10, name: "PT Putra Sejahtera Sentosa", '20FT': 3, '40FT': 10, total: 13, alokasi: '8%' },
    { rank: 11, name: "PT Trisindo", '20FT': null, '40FT': 5, total: 5, alokasi: '3%' },
    { rank: 12, name: "PT Lintas Marindo Nusantara", '20FT': 3, '40FT': 20, total: 23, alokasi: '14%' },
  ];
  
  const total20FT = RATE_TRANSPORTER_DATA.reduce((sum, item) => sum + (item['20FT'] || 0), 0);
  const total40FT = RATE_TRANSPORTER_DATA.reduce((sum, item) => sum + (item['40FT'] || 0), 0);
  const grandTotal = RATE_TRANSPORTER_DATA.reduce((sum, item) => sum + item.total, 0);

  const total20Percent = ((total20FT / grandTotal) * 100).toFixed(0) + '%';
  const total40Percent = ((total40FT / grandTotal) * 100).toFixed(0) + '%';
  
  const bodyRows = RATE_TRANSPORTER_DATA.map(d => `
    <tr>
      <td class="center">${d.rank}</td>
      <td style="text-align: left; font-weight: 500; color: var(--ink);">${d.name}</td>
      <td class="center">${d['20FT'] || ''}</td>
      <td class="center">${d['40FT'] || ''}</td>
      <td class="center">${d.total}</td>
      <td class="center" style="font-weight: 600; color: var(--blue-2);">${d.alokasi}</td>
    </tr>
  `).join('');

  content.innerHTML = `
    <div class="main-header">
      <h3 style="margin:0">💰 Admin — Rate Transporter</h3>
      <div class="small">Tabel alokasi dan ranking transporter.</div>
    </div>
    <div class="card">
      <div class="table-wrap no-scroll">
        <table class="table" style="min-width: 650px;">
          <thead>
            <tr style="background: linear-gradient(180deg, #fef3c7, #fef9e8);">
              <th style="background: linear-gradient(180deg, #fef3c7, #fef9e8); position: sticky; top: 0;">Rank</th>
              <th style="background: linear-gradient(180deg, #fef3c7, #fef9e8); position: sticky; top: 0; text-align: left; min-width: 250px;">Transporter</th>
              <th style="background: linear-gradient(180deg, #fef3c7, #fef9e8); position: sticky; top: 0;">20FT</th>
              <th style="background: linear-gradient(180deg, #fef3c7, #fef9e8); position: sticky; top: 0;">40FT</th>
              <th style="background: linear-gradient(180deg, #fef3c7, #fef9e8); position: sticky; top: 0;">Total</th>
              <th style="background: linear-gradient(180deg, #fef3c7, #fef9e8); position: sticky; top: 0;">Alokasi</th>
            </tr>
          </thead>
          <tbody>
            ${bodyRows}
          </tbody>
          <tfoot style="font-weight: 700;">
            <tr style="background-color: #fef3c7;">
              <td colspan="2" style="text-align: right;">Total</td>
              <td class="center">${total20FT}</td>
              <td class="center">${total40FT}</td>
              <td class="center">${grandTotal}</td>
              <td class="center">100%</td>
            </tr>
            <tr style="background-color: #fef3c7;">
              <td colspan="2" style="text-align: right;"></td>
              <td class="center">${total20Percent}</td>
              <td class="center">${total40Percent}</td>
              <td class="center"></td>
              <td class="center"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  `;
}
/* ===================== ADMIN: PORT ===================== */
function renderPort(){
    
    const portServices = [
        { name: "JICT", username: "IKK_Jkt", password: "IKK@2025", url: "https://my.jict.co.id/" },
        { name: "NPCT1", username: "IKK_Jkt", password: "IKK@2025", url: "https://econ.npct1.co.id/" },
        { name: "KOJA", username: "IKK_Jkt", password: "IKK@2025", url: "https://econ.npct1.co.id/" }, 
        { name: "MAL", username: "IKK_Jkt", password: "IKK@2025", url: "https://e-billing.malt300.com/e-booking/" },
        { name: "PELINDO", username: "IKK_Jkt", password: "IKK@2025", url: "https://eservice.pelindo.co.id/" },
    ];
    
    const cardHtml = portServices.map(service => `
        <div class="col" style="grid-column: span 4;">
            <div class="card" style="padding: 15px 20px; text-align: left; transition: box-shadow .2s ease; border-color: var(--blue-soft);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 1.8rem; color: var(--blue); background-color: var(--blue-light); padding: 5px 8px; border-radius: 8px;">🚢</span>
                        <h3 style="margin: 0; font-size: 1.2rem; color: var(--ink);">${service.name}</h3>
                    </div>
                    <a href="${service.url}" target="_blank" class="btn secondary" style="background-color: var(--blue-light); color: var(--blue-2); border-color: var(--blue-soft);">Visit</a>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                    <div style="flex: 1; min-width: 0; padding-right: 10px;">
                        <div class="muted" style="font-weight: 500; font-size: 0.75rem; margin-bottom: 4px;">USERNAME</div>
                        <div style="font-weight: 600; line-height: 1.2; word-wrap: break-word;">${service.username}</div>
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <div class="muted" style="font-weight: 500; font-size: 0.75rem; margin-bottom: 4px;">PASSWORD</div>
                        <div style="font-weight: 600; line-height: 1.2; word-wrap: break-word;">${service.password}</div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    content.innerHTML = `
        <div class="main-header" style="background: linear-gradient(135deg, var(--blue-2), var(--blue));">
            <h3 style="margin:0">🚢 Admin — Port</h3>
            <div class="small">Daftar akun dan akses ke berbagai layanan pengiriman/pelabuhan.</div>
        </div>
        <div class="card" style="margin-top: 20px;">
            <div class="row" style="gap: 16px;">
                ${cardHtml}
            </div>
        </div>
    `;
    
}

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

    for (let i = 0; i < Math.min(5, file.parsedData.length); i++) {
        const potentialHeaders = file.parsedData[i].map(h => String(h || '').trim().toLowerCase());
        const hasDn = dnAliases.some(alias => potentialHeaders.includes(alias));
        
        if (hasDn) {
            headers = potentialHeaders;
            dataStartIndex = i + 1;
            break; 
        }
    }

    if (!headers) {
        continue;
    }

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
    
    if (dnIndex === -1) continue; 

    for (let i = dataStartIndex; i < file.parsedData.length; i++) {
      const row = file.parsedData[i];
      if (!row || row.length <= dnIndex) continue;
      
      const currentDn = String(row[dnIndex] || '').trim().toLowerCase();
      
      if (currentDn === targetDn) {
        return {
          partie20: p20Index !== -1 && row[p20Index] !== undefined ? row[p20Index] : null,
          partie40: p40Index !== -1 && row[p40Index] !== undefined ? row[p40Index]: null,
          sc: scIndex !== -1 && row[scIndex] !== undefined ? row[scIndex] : null,
          forwardingAgent: fwdAgentIndex !== -1 && row[fwdAgentIndex] !== undefined ? row[fwdAgentIndex] : null,
          productGroup: prodGroupIndex !== -1 && row[prodGroupIndex] !== undefined ? row[prodGroupIndex] : null,
          productForm: prodFormIndex !== -1 && row[prodFormIndex] !== undefined ? row[prodFormIndex] : null,
          nw: nwIndex !== -1 && row[nwIndex] !== undefined ? row[nwIndex] : null,
        };
      }
    }
  }

  return defaultResult; 
} 

/* ===================== ADMIN: REPORT BOC (FIX 2) ===================== */

function generateAndDownloadBOC(startDateStr, endDateStr, isAuto = false) {
    if (typeof XLSX === "undefined") {
        if (!isAuto) toast("Library XLSX belum termuat.");
        console.error("XLSX library not loaded.");
        return;
    }
    
    const filteredOrders = state.orders.filter(o => {
        const stuffingDate = parseISODate(o.tgl_stuffing);
        return stuffingDate >= parseISODate(startDateStr) && stuffingDate <= parseISODate(endDateStr);
    });

    if (filteredOrders.length === 0) {
        if (!isAuto) toast("Tidak ada data order pada rentang tanggal tersebut.");
        return;
    }

    const dataToExport = [];
    const dateArray = [];
    const start = parseISODate(startDateStr);
    const end = parseISODate(endDateStr);
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
        dateArray.push(toISODate(new Date(dt)));
    }

    const formatNumberCell = (val) => {
        if (val === null || val === undefined || String(val).trim() === '') return '';
        const num = parseFloat(val);
        if (isNaN(num)) return val;
        return Number(num.toFixed(3)); 
    };

    filteredOrders.forEach((order, index) => {
        let outstandingData = { sc: null, forwardingAgent: null, productGroup: null, productForm: null, partie20: null, partie40: null, nw: null };
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

        let rowData = {
            "No.": index + 1,
            "SC": outstandingData.sc || '',
            "DN": (order.no_dn || []).join(', '),
            "EMKL": order.vendor || '-',
            "FORWARDING AGENT": outstandingData.forwardingAgent || '',
            "DESTINATION PORT": order.pod || '-',
            "Grup": outstandingData.productGroup || '',
            "Form": outstandingData.productForm || '',
            "Partie 20'": formatNumberCell(outstandingData.partie20),
            "Partie 40' HC": formatNumberCell(outstandingData.partie40),
        };

        dateArray.forEach(dateStr => {
            const dateKey = formatDisplayDate(dateStr);
            if (order.tgl_stuffing === dateStr) {
                rowData[`${dateKey} (20')`] = order.jml_20ft || null;
                rowData[`${dateKey} (40'HC)`] = order.jml_40ft || null;
            } else {
                rowData[`${dateKey} (20')`] = null;
                rowData[`${dateKey} (40'HC)`] = null;
            }
        });
        
        rowData["NW"] = formatNumberCell(outstandingData.nw);
        rowData["Closing TGL"] = formatDisplayDate(order.closing_date) || '-';
        rowData["Closing TIME"] = order.closing_time || '-';
        rowData["REMARKS"] = order.remarks || '-';
        
        dataToExport.push(rowData);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    XLSX.utils.book_append_sheet(wb, ws, "Laporan BOC");
    
    const fileName = `Laporan_BOC_${startDateStr}_hingga_${endDateStr}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    if (isAuto) {
        console.log(`Laporan BOC Otomatis berhasil diunduh: ${fileName}`);
    }
}


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

  function buildStandardReportUI(orders, startDateStr, endDateStr) {
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
        if (isNaN(num)) return val;
        return Number(num.toFixed(3));
    };

    const tableBody = orders.map((order, index) => {
        let outstandingData = { sc: null, forwardingAgent: null, productGroup: null, productForm: null, partie20: null, partie40: null, nw: null };
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

        const formatDataCell = (value) => {
            const displayValue = value === null || value === undefined || value === '' ? '-' : value;
            return `<td><div style="padding: 4px 6px; text-align: center;">${displayValue}</div></td>`;
        };
        const formatPlanningCell = (value, isAccent = false) => {
             const displayValue = value === null || value === undefined || value === '' ? '-' : value;
             const style = isAccent ? 'background-color: var(--blue-light); font-weight: 600;' : '';
             return `<td style="${style}"><div style="padding: 4px 6px; text-align: center;">${displayValue}</div></td>`;
        };

        return `
            <tr>
                ${formatDataCell(index + 1)}
                ${formatDataCell(outstandingData.sc)}
                <td>${(order.no_dn || []).join('<br>')}</td>
                ${formatDataCell(order.vendor)}
                ${formatDataCell(outstandingData.forwardingAgent)}
                ${formatDataCell(order.pod)}
                ${formatDataCell(outstandingData.productGroup)}
                ${formatDataCell(outstandingData.productForm)}
                ${formatDataCell(formatNumberCell(outstandingData.partie20))}
                ${formatDataCell(formatNumberCell(outstandingData.partie40))}
                
                ${dateArray.map(dt => {
                    if (order.tgl_stuffing === toISODate(dt)) {
                        return formatPlanningCell(order.jml_20ft, true) + formatPlanningCell(order.jml_40ft, true);
                    } else {
                        return formatPlanningCell('-') + formatPlanningCell('-');
                    }
                }).join('')}
                
                ${formatDataCell(formatNumberCell(outstandingData.nw))}
                ${formatDataCell(formatDisplayDate(order.closing_date))}
                ${formatDataCell(order.closing_time)}
                ${formatDataCell(order.remarks)}
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
    
    document.getElementById('btnDownloadStandardReport').onclick = () => {
        generateAndDownloadBOC(startDateEl.value, endDateEl.value, false);
    };
    
    reportContainer.innerHTML = tableHTML;
  }

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

    buildStandardReportUI(filteredOrders, startDate, endDate);
    
    if (filteredOrders.length === 0) {
        toast("Tidak ada data untuk laporan pada rentang tanggal ini.");
    }
  };


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
    if (typeof XLSX === "undefined") {
        toast("Library XLSX belum termuat.");
        return;
    }
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


/* ===================== ADMIN: REPORT PERFORMA VENDOR ===================== */
function renderReportPerformaVendor() {
    const { html: tableHtml, data: rawData } = buildVendorPerformanceCard(true);

    content.innerHTML = `
        <div class="main-header">
            <h3 style="margin:0">📈 Admin — Report Performa Vendor</h3>
            <div class="small">Tabel ringkasan performa EMKL berdasarkan jumlah kontainer yang di-Accept dan di-Reject.</div>
        </div>
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin:0;">Ringkasan Performa</h3>
                <button id="btnDownloadPerformance" class="btn success">⬇️ Download Excel</button>
            </div>
            
            ${tableHtml}
            
            <div class="small muted" style="margin-top: 20px;">
                * Performa dihitung dari total kontainer yang sudah direspons (Accept + Reject).
            </div>
        </div>
    `;

    document.getElementById("btnDownloadPerformance").onclick = () => {
        if (typeof XLSX === "undefined") {
            toast("Library XLSX belum termuat.");
            return;
        }
        
        const dataToExport = rawData.map(d => ({
            "EMKL": d.name,
            "Accept (Qty)": d.accept,
            "Reject (Qty)": d.reject,
            "Total Respon": d.total,
            "Performa (%)": d.performa + '%'
        }));
        
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Performa Vendor");
        XLSX.writeFile(workbook, "Report_Performa_Vendor.xlsx");
        toast("Ekspor Performa Vendor berhasil.");
    };
}
// DCR Report
function renderDCR() {
  content.innerHTML = `
    <div class="main-header">
      <h3 style="margin:0">📑 Admin — DCR Report</h3>
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
            bodyHtml += `<td>-</td>`;
        });
        bodyHtml += `</tr>`;
    });
    bodyHtml += `</tbody>`;

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
    <div class="main-header"><h3 style="margin:0">📋 Admin — DDCR Report</h3><div class="small">Laporan Daily Kebutuhan Container</div></div>
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

    document.getElementById('btnGenerateDDCR').onclick = () => {
        toast("Fungsi kalkulasi untuk DDCR belum diimplementasikan.");
    };
}


function renderContainerRevo() {
    content.innerHTML = `
        <div class="main-header"><h3 style="margin:0">🔄 Admin — Container Revo Report</h3><div class="small">Daftar semua kontainer yang statusnya pernah mencapai "Revo".</div></div>
        <div class="card">
            <div class="table-wrap">
                <table class="table rekap report-table" id="revoReportTable">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>DN</th>
                            <th>EMKL</th>
                            <th>Tgl Stuffing</th>
                            <th>Container No.</th>
                            <th>No. Seal</th>
                            <th>Plat Mobil</th>
                            <th>Nama Driver</th>
                            <th>Size</th>
                            <th>Remarks Order</th>
                        </tr>
                    </thead>
                    <tbody id="revoReportBody"></tbody>
                </table>
            </div>
            <div style="margin-top:16px; display:flex; justify-content:flex-end;">
              <button id="btnDownloadRevoReport" class="btn success">⬇️ Download Excel</button>
            </div>
        </div>
    `;

    const revoContainers = [];
    state.orders.forEach(order => {
        (state.containers[order.order_id] || []).forEach(container => {
            if ((container.status || '').toLowerCase() === 'revo') {
                revoContainers.push({
                    order,
                    container
                });
            }
        });
    });

    const tbody = document.getElementById("revoReportBody");

    if (revoContainers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" class="center">Tidak ada kontainer dengan status "Revo" saat ini.</td></tr>`;
        return;
    }

    let html = revoContainers.map((item, index) => {
        const { order, container } = item;
        return `
            <tr>
                <td>${index + 1}</td>
                <td>${(order.no_dn || []).join('<br>')}</td>
                <td>${order.vendor}</td>
                <td>${formatDisplayDate(order.tgl_stuffing)}</td>
                <td>${container.no_container || '-'}</td>
                <td>${container.no_seal || '-'}</td>
                <td>${container.no_mobil || '-'}</td>
                <td>${container.nama_supir || '-'}</td>
                <td>${container.size}</td>
                <td>${order.remarks || '-'}</td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = html;
    
    document.getElementById("btnDownloadRevoReport").onclick = () => {
        if (typeof XLSX === "undefined") {
            toast("Library XLSX belum termuat.");
            return;
        }
        
        const dataToExport = revoContainers.map((item, index) => ({
            "No.": index + 1,
            "DN": (item.order.no_dn || []).join(', '),
            "EMKL": item.order.vendor,
            "Tgl Stuffing": formatDisplayDate(item.order.tgl_stuffing),
            "Container No.": item.container.no_container || '-',
            "No. Seal": item.container.no_seal || '-',
            "Plat Mobil": item.container.no_mobil || '-',
            "Nama Driver": item.container.nama_supir || '-',
            "Size": item.container.size,
            "Remarks Order": item.order.remarks || '-'
        }));
        
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Container Revo");
        XLSX.writeFile(workbook, "Container_Revo_Report.xlsx");
        toast("Ekspor Container Revo berhasil.");
    };
}

function formatDuration(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') return '-';
    const parts = timeStr.split(':').map(Number);
    if (parts.length !== 3) return timeStr;

    let [h, m, s] = parts;
    let totalSeconds = h * 3600 + m * 60 + s;
    
    const maxSeconds = 3600 * 24;
    const days = Math.floor(totalSeconds / maxSeconds);
    
    if (days >= 1) {
        return `${days} Hari`; 
    }
    
    return timeStr;
}

function renderReportDurasi() {
  const dummyDataRaw = [
    { no: 1, iml: "44008784", jenis: "MUAT", t1: "9/10/2025 8:26:00 PM", t2: "9/10/2025 8:34:18 PM", s1: "00:08:18", t3: "9/11/2025 1:28:19 AM", s2: "04:54:01", t4: "9/11/2025 12:20:19 PM", s3: "10:52:00", t5: "9/11/2025 12:48:18 PM", s4: "00:28:00", t6: "9/11/2025 5:35:16 PM", s5: "04:46:57", total: "21:09:16" },
    { no: 2, iml: "44008785", jenis: "MUAT", t1: "9/10/2025 9:00:00 PM", t2: "9/10/2025 9:15:30 PM", s1: "00:15:30", t3: "9/11/2025 2:00:00 AM", s2: "04:44:30", t4: "9/11/2025 1:00:00 PM", s3: "11:00:00", t5: "9/11/2025 1:30:15 PM", s4: "00:30:15", t6: "9/11/2025 6:09:18 PM", s5: "04:15:03", total: "18:19:12" },
    { no: 3, iml: "44008786", jenis: "MUAT", t1: "9/10/2025 10:00:00 PM", t2: "9/10/2025 10:10:10 PM", s1: "00:10:10", t3: "9/11/2025 3:00:00 AM", s2: "04:49:50", t4: "9/11/2025 10:00:00 AM", s3: "07:00:00", t5: "9/11/2025 10:30:00 AM", s4: "00:30:00", t6: "9/11/2025 11:59:29 AM", s5: "02:43:02", total: "14:24:35" },
    { no: 4, iml: "44008787", jenis: "MUAT", t1: "9/10/2025 11:00:00 PM", t2: "9/10/2025 11:05:00 PM", s1: "00:05:00", t3: "9/11/2025 4:00:00 AM", s2: "04:55:00", t4: "9/11/2025 9:00:00 AM", s3: "05:00:00", t5: "9/11/2025 9:30:00 AM", s4: "00:30:00", t6: "9/11/2025 12:44:44 AM", s5: "01:38:33", total: "12:47:41" },
    { no: 5, iml: "44008788", jenis: "MUAT", t1: "9/10/2025 11:30:00 PM", t2: "9/10/2025 11:35:00 PM", s1: "00:05:00", t3: "9/11/2025 5:00:00 AM", s2: "05:25:00", t4: "9/11/2025 10:00:00 AM", s3: "05:00:00", t5: "9/11/2025 10:30:00 AM", s4: "00:30:00", t6: "9/11/2025 12:30:06 PM", s5: "02:06:31", total: "12:58:43" },
    { no: 6, iml: "44009000", jenis: "MUAT", t1: "9/15/2025 1:00:00 AM", t2: "9/16/2025 1:00:00 AM", s1: "24:00:00", t3: "9/17/2025 1:00:00 AM", s2: "24:00:00", t4: "9/18/2025 1:00:00 AM", s3: "24:00:00", t5: "9/19/2025 1:00:00 AM", s4: "24:00:00", t6: "9/20/2025 1:00:00 AM", s5: "24:00:00", total: "120:00:00" } 
  ];
  
  function parseDurationToSeconds(timeStr) {
      if (!timeStr) return 0;
      const parts = timeStr.split(':').map(Number);
      if (parts.length !== 3) return 0;
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  const dummyData = dummyDataRaw.map(d => ({
      ...d,
      type: undefined, 
      s1_fmt: formatDuration(d.s1),
      s2_fmt: formatDuration(d.s2),
      s3_fmt: formatDuration(d.s3),
      s4_fmt: formatDuration(d.s4),
      s5_fmt: formatDuration(d.s5),
      total_seconds: parseDurationToSeconds(d.total),
      total_days: Math.floor(parseDurationToSeconds(d.total) / (3600 * 24)), 
      total_fmt: formatDuration(d.total),
  }));

  content.innerHTML = `
    <div class="main-header"><h3 style="margin:0">⏱️ Admin — Report Durasi Trucking</h3><div class="small">Laporan Durasi Trucking</div></div>
    <div id="report-durasi-page">
      
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
            <select id="rd_filter_type" class="input" style="min-width: 160px; display:none;"> <option value="">Semua Type</option>
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
                <th>Hari</th> </tr>
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

  const getBadgeClass = (timeStr, isTotal = false) => {
    if (!timeStr) return 'diff-ok';
    try {
        const parts = timeStr.split(':').map(Number);
        const hours = parts[0] + (parts[1]/60) + (parts[2]/3600);
        
        if (isTotal) {
             if (hours > 24) return 'diff-bad';
             if (hours > 18) return 'diff-warn';
             return 'diff-ok';
        } else {
            if (hours > 24) return 'diff-bad';
            if (hours > 6) return 'diff-warn';
            return 'diff-ok';
        }
    } catch(e) {
        return 'diff-ok';
    }
  };
  
  function getOriginalDuration(index, key) {
      if (index >= 0 && index < dummyDataRaw.length) {
          return dummyDataRaw[index][key];
      }
      return '-';
  }


  function drawDurasiTable(data) {
    const tbody = document.getElementById("rd_body");
    if (!data.length) {
        tbody.innerHTML = `<tr><td colspan="16" class="center">Tidak ada data yang cocok dengan pencarian.</td></tr>`;
        return;
    }
    
    tbody.innerHTML = data.map((d, index) => {
        const s1_raw = getOriginalDuration(index, 's1');
        const s2_raw = getOriginalDuration(index, 's2');
        const s3_raw = getOriginalDuration(index, 's3');
        const s4_raw = getOriginalDuration(index, 's4');
        const s5_raw = getOriginalDuration(index, 's5');
        const total_raw = getOriginalDuration(index, 'total');
        
        return `
            <tr>
                <td>${d.no}</td>
                <td>${d.iml}</td>
                <td>${d.jenis}</td>
                <td>${d.t1}</td>
                <td>${d.t2}</td>
                <td class="col-selisih"><span class="diff-badge ${getBadgeClass(s1_raw)}">${d.s1_fmt}</span></td>
                <td>${d.t3}</td>
                <td class="col-selisih"><span class="diff-badge ${getBadgeClass(s2_raw)}">${d.s2_fmt}</span></td>
                <td>${d.t4}</td>
                <td class="col-selisih"><span class="diff-badge ${getBadgeClass(s3_raw)}">${d.s3_fmt}</span></td>
                <td>${d.t5}</td>
                <td class="col-selisih"><span class="diff-badge ${getBadgeClass(s4_raw)}">${d.s4_fmt}</span></td>
                <td>${d.t6}</td>
                <td class="col-selisih"><span class="diff-badge ${getBadgeClass(s5_raw)}">${d.s5_fmt}</span></td>
                <td><span class="diff-badge diff-total ${getBadgeClass(total_raw, true)}">${d.total_fmt}</span></td>
                <td>${d.total_days || '-'}</td> 
            </tr>
        `;
    }).join('');
  }
  
  
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
    applyToggle();
  }
  
  document.getElementById("rd_filter_btn").onclick = () => {
    const tbody = document.getElementById("rd_body");
    tbody.innerHTML = `<tr><td colspan="16" class="center">...Mencari data...</td></tr>`; 

    const searchTerm = document.getElementById("rd_search").value.trim().toLowerCase();
    const jenis = document.getElementById("rd_filter_jenis").value;

    const filteredData = dummyData.filter(d => {
      const matchIML = d.iml.toLowerCase().includes(searchTerm);
      const matchJenis = (jenis === "" || d.jenis === jenis);
      return matchIML && matchJenis;
    });

    setTimeout(() => {
      drawDurasiTable(filteredData);
      toast(`Menampilkan ${filteredData.length} hasil.`);
    }, 250);
  };

  drawDurasiTable(dummyData);
}

// ====================================================================
// --- FUNGSI DOWNLOAD OTOMATIS BOC ---
// ====================================================================
let autoDownloadTimer = null; 

function scheduleAutoDownload() {
    if (autoDownloadTimer) {
        clearTimeout(autoDownloadTimer);
    }

    const now = new Date();
    const targetTime = new Date();
    targetTime.setHours(17, 0, 0, 0); 

    let msToTarget = targetTime.getTime() - now.getTime();

    if (msToTarget < 0) {
        msToTarget += 24 * 60 * 60 * 1000;
    }

    console.log(`Penjadwalan download BOC otomatis dalam ${Math.round(msToTarget / 1000)} detik (target ${targetTime.toTimeString().split(' ')[0]})...`);

    autoDownloadTimer = setTimeout(() => {
        console.log("Menjalankan download BOC otomatis...");
        
        if (state.authenticated && state.user_role === 'admin') {
            const today = new Date();
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 6);
            
            const endDateStr = toISODate(today);
            const startDateStr = toISODate(sevenDaysAgo);

            try {
                generateAndDownloadBOC(startDateStr, endDateStr, true);
            } catch (e) {
                console.error("Gagal menjalankan download otomatis:", e);
            }
        } else {
            console.log("Download otomatis dibatalkan, user bukan admin atau sudah logout.");
        }
        
        scheduleAutoDownload();
        
    }, msToTarget);
}
// ====================================================================
// --- AKHIR FUNGSI DOWNLOAD OTOMATIS BOC ---
// ====================================================================


// Boot
render();

// Panggil penjadwalan hanya jika user adalah admin
if (state.authenticated && state.user_role === 'admin') {
    scheduleAutoDownload();
}
