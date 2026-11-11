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

  // Contorno del tronco de perfil (pecho adelante, espalda atrás).
  function troncoPts(j){
    const d = unit(j.S, j.H), n = ant(d), lt = Math.hypot(j.H[0]-j.S[0], j.H[1]-j.S[1]);
    const P = (t, o) => mas(mas(j.S, d, t*lt), n, o);
    return {P, n, d, lt, poly:[P(-.05,8),P(.06,13),P(.28,15.5),P(.5,12.5),P(.8,11.5),P(1.04,9.5),P(1.12,0),P(1.08,-10),P(.95,-14),P(.74,-10.5),P(.45,-13),P(.12,-13),P(-.04,-7)]};
  }
  const poly = (pts, fill, stroke, w) => `<polygon points="${pts.map(p=>f(p[0])+","+f(p[1])).join(" ")}" fill="${fill}" stroke="${stroke||"none"}" stroke-width="${w||0}" stroke-linejoin="round"/>`;
  const seg = (a, b, r, col) => `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${col}" stroke-width="${f(r*2)}" stroke-linecap="round"/>`;
  const circ = (c, r, fill, stroke, w) => `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r)}" fill="${fill}" stroke="${stroke||"none"}" stroke-width="${w||0}"/>`;
  const elip = (c, rx, ry, ang, fill) => `<ellipse cx="${f(c[0])}" cy="${f(c[1])}" rx="${f(rx)}" ry="${f(ry)}" transform="rotate(${f(ang)} ${f(c[0])} ${f(c[1])})" fill="${fill}"/>`;
  const angDe = d => Math.atan2(d[1], d[0]) * 180 / Math.PI;

  // Músculo en un segmento: lado "a" (anterior), "p" (posterior) o "t" (todo).
  function musculoSeg(a, b, r, lado, col){
    const d = unit(a, b), l = Math.hypot(b[0]-a[0], b[1]-a[1]), m = mas(a, d, l/2);
    if(lado === "t") return elip(m, l*.4, r*.78, angDe(d), col);
    const n = ant(d), s = lado === "a" ? 1 : -1;
    return elip(mas(m, n, s*r*.42), l*.38, r*.55, angDe(d), col);
  }

  function capas(j, M, lejos){
    const o = {fondo:[], cuerpo:[], brazo:[]};
    const piel = lejos ? COL.lejos : COL.piel, tono = c => lejos ? (c===COL.p ? "#ee8c8d" : "#f6c58e") : c;
    const col = k => M[k] ? tono(M[k] === 1 ? COL.p : COL.s) : null;
    const brazoSVG = (a, extra) => {
      const S = j.S; let s = seg(S, a.E, R.brazo+1.3, COL.linea) + seg(a.E, a.W, R.antebrazo+1.3, COL.linea) + circ(a.K, 5.2, COL.linea);
      s += seg(S, a.E, R.brazo, piel) + seg(a.E, a.W, R.antebrazo, piel) + circ(a.K, 3.6, piel);
      if(col("biceps")) s += musculoSeg(S, a.E, R.brazo, "a", col("biceps"));
      if(col("triceps")) s += musculoSeg(S, a.E, R.brazo, "p", col("triceps"));
      if(col("antebrazo")) s += musculoSeg(a.E, a.W, R.antebrazo, "t", col("antebrazo"));
      if(extra) s += extra;
      return s;
    };
    const piernaSVG = (l) => {
      let s = seg(j.H, l.K, R.muslo+1.3, COL.linea) + seg(l.K, l.A, R.pierna+1.3, COL.linea) + seg(l.A, l.T, R.pie+1.3, COL.linea);
      s += seg(j.H, l.K, R.muslo, piel) + seg(l.K, l.A, R.pierna, piel) + seg(l.A, l.T, R.pie, piel);
      if(col("cuadriceps")) s += musculoSeg(j.H, l.K, R.muslo, "a", col("cuadriceps"));
      if(col("femoral")) s += musculoSeg(j.H, l.K, R.muslo, "p", col("femoral"));
      if(col("gemelos")) s += musculoSeg(l.K, l.A, R.pierna, "p", col("gemelos"));
      return s;
    };
    if(lejos){
      o.fondo.push(piernaSVG(j.l2), brazoSVG(j.a2));
      return o;
    }
    const T = troncoPts(j);
    let c = poly(T.poly, COL.linea, COL.linea, 2.6) + seg(j.S, j.N, 4.8, COL.linea) + circ(j.C, L.cabeza+1.3, COL.linea);
    c += poly(T.poly, piel) + seg(j.S, j.N, 3.6, piel) + circ(j.C, L.cabeza, piel);
    const tm = (k, t, off, rx, ry) => col(k) ? elip(mas(T.P(t, off), [0,0]), rx, ry, angDe(T.d), col(k)) : "";
    c += tm("pecho", .2, 8.6, 9.5, 5.6) + tm("abdomen", .62, 6.8, 13, 4.6) + tm("dorsal", .36, -7.8, 14, 5.8) + tm("lumbar", .76, -6.2, 8.5, 4.4) + tm("trapecio", .04, -6.6, 7.5, 5) + tm("gluteo", .98, -8.2, 8, 7);
    if(col("trapecio")) c += seg(j.S, mas(j.S, unit(j.S, j.N), 4), 1.8, col("trapecio"));
    if(col("deltoides")) c += circ(j.S, 6, col("deltoides"));
    if(col("deltoidesPost")) c += elip(mas(j.S, T.n, -2.2), 4.2, 5.6, angDe(T.d), col("deltoidesPost"));
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
