// Postura de cada ejercicio para figuras.js: ángulos en grados (0 = abajo, 90 = adelante, 180 = arriba, -90 = atrás).
(function(){
  const def = FIGURAS.def, P = 186; // altura del piso
  const parado = {tronco:180, muslo:0, pierna:0, pie:90, ancla:["l1.A",[100,P]]};
  const sentado = (x=100, y=140) => ({tronco:180, muslo:90, pierna:0, pie:90, cadera:[x,y]});
  const mano = j => j.a1.K;
  const centroMano = j => [(j.a1.W[0]+j.a1.K[0])/2, (j.a1.W[1]+j.a1.K[1])/2];
  const piso = (E) => E.piso(40, 170, P+4);
  const sobreHombro = j => [j.S[0]-2, j.S[1]-5];

  // ===== LUNES =====
  def("Press de banca con barra", {
    base:{tronco:-90, cadera:[118,120], muslo:70, pierna:5, pie:90, brazo2:null},
    inicio:{brazo:15, antebrazo:175}, fin:{brazo:180, antebrazo:180},
    musculos:{pecho:1, deltoides:2, triceps:2},
    equipo:(j,E)=>({atras:E.banco([j.H[0]+8, j.H[1]+12],[j.S[0]-14, j.S[1]+12], 22), adelante:E.barra(centroMano(j))})
  });
  def("Press militar con barra", {
    base:parado, inicio:{brazo:40, antebrazo:175}, fin:{brazo:178, antebrazo:180},
    musculos:{deltoides:1, triceps:2, trapecio:2},
    equipo:(j,E)=>({atras:piso(E), adelante:E.barra(centroMano(j))})
  });
  def("Press inclinado 45° con barra", {
    base:{tronco:-135, cadera:[110,140], muslo:80, pierna:0, pie:90},
    inicio:{brazo:-10, antebrazo:172}, fin:{brazo:170, antebrazo:170},
    musculos:{pecho:1, deltoides:1, triceps:2},
    equipo:(j,E)=>({atras:E.banco([j.H[0]+10, j.H[1]+10],[j.H[0]-6, j.H[1]+10], 30, false)+E.banco([j.H[0]-10, j.H[1]+6],[j.S[0]-16, j.S[1]+2], 0, false)+E.poste(j.H[0], j.H[1]+12, j.H[1]+40), adelante:E.barra(centroMano(j))})
  });
  def("Jalón al pecho", {
    base:{tronco:195, cadera:[100,140], muslo:90, pierna:0, pie:90},
    inicio:{brazo:172, antebrazo:172}, fin:{brazo:-25, antebrazo:165},
    musculos:{dorsal:1, biceps:2, deltoidesPost:2, antebrazo:2},
    equipo:(j,E)=>({atras:E.banco([j.H[0]-12, j.H[1]+9],[j.H[0]+14, j.H[1]+9], 30)+E.rodillo([j.l1.K[0]-4, j.l1.K[1]-11]), adelante:E.cable(mano(j), [mano(j)[0], 20])+E.barraSola(centroMano(j))})
  });
  def("Remo con mancuerna a una mano", {
    base:{tronco:95, cadera:[92,110], muslo:-8, pierna:2, pie:90, muslo2:5, pierna2:-90, pie2:-90, brazo2:2, antebrazo2:2},
    inicio:{brazo:2, antebrazo:2}, fin:{brazo:-115, antebrazo:5},
    musculos:{dorsal:1, deltoidesPost:2, biceps:2, trapecio:2},
    equipo:(j,E)=>({atras:E.banco([j.l2.K[0]-24, j.l2.K[1]+6],[j.a2.K[0]+6, j.l2.K[1]+6], 26)+E.piso(40,170,j.l1.A[1]+4), adelante:E.mancuernaFrente(centroMano(j))})
  });
  def("Face pull en polea", {
    base:parado, inicio:{brazo:95, antebrazo:92}, fin:{brazo:-95, antebrazo:118},
    musculos:{deltoidesPost:1, trapecio:1, dorsal:2},
    equipo:(j,E)=>({atras:piso(E)+E.poste(178, 40, P+4), adelante:E.cable(mano(j), [176, mano(j)[1]])})
  });
  def("Extensión de tríceps en polea sobre la cabeza", {
    base:Object.assign({}, parado, {tronco:160, muslo:-12, muslo2:14, pierna2:0}),
    inicio:{brazo:165, antebrazo:-80}, fin:{brazo:155, antebrazo:150},
    musculos:{triceps:1},
    equipo:(j,E)=>({atras:piso(E)+E.poste(30, 30, P+4), adelante:E.cable(mano(j), [32, 36])})
  });
  def("Curl de bíceps con mancuerna a 30°", {
    base:{tronco:205, cadera:[100,140], muslo:80, pierna:0, pie:90},
    inicio:{brazo:-5, antebrazo:-5}, fin:{brazo:-5, antebrazo:150},
    musculos:{biceps:1, antebrazo:2},
    equipo:(j,E)=>({atras:E.banco([j.H[0]+12, j.H[1]+9],[j.H[0]-8, j.H[1]+9], 30)+E.banco([j.H[0]-10, j.H[1]+4],[j.S[0]-12, j.S[1]-4], 0, false), adelante:E.mancuernaFrente(centroMano(j))})
  });
  def("Curl de muñeca con mancuerna (3 formas)", {
    base:{tronco:160, cadera:[90,140], muslo:90, pierna:0, pie:90, brazo:28, antebrazo:92},
    inicio:{mano:20}, fin:{mano:150},
    musculos:{antebrazo:1},
    equipo:(j,E)=>({atras:E.banco([j.H[0]-14, j.H[1]+9],[j.H[0]+12, j.H[1]+9], 30), adelante:E.mancuernaFrente(j.a1.K)})
  });

  // ===== MARTES =====
  def("Sentadilla con barra", {
    base:Object.assign({}, parado, {brazo:-55, antebrazo:150}),
    inicio:{}, fin:{tronco:145, muslo:82, pierna:-28},
    mueve:"H", musculos:{cuadriceps:1, gluteo:1, femoral:2, lumbar:2},
    equipo:(j,E)=>({atras:piso(E), medio:E.barra(sobreHombro(j))})
  });
  def("Peso muerto rumano", {
    base:parado, inicio:{}, fin:{tronco:98, muslo:12, pierna:-4},
    mueve:"S", musculos:{femoral:1, gluteo:1, lumbar:1, antebrazo:2},
    equipo:(j,E)=>({atras:piso(E), adelante:E.barra(centroMano(j))})
  });
  def("Prensa de piernas", {
    base:{tronco:-120, cadera:[80,150], pie:120},
    inicio:{muslo:170, pierna:80}, fin:{muslo:130, pierna:130},
    mueve:"l1.A", musculos:{cuadriceps:1, gluteo:2, femoral:2},
    equipo:(j,E)=>({atras:E.banco([j.H[0]+6, j.H[1]+10],[j.S[0]-6, j.S[1]+10], 0, false), adelante:E.plataforma(j.l1.A, j.l1.T)})
  });
  def("Hip thrust en máquina", {
    base:{pie:90, ancla:["l1.A",[130,P]], brazo:-8, antebrazo:8},
    inicio:{tronco:-115, muslo:115, pierna:-5}, fin:{tronco:-92, muslo:88, pierna:0},
    mueve:"H", musculos:{gluteo:1, femoral:2},
    equipo:(j,E)=>({atras:piso(E)+E.banco([j.S[0]-14, j.S[1]+12],[j.S[0]+6, j.S[1]+12], P+4-(j.S[1]+12)), adelante:E.rodillo([j.H[0]+2, j.H[1]-11])})
  });
  def("Curl femoral en máquina", {
    base:sentado(100,140), inicio:{pierna:85}, fin:{pierna:-15},
    mueve:"l1.A", musculos:{femoral:1, gemelos:2},
    equipo:(j,E)=>({atras:E.banco([j.H[0]-12, j.H[1]+9],[j.H[0]+30, j.H[1]+9], 34)+E.banco([j.H[0]-12, j.H[1]+6],[j.S[0]-12, j.S[1]], 0, false), adelante:E.rodillo([j.l1.A[0]+3, j.l1.A[1]+5])})
  });
  def("Extensión de cuádriceps en máquina", {
    base:sentado(100,140), inicio:{pierna:0}, fin:{pierna:88},
    mueve:"l1.A", musculos:{cuadriceps:1},
    equipo:(j,E)=>({atras:E.banco([j.H[0]-12, j.H[1]+9],[j.H[0]+30, j.H[1]+9], 34)+E.banco([j.H[0]-12, j.H[1]+6],[j.S[0]-12, j.S[1]], 0, false), adelante:E.rodillo([j.l1.A[0]+2, j.l1.A[1]-7])})
  });
  def("Extensión lumbar a una pierna", {
    base:{cadera:[100,110], muslo:-55, pierna:-55, pie:30, muslo2:-78, pierna2:-78, pie2:10, brazo:25, antebrazo:160, relativos:true},
    inicio:{tronco:30}, fin:{tronco:122},
    mueve:"C", musculos:{lumbar:1, gluteo:1, femoral:2},
    equipo:(j,E)=>({atras:E.banco([j.H[0]-6, j.H[1]+8],[j.H[0]+10, j.H[1]-4], 0, false)+E.poste(j.H[0]+2, j.H[1]+6, P+4)+E.rodillo([j.l1.A[0]-4, j.l1.A[1]+6])+E.piso(30,170,P+4)})
  });
  def("Elevación de talones con mancuerna", {
    base:{tronco:180, muslo:0, pierna:0, brazo:0, antebrazo:0},
    inicio:{pie:90, ancla:["l1.T",[112,P]]}, fin:{pie:40, ancla:["l1.T",[112,P]]},
    mueve:"H", musculos:{gemelos:1},
    equipo:(j,E)=>({atras:piso(E), adelante:E.mancuerna(centroMano(j), 90)})
  });
  def("Crunch en polea", {
    base:{cadera:[100,138], muslo:5, pierna:-90, pie:-90, brazo:150, antebrazo:-30, relativos:true},
    inicio:{tronco:172}, fin:{tronco:88},
    mueve:"C", musculos:{abdomen:1},
    equipo:(j,E)=>({atras:E.piso(40,170,j.l1.A[1]+5)+E.poste(108, 18, j.l1.A[1]+5), adelante:E.cable(mano(j), [108, 24])})
  });

  // ===== MIÉRCOLES =====
  def("Jalón al pecho agarre abierto", {
    base:{tronco:195, cadera:[100,140], muslo:90, pierna:0, pie:90},
    inicio:{brazo:168, antebrazo:168}, fin:{brazo:-35, antebrazo:160},
    musculos:{dorsal:1, deltoidesPost:2, biceps:2},
    equipo:(j,E)=>({atras:E.banco([j.H[0]-12, j.H[1]+9],[j.H[0]+14, j.H[1]+9], 30)+E.rodillo([j.l1.K[0]-4, j.l1.K[1]-11]), adelante:E.cable(mano(j), [mano(j)[0], 20])})
  });
  def("Remo Pendlay con barra", {
    base:Object.assign({}, parado, {tronco:92, muslo:18, pierna:-8}),
    inicio:{brazo:2, antebrazo:2}, fin:{brazo:-110, antebrazo:8},
    musculos:{dorsal:1, trapecio:2, deltoidesPost:2, lumbar:2, biceps:2},
    equipo:(j,E)=>({atras:piso(E), adelante:E.barra(centroMano(j))})
  });
  def("Remo sentado en polea", {
    base:{tronco:180, cadera:[80,150], muslo:80, pierna:100, pie:180},
    inicio:{tronco:165, brazo:92, antebrazo:92}, fin:{tronco:185, brazo:-60, antebrazo:85},
    musculos:{dorsal:1, trapecio:2, deltoidesPost:2, biceps:2},
    equipo:(j,E)=>({atras:E.banco([j.H[0]-14, j.H[1]+9],[j.l1.A[0]+10, j.H[1]+9], 22, false)+E.poste(176, 80, j.H[1]+20), adelante:E.cable(mano(j), [174, mano(j)[1]])})
  });
  def("Jalón unilateral en polea alta", {
    base:parado, inicio:{brazo:160, antebrazo:160}, fin:{brazo:-15, antebrazo:150},
    musculos:{dorsal:1, biceps:2},
    equipo:(j,E)=>({atras:piso(E)+E.poste(160, 22, P+4), adelante:E.cable(mano(j), [158, 26])})
  });
  def("Pullover en polea", {
    base:Object.assign({}, parado, {tronco:160, muslo:8, pierna:-6}),
    inicio:{brazo:150, antebrazo:150}, fin:{brazo:15, antebrazo:15},
    musculos:{dorsal:1, triceps:2, pecho:2},
    equipo:(j,E)=>({atras:piso(E)+E.poste(176, 20, P+4), adelante:E.cable(mano(j), [174, 26])})
  });
  def("Encogimiento de hombros con mancuernas", {
    base:Object.assign({}, parado, {brazo:0, antebrazo:0}), inicio:{encoge:0}, fin:{encoge:6},
    mueve:"S", musculos:{trapecio:1, antebrazo:2},
    equipo:(j,E)=>({atras:piso(E), adelante:E.mancuerna(centroMano(j), 90)})
  });
  def("Curl Zottman", {
    base:Object.assign({}, parado, {brazo:-4}), inicio:{antebrazo:-2}, fin:{antebrazo:150},
    musculos:{biceps:1, antebrazo:1},
    equipo:(j,E)=>({atras:piso(E), adelante:E.mancuernaFrente(centroMano(j))})
  });
  def("Curl inverso con mancuerna", {
    base:Object.assign({}, parado, {brazo:-4}), inicio:{antebrazo:-2}, fin:{antebrazo:140},
    musculos:{antebrazo:1, biceps:2},
    equipo:(j,E)=>({atras:piso(E), adelante:E.mancuernaFrente(centroMano(j))})
  });
  def("Caminata de granjero con mancuernas", {
    base:{tronco:182, muslo:22, pierna:-2, pie:90, muslo2:-20, pierna2:-30, pie2:60, brazo:-2, antebrazo:0, ancla:["l1.A",[118,P]]},
    inicio:null, fin:{},
    musculos:{antebrazo:1, trapecio:1, abdomen:2, lumbar:2},
    mueve:false, equipo:(j,E)=>({atras:piso(E), adelante:E.mancuerna(centroMano(j), 90)+E.flechaLibre([j.H[0]-20, j.C[1]-16],[j.H[0]+30, j.C[1]-16])})
  });

  // ===== VIERNES =====
  def("Sentadilla frontal a banco", {
    base:Object.assign({}, parado, {brazo:85, antebrazo:-105}),
    inicio:{}, fin:{tronco:165, muslo:88, pierna:-22},
    mueve:"H", musculos:{cuadriceps:1, gluteo:1, abdomen:2},
    equipo:(j,E,A)=>({atras:piso(E)+E.banco([A ? A.H[0]-30 : 60, P-26],[A ? A.H[0]-2 : 88, P-26], 30), adelante:E.barra([j.S[0]+5, j.S[1]-1])})
  });
  def("Buenos días con barra", {
    base:Object.assign({}, parado, {brazo:-55, antebrazo:150}),
    inicio:{}, fin:{tronco:100, muslo:14, pierna:-4},
    mueve:"S", musculos:{femoral:1, lumbar:1, gluteo:1},
    equipo:(j,E)=>({atras:piso(E), medio:E.barra(sobreHombro(j))})
  });
  def("Extensión lumbar con peso", {
    base:{cadera:[100,110], muslo:-55, pierna:-55, pie:30, brazo:25, antebrazo:160, relativos:true},
    inicio:{tronco:30}, fin:{tronco:125},
    mueve:"C", musculos:{lumbar:1, gluteo:2, femoral:2},
    equipo:(j,E)=>({atras:E.banco([j.H[0]-6, j.H[1]+8],[j.H[0]+10, j.H[1]-4], 0, false)+E.poste(j.H[0]+2, j.H[1]+6, P+4)+E.rodillo([j.l1.A[0]-4, j.l1.A[1]+6])+E.piso(30,170,P+4), adelante:E.disco(mas2(j.S, j.H), 9)})
  });
  def("Press militar con mancuernas", {
    base:sentado(100,140), inicio:{brazo:60, antebrazo:178}, fin:{brazo:178, antebrazo:180},
    musculos:{deltoides:1, triceps:2},
    equipo:(j,E)=>({atras:E.banco([j.H[0]-12, j.H[1]+9],[j.H[0]+14, j.H[1]+9], 30)+E.banco([j.H[0]-12, j.H[1]+4],[j.S[0]-12, j.S[1]], 0, false), adelante:E.mancuernaFrente(centroMano(j))})
  });
  def("Jalón al pecho agarre neutro", {
    base:{tronco:195, cadera:[100,140], muslo:90, pierna:0, pie:90},
    inicio:{brazo:172, antebrazo:172}, fin:{brazo:-15, antebrazo:165},
    musculos:{dorsal:1, biceps:2, antebrazo:2},
    equipo:(j,E)=>({atras:E.banco([j.H[0]-12, j.H[1]+9],[j.H[0]+14, j.H[1]+9], 30)+E.rodillo([j.l1.K[0]-4, j.l1.K[1]-11]), adelante:E.cable(mano(j), [mano(j)[0], 20])})
  });
  def("Remo con mancuerna a 30°", {
    base:{tronco:122, cadera:[95,130], muslo:-25, pierna:-5, pie:90, ancla:["l1.A",[70,P]]},
    inicio:{brazo:0, antebrazo:0}, fin:{brazo:-120, antebrazo:5},
    musculos:{dorsal:1, trapecio:2, deltoidesPost:2, biceps:2},
    equipo:(j,E)=>({atras:piso(E)+E.banco([j.H[0]-4, j.H[1]+11],[j.S[0]+4, j.S[1]+12], 0, false)+E.poste(j.H[0]+14, j.H[1]+16, P+4), adelante:E.mancuernaFrente(centroMano(j))})
  });
  def("Rotación externa a 90° en polea", {
    base:Object.assign({}, parado, {brazo:92, brazoLargo:.35}),
    inicio:{antebrazo:92}, fin:{antebrazo:178},
    musculos:{deltoidesPost:1, trapecio:2},
    equipo:(j,E)=>({atras:piso(E)+E.poste(176, 80, P+4), adelante:E.cable(mano(j), [174, 120])})
  });
  def("Curl de bíceps en polea", {
    base:Object.assign({}, parado, {brazo:-4}), inicio:{antebrazo:12}, fin:{antebrazo:150},
    musculos:{biceps:1, antebrazo:2},
    equipo:(j,E)=>({atras:piso(E)+E.poste(170, 150, P+4), adelante:E.cable(mano(j), [168, P-6])})
  });
  def("Press francés con mancuernas", {
    base:{tronco:-90, cadera:[118,120], muslo:70, pierna:5, pie:90, brazo:172},
    inicio:{antebrazo:-115}, fin:{antebrazo:172},
    musculos:{triceps:1},
    equipo:(j,E)=>({atras:E.banco([j.H[0]+8, j.H[1]+12],[j.S[0]-14, j.S[1]+12], 22), adelante:E.mancuernaFrente(centroMano(j))})
  });
  function mas2(a, b){ return [(a[0]*.7+b[0]*.3)+6, (a[1]*.7+b[1]*.3)]; }
})();
