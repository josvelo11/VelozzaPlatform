export const CB_STYLES = `
.cb-root{
  --bg:#0b0906; --bg2:#141109; --bg3:#1a1610; --ink:#f4f2ec; --mut:#c7c3b8; --mut2:#a6a294;
  --gold:#c9a84c; --gold2:#f0d98a; --goldd:#8a6d24;
  --line:rgba(201,168,76,.22); --line2:rgba(201,168,76,.4);
  --harsh:#e0714a; --blue:#8b9bd9; --night:#4a4a52;
  color-scheme: dark;
  box-sizing:border-box;
  margin:0;background:var(--bg);color:var(--ink);
  font:400 15px/1.7 'Montserrat',system-ui,sans-serif;-webkit-font-smoothing:antialiased;
  padding-inline:20px;padding-block:0;overflow-x:hidden;
  border-radius:14px;
  isolation:isolate;
}

.cb-root *{box-sizing:border-box}

.cb-root .wrap{max-width:980px;margin:0 auto}

.cb-root h1, .cb-root h2, .cb-root h3{font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;margin:0;text-wrap:balance}

.cb-root .eyebrow{font:700 10.5px 'Montserrat';letter-spacing:.3em;text-transform:uppercase;color:var(--gold)}

.cb-root .gold-text{background:linear-gradient(100deg,var(--gold2),var(--gold) 60%,#a98a33);-webkit-background-clip:text;background-clip:text;color:transparent}

.cb-root a{color:var(--gold2)}

.cb-root button{font-family:inherit}

.cb-root [contenteditable="true"]{outline:none;border-radius:4px;transition:background .2s ease, box-shadow .2s ease}

.cb-root [contenteditable="true"]:hover{background:rgba(201,168,76,.06)}

.cb-root [contenteditable="true"]:focus{background:rgba(201,168,76,.1);box-shadow:0 0 0 1px var(--line)}

.cb-root [contenteditable="true"]:empty:before{content:attr(data-ph);color:var(--mut2)}

@media (prefers-reduced-motion: reduce){.cb-root *{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important;scroll-behavior:auto !important}
}



.cb-root .rv-ready.rv-pending{opacity:0;transform:translateY(22px)}

.cb-root .rv-ready{transition:opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1)}

.cb-root .rv-ready.rv-on{opacity:1;transform:none}


@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}

.cb-root .hero-anim{animation:fadeUp .8s cubic-bezier(.16,1,.3,1) both}



.cb-root .quicknav{position:sticky;top:0;z-index:40;background:rgba(11,9,6,.88);backdrop-filter:blur(10px);border-bottom:1px solid var(--line);display:flex;gap:4px;overflow-x:auto;padding:10px 20px;scrollbar-width:none}

.cb-root .quicknav::-webkit-scrollbar{display:none}

.cb-root .quicknav a{flex:none;color:var(--mut);text-decoration:none;font:700 10px 'Montserrat';letter-spacing:.12em;text-transform:uppercase;padding:8px 14px;border-radius:99px;transition:color .2s,background .2s}

.cb-root .quicknav a:hover{color:var(--gold2);background:rgba(201,168,76,.08)}



.cb-root .hero{padding-block:52px 36px;text-align:center;border-bottom:1px solid var(--line);background:radial-gradient(80% 60% at 50% 0%,#1a1508 0%,var(--bg) 68%);position:relative;overflow:hidden}

.cb-root .hero:before{content:'';position:absolute;inset:0;background:
  radial-gradient(1px 1px at 20% 30%, rgba(240,217,138,.5) 0, transparent 60%),
  radial-gradient(1px 1px at 80% 20%, rgba(240,217,138,.4) 0, transparent 60%),
  radial-gradient(1px 1px at 60% 70%, rgba(240,217,138,.35) 0, transparent 60%),
  radial-gradient(1px 1px at 35% 80%, rgba(240,217,138,.3) 0, transparent 60%);
  pointer-events:none;opacity:.8}

.cb-root .logo-mark{width:36px;height:36px;margin:0 auto 20px;opacity:.9;position:relative}

.cb-root .hero .eyebrow{display:block;margin-bottom:16px;position:relative}

.cb-root .cb-names-wrap{position:relative}

.cb-root .cb-names-heading{font:italic 500 clamp(32px,6.6vw,54px)/1.05 'Cormorant Garamond',serif;display:flex;align-items:center;justify-content:center;gap:2px;flex-wrap:wrap}

.cb-root .cb-name-field{display:inline-block;min-width:9ch;vertical-align:middle;background:linear-gradient(100deg,var(--gold2),var(--gold) 55%,#a98a33);-webkit-background-clip:text;background-clip:text;color:transparent;padding:10px 18px;border-radius:10px;line-height:1.2}

.cb-root .cb-name-field:empty{border:1.5px dashed var(--line2);background-color:rgba(201,168,76,.05)}

.cb-root .cb-name-field:not(:empty){border:1.5px solid transparent}

.cb-root .cb-name-field:empty:before{font-family:'Montserrat',sans-serif;font-style:normal;font-weight:600;font-size:13px;letter-spacing:.02em;white-space:nowrap;color:var(--mut)}

.cb-root .cb-name-field:hover, .cb-root .cb-name-field:focus{background-image:linear-gradient(100deg,var(--gold2),var(--gold) 55%,#a98a33);-webkit-background-clip:text;background-clip:text;border-color:var(--gold)}

.cb-root .cb-name-field:empty:hover, .cb-root .cb-name-field:empty:focus{background-color:rgba(201,168,76,.1)}

.cb-root .cb-amp{color:var(--goldd);opacity:.85;padding:0 4px}

.cb-root .cb-edit-hint{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:12px;font:600 10.5px 'Montserrat';letter-spacing:.06em;color:var(--mut2)}

.cb-root .cb-edit-hint-icon{width:13px;height:13px;flex:none;color:var(--gold)}

.cb-root .subtitle{color:var(--mut);font-size:13.5px;max-width:42em;margin:12px auto 0;position:relative}

.cb-root .hero-controls{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:22px;position:relative}

.cb-root .hero-controls select, .cb-root .hero-controls input[type="date"]{background:var(--bg3);border:1px solid var(--line);color:var(--gold2);font:600 12.5px 'Montserrat';letter-spacing:.04em;padding:9px 12px;border-radius:6px;color-scheme:dark;transition:border-color .2s}

.cb-root .hero-controls select:hover, .cb-root .hero-controls input:hover{border-color:var(--line2)}

.cb-root .hero-controls .lbl{color:var(--mut);font-size:11px;letter-spacing:.18em;text-transform:uppercase}


.cb-root .countdown{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;max-width:500px;margin:30px auto 0;border:1px solid var(--line);background:var(--line);border-radius:10px;overflow:hidden;position:relative}

.cb-root .countdown .unit{background:var(--bg2);padding:16px 8px;text-align:center;transition:background .3s}

.cb-root .countdown .n{font:800 clamp(22px,4.4vw,34px)/1 'Montserrat',system-ui,sans-serif;color:var(--gold2);font-variant-numeric:tabular-nums;display:inline-block}

.cb-root .countdown .n.tick{animation:tick .45s cubic-bezier(.34,1.56,.64,1)}

@keyframes tick{0%{transform:translateY(0);opacity:1}40%{transform:translateY(-8px);opacity:.3}41%{transform:translateY(8px)}100%{transform:translateY(0);opacity:1}}

.cb-root .countdown .l{display:block;margin-top:6px;font:600 8.5px 'Montserrat';letter-spacing:.2em;text-transform:uppercase;color:var(--mut)}

.cb-root .countdown-msg{margin-top:14px;font:600 12px 'Montserrat';letter-spacing:.14em;text-transform:uppercase;color:var(--gold);text-align:center}

.cb-root .live-badge{display:none;align-items:center;gap:8px;justify-content:center;margin-top:16px;font:700 10.5px 'Montserrat';letter-spacing:.18em;text-transform:uppercase;color:var(--gold2)}

.cb-root .live-badge.show{display:flex}

.cb-root .live-dot{width:8px;height:8px;border-radius:50%;background:var(--gold2);animation:pulse 1.6s ease-in-out infinite}

@keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(240,217,138,.5)}50%{opacity:.7;box-shadow:0 0 0 6px rgba(240,217,138,0)}}


.cb-root .agency-badge{margin-top:26px;display:inline-flex;align-items:center;gap:8px;font:600 10px 'Montserrat';letter-spacing:.16em;text-transform:uppercase;color:var(--mut2);position:relative}

.cb-root .demo-link{margin-top:16px;background:transparent;border:0;border-bottom:1px dashed var(--line2);color:var(--mut);font:600 11px 'Montserrat';letter-spacing:.06em;padding:2px 2px 3px;cursor:pointer;position:relative}

.cb-root .demo-link:hover{color:var(--gold2);border-color:var(--gold)}

.cb-root .agency-badge b{color:var(--gold)}



.cb-root section.s{padding-block:52px;scroll-margin-top:64px}

.cb-root .s + .s{border-top:1px solid var(--line)}

.cb-root .head{margin-bottom:28px;text-align:left;display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap}

.cb-root .head h2{font-size:clamp(24px,3.6vw,34px);margin-top:8px}

.cb-root .head p{color:var(--mut);margin:8px 0 0;max-width:58ch;font-size:13.5px}



.cb-root .light-bar-wrap{margin-top:4px}

.cb-root .light-bar{position:relative;height:34px;border-radius:8px;overflow:hidden;border:1px solid var(--line);display:flex;transform:scaleX(0);transform-origin:left;transition:transform 1.1s cubic-bezier(.16,1,.3,1)}

.cb-root .light-bar.on{transform:scaleX(1)}

.cb-root .light-bar .seg{height:100%}

.cb-root .light-key{display:flex;flex-wrap:wrap;gap:16px;margin-top:14px}

.cb-root .light-key .k{display:flex;align-items:center;gap:7px;font-size:11.5px;color:var(--mut)}

.cb-root .light-key .sw{width:10px;height:10px;border-radius:3px;flex:none}

.cb-root .light-times{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;margin-top:20px}

.cb-root .light-times .lt{background:var(--bg2);border:1px solid var(--line);border-radius:8px;padding:14px 16px;transition:border-color .2s,transform .2s}

.cb-root .light-times .lt:hover{border-color:var(--line2);transform:translateY(-2px)}

.cb-root .light-times .lt .lbl{font:700 9.5px 'Montserrat';letter-spacing:.16em;text-transform:uppercase;color:var(--gold);display:block}

.cb-root .light-times .lt .val{font:600 22px 'Cormorant Garamond';color:var(--ink);margin-top:4px}

.cb-root .light-times .lt .desc{color:var(--mut2);font-size:11px;margin-top:2px}



.cb-root .mode-toggle{display:inline-flex;border:1px solid var(--line);border-radius:99px;padding:3px;background:var(--bg2)}

.cb-root .mode-toggle button{border:0;background:transparent;color:var(--mut);cursor:pointer;font:700 10.5px 'Montserrat';letter-spacing:.1em;text-transform:uppercase;padding:8px 16px;border-radius:99px;transition:all .2s ease}

.cb-root .mode-toggle button.on{background:linear-gradient(100deg,var(--gold2),var(--gold));color:#1a1200}



.cb-root .timeline{display:flex;flex-direction:column;gap:1px;background:var(--line);border:1px solid var(--line);border-radius:10px;overflow:hidden}

.cb-root .row{display:grid;grid-template-columns:14px 112px 1fr auto;gap:12px;align-items:start;background:var(--bg2);padding:15px 16px;position:relative;transition:background .2s}

.cb-root .row:hover{background:var(--bg3)}

.cb-root .row.critical{box-shadow:inset 3px 0 0 var(--gold)}

.cb-root .row.now{box-shadow:inset 3px 0 0 var(--gold2);background:var(--bg3)}

.cb-root .row .dot{width:11px;height:11px;border-radius:50%;margin-top:5px;flex:none;border:1px solid rgba(0,0,0,.2)}

.cb-root .row .time{font:600 13.5px 'Montserrat';color:var(--gold2);background:transparent;border:0;color-scheme:dark;width:100%;padding:0}

.cb-root .row .mid{min-width:0}

.cb-root .row .activity-line{display:flex;align-items:center;gap:8px;flex-wrap:wrap}

.cb-root .row .activity{font:600 16.5px 'Cormorant Garamond';color:var(--ink);min-height:1.3em}

.cb-root .row .note{color:var(--mut);font-size:12px;margin-top:4px;min-height:1.2em}

.cb-root .tag{font:700 8.5px 'Montserrat';letter-spacing:.12em;text-transform:uppercase;padding:2px 7px;border-radius:99px;flex:none}

.cb-root .tag.critical{background:rgba(201,168,76,.16);color:var(--gold2);border:1px solid var(--line2)}

.cb-root .tag.now{background:var(--gold2);color:#1a1200}

.cb-root .row-actions{display:flex;gap:6px;align-self:center}

.cb-root .icon-btn{background:transparent;border:1px solid var(--line);color:var(--mut);width:27px;height:27px;border-radius:50%;cursor:pointer;font-size:12.5px;line-height:1;display:flex;align-items:center;justify-content:center;transition:all .18s}

.cb-root .icon-btn:hover{border-color:var(--gold);color:var(--gold2);transform:translateY(-1px)}

.cb-root .icon-btn.active{background:var(--gold);border-color:var(--gold);color:#1a1200}

.cb-root .margin-row{display:flex;align-items:center;gap:10px;padding:8px 16px 8px 42px;background:var(--bg);font-size:11px;color:var(--mut2)}

.cb-root .margin-row input{width:42px;background:transparent;border:0;border-bottom:1px dashed var(--line2);color:var(--gold2);font:600 11px 'Montserrat';text-align:center;color-scheme:dark}

.cb-root .margin-row .ln{flex:1;height:1px;background:repeating-linear-gradient(90deg,var(--line2) 0 4px,transparent 4px 8px)}


.cb-root .add-row{margin-top:14px;display:inline-flex;align-items:center;gap:8px;background:transparent;border:1px dashed var(--line);color:var(--mut);font:600 11px 'Montserrat';letter-spacing:.14em;text-transform:uppercase;padding:12px 20px;border-radius:8px;cursor:pointer;width:100%;justify-content:center;transition:all .18s}

.cb-root .add-row:hover{border-color:var(--gold);color:var(--gold2);background:rgba(201,168,76,.04)}


.cb-root .copy-row{display:flex;justify-content:flex-end;margin-top:14px}

.cb-root .ghost-btn{background:transparent;border:1px solid var(--line);color:var(--gold2);font:600 11px 'Montserrat';letter-spacing:.1em;text-transform:uppercase;padding:10px 18px;border-radius:8px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:all .18s}

.cb-root .ghost-btn:hover{border-color:var(--gold);transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,0,0,.3)}



.cb-root .guest-controls{display:flex;flex-wrap:wrap;gap:18px;align-items:flex-end;margin-bottom:32px;padding:20px;background:var(--bg2);border:1px solid var(--line);border-radius:10px}

.cb-root .gc-field{display:flex;flex-direction:column;gap:6px}

.cb-root .gc-field .lbl{font:700 9.5px 'Montserrat';letter-spacing:.14em;text-transform:uppercase;color:var(--mut)}

.cb-root .gc-field input{background:var(--bg3);border:1px solid var(--line);color:var(--gold2);font:700 16px 'Montserrat';padding:9px 12px;border-radius:6px;width:110px;color-scheme:dark}

.cb-root .gc-field-tables{margin-left:auto;text-align:right;align-items:flex-end}

.cb-root .gc-field-tables input{
  background:transparent;border:0;border-bottom:2px solid var(--gold);color:var(--gold2);
  font:700 clamp(28px,4.6vw,38px)/1 'Cormorant Garamond';text-align:right;padding:0 2px 4px;width:90px;
  transition:transform .3s;
}

.cb-root .gc-field-tables input.tick{animation:tick .5s cubic-bezier(.34,1.56,.64,1)}

.cb-root .gc-field-tables .lbl2{display:block;font:600 9px 'Montserrat';letter-spacing:.1em;text-transform:uppercase;color:var(--mut2);margin-top:4px;max-width:150px}


.cb-root .table-map{display:flex;flex-direction:column;align-items:center;gap:34px;padding:36px 20px;background:radial-gradient(ellipse at 50% 0%, rgba(201,168,76,.05), transparent 60%),var(--bg2);border:1px solid var(--line);border-radius:14px}

.cb-root .head-table{position:relative;display:flex;flex-direction:column;align-items:center;gap:10px;animation:fadeUp .6s cubic-bezier(.16,1,.3,1) both;background:transparent;border:0;padding:0;cursor:pointer;font-family:inherit}

.cb-root .head-table .plate{width:min(360px,80vw);height:56px;background:linear-gradient(100deg,rgba(201,168,76,.22),rgba(201,168,76,.06));border:1px solid var(--gold);border-radius:99px;display:flex;align-items:center;justify-content:center;gap:14px;position:relative;box-shadow:0 8px 30px rgba(201,168,76,.12);transition:border-color .2s,transform .2s}

.cb-root .head-table:hover .plate, .cb-root .head-table.editing .plate{border-color:var(--gold2);transform:translateY(-2px)}

.cb-root .head-table .plate .fl{width:14px;height:14px;opacity:.85}

.cb-root .head-table .lbl{font:700 9.5px 'Montserrat';letter-spacing:.18em;text-transform:uppercase;color:var(--gold)}

.cb-root .head-table .nm{font:italic 500 18px 'Cormorant Garamond';color:var(--ink)}

.cb-root .ht-count{color:var(--mut2);letter-spacing:.08em}



.cb-root .table-editor{width:100%;max-width:560px;margin-top:8px;background:var(--bg3);border:1px solid var(--line2);border-radius:12px;padding:22px;animation:fadeUp .35s cubic-bezier(.16,1,.3,1) both}

.cb-root .te-head{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;margin-bottom:16px}

.cb-root .te-head .eyebrow{color:var(--gold2)}

.cb-root .te-sub{color:var(--mut);font-size:12px;margin-top:4px}

.cb-root .te-headright{display:flex;align-items:center;gap:12px}

.cb-root .te-cap-lbl{display:flex;align-items:center;gap:8px;font:700 9.5px 'Montserrat';letter-spacing:.1em;text-transform:uppercase;color:var(--mut)}

.cb-root .te-cap-lbl[hidden]{display:none}

.cb-root .te-cap-lbl input{width:48px;background:var(--bg2);border:1px solid var(--line);color:var(--gold2);font:700 13px 'Montserrat';padding:6px 8px;border-radius:6px;text-align:center;color-scheme:dark}

.cb-root .te-names{display:flex;flex-direction:column;gap:1px;background:var(--line);border:1px solid var(--line);border-radius:8px;overflow:hidden}

.cb-root .te-name-row{display:flex;align-items:center;gap:10px;background:var(--bg2);padding:10px 14px}

.cb-root .te-name-row .seat{font:700 10px 'Montserrat';color:var(--mut2);width:18px;flex:none}

.cb-root .te-name-row .tname{flex:1;font-size:13.5px;min-height:1.3em}

.cb-root .te-empty{padding:16px;text-align:center;color:var(--mut2);font-size:12.5px;background:var(--bg2)}

.cb-root .dancefloor{width:min(220px,60vw);height:1px;background:linear-gradient(90deg,transparent,var(--line2),transparent);position:relative}

.cb-root .dancefloor:after{content:'PISTA';position:absolute;left:50%;top:8px;transform:translateX(-50%);font:700 8px 'Montserrat';letter-spacing:.3em;color:var(--mut2)}


.cb-root .layout-desc{color:var(--mut2);font-size:12px;margin:-14px 0 22px;text-align:center}

.cb-root .tables-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:30px 26px;max-width:820px}

.cb-root .tables-grid.layout-imperial{flex-direction:column;align-items:center;max-width:420px;gap:18px}

.cb-root .tables-grid.layout-u{position:relative;width:100%;max-width:680px;height:340px;margin:0 auto}

.cb-root .tables-grid.layout-u .table-unit{position:absolute}


.cb-root .tables-grid.layout-rows{display:flex;justify-content:center;align-items:flex-start;gap:0;max-width:none;width:100%}

.cb-root .rows-col{display:flex;flex-direction:column;align-items:center;gap:26px;padding:0 20px}

.cb-root .aisle{width:1px;align-self:stretch;background:repeating-linear-gradient(180deg,var(--line2) 0 6px,transparent 6px 14px);position:relative;min-height:120px;margin:0 22px}

.cb-root .aisle .al{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(90deg);white-space:nowrap;font:700 8px 'Montserrat';letter-spacing:.3em;color:var(--mut2);background:var(--bg2);padding:4px 10px}


.cb-root .table-rect{width:280px;height:52px;border-radius:8px;background:var(--bg3);border:1.5px solid var(--gold);display:flex;align-items:center;justify-content:center;gap:10px;position:relative;transition:border-color .2s,transform .2s;cursor:pointer}

.cb-root .table-rect:hover{border-color:var(--gold2);transform:scale(1.02)}

.cb-root .table-rect.editing{border-color:var(--gold2);box-shadow:0 0 0 4px rgba(240,217,138,.14)}

.cb-root .table-rect .tn{font:700 15px 'Cormorant Garamond';color:var(--gold2)}

.cb-root .table-rect .tc{font:600 9px 'Montserrat';color:var(--mut2)}

.cb-root .table-rect .tick{position:absolute;width:5px;height:9px;background:var(--line2);border-radius:2px}

.cb-root .rect-unit{display:flex;flex-direction:column;align-items:center;gap:8px;animation:tableIn .4s cubic-bezier(.34,1.56,.64,1) both}

.cb-root .table-unit{position:relative;width:104px;height:104px;display:flex;align-items:center;justify-content:center;animation:tableIn .45s cubic-bezier(.34,1.56,.64,1) both}

@keyframes tableIn{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:scale(1)}}

.cb-root .table-circle{width:66px;height:66px;border-radius:50%;background:var(--bg3);border:1.5px solid var(--gold);display:flex;align-items:center;justify-content:center;flex-direction:column;position:relative;z-index:2;transition:border-color .2s,transform .2s,box-shadow .2s;cursor:pointer}

.cb-root .table-unit:hover .table-circle{border-color:var(--gold2);transform:scale(1.05)}

.cb-root .table-circle.editing{border-color:var(--gold2);box-shadow:0 0 0 4px rgba(240,217,138,.14)}

.cb-root .table-circle .tf{font:700 7px 'Montserrat';color:var(--gold2);margin-top:1px}

.cb-root .table-circle .tn{font:700 15px 'Cormorant Garamond';color:var(--gold2);line-height:1}

.cb-root .table-circle .tc{font:600 8px 'Montserrat';color:var(--mut2);margin-top:2px}

.cb-root .chair{position:absolute;width:7px;height:7px;border-radius:50%;background:var(--gold);opacity:.7;z-index:1}

.cb-root .table-label{position:absolute;bottom:-20px;left:50%;transform:translateX(-50%);font-size:9.5px;color:var(--mut2);white-space:nowrap;min-width:60px;text-align:center;max-width:104px;overflow:hidden;text-overflow:ellipsis}

.cb-root .table-label[contenteditable="true"]:hover, .cb-root .table-label[contenteditable="true"]:focus{color:var(--gold2);background:rgba(201,168,76,.08);white-space:normal}



.cb-root .photo-guide{display:grid;grid-template-columns:1.1fr .9fr;gap:32px;align-items:center}

.cb-root .photo-diagram{background:var(--bg2);border:1px solid var(--line);border-radius:12px;padding:28px 20px;display:flex;flex-direction:column;align-items:center;gap:14px}

.cb-root .pd-row{display:flex;align-items:flex-end;gap:8px}

.cb-root .pd-fig{width:20px;border-radius:4px 4px 0 0;background:linear-gradient(180deg,var(--mut2),transparent);position:relative}

.cb-root .pd-fig.couple{background:linear-gradient(180deg,var(--gold2),var(--goldd));width:24px}

.cb-root .pd-cap{font-size:10px;color:var(--mut2);letter-spacing:.08em;text-transform:uppercase;margin-top:6px}

.cb-root .photo-copy ul{margin:14px 0 0;padding-left:18px;color:var(--mut);font-size:13px;line-height:1.7}

.cb-root .photo-copy li+li{margin-top:8px}

.cb-root .photo-copy li b{color:var(--gold2)}



.cb-root .menu-courses{display:flex;flex-direction:column;gap:1px;background:var(--line);border:1px solid var(--line);border-radius:10px;overflow:hidden}

.cb-root .menu-course{display:grid;grid-template-columns:150px 1fr 32px;gap:14px;align-items:start;background:var(--bg2);padding:16px 18px;transition:background .2s}

.cb-root .menu-course:hover{background:var(--bg3)}

.cb-root .menu-course .mc-name{font:700 12px 'Montserrat';letter-spacing:.06em;text-transform:uppercase;color:var(--gold2);min-height:1.3em}

.cb-root .menu-course .mc-item{font:500 15px 'Cormorant Garamond';color:var(--ink);min-height:1.3em}

.cb-root .menu-notes{margin-top:22px}

.cb-root .menu-notes .lbl{font:700 9.5px 'Montserrat';letter-spacing:.14em;text-transform:uppercase;color:var(--mut);display:block;margin-bottom:10px}

.cb-root .menu-notes-box{background:var(--bg2);border:1px solid var(--line);border-radius:10px;padding:16px 18px;color:var(--mut);font-size:13px;min-height:2.4em;line-height:1.6}



.cb-root .crew{display:flex;flex-direction:column;gap:1px;background:var(--line);border:1px solid var(--line);border-radius:10px;overflow:hidden}

.cb-root .crew .row2{display:grid;grid-template-columns:1fr 1fr 1fr 32px;gap:14px;align-items:center;background:var(--bg2);padding:14px 16px;transition:background .2s}

.cb-root .crew .row2:hover{background:var(--bg3)}

.cb-root .crew .row2 div[contenteditable]{font-size:13.5px;min-height:1.3em}

.cb-root .crew .row2 .role{color:var(--gold2);font-weight:600}

.cb-root .crew .row2 .phone{color:var(--mut);font-variant-numeric:tabular-nums}

.cb-root .crew-head{display:grid;grid-template-columns:1fr 1fr 1fr 32px;gap:14px;padding:0 16px 8px;font:700 9.5px 'Montserrat';letter-spacing:.14em;text-transform:uppercase;color:var(--mut2)}



.cb-root .tips{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);border:1px solid var(--line);border-radius:10px;overflow:hidden}

.cb-root .tip{background:var(--bg2);padding:24px 22px;transition:background .2s}

.cb-root .tip:hover{background:var(--bg3)}

.cb-root .tip .n{font:italic 500 28px 'Cormorant Garamond';color:var(--gold2);line-height:1}

.cb-root .tip h3{font-size:17px;margin:10px 0 8px}

.cb-root .tip ul{margin:0;padding-left:18px;color:var(--mut);font-size:12px;line-height:1.6}

.cb-root .tip li + li{margin-top:6px}



.cb-root .save-pill{position:fixed;left:50%;bottom:18px;transform:translate(-50%,120%);display:flex;align-items:center;gap:8px;background:var(--bg2);border:1px solid var(--gold);color:var(--gold2);font:600 11px 'Montserrat';letter-spacing:.1em;text-transform:uppercase;padding:10px 18px;border-radius:99px;box-shadow:0 10px 30px rgba(0,0,0,.5);transition:transform .35s cubic-bezier(.2,.7,.2,1);z-index:50}

.cb-root .save-pill.show{transform:translate(-50%,0)}

.cb-root .save-pill i{width:6px;height:6px;border-radius:50%;background:var(--gold2)}



.cb-root .save-section{padding-block:40px 8px;text-align:center}

.cb-root .save-actions{display:flex;justify-content:center;gap:14px;flex-wrap:wrap}

.cb-root .cta-save, .cb-root .cta-pdf{
  font:700 12px 'Montserrat';letter-spacing:.1em;text-transform:uppercase;
  padding:15px 28px;border-radius:99px;cursor:pointer;transition:transform .2s,box-shadow .2s;
}

.cb-root .cta-save{background:linear-gradient(100deg,var(--gold2),var(--gold));color:#1a1200;border:0}

.cb-root .cta-save:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(201,168,76,.3)}

.cb-root .cta-pdf{background:transparent;color:var(--gold2);border:1px solid var(--line2)}

.cb-root .cta-pdf:hover{border-color:var(--gold);transform:translateY(-2px)}

.cb-root .pdf-hint{max-width:560px;margin:20px auto 0;color:var(--mut);font-size:12.5px;line-height:1.7;background:var(--bg2);border:1px solid var(--line);border-radius:10px;padding:16px 20px}

.cb-root .pdf-hint b{color:var(--gold2)}


@media print{
  
  .cb-root{
    --bg:#ffffff; --bg2:#ffffff; --bg3:#f7f5f0;
    --ink:#171310; --mut:#4a463e; --mut2:#6e6a60;
    --gold:#8a6d24; --gold2:#8a6d24; --goldd:#6b5419;
    --line:#d8d2c2; --line2:#b8ae90;
    --harsh:#b5502f; --blue:#4a5aa0; --night:#8a8a8a;
    color-scheme: light;
  }

  .cb-root, .cb-root{background:#fff !important}

  .cb-root .hero{background:#fff !important}

  .cb-root .hero:before{display:none !important}

  .cb-root .cb-name-field, .cb-root .gold-text{-webkit-text-fill-color:var(--gold2) !important}

  .cb-root .quicknav, .cb-root .hero-controls, .cb-root .mode-toggle, .cb-root .add-row, .cb-root .copy-row, .cb-root .icon-btn, .cb-root .row-actions, .cb-root .save-pill, .cb-root .save-actions, .cb-root .pdf-hint, .cb-root .wa-btn, .cb-root .live-badge, .cb-root .table-editor, .cb-root .light-bar-wrap .light-key, .cb-root .gc-field-tables .lbl2, .cb-root .rm, .cb-root .header-nav, .cb-root .cb-edit-hint, .cb-root .demo-link{display:none !important}

  .cb-root .table-circle, .cb-root .table-rect{box-shadow:none !important}

  .cb-root a{color:var(--gold2) !important}

  .cb-root section.s{page-break-inside:avoid}

  .cb-root [contenteditable]{background:transparent !important}

}



.cb-root footer{padding-block:44px 44px;border-top:1px solid var(--line);margin-top:8px}

.cb-root .foot-grid{display:flex;flex-wrap:wrap;justify-content:space-between;gap:28px;align-items:flex-start}

.cb-root footer .sig{font:italic 500 24px 'Cormorant Garamond';color:var(--gold)}

.cb-root footer .tag2{color:var(--mut2);font-size:11.5px;margin-top:6px}

.cb-root .foot-contact{display:flex;flex-direction:column;gap:8px;text-align:right}

.cb-root .foot-contact a, .cb-root .foot-contact span{color:var(--mut);text-decoration:none;font-size:12.5px}

.cb-root .foot-contact a:hover{color:var(--gold2)}

.cb-root .wa-btn{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(100deg,var(--gold2),var(--gold));color:#1a1200;font:700 11px 'Montserrat';letter-spacing:.08em;text-transform:uppercase;padding:11px 20px;border-radius:99px;text-decoration:none;margin-top:6px;transition:transform .2s}

.cb-root .wa-btn:hover{transform:translateY(-2px)}


@media(max-width:680px){
  .cb-root .countdown{grid-template-columns:repeat(2,1fr);max-width:280px}

  .cb-root .tips{grid-template-columns:1fr}

  .cb-root .row{grid-template-columns:12px 94px 1fr auto;padding:13px}

  .cb-root .crew .row2, .cb-root .crew-head{grid-template-columns:1fr 1fr 28px}

  .cb-root .crew-head span:nth-child(2){display:none}

  .cb-root .crew .row2 .phone{grid-column:1/3}

  .cb-root .head{align-items:flex-start}

  .cb-root .photo-guide{grid-template-columns:1fr}

  .cb-root .foot-grid{flex-direction:column}

  .cb-root .foot-contact{text-align:left}

  .cb-root .menu-course{grid-template-columns:1fr 28px;grid-template-areas:"name rm" "item rm"}

  .cb-root .menu-course .mc-name{grid-area:name}

  .cb-root .menu-course .mc-item{grid-area:item}

  .cb-root .menu-course .icon-btn{grid-area:rm}

  .cb-root .te-head{flex-direction:column}

  .cb-root .te-headright{width:100%;justify-content:space-between}

  .cb-root .tables-grid.layout-rows{flex-direction:column;align-items:center}

  .cb-root .aisle{width:80%;height:1px;min-height:0;align-self:center;margin:6px 0;background:repeating-linear-gradient(90deg,var(--line2) 0 6px,transparent 6px 14px)}

  .cb-root .aisle .al{transform:translate(-50%,-50%) rotate(0deg)}

  .cb-root .mode-toggle{max-width:100%;flex-wrap:wrap;justify-content:center;border-radius:14px;gap:4px}

  .cb-root .mode-toggle button{white-space:normal;flex:1 1 auto;text-align:center}

}
`;
