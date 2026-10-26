/**
 * Main Application Logic
 * GSAP Animations, Interactive CLI Emulator, Command Palette (Ctrl+K),
 * CRT Mode Toggle, One-Click Code Copy & Live GitHub Pulse.
 */

document.addEventListener('DOMContentLoaded', () => {
  initGSAPAnimations();
  initInteractiveTerminal();
  initCommandPalette();
  initCrtMode();
  initClipboardHandlers();
  initLiveTelemetry();
});

/* ==========================================================================
   GSAP Entrance & Scroll Animations
   ========================================================================== */
function initGSAPAnimations() {
  if (typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero Timeline
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.telemetry-bar', {
    y: -20,
    opacity: 0,
    duration: 0.8,
    delay: 0.1
  })
  .from('.hero-title', {
    y: 30,
    opacity: 0,
    duration: 0.9
  }, '-=0.5')
  .from('.hero-subtitle', {
    y: 20,
    opacity: 0,
    duration: 0.8
  }, '-=0.6')
  .from('.hero-cta-group', {
    y: 20,
    opacity: 0,
    duration: 0.7
  }, '-=0.5')
  .from('.hero-metrics', {
    y: 20,
    opacity: 0,
    duration: 0.7
  }, '-=0.4');

  // Scroll Animations for Sections
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.utils.toArray('.section-header').forEach(header => {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: 'top 85%'
        },
        y: 25,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out'
      });
    });

    // Bento Grid Cards Stagger
    gsap.from('.project-card', {
      scrollTrigger: {
        trigger: '.bento-grid',
        start: 'top 80%'
      },
      y: 35,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power2.out'
    });

    // Benchmarks Cards
    gsap.from('.benchmark-card', {
      scrollTrigger: {
        trigger: '.benchmarks-grid',
        start: 'top 80%'
      },
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power2.out'
    });

    // Terminal Container
    gsap.from('.terminal-window', {
      scrollTrigger: {
        trigger: '.terminal-section',
        start: 'top 75%'
      },
      scale: 0.96,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });

    // Tech Stack Categories
    gsap.from('.stack-category', {
      scrollTrigger: {
        trigger: '.stack-grid',
        start: 'top 85%'
      },
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power2.out'
    });
  }
}

/* ==========================================================================
   Interactive Terminal Demo Logic
   ========================================================================== */
let globalExecuteCommand = null;

function initInteractiveTerminal() {
  const terminalOutput = document.getElementById('terminal-output');
  const terminalInput = document.getElementById('terminal-input');
  const runBtn = document.getElementById('run-cmd-btn');
  const clearBtn = document.getElementById('clear-term-btn');
  const quickChips = document.querySelectorAll('.cmd-chip');

  if (!terminalOutput || !terminalInput) return;

  const commandDatabase = {
    'help': `
<span class="prompt-accent">Kullanılabilir Sistem Komutları:</span>
  • <span style="color:#A78BFA">yapair --diagnose</span> : Windows yapay zeka arıza analiz simülasyonu
  • <span style="color:#38BDF8">pwxe build</span>       : PowerShell script'ini bağımsız EXE'ye derle
  • <span style="color:#FB923C">oxidesk status</span>    : Rust uzak masaüstü servis durumunu listele
  • <span style="color:#34D399">winraze scan</span>      : Sistem artık dosyaları ve performans taraması
  • <span style="color:#94A3B8">clear</span>             : Terminal ekranını temizle
  • <span style="color:#94A3B8">whoami</span>            : M. Tahir Yılmaz profil özeti`,

    'yapair --diagnose': `
<span style="color:#A78BFA">[yapair v0.2.1] AI Diagnostics Agent initialized (Read-only mode)</span>
[1/4] Scanning Windows Event Logs (System & Application)... <span style="color:#10B981">DONE</span>
[2/4] Verifying critical services (Spooler, WinRM, RPC)... <span style="color:#10B981">HEALTHY</span>
[3/4] Checking Registry key integrity for NetBIOS/TCP... <span style="color:#FBBF24">WARNING</span>
      ↳ Anomaly detected: Stale TCP socket binding in GPO config (0x00000709)
[4/4] Automated AI Synthesis:
      <span style="color:#06B6D4">Plan generated:</span> Apply PowerShell non-invasive registry fix without reboot.
      Status: <span style="color:#10B981">Verified 100% Safe to Execute.</span>`,

    'yapair': `
<span style="color:#A78BFA">[yapair]</span> AI-powered Windows diagnostics and repair agent.
Çalıştırmak için: <span style="color:#A78BFA">yapair --diagnose</span>`,

    'pwxe build --script ./deploy.ps1': `
<span style="color:#38BDF8">[pwxe Build Engine v1.8]</span>
• Loading script: ./deploy.ps1 (Size: 14.2 KB)
• Syntax validation: <span style="color:#10B981">OK (PowerShell 7.4.x AST)</span>
• Obfuscating symbols & strings... <span style="color:#10B981">DONE</span>
• Embedding native C# host wrapper & icon resources... <span style="color:#10B981">DONE</span>
• Compiling standalone binary: <span style="color:#FBBF24">deploy.exe</span> (PE x64)
<span style="color:#10B981">✓ Build Successful!</span> Output: ./dist/deploy.exe (Size: 1.8 MB, 0 dependencies)`,

    'pwxe build': `
<span style="color:#38BDF8">[pwxe Build Engine]</span>
• Compiling sample script: ./deploy.ps1 -> ./dist/deploy.exe
<span style="color:#10B981">✓ Build Successful!</span> Single standalone executable created in 340ms.`,

    'pwxe': `
<span style="color:#38BDF8">[pwxe]</span> Modern, ultra-fast PowerShell script to standalone EXE build engine.
Dene: <span style="color:#38BDF8">pwxe build</span>`,

    'oxidesk status': `
<span style="color:#FB923C">[OxiDesk Service (Rust Engine)]</span>
• Daemon status: <span style="color:#10B981">RUNNING (PID 4821)</span>
• Protocol: Secure TLS 1.3 + Chacha20-Poly1305
• Display Capture: Desktop Duplication API (DXGI, 60 FPS, &lt; 12ms latency)
• Active Listeners: 0.0.0.0:21118 (Fluent Management Channel)`,

    'oxidesk': `
<span style="color:#FB923C">[OxiDesk]</span> Windows Fluent IT Remote Desktop & Device Management Ecosystem.
Dene: <span style="color:#FB923C">oxidesk status</span>`,

    'winraze scan': `
<span style="color:#34D399">[winraze v1.2 - Rust System Optimizer]</span>
• Scanning temp caches, CBS logs and obsolete installer rollbacks...
• Discovered safe reclaimable space: <span style="color:#10B981">4.82 GB</span>
• Zero fragmentation detected on NVMe storage.`,

    'winraze': `
<span style="color:#34D399">[winraze]</span> Ultra-fast Windows deep cleanup & performance utility written in Rust.
Dene: <span style="color:#34D399">winraze scan</span>`,

    'whoami': `
<span class="prompt-accent">M. Tahir Yılmaz</span>
Systems Engineer & IT Automation Developer.
GitHub: <a href="https://github.com/mtahiryilmazz" target="_blank" style="color:#06B6D4">github.com/mtahiryilmazz</a>`,

    'clear': '__CLEAR__'
  };

  function executeCommand(cmdStr) {
    const raw = cmdStr.trim();
    if (!raw) return;

    const lower = raw.toLowerCase();

    if (lower === 'clear') {
      terminalOutput.innerHTML = `
        <div class="term-line welcome-msg">
          <span class="prompt-accent">SysArch CLI</span> - Ekran temizlendi.
        </div>`;
      terminalInput.value = '';
      return;
    }

    const userLine = document.createElement('div');
    userLine.className = 'term-line';
    userLine.innerHTML = `<span class="term-prompt">user@mty-sys:~$</span> <span style="color:#FFF">${escapeHtml(raw)}</span>`;
    terminalOutput.appendChild(userLine);

    const response = commandDatabase[raw] || commandDatabase[lower] || `
<span style="color:#EF4444">Komut bulunamadı: "${escapeHtml(raw)}".</span> Kullanılabilir komutları görmek için <span style="color:#06B6D4">help</span> yazın.`;

    const respLine = document.createElement('div');
    respLine.className = 'term-line';
    respLine.innerHTML = response;
    terminalOutput.appendChild(respLine);

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    terminalInput.value = '';
  }

  globalExecuteCommand = executeCommand;

  function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeCommand(terminalInput.value);
    }
  });

  if (runBtn) {
    runBtn.addEventListener('click', () => {
      executeCommand(terminalInput.value);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      executeCommand('clear');
    });
  }

  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        terminalInput.value = cmd;
        executeCommand(cmd);
      }
    });
  });

  // Action buttons that trigger commands from project cards
  document.querySelectorAll('.trigger-cmd').forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-run');
      if (cmd) {
        const terminalEl = document.getElementById('terminal');
        if (terminalEl) {
          terminalEl.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => {
            executeCommand(cmd);
          }, 400);
        }
      }
    });
  });
}

/* ==========================================================================
   Global Command Palette (Ctrl+K / Cmd+K)
   ========================================================================== */
function initCommandPalette() {
  const backdrop = document.getElementById('cmd-palette-backdrop');
  const input = document.getElementById('palette-search-input');
  const resultsContainer = document.getElementById('palette-results');
  const triggerBtns = [
    document.getElementById('cmd-palette-btn'),
    document.getElementById('hero-palette-btn')
  ];

  if (!backdrop || !input || !resultsContainer) return;

  const paletteItems = [
    { title: 'yapair (C# AI Diagnostics)', desc: 'AI-powered Windows diagnostics & repair agent', icon: '🤖', action: () => window.open('https://github.com/mtahiryilmazz/yapair', '_blank'), badge: 'GitHub' },
    { title: 'OxiDesk (Rust)', desc: 'Windows Fluent IT Remote Desktop Ecosystem', icon: '🦀', action: () => window.open('https://github.com/mtahiryilmazz/OxiDesk', '_blank'), badge: 'GitHub' },
    { title: 'pwxe CLI Engine', desc: 'PowerShell script to standalone EXE builder', icon: '⚡', action: () => window.open('https://github.com/mtahiryilmazz/pwxe', '_blank'), badge: 'GitHub' },
    { title: 'winraze (Rust)', desc: 'Windows deep system cleanup & optimizer', icon: '🧹', action: () => window.open('https://github.com/mtahiryilmazz/winraze', '_blank'), badge: 'GitHub' },
    { title: 'SysForge-Studio', desc: 'Enterprise Windows IT management suite', icon: '🛠️', action: () => window.open('https://github.com/mtahiryilmazz/SysForge-Studio', '_blank'), badge: 'GitHub' },
    { title: 'Simüle Et: yapair --diagnose', desc: 'Canlı arıza tespit analizini terminalde çalıştır', icon: '▶️', action: () => runInTerminalAndScroll('yapair --diagnose'), badge: 'CLI' },
    { title: 'Simüle Et: pwxe build', desc: 'PowerShell derleme motorunu terminalde simüle et', icon: '▶️', action: () => runInTerminalAndScroll('pwxe build'), badge: 'CLI' },
    { title: 'Simüle Et: oxidesk status', desc: 'Uzak masaüstü servis durumunu terminalde sorgula', icon: '▶️', action: () => runInTerminalAndScroll('oxidesk status'), badge: 'CLI' },
    { title: 'Benchmark & Metrikler', desc: 'Rust vs Standart araçların performans kıyaslaması', icon: '📊', action: () => scrollToSection('#benchmarks'), badge: 'Bölüm' },
    { title: 'Projeler Bölümüne Git', desc: 'Bento grid açık kaynak çözümlerine atla', icon: '📁', action: () => scrollToSection('#projects'), badge: 'Bölüm' },
    { title: 'CRT Monitör Modunu Aç/Kapat', desc: 'Retro tarama çizgileri & yeşil fosfor efekti', icon: '📺', action: () => toggleCrtMode(), badge: 'Ayar' },
    { title: 'yapair Klon Komutunu Kopyala', desc: 'git clone https://github.com/mtahiryilmazz/yapair.git', icon: '📋', action: () => copyToClipboard('git clone https://github.com/mtahiryilmazz/yapair.git'), badge: 'Kopya' },
    { title: 'OxiDesk Klon Komutunu Kopyala', desc: 'git clone https://github.com/mtahiryilmazz/OxiDesk.git', icon: '📋', action: () => copyToClipboard('git clone https://github.com/mtahiryilmazz/OxiDesk.git'), badge: 'Kopya' },
    { title: 'GitHub Profilini Aç', desc: 'github.com/mtahiryilmazz', icon: '🌐', action: () => window.open('https://github.com/mtahiryilmazz', '_blank'), badge: 'Dış Bağlantı' }
  ];

  let selectedIndex = 0;
  let filteredItems = [...paletteItems];

  function openPalette() {
    backdrop.classList.add('active');
    input.value = '';
    renderResults(paletteItems);
    setTimeout(() => input.focus(), 50);
  }

  function closePalette() {
    backdrop.classList.remove('active');
  }

  function renderResults(items) {
    filteredItems = items;
    selectedIndex = 0;
    resultsContainer.innerHTML = '';

    if (items.length === 0) {
      resultsContainer.innerHTML = `<div style="padding:16px;text-align:center;color:#64748B;font-size:0.85rem">Sonuç bulunamadı.</div>`;
      return;
    }

    items.forEach((item, index) => {
      const el = document.createElement('div');
      el.className = `palette-item ${index === selectedIndex ? 'selected' : ''}`;
      el.innerHTML = `
        <div class="palette-item-left">
          <span class="palette-item-icon">${item.icon}</span>
          <div>
            <div class="palette-item-title">${item.title}</div>
            <div class="palette-item-desc">${item.desc}</div>
          </div>
        </div>
        <span class="palette-item-badge">${item.badge}</span>
      `;

      el.addEventListener('click', () => {
        closePalette();
        item.action();
      });

      resultsContainer.appendChild(el);
    });
  }

  function scrollToSection(selector) {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  function runInTerminalAndScroll(cmd) {
    const terminalEl = document.getElementById('terminal');
    if (terminalEl) {
      terminalEl.scrollIntoView({ behavior: 'smooth' });
      if (globalExecuteCommand) {
        setTimeout(() => globalExecuteCommand(cmd), 400);
      }
    }
  }

  // Search Filter
  input.addEventListener('input', () => {
    const query = input.value.toLowerCase().trim();
    if (!query) {
      renderResults(paletteItems);
      return;
    }

    const filtered = paletteItems.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.desc.toLowerCase().includes(query) ||
      item.badge.toLowerCase().includes(query)
    );

    renderResults(filtered);
  });

  // Keyboard Navigation inside Palette
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredItems.length > 0) {
        selectedIndex = (selectedIndex + 1) % filteredItems.length;
        updateSelectedUi();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredItems.length > 0) {
        selectedIndex = (selectedIndex - 1 + filteredItems.length) % filteredItems.length;
        updateSelectedUi();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        closePalette();
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      closePalette();
    }
  });

  function updateSelectedUi() {
    const children = resultsContainer.querySelectorAll('.palette-item');
    children.forEach((child, i) => {
      child.classList.toggle('selected', i === selectedIndex);
      if (i === selectedIndex) {
        child.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  // Global Keyboard Trigger (Cmd+K, Ctrl+K)
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (backdrop.classList.contains('active')) {
        closePalette();
      } else {
        openPalette();
      }
    } else if (e.key === 'Escape' && backdrop.classList.contains('active')) {
      closePalette();
    }
  });

  // Backdrop click to close
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closePalette();
  });

  // Trigger buttons
  triggerBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', openPalette);
  });
}

/* ==========================================================================
   Retro CRT Mode Switcher
   ========================================================================== */
function toggleCrtMode() {
  const isCrt = document.body.classList.toggle('crt-active');
  const btn = document.getElementById('crt-toggle-btn');
  if (btn) btn.classList.toggle('active', isCrt);
  localStorage.setItem('mty_crt_mode', isCrt ? '1' : '0');
  showToast(isCrt ? '⚡ CRT Monitör Modu Aktif' : 'CRT Monitör Modu Kapatıldı');
}

function initCrtMode() {
  const btn = document.getElementById('crt-toggle-btn');
  const saved = localStorage.getItem('mty_crt_mode');
  if (saved === '1') {
    document.body.classList.add('crt-active');
    if (btn) btn.classList.add('active');
  }

  if (btn) {
    btn.addEventListener('click', toggleCrtMode);
  }
}

/* ==========================================================================
   Clipboard Handlers & Toast System
   ========================================================================== */
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`Panoya Kopyalandı: "${text.substring(0, 32)}..."`, 'success');
    }).catch(() => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  showToast(`Panoya Kopyalandı!`, 'success');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

function initClipboardHandlers() {
  // One-click copy buttons in bento cards
  document.querySelectorAll('.copy-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      if (text) {
        copyToClipboard(text);
        btn.classList.add('copied');
        setTimeout(() => btn.classList.remove('copied'), 1500);
      }
    });
  });

  // Card manifest JSON copy button
  const copyCardBtn = document.querySelector('.copy-card-btn');
  if (copyCardBtn) {
    copyCardBtn.addEventListener('click', () => {
      const text = copyCardBtn.getAttribute('data-copy');
      if (text) copyToClipboard(text);
    });
  }
}

/* ==========================================================================
   Live GitHub Telemetry Pulse
   ========================================================================== */
function initLiveTelemetry() {
  const telemetryEl = document.getElementById('telemetry-dynamic');
  if (!telemetryEl) return;

  // Attempt to fetch public repos count or recent public events
  fetch('https://api.github.com/users/mtahiryilmazz')
    .then(res => res.json())
    .then(data => {
      if (data && data.public_repos) {
        telemetryEl.innerHTML = `GitHub Live: <strong>${data.public_repos} Açık Kaynak Sistem Projesi</strong> • Son güncelleme aktif`;
      }
    })
    .catch(() => {
      // Fallback remains clean default
    });
}
