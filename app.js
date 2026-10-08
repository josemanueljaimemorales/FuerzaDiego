let ejercicios = [];
let seleccion = [];
let diaActual = "";

const AKC_LOGO = "https://github.com/josemanueljaimemorales/GAV-APP-AKC/blob/main/logo.png?raw=true";

async function init(){
  try {
    const res = await fetch("Fuerza_Especifica_Diego.xlsx");
    const buf = await res.arrayBuffer();
    const wb = XLSX.read(buf);
    ejercicios = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {defval:""});
    home();
  } catch(e) {
    document.getElementById("app").innerHTML = `<main class="shell"><section class="error-card"><div class="error-icon">!</div><h1>No se pudo cargar la rutina</h1><p>Verifica que <b>Fuerza_Especifica_Diego.xlsx</b> esté en la raíz del repositorio.</p></section></main>`;
  }
}

function home(){
  exitFullscreen();
  const carga = localStorage.getItem("fuerzaEspecificaCarga") || "MEDIA · 3x10 · Peso medio";
  document.getElementById("app").innerHTML = `
    <main class="shell home-shell">
      <header class="hero">
        <div class="hero-glow"></div>
        <div class="brand-mark"><img class="logo" src="${AKC_LOGO}" alt="AKC"></div>
        <div class="hero-copy">
          <div class="eyebrow"><span></span> AKC · HIGH PERFORMANCE</div>
          <h1>FUERZA <strong>ESPECÍFICA</strong></h1>
          <div class="athlete">DIEGO</div>
          <p>Plataforma individual de fuerza y preparación física</p>
        </div>
      </header>

      <section class="panel load-panel">
        <div class="section-head"><div><span class="section-kicker">01</span><h2>Intensidad de trabajo</h2></div><span class="live-dot">SEMANA</span></div>
        <div class="load-grid">
          ${loadButton("ALTA","3×8 · Peso máximo","ALTA · 3x8 · Peso máximo",carga)}
          ${loadButton("MEDIA","3×10 · Peso medio","MEDIA · 3x10 · Peso medio",carga)}
          ${loadButton("BAJA","3×12 · Peso bajo","BAJA · 3x12 · Peso bajo",carga)}
        </div>
        <div class="selected-load">CARGA SELECCIONADA <b>${escapeHtml(carga.split(" · ")[0])}</b></div>
      </section>

      <section class="panel">
        <div class="section-head"><div><span class="section-kicker">02</span><h2>Selecciona el día</h2></div><span class="count">${ejercicios.length} ejercicios</span></div>
        <div class="day-grid">
          ${["Lunes","Martes","Miércoles","Viernes"].map((d,i) => `<button class="day day-${i+1}" onclick="dia('${d}')"><span class="day-num">0${i+1}</span><span class="day-name">${d}</span><span class="day-arrow">↗</span></button>`).join("")}
        </div>
      </section>

      <div class="training-strip"><span class="pulse"></span><b>PROTOCOLO DIEGO</b><span>Fuerza · Control · Técnica</span></div>
      <footer>ÁGUILAS KIDS CENTER · FUERZA ESPECÍFICA DIEGO</footer>
    </main>`;
}

function loadButton(title,sub,value,current){
  const active = current === value ? " active" : "";
  return `<button class="load-option ${active}" onclick="setCarga('${value}')"><span class="load-title">${title}</span><span class="load-sub">${sub}</span><i></i></button>`;
}

function setCarga(carga){
  localStorage.setItem("fuerzaEspecificaCarga", carga);
  home();
}

function dia(d){
  diaActual = d;
  seleccion = ejercicios.filter(x => String(x["Día"]).trim().toLowerCase() === d.toLowerCase());
  document.getElementById("app").innerHTML = `
    <main class="shell day-shell">
      <button class="back top-back" onclick="home()"><span>‹</span> INICIO</button>
      <header class="day-hero">
        <div class="day-tag">FUERZA ESPECÍFICA · DIEGO</div>
        <div class="day-title-row"><div><span class="day-index">${dayNumber(d)}</span><h1>${d}</h1></div><div class="exercise-total">${seleccion.length}<small>EJERCICIOS</small></div></div>
      </header>
      <section class="panel exercise-panel">
        <div class="exercise-list-head"><span>SECUENCIA DE TRABAJO</span><span>VIDEO</span></div>
        <div class="list">
          ${seleccion.map((x,i) => `
            <button class="exercise" onclick="video(${i})">
              <span class="exercise-number">${String(i+1).padStart(2,"0")}</span>
              <span class="exercise-info"><b>${escapeHtml(x.Ejercicio)}</b><small>${escapeHtml(x.Segmento || "FUERZA ESPECÍFICA")}</small></span>
              <span class="play-chip">▶</span>
            </button>`).join("")}
        </div>
      </section>
    </main>`;
}

function dayNumber(d){ return ({"Lunes":"01","Martes":"02","Miércoles":"03","Viernes":"04"}[d] || ""); }

function video(i){
  const x = seleccion[i];
  const url = toEmbed(x.Link);
  document.getElementById("app").innerHTML = `
    <main class="video-screen" id="videoScreen">
      <div class="video-topbar">
        <button class="video-back" onclick="backFromVideo()"><span>‹</span> REGRESAR</button>
        <div class="video-brand">AKC <em>·</em> DIEGO</div>
      </div>
      <div class="video-title"><span>EJERCICIO ${String(i+1).padStart(2,"0")}</span><h1>${escapeHtml(x.Ejercicio)}</h1></div>
      <div class="fullscreen-video-wrap">
        <iframe id="exerciseVideo" src="${url}" title="${escapeHtml(x.Ejercicio)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
      </div>
      <div class="video-bottom"><span>▶ VIDEO DE EJECUCIÓN</span><span>${escapeHtml(diaActual)}</span></div>
    </main>`;

  const screen = document.getElementById("videoScreen");
  if (screen && screen.requestFullscreen) {
    try { screen.requestFullscreen(); } catch(e) {}
  }
}

function backFromVideo(){
  exitFullscreen();
  dia(diaActual);
}

function exitFullscreen(){
  if(document.fullscreenElement && document.exitFullscreen){
    try { document.exitFullscreen(); } catch(e) {}
  }
}

function toEmbed(raw){
  if(!raw) return "";
  let u = String(raw).split("?")[0];
  if(u.includes("/shorts/")) return "https://www.youtube.com/embed/" + u.split("/shorts/")[1] + "?rel=0";
  if(u.includes("watch?v=")) return "https://www.youtube.com/embed/" + u.split("watch?v=")[1] + "?rel=0";
  return u;
}

function escapeHtml(s){
  return String(s ?? "").replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}

document.addEventListener("fullscreenchange", () => {
  const screen = document.getElementById("videoScreen");
  if(screen && !document.fullscreenElement) screen.classList.add("browser-window");
});

init();
