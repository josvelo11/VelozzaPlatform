export const CB_MARKUP = `
<nav class="quicknav">
  <a href="#luz">Luz</a><a href="#cronograma">Cronograma</a><a href="#mesas">Mesas</a><a href="#menu">Menú</a><a href="#fotos">Fotos grupales</a><a href="#equipo">Equipo</a><a href="#tips">Tips</a>
</nav>

<div class="hero">
  <svg class="logo-mark hero-anim" style="animation-delay:.05s" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M50 8 L88 82 L50 62 L12 82 Z" fill="url(#g)"/>
    <defs><linearGradient id="g" x1="12" y1="8" x2="88" y2="82"><stop stop-color="#f0d98a"/><stop offset="1" stop-color="#8a6d24"/></linearGradient></defs>
  </svg>
  <span class="eyebrow hero-anim" style="animation-delay:.1s">Cronograma del gran día · Velozza Creative Works</span>
  <div class="cb-names-wrap hero-anim" style="animation-delay:.15s">
    <h1 class="cb-names-heading">
      <span id="brideName" class="cb-name-field" contenteditable="true" data-ph="Novia"></span> <span class="cb-amp">&amp;</span> <span id="groomName" class="cb-name-field" contenteditable="true" data-ph="Novio"></span>
    </h1>
    <div class="cb-edit-hint"><svg class="cb-edit-hint-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 20l1-4L16 5l3 3L8 19l-4 1z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>Toquen cada nombre para escribir el suyo — toda esta planilla es editable</div>
  </div>
  <p class="subtitle hero-anim" style="animation-delay:.2s">Su planilla personal, construida por fotógrafos — no una plantilla genérica de wedding planner. Editen cada dato con su información real.</p>
  <button type="button" id="loadDemoBtn" class="demo-link hero-anim" style="animation-delay:.22s">Ver un ejemplo lleno de una boda</button>
  <div class="hero-controls hero-anim" style="animation-delay:.25s">
    <span class="lbl">Fecha</span>
    <input type="date" id="weddingDate">
    <span class="lbl">Ciudad</span>
    <select id="city">
      <option value="bogota">Bogotá</option>
      <option value="medellin">Medellín</option>
      <option value="cali">Cali</option>
      <option value="cartagena">Cartagena</option>
      <option value="barranquilla">Barranquilla</option>
    </select>
  </div>

  <div class="countdown hero-anim" style="animation-delay:.3s" id="countdown" aria-live="polite">
    <div class="unit"><span class="n" id="cd-d">00</span><span class="l">Días</span></div>
    <div class="unit"><span class="n" id="cd-h">00</span><span class="l">Horas</span></div>
    <div class="unit"><span class="n" id="cd-m">00</span><span class="l">Minutos</span></div>
    <div class="unit"><span class="n" id="cd-s">00</span><span class="l">Segundos</span></div>
  </div>
  <div class="countdown-msg" id="countdownMsg" hidden></div>
  <div class="live-badge" id="liveBadge"><span class="live-dot"></span><span>Su boda está en curso ahora mismo</span></div>
  <div class="agency-badge hero-anim" style="animation-delay:.35s">Diseñado por <b>Velozza Creative Works</b> — su agencia de fotografía y contenido</div>
</div>

<div class="wrap">
  <section class="s rv" id="luz">
    <div class="head">
      <div>
        <span class="eyebrow">Calculado para su fecha y ciudad</span>
        <h2>La <em class="gold-text">luz</em> de su día</h2>
        <p>La hora dorada real no es "como a las 5" — depende de su fecha y su ciudad exacta. Esto es lo que un wedding planner no calcula y nosotros sí, porque de esto vivimos.</p>
      </div>
    </div>
    <div class="light-bar-wrap">
      <div class="light-bar" id="lightBar"></div>
      <div class="light-key">
        <div class="k"><span class="sw" style="background:#c8c2b0"></span>Luz suave</div>
        <div class="k"><span class="sw" style="background:var(--harsh)"></span>Luz dura (evitar exteriores)</div>
        <div class="k"><span class="sw" style="background:var(--gold2)"></span>Hora dorada</div>
        <div class="k"><span class="sw" style="background:var(--blue)"></span>Hora azul</div>
        <div class="k"><span class="sw" style="background:var(--night)"></span>Noche</div>
      </div>
    </div>
    <div class="light-times">
      <div class="lt"><span class="lbl">Amanece</span><div class="val" id="lt-sunrise">—</div><div class="desc">luz suave hasta media mañana</div></div>
      <div class="lt"><span class="lbl">Luz dura</span><div class="val" id="lt-harsh">11:00 – 14:00</div><div class="desc">eviten retratos a pleno sol exterior</div></div>
      <div class="lt"><span class="lbl">Hora dorada</span><div class="val" id="lt-golden">—</div><div class="desc">40 min antes de la puesta de sol</div></div>
      <div class="lt"><span class="lbl">Se oculta el sol</span><div class="val" id="lt-sunset">—</div><div class="desc">hora azul: ~25 min después</div></div>
    </div>
  </section>

  <section class="s rv" id="cronograma">
    <div class="head">
      <div>
        <span class="eyebrow">Editable</span>
        <h2>Cronograma <em class="gold-text">del día</em></h2>
        <p>La técnica que usamos en cada boda: un cronograma para invitados, y uno de trabajo con margen real que nadie ve. Cambien de vista abajo.</p>
      </div>
      <div class="mode-toggle" id="modeToggle">
        <button type="button" data-mode="work" class="on">De trabajo (con margen)</button>
        <button type="button" data-mode="guests">Para invitados</button>
      </div>
    </div>
    <div class="timeline" id="timeline"></div>
    <button class="add-row" id="addRow" type="button">+ Agregar bloque al cronograma</button>
    <div class="copy-row">
      <button class="ghost-btn" id="copyBtn" type="button">Copiar cronograma para enviar por WhatsApp</button>
    </div>
  </section>

  <section class="s rv" id="mesas">
    <div class="head">
      <div>
        <span class="eyebrow">Se ajusta solo</span>
        <h2>Mapa de <em class="gold-text">mesas</em></h2>
        <p>Pongan cuántos invitados esperan y cuántos caben por mesa — el mapa se arma solo. Toquen cualquier mesa (incluida la principal) para escribir quién se sienta ahí.</p>
      </div>
      <div class="mode-toggle" id="layoutToggle">
        <button type="button" data-layout="round" class="on">Mesas redondas</button>
        <button type="button" data-layout="imperial">Mesas imperiales</button>
        <button type="button" data-layout="u">Forma de U</button>
        <button type="button" data-layout="rows">2 filas, pasillo central</button>
      </div>
    </div>
    <div class="guest-controls">
      <div class="gc-field"><span class="lbl">Invitados totales</span><input type="number" id="guestCount" min="0" step="1"></div>
      <div class="gc-field"><span class="lbl">Personas por mesa</span><input type="number" id="perTable" min="2" step="1"></div>
      <div class="gc-field gc-field-tables"><span class="lbl">Mesas</span><input type="number" id="tablesNeeded" min="0" step="1" class="num-input"><span class="lbl2">editable — anula el cálculo automático</span></div>
    </div>
    <p class="layout-desc" id="layoutDesc">Ideal para recepciones grandes: buena vista desde cualquier mesa hacia la pista y la mesa principal.</p>
    <div class="table-map" id="tableMap">
      <button type="button" class="head-table" id="headTableBtn" aria-label="Editar invitados de la mesa principal">
        <span class="lbl">Mesa principal <span class="ht-count" id="headCountBadge">·  2p</span></span>
        <div class="plate">
          <svg class="fl" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#f0d98a" stroke-width="1.4"/></svg>
          <span class="nm" id="headTableNames">Nombre &amp; Nombre</span>
          <svg class="fl" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#f0d98a" stroke-width="1.4"/></svg>
        </div>
      </button>
      <div class="dancefloor"></div>
      <div class="tables-grid" id="tablesGrid"></div>

      <div class="table-editor" id="tableEditor" hidden>
        <div class="te-head">
          <div>
            <span class="eyebrow" id="teTitle">Mesa</span>
            <div class="te-sub" id="teSub">0 personas asignadas</div>
          </div>
          <div class="te-headright">
            <label class="te-cap-lbl" id="teCapWrap" hidden>Cupos <input type="number" id="teCapacity" min="1" step="1"></label>
            <button type="button" class="icon-btn" id="teClose" aria-label="Cerrar">&times;</button>
          </div>
        </div>
        <div class="te-names" id="teNames"></div>
        <button type="button" class="add-row" id="teAddName">+ Agregar invitado a esta mesa</button>
      </div>
    </div>
  </section>

  <section class="s rv" id="menu">
    <div class="head">
      <div>
        <span class="eyebrow">Editable</span>
        <h2>Menú <em class="gold-text">del evento</em></h2>
        <p>Su menú, sus tiempos. Agreguen o quiten platos y dejen registradas las opciones especiales para su equipo y el salón.</p>
      </div>
    </div>
    <div class="menu-courses" id="menuCourses"></div>
    <button class="add-row" id="addCourse" type="button">+ Agregar tiempo al menú</button>
    <div class="menu-notes">
      <span class="lbl">Opciones especiales (vegetariano, sin gluten, menú infantil, alergias)</span>
      <div class="menu-notes-box" id="menuNotes" contenteditable="true" data-ph="Ej: 6 menús vegetarianos, 2 sin gluten, 4 menús infantiles…"></div>
    </div>
  </section>

  <section class="s rv" id="fotos">
    <div class="head">
      <div>
        <span class="eyebrow">Guía de composición</span>
        <h2>Fotos con su <em class="gold-text">cortejo</em></h2>
        <p>La regla que usamos en cámara para que las fotos grupales se vean balanceadas, no apretadas ni con caras perdidas al fondo.</p>
      </div>
    </div>
    <div class="photo-guide">
      <div class="photo-diagram">
        <div class="pd-row">
          <div class="pd-fig" style="height:52px"></div>
          <div class="pd-fig" style="height:60px"></div>
          <div class="pd-fig" style="height:68px"></div>
          <div class="pd-fig" style="height:76px"></div>
          <div class="pd-fig couple" style="height:84px"></div>
          <div class="pd-fig couple" style="height:84px"></div>
          <div class="pd-fig" style="height:76px"></div>
          <div class="pd-fig" style="height:68px"></div>
          <div class="pd-fig" style="height:60px"></div>
          <div class="pd-fig" style="height:52px"></div>
        </div>
        <span class="pd-cap">Máx. 4 personas por lado · orden por estatura hacia afuera</span>
      </div>
      <div class="photo-copy">
        <ul>
          <li><b>Máximo 4 personas de cada lado de la pareja.</b> Más que eso, la foto pierde equilibrio y las caras de los extremos quedan pequeñas o cortadas.</li>
          <li><b>Ordenen por estatura</b> hacia afuera desde el centro — no al azar. Se lee más natural y todos quedan visibles.</li>
          <li><b>Grupos más grandes:</b> hagan sub-grupos (padres, padrinos, amigos) en vez de forzar a todo el cortejo en una sola toma.</li>
          <li>Avísenle a su fotógrafo cuántas personas tiene su cortejo con anticipación, para que reserve el tiempo justo en el cronograma.</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="s rv" id="equipo">
    <div class="head">
      <div>
        <span class="eyebrow">Para compartir</span>
        <h2>Equipo <em class="gold-text">del día</em></h2>
        <p>En promedio hay más de 8 personas coordinando una boda. Tengan sus datos en un solo lugar.</p>
      </div>
    </div>
    <div class="crew-head"><span>Rol</span><span>Nombre</span><span>Teléfono</span><span></span></div>
    <div class="crew" id="crew"></div>
    <button class="add-row" id="addCrew" type="button" style="margin-top:10px">+ Agregar persona</button>
  </section>

  <section class="s rv" id="tips">
    <div class="head">
      <div>
        <span class="eyebrow">De nuestra experiencia</span>
        <h2>Tips para que <em class="gold-text">todo fluya</em></h2>
        <p>Lo que hemos visto marcar la diferencia real en las bodas que hemos cubierto.</p>
      </div>
    </div>
    <div class="tips">
      <div class="tip"><div class="n">01</div><h3>El cronograma con colchón</h3>
        <ul><li>Repartan 30-45 min de margen dentro de los bloques, no al final del día.</li>
        <li>Calculen los horarios hacia atrás desde lo menos flexible: la ceremonia.</li></ul>
      </div>
      <div class="tip"><div class="n">02</div><h3>Fotos familiares sin caos</h3>
        <ul><li>Lista con nombres completos, máximo 10-12 grupos por lado.</li>
        <li>Envíenla a su fotógrafo al menos dos semanas antes.</li></ul>
      </div>
      <div class="tip"><div class="n">03</div><h3>Para verse bien todo el día</h3>
        <ul><li>Maquillaje de acabado mate o semi-mate: se fotografía mejor que el brillante.</li>
        <li>Armen un kit de retoque y asígnenselo a alguien más para cargarlo.</li></ul>
      </div>
      <div class="tip"><div class="n">04</div><h3>El retrato de pareja</h3>
        <ul><li>Practiquen 2-3 posiciones de manos frente al espejo antes del día.</li>
        <li>Alternen poses estáticas con movimiento para que se vea natural.</li></ul>
      </div>
      <div class="tip"><div class="n">05</div><h3>Si el clima cambia</h3>
        <ul><li>Definan con su coordinador un plan B techado con al menos una semana de margen.</li>
        <li>Pidan a su fotógrafo llevar equipo para lluvia — no cancela la sesión exterior.</li></ul>
      </div>
      <div class="tip"><div class="n">06</div><h3>El día siguiente</h3>
        <ul><li>Descansen antes de revisar fotos — la primera mirada rinde más con la cabeza fresca.</li>
        <li>Guarden esta planilla: les sirve de recuerdo del plan real de su día.</li></ul>
      </div>
    </div>
  </section>

  <section class="s rv save-section">
    <div class="save-actions">
      <button type="button" class="cta-save" id="saveNowBtn">Guardar cronograma</button>
      <button type="button" class="cta-pdf" id="pdfBtn">Guardar como PDF</button>
    </div>
    <div class="pdf-hint">
      Al hacer clic se abre el diálogo de impresión de su navegador — en <b>Destino</b> elijan <b>Guardar como PDF</b>. La vista ya está lista para imprimirse limpia, sin botones ni menús.
    </div>
  </section>
</div>

<footer>
  <div class="wrap foot-grid">
    <div>
      <div class="sig">Velozza Creative Works</div>
      <div class="tag2">Fotografía y contenido para bodas · Bogotá y Colombia</div>
      <div class="tag2">Cronograma personalizado, hecho a mano para ustedes.</div>
    </div>
    <div class="foot-contact">
      <span>+57 305 309 0273 · +57 319 367 7929</span>
      <a href="mailto:ceo@velozzacws.com">ceo@velozzacws.com</a>
      <a href="https://velozzacws.com" target="_blank" rel="noopener">velozzacws.com</a>
      <a href="https://instagram.com/velozzacws" target="_blank" rel="noopener">@velozzacws</a>
      <a class="wa-btn" href="https://wa.me/573053090273" target="_blank" rel="noopener">Escribir por WhatsApp</a>
    </div>
  </div>
</footer>

<div class="save-pill" id="savePill"><i></i><span>Cambios guardados</span></div>
`;
