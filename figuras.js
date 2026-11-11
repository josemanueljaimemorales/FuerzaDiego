// Pictogramas de cada ejercicio (dibujo propio, estilo de las calcomanías de las máquinas):
// figura de perfil mirando a la derecha, posición inicial tenue y final sólida, flecha del movimiento
// y en color los músculos que trabaja (rojo = principal, naranja = secundario).
(function(){
  const L = {torso:46, cuello:6, cabeza:8.5, brazo:27, antebrazo:24, mano:7, muslo:37, pierna:35, pie:13};
  const R = {brazo:5, antebrazo:4.2, muslo:7.2, pierna:5.2, pie:3};
  const COL = {linea:"#ffffff", piel:"#34404d", lejos:"#a7b0ba", p:"#e5383b", s:"#f7a440", eq:"#8b96a3", fantasma:"#b9c1ca", flecha:"#168cff"};
  const rad = a => a * Math.PI / 180;
  const dir = a => [Math.sin(rad(a)), Math.cos(rad(a))];
  const mas = (p, v, k=1) => [p[0] + v[0]*k, p[1] + v[1]*k];
  const unit = (a, b) => { const dx=b[0]-a[0], dy=b[1]-a[1], l=Math.hypot(dx,dy)||1; return [dx/l, dy/l]; };
  const ant = d => [d[1], -d[0]]; // lado anterior de un segmento (de proximal a distal)
  const f = n => Math.round(n*10)/10;

  function articular(p){
    const j = {}, q = Object.assign({tronco:180, brazo:0, antebrazo:0, muslo:0, pierna:0, pie:90}, p);
    if(q.relativos){ // brazos dados como si el tronco estuviera derecho: giran con el tronco
      const g = q.tronco - 180;
      for(const k of ["brazo","antebrazo","mano","brazo2","antebrazo2","mano2"]) if(q[k] != null) q[k] += g;
    }
    j.H = q.cadera || [100,100];
    const dt = dir(q.tronco);
    j.S = mas(j.H, dt, L.torso + (q.encoge||0));
    j.N = mas(j.S, dt, L.cuello);
    j.C = mas(j.N, dir(q.tronco + (q.cabeza||0)), L.cabeza);
    const brazo = (a, b, m, k) => { const E = mas(j.S, dir(a), L.brazo*(k||1)); const W = mas(E, dir(b), L.antebrazo); return {E, W, K: mas(W, dir(m ?? b), L.mano)}; };
    const pierna = (m, p, pie) => { const K = mas(j.H, dir(m), L.muslo); const A = mas(K, dir(p), L.pierna); return {K, A, T: mas(A, dir(pie), L.pie)}; };
    j.a1 = brazo(q.brazo, q.antebrazo, q.mano, q.brazoLargo);
    j.a2 = brazo(q.brazo2 ?? q.brazo, q.antebrazo2 ?? q.antebrazo, q.mano2 ?? q.mano, q.brazoLargo);
    j.l1 = pierna(q.muslo, q.pierna, q.pie);
    j.l2 = pierna(q.muslo2 ?? q.muslo, q.pierna2 ?? q.pierna, q.pie2 ?? q.pie);
    if(q.ancla){ // mueve la figura para que un punto quede fijo (p. ej. el pie en el piso)
      const [ruta, destino] = q.ancla; const pt = ruta.split(".").reduce((o,k)=>o[k], j);
      const dx = destino[0]-pt[0], dy = destino[1]-pt[1];
      const mover = o => { for(const k in o){ const v=o[k]; if(Array.isArray(v)) o[k]=[v[0]+dx, v[1]+dy]; else if(v && typeof v==="object") mover(v); } };
      mover(j);
    }
    j.q = q;
    return j;
  }

  // Contorno del tronco de perfil, en V: pecho y dorsal anchos, cintura delgada, glúteo marcado.
  const FRENTE = [[-.05,9],[.05,15],[.2,18],[.34,15.5],[.48,12],[.75,11],[1.0,10.5],[1.1,6]];
  const ESPALDA = [[-.05,-7],[.02,-12],[.15,-15.5],[.36,-16],[.6,-11.5],[.8,-11.5],[.95,-15.5],[1.08,-12],[1.13,-2]];
  const interp = (tab, t) => { if(t <= tab[0][0]) return tab[0][1]; for(let i=1;i<tab.length;i++){ if(t <= tab[i][0]){ const [t0,v0]=tab[i-1], [t1,v1]=tab[i]; return v0 + (v1-v0)*(t-t0)/(t1-t0); } } return tab[tab.length-1][1]; };
  function troncoPts(j){
    const d = unit(j.S, j.H), n = ant(d), lt = Math.hypot(j.H[0]-j.S[0], j.H[1]-j.S[1]);
    const P = (t, o) => mas(mas(j.S, d, t*lt), n, o);
    return {P, n, d, lt, poly:[...FRENTE.map(([t,o])=>P(t,o)), ...ESPALDA.slice().reverse().map(([t,o])=>P(t,o))]};
  }
  // Camino suave (Catmull-Rom) cerrado o abierto.
  function suave(pts, cerrado=true){
    const n = pts.length, g = i => pts[cerrado ? (i+n)%n : Math.max(0, Math.min(n-1, i))];
    let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
    for(let i=0; i<(cerrado ? n : n-1); i++){
      const p0=g(i-1), p1=g(i), p2=g(i+1), p3=g(i+2);
      const c1=[p1[0]+(p2[0]-p0[0])/6, p1[1]+(p2[1]-p0[1])/6], c2=[p2[0]-(p3[0]-p1[0])/6, p2[1]-(p3[1]-p1[1])/6];
      d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
    }
    return d + (cerrado ? "Z" : "");
  }
  const path = (d, fill, stroke, w, extra) => `<path d="${d}" fill="${fill}" stroke="${stroke||"none"}" stroke-width="${w||0}" stroke-linejoin="round" stroke-linecap="round"${extra||""}/>`;
  const poly = (pts, fill, stroke, w) => `<polygon points="${pts.map(p=>f(p[0])+","+f(p[1])).join(" ")}" fill="${fill}" stroke="${stroke||"none"}" stroke-width="${w||0}" stroke-linejoin="round"/>`;
  const seg = (a, b, r, col) => `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${col}" stroke-width="${f(r*2)}" stroke-linecap="round"/>`;
  const circ = (c, r, fill, stroke, w) => `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r)}" fill="${fill}" stroke="${stroke||"none"}" stroke-width="${w||0}"/>`;
  const elip = (c, rx, ry, ang, fill) => `<ellipse cx="${f(c[0])}" cy="${f(c[1])}" rx="${f(rx)}" ry="${f(ry)}" transform="rotate(${f(ang)} ${f(c[0])} ${f(c[1])})" fill="${fill}"/>`;
  const angDe = d => Math.atan2(d[1], d[0]) * 180 / Math.PI;

  // Perfiles de grosor (mitad anterior y posterior) a lo largo de cada segmento: dan la forma del músculo.
  const bump = (t, c, w) => Math.exp(-(((t-c)/w)**2));
  const PERFIL = {
    brazo:    {a:t => 4.3 + 2.7*bump(t,.55,.28), p:t => 4.6 + 2.6*bump(t,.36,.3)},
    antebrazo:{a:t => 3.7 + 1.8*bump(t,.24,.28) - .9*t, p:t => 3.9 + 1.6*bump(t,.2,.28) - 1*t},
    muslo:    {a:t => 6.6 + 3*bump(t,.42,.33) - 1.4*t, p:t => 6.8 + 2.4*bump(t,.5,.33) - 1.2*t},
    pierna:   {a:t => 4.2 - 1.1*t, p:t => 4.5 + 3.2*bump(t,.28,.22) - 1.7*t},
    pie:      {a:t => 2.6 - .8*t, p:t => 3 - .6*t},
  };
  function lado(a, b, pf, s, t0=0, t1=1, k=1, k0=0, redondo=false){
    const d = unit(a, b), n = ant(d), l = Math.hypot(b[0]-a[0], b[1]-a[1]), pts = [];
    for(let i=0;i<=12;i++){ const t = t0 + (t1-t0)*i/12, r = redondo ? Math.pow(Math.sin(Math.PI*i/12), .6) : 1; pts.push(mas(mas(a, d, t*l), n, s*pf(t)*(k0 + (k-k0)*r))); }
    if(k0 !== null) for(let i=12;i>=0;i--){ const t = t0 + (t1-t0)*i/12; pts.push(mas(mas(a, d, t*l), n, s*pf(t)*k0)); }
    return pts;
  }
  function forma(a, b, P){ // contorno completo de un segmento musculoso
    const ida = lado(a, b, P.a, 1, 0, 1, 1, null), vuelta = lado(a, b, P.p, -1, 0, 1, 1, null).reverse();
    return suave([...ida, ...vuelta]);
  }
  // Región de un músculo: sigue el borde abultado del segmento.
  function musculo(a, b, P, s, t0, t1, col){
    const pf = s > 0 ? P.a : P.p;
    return path(suave(lado(a, b, pf, s, t0, t1, .9, .08, true)), col);
  }
  // Brillo para dar volumen.
  function brillo(a, b, P, col){
    return path(suave(lado(a, b, P.a, 1, .12, .88, .55, null), false), "none", col, 1.6);
  }

  function capas(j, M, lejos){
    const o = {fondo:[], cuerpo:[], brazo:[]};
    const piel = lejos ? COL.lejos : COL.piel, luz = lejos ? "#c3cad2" : "#4e5d6e", linea = lejos ? "#bdc4cc" : "#55657a";
    const tono = c => lejos ? (c===COL.p ? "#ee8c8d" : "#f6c58e") : c;
    const col = k => M[k] ? tono(M[k] === 1 ? COL.p : COL.s) : null;
    const contorno = (d) => path(d, COL.linea, COL.linea, 2.6);
    const relleno = (d) => path(d, piel);
    const brazoSVG = (a) => {
      const S = j.S, PB = PERFIL.brazo, PA = PERFIL.antebrazo;
      const fb = forma(S, a.E, PB), fa = forma(a.E, a.W, PA);
      let s = contorno(fa) + circ(a.K, 5.3, COL.linea) + contorno(fb) + circ(S, 8.6, COL.linea);
      s += relleno(fa) + circ(a.K, 4, piel) + relleno(fb) + circ(S, 7.4, piel);
      s += brillo(a.E, a.W, PA, luz) + brillo(S, a.E, PB, luz);
      if(col("biceps")) s += musculo(S, a.E, PB, 1, .2, .9, col("biceps"));
      if(col("triceps")) s += musculo(S, a.E, PB, -1, .12, .85, col("triceps"));
      if(col("antebrazo")) s += musculo(a.E, a.W, PA, 1, .05, .8, col("antebrazo")) + musculo(a.E, a.W, PA, -1, .05, .8, col("antebrazo"));
      // hombro (deltoides) redondo encima del brazo
      const d = unit(S, a.E);
      s += circ(S, 7.4, piel);
      if(col("deltoides")) s += circ(S, 6.6, col("deltoides"));
      else if(col("deltoidesPost")) s += path(suave([mas(S,[0,0]), ...[0,1,2,3,4,5,6].map(i=>{ const ang=angDe(ant(d))*Math.PI/180 + Math.PI/2 + i*Math.PI/6; return [S[0]+Math.cos(ang)*6.6, S[1]+Math.sin(ang)*6.6]; })]), col("deltoidesPost"));
      else s += path(suave(lado(S, a.E, PB.a, 1, 0, .25, .6, null), false), "none", luz, 1.4);
      return s;
    };
    const piernaSVG = (l) => {
      const PM = PERFIL.muslo, PP = PERFIL.pierna, PI = PERFIL.pie;
      const fm = forma(j.H, l.K, PM), fp = forma(l.K, l.A, PP), fi = forma(l.A, l.T, PI);
      let s = contorno(fi) + contorno(fp) + contorno(fm) + circ(l.K, 5.6, COL.linea) + circ(l.A, 4.2, COL.linea);
      s += relleno(fi) + relleno(fp) + circ(l.A, 3, piel) + relleno(fm) + circ(l.K, 4.4, piel);
      s += brillo(j.H, l.K, PM, luz) + brillo(l.K, l.A, PP, luz);
      if(col("cuadriceps")) s += musculo(j.H, l.K, PM, 1, .12, .92, col("cuadriceps"));
      if(col("femoral")) s += musculo(j.H, l.K, PM, -1, .15, .9, col("femoral"));
      if(col("gemelos")) s += musculo(l.K, l.A, PP, -1, .08, .7, col("gemelos"));
      return s;
    };
    if(lejos){
      o.fondo.push(piernaSVG(j.l2), brazoSVG(j.a2));
      return o;
    }
    const T = troncoPts(j), dT = suave(T.poly);
    const dir2 = unit(j.S, j.N), cuello = [mas(j.S, ant(dir2), 4.5), mas(j.N, ant(dir2), 3.5), mas(j.N, ant(dir2), -4), mas(j.S, ant(dir2), -7)];
    let c = path(dT, COL.linea, COL.linea, 2.6) + poly(cuello, COL.linea, COL.linea, 2.6) + circ(j.C, L.cabeza+1.3, COL.linea);
    c += path(dT, piel) + poly(cuello, piel) + circ(j.C, L.cabeza, piel);
    // líneas de definición: pecho, abdomen y dorsal
    const ln = (pts) => path(suave(pts, false), "none", linea, 1.2);
    c += ln([T.P(.36,14), T.P(.38,8), T.P(.33,3)]) + ln([T.P(.52,9.5), T.P(.52,4)]) + ln([T.P(.66,9.5), T.P(.66,4.5)]) + ln([T.P(.8,9.5), T.P(.8,4.5)]) + ln([T.P(.14,-12), T.P(.36,-12.5), T.P(.6,-9)]);
    // músculos del tronco: siguen el contorno
    const reg = (tab, s, t0, t1, k0, k1, col) => { const ida=[], vuelta=[]; for(let i=0;i<=12;i++){ const t=t0+(t1-t0)*i/12, o=interp(tab,t), r=Math.pow(Math.sin(Math.PI*i/12), .5); ida.push(T.P(t, o*(k0+(k1-k0)*r))); vuelta.push(T.P(t, o*k0)); } return path(suave([...ida, ...vuelta.reverse()]), col); };
    if(col("pecho")) c += reg(FRENTE, 1, .05, .37, .25, .9, col("pecho"));
    if(col("abdomen")) c += reg(FRENTE, 1, .44, 1.0, .3, .88, col("abdomen"));
    if(col("dorsal")) c += reg(ESPALDA, -1, .1, .64, .25, .9, col("dorsal"));
    if(col("lumbar")) c += reg(ESPALDA, -1, .64, .9, .2, .88, col("lumbar"));
    if(col("trapecio")) c += reg(ESPALDA, -1, -.04, .2, .2, .88, col("trapecio")) + path(suave([mas(j.S, ant(dir2), -6.5), mas(j.N, ant(dir2), -3.6), mas(j.N, ant(dir2), -1), mas(j.S, ant(dir2), -2)]), col("trapecio"));
    if(col("gluteo")) c += reg(ESPALDA, -1, .86, 1.1, .1, .9, col("gluteo"));
    // la pierna de adelante va sobre el tronco
    c += piernaSVG(j.l1);
    o.cuerpo.push(c);
    o.brazo.push(brazoSVG(j.a1));
    return o;
  }

  function fantasma(j){
    const g = COL.fantasma, T = troncoPts(j); let s = "";
    s += poly(T.poly, "none", g, 1.6) + circ(j.C, L.cabeza, "none", g, 1.6);
    for(const a of [j.a1]) s += seg(j.S, a.E, 1, g) + seg(a.E, a.W, 1, g) + seg(a.W, a.K, 1, g);
    for(const l of [j.l1]) s += seg(j.H, l.K, 1, g) + seg(l.K, l.A, 1, g) + seg(l.A, l.T, 1, g);
    return `<g opacity=".55" stroke-dasharray="3 2">${s.replace(/stroke-linecap="round"/g,'stroke-linecap="round" stroke-dasharray="3 3"')}</g>`;
  }

  // ---- Equipo ----
  const EQ = {
    barra(c){ return circ(c, 11.5, "#dfe4e9", COL.eq, 3) + circ(c, 7, "none", COL.eq, 1.2) + circ(c, 2.6, COL.eq); }, // de perfil se ve el disco
    barraSola(c){ return circ(c, 2.8, COL.eq); },
    disco(c, r=11){ return circ(c, r, "#fff", COL.eq, 3.2) + circ(c, 2.5, COL.eq); },
    mancuernaFrente(c){ return circ(c, 6.5, "#dfe4e9", COL.eq, 2.6) + circ(c, 1.8, COL.eq); },
    mancuerna(c, ang=90){ const d = dir(ang); return seg(mas(c,d,-7), mas(c,d,7), 1.6, COL.eq) + seg(mas(c,d,-8), mas(c,d,-4), 4.5, COL.eq) + seg(mas(c,d,4), mas(c,d,8), 4.5, COL.eq); },
    cable(a, b){ return `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${COL.eq}" stroke-width="1.3"/>` + circ(b, 4, "#fff", COL.eq, 2); },
    banco(a, b, alto=0, pata=true){ let s = seg(a, b, 4.5, COL.eq); if(pata){ const m=[(a[0]+b[0])/2, (a[1]+b[1])/2]; s = seg(m, [m[0], m[1]+alto], 2, COL.eq) + seg([m[0]-10, m[1]+alto], [m[0]+10, m[1]+alto], 2, COL.eq) + s; } return s; },
    piso(x1, x2, y){ return `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${COL.eq}" stroke-width="1.4" opacity=".5"/>`; },
    poste(x, y1, y2){ return seg([x, y1], [x, y2], 2.5, COL.eq); },
    plataforma(A, T){ const d = unit(A, T), n = ant(d), c = mas(mas(A, d, 7), n, -4.5); return seg(mas(c, d, -16), mas(c, d, 16), 3, COL.eq); },
    flechaLibre(a, b){ return flecha(mas(a,[0,0]), b, 0); },
    rodillo(c){ return circ(c, 5, "#fff", COL.eq, 2.6); },
  };

  function flecha(a, b, off=9){
    const d = unit(a, b), l = Math.hypot(b[0]-a[0], b[1]-a[1]); if(l < 6) return "";
    const n = ant(d), p1 = mas(mas(a, n, off), d, l*.15), p2 = mas(mas(b, n, off), d, -l*.1);
    const h1 = mas(mas(p2, d, -6), n, 4), h2 = mas(mas(p2, d, -6), n, -4);
    return `<line x1="${f(p1[0])}" y1="${f(p1[1])}" x2="${f(p2[0])}" y2="${f(p2[1])}" stroke="${COL.flecha}" stroke-width="2.4" stroke-linecap="round"/>` + poly([p2,h1,h2], COL.flecha);
  }

  function dibujar(def){
    const A = def.inicio ? articular(Object.assign({}, def.base, def.inicio)) : null;
    const B = articular(Object.assign({}, def.base, def.fin || {}));
    const M = def.musculos || {};
    const cap1 = capas(B, M, true), cap2 = capas(B, M, false);
    const eqA = def.equipo ? def.equipo(B, EQ, A) : {atras:"", adelante:""};
    let mover = "";
    if(A && def.mueve !== false){ const r = (def.mueve || "a1.K").split("."); const g = j => r.reduce((o,k)=>o[k], j); mover = flecha(g(A), g(B)); }
    const body = (A ? fantasma(A) : "") + (eqA.atras||"") + cap1.fondo.join("") + cap2.cuerpo.join("") + (eqA.medio||"") + cap2.brazo.join("") + (eqA.adelante||"") + mover;
    return body;
  }

  function caja(svgBody){ // calcula el recuadro a partir de un dibujo de prueba en el DOM
    return svgBody;
  }

  const D = {}; // definiciones por ejercicio
  window.FIGURAS = {D, dibujar, articular, EQ};

  // Recuadro: se mide el dibujo en un SVG oculto y se deja un margen.
  let medidor = null;
  function medir(body){
    if(!medidor){ medidor = document.createElementNS("http://www.w3.org/2000/svg","svg"); medidor.setAttribute("style","position:absolute;left:-9999px;top:0;width:10px;height:10px;visibility:hidden"); document.body.appendChild(medidor); }
    medidor.innerHTML = body; const b = medidor.getBBox(); medidor.innerHTML = "";
    const m = 8, lado = Math.max(b.width, b.height) + m*2;
    return [f(b.x + b.width/2 - lado/2), f(b.y + b.height/2 - lado/2), f(lado), f(lado)];
  }
  const cache = {};
  window.figuraSVG = function(nombre){
    const k = normal(nombre), def = D[k]; if(!def) return "";
    if(cache[k]) return cache[k];
    const body = dibujar(def), vb = def.vista || medir(body);
    const svg = `<svg class="fig-svg" viewBox="${vb.join(" ")}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${nombre}"><rect x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" rx="14" fill="#fff"/>${body}</svg>`;
    return cache[k] = svg;
  };
  function normal(s){ return String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g," ").trim(); }
  window.FIGURAS.normal = normal;
  window.FIGURAS.def = (nombre, d) => { D[normal(nombre)] = d; };
})();
