// @ts-nocheck
// Ported 1:1 from the proven Velozza "Cronograma de Boda" artifact.
// Vanilla DOM logic kept as-is (contentEditable + imperative render) rather than
// rewritten to React state, to avoid reintroducing bugs already fixed and tested.
export function initCronograma(root){
  'use strict';
  if (!root || root.dataset.cbWired === '1') return function(){};
  root.dataset.cbWired = '1';
  var STORE_KEY = 'velozza_cronograma_boda_v3';

  var CITIES = {
    bogota:      {name:'Bogotá',       lat: 4.7110, lon:-74.0721},
    medellin:    {name:'Medellín',     lat: 6.2442, lon:-75.5812},
    cali:        {name:'Cali',         lat: 3.4516, lon:-76.5320},
    cartagena:   {name:'Cartagena',    lat:10.3910, lon:-75.4794},
    barranquilla:{name:'Barranquilla', lat:10.9685, lon:-74.7813}
  };

  var DEFAULT_SCHEDULE = [
    {time:'10:00', activity:'Arreglo y maquillaje', note:'Empieza con margen: si termina antes, ese tiempo se vuelve fotos de detalles.', margin:20, critical:false},
    {time:'12:30', activity:'Fotos de detalles', note:'Vestido, argollas, ramo, zapatos, invitación.', margin:10, critical:false},
    {time:'13:30', activity:'First look (opcional)', note:'No reemplaza el altar, lo complementa.', margin:15, critical:false},
    {time:'14:30', activity:'Traslado al lugar de la ceremonia', note:'', margin:20, critical:false},
    {time:'15:00', activity:'Ceremonia', note:'El bloque menos flexible del día — todo lo demás se calcula desde aquí.', margin:15, critical:true},
    {time:'15:45', activity:'Fotos familiares', note:'Shot list ya enviada al fotógrafo, máx. 4 personas por lado.', margin:20, critical:true},
    {time:'16:15', activity:'Retrato formal de pareja', note:'', margin:10, critical:false},
    {time:'16:45', activity:'Cóctel de bienvenida', note:'', margin:0, critical:false},
    {time:'17:30', activity:'Hora dorada — retratos de pareja', note:'No negociable: se calcula desde la puesta de sol real.', margin:10, critical:true},
    {time:'18:30', activity:'Entrada a la recepción', note:'', margin:0, critical:false},
    {time:'19:00', activity:'Cena', note:'', margin:0, critical:false},
    {time:'20:00', activity:'Primer baile', note:'', margin:0, critical:false},
    {time:'20:30', activity:'Fiesta', note:'', margin:0, critical:false},
    {time:'23:00', activity:'Salida', note:'', margin:0, critical:false}
  ];
  var DEFAULT_CREW = [
    {role:'Fotógrafo/a', name:'', phone:''},
    {role:'Coordinador/a', name:'', phone:''},
    {role:'DJ / Sonido', name:'', phone:''},
    {role:'Estilista', name:'', phone:''}
  ];
  var DEFAULT_MENU = [
    {name:'Entrada', item:'Ej: carpaccio de res con rúgula y parmesano'},
    {name:'Plato fuerte', item:'Ej: lomo al vino con puré de papa criolla'},
    {name:'Postre', item:'Ej: mousse de maracuyá'},
    {name:'Bebidas', item:'Ej: barra libre nacional + coctel de bienvenida'}
  ];

  function loadState(){ try { var raw = localStorage.getItem(STORE_KEY); if (raw) return JSON.parse(raw); } catch (e) {} return null; }
  function defaultDate(){ var d=new Date(); d.setMonth(d.getMonth()+4); return d.toISOString().slice(0,10); }

  var saved = loadState();
  var state = saved || {
    brideName:'', groomName:'', date:defaultDate(), city:'bogota', mode:'work',
    schedule: JSON.parse(JSON.stringify(DEFAULT_SCHEDULE)),
    crew: JSON.parse(JSON.stringify(DEFAULT_CREW)),
    guestCount: 80, perTable: 8, tableLabels: [], tableGuests: [],
    headCapacity: 2, headGuests: [],
    menu: JSON.parse(JSON.stringify(DEFAULT_MENU)), menuNotes: ''
  };
  if (state.names && !state.brideName && !state.groomName) {
    var nameParts = state.names.split(/\s*&\s*/);
    state.brideName = nameParts[0] === 'Nombre' ? '' : (nameParts[0] || '');
    state.groomName = nameParts[1] === 'Nombre' ? '' : (nameParts[1] || '');
    delete state.names;
  }
  if (state.brideName == null) state.brideName = '';
  if (state.groomName == null) state.groomName = '';
  function displayNames(){ return (state.brideName || 'Novia') + ' & ' + (state.groomName || 'Novio'); }
  if (!state.crew) state.crew = JSON.parse(JSON.stringify(DEFAULT_CREW));
  if (!state.mode) state.mode = 'work';
  if (!state.layoutMode) state.layoutMode = 'round';
  if (state.guestCount == null) state.guestCount = 80;
  if (state.perTable == null) state.perTable = 8;
  if (!state.tableLabels) state.tableLabels = [];
  if (!state.tableGuests) state.tableGuests = [];
  if (state.headCapacity == null) state.headCapacity = 2;
  if (!state.headGuests) state.headGuests = [];
  if (!state.menu) state.menu = JSON.parse(JSON.stringify(DEFAULT_MENU));
  if (state.menuNotes == null) state.menuNotes = '';
  if (state.tableCount == null) state.tableCount = Math.ceil(state.guestCount / Math.max(1,state.perTable));

  var brideNameEl = document.getElementById('brideName');
  var groomNameEl = document.getElementById('groomName');
  var headTableNamesEl = document.getElementById('headTableNames');
  var dateEl = document.getElementById('weddingDate');
  var cityEl = document.getElementById('city');
  var timelineEl = document.getElementById('timeline');
  var crewEl = document.getElementById('crew');
  var addRowBtn = document.getElementById('addRow');
  var addCrewBtn = document.getElementById('addCrew');
  var savePill = document.getElementById('savePill');
  var copyBtn = document.getElementById('copyBtn');
  var modeToggle = document.getElementById('modeToggle');
  var guestCountEl = document.getElementById('guestCount');
  var perTableEl = document.getElementById('perTable');
  var tablesNeededEl = document.getElementById('tablesNeeded');
  var tablesGridEl = document.getElementById('tablesGrid');
  var layoutToggle = document.getElementById('layoutToggle');
  var layoutDescEl = document.getElementById('layoutDesc');
  var headTableBtn = document.getElementById('headTableBtn');
  var headCountBadge = document.getElementById('headCountBadge');
  var tableEditor = document.getElementById('tableEditor');
  var teTitle = document.getElementById('teTitle');
  var teSub = document.getElementById('teSub');
  var teCapWrap = document.getElementById('teCapWrap');
  var teCapacity = document.getElementById('teCapacity');
  var teClose = document.getElementById('teClose');
  var teNames = document.getElementById('teNames');
  var teAddName = document.getElementById('teAddName');
  var menuCoursesEl = document.getElementById('menuCourses');
  var addCourseBtn = document.getElementById('addCourse');
  var menuNotesEl = document.getElementById('menuNotes');

  brideNameEl.textContent = state.brideName;
  groomNameEl.textContent = state.groomName;
  headTableNamesEl.textContent = displayNames();
  dateEl.value = state.date;
  cityEl.value = state.city;
  guestCountEl.value = state.guestCount;
  perTableEl.value = state.perTable;
  tablesNeededEl.value = state.tableCount;
  Array.prototype.forEach.call(layoutToggle.querySelectorAll('button'), function(b){ b.classList.toggle('on', b.getAttribute('data-layout')===state.layoutMode); });
  menuNotesEl.textContent = state.menuNotes;

  var saveTimer = null;
  function persist(){ try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {} showSaved(); }
  function scheduleSave(){ clearTimeout(saveTimer); saveTimer = setTimeout(persist, 500); }
  function showSaved(){
    savePill.classList.add('show');
    clearTimeout(showSaved._t);
    showSaved._t = setTimeout(function(){ savePill.classList.remove('show'); }, 1600);
  }

  brideNameEl.addEventListener('input', function(){
    state.brideName = brideNameEl.textContent.trim();
    headTableNamesEl.textContent = displayNames();
    scheduleSave();
  });
  groomNameEl.addEventListener('input', function(){
    state.groomName = groomNameEl.textContent.trim();
    headTableNamesEl.textContent = displayNames();
    scheduleSave();
  });
  dateEl.addEventListener('change', function(){ state.date = dateEl.value; scheduleSave(); updateCountdown(); renderLightBar(); renderTimeline(); });
  cityEl.addEventListener('change', function(){ state.city = cityEl.value; scheduleSave(); renderLightBar(); renderTimeline(); });

  modeToggle.addEventListener('click', function(e){
    var btn = e.target.closest('button[data-mode]'); if (!btn) return;
    state.mode = btn.getAttribute('data-mode');
    Array.prototype.forEach.call(modeToggle.querySelectorAll('button'), function(b){ b.classList.toggle('on', b===btn); });
    scheduleSave(); renderTimeline();
  });

  /* ---------- NOAA sunrise/sunset ---------- */
  function sunTimesUTC(date, lat, lon){
    var rad = Math.PI/180, deg = 180/Math.PI;
    var start = new Date(Date.UTC(date.getFullYear(),0,1));
    var dayOfYear = Math.floor((Date.UTC(date.getFullYear(),date.getMonth(),date.getDate()) - start.getTime())/86400000) + 1;
    var lngHour = lon/15;
    function compute(isRise){
      var t = dayOfYear + ((isRise?6:18) - lngHour)/24;
      var M = 0.9856*t - 3.289;
      var L = M + 1.916*Math.sin(M*rad) + 0.020*Math.sin(2*M*rad) + 282.634;
      L = ((L%360)+360)%360;
      var RA = deg*Math.atan(0.91764*Math.tan(L*rad));
      RA = ((RA%360)+360)%360;
      var Lq = Math.floor(L/90)*90, RAq = Math.floor(RA/90)*90;
      RA = (RA + (Lq-RAq))/15;
      var sinDec = 0.39782*Math.sin(L*rad);
      var cosDec = Math.cos(Math.asin(sinDec));
      var cosH = (Math.cos(90.833*rad) - sinDec*Math.sin(lat*rad)) / (cosDec*Math.cos(lat*rad));
      if (cosH > 1 || cosH < -1) return null;
      var H = isRise ? (360 - deg*Math.acos(cosH)) : deg*Math.acos(cosH);
      H = H/15;
      var Tt = H + RA - 0.06571*t - 6.622;
      return ((Tt - lngHour)%24+24)%24;
    }
    return { sunrise: compute(true), sunset: compute(false) };
  }
  function utToColombiaMinutes(ut){ if (ut==null) return null; var h = ((ut - 5)%24+24)%24; return Math.round(h*60); }
  function minutesToHHMM(mins){
    if (mins==null) return '—';
    mins = ((mins%1440)+1440)%1440;
    var h = Math.floor(mins/60), m = mins%60;
    var suf = h<12?'a.m.':'p.m.'; var h12 = h%12; if (h12===0) h12=12;
    return h12 + ':' + String(m).padStart(2,'0') + ' ' + suf;
  }
  function timeToMinutes(hhmm){ if (!hhmm) return null; var p=hhmm.split(':'); return (+p[0])*60 + (+p[1]); }

  var sunCache = null, cssVars = null;
  function getVar(name){ if(!cssVars) cssVars = getComputedStyle(document.documentElement); return cssVars.getPropertyValue(name).trim(); }

  function computeSun(){
    var c = CITIES[state.city] || CITIES.bogota;
    var d = state.date ? new Date(state.date+'T12:00:00') : new Date();
    var raw = sunTimesUTC(d, c.lat, c.lon);
    var sunriseMin = utToColombiaMinutes(raw.sunrise);
    var sunsetMin = utToColombiaMinutes(raw.sunset);
    sunCache = {
      sunriseMin: sunriseMin, sunsetMin: sunsetMin,
      goldenStart: sunsetMin!=null ? sunsetMin-40 : null, goldenEnd: sunsetMin,
      blueEnd: sunsetMin!=null ? sunsetMin+25 : null,
      harshStart: 11*60, harshEnd: 14*60
    };
    return sunCache;
  }
  function lightZoneColor(mins){
    var s = sunCache; if (!s || mins==null) return '#c8c2b0';
    if (s.goldenStart!=null && mins>=s.goldenStart && mins<=s.goldenEnd) return getVar('--gold2');
    if (s.blueEnd!=null && mins>s.goldenEnd && mins<=s.blueEnd) return getVar('--blue');
    if (s.sunriseMin!=null && (mins < s.sunriseMin-15 || (s.blueEnd!=null && mins > s.blueEnd))) return getVar('--night');
    if (mins>=s.harshStart && mins<=s.harshEnd) return getVar('--harsh');
    return '#c8c2b0';
  }
  function renderLightBar(){
    var s = computeSun();
    var bar = document.getElementById('lightBar');
    bar.innerHTML = '';
    var DAY_START = 5*60, DAY_END = 23*60, total = DAY_END - DAY_START;
    var stops = [];
    for (var m = DAY_START; m < DAY_END; m += 6){ stops.push({m:m, c:lightZoneColor(m)}); }
    stops.forEach(function(pt, i){
      var next = stops[i+1] ? stops[i+1].m : DAY_END;
      var seg = document.createElement('div');
      seg.className = 'seg'; seg.style.width = ((next - pt.m)/total*100) + '%'; seg.style.background = pt.c;
      bar.appendChild(seg);
    });
    document.getElementById('lt-sunrise').textContent = minutesToHHMM(s.sunriseMin);
    document.getElementById('lt-golden').textContent = s.goldenStart!=null ? (minutesToHHMM(s.goldenStart) + ' – ' + minutesToHHMM(s.goldenEnd)) : '—';
    document.getElementById('lt-sunset').textContent = minutesToHHMM(s.sunsetMin);
  }

  /* ---------- timeline ---------- */
  function isWeddingToday(){
    if (!state.date) return false;
    var now = new Date(); var today = now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');
    return today === state.date;
  }
  function nowMinutes(){ var n=new Date(); return n.getHours()*60+n.getMinutes(); }
  function currentBlockIndex(){
    if (!isWeddingToday()) return -1;
    var nm = nowMinutes(), best = -1, bestTime = -1;
    state.schedule.forEach(function(item, idx){
      var t = timeToMinutes(item.time);
      if (t!=null && t<=nm && t>bestTime){ bestTime = t; best = idx; }
    });
    return best;
  }
  function renderRow(item, idx, nowIdx){
    var frag = document.createDocumentFragment();
    var row = document.createElement('div');
    row.className = 'row' + (item.critical?' critical':'') + (idx===nowIdx?' now':'');
    var mins = timeToMinutes(item.time);
    var dot = document.createElement('div'); dot.className='dot'; dot.style.background = lightZoneColor(mins); dot.title='Condición de luz aproximada a esta hora';
    var timeInput = document.createElement('input');
    timeInput.type='time'; timeInput.className='time'; timeInput.value=item.time||''; timeInput.id='time-'+idx;
    timeInput.addEventListener('change', function(){ state.schedule[idx].time = timeInput.value; scheduleSave(); renderTimeline(); });
    var mid = document.createElement('div'); mid.className='mid';
    var line = document.createElement('div'); line.className='activity-line';
    var activity = document.createElement('div');
    activity.className='activity'; activity.contentEditable='true'; activity.setAttribute('data-ph','Actividad');
    activity.textContent = item.activity||'';
    activity.addEventListener('input', function(){ state.schedule[idx].activity = activity.textContent.trim(); scheduleSave(); });
    line.appendChild(activity);
    if (item.critical){ var t1=document.createElement('span'); t1.className='tag critical'; t1.textContent='Crítico'; line.appendChild(t1); }
    if (idx===nowIdx){ var t2=document.createElement('span'); t2.className='tag now'; t2.textContent='Ahora'; line.appendChild(t2); }
    mid.appendChild(line);
    var note = document.createElement('div'); note.className='note'; note.contentEditable='true'; note.setAttribute('data-ph','Nota (opcional)');
    note.textContent = item.note||'';
    note.addEventListener('input', function(){ state.schedule[idx].note = note.textContent.trim(); scheduleSave(); });
    mid.appendChild(note);
    var actions = document.createElement('div'); actions.className='row-actions';
    var star = document.createElement('button'); star.className='icon-btn'+(item.critical?' active':''); star.type='button';
    star.setAttribute('aria-label','Marcar como bloque crítico'); star.textContent='★';
    star.addEventListener('click', function(){ state.schedule[idx].critical = !state.schedule[idx].critical; scheduleSave(); renderTimeline(); });
    var rm = document.createElement('button'); rm.className='icon-btn'; rm.type='button';
    rm.setAttribute('aria-label','Quitar este bloque'); rm.textContent='×';
    rm.addEventListener('click', function(){ state.schedule.splice(idx,1); scheduleSave(); renderTimeline(); });
    actions.appendChild(star); actions.appendChild(rm);
    row.appendChild(dot); row.appendChild(timeInput); row.appendChild(mid); row.appendChild(actions);
    frag.appendChild(row);
    if (state.mode==='work' && idx < state.schedule.length-1){
      var mrow = document.createElement('div'); mrow.className='margin-row';
      var span1 = document.createElement('span'); span1.textContent='+';
      var mInput = document.createElement('input'); mInput.type='number'; mInput.min='0'; mInput.step='5'; mInput.value = item.margin||0;
      mInput.addEventListener('change', function(){ state.schedule[idx].margin = parseInt(mInput.value,10)||0; scheduleSave(); });
      var span2 = document.createElement('span'); span2.textContent='min de margen (no lo ven los invitados)';
      var ln = document.createElement('span'); ln.className='ln';
      mrow.appendChild(span1); mrow.appendChild(mInput); mrow.appendChild(span2); mrow.appendChild(ln);
      frag.appendChild(mrow);
    }
    return frag;
  }
  function renderTimeline(){
    timelineEl.innerHTML = '';
    var nowIdx = currentBlockIndex();
    document.getElementById('liveBadge').classList.toggle('show', nowIdx>=0);
    state.schedule.forEach(function(item, idx){ timelineEl.appendChild(renderRow(item, idx, nowIdx)); });
  }
  addRowBtn.addEventListener('click', function(){
    state.schedule.push({time:'', activity:'', note:'', margin:15, critical:false});
    scheduleSave(); renderTimeline();
    var inputs = timelineEl.querySelectorAll('.activity'); var last = inputs[inputs.length-1]; if (last) last.focus();
  });
  copyBtn.addEventListener('click', function(){
    var lines = ['CRONOGRAMA — ' + displayNames(), state.date || '', ''];
    state.schedule.forEach(function(item){
      if (!item.time && !item.activity) return;
      lines.push((item.time||'--:--') + '  ' + (item.activity||''));
      if (state.mode==='work' && item.note) lines.push('   ' + item.note);
    });
    var text = lines.join('\n');
    function fallback(){
      var ta = document.createElement('textarea'); ta.value = text; ta.style.position='fixed'; ta.style.opacity='0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch(e){}
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).catch(fallback); } else { fallback(); }
    var original = copyBtn.textContent; copyBtn.textContent = 'Copiado ✓';
    setTimeout(function(){ copyBtn.textContent = original; }, 1800);
  });

  /* ---------- mesas ---------- */
  function tickInput(el){ el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick'); }
  function computeAutoTables(){
    var guests = Math.max(0, parseInt(guestCountEl.value,10) || 0);
    var per = Math.max(1, parseInt(perTableEl.value,10) || 1);
    return guests > 0 ? Math.ceil(guests/per) : 0;
  }
  var editingTable = null; // null closed, 'head', or a round-table index (number)

  var LAYOUT_DESC = {
    round: 'Ideal para recepciones grandes: buena vista desde cualquier mesa hacia la pista y la mesa principal.',
    imperial: 'Mesas largas tipo familiar — buen ambiente entre invitados de la misma mesa, clásico en bodas colombianas.',
    u: 'Ideal para recepciones íntimas: todas las mesas miran hacia el centro, buena para discursos y el primer baile.',
    rows: 'Dos bloques de mesas con el pasillo central abierto — libera el paso para su entrada, el brindis y el primer baile.'
  };

  function makeTableLabel(i){
    var label = document.createElement('div'); label.className='table-label'; label.contentEditable='true';
    label.setAttribute('data-ph','Mesa '+(i+1));
    label.textContent = state.tableLabels[i] || '';
    label.addEventListener('click', function(e){ e.stopPropagation(); });
    label.addEventListener('input', function(){ state.tableLabels[i] = label.textContent.trim(); scheduleSave(); });
    return label;
  }
  function tableClickHandler(i){
    return function(){ if (editingTable===i) closeTableEditor(); else openTableEditor(i); };
  }

  function renderRoundLayout(count, per){
    tablesGridEl.className = 'tables-grid';
    var chairCount = Math.min(per, 12);
    for (var i=0;i<count;i++){
      var unit = document.createElement('div'); unit.className='table-unit'; unit.style.animationDelay = (i*0.04)+'s';
      var radius = 46;
      for (var c=0;c<chairCount;c++){
        var ang = (2*Math.PI*c/chairCount) - Math.PI/2;
        var chair = document.createElement('div'); chair.className='chair';
        chair.style.left = (52 + radius*Math.cos(ang) - 3.5) + 'px';
        chair.style.top = (52 + radius*Math.sin(ang) - 3.5) + 'px';
        unit.appendChild(chair);
      }
      var circle = document.createElement('div'); circle.className='table-circle'+(editingTable===i?' editing':'');
      var tn = document.createElement('div'); tn.className='tn'; tn.textContent = (i+1);
      var filled = (state.tableGuests[i]||[]).length;
      var tc = document.createElement('div'); tc.className='tc'; tc.textContent = filled + '/' + per;
      circle.appendChild(tn); circle.appendChild(tc);
      circle.addEventListener('click', tableClickHandler(i));
      unit.appendChild(circle); unit.appendChild(makeTableLabel(i));
      tablesGridEl.appendChild(unit);
    }
  }

  function renderImperialLayout(count, per){
    tablesGridEl.className = 'tables-grid layout-imperial';
    for (var i=0;i<count;i++){
      var wrap = document.createElement('div'); wrap.className='rect-unit'; wrap.style.animationDelay = (i*0.05)+'s';
      var rect = document.createElement('div'); rect.className='table-rect'+(editingTable===i?' editing':'');
      var tickCount = Math.min(per, 16);
      for (var c=0;c<tickCount;c++){
        var side = c < Math.ceil(tickCount/2) ? 'top' : 'bottom';
        var idxInSide = side==='top' ? c : c - Math.ceil(tickCount/2);
        var sideCount = side==='top' ? Math.ceil(tickCount/2) : Math.floor(tickCount/2);
        var tick = document.createElement('div'); tick.className='tick';
        tick.style.left = (14 + idxInSide*((280-28)/Math.max(1,sideCount-1||1))) + 'px';
        tick.style[side==='top'?'top':'bottom'] = '-4px';
        rect.appendChild(tick);
      }
      var tn = document.createElement('div'); tn.className='tn'; tn.textContent = 'Mesa '+(i+1);
      var filled = (state.tableGuests[i]||[]).length;
      var tc = document.createElement('div'); tc.className='tc'; tc.textContent = filled+'/'+per;
      rect.appendChild(tn); rect.appendChild(tc);
      rect.addEventListener('click', tableClickHandler(i));
      wrap.appendChild(rect); wrap.appendChild(makeTableLabel(i));
      tablesGridEl.appendChild(wrap);
    }
  }

  function renderULayout(count, per){
    tablesGridEl.className = 'tables-grid layout-u';
    var W = tablesGridEl.clientWidth || 680, H = 340;
    var compact = W < 420;
    var padX = compact ? 34 : 64, padY = compact ? 30 : 54;
    var leftLen = H - padY*2, botLen = W - padX*2, rightLen = H - padY*2;
    var total = leftLen + botLen + rightLen;
    // shrink the visual footprint of each table when many of them have to
    // share a short perimeter (mobile), so neighbors never overlap
    var minStep = count > 1 ? total / (count - 1) : total;
    var circleSize = compact ? 40 : 60;
    var radius = compact ? 20 : 42;
    if (minStep < radius * 2 + 16) {
      var shrink = Math.max(0.55, minStep / (radius * 2 + 16));
      circleSize = Math.round(circleSize * shrink);
      radius = Math.round(radius * shrink);
    }
    var chairCount = Math.min(per, compact ? 8 : 10);
    for (var i=0;i<count;i++){
      var t = count>1 ? i/(count-1) : 0.5;
      var d = t*total;
      var x, y;
      if (d <= leftLen){ x = padX; y = padY + d; }
      else if (d <= leftLen+botLen){ x = padX + (d-leftLen); y = H-padY; }
      else { x = W-padX; y = (H-padY) - (d-leftLen-botLen); }

      var unit = document.createElement('div'); unit.className='table-unit'; unit.style.animationDelay=(i*0.04)+'s';
      // this layout positions tables with plain left/top (no centering transform:
      // the entrance animation already animates transform:scale(), and CSS lets
      // only one "transform" source win — the animation always overrides a
      // static transform, so translate(-50%,-50%) here would silently be
      // dropped once the entrance animation finishes). Center by math instead.
      unit.style.left = (x-52)+'px'; unit.style.top = (y-52)+'px';
      for (var c=0;c<chairCount;c++){
        var ang = (2*Math.PI*c/chairCount) - Math.PI/2;
        var chair = document.createElement('div'); chair.className='chair';
        chair.style.left = (52 + radius*Math.cos(ang) - 3.5) + 'px';
        chair.style.top = (52 + radius*Math.sin(ang) - 3.5) + 'px';
        unit.appendChild(chair);
      }
      var circle = document.createElement('div'); circle.className='table-circle'+(editingTable===i?' editing':'');
      circle.style.width=circleSize+'px'; circle.style.height=circleSize+'px';
      if (compact) { circle.style.fontSize='11px'; }
      var tn = document.createElement('div'); tn.className='tn'; tn.textContent=(i+1);
      var filled = (state.tableGuests[i]||[]).length;
      var tc = document.createElement('div'); tc.className='tc'; tc.textContent = filled+'/'+per;
      circle.appendChild(tn); circle.appendChild(tc);
      circle.addEventListener('click', tableClickHandler(i));
      unit.appendChild(circle); unit.appendChild(makeTableLabel(i));
      tablesGridEl.appendChild(unit);
    }
  }

  function renderRowsLayout(count, per){
    tablesGridEl.className = 'tables-grid layout-rows';
    var chairCount = Math.min(per, 12);
    function buildUnit(i){
      var unit = document.createElement('div'); unit.className='table-unit'; unit.style.animationDelay=(i*0.04)+'s';
      var radius = 46;
      for (var c=0;c<chairCount;c++){
        var ang = (2*Math.PI*c/chairCount) - Math.PI/2;
        var chair = document.createElement('div'); chair.className='chair';
        chair.style.left = (52 + radius*Math.cos(ang) - 3.5) + 'px';
        chair.style.top = (52 + radius*Math.sin(ang) - 3.5) + 'px';
        unit.appendChild(chair);
      }
      var circle = document.createElement('div'); circle.className='table-circle'+(editingTable===i?' editing':'');
      var tn = document.createElement('div'); tn.className='tn'; tn.textContent=(i+1);
      var filled = (state.tableGuests[i]||[]).length;
      var tc = document.createElement('div'); tc.className='tc'; tc.textContent = filled+'/'+per;
      circle.appendChild(tn); circle.appendChild(tc);
      circle.addEventListener('click', tableClickHandler(i));
      unit.appendChild(circle); unit.appendChild(makeTableLabel(i));
      return unit;
    }
    var leftCount = Math.ceil(count/2), rightCount = count - leftCount;
    var leftCol = document.createElement('div'); leftCol.className='rows-col';
    for (var i=0;i<leftCount;i++) leftCol.appendChild(buildUnit(i));
    var aisle = document.createElement('div'); aisle.className='aisle';
    var al = document.createElement('span'); al.className='al'; al.textContent='PASILLO';
    aisle.appendChild(al);
    var rightCol = document.createElement('div'); rightCol.className='rows-col';
    for (var j=0;j<rightCount;j++) rightCol.appendChild(buildUnit(leftCount+j));
    tablesGridEl.appendChild(leftCol);
    if (count>0) tablesGridEl.appendChild(aisle);
    tablesGridEl.appendChild(rightCol);
  }

  function renderTables(){
    var per = Math.max(1, parseInt(perTableEl.value,10) || 1);
    var count = Math.max(0, parseInt(tablesNeededEl.value,10) || 0);
    while (state.tableGuests.length < count) state.tableGuests.push([]);
    tablesGridEl.innerHTML = '';
    layoutDescEl.textContent = LAYOUT_DESC[state.layoutMode] || LAYOUT_DESC.round;
    if (state.layoutMode === 'imperial') renderImperialLayout(count, per);
    else if (state.layoutMode === 'u') renderULayout(count, per);
    else if (state.layoutMode === 'rows') renderRowsLayout(count, per);
    else renderRoundLayout(count, per);
    if (typeof editingTable === 'number' && editingTable >= count) closeTableEditor();
  }
  layoutToggle.addEventListener('click', function(e){
    var btn = e.target.closest('button[data-layout]'); if (!btn) return;
    state.layoutMode = btn.getAttribute('data-layout');
    Array.prototype.forEach.call(layoutToggle.querySelectorAll('button'), function(b){ b.classList.toggle('on', b===btn); });
    scheduleSave(); renderTables();
  });
  function syncAutoTables(){
    var auto = computeAutoTables();
    if (String(auto) !== tablesNeededEl.value) { tablesNeededEl.value = auto; tickInput(tablesNeededEl); }
    state.tableCount = auto;
  }
  guestCountEl.addEventListener('input', function(){ state.guestCount = parseInt(guestCountEl.value,10)||0; scheduleSave(); syncAutoTables(); renderTables(); });
  perTableEl.addEventListener('input', function(){ state.perTable = parseInt(perTableEl.value,10)||1; scheduleSave(); syncAutoTables(); renderTables(); });
  tablesNeededEl.addEventListener('input', function(){ state.tableCount = parseInt(tablesNeededEl.value,10)||0; scheduleSave(); renderTables(); });

  /* ---------- shared table/head guest-list editor ---------- */
  function updateHeadBadge(){
    headCountBadge.textContent = '·  ' + state.headGuests.length + '/' + state.headCapacity + 'p';
    headTableBtn.classList.toggle('editing', editingTable==='head');
  }
  function renderTeNames(list, allowCapacity, capacityVal){
    teNames.innerHTML = '';
    if (!list.length){
      var empty = document.createElement('div'); empty.className='te-empty'; empty.textContent = 'Aún no han agregado nombres para esta mesa.';
      teNames.appendChild(empty);
    }
    list.forEach(function(name, idx){
      var row = document.createElement('div'); row.className='te-name-row';
      var seat = document.createElement('span'); seat.className='seat'; seat.textContent = (idx+1)+'.';
      var tname = document.createElement('div'); tname.className='tname'; tname.contentEditable='true'; tname.setAttribute('data-ph','Nombre del invitado');
      tname.textContent = name||'';
      tname.addEventListener('input', function(){ list[idx] = tname.textContent.trim(); scheduleSave(); teSub.textContent = list.length + (allowCapacity ? ('/' + capacityVal()) : '') + ' personas asignadas'; refreshTableBadges(); });
      var rm = document.createElement('button'); rm.className='icon-btn'; rm.type='button'; rm.setAttribute('aria-label','Quitar'); rm.textContent='×';
      rm.addEventListener('click', function(i){ return function(){ list.splice(i,1); scheduleSave(); openTableEditor(editingTable); }; }(idx));
      row.appendChild(seat); row.appendChild(tname); row.appendChild(rm);
      teNames.appendChild(row);
    });
  }
  function refreshTableBadges(){
    if (editingTable==='head') updateHeadBadge();
    renderTables();
  }
  function openTableEditor(target){
    editingTable = target;
    tableEditor.hidden = false;
    if (target === 'head'){
      teTitle.textContent = 'Mesa principal';
      teCapWrap.hidden = false;
      teCapacity.value = state.headCapacity;
      teSub.textContent = state.headGuests.length + '/' + state.headCapacity + ' personas asignadas';
      renderTeNames(state.headGuests, true, function(){ return state.headCapacity; });
      teAddName.onclick = function(){ state.headGuests.push(''); scheduleSave(); openTableEditor('head'); };
    } else {
      var per = Math.max(1, parseInt(perTableEl.value,10) || 1);
      var list = state.tableGuests[target] || (state.tableGuests[target]=[]);
      teTitle.textContent = 'Mesa ' + (target+1) + (state.tableLabels[target] ? ' — ' + state.tableLabels[target] : '');
      teCapWrap.hidden = true;
      teSub.textContent = list.length + '/' + per + ' personas asignadas';
      renderTeNames(list, true, function(){ return per; });
      teAddName.onclick = function(){ list.push(''); scheduleSave(); openTableEditor(target); };
    }
    updateHeadBadge();
    renderTables();
    tableEditor.scrollIntoView({behavior:'smooth', block:'nearest'});
  }
  function closeTableEditor(){
    editingTable = null;
    tableEditor.hidden = true;
    updateHeadBadge();
    renderTables();
  }
  headTableBtn.addEventListener('click', function(){ if (editingTable==='head') closeTableEditor(); else openTableEditor('head'); });
  teClose.addEventListener('click', closeTableEditor);
  teCapacity.addEventListener('input', function(){
    state.headCapacity = Math.max(1, parseInt(teCapacity.value,10)||1);
    scheduleSave();
    teSub.textContent = state.headGuests.length + '/' + state.headCapacity + ' personas asignadas';
    updateHeadBadge();
  });

  /* ---------- crew ---------- */
  function renderCrewRow(item, idx){
    var row = document.createElement('div'); row.className='row2';
    var role = document.createElement('div'); role.className='role'; role.contentEditable='true'; role.setAttribute('data-ph','Rol');
    role.textContent = item.role||'';
    role.addEventListener('input', function(){ state.crew[idx].role = role.textContent.trim(); scheduleSave(); });
    var name = document.createElement('div'); name.contentEditable='true'; name.setAttribute('data-ph','Nombre');
    name.textContent = item.name||'';
    name.addEventListener('input', function(){ state.crew[idx].name = name.textContent.trim(); scheduleSave(); });
    var phone = document.createElement('div'); phone.className='phone'; phone.contentEditable='true'; phone.setAttribute('data-ph','Teléfono');
    phone.textContent = item.phone||'';
    phone.addEventListener('input', function(){ state.crew[idx].phone = phone.textContent.trim(); scheduleSave(); });
    var rm = document.createElement('button'); rm.className='icon-btn'; rm.type='button'; rm.setAttribute('aria-label','Quitar'); rm.textContent='×';
    rm.addEventListener('click', function(){ state.crew.splice(idx,1); scheduleSave(); renderCrew(); });
    row.appendChild(role); row.appendChild(name); row.appendChild(phone); row.appendChild(rm);
    return row;
  }
  function renderCrew(){ crewEl.innerHTML = ''; state.crew.forEach(function(item, idx){ crewEl.appendChild(renderCrewRow(item, idx)); }); }
  addCrewBtn.addEventListener('click', function(){ state.crew.push({role:'', name:'', phone:''}); scheduleSave(); renderCrew(); });

  /* ---------- menu ---------- */
  function renderMenuRow(item, idx){
    var row = document.createElement('div'); row.className='menu-course';
    var name = document.createElement('div'); name.className='mc-name'; name.contentEditable='true'; name.setAttribute('data-ph','Tiempo (ej. Entrada)');
    name.textContent = item.name||'';
    name.addEventListener('input', function(){ state.menu[idx].name = name.textContent.trim(); scheduleSave(); });
    var mitem = document.createElement('div'); mitem.className='mc-item'; mitem.contentEditable='true'; mitem.setAttribute('data-ph','Plato o descripción');
    mitem.textContent = item.item||'';
    mitem.addEventListener('input', function(){ state.menu[idx].item = mitem.textContent.trim(); scheduleSave(); });
    var rm = document.createElement('button'); rm.className='icon-btn'; rm.type='button'; rm.setAttribute('aria-label','Quitar tiempo'); rm.textContent='×';
    rm.addEventListener('click', function(){ state.menu.splice(idx,1); scheduleSave(); renderMenu(); });
    row.appendChild(name); row.appendChild(mitem); row.appendChild(rm);
    return row;
  }
  function renderMenu(){ menuCoursesEl.innerHTML=''; state.menu.forEach(function(item, idx){ menuCoursesEl.appendChild(renderMenuRow(item, idx)); }); }
  addCourseBtn.addEventListener('click', function(){ state.menu.push({name:'', item:''}); scheduleSave(); renderMenu(); });
  menuNotesEl.addEventListener('input', function(){ state.menuNotes = menuNotesEl.textContent.trim(); scheduleSave(); });

  /* ---------- countdown ---------- */
  var dEl=document.getElementById('cd-d'), hEl=document.getElementById('cd-h'), mEl=document.getElementById('cd-m'), sEl=document.getElementById('cd-s');
  var msgEl=document.getElementById('countdownMsg'), countdownBox=document.getElementById('countdown');
  var pad = function(n){ return String(n).padStart(2,'0'); };
  var lastVals = {d:null,h:null,m:null,s:null};
  function setTick(el, val, key){
    var v = pad(val);
    if (lastVals[key] !== null && lastVals[key] !== v) { el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick'); }
    lastVals[key] = v; el.textContent = v;
  }
  function updateCountdown(){
    if (!dateEl.value) return;
    var target = new Date(dateEl.value+'T00:00:00'); var now = new Date(); var diff = target.getTime()-now.getTime();
    if (diff<=0 && diff>-86400000){ countdownBox.hidden=true; msgEl.hidden=false; msgEl.textContent='Hoy es el gran día — ¡felicidades!'; return; }
    if (diff<=-86400000){ countdownBox.hidden=true; msgEl.hidden=false; msgEl.textContent='Gracias por confiar en nosotros para este día'; return; }
    countdownBox.hidden=false; msgEl.hidden=true;
    var totalSeconds=Math.floor(diff/1000);
    setTick(dEl, Math.floor(totalSeconds/86400), 'd');
    setTick(hEl, Math.floor((totalSeconds%86400)/3600), 'h');
    setTick(mEl, Math.floor((totalSeconds%3600)/60), 'm');
    setTick(sEl, totalSeconds%60, 's');
  }

  /* ---------- scroll reveal (progressive enhancement, safe) ---------- */
  function initReveal(){
    var els = document.querySelectorAll('.rv');
    if (!('IntersectionObserver' in window)) return;
    els.forEach(function(el){ el.classList.add('rv-ready','rv-pending'); });
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){ entry.target.classList.remove('rv-pending'); entry.target.classList.add('rv-on'); io.unobserve(entry.target); }
      });
    }, {threshold:.1, rootMargin:'0px 0px -40px 0px'});
    els.forEach(function(el){ io.observe(el); });
    setTimeout(function(){
      els.forEach(function(el){ if (!el.classList.contains('rv-on')) { el.classList.remove('rv-pending'); el.classList.add('rv-on'); } });
    }, 4000);
  }

  /* ---------- save / pdf buttons ---------- */
  var saveNowBtn = document.getElementById('saveNowBtn');
  var pdfBtn = document.getElementById('pdfBtn');
  saveNowBtn.addEventListener('click', function(){
    persist();
    var original = saveNowBtn.textContent;
    saveNowBtn.textContent = 'Guardado ✓';
    setTimeout(function(){ saveNowBtn.textContent = original; }, 1800);
  });
  pdfBtn.addEventListener('click', function(){
    window.print();
  });

  /* ---------- smooth anchor scroll for quick nav ---------- */
  var quicknavEl = root.querySelector('.quicknav');
  if (quicknavEl) {
    quicknavEl.addEventListener('click', function(e){
      var link = e.target.closest('a[href^="#"]'); if (!link) return;
      var target = document.getElementById(link.getAttribute('href').slice(1));
      if (target) { e.preventDefault(); target.scrollIntoView({behavior:'smooth', block:'start'}); }
    });
  }

  /* ---------- demo loader (preview only — never runs unless clicked) ---------- */
  var loadDemoBtn = document.getElementById('loadDemoBtn');
  loadDemoBtn.addEventListener('click', function(){
    var demoDate = new Date(); demoDate.setMonth(demoDate.getMonth()+4); demoDate.setDate(13);

    state.brideName = 'Valentina';
    state.groomName = 'Sebastián';
    state.date = demoDate.toISOString().slice(0,10);
    state.city = 'bogota';
    state.headCapacity = 6;
    state.headGuests = ['Valentina Rojas', 'Sebastián Torres', 'Marcela Gómez (madre de la novia)', 'Carlos Rojas (padre de la novia)', 'Patricia Vélez (madre del novio)', 'Andrés Torres (padre del novio)'];

    state.guestCount = 80;
    state.perTable = 8;
    state.tableCount = 10;
    state.layoutMode = 'round';
    state.tableLabels = ['Familia de la novia','Familia del novio','Amigos del colegio','Amigos de la universidad','Compañeros de trabajo — Valentina','Compañeros de trabajo — Sebastián','Tíos y primos','Padrinos de matrimonio','','' ];
    state.tableGuests = [
      ['Ana Rojas','Pedro Rojas','Camila Fernández','Luis Fernández'],
      ['Jorge Torres','Diana Torres','Felipe Castro','Manuela Castro'],
      ['Daniela Ospina','Juan Pablo Ríos','Laura Salazar','Mateo Gil'],
      ['Natalia Herrera','Santiago Prieto','Camilo Duarte'],
      ['Alejandra Cortés','Ricardo Nieto'],
      ['Paula Medina','Andrés Quintero'],
      [],
      ['Sofía Ramírez','Tomás Ramírez'],
      [],
      []
    ];

    state.mode = 'work';
    state.crew = [
      {role:'Fotógrafo/a', name:'Velozza Creative Works — José David', phone:'+57 305 309 0273'},
      {role:'Coordinador/a', name:'Laura Jiménez', phone:'+57 310 555 1234'},
      {role:'DJ / Sonido', name:'DJ Andrés Ruiz', phone:'+57 315 222 8899'},
      {role:'Estilista', name:'Camila Beauty Studio', phone:'+57 320 444 7766'}
    ];
    state.menu = [
      {name:'Entrada', item:'Carpaccio de res con rúgula, parmesano y reducción de balsámico'},
      {name:'Plato fuerte', item:'Lomo al vino tinto con puré de papa criolla y vegetales salteados'},
      {name:'Postre', item:'Mousse de maracuyá con crumble de galleta'},
      {name:'Bebidas', item:'Barra libre nacional + coctel de bienvenida de maracuyá'}
    ];
    state.menuNotes = '6 menús vegetarianos, 2 sin gluten (avisar en la mesa 3), 8 menús infantiles.';

    brideNameEl.textContent = state.brideName;
    groomNameEl.textContent = state.groomName;
    headTableNamesEl.textContent = displayNames();
    dateEl.value = state.date;
    cityEl.value = state.city;
    guestCountEl.value = state.guestCount;
    perTableEl.value = state.perTable;
    tablesNeededEl.value = state.tableCount;
    Array.prototype.forEach.call(layoutToggle.querySelectorAll('button'), function(b){ b.classList.toggle('on', b.getAttribute('data-layout')===state.layoutMode); });
    Array.prototype.forEach.call(modeToggle.querySelectorAll('button'), function(b){ b.classList.toggle('on', b.getAttribute('data-mode')===state.mode); });
    menuNotesEl.textContent = state.menuNotes;

    closeTableEditor();
    renderLightBar();
    renderTimeline();
    renderTables();
    updateHeadBadge();
    renderCrew();
    renderMenu();
    updateCountdown();
    persist();

    document.getElementById('cronograma').scrollIntoView({behavior:'smooth', block:'start'});
  });

  renderLightBar();
  renderTimeline();
  renderCrew();
  renderTables();
  updateHeadBadge();
  renderMenu();
  updateCountdown();
  initReveal();

  var lastNowIdx = currentBlockIndex();
  var intervalId = setInterval(function(){
    updateCountdown();
    if (isWeddingToday()) {
      var idx = currentBlockIndex();
      if (idx !== lastNowIdx && document.activeElement.tagName !== 'INPUT' && !document.activeElement.isContentEditable) {
        lastNowIdx = idx; renderTimeline();
      }
    }
  }, 1000);

  return function cleanup(){ clearInterval(intervalId); };
}

