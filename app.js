let ejercicios = [];
let seleccion = [];

const AKC_LOGO = "https://github.com/josemanueljaimemorales/GAV-APP-AKC/blob/main/logo.png?raw=true";

async function init(){
  const res = await fetch("Fuerza_Especifica_Diego.xlsx");
  const buf = await res.arrayBuffer();
  const wb = XLSX.read(buf);
  ejercicios = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {defval:""});
  home();
}

function home(){
  document.getElementById("app").innerHTML = `
    <main class="shell">
      <header class="hero">
        <img class="logo" src="${AKC_LOGO}" alt="AKC">
        <div>
          <div class="eyebrow">AKC · FUERZA</div>
          <h1>FUERZA ESPECÍFICA DIEGO</h1>
          <p>DIEGO · Plataforma de fuerza individual</p>
        </div>
      </header>

      <section class="panel">
        <h2>Semana de trabajo</h2>
        <div class="load-grid">
          <button onclick="setCarga('ALTA · 3x8 · Peso máximo')">ALTA<br><small>3×8 · Peso máximo</small></button>
          <button onclick="setCarga('MEDIA · 3x10 · Peso medio')">MEDIA<br><small>3×10 · Peso medio</small></button>
          <button onclick="setCarga('BAJA · 3x12 · Peso bajo')">BAJA<br><small>3×12 · Peso bajo</small></button>
        </div>
      </section>

      <section class="panel">
        <h2>Días</h2>
        <div class="day-grid">
          ${["Lunes","Martes","Miércoles","Viernes"].map(d =>
            `<button class="day" onclick="dia('${d}')">${d}</button>`).join("")}
        </div>
      </section>

      <footer>AKC · FUERZA ESPECÍFICA DIEGO</footer>
    </main>`;
}

function setCarga(carga){
  localStorage.setItem("fuerzaEspecificaCarga", carga);
  home();
}

function dia(d){
  seleccion = ejercicios.filter(x => String(x["Día"]).trim().toLowerCase() === d.toLowerCase());
  document.getElementById("app").innerHTML = `
    <main class="shell">
      <button class="back" onclick="home()">← Regresar</button>
      <header class="hero compact">
        <img class="logo" src="${AKC_LOGO}" alt="AKC">
        <div><div class="eyebrow">FUERZA ESPECÍFICA DIEGO</div><h1>${d}</h1></div>
      </header>
      <section class="panel">
        <div class="list">
          ${seleccion.map((x,i) => `
            <button class="exercise" onclick="video(${i})">
              <span>${String(i+1).padStart(2,"0")}</span>
              <b>${escapeHtml(x.Ejercicio)}</b>
              <small>›</small>
            </button>`).join("")}
        </div>
      </section>
    </main>`;
}

function video(i){
  const x = seleccion[i];
  const url = toEmbed(x.Link);
  document.getElementById("app").innerHTML = `
    <main class="shell">
      <button class="back" onclick="home()">← Inicio</button>
      <section class="panel video-panel">
        <div class="eyebrow">EJERCICIO</div>
        <h1>${escapeHtml(x.Ejercicio)}</h1>
        <div class="video-wrap">
          <iframe src="${url}" title="${escapeHtml(x.Ejercicio)}" allowfullscreen></iframe>
        </div>
        <button class="back lower" onclick="dia('${escapeHtml(x.Día)}')">← ${escapeHtml(x.Día)}</button>
      </section>
    </main>`;
}

function toEmbed(raw){
  if(!raw) return "";
  let u = String(raw).split("?")[0];
  if(u.includes("/shorts/")) return "https://www.youtube.com/embed/" + u.split("/shorts/")[1];
  if(u.includes("watch?v=")) return "https://www.youtube.com/embed/" + u.split("watch?v=")[1];
  return u;
}

function escapeHtml(s){
  return String(s ?? "").replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

init();
