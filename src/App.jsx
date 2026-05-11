import { useState, useEffect, useCallback } from "react";

/* ══════════════════════════════════════════
   STORAGE ADAPTER — localStorage para deploy real
══════════════════════════════════════════ */
const storage = {
  async get(key) {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? { key, value: val } : null;
    } catch { return null; }
  },
  async set(key, value) {
    try {
      localStorage.setItem(key, value);
      return { key, value };
    } catch { return null; }
  },
  async delete(key) {
    try {
      localStorage.removeItem(key);
      return { key, deleted: true };
    } catch { return null; }
  }
};


/* ═══════════════════════════════════════════════════════════
   ESTILOS GLOBAIS
═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Geist:wght@300;400;500;600;700;800&family=Geist+Mono:wght@400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;background:#0c0c0d;color:#f4f4f5;font-family:'Geist',sans-serif;font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:#27272c;border-radius:2px}

:root{
  --bg:#0c0c0d;--bg2:#111113;--bg3:#18181b;--bg4:#1f1f23;--bg5:#27272c;
  --surf:#1a1a1e;--surf2:#222226;
  --b1:rgba(255,255,255,.06);--b2:rgba(255,255,255,.10);--b3:rgba(255,255,255,.18);
  --t1:#f4f4f5;--t2:#a1a1aa;--t3:#52525b;--t4:#3f3f46;
  --gold:#c9a84c;--gold2:#e8c878;
  --gdim:rgba(201,168,76,.12);--gdim2:rgba(201,168,76,.2);
  --blue:#3b82f6;--bdim:rgba(59,130,246,.12);
  --green:#22c55e;--grdim:rgba(34,197,94,.12);
  --amber:#f59e0b;--adim:rgba(245,158,11,.12);
  --red:#ef4444;--rdim:rgba(239,68,68,.12);
  --purple:#a855f7;--pdim:rgba(168,85,247,.12);
  --teal:#14b8a6;--tdim:rgba(20,184,166,.12);
  --r:8px;--rsm:6px;--rlg:12px;--rxl:16px;
  --sh:0 1px 3px rgba(0,0,0,.4);
  --shmd:0 4px 20px rgba(0,0,0,.5);
  --shlg:0 12px 48px rgba(0,0,0,.7);
  --ease:cubic-bezier(.4,0,.2,1);
  --spring:cubic-bezier(.34,1.56,.64,1);
}


/* ── LIGHT THEME ── */
.light-mode {
  --bg:#f5f5f3;--bg2:#ffffff;--bg3:#f0efec;--bg4:#e8e7e3;--bg5:#dddbd6;
  --surf:#ffffff;--surf2:#f8f7f5;
  --b1:rgba(0,0,0,.07);--b2:rgba(0,0,0,.12);--b3:rgba(0,0,0,.18);
  --t1:#1a1a18;--t2:#4b4b47;--t3:#8a8a85;--t4:#b8b8b3;
  --sh:0 1px 3px rgba(0,0,0,.08);
  --shmd:0 4px 16px rgba(0,0,0,.12);
  --shlg:0 12px 40px rgba(0,0,0,.18);
}


/* ── LIGHT THEME ── */
.light-mode {
  --bg:#f5f5f3;--bg2:#ffffff;--bg3:#f0efec;--bg4:#e8e7e3;--bg5:#dddbd6;
  --surf:#ffffff;--surf2:#f8f7f5;
  --b1:rgba(0,0,0,.07);--b2:rgba(0,0,0,.12);--b3:rgba(0,0,0,.18);
  --t1:#1a1a18;--t2:#4b4b47;--t3:#8a8a85;--t4:#b8b8b3;
  --sh:0 1px 3px rgba(0,0,0,.08);
  --shmd:0 4px 16px rgba(0,0,0,.12);
  --shlg:0 12px 40px rgba(0,0,0,.18);
}

/* ── LAYOUT ── */
.app{display:flex;height:100vh;width:100vw;overflow:hidden;background:var(--bg)}
.app-main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
.page-scroll{flex:1;overflow-y:auto;padding:28px 30px}

/* ── SIDEBAR ── */
.sidebar{
  width:250px;flex-shrink:0;height:100vh;background:var(--bg2);
  border-right:1px solid var(--b1);display:flex;flex-direction:column;
  overflow:hidden;transition:width .2s var(--ease);
}
.sidebar.mini{width:62px}
.sb-top{
  height:60px;padding:0 16px;border-bottom:1px solid var(--b1);
  display:flex;align-items:center;gap:10px;flex-shrink:0;
}
.sb-logo{
  width:34px;height:34px;border-radius:9px;flex-shrink:0;cursor:pointer;
  background:linear-gradient(145deg,#c9a84c 0%,#f5dfa0 55%,#b8922e 100%);
  display:flex;align-items:center;justify-content:center;
  font-family:'Fraunces',serif;font-weight:700;font-style:italic;font-size:17px;color:#1a1208;
  box-shadow:0 2px 10px rgba(201,168,76,.45),inset 0 1px 0 rgba(255,255,255,.35);
  border:1px solid rgba(255,255,255,.2);
  letter-spacing:-.02em;
}
.sb-name{font-family:'Fraunces',serif;font-size:14px;font-weight:400;color:var(--t1);flex:1;white-space:nowrap;overflow:hidden;transition:opacity .18s;letter-spacing:.04em}
.sidebar.mini .sb-name{opacity:0}
.sb-body{flex:1;overflow-y:auto;overflow-x:hidden;padding:10px 8px}
.sb-grp{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--t4);padding:14px 10px 5px;white-space:nowrap;transition:opacity .18s}
.sidebar.mini .sb-grp{opacity:0}
.nav-btn{
  display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:var(--rsm);
  cursor:pointer;color:var(--t2);font-size:13px;font-weight:500;
  transition:background .13s,color .13s;white-space:nowrap;user-select:none;margin-bottom:1px;
}
.nav-btn:hover{background:var(--bg4);color:var(--t1)}
.nav-btn.on{background:var(--gdim);color:var(--gold2)}
.nav-ic{width:18px;height:18px;flex-shrink:0;display:flex;align-items:center;justify-content:center}
.nav-txt{flex:1;transition:opacity .18s;overflow:hidden}
.sidebar.mini .nav-txt{opacity:0}
.nav-chip{font-size:10px;font-weight:700;padding:1px 6px;border-radius:20px;background:var(--gold);color:var(--bg);flex-shrink:0;transition:opacity .18s}
.sidebar.mini .nav-chip{opacity:0}
.sb-foot{padding:10px 8px 14px;border-top:1px solid var(--b1);flex-shrink:0}
.sb-user{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:var(--rsm);cursor:pointer;overflow:hidden;transition:background .13s}
.sb-user:hover{background:var(--bg4)}
.u-ava{width:30px;height:30px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--bg);background:linear-gradient(135deg,var(--gold),var(--gold2))}
.u-info{flex:1;overflow:hidden;transition:opacity .18s}
.sidebar.mini .u-info{opacity:0}
.u-name{font-size:12.5px;font-weight:600;color:var(--t1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.u-role{font-size:10.5px;color:var(--t3)}

/* ── TOPBAR ── */
.topbar{height:58px;display:flex;align-items:center;padding:0 26px;background:var(--bg2);border-bottom:1px solid var(--b1);gap:12px;flex-shrink:0;position:relative;z-index:10}
.tb-title{font-size:15px;font-weight:700;color:var(--t1);flex:1}
.tb-search{display:flex;align-items:center;gap:8px;background:var(--bg3);border:1px solid var(--b2);border-radius:var(--r);padding:7px 12px;width:220px;transition:all .16s}
.tb-search:focus-within{border-color:var(--gold);width:260px;box-shadow:0 0 0 2px var(--gdim)}
.tb-search input{background:transparent;border:none;outline:none;font-size:13px;font-family:'Geist',sans-serif;color:var(--t1);width:100%}
.tb-search input::placeholder{color:var(--t3)}
.tbtn{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:var(--r);border:none;cursor:pointer;font-size:13px;font-weight:600;font-family:'Geist',sans-serif;transition:all .13s;white-space:nowrap}
.tbtn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:var(--bg);box-shadow:0 2px 10px rgba(201,168,76,.3)}
.tbtn-gold:hover{opacity:.9;transform:translateY(-1px)}
.tbtn-ghost{background:var(--bg4);color:var(--t2);border:1px solid var(--b2)}
.tbtn-ghost:hover{background:var(--bg5);color:var(--t1)}
.notif-wrap{position:relative}
.notif-dot{position:absolute;top:5px;right:5px;width:7px;height:7px;border-radius:50%;background:var(--gold);border:2px solid var(--bg2)}
.npanel{position:absolute;top:52px;right:0;width:300px;background:var(--bg3);border:1px solid var(--b2);border-radius:var(--rlg);box-shadow:var(--shlg);z-index:100;overflow:hidden;animation:scaleIn .18s var(--spring)}
.n-hd{padding:12px 16px;border-bottom:1px solid var(--b1);font-size:13px;font-weight:700}
.n-item{padding:10px 16px;border-bottom:1px solid var(--b1);display:flex;gap:10px;cursor:pointer;transition:background .1s}
.n-item:hover{background:var(--bg4)}
.n-item:last-child{border-bottom:none}
.n-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;margin-top:4px}
.n-txt{font-size:12.5px;color:var(--t2);line-height:1.4}
.n-txt b{color:var(--t1)}
.n-time{font-size:10.5px;color:var(--t4);margin-top:2px;font-family:'Geist Mono',monospace}

/* ── PAGE HEADER ── */
.ph{margin-bottom:24px}
.ph h1{font-family:'Fraunces',serif;font-size:26px;font-weight:400;color:var(--t1);margin-bottom:4px}
.ph h1 em{color:var(--gold2);font-style:italic}
.ph p{font-size:13px;color:var(--t3)}
.ph-row{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}

/* ── CARDS ── */
.card{background:var(--surf);border:1px solid var(--b1);border-radius:var(--rlg);box-shadow:var(--sh);overflow:hidden}
.c-hd{padding:16px 20px 0;margin-bottom:14px}
.c-hd-row{display:flex;align-items:center;justify-content:space-between}
.c-title{font-size:13.5px;font-weight:700;color:var(--t1)}
.c-sub{font-size:12px;color:var(--t3);margin-top:2px}
.c-body{padding:0 20px 20px}

/* ── KPIs ── */
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px}
.kpi{background:var(--surf);border:1px solid var(--b1);border-radius:var(--rlg);padding:20px;position:relative;overflow:hidden;transition:transform .16s,box-shadow .16s,border-color .16s}
.kpi:hover{transform:translateY(-2px);box-shadow:var(--shmd);border-color:var(--b2)}
.kpi-bar{position:absolute;top:0;left:0;right:0;height:2px}
.kpi-em{font-size:22px;margin-bottom:10px}
.kpi-lbl{font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--t3);margin-bottom:6px}
.kpi-val{font-family:'Fraunces',serif;font-size:26px;font-weight:700;color:var(--t1);line-height:1;margin-bottom:6px}
.kpi-sub{font-size:11.5px;color:var(--t3)}

/* ── META CARD ── */
.meta-wrap{background:var(--surf);border:1px solid var(--b1);border-radius:var(--rlg);padding:22px 24px;margin-bottom:20px;position:relative;overflow:hidden}
.meta-wrap::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 80% at 100% 50%,var(--gdim) 0%,transparent 70%);pointer-events:none}
.meta-top{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:14px}
.meta-lbl{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:var(--t3);margin-bottom:4px}
.meta-v{font-family:'Fraunces',serif;font-size:28px;font-weight:700;color:var(--gold2)}
.meta-pct{font-family:'Fraunces',serif;font-size:48px;font-weight:700;color:var(--t1);line-height:1}
.meta-pct sup{font-size:22px;color:var(--t2)}
.prog{height:8px;background:var(--bg4);border-radius:4px;overflow:hidden}
.prog-fill{height:100%;border-radius:4px;transition:width .9s var(--spring)}
.prog-gold{background:linear-gradient(90deg,var(--gold),var(--gold2))}
.meta-bot{display:flex;justify-content:space-between;margin-top:8px;font-size:12px;color:var(--t3)}

/* ── TABLES ── */
.tbl-card{background:var(--surf);border:1px solid var(--b1);border-radius:var(--rlg);overflow:hidden;box-shadow:var(--sh)}
.tbl{width:100%;border-collapse:collapse}
.tbl th{padding:10px 16px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--t3);background:var(--bg3);border-bottom:1px solid var(--b1);white-space:nowrap}
.tbl td{padding:12px 16px;font-size:13px;color:var(--t2);border-bottom:1px solid var(--b1);vertical-align:middle}
.tbl tr:last-child td{border-bottom:none}
.tbl tbody tr{transition:background .1s}
.tbl tbody tr:hover td{background:var(--bg3)}
.tbl td strong,.tbl td b{color:var(--t1);font-weight:600}
.tbl-foot{padding:10px 16px;background:var(--bg3);border-top:1px solid var(--b1);display:flex;gap:20px;font-size:12px;color:var(--t3)}
.tbl-foot b{color:var(--t1);font-size:13px;font-weight:700}
.mono{font-family:'Geist Mono',monospace;font-size:12px}

/* ── BADGE STATUS ── */
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;white-space:nowrap}
.badge::before{content:'';width:5px;height:5px;border-radius:50%;flex-shrink:0}
.b-pc{background:var(--bdim);color:var(--blue)}.b-pc::before{background:var(--blue)}
.b-ar{background:var(--adim);color:var(--amber)}.b-ar::before{background:var(--amber)}
.b-ag{background:var(--pdim);color:var(--purple)}.b-ag::before{background:var(--purple)}
.b-ng{background:var(--tdim);color:var(--teal)}.b-ng::before{background:var(--teal)}
.b-fc{background:var(--grdim);color:var(--green)}.b-fc::before{background:var(--green)}
.b-pd{background:var(--rdim);color:var(--red)}.b-pd::before{background:var(--red)}
.b-admin{background:var(--gdim);color:var(--gold2)}
.b-supervisor{background:var(--bdim);color:var(--blue)}
.b-vendedor{background:var(--bg4);color:var(--t2)}

/* ── MODAL ── */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);animation:fadeIn .15s ease}
.modal{background:var(--bg3);border:1px solid var(--b2);border-radius:var(--rxl);padding:28px 30px;width:500px;max-width:96vw;box-shadow:var(--shlg);animation:scaleIn .2s var(--spring);max-height:90vh;overflow-y:auto}
.modal-lg{width:620px}
.m-title{font-family:'Fraunces',serif;font-size:20px;font-weight:400;color:var(--t1);margin-bottom:3px}
.m-sub{font-size:12.5px;color:var(--t3);margin-bottom:22px}
.m-foot{display:flex;gap:10px;justify-content:flex-end;margin-top:24px;padding-top:18px;border-top:1px solid var(--b1)}
.fg{display:grid;grid-template-columns:1fr 1fr;gap:13px}
.ff{grid-column:1/-1}
.fgroup{display:flex;flex-direction:column;gap:6px}
.flbl{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--t3)}
.finp,.fsel,.fta{padding:9px 12px;background:var(--bg4);border:1.5px solid var(--b2);border-radius:var(--r);color:var(--t1);font-size:13.5px;font-family:'Geist',sans-serif;outline:none;width:100%;transition:border-color .15s,box-shadow .15s}
.finp:focus,.fsel:focus,.fta:focus{border-color:var(--gold);box-shadow:0 0 0 2px var(--gdim)}
.finp::placeholder{color:var(--t3)}
.fta{resize:vertical;min-height:80px}
.fsel option{background:var(--bg4);color:var(--t1)}
.btn-c{padding:8px 18px;border-radius:var(--r);border:1px solid var(--b2);background:var(--bg4);color:var(--t2);font-size:13px;font-weight:600;cursor:pointer;font-family:'Geist',sans-serif;transition:all .13s}
.btn-c:hover{background:var(--bg5);color:var(--t1)}
.btn-s{padding:8px 22px;border-radius:var(--r);border:none;background:linear-gradient(135deg,var(--gold),var(--gold2));color:var(--bg);font-size:13px;font-weight:700;cursor:pointer;font-family:'Geist',sans-serif;box-shadow:0 2px 12px rgba(201,168,76,.25);transition:all .13s}
.btn-s:hover{opacity:.9;transform:translateY(-1px)}

/* ── ICON BUTTONS ── */
.ic-btn{padding:5px 7px;border-radius:var(--rsm);background:var(--bg4);border:1px solid var(--b2);color:var(--t2);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:all .12s;font-family:'Geist',sans-serif;gap:4px;font-size:11px;font-weight:600}
.ic-btn:hover{background:var(--bg5);color:var(--t1)}
.ic-btn.red:hover{background:var(--rdim);color:var(--red);border-color:rgba(239,68,68,.3)}
.ic-btn-row{display:flex;gap:5px;align-items:center}

/* ── FILTROS ── */
.filters{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;align-items:center}
.sf{padding:5px 13px;border-radius:20px;border:1px solid var(--b2);background:var(--bg3);color:var(--t2);font-size:12px;font-weight:500;cursor:pointer;transition:all .13s;font-family:'Geist',sans-serif}
.sf:hover{border-color:var(--b3);color:var(--t1)}
.sf.on{background:var(--gdim);border-color:var(--gold);color:var(--gold2)}

/* ── SELLER CARDS ── */
.seller-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:14px}
.seller-card{background:var(--surf);border:1px solid var(--b1);border-radius:var(--rlg);padding:22px;position:relative;transition:transform .16s,box-shadow .16s,border-color .16s}
.seller-card:hover{transform:translateY(-2px);box-shadow:var(--shmd);border-color:var(--b2)}
.s-ava{width:50px;height:50px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:var(--bg);margin-bottom:12px}
.s-name{font-size:15px;font-weight:700;color:var(--t1);margin-bottom:2px}
.s-role{font-size:12px;color:var(--t3);margin-bottom:14px}
.s-stats{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}
.s-stat{background:var(--bg3);border-radius:var(--rsm);padding:9px}
.s-v{font-family:'Fraunces',serif;font-size:15px;font-weight:700;color:var(--t1);margin-bottom:2px}
.s-l{font-size:9.5px;color:var(--t3)}
.s-menu{position:absolute;top:12px;right:12px;display:flex;gap:4px}
.add-card{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;border:1.5px dashed var(--b2);border-radius:var(--rlg);padding:28px;cursor:pointer;color:var(--t3);transition:all .15s;min-height:200px}
.add-card:hover{border-color:var(--gold);color:var(--gold2);background:var(--gdim)}

/* ── RANK ── */
.rank-row{display:flex;align-items:center;gap:14px;padding:12px 18px;border-bottom:1px solid var(--b1);transition:background .1s}
.rank-row:last-child{border-bottom:none}
.rank-row:hover{background:var(--bg3)}
.rank-pos{font-family:'Fraunces',serif;font-size:18px;font-weight:700;width:28px;text-align:center;flex-shrink:0}
.rank-ava{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--bg);flex-shrink:0}
.rank-name{font-size:13.5px;font-weight:600;color:var(--t1)}
.rank-sub{font-size:11.5px;color:var(--t3)}
.rank-val{font-family:'Fraunces',serif;font-size:16px;font-weight:700;color:var(--gold2)}

/* ── TIMELINE ── */
.tl-item{display:flex;gap:12px;padding:11px 0;border-bottom:1px solid var(--b1)}
.tl-item:last-child{border-bottom:none}
.tl-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:5px;background:var(--gold)}
.tl-txt{font-size:13px;color:var(--t2);line-height:1.4}
.tl-time{font-size:11px;color:var(--t4);margin-top:2px;font-family:'Geist Mono',monospace}

/* ── AGENDA ── */
.ag-item{display:flex;gap:12px;padding:10px 0;border-bottom:1px solid var(--b1)}
.ag-item:last-child{border-bottom:none}
.ag-time{font-family:'Geist Mono',monospace;font-size:11px;color:var(--t3);min-width:42px;flex-shrink:0;margin-top:2px}
.ag-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:4px}
.ag-title{font-size:13px;font-weight:600;color:var(--t1);margin-bottom:2px}
.ag-sub{font-size:11.5px;color:var(--t3)}

/* ── BAR CHART ── */
.barchart{display:flex;align-items:flex-end;gap:8px;height:150px;padding:0 4px}
.bc-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px}
.bc-bar{width:100%;border-radius:4px 4px 0 0;min-height:2px;transition:height .7s var(--spring)}
.bc-lbl{font-size:9.5px;color:var(--t3);font-family:'Geist Mono',monospace}
.bc-v{font-size:9px;color:var(--t4)}

/* ── PW GATE ── */
.pw-gate{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:50vh;gap:18px;text-align:center;padding:40px}
.pw-ic{font-size:48px;opacity:.35;margin-bottom:4px}
.pw-title{font-family:'Fraunces',serif;font-size:22px;color:var(--t1)}
.pw-sub{font-size:13px;color:var(--t3);max-width:320px;line-height:1.6}
.pw-row{display:flex;gap:8px;justify-content:center}
.pw-err{color:var(--red);font-size:12px;background:var(--rdim);padding:6px 14px;border-radius:var(--rsm)}

/* ── SETTINGS ── */
.set-title{font-size:14px;font-weight:700;color:var(--t1);margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid var(--b1)}
.set-row{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--b1);gap:16px}
.set-row:last-child{border-bottom:none}
.set-lbl{font-size:13.5px;font-weight:600;color:var(--t1);margin-bottom:2px}
.set-desc{font-size:12px;color:var(--t3)}
.toggle{position:relative;width:40px;height:22px;flex-shrink:0}
.toggle input{opacity:0;width:0;height:0}
.tog-s{position:absolute;inset:0;background:var(--bg5);border-radius:11px;cursor:pointer;transition:background .2s;border:1px solid var(--b2)}
.toggle input:checked+.tog-s{background:var(--gold);border-color:var(--gold)}
.tog-s::after{content:'';position:absolute;width:16px;height:16px;border-radius:50%;background:#fff;top:2px;left:2px;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.3)}
.toggle input:checked+.tog-s::after{transform:translateX(18px)}

/* ── GRIDS ── */
.g2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.g65{display:grid;grid-template-columns:1fr 300px;gap:18px}
.g55{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.mb20{margin-bottom:20px}
.mb16{margin-bottom:16px}
.gap14{display:flex;flex-direction:column;gap:14px}

/* ── LOGIN ── */
.login-wrap{width:100%;min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg);background-image:radial-gradient(ellipse 60% 50% at 20% 30%,rgba(201,168,76,.07) 0%,transparent 70%),radial-gradient(ellipse 40% 60% at 80% 70%,rgba(59,130,246,.04) 0%,transparent 70%)}
.login-box{display:grid;grid-template-columns:1fr 1fr;width:880px;max-width:96vw;background:var(--surf);border:1px solid var(--b2);border-radius:var(--rxl);overflow:hidden;box-shadow:var(--shlg);animation:fadeUp .5s var(--ease) both}
.ll{background:var(--bg3);padding:52px 44px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;border-right:1px solid var(--b1)}
.ll::before{content:'';position:absolute;top:-80px;right:-80px;width:260px;height:260px;border-radius:50%;background:radial-gradient(circle,rgba(201,168,76,.12) 0%,transparent 70%);pointer-events:none}
.ll-brand{display:flex;align-items:center;gap:12px;margin-bottom:44px}
.ll-mark{width:42px;height:42px;border-radius:11px;background:linear-gradient(145deg,#c9a84c 0%,#f5dfa0 55%,#b8922e 100%);display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-weight:700;font-style:italic;font-size:20px;color:#1a1208;box-shadow:0 4px 18px rgba(201,168,76,.45),inset 0 1px 0 rgba(255,255,255,.35);border:1px solid rgba(255,255,255,.2)}
.ll-name{font-family:'Fraunces',serif;font-size:19px;font-weight:700;color:var(--t1);letter-spacing:.02em;display:flex;align-items:center}
.ll-h{font-family:'Fraunces',serif;font-size:34px;font-weight:400;line-height:1.2;color:var(--t1);margin-bottom:14px}
.ll-h em{color:var(--gold2);font-style:italic}
.ll-sub{font-size:13.5px;color:var(--t2);line-height:1.6;max-width:300px}
.ll-stats{display:flex;gap:24px;margin-top:44px}
.ll-sv{font-family:'Fraunces',serif;font-size:28px;font-weight:700;color:var(--gold2)}
.ll-sl{font-size:10.5px;color:var(--t3);text-transform:uppercase;letter-spacing:.08em;margin-top:2px}
.lr{padding:52px 44px;display:flex;flex-direction:column;justify-content:center}
.lr-title{font-size:22px;font-weight:700;margin-bottom:6px}
.lr-sub{font-size:13px;color:var(--t2);margin-bottom:28px}
.role-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:20px}
.role-opt{padding:10px 8px;border-radius:var(--r);border:1px solid var(--b2);background:var(--bg3);cursor:pointer;text-align:center;font-size:12px;font-weight:600;color:var(--t2);transition:all .13s;font-family:'Geist',sans-serif}
.role-opt:hover{border-color:var(--b3);color:var(--t1);background:var(--bg4)}
.role-opt.sel{border-color:var(--gold);background:var(--gdim);color:var(--gold2)}
.role-ic{font-size:18px;display:block;margin-bottom:4px}
.btn-login{width:100%;padding:12px;border-radius:var(--r);border:none;background:linear-gradient(135deg,var(--gold),var(--gold2));color:var(--bg);font-size:14px;font-weight:700;font-family:'Geist',sans-serif;cursor:pointer;box-shadow:0 4px 20px rgba(201,168,76,.3);margin-top:6px;transition:opacity .15s,transform .15s}
.btn-login:hover{opacity:.9;transform:translateY(-1px)}
.login-hint{font-size:11.5px;color:var(--t3);text-align:center;margin-top:16px}
.login-err{color:var(--red);font-size:12px;padding:6px 10px;background:var(--rdim);border-radius:var(--rsm);margin-bottom:10px}

/* ── EMPTY ── */
.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:56px 24px;color:var(--t3);gap:10px;text-align:center}
.empty-ic{font-size:40px;opacity:.3}
.empty p{font-size:13.5px;max-width:280px;line-height:1.5}

/* ── ANIM ── */
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
.anim{animation:fadeUp .28s var(--ease) both}
.anim:nth-child(1){animation-delay:.03s}.anim:nth-child(2){animation-delay:.06s}
.anim:nth-child(3){animation-delay:.09s}.anim:nth-child(4){animation-delay:.12s}
.anim:nth-child(5){animation-delay:.15s}.anim:nth-child(6){animation-delay:.18s}

@media(max-width:1100px){.kpis,.g4{grid-template-columns:repeat(2,1fr)}}
@media(max-width:900px){.g65,.g55,.g2{grid-template-columns:1fr}}
@media(max-width:600px){.kpis{grid-template-columns:1fr 1fr}.g3{grid-template-columns:1fr}.page-scroll{padding:16px}.topbar{padding:0 14px}.login-box{grid-template-columns:1fr}.ll{display:none}}
`;

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */
const brl   = v => Number(v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const pct   = (a,b) => b>0 ? Math.min(100,Math.round(a/b*100)) : 0;
const inits = n => n?.trim().split(" ").filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase()||"?";
const now     = () => new Date().toLocaleDateString("pt-BR");
const nowFull = () => new Date().toLocaleDateString("pt-BR");
const uid   = () => Date.now() + Math.random();

const STATUS = ["primeiro contato","aguardando retorno","agendado","negociacao","fechado","perdido"];
const S_CLS  = {
  "primeiro contato":"b-pc","aguardando retorno":"b-ar",
  "agendado":"b-ag","negociacao":"b-ng","fechado":"b-fc","perdido":"b-pd"
};
const S_COLOR = {
  "primeiro contato":"var(--blue)","aguardando retorno":"var(--amber)",
  "agendado":"var(--purple)","negociacao":"var(--teal)","fechado":"var(--green)","perdido":"var(--red)"
};
const ORIGINS = ["Instagram","WhatsApp","Indicação","Site","Google Ads","Facebook","YouTube","Ligação","Outro"];
const COLORS  = ["#c9a84c","#3b82f6","#22c55e","#a855f7","#14b8a6","#f59e0b","#ef4444","#0891b2","#be185d","#4338ca"];

/* ══════════════════════════════════════════
   DADOS INICIAIS
══════════════════════════════════════════ */
const D_LEADS = [
  {id:1,nome:"Carlos Eduardo Silva",    tel:"(11) 98823-4512",cidade:"São Paulo, SP",     origem:"Instagram",  obs:"Interessado no plano premium",       status:"negociacao",        dataCap:"02/05/2025",hist:[{txt:"Primeiro contato realizado",quando:"02/05/2025"},{txt:"Enviou proposta por e-mail",quando:"03/05/2025"}]},
  {id:2,nome:"Fernanda Oliveira",        tel:"(85) 97741-2233",cidade:"Fortaleza, CE",     origem:"Indicação",  obs:"Indicada pela cliente Maria Lima",    status:"agendado",          dataCap:"04/05/2025",hist:[{txt:"Ligação inicial feita",quando:"04/05/2025"},{txt:"Reunião agendada para quarta",quando:"04/05/2025"}]},
  {id:3,nome:"Rodrigo Mendes Castro",    tel:"(21) 96632-1144",cidade:"Rio de Janeiro, RJ",origem:"Site",       obs:"Veio pelo blog do produto",           status:"primeiro contato",   dataCap:"06/05/2025",hist:[{txt:"Lead captado via formulário",quando:"06/05/2025"}]},
  {id:4,nome:"Ana Paula Ferreira",       tel:"(31) 95512-8875",cidade:"Belo Horizonte, MG",origem:"WhatsApp",  obs:"Quer comparar com concorrência",      status:"aguardando retorno", dataCap:"05/05/2025",hist:[{txt:"Primeiro contato via WhatsApp",quando:"05/05/2025"}]},
  {id:5,nome:"Grupo Nobre Ltda",         tel:"(41) 94401-5521",cidade:"Curitiba, PR",      origem:"Google Ads", obs:"Empresa com 30 funcionários, B2B",   status:"fechado",            dataCap:"01/05/2025",hist:[{txt:"Prospecção ativa",quando:"01/05/2025"},{txt:"Proposta enviada",quando:"02/05/2025"},{txt:"Contrato assinado ✓",quando:"05/05/2025"}]},
  {id:6,nome:"Marina Costa",            tel:"(62) 93301-4410",cidade:"Goiânia, GO",       origem:"Instagram",  obs:"Orçamento acima do esperado",         status:"perdido",            dataCap:"30/04/2025",hist:[{txt:"Proposta recusada — preço",quando:"30/04/2025"}]},
  {id:7,nome:"Paulo Roberto Nunes",      tel:"(71) 92200-3399",cidade:"Salvador, BA",      origem:"Facebook",   obs:"Quer começar em julho",               status:"agendado",           dataCap:"07/05/2025",hist:[{txt:"Demo agendada para próxima semana",quando:"07/05/2025"}]},
];
const D_SELLERS = [
  {id:1,nome:"Ana Paula Souza",   cargo:"Vendedora Senior",  cor:"#c9a84c",meta:50000,role:"vendedor"},
  {id:2,nome:"Carlos Mendes",     cargo:"Closer",            cor:"#3b82f6",meta:40000,role:"supervisor"},
  {id:3,nome:"Lucas Ferreira",    cargo:"SDR",               cor:"#22c55e",meta:30000,role:"vendedor"},
  {id:4,nome:"Juliana Costa",     cargo:"Account Executive", cor:"#a855f7",meta:45000,role:"vendedor"},
];
const D_FECHAMENTOS = [
  {id:1,cliente:"Grupo Nobre Ltda", valor:52000,comissao:2600,data:"01/05/2025",vendedorId:1,obs:"Plano anual completo"},
  {id:2,cliente:"Tech Soluções ME", valor:28000,comissao:1680,data:"03/05/2025",vendedorId:2,obs:""},
  {id:3,cliente:"Clínica Saúde+",   valor:18500,comissao:1110,data:"05/05/2025",vendedorId:1,obs:"Renovação"},
  {id:4,cliente:"Imob. Central",    valor:35000,comissao:2100,data:"06/05/2025",vendedorId:3,obs:""},
];

/* ══════════════════════════════════════════
   DADOS INICIAIS — NOVAS ABAS
══════════════════════════════════════════ */
const hoje = () => new Date().toLocaleDateString("pt-BR");
const hojeISO = () => new Date().toISOString().split("T")[0];

const D_TAREFAS = [
  {id:1, titulo:"Ligar para Fernanda Oliveira", tipo:"ligacao", prioridade:"alta", responsavel:"Carlos Mendes", prazo:hoje(), feita:false},
  {id:2, titulo:"Enviar proposta Grupo Nobre",  tipo:"email",   prioridade:"alta", responsavel:"Ana Paula Souza", prazo:hoje(), feita:true},
  {id:3, titulo:"Agendar demo Tech Soluções",   tipo:"reuniao", prioridade:"media",responsavel:"Lucas Ferreira", prazo:hoje(), feita:false},
];
const D_REUNIOES = [
  {id:1, titulo:"Apresentação de Produto",      horario:"09:00", data:hoje(), participantes:"Carlos Eduardo Silva", local:"Zoom", vendedor:"Carlos Mendes",   status:"confirmada"},
  {id:2, titulo:"Follow-up Rede Farmácias",     horario:"14:00", data:hoje(), participantes:"Ana Oliveira",         local:"Presencial", vendedor:"Ana Paula Souza", status:"confirmada"},
  {id:3, titulo:"Demo Enterprise",              horario:"16:30", data:hoje(), participantes:"Grupo XYZ",            local:"Meet", vendedor:"Lucas Ferreira",   status:"pendente"},
];

/* ══════════════════════════════════════════
   ÍCONES SVG
══════════════════════════════════════════ */
function Svg({d, size=16, color}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color||"currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      style={{flexShrink:0}}>
      {[].concat(d).map((p,i)=><path key={i} d={p}/>)}
    </svg>
  );
}
const IC = {
  home:   ["M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1z","M9 21V12h6v9"],
  leads:  ["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2","M9 7a4 4 0 100 8 4 4 0 000-8z","M23 21v-2a4 4 0 00-3-3.87","M16 3.13a4 4 0 010 7.75"],
  chart:  ["M18 20V10","M12 20V4","M6 20v-6"],
  dollar: ["M12 1v22","M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"],
  target: ["M12 22a10 10 0 100-20 10 10 0 000 20z","M12 18a6 6 0 100-12 6 6 0 000 12z","M12 14a2 2 0 100-4 2 2 0 000 4z"],
  users:  ["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2","M23 21v-2a4 4 0 00-3-3.87","M16 3.13a4 4 0 010 7.75"],
  star:   ["M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"],
  bell:   ["M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9","M13.73 21a2 2 0 01-3.46 0"],
  gear:   ["M12 15a3 3 0 100-6 3 3 0 000 6z","M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"],
  plus:   ["M12 5v14","M5 12h14"],
  search: ["M21 21l-4.35-4.35","M11 19A8 8 0 1011 3a8 8 0 000 16z"],
  menu:   ["M3 12h18","M3 6h18","M3 18h18"],
  logout: ["M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4","M16 17l5-5-5-5","M21 12H9"],
  edit:   ["M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7","M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"],
  trash:  ["M3 6h18","M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6","M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"],
  msg:    ["M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"],
  chevL:  ["M15 18l-6-6 6-6"],
  chevR:  ["M9 18l6-6-6-6"],
  check:  ["M20 6L9 17l-5-5"],
  lock:   ["M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z","M7 11V7a5 5 0 0110 0v4"],
  prod:   ["M9 17H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2","M9 17v4","M15 17v4","M9 21h6"],
  trophy: ["M8 21h8","M12 17v4","M5 3h14","M5 3a7 7 0 007 14 7 7 0 007-14","M9 3v5a3 3 0 006 0V3"],
  agenda: ["M8 2v4","M16 2v4","M3 10h18","M3 6a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2z"],
  task:   ["M9 11l3 3L22 4","M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"],
  meet:   ["M17 20h5v-2a3 3 0 00-5.356-1.857","M9 20H4v-2a3 3 0 015.356-1.857","M16 3.13a4 4 0 010 7.75","M8 3.13a4 4 0 000 7.75","M12 14a4 4 0 100-8 4 4 0 000 8z"],
  indic:  ["M21 21H3","M21 21V3","M7 21V13","M11 21V7","M15 21V10","M19 21V4"],
};

/* ══════════════════════════════════════════
   MODAL BASE
══════════════════════════════════════════ */
function Modal({title, sub, children, onClose, onSave, saveLabel="Salvar", lg}) {
  // bloqueia ESC
  useEffect(()=>{
    const h = e => { if(e.key==="Escape") onClose(); };
    window.addEventListener("keydown",h);
    return ()=>window.removeEventListener("keydown",h);
  },[onClose]);
  return (
    <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
      <div className={`modal${lg?" modal-lg":""}`} onClick={e=>e.stopPropagation()}>
        <div className="m-title">{title}</div>
        {sub && <div className="m-sub">{sub}</div>}
        {children}
        <div className="m-foot">
          <button className="btn-c" onClick={onClose}>Cancelar</button>
          <button className="btn-s" onClick={onSave}>{saveLabel}</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SETUP — primeira vez (sem usuários)
══════════════════════════════════════════ */
function SetupPage({onSetup}) {
  const [nome,  setNome]  = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [conf,  setConf]  = useState("");
  const [err,   setErr]   = useState("");

  const emailValido = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const go = () => {
    if (!nome.trim())          return setErr("Informe seu nome completo.");
    if (!emailValido(email))   return setErr("Informe um e-mail válido.");
    if (senha.length < 8)      return setErr("A senha deve ter pelo menos 8 caracteres.");
    if (senha !== conf)        return setErr("As senhas não coincidem.");
    onSetup({id:uid(), nome, email, senha, role:"admin"});
  };

  return (
    <div className="login-wrap">
      <div className="login-box">
        <div className="ll">
          <div>
            <div className="ll-brand"><div className="ll-mark">C</div><span className="ll-name"><span style={{fontWeight:700,letterSpacing:".08em"}}>MEU</span><span style={{fontStyle:"italic",fontWeight:400,marginLeft:6,color:"var(--gold2)"}}>CRM</span></span></div>
            <h2 className="ll-h">Bem-vindo ao<br/><em>MEU CRM!</em></h2>
            <p className="ll-sub">Primeira configuração — crie sua conta de administrador para começar a usar o sistema.</p>
          </div>
          <div className="ll-stats">
            <div><div className="ll-sv">1º</div><div className="ll-sl">Passo</div></div>
            <div><div className="ll-sv">👑</div><div className="ll-sl">Admin</div></div>
            <div><div className="ll-sv">✅</div><div className="ll-sl">Seguro</div></div>
          </div>
        </div>
        <div className="lr">
          <div className="lr-title">Criar conta Admin</div>
          <div className="lr-sub" style={{marginBottom:22}}>Configure o acesso principal do sistema. Você poderá adicionar outros usuários depois.</div>
          <div style={{background:"var(--gdim)",border:"1px solid rgba(201,168,76,.2)",borderRadius:"var(--r)",padding:"10px 14px",marginBottom:18,fontSize:12,color:"var(--gold2)"}}>
            👑 Esta conta terá acesso total ao sistema como <b>Administrador</b>.
          </div>
          <div className="fgroup" style={{marginBottom:14}}>
            <label className="flbl">Nome completo *</label>
            <input className="finp" placeholder="Ex: João Silva" value={nome} onChange={e=>setNome(e.target.value)} autoFocus/>
          </div>
          <div className="fgroup" style={{marginBottom:14}}>
            <label className="flbl">E-mail válido *</label>
            <input className="finp" type="email" placeholder="seuemail@exemplo.com" value={email} onChange={e=>setEmail(e.target.value)}/>
          </div>
          <div className="fgroup" style={{marginBottom:14}}>
            <label className="flbl">Criar senha * <span style={{fontWeight:400,color:"var(--t3)"}}>(mínimo 8 caracteres)</span></label>
            <input className="finp" type="password" placeholder="Mínimo 8 caracteres" value={senha} onChange={e=>setSenha(e.target.value)}/>
            {senha.length>0 && (
              <div style={{display:"flex",gap:4,marginTop:5}}>
                {[...Array(8)].map((_,i)=>(
                  <div key={i} style={{flex:1,height:3,borderRadius:2,background:senha.length>i?"var(--green)":"var(--bg4)",transition:"background .2s"}}/>
                ))}
                <span style={{fontSize:10,color:senha.length>=8?"var(--green)":"var(--t3)",marginLeft:6,whiteSpace:"nowrap"}}>{senha.length}/8</span>
              </div>
            )}
          </div>
          <div className="fgroup" style={{marginBottom:14}}>
            <label className="flbl">Confirmar senha *</label>
            <input className="finp" type="password" placeholder="Repita a senha" value={conf} onChange={e=>setConf(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}/>
            {conf.length>0 && (
              <div style={{fontSize:11,marginTop:4,color:senha===conf?"var(--green)":"var(--red)",fontWeight:600}}>
                {senha===conf?"✓ Senhas coincidem":"✕ Senhas não coincidem"}
              </div>
            )}
          </div>
          {err && <div className="login-err">{err}</div>}
          <button className="btn-login" onClick={go}>Criar conta e entrar →</button>
          <div className="login-hint">MEU CRM v2.0 · Configuração inicial</div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   LOGIN — com usuários cadastrados
══════════════════════════════════════════ */
function LoginPage({onLogin, usuarios}) {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [err,   setErr]   = useState("");
  const [busy,  setBusy]  = useState(false);

  const ROLE_IC = {admin:"👑", supervisor:"📊", vendedor:"💼"};
  const ROLE_LBL = {admin:"Administrador", supervisor:"Supervisor", vendedor:"Vendedor"};

  const go = () => {
    if (!login.trim()) return setErr("Informe seu e-mail.");
    if (!senha.trim()) return setErr("Informe sua senha.");
    const u = usuarios.find(u =>
      (u.email||"").toLowerCase().trim() === login.toLowerCase().trim() && u.senha === senha
    );
    if (!u) return setErr("E-mail ou senha incorretos.");
    setErr(""); setBusy(true);
    setTimeout(()=>{ setBusy(false); onLogin(u); }, 400);
  };

  return (
    <div className="login-wrap">
      <div className="login-box">
        <div className="ll">
          <div>
            <div className="ll-brand"><div className="ll-mark">C</div><span className="ll-name"><span style={{fontWeight:700,letterSpacing:".08em"}}>MEU</span><span style={{fontStyle:"italic",fontWeight:400,marginLeft:6,color:"var(--gold2)"}}>CRM</span></span></div>
            <h2 className="ll-h">Gestão comercial<br/>de nível <em>profissional.</em></h2>
            <p className="ll-sub">Controle total da sua operação — leads, metas, comissões e equipe em um só lugar.</p>
          </div>
          <div className="ll-stats">
            <div><div className="ll-sv">98%</div><div className="ll-sl">Satisfação</div></div>
            <div><div className="ll-sv">+3x</div><div className="ll-sl">Produtividade</div></div>
            <div><div className="ll-sv">24/7</div><div className="ll-sl">Online</div></div>
          </div>
        </div>
        <div className="lr">
          <div className="lr-title">Bem-vindo de volta</div>
          <div className="lr-sub">Entre com seu usuário e senha cadastrados</div>

          <div className="fgroup" style={{marginBottom:14}}>
            <label className="flbl">E-mail</label>
            <input className="finp" type="email" placeholder="seuemail@exemplo.com" value={login} onChange={e=>setLogin(e.target.value)} autoFocus/>
          </div>
          <div className="fgroup" style={{marginBottom:14}}>
            <label className="flbl">Senha</label>
            <input className="finp" type="password" placeholder="••••••••" value={senha}
              onChange={e=>setSenha(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}/>
          </div>
          {err && <div className="login-err">{err}</div>}
          <button className="btn-login" onClick={go} disabled={busy}>{busy?"Entrando…":"Entrar no sistema →"}</button>

          {/* Lista de usuários (só nomes, sem senha) */}
          {usuarios.length>0 && (
            <div style={{marginTop:18,padding:"12px 14px",background:"var(--bg3)",borderRadius:"var(--r)",border:"1px solid var(--b1)"}}>
              <div style={{fontSize:10.5,fontWeight:700,color:"var(--t3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>Usuários cadastrados</div>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {usuarios.map(u=>(
                  <div key={u.id} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",padding:"4px 6px",borderRadius:6,transition:"background .12s"}}
                    onClick={()=>setLogin(u.email||u.nome)}
                    onMouseEnter={e=>e.currentTarget.style.background="var(--bg4)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                  >
                    <div style={{width:26,height:26,borderRadius:"50%",background:`hsl(${u.nome.split("").reduce((a,x)=>a+x.charCodeAt(0),0)*47%360},50%,40%)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:"#fff",flexShrink:0}}>{inits(u.nome)}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12.5,fontWeight:600,color:"var(--t1)"}}>{u.nome}</div>
                    </div>
                    <span style={{fontSize:10,padding:"1px 7px",borderRadius:20,background:u.role==="admin"?"var(--gdim)":u.role==="supervisor"?"var(--bdim)":"var(--bg4)",color:u.role==="admin"?"var(--gold2)":u.role==="supervisor"?"var(--blue)":"var(--t3)",fontWeight:600}}>
                      {ROLE_IC[u.role]} {ROLE_LBL[u.role]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="login-hint">MEU CRM v2.0 · Ambiente seguro</div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   GERENCIAR USUÁRIOS — dentro de Configurações
══════════════════════════════════════════ */
function GerenciarUsuarios({usuarios, setUsuarios}) {
  const [modal,   setModal]   = useState(false);
  const [editU,   setEditU]   = useState(null);
  const [form,    setForm]    = useState({});
  const [confS,   setConfS]   = useState("");
  const [err,     setErr]     = useState("");
  const up = k => e => setForm(p=>({...p,[k]:e.target.value}));

  const ROLE_CFG = {
    admin:      {ic:"👑", label:"Administrador", c:"var(--gold2)",  bg:"var(--gdim)"},
    supervisor: {ic:"📊", label:"Supervisor",    c:"var(--blue)",   bg:"var(--bdim)"},
    vendedor:   {ic:"💼", label:"Vendedor",      c:"var(--t2)",     bg:"var(--bg4)"},
  };

  const emailValido2 = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const abrirNovo = () => {
    setEditU(null); setForm({role:"vendedor"}); setConfS(""); setErr(""); setModal(true);
  };
  const abrirEdit = (u) => {
    setEditU(u); setForm({...u, senha:""}); setConfS(""); setErr(""); setModal(true);
  };

  const save = () => {
    if (!form.nome?.trim())              { setErr("Informe o nome completo."); return; }
    if (!emailValido2(form.email||""))   { setErr("Informe um e-mail válido."); return; }
    if (!editU && (form.senha||"").length < 8)  { setErr("Senha deve ter no mínimo 8 caracteres."); return; }
    if (!editU && form.senha !== confS)          { setErr("Senhas não coincidem."); return; }
    if (editU && form.senha && form.senha !== confS) { setErr("Senhas não coincidem."); return; }
    // Verifica duplicata de email
    const emailDup = usuarios.find(u=>u.id!==editU?.id && (u.email||"").toLowerCase().trim()===(form.email||"").toLowerCase().trim());
    if (emailDup) { setErr("Este e-mail já está cadastrado."); return; }

    if (editU) {
      setUsuarios(us=>us.map(u=>u.id===editU.id ? {
        ...u, nome:form.nome, role:form.role,
        ...(form.senha ? {senha:form.senha} : {})
      } : u));
    } else {
      setUsuarios(us=>[...us, {id:uid(), nome:form.nome, role:form.role, senha:form.senha}]);
    }
    setModal(false); setForm({}); setEditU(null); setErr("");
  };

  const del = (id) => {
    if (usuarios.find(u=>u.id===id)?.role==="admin" && usuarios.filter(u=>u.role==="admin").length<=1) {
      alert("Não é possível remover o único administrador do sistema.");
      return;
    }
    if (window.confirm("Remover este usuário?")) setUsuarios(us=>us.filter(u=>u.id!==id));
  };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div className="set-title" style={{marginBottom:0}}>👥 Usuários do Sistema</div>
        <button className="tbtn tbtn-gold" onClick={abrirNovo} style={{padding:"6px 14px",fontSize:12}}>
          <Svg d={IC.plus} size={13}/> Adicionar Usuário
        </button>
      </div>
      <div className="card" style={{padding:"4px 0",marginBottom:16}}>
        {usuarios.map((u,i)=>{
          const rc = ROLE_CFG[u.role]||ROLE_CFG.vendedor;
          return (
            <div key={u.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 20px",borderBottom:i<usuarios.length-1?"1px solid var(--b1)":"none",transition:"background .1s"}}
              onMouseEnter={e=>e.currentTarget.style.background="var(--bg3)"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              <div style={{width:36,height:36,borderRadius:"50%",background:`hsl(${u.nome.split("").reduce((a,x)=>a+x.charCodeAt(0),0)*47%360},50%,40%)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"#fff",flexShrink:0}}>{inits(u.nome)}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:13.5,color:"var(--t1)"}}>{u.nome}</div>
                <div style={{fontSize:11.5,color:"var(--t3)"}}>{u.email||"sem e-mail"}</div>
              </div>
              <span style={{padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:rc.bg,color:rc.c}}>{rc.ic} {rc.label}</span>
              <button className="ic-btn" onClick={()=>abrirEdit(u)}><Svg d={IC.edit} size={13}/></button>
              <button className="ic-btn red" onClick={()=>del(u.id)}><Svg d={IC.trash} size={13}/></button>
            </div>
          );
        })}
        {usuarios.length===0 && <div className="empty" style={{padding:30}}><div className="empty-ic">👥</div><p>Nenhum usuário cadastrado.</p></div>}
      </div>

      {modal && (
        <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="m-title">{editU?"✏️ Editar Usuário":"➕ Novo Usuário"}</div>
            <div className="m-sub" style={{marginBottom:18}}>{editU?`Editando: ${editU.nome}`:"Preencha os dados do novo usuário"}</div>
            <div className="fg">
              <div className="fgroup ff">
                <div className="flbl">Nome completo *</div>
                <input className="finp" value={form.nome||""} onChange={up("nome")} placeholder="Nome que aparecerá no perfil" autoFocus/>
                <div style={{fontSize:11,color:"var(--t3)",marginTop:3}}>Aparece na sidebar e no perfil do usuário</div>
              </div>
              <div className="fgroup ff">
                <div className="flbl">E-mail * <span style={{fontWeight:400,color:"var(--t3)"}}>(usado para login)</span></div>
                <input className="finp" type="email" value={form.email||""} onChange={up("email")} placeholder="email@exemplo.com"/>
                <div style={{fontSize:11,color:"var(--t3)",marginTop:3}}>O usuário fará login com este e-mail</div>
              </div>
              <div className="fgroup ff">
                <div className="flbl">Perfil de acesso *</div>
                <div style={{display:"flex",gap:8,marginTop:2}}>
                  {Object.entries(ROLE_CFG).map(([k,v])=>(
                    <button key={k} type="button" onClick={()=>setForm(p=>({...p,role:k}))}
                      style={{flex:1,padding:"10px 6px",borderRadius:"var(--rsm)",border:`1.5px solid ${form.role===k?v.c:"var(--b2)"}`,background:form.role===k?v.bg:"var(--bg4)",color:form.role===k?v.c:"var(--t2)",cursor:"pointer",fontFamily:"'Geist',sans-serif",fontSize:12,fontWeight:700,transition:"all .15s",textAlign:"center"}}
                    >{v.ic}<br/><span style={{fontSize:10}}>{v.label}</span></button>
                  ))}
                </div>
              </div>
              <div className="fgroup">
                <div className="flbl">{editU?"Nova senha (deixe em branco para manter)":"Senha *"} <span style={{fontWeight:400,color:"var(--t3)",fontSize:10}}>(mínimo 8 caracteres)</span></div>
                <input className="finp" type="password" value={form.senha||""} onChange={up("senha")} placeholder="Mínimo 8 caracteres"/>
              </div>
              <div className="fgroup">
                <div className="flbl">Confirmar senha</div>
                <input className="finp" type="password" value={confS} onChange={e=>setConfS(e.target.value)} placeholder="Repita a senha"/>
              </div>
            </div>
            {err && <div style={{color:"var(--red)",fontSize:12,background:"var(--rdim)",padding:"7px 12px",borderRadius:"var(--rsm)",marginTop:12}}>{err}</div>}
            <div className="m-foot">
              <button className="btn-c" onClick={()=>setModal(false)}>Cancelar</button>
              <button className="btn-s" onClick={save}>{editU?"Salvar Alterações":"Criar Usuário"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════ */
const NAV_GROUPS = [
  {group:"Principal", items:[
    {id:"dashboard",    label:"Dashboard",     icon:"home",   badge:false, roles:["admin","supervisor","vendedor"]},
    {id:"leads",        label:"Leads",         icon:"leads",  badge:true,  roles:["admin","supervisor","vendedor"]},
    {id:"meta",         label:"Metas",         icon:"target", badge:false, roles:["admin","supervisor","vendedor"]},
  ]},
  {group:"Comercial", items:[
    {id:"fechamentos",  label:"Fechamentos",   icon:"check",  badge:false, roles:["admin","supervisor","vendedor"]},
    {id:"comissoes",    label:"Comissões",     icon:"dollar", badge:false, roles:["admin"]},
  ]},
  {group:"Gestão", items:[
    {id:"equipe",       label:"Equipe",        icon:"users",  badge:false, roles:["admin","supervisor"]},
  ]},
  {group:"Operação", items:[
    {id:"producao",     label:"Produção",         icon:"prod",   badge:false, roles:["admin","supervisor","vendedor"]},
    {id:"meta_diaria",  label:"Meta Diária",       icon:"target", badge:false, roles:["admin","supervisor","vendedor"]},
    {id:"ranking",      label:"Ranking",           icon:"trophy", badge:false, roles:["admin","supervisor","vendedor"]},
  ]},
  {group:"Agenda & Tarefas", items:[
    {id:"agenda",       label:"Agenda Comercial",  icon:"agenda", badge:false, roles:["admin","supervisor","vendedor"]},
    {id:"tarefas",      label:"Tarefas",           icon:"task",   badge:true,  roles:["admin","supervisor","vendedor"]},
    {id:"reunioes",     label:"Reuniões",          icon:"meet",   badge:false, roles:["admin","supervisor","vendedor"]},
  ]},
  {group:"Análise", items:[
    {id:"indicadores",  label:"Central de Indicadores", icon:"indic", badge:false, roles:["admin","supervisor"]},
    {id:"relatorios",   label:"Relatórios",        icon:"chart",  badge:false, roles:["admin","supervisor"]},
  ]},
  {group:"Sistema", items:[
    {id:"configuracoes",label:"Configurações",     icon:"gear",   badge:false, roles:["admin"]},
  ]},
];

// Verifica permissão por role
const canAccess = (item, role) => !item.roles || item.roles.includes(role);
const isAdmin      = r => r==="admin";
const isSupervisor = r => r==="admin"||r==="supervisor";
const isVendedor   = r => r==="vendedor";

function Sidebar({page, goTo, mini, setMini, user, logout, chip, tarefasChip}) {
  return (
    <div className={`sidebar${mini?" mini":""}`}>
      <div className="sb-top">
        <div className="sb-logo" onClick={()=>setMini(m=>!m)}>C</div>
        <span className="sb-name"><span style={{fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",fontSize:11}}>MEU</span><span style={{color:"var(--gold2)",fontStyle:"italic",fontWeight:400,fontSize:15,marginLeft:5}}>CRM</span></span>
      </div>
      <div className="sb-body">
        {NAV_GROUPS.map(g=>{
          const items = g.items.filter(i=>canAccess(i, user.role));
          if (!items.length) return null;
          return (
            <div key={g.group}>
              <div className="sb-grp">{g.group}</div>
              {items.map(it=>(
                <div
                  key={it.id}
                  className={`nav-btn${page===it.id?" on":""}`}
                  onClick={()=>goTo(it.id)}
                >
                  <span className="nav-ic"><Svg d={IC[it.icon]} size={16}/></span>
                  <span className="nav-txt">{it.label}</span>
                  {it.badge && it.id==="leads" && chip>0 && <span className="nav-chip">{chip}</span>}{it.badge && it.id==="tarefas" && tarefasChip>0 && <span className="nav-chip">{tarefasChip}</span>}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div className="sb-foot">
        <div className="sb-user" onClick={logout} title="Sair">
          <div className="u-ava">{inits(user.nome)}</div>
          <div className="u-info">
            <div className="u-name">{user.nome}</div>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <span className={`badge b-${user.role}`} style={{fontSize:9.5,padding:"1px 7px"}}>{user.role==="admin"?"👑 Admin":user.role==="supervisor"?"📊 Supervisor":"💼 Vendedor"}</span>
            </div>
          </div>
          <Svg d={IC.logout} size={14}/>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   TOPBAR
══════════════════════════════════════════ */
const TITLES = {dashboard:"Dashboard",leads:"Gestão de Leads",meta:"Metas Comerciais",fechamentos:"Fechamentos",comissoes:"Comissões",equipe:"Equipe de Vendas",relatorios:"Relatórios",configuracoes:"Configurações",producao:"Produção Diária",meta_diaria:"Meta Diária",ranking:"Ranking da Equipe",agenda:"Agenda Comercial",tarefas:"Tarefas",reunioes:"Reuniões",indicadores:"Central de Indicadores"};

function Topbar({page, toggleSb, onNewLead, theme, setTheme, search, setSearch}) {
  const [notif, setNotif] = useState(false);
  const alerts = [
    {t:<><b>3 leads</b> aguardando retorno há +2 dias</>, when:"agora", c:"var(--amber)"},
    {t:<><b>Meta mensal</b> atingiu 68%</>,               when:"1h",   c:"var(--blue)"},
    {t:<><b>Grupo Nobre</b> fechou R$ 52.000</>,          when:"3h",   c:"var(--green)"},
  ];
  return (
    <div className="topbar">
      <button className="ic-btn" onClick={toggleSb}><Svg d={IC.menu} size={18}/></button>
      <div className="tb-title">{TITLES[page]||"Dashboard"}</div>
      <div className="tb-search">
        <Svg d={IC.search} size={14}/>
        <input
          placeholder={{"leads":"Nome, cidade, origem…","fechamentos":"Cliente ou vendedor…","equipe":"Buscar vendedor…","comissoes":"Cliente ou vendedor…"}[page]||"Buscar…"}
          value={search||""}
          onChange={e=>setSearch(e.target.value)}
        />
        {search && <span onClick={()=>setSearch("")} style={{cursor:"pointer",color:"var(--t3)",fontSize:18,lineHeight:1,flexShrink:0}}>×</span>}
      </div>
      <div style={{display:"flex",gap:4,flexShrink:0}}>
        <button onClick={()=>setTheme("dark")}
          style={{padding:"5px 11px",borderRadius:"var(--rsm)",border:`1px solid ${theme==="dark"?"var(--gold)":"var(--b2)"}`,background:theme==="dark"?"var(--gdim)":"var(--bg4)",color:theme==="dark"?"var(--gold2)":"var(--t3)",cursor:"pointer",fontFamily:"'Geist',sans-serif",fontSize:11,fontWeight:700,letterSpacing:".04em",transition:"all .15s"}}
        >⬛ BLACK</button>
        <button onClick={()=>setTheme("light")}
          style={{padding:"5px 11px",borderRadius:"var(--rsm)",border:`1px solid ${theme==="light"?"#c9a84c":"var(--b2)"}`,background:theme==="light"?"#fef3d0":"var(--bg4)",color:theme==="light"?"#92400e":"var(--t3)",cursor:"pointer",fontFamily:"'Geist',sans-serif",fontSize:11,fontWeight:700,letterSpacing:".04em",transition:"all .15s"}}
        >⬜ WHITE</button>
      </div>
            <div className="notif-wrap">
        <button className="ic-btn" onClick={()=>setNotif(n=>!n)} style={{position:"relative"}}>
          <Svg d={IC.bell} size={16}/>
          <span className="notif-dot"/>
        </button>
        {notif && (
          <div className="npanel">
            <div className="n-hd">🔔 Notificações</div>
            {alerts.map((a,i)=>(
              <div className="n-item" key={i} onClick={()=>setNotif(false)}>
                <div className="n-dot" style={{background:a.c}}/>
                <div><div className="n-txt">{a.t}</div><div className="n-time">há {a.when}</div></div>
              </div>
            ))}
          </div>
        )}
      </div>
      {page==="leads" && (
        <button className="tbtn tbtn-gold" onClick={onNewLead}>
          <Svg d={IC.plus} size={14}/> Novo Lead
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════ */
function Dashboard({leads, fechamentos, sellers, meta, user}) {
  const [ready,    setReady]   = useState(false);
  const [calOpen,  setCalOpen] = useState(false);
  const [mesSel,   setMesSel]  = useState(()=>{ const d=new Date(); return {y:d.getFullYear(),m:d.getMonth()}; });
  const [prod,,]   = useStored("crm2_producao", {});

  useEffect(()=>{ const t=setTimeout(()=>setReady(true),100); return()=>clearTimeout(t); },[]);

  const MESES_FULL2 = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  const MESES_PT3   = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

  // Filtra dados pelo mês selecionado
  const mesStr = `${String(mesSel.m+1).padStart(2,"0")}/${mesSel.y}`; // MM/AAAA
  const isMesSel = (dataStr) => {
    if (!dataStr) return false;
    // Formato DD/MM/AAAA
    const p = dataStr.split("/");
    if (p.length===3) return p[1]===String(mesSel.m+1).padStart(2,"0") && p[2]===String(mesSel.y);
    return false;
  };

  const fechMes = fechamentos.filter(f=>isMesSel(f.data));
  const totalV  = fechMes.reduce((s,f)=>s+f.valor,0);
  const pM      = pct(totalV, meta);
  const nFC     = fechMes.length;
  const nNG     = leads.filter(l=>l.status==="negociacao").length;
  const nCancel = leads.filter(l=>l.status==="perdido").length;

  // Visitas do mês — soma da produção de todos os vendedores no mês
  const diasDoMes = (() => {
    const total = new Date(mesSel.y, mesSel.m+1, 0).getDate();
    const dias = [];
    for (let d=1;d<=total;d++) {
      const iso = `${mesSel.y}-${String(mesSel.m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
      dias.push(iso);
    }
    return dias;
  })();

  const visitasMes = sellers.reduce((total, s) => {
    return total + diasDoMes.reduce((acc, iso) => {
      const key = `${iso}_${s.id}`;
      return acc + Number(prod[key]?.visitas || 0);
    }, 0);
  }, 0);

  // Hoje e semana atual
  const hojeD = new Date();
  const isHoje = mesSel.y===hojeD.getFullYear() && mesSel.m===hojeD.getMonth();
  const mesLabel = `${MESES_FULL2[mesSel.m]} de ${mesSel.y}`;

  const kpis = [
    {lbl:"Total Vendido",  val:brl(totalV),          s:"#c9a84c", em:"💰", sub:mesLabel},
    {lbl:"Visitas no Mês", val:String(visitasMes),   s:"#3b82f6", em:"🚶", sub:"da planilha de produção"},
    {lbl:"Fechamentos",    val:String(nFC),            s:"#22c55e", em:"✅", sub:mesLabel},
    {lbl:"Cancelados",     val:String(nCancel),        s:"#ef4444", em:"❌", sub:"total geral"},
  ];

  // Gráfico — 12 meses anteriores a partir do mês selecionado
  const ultimos12 = Array.from({length:6},(_,i)=>{
    const d = new Date(mesSel.y, mesSel.m-5+i, 1);
    const mm = String(d.getMonth()+1).padStart(2,"0");
    const yy = d.getFullYear();
    const val = fechamentos
      .filter(f=>f.data && f.data.split("/")[1]===mm && f.data.split("/")[2]===String(yy))
      .reduce((s,f)=>s+f.valor,0);
    return {lbl:MESES_PT3[d.getMonth()], val, isSel:d.getMonth()===mesSel.m&&d.getFullYear()===mesSel.y};
  });
  const maxRev = Math.max(...ultimos12.map(x=>x.val),1);

  const sorted = [...sellers].sort((a,b)=>{
    const fa=fechMes.filter(f=>f.vendedorId===a.id).reduce((s,f)=>s+f.valor,0);
    const fb=fechMes.filter(f=>f.vendedorId===b.id).reduce((s,f)=>s+f.valor,0);
    return fb-fa;
  });

  // Calendário de meses
  const anos = Array.from({length:3},(_,i)=>hojeD.getFullYear()-i).reverse();

  return (
    <div>
      {/* Fechar calendário ao clicar fora */}
      {calOpen && <div onClick={()=>setCalOpen(false)} style={{position:"fixed",inset:0,zIndex:199}}/>}

      <div className="ph">
        <div className="ph-row">
          <div>
            <h1>Visão <em>Geral</em></h1>
            <p>{now()} · Dados em tempo real</p>
          </div>
          {/* Seletor de mês */}
          <div style={{position:"relative"}}>
            <button
              onClick={()=>setCalOpen(o=>!o)}
              style={{display:"flex",alignItems:"center",gap:8,padding:"8px 16px",borderRadius:"var(--r)",border:`1px solid ${calOpen?"var(--gold)":"var(--b2)"}`,background:calOpen?"var(--gdim)":"var(--bg4)",color:"var(--t1)",cursor:"pointer",fontFamily:"'Geist',sans-serif",fontSize:13,fontWeight:600,transition:"all .15s"}}
            >
              <span>📅</span>
              <span>{mesLabel}</span>
              {!isHoje && <span style={{fontSize:10,background:"var(--gold)",color:"var(--bg)",padding:"1px 6px",borderRadius:10,fontWeight:700}}>outro mês</span>}
              <span style={{fontSize:10,color:"var(--t3)"}}>▼</span>
            </button>
            {isHoje && <button onClick={()=>{ setMesSel({y:hojeD.getFullYear(),m:hojeD.getMonth()}); setCalOpen(false); }} style={{marginLeft:6,padding:"4px 10px",borderRadius:20,border:"none",background:"var(--gdim)",color:"var(--gold2)",cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"'Geist',sans-serif"}}>Mês atual</button>}

            {calOpen && (
              <div style={{position:"absolute",right:0,top:"calc(100% + 6px)",background:"var(--bg3)",border:"1px solid var(--b2)",borderRadius:"var(--rlg)",boxShadow:"var(--shlg)",zIndex:200,width:280,padding:16,animation:"scaleIn .18s var(--spring)"}}>
                {anos.map(y=>(
                  <div key={y} style={{marginBottom:14}}>
                    <div style={{fontSize:11,fontWeight:700,color:"var(--t3)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>{y}</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5}}>
                      {MESES_PT3.map((ml,mi)=>{
                        const isFut = y>hojeD.getFullYear()||(y===hojeD.getFullYear()&&mi>hojeD.getMonth());
                        const isCur = y===mesSel.y&&mi===mesSel.m;
                        const isHojeM = y===hojeD.getFullYear()&&mi===hojeD.getMonth();
                        const hasDados = fechamentos.some(f=>{
                          if (!f.data) return false;
                          const p=f.data.split("/");
                          return p[1]===String(mi+1).padStart(2,"0")&&p[2]===String(y);
                        });
                        return (
                          <button key={mi}
                            disabled={isFut}
                            onClick={()=>{ setMesSel({y,m:mi}); setCalOpen(false); }}
                            style={{
                              padding:"8px 4px",borderRadius:"var(--rsm)",
                              border:`1px solid ${isCur?"var(--gold)":isHojeM?"var(--b3)":"var(--b1)"}`,
                              background:isCur?"var(--gdim)":isHojeM?"var(--bg4)":"transparent",
                              color:isFut?"var(--t4)":isCur?"var(--gold2)":"var(--t2)",
                              cursor:isFut?"default":"pointer",
                              fontFamily:"'Geist',sans-serif",fontSize:11.5,fontWeight:isCur||isHojeM?700:400,
                              position:"relative",transition:"all .13s"
                            }}
                          >
                            {ml}
                            {hasDados&&!isCur&&<span style={{position:"absolute",bottom:3,left:"50%",transform:"translateX(-50%)",width:4,height:4,borderRadius:"50%",background:"var(--green)",display:"block"}}/>}
                            {isHojeM&&!isCur&&<span style={{position:"absolute",top:3,right:4,fontSize:7,color:"var(--gold)",fontWeight:700}}>●</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div style={{borderTop:"1px solid var(--b1)",paddingTop:10,marginTop:4}}>
                  <button onClick={()=>{ setMesSel({y:hojeD.getFullYear(),m:hojeD.getMonth()}); setCalOpen(false); }}
                    style={{width:"100%",padding:"7px",borderRadius:"var(--rsm)",border:"1px solid var(--gold)",background:"var(--gdim)",color:"var(--gold2)",cursor:"pointer",fontFamily:"'Geist',sans-serif",fontSize:12,fontWeight:700}}>
                    Voltar ao mês atual
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpis mb20">
        {kpis.map((k,i)=>(
          <div className="kpi anim" key={i}>
            <div className="kpi-bar" style={{background:k.s}}/>
            <div className="kpi-em">{k.em}</div>
            <div className="kpi-lbl">{k.lbl}</div>
            <div className="kpi-val">{k.val}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Comparativo visual: Visitas × Fechamentos × Cancelados */}
      <div style={{background:"var(--surf)",border:"1px solid var(--b1)",borderRadius:"var(--rlg)",padding:"18px 22px",marginBottom:20,boxShadow:"var(--sh)"}}>
        <div style={{fontSize:13,fontWeight:700,color:"var(--t1)",marginBottom:14}}>
          📊 Comparativo do Mês — {mesLabel}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[
            {lbl:"Visitas",      val:visitasMes, c:"var(--blue)",   em:"🚶"},
            {lbl:"Fechamentos",  val:nFC,        c:"var(--green)",  em:"✅"},
            {lbl:"Cancelados",   val:nCancel,    c:"var(--red)",    em:"❌"},
          ].map((item,i)=>{
            const max = Math.max(visitasMes, nFC, nCancel, 1);
            const p2 = Math.round(item.val/max*100);
            return (
              <div key={i}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                  <span style={{fontSize:13,color:"var(--t2)",display:"flex",alignItems:"center",gap:6}}>
                    {item.em} {item.lbl}
                  </span>
                  <span style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:700,color:item.c}}>{item.val}</span>
                </div>
                <div className="prog" style={{height:8}}>
                  <div className="prog-fill" style={{width:ready?`${p2}%`:"0%",background:item.c,transition:"width .8s var(--spring)"}}/>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{marginTop:10,fontSize:11.5,color:"var(--t3)"}}>
          * Visitas extraídas da planilha de Produção · Fechamentos e Cancelados dos Leads
        </div>
      </div>

      {/* Meta do mês */}
      <div className="meta-wrap" style={{marginBottom:20}}>
        <div className="meta-top">
          <div>
            <div className="meta-lbl">Meta — {mesLabel}</div>
            <div className="meta-v">{brl(totalV)} <span style={{fontSize:14,color:"var(--t3)"}}>/ {brl(meta)}</span></div>
          </div>
          <div className="meta-pct">{pM}<sup>%</sup></div>
        </div>
        <div className="prog"><div className="prog-fill prog-gold" style={{width:ready?`${pM}%`:"0%"}}/></div>
        <div className="meta-bot">
          <span>{pM>=100?"🎉 Meta atingida!":"Falta "+brl(Math.max(0,meta-totalV))}</span>
          <span>{nNG} em negociação</span>
        </div>
      </div>

      {/* Gráfico + Ranking */}
      <div className="g65 mb20">
        <div className="card anim">
          <div className="c-hd"><div className="c-hd-row"><span className="c-title">Receita — Últimos 6 Meses</span></div><div className="c-sub">Dados reais dos fechamentos</div></div>
          <div className="c-body">
            <div className="barchart">
              {ultimos12.map((m2,i)=>(
                <div className="bc-col" key={i}>
                  <div className="bc-v">{m2.val>0?(m2.val/1000).toFixed(0)+"k":""}</div>
                  <div className="bc-bar" style={{
                    height:ready&&m2.val>0?`${(m2.val/maxRev)*130}px`:"2px",
                    background:m2.isSel?"linear-gradient(180deg,var(--gold2),var(--gold))":"var(--bg4)",
                    border:`1px solid ${m2.isSel?"var(--gold)":"var(--b2)"}`,
                    transitionDelay:`${i*.08}s`
                  }}/>
                  <div className="bc-lbl" style={{color:m2.isSel?"var(--gold2)":"var(--t3)",fontWeight:m2.isSel?700:400}}>{m2.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card anim">
          <div className="c-hd"><div className="c-title">🏆 Ranking — {MESES_PT3[mesSel.m]}</div></div>
          <div>
            {sorted.map((s,i)=>{
              const tot=fechMes.filter(f=>f.vendedorId===s.id).reduce((a,f)=>a+f.valor,0);
              const m2=["🥇","🥈","🥉",""][i]||`#${i+1}`;
              return(
                <div className="rank-row" key={s.id} style={{opacity:tot===0?.5:1}}>
                  <div className="rank-pos" style={{color:i===0&&tot>0?"var(--gold2)":i===1&&tot>0?"#9ca3af":i===2&&tot>0?"#cd7f32":"var(--t4)"}}>{m2}</div>
                  <div className="rank-ava" style={{background:s.cor}}>{inits(s.nome)}</div>
                  <div style={{flex:1}}>
                    <div className="rank-name">{s.nome}</div>
                    <div className="rank-sub">{s.cargo} · {fechMes.filter(f=>f.vendedorId===s.id).length} vendas</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div className="rank-val" style={{color:tot>0?"var(--gold2)":"var(--t3)"}}>{tot>0?brl(tot):"—"}</div>
                    <div style={{fontSize:11,color:"var(--t3)"}}>{pct(tot,s.meta)}% da meta</div>
                  </div>
                </div>
              );
            })}
            {sorted.length===0&&<div className="empty" style={{padding:24}}><div className="empty-ic">🏆</div><p>Nenhum vendedor.</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   LEADS
══════════════════════════════════════════ */
function LeadForm({lead, onClose, onSave}) {
  const blank = {nome:"",tel:"",cidade:"",origem:"Instagram",obs:"",status:"primeiro contato",dataCap:now(),hist:[]};
  const [f, setF] = useState(()=>lead ? {...lead} : blank);
  const up = k => e => setF(p=>({...p,[k]:e.target.value}));
  const save = useCallback(()=>{
    if (!f.nome.trim()) return alert("Informe o nome do lead.");
    onSave({...f, id: f.id || uid()});
  },[f, onSave]);
  return (
    <Modal title={f.id?"Editar Lead":"Novo Lead"} sub="Preencha os dados do lead" onClose={onClose} onSave={save} lg>
      <div className="fg">
        <div className="fgroup ff"><div className="flbl">Nome completo *</div><input className="finp" value={f.nome} onChange={up("nome")} placeholder="Nome do lead" autoFocus/></div>
        <div className="fgroup"><div className="flbl">Telefone</div><input className="finp" value={f.tel} onChange={up("tel")} placeholder="(XX) XXXXX-XXXX"/></div>
        <div className="fgroup"><div className="flbl">Cidade / Estado</div><input className="finp" value={f.cidade} onChange={up("cidade")} placeholder="Ex: São Paulo, SP"/></div>
        <div className="fgroup"><div className="flbl">Origem</div><select className="fsel" value={f.origem} onChange={up("origem")}>{ORIGINS.map(o=><option key={o}>{o}</option>)}</select></div>
        <div className="fgroup"><div className="flbl">Status</div><select className="fsel" value={f.status} onChange={up("status")}>{STATUS.map(s=><option key={s}>{s}</option>)}</select></div>
        <div className="fgroup ff"><div className="flbl">Observações</div><textarea className="fta" value={f.obs} onChange={up("obs")} placeholder="Notas sobre o lead…"/></div>
      </div>
    </Modal>
  );
}

function HistModal({lead, onClose, onAddNote, onDeleteNote}) {
  const [note, setNote] = useState("");
  const add = () => {
    if (!note.trim()) return;
    onAddNote(lead.id, {txt: note.trim(), quando: nowFull()});
    setNote("");
  };
  return (
    <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal modal-lg" onClick={e=>e.stopPropagation()}>
        <div className="m-title">Histórico — {lead.nome}</div>
        <div className="m-sub" style={{marginBottom:14}}>
          {lead.origem} · {lead.cidade} &nbsp;·&nbsp;
          <span className={`badge ${S_CLS[lead.status]}`} style={{fontSize:10,padding:"1px 8px"}}>{lead.status}</span>
        </div>
        <div style={{maxHeight:260,overflowY:"auto",marginBottom:14,paddingRight:4}}>
          {!lead.hist.length && (
            <div style={{color:"var(--t3)",fontSize:13,textAlign:"center",padding:"20px 0"}}>Nenhuma nota registrada.</div>
          )}
          {[...lead.hist].reverse().map((h, i) => {
            const isObj = typeof h === "object";
            const txt   = isObj ? h.txt   : h;
            const quando= isObj ? h.quando : "—";
            const realIdx = lead.hist.length - 1 - i;
            return (
              <div className="tl-item" key={i} style={{position:"relative",paddingRight:24}}>
                <div className="tl-dot"/>
                <div style={{flex:1}}>
                  <div className="tl-txt">{txt}</div>
                  <div className="tl-time">{quando}</div>
                </div>
                {onDeleteNote && (
                  <button
                    onClick={()=>onDeleteNote(lead.id, realIdx)}
                    style={{position:"absolute",right:0,top:8,background:"transparent",border:"none",cursor:"pointer",color:"var(--t4)",fontSize:14,lineHeight:1,transition:"color .13s"}}
                    onMouseEnter={e=>e.currentTarget.style.color="var(--red)"}
                    onMouseLeave={e=>e.currentTarget.style.color="var(--t4)"}
                    title="Remover nota"
                  >×</button>
                )}
              </div>
            );
          })}
        </div>
        <div style={{display:"flex",gap:8,borderTop:"1px solid var(--b1)",paddingTop:14}}>
          <input className="finp" style={{flex:1}} placeholder="Escrever nota… (Enter para salvar)" value={note} onChange={e=>setNote(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} autoFocus/>
          <button className="btn-s" onClick={add}>Adicionar</button>
        </div>
        <div className="m-foot"><button className="btn-c" onClick={onClose}>Fechar</button></div>
      </div>
    </div>
  );
}

function LeadsPage({leads, setLeads, newLeadOpen, setNewLeadOpen, search, user}) {
  const [sf,       setSf]    = useState("todos");
  const [editLead, setEdit]  = useState(null);
  const [histLead, setHist]  = useState(null);
  const [delId,    setDelId] = useState(null);

  const saveLead = (f) => {
    setLeads(ls => {
      const exists = ls.find(l => l.id === f.id);
      return exists ? ls.map(l => l.id === f.id ? f : l) : [...ls, f];
    });
    setEdit(null);
    setNewLeadOpen(false);
  };

  const addNote = (id, note) => {
    const entry = typeof note==="object" ? note : {txt:note, quando:nowFull()};
    setLeads(ls => ls.map(l => l.id===id ? {...l, hist:[...l.hist, entry]} : l));
  };

  const deleteNote = (id, idx) => {
    setLeads(ls => ls.map(l => {
      if (l.id!==id) return l;
      const hist = [...l.hist];
      hist.splice(idx, 1);
      return {...l, hist};
    }));
  };

  const changeStatus = (id, s) => {
    const entry = {txt:`📌 Situação: ${s}`, quando: nowFull()};
    setLeads(ls => ls.map(l => l.id===id ? {...l, status:s, hist:[...l.hist, entry]} : l));
  };

  const doDelete = () => {
    setLeads(ls => ls.filter(l => l.id !== delId));
    setDelId(null);
  };

  const ultimaAtt = (l) => {
    if (!l.hist || !l.hist.length) return l.dataCap;
    const ult = l.hist[l.hist.length-1];
    return typeof ult==="object" ? ult.quando : l.dataCap;
  };

  const leadsVisiveis = isVendedor(user.role)
    ? leads.filter(l => (l.vendedor||"").toLowerCase().includes((user.nome||"").toLowerCase().split(" ")[0].toLowerCase()))
    : leads;

  const filtered = leadsVisiveis.filter(l => {
    const matchSf = sf==="todos" || l.status===sf;
    const q = (search||"").toLowerCase().trim();
    const matchQ = !q
      || l.nome.toLowerCase().includes(q)
      || (l.cidade||"").toLowerCase().includes(q)
      || (l.origem||"").toLowerCase().includes(q)
      || (l.tel||"").includes(q)
      || (l.obs||"").toLowerCase().includes(q);
    return matchSf && matchQ;
  });

  const cardBtn = (onClick, children, variant="neutral") => {
    const styles = {
      neutral: {border:"1px solid var(--b2)",background:"var(--bg4)",color:"var(--t2)"},
      danger:  {border:"1px solid rgba(239,68,68,.3)",background:"var(--rdim)",color:"var(--red)"},
      info:    {border:"1px solid var(--bdim)",background:"var(--bdim)",color:"var(--blue)"},
    };
    return (
      <button onClick={onClick} style={{
        padding:"7px 13px",borderRadius:"var(--rsm)",cursor:"pointer",
        fontFamily:"'Geist',sans-serif",fontSize:12,fontWeight:600,
        display:"flex",alignItems:"center",gap:5,transition:"opacity .13s",
        ...styles[variant]
      }}
      onMouseEnter={e=>e.currentTarget.style.opacity=".75"}
      onMouseLeave={e=>e.currentTarget.style.opacity="1"}
      >{children}</button>
    );
  };

  return (
    <div>
      <div className="ph">
        <div className="ph-row">
          <div>
            <h1><em>Gestão</em> de Leads</h1>
            <p>{isVendedor(user.role)?`${filtered.length} seus leads`:`${leads.length} leads · ${leads.filter(l=>l.status==="fechado").length} fechados · ${leads.filter(l=>l.status==="perdido").length} perdidos`}</p>
          </div>
          <button className="tbtn tbtn-gold" onClick={()=>{ setEdit(null); setNewLeadOpen(true); }}>
            <Svg d={IC.plus} size={14}/> Novo Lead
          </button>
        </div>
      </div>

      <div className="filters">
        {["todos",...STATUS].map(s=>(
          <button key={s} className={`sf${sf===s?" on":""}`} onClick={()=>setSf(s)}>
            {s}{s!=="todos"&&<span style={{opacity:.5,fontSize:10,marginLeft:4}}>({leads.filter(l=>l.status===s).length})</span>}
          </button>
        ))}
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.length===0 && (
          <div className="empty" style={{background:"var(--surf)",borderRadius:"var(--rlg)",border:"1px solid var(--b1)"}}>
            <div className="empty-ic">👥</div>
            <p>Nenhum lead {sf!=="todos"?`com status "${sf}"`:"cadastrado"}.<br/>Clique em "Novo Lead" para adicionar.</p>
          </div>
        )}
        {filtered.map((l, i) => (
          <div key={l.id} style={{
            background:"var(--surf)",border:"1px solid var(--b1)",borderRadius:"var(--rlg)",
            padding:"16px 20px",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap",
            boxShadow:"var(--sh)",transition:"border-color .15s,box-shadow .15s"
          }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--b2)";e.currentTarget.style.boxShadow="var(--shmd)"}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--b1)";e.currentTarget.style.boxShadow="var(--sh)"}}
          >
            <div style={{fontFamily:"'Geist Mono',monospace",fontSize:11,color:"var(--t4)",width:20,flexShrink:0}}>#{i+1}</div>
            <div style={{width:42,height:42,borderRadius:"50%",background:`hsl(${(String(l.id).split("").reduce((a,c)=>a+c.charCodeAt(0),0)*47)%360},55%,50%)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"#fff",flexShrink:0}}>
              {inits(l.nome)}
            </div>
            <div style={{flex:1,minWidth:160}}>
              <div style={{fontWeight:700,fontSize:14,color:"var(--t1)",marginBottom:4}}>{l.nome}</div>
              <div style={{display:"flex",gap:12,fontSize:12,color:"var(--t3)",flexWrap:"wrap"}}>
                {l.tel&&<span>📱 {l.tel}</span>}
                {l.cidade&&<span>📍 {l.cidade}</span>}
                <span>🔗 {l.origem}</span>
              </div>
              <div style={{display:"flex",gap:14,fontSize:11,color:"var(--t4)",marginTop:4,flexWrap:"wrap"}}>
                <span>📅 Registrado: <b style={{color:"var(--t3)"}}>{l.dataCap}</b></span>
                <span>🔄 Atualizado: <b style={{color:"var(--t3)"}}>{ultimaAtt(l)}</b></span>
              </div>
              {l.obs&&<div style={{fontSize:11.5,color:"var(--t3)",marginTop:3,fontStyle:"italic",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:340}}>"{l.obs}"</div>}
            </div>
            <div style={{flexShrink:0}}>
              <div style={{fontSize:9.5,fontWeight:700,color:"var(--t3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:5}}>Situação</div>
              <select
                value={l.status}
                onChange={e=>changeStatus(l.id,e.target.value)}
                className={`badge ${S_CLS[l.status]}`}
                style={{background:"transparent",border:"1px solid currentColor",outline:"none",cursor:"pointer",fontFamily:"'Geist',sans-serif",fontWeight:600,fontSize:11,padding:"4px 10px",borderRadius:20}}
              >
                {STATUS.map(s=>(
                  <option key={s} value={s} style={{background:"var(--bg3)",color:"var(--t1)",fontWeight:500}}>{s}</option>
                ))}
              </select>
            </div>
            <div style={{display:"flex",gap:6,flexShrink:0,flexWrap:"wrap"}}>
              {cardBtn(()=>setHist(l), <><Svg d={IC.msg} size={13}/>Notas</>, "info")}
              {cardBtn(()=>{setEdit(l);setNewLeadOpen(false);}, <><Svg d={IC.edit} size={13}/>Editar</>, "neutral")}
              {!isVendedor(user.role) && cardBtn(()=>setDelId(l.id), <><Svg d={IC.trash} size={13}/>Remover</>, "danger")}
            </div>
          </div>
        ))}
      </div>

      {(newLeadOpen||editLead) && (
        <LeadForm lead={editLead} onClose={()=>{setEdit(null);setNewLeadOpen(false);}} onSave={saveLead}/>
      )}
      {histLead && (
        <HistModal lead={leads.find(l=>l.id===histLead.id)||histLead} onClose={()=>setHist(null)} onAddNote={addNote} onDeleteNote={deleteNote}/>
      )}
      {delId && (
        <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setDelId(null)}>
          <div className="modal" style={{maxWidth:400}} onClick={e=>e.stopPropagation()}>
            <div style={{textAlign:"center",paddingBottom:20}}>
              <div style={{fontSize:44,marginBottom:12}}>⚠️</div>
              <div className="m-title" style={{textAlign:"center"}}>Remover Lead?</div>
              <div style={{fontSize:13,color:"var(--t3)",marginTop:8,lineHeight:1.6}}>
                Você vai remover <b style={{color:"var(--t1)"}}>{leads.find(l=>l.id===delId)?.nome}</b>.<br/>Essa ação não pode ser desfeita.
              </div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button className="btn-c" style={{flex:1}} onClick={()=>setDelId(null)}>Cancelar</button>
              <button onClick={doDelete} style={{flex:1,padding:"9px",borderRadius:"var(--r)",border:"none",background:"var(--red)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Geist',sans-serif"}}>Sim, remover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   METAS
══════════════════════════════════════════ */
function MetasPage({leads, fechamentos, sellers, meta, setMeta, user}) {
  const [editOpen,   setEditOpen]   = useState(false);
  const [editSeller, setEditSeller] = useState(null); // seller being edited for meta individual
  const [novoVal,    setNovoVal]    = useState(String(meta));
  const [novaMetaS,  setNovaMetaS]  = useState("");
  const [ready,      setReady]      = useState(false);
  useEffect(()=>{ const t=setTimeout(()=>setReady(true),100); return()=>clearTimeout(t); },[]);

  const totalV = fechamentos.reduce((s,f)=>s+f.valor,0);
  const pG = pct(totalV, meta);

  const saveMeta = () => {
    const v = Number(novoVal);
    if (v > 0) { setMeta(v); setEditOpen(false); }
    else alert("Informe um valor maior que zero.");
  };

  return (
    <div>
      <div className="ph">
        <div className="ph-row">
          <div><h1>Metas <em>Comerciais</em></h1><p>Progresso em tempo real · clique em "Editar Meta" para alterar</p></div>
          {isSupervisor(user.role) && (
            <button className="tbtn tbtn-gold" onClick={()=>{ setNovoVal(String(meta)); setEditOpen(true); }}>
              <Svg d={IC.edit} size={14}/> Editar Meta
            </button>
          )}
        </div>
      </div>

      {/* Meta geral */}
      <div className="meta-wrap mb20">
        <div className="meta-top">
          <div>
            <div className="meta-lbl">Meta Mensal — {new Date().toLocaleString("pt-BR",{month:"long",year:"numeric"})}</div>
            <div className="meta-v">{brl(totalV)}</div>
            <div style={{fontSize:13,color:"var(--t3)",marginTop:4}}>de {brl(meta)} · Falta {brl(Math.max(0,meta-totalV))}</div>
          </div>
          <div className="meta-pct">{pG}<sup>%</sup></div>
        </div>
        <div className="prog" style={{height:12}}>
          <div className="prog-fill prog-gold" style={{width:ready?`${pG}%`:"0%"}}/>
        </div>
        <div className="meta-bot">
          <span>{fechamentos.length} fechamentos realizados</span>
          <span>{leads.filter(l=>l.status==="negociacao").length} em negociação</span>
        </div>
      </div>

      {/* Metas individuais */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontSize:14,fontWeight:700,color:"var(--t1)"}}>Metas Individuais por Vendedor</div>
        <div style={{fontSize:12,color:"var(--t3)"}}>Clique em "Editar Meta" em cada card para alterar o valor</div>
      </div>

      {/* Botão editar meta geral — só admin/supervisor */}
      {sellers.length===0 && (
        <div className="empty" style={{background:"var(--surf)",border:"1px solid var(--b1)",borderRadius:"var(--rlg)"}}>
          <div className="empty-ic">🎯</div>
          <p>Nenhum vendedor cadastrado. Adicione vendedores na aba Equipe para gerenciar metas individuais.</p>
        </div>
      )}

      <div className="gap14">
        {(isVendedor(user.role)
          ? sellers.filter(s=>s.nome.toLowerCase().includes((user.nome||"").toLowerCase().split(" ")[0].toLowerCase()))
          : sellers
        ).map(s=>{
          const tot=fechamentos.filter(f=>f.vendedorId===s.id).reduce((a,f)=>a+f.valor,0);
          const p2=pct(tot,s.meta);
          const c=p2>=100?"var(--green)":p2>=60?"var(--gold)":"var(--red)";
          return(
            <div key={s.id} style={{background:"var(--surf)",border:"1px solid var(--b1)",borderRadius:"var(--rlg)",padding:20,boxShadow:"var(--sh)"}}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
                <div style={{width:44,height:44,borderRadius:"50%",background:s.cor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:"var(--bg)",flexShrink:0}}>{inits(s.nome)}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:14,color:"var(--t1)"}}>{s.nome}</div>
                  <div style={{fontSize:12,color:"var(--t3)"}}>{s.cargo}</div>
                </div>
                <div style={{textAlign:"right",marginRight:8}}>
                  <div style={{fontFamily:"'Fraunces',serif",fontSize:22,fontWeight:700,color:c}}>{p2}%</div>
                  <div style={{fontSize:11,color:"var(--t3)"}}>da meta</div>
                </div>
                {/* Botão editar meta individual */}
                {isSupervisor(user.role) && (
                  <button
                    onClick={()=>{ setEditSeller(s); setNovaMetaS(String(s.meta)); }}
                    style={{padding:"7px 13px",borderRadius:"var(--rsm)",border:"1px solid var(--b2)",background:"var(--bg4)",color:"var(--t2)",cursor:"pointer",fontFamily:"'Geist',sans-serif",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:5,flexShrink:0,transition:"all .13s"}}
                    onMouseEnter={e=>{e.currentTarget.style.background="var(--bg5)";e.currentTarget.style.color="var(--t1)"}}
                    onMouseLeave={e=>{e.currentTarget.style.background="var(--bg4)";e.currentTarget.style.color="var(--t2)"}}
                  >
                    <Svg d={IC.edit} size={13}/> Editar Meta
                  </button>
                )}
              </div>
              <div className="prog" style={{marginBottom:8}}>
                <div className="prog-fill" style={{width:ready?`${p2}%`:"0%",background:s.cor,transition:"width .9s var(--spring)"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"var(--t3)",flexWrap:"wrap",gap:8}}>
                <span>Realizado: <b style={{color:"var(--t1)"}}>{brl(tot)}</b></span>
                <span>Meta atual: <b style={{color:"var(--t1)"}}>{brl(s.meta)}</b></span>
                <span style={{color:c}}>{p2>=100?"🎉 Meta batida!":"Falta: "+brl(Math.max(0,s.meta-tot))}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal editar meta geral */}
      {editOpen && (
        <Modal title="✏️ Editar Meta Mensal" sub="Define o valor de receita alvo do mês para a equipe" onClose={()=>setEditOpen(false)} onSave={saveMeta} saveLabel="Salvar Meta">
          <div className="fgroup">
            <div className="flbl">Meta de receita (R$)</div>
            <input className="finp" type="number" value={novoVal} onChange={e=>setNovoVal(e.target.value)} placeholder="Ex: 200000" autoFocus/>
            <div style={{fontSize:11,color:"var(--t3)",marginTop:4}}>
              Valor atual: <b>{brl(meta)}</b> · Nova meta: <b style={{color:"var(--gold2)"}}>{novoVal?brl(Number(novoVal)):"—"}</b>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal editar meta individual */}
      {editSeller && (
        <Modal
          title={`✏️ Meta de ${editSeller.nome}`}
          sub="Define o valor de comissão alvo do vendedor no mês"
          onClose={()=>setEditSeller(null)}
          onSave={()=>{
            const v=Number(novaMetaS);
            if (!v||v<=0){alert("Informe um valor válido.");return;}
            // Precisamos do setSellers — passamos via prop
            if (typeof window._setSellers==="function") {
              window._setSellers(ss=>ss.map(s=>s.id===editSeller.id?{...s,meta:v}:s));
            }
            setEditSeller(null);
          }}
          saveLabel="Salvar Meta"
        >
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:"var(--bg4)",borderRadius:"var(--r)",marginBottom:16,border:"1px solid var(--b2)"}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:editSeller.cor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"var(--bg)"}}>{inits(editSeller.nome)}</div>
            <div>
              <div style={{fontWeight:700,color:"var(--t1)"}}>{editSeller.nome}</div>
              <div style={{fontSize:12,color:"var(--t3)"}}>Meta atual: <b>{brl(editSeller.meta)}</b></div>
            </div>
          </div>
          <div className="fgroup">
            <div className="flbl">Nova meta de comissão (R$)</div>
            <input className="finp" type="number" value={novaMetaS} onChange={e=>setNovaMetaS(e.target.value)} placeholder="Ex: 5000" autoFocus/>
            <div style={{fontSize:11,color:"var(--t3)",marginTop:4}}>
              Nova meta: <b style={{color:"var(--gold2)"}}>{novaMetaS?brl(Number(novaMetaS)):"—"}</b>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
/* ══════════════════════════════════════════
   FECHAMENTOS
══════════════════════════════════════════ */
function FechForm({fech, sellers, onClose, onSave}) {
  const blank = {cliente:"",valor:"",comissao:"",data:now(),vendedorId:String(sellers[0]?.id||""),obs:"",status:"ativa"};
  const [f, setF] = useState(()=> fech
    ? {...fech, valor:String(fech.valor), comissao:String(fech.comissao), vendedorId:String(fech.vendedorId), status:fech.status||"ativa"}
    : blank);
  const up = k => e => setF(p=>({...p,[k]:e.target.value}));
  const save = () => {
    if (!f.cliente.trim()) { alert("Informe o nome do cliente."); return; }
    if (!Number(f.valor))  { alert("Informe o valor da venda."); return; }
    onSave({...f, id:f.id||uid(), valor:Number(f.valor)||0, comissao:Number(f.comissao)||0, vendedorId:Number(f.vendedorId)});
  };
  const STATUS_FECH = [{v:"ativa",l:"✅ Ativa",c:"var(--green)"},{v:"pendente",l:"⏳ Pendente",c:"var(--amber)"},{v:"cancelada",l:"❌ Cancelada",c:"var(--red)"}];
  return (
    <Modal title={f.id?"✏️ Editar Venda":"➕ Registrar Venda"} sub={f.id?`Editando: ${f.cliente}`:"Preencha os dados da venda"} onClose={onClose} onSave={save} saveLabel={f.id?"Salvar Alterações":"Registrar Venda"} lg>
      <div className="fg">
        <div className="fgroup ff">
          <div className="flbl">Nome do Cliente *</div>
          <input className="finp" value={f.cliente} onChange={up("cliente")} placeholder="Nome do cliente ou empresa" autoFocus/>
        </div>
        <div className="fgroup">
          <div className="flbl">Valor da Venda (R$) *</div>
          <input className="finp" type="number" value={f.valor} onChange={up("valor")} placeholder="0"/>
        </div>
        <div className="fgroup">
          <div className="flbl">Comissão (R$)</div>
          <input className="finp" type="number" value={f.comissao} onChange={up("comissao")} placeholder="0"/>
        </div>
        <div className="fgroup">
          <div className="flbl">Data da Venda</div>
          <input className="finp" value={f.data} onChange={up("data")} placeholder="DD/MM/AAAA"/>
        </div>
        <div className="fgroup">
          <div className="flbl">Vendedor Responsável</div>
          <select className="fsel" value={f.vendedorId} onChange={up("vendedorId")}>
            {sellers.map(s=><option key={s.id} value={s.id}>{s.nome}</option>)}
          </select>
        </div>
        <div className="fgroup ff">
          <div className="flbl">Status da Venda</div>
          <div style={{display:"flex",gap:8,marginTop:2}}>
            {STATUS_FECH.map(st=>(
              <button key={st.v} type="button" onClick={()=>setF(p=>({...p,status:st.v}))}
                style={{flex:1,padding:"9px",borderRadius:"var(--rsm)",border:`1.5px solid ${f.status===st.v?st.c:"var(--b2)"}`,background:f.status===st.v?`${st.c}22`:"var(--bg4)",color:f.status===st.v?st.c:"var(--t2)",cursor:"pointer",fontFamily:"'Geist',sans-serif",fontSize:12.5,fontWeight:700,transition:"all .15s"}}
              >{st.l}</button>
            ))}
          </div>
        </div>
        <div className="fgroup ff">
          <div className="flbl">Observações</div>
          <textarea className="fta" value={f.obs} onChange={up("obs")} placeholder="Detalhes da venda, produto, condições…"/>
        </div>
      </div>
    </Modal>
  );
}

function FechamentosPage({fechamentos, setFechamentos, sellers, search, user}) {
  const [editFech, setEdit] = useState(null);
  const [addOpen,  setAdd]  = useState(false);
  const [delId,    setDel]  = useState(null);

  const saveFech = (f) => {
    setFechamentos(fs => fs.find(x=>x.id===f.id) ? fs.map(x=>x.id===f.id?f:x) : [...fs,f]);
    setEdit(null); setAdd(false);
  };

  const changeStatus = (id, st) => setFechamentos(fs=>fs.map(f=>f.id===id?{...f,status:st}:f));
  const doDel = () => { setFechamentos(fs=>fs.filter(f=>f.id!==delId)); setDel(null); };
  const sn    = id => sellers.find(s=>s.id===Number(id))?.nome||"—";
  const selCor= id => sellers.find(s=>s.id===Number(id))?.cor||"var(--t3)";

  const fechBase = isVendedor(user.role)
    ? fechamentos.filter(f => sn(f.vendedorId).toLowerCase().includes((user.nome||"").toLowerCase().split(" ")[0].toLowerCase()))
    : fechamentos;

  const filtered_f = (search||"")
    ? fechBase.filter(f=>{const q=(search||"").toLowerCase();return f.cliente.toLowerCase().includes(q)||sn(f.vendedorId).toLowerCase().includes(q)||(f.obs||"").toLowerCase().includes(q);})
    : fechBase;

  const ativas    = fechamentos.filter(f=>(!f.status||f.status==="ativa")).length;
  const totalV    = filtered_f.reduce((s,f)=>s+f.valor,0);
  const totalC    = filtered_f.reduce((s,f)=>s+f.comissao,0);

  const STATUS_CFG = {
    ativa:     {label:"✅ Ativa",     bg:"var(--grdim)",  color:"var(--green)", border:"rgba(34,197,94,.35)"},
    pendente:  {label:"⏳ Pendente",  bg:"var(--adim)",   color:"var(--amber)", border:"rgba(245,158,11,.35)"},
    cancelada: {label:"❌ Cancelada", bg:"var(--rdim)",   color:"var(--red)",   border:"rgba(239,68,68,.35)"},
  };

  const getBtnStyle = (st) => {
    const s = STATUS_CFG[st]||STATUS_CFG.ativa;
    return {padding:"5px 12px",borderRadius:"var(--rsm)",border:`1px solid ${s.border}`,background:s.bg,color:s.color,cursor:"pointer",fontFamily:"'Geist',sans-serif",fontSize:11.5,fontWeight:700,whiteSpace:"nowrap"};
  };

  return (
    <div>
      <div className="ph">
        <div className="ph-row">
          <div>
            <h1><em>Fechamentos</em></h1>
            <p>{fechamentos.length} vendas · {ativas} ativas</p>
          </div>
          <button className="tbtn tbtn-gold" onClick={()=>{setEdit(null);setAdd(true);}}><Svg d={IC.plus} size={14}/> Registrar Venda</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="g3 mb20">
        {[
          {lbl:"Total Vendido",   val:brl(totalV),                        s:"#c9a84c"},
          {lbl:"Total Comissões", val:brl(totalC),                        s:"#22c55e"},
          {lbl:"Vendas Ativas",   val:String(ativas)+" de "+fechamentos.length, s:"#3b82f6"},
        ].map((k,i)=>(
          <div className="kpi" key={i}><div className="kpi-bar" style={{background:k.s}}/><div className="kpi-lbl">{k.lbl}</div><div className="kpi-val">{k.val}</div></div>
        ))}
      </div>

      {/* Cards */}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered_f.length===0 && (
          <div className="empty" style={{background:"var(--surf)",border:"1px solid var(--b1)",borderRadius:"var(--rlg)"}}>
            <div className="empty-ic">📋</div>
            <p>{search?`Nenhum resultado para "${search}"`:"Nenhuma venda cadastrada ainda."}</p>
          </div>
        )}
        {filtered_f.map((f,i) => {
          const st    = f.status||"ativa";
          const stCfg = STATUS_CFG[st]||STATUS_CFG.ativa;
          const vendNome = sn(f.vendedorId);
          const vendCor  = selCor(f.vendedorId);
          return (
            <div key={f.id} style={{background:"var(--surf)",border:"1px solid var(--b1)",borderRadius:"var(--rlg)",padding:"16px 20px",boxShadow:"var(--sh)",transition:"border-color .15s,box-shadow .15s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--b2)";e.currentTarget.style.boxShadow="var(--shmd)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--b1)";e.currentTarget.style.boxShadow="var(--sh)"}}
            >
              <div style={{display:"flex",alignItems:"flex-start",gap:14,flexWrap:"wrap"}}>
                {/* Avatar cliente */}
                <div style={{width:44,height:44,borderRadius:"50%",background:`hsl(${(String(f.id).split("").reduce((a,x)=>a+x.charCodeAt(0),0)*53)%360},50%,40%)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:800,color:"#fff",flexShrink:0}}>
                  {(f.cliente||"?")[0].toUpperCase()}
                </div>

                {/* Info central */}
                <div style={{flex:1,minWidth:180}}>
                  <div style={{fontWeight:700,fontSize:15,color:"var(--t1)",marginBottom:4}}>{f.cliente}</div>
                  <div style={{display:"flex",gap:16,flexWrap:"wrap",fontSize:12.5}}>
                    <span style={{color:"var(--gold2)",fontWeight:700,fontFamily:"'Geist Mono',monospace"}}>💰 {brl(f.valor)}</span>
                    <span style={{color:"var(--green)",fontWeight:700,fontFamily:"'Geist Mono',monospace"}}>📊 Comissão: {brl(f.comissao)}</span>
                    <span style={{color:"var(--t3)"}}>📅 {f.data}</span>
                  </div>
                  <div style={{display:"flex",gap:10,alignItems:"center",marginTop:5,flexWrap:"wrap"}}>
                    {vendNome!=="—" && (
                      <span style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:"var(--t2)"}}>
                        <span style={{width:18,height:18,borderRadius:"50%",background:vendCor,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,color:"var(--bg)",flexShrink:0}}>{inits(vendNome)}</span>
                        {vendNome}
                      </span>
                    )}
                    {f.obs && <span style={{fontSize:11.5,color:"var(--t3)",fontStyle:"italic"}}>"{f.obs}"</span>}
                  </div>
                </div>

                {/* Status + ações */}
                <div style={{display:"flex",flexDirection:"column",gap:8,alignItems:"flex-end",flexShrink:0}}>
                  {/* Status dropdown visual */}
                  <div style={{display:"flex",gap:5}}>
                    {Object.entries(STATUS_CFG).map(([sv, sc])=>(
                      <button key={sv} onClick={()=>changeStatus(f.id,sv)}
                        style={{...getBtnStyle(sv), opacity: st===sv?1:.45, transform: st===sv?"scale(1.05)":"scale(1)", transition:"all .15s"}}
                      >{sc.label}</button>
                    ))}
                  </div>
                  {/* Editar / Excluir */}
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>{setAdd(false);setEdit(f);}}
                      style={{padding:"7px 14px",borderRadius:"var(--rsm)",border:"1px solid var(--b2)",background:"var(--bg4)",color:"var(--t1)",cursor:"pointer",fontFamily:"'Geist',sans-serif",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:5,transition:"all .13s"}}
                      onMouseEnter={e=>e.currentTarget.style.background="var(--bg5)"}
                      onMouseLeave={e=>e.currentTarget.style.background="var(--bg4)"}
                    ><Svg d={IC.edit} size={13}/> Editar</button>
                    {!isVendedor(user.role) && (
                      <button onClick={()=>setDel(f.id)}
                        style={{padding:"7px 14px",borderRadius:"var(--rsm)",border:"1px solid rgba(239,68,68,.3)",background:"var(--rdim)",color:"var(--red)",cursor:"pointer",fontFamily:"'Geist',sans-serif",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:5,transition:"all .13s"}}
                        onMouseEnter={e=>e.currentTarget.style.opacity=".75"}
                        onMouseLeave={e=>e.currentTarget.style.opacity="1"}
                      ><Svg d={IC.trash} size={13}/> Excluir</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered_f.length>0 && (
        <div style={{marginTop:12,padding:"10px 16px",background:"var(--surf)",borderRadius:"var(--r)",border:"1px solid var(--b1)",display:"flex",gap:20,fontSize:12,color:"var(--t3)"}}>
          <span>{search?`${filtered_f.length} resultado(s) · `:""}<b style={{color:"var(--t1)"}}>{brl(totalV)}</b> total vendido</span>
          <span><b style={{color:"var(--green)"}}>{brl(totalC)}</b> em comissões</span>
        </div>
      )}

      {/* Modal editar/adicionar */}
      {(addOpen || editFech!==null) && (
        <FechForm fech={editFech} sellers={sellers} onClose={()=>{setEdit(null);setAdd(false);}} onSave={saveFech}/>
      )}

      {/* Modal confirmar exclusão */}
      {delId && (
        <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setDel(null)}>
          <div className="modal" style={{maxWidth:400}} onClick={e=>e.stopPropagation()}>
            <div style={{textAlign:"center",paddingBottom:20}}>
              <div style={{fontSize:44,marginBottom:12}}>⚠️</div>
              <div className="m-title" style={{textAlign:"center"}}>Excluir Venda?</div>
              <div style={{fontSize:13,color:"var(--t3)",marginTop:8,lineHeight:1.6}}>
                Você vai excluir <b style={{color:"var(--t1)"}}>{fechamentos.find(f=>f.id===delId)?.cliente}</b>.<br/>Esta ação não pode ser desfeita.
              </div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button className="btn-c" style={{flex:1}} onClick={()=>setDel(null)}>Cancelar</button>
              <button onClick={doDel} style={{flex:1,padding:"9px",borderRadius:"var(--r)",border:"none",background:"var(--red)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Geist',sans-serif"}}>Sim, excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   COMISSÕES (senha protegida)
══════════════════════════════════════════ */
function ComissoesPage({fechamentos, sellers, userRole, search}) {
  const [ok, setOk]   = useState(isAdmin(userRole));
  const [pw, setPw]   = useState("");
  const [err, setErr] = useState("");
  const tryPw = () => pw==="admin123" ? setOk(true) : setErr("Senha incorreta.");

  if (!ok) return (
    <div className="pw-gate">
      <div className="pw-ic">🔒</div>
      <div className="pw-title">Área Restrita</div>
      <div className="pw-sub">Seção protegida por senha. Acesso exclusivo para administradores.</div>
      <div className="pw-row">
        <input className="finp" type="password" placeholder="Senha admin" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&tryPw()} style={{width:220}} autoFocus/>
        <button className="btn-s" onClick={tryPw}>Acessar</button>
      </div>
      {err && <div className="pw-err">{err}</div>}
      <div style={{fontSize:11.5,color:"var(--t3)"}}>Senha padrão: admin123</div>
    </div>
  );

  const fechFilt = (search||"") ? fechamentos.filter(f=>{const q=(search||"").toLowerCase();const sn=sellers.find(s=>s.id===f.vendedorId)?.nome||"";return f.cliente.toLowerCase().includes(q)||sn.toLowerCase().includes(q);}) : fechamentos;
  const totalC = fechFilt.reduce((s,f)=>s+f.comissao,0);
  const totalV = fechFilt.reduce((s,f)=>s+f.valor,0);

  return (
    <div>
      <div className="ph"><h1>Comissões <em>& Ranking</em></h1><p>Acesso administrativo</p></div>
      <div className="g3 mb20">
        {[
          {lbl:"Total Comissões",val:brl(totalC),s:"#22c55e"},
          {lbl:"Total Vendido",  val:brl(totalV),s:"#c9a84c"},
          {lbl:"Taxa Média",val:totalV>0?(totalC/totalV*100).toFixed(2)+"%":"—",s:"#3b82f6"},
        ].map((k,i)=>(
          <div className="kpi" key={i}><div className="kpi-bar" style={{background:k.s}}/><div className="kpi-lbl">{k.lbl}</div><div className="kpi-val">{k.val}</div></div>
        ))}
      </div>
      <div className="g55">
        <div className="tbl-card">
          <div style={{padding:"14px 18px",borderBottom:"1px solid var(--b1)",fontWeight:700,fontSize:13.5}}>🏆 Ranking por Comissão</div>
          {[...sellers].sort((a,b)=>{
            const ca=fechamentos.filter(f=>f.vendedorId===a.id).reduce((s,f)=>s+f.comissao,0);
            const cb=fechamentos.filter(f=>f.vendedorId===b.id).reduce((s,f)=>s+f.comissao,0);
            return cb-ca;
          }).map((s,i)=>{
            const c=fechamentos.filter(f=>f.vendedorId===s.id).reduce((a,f)=>a+f.comissao,0);
            const m=["🥇","🥈","🥉",""][i]||`#${i+1}`;
            return(
              <div className="rank-row" key={s.id}>
                <div className="rank-pos" style={{color:i===0?"var(--gold2)":"var(--t3)"}}>{m}</div>
                <div className="rank-ava" style={{background:s.cor}}>{inits(s.nome)}</div>
                <div style={{flex:1}}><div className="rank-name">{s.nome}</div><div className="rank-sub">{fechamentos.filter(f=>f.vendedorId===s.id).length} vendas</div></div>
                <div className="rank-val">{brl(c)}</div>
              </div>
            );
          })}
        </div>
        <div className="tbl-card">
          <div style={{padding:"14px 18px",borderBottom:"1px solid var(--b1)",fontWeight:700,fontSize:13.5}}>📋 Histórico</div>
          <table className="tbl">
            <thead><tr><th>Cliente</th><th>Valor</th><th>Comissão</th><th>Vendedor</th></tr></thead>
            <tbody>
              {fechFilt.map(f=>(
                <tr key={f.id}>
                  <td><strong>{f.cliente}</strong></td>
                  <td className="mono" style={{color:"var(--gold2)",fontWeight:700,fontSize:12}}>{brl(f.valor)}</td>
                  <td className="mono" style={{color:"var(--green)",fontWeight:700,fontSize:12}}>{brl(f.comissao)}</td>
                  <td style={{fontSize:12}}>{sellers.find(s=>s.id===f.vendedorId)?.nome||"—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   EQUIPE — Form + Page
══════════════════════════════════════════ */
const COR_NOMES = ["Dourado","Azul","Verde","Roxo","Teal","Âmbar","Vermelho","Ciano","Rosa","Índigo"];

function SellerForm({seller, sellers, onClose, onSave}) {
  const isNew = !seller;
  const blank = {nome:"",cargo:"Vendedor",cor:COLORS[sellers.length % COLORS.length],meta:"30000",role:"vendedor",telefone:"",email:""};
  const [f, setF] = useState(() => seller ? {...seller, meta:String(seller.meta)} : blank);
  const up = k => e => setF(p => ({...p, [k]: e.target.value}));

  const save = () => {
    if (!f.nome.trim()) { alert("Informe o nome completo do vendedor."); return; }
    if (!f.meta || Number(f.meta) <= 0) { alert("Informe uma meta válida (maior que zero)."); return; }
    onSave({...f, id: f.id || uid(), meta: Number(f.meta)});
  };

  return (
    <Modal
      title={isNew ? "➕ Adicionar Vendedor" : "✏️ Editar Vendedor"}
      sub={isNew ? "Preencha os dados do novo membro da equipe" : `Editando: ${seller.nome}`}
      onClose={onClose}
      onSave={save}
      saveLabel={isNew ? "Adicionar Vendedor" : "Salvar Alterações"}
      lg
    >
      {/* Preview do avatar */}
      <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",background:"var(--bg4)",borderRadius:"var(--r)",marginBottom:18,border:"1px solid var(--b2)"}}>
        <div style={{width:52,height:52,borderRadius:"50%",background:f.cor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:800,color:"var(--bg)",flexShrink:0,transition:"background .2s"}}>
          {inits(f.nome)||"?"}
        </div>
        <div>
          <div style={{fontWeight:700,fontSize:14,color:"var(--t1)"}}>{f.nome||"Nome do vendedor"}</div>
          <div style={{fontSize:12,color:"var(--t3)"}}>{f.cargo||"Cargo"} · <span className={`badge b-${f.role}`}>{f.role}</span></div>
        </div>
      </div>

      <div className="fg">
        {/* Nome */}
        <div className="fgroup ff">
          <div className="flbl">Nome completo *</div>
          <input className="finp" value={f.nome} onChange={up("nome")} placeholder="Ex: João Silva" autoFocus/>
        </div>

        {/* Cargo e Perfil */}
        <div className="fgroup">
          <div className="flbl">Cargo / Função</div>
          <input className="finp" value={f.cargo} onChange={up("cargo")} placeholder="Ex: Vendedor, Closer, SDR"/>
        </div>
        <div className="fgroup">
          <div className="flbl">Perfil de acesso</div>
          <select className="fsel" value={f.role} onChange={up("role")}>
            <option value="vendedor">💼 Vendedor</option>
            <option value="supervisor">📊 Supervisor</option>
            <option value="admin">👑 Administrador</option>
          </select>
        </div>

        {/* Contato */}
        <div className="fgroup">
          <div className="flbl">Telefone / WhatsApp</div>
          <input className="finp" value={f.telefone||""} onChange={up("telefone")} placeholder="(XX) XXXXX-XXXX"/>
        </div>
        <div className="fgroup">
          <div className="flbl">E-mail</div>
          <input className="finp" type="email" value={f.email||""} onChange={up("email")} placeholder="vendedor@email.com"/>
        </div>

        {/* Meta e Cor */}
        <div className="fgroup">
          <div className="flbl">Meta Mensal de Vendas (R$) *</div>
          <input className="finp" type="number" value={f.meta} onChange={up("meta")} placeholder="Ex: 5000"/>
          <div style={{fontSize:11,color:"var(--t3)",marginTop:3}}>Valor total em vendas que o vendedor deve atingir no mês</div>
        </div>
        <div className="fgroup">
          <div className="flbl">Cor do perfil</div>
          <select className="fsel" value={f.cor} onChange={up("cor")}>
            {COLORS.map((c,i) => (
              <option key={c} value={c}>{COR_NOMES[i]} — {c}</option>
            ))}
          </select>
          <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
            {COLORS.map(c => (
              <div
                key={c}
                onClick={()=>setF(p=>({...p,cor:c}))}
                style={{width:22,height:22,borderRadius:"50%",background:c,cursor:"pointer",
                  border:f.cor===c?"2px solid var(--t1)":"2px solid transparent",
                  boxShadow:f.cor===c?"0 0 0 2px var(--gold)":"none",transition:"all .15s"}}
              />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function EquipePage({sellers, setSellers, fechamentos, setFechamentos, search, user}) {
  const [editSeller, setEdit]    = useState(null);
  const [addOpen,    setAdd]     = useState(false);
  const [confirming, setConfirm] = useState(null);
  const [vendaModal, setVendaModal] = useState(null);
  const [vendaForm,  setVendaForm]  = useState({});
  const upV = k => e => setVendaForm(p=>({...p,[k]:e.target.value}));

  const saveVenda = () => {
    const v = Number(vendaForm.valor)||0;
    const comm = Number(vendaForm.comissao)||0;
    if (!vendaForm.cliente?.trim()) { alert("Informe o nome do cliente."); return; }
    if (!v) { alert("Informe o valor da venda."); return; }
    if (!comm) { alert("Informe o valor da comissão."); return; }
    setFechamentos(fs=>[...fs,{id:uid(),cliente:vendaForm.cliente,valor:v,comissao:comm,data:nowFull(),vendedorId:vendaModal.id,obs:vendaForm.obs||""}]);
    setVendaModal(null); setVendaForm({});
  };

  const sellersFiltered = (search||"")
    ? sellers.filter(s=>s.nome.toLowerCase().includes((search||"").toLowerCase())||s.cargo.toLowerCase().includes((search||"").toLowerCase()))
    : sellers;

  const saveSeller = useCallback(s => {
    setSellers(ss => {
      const exists = ss.find(x => x.id === s.id);
      return exists ? ss.map(x => x.id === s.id ? s : x) : [...ss, s];
    });
    setEdit(null);
    setAdd(false);
  }, [setSellers]);

  const confirmDelete = (id) => setConfirm(id);
  const doDelete = () => {
    setSellers(ss => ss.filter(s => s.id !== confirming));
    setConfirm(null);
  };

  const sorted = [...sellersFiltered].sort((a, b) => {
    const fa = fechamentos.filter(f=>f.vendedorId===a.id).reduce((s,f)=>s+f.valor,0);
    const fb = fechamentos.filter(f=>f.vendedorId===b.id).reduce((s,f)=>s+f.valor,0);
    return fb - fa;
  });

  return (
    <div>
      <div className="ph">
        <div className="ph-row">
          <div>
            <h1>Gestão de <em>Equipe</em></h1>
            <p>{sellers.length} vendedor{sellers.length!==1?"es":""} cadastrado{sellers.length!==1?"s":""}</p>
          </div>
          <button className="tbtn tbtn-gold" onClick={()=>setAdd(true)}>
            <Svg d={IC.plus} size={14}/> Adicionar Vendedor
          </button>
        </div>
      </div>

      {/* ── INSTRUÇÃO RÁPIDA ── */}
      <div style={{background:"var(--gdim)",border:"1px solid rgba(201,168,76,.2)",borderRadius:"var(--r)",padding:"10px 16px",marginBottom:20,display:"flex",alignItems:"center",gap:10,fontSize:13,color:"var(--gold2)"}}>
        <span style={{fontSize:16}}>💡</span>
        <span>Use os botões <b>✏️ Editar</b> e <b>🗑️ Remover</b> em cada card para gerenciar os vendedores. Clique em <b>"+ Adicionar Vendedor"</b> para incluir um novo membro.</span>
      </div>

      {/* ── CARDS DE VENDEDORES ── */}
      <div className="seller-grid mb20">
        {sellersFiltered.map(s => {
          const svs = fechamentos.filter(f => f.vendedorId === s.id);
          const tot = svs.reduce((a,f) => a+f.valor, 0);
          const com = svs.reduce((a,f) => a+f.comissao, 0);
          const p2  = pct(tot, s.meta);
          const c   = p2>=100 ? "var(--green)" : p2>=60 ? "var(--gold)" : "var(--red)";
          return (
            <div className="seller-card" key={s.id}>
              {/* Avatar + nome */}
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                <div style={{width:48,height:48,borderRadius:"50%",background:s.cor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:800,color:"var(--bg)",flexShrink:0}}>
                  {inits(s.nome)}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div className="s-name" style={{marginBottom:2}}>{s.nome}</div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>
                    <span style={{fontSize:11.5,color:"var(--t3)"}}>{s.cargo}</span>
                    <span className={`badge b-${s.role}`}>{s.role}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="s-stats">
                <div className="s-stat"><div className="s-v">{brl(tot)}</div><div className="s-l">Receita</div></div>
                <div className="s-stat"><div className="s-v">{svs.length}</div><div className="s-l">Vendas</div></div>
                <div className="s-stat"><div className="s-v">{brl(com)}</div><div className="s-l">Comissão</div></div>
                <div className="s-stat"><div className="s-v">{brl(s.meta)}</div><div className="s-l">Meta</div></div>
              </div>

              {/* Progresso */}
              <div style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--t3)",marginBottom:5}}>
                  <span>Progresso da meta</span>
                  <span style={{fontWeight:700,color:c}}>{p2}%</span>
                </div>
                <div className="prog">
                  <div className="prog-fill" style={{width:`${p2}%`,background:s.cor,transition:"width .8s var(--spring)"}}/>
                </div>
              </div>

              <div style={{display:"flex",flexDirection:"column",gap:7,borderTop:"1px solid var(--b1)",paddingTop:14}}>
                <button onClick={()=>{setVendaModal(s);setVendaForm({cliente:"",valor:"",comissao:"",obs:""});}}
                  style={{width:"100%",padding:"9px",borderRadius:"var(--rsm)",border:"1px solid rgba(34,197,94,.35)",background:"var(--grdim)",color:"var(--green)",cursor:"pointer",fontFamily:"'Geist',sans-serif",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}
                ><Svg d={IC.plus} size={14}/> Registrar Venda</button>
                <div style={{display:"flex",gap:7}}>
                  <button onClick={()=>setEdit(s)} style={{flex:1,padding:"7px",borderRadius:"var(--rsm)",border:"1px solid var(--b2)",background:"var(--bg4)",color:"var(--t1)",cursor:"pointer",fontFamily:"'Geist',sans-serif",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                    <Svg d={IC.edit} size={12}/> Editar
                  </button>
                  {isAdmin(user.role) && (
                    <button onClick={()=>confirmDelete(s.id)} style={{flex:1,padding:"7px",borderRadius:"var(--rsm)",border:"1px solid rgba(239,68,68,.3)",background:"var(--rdim)",color:"var(--red)",cursor:"pointer",fontFamily:"'Geist',sans-serif",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                      <Svg d={IC.trash} size={12}/> Remover
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Card de adicionar */}
{isAdmin(user.role) && <div className="add-card" onClick={()=>setAdd(true)}>
          <div style={{width:52,height:52,borderRadius:"50%",border:"2px dashed var(--b2)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:4}}>
            <Svg d={IC.plus} size={22}/>
          </div>
          <span style={{fontSize:13,fontWeight:600}}>Adicionar Vendedor</span>
          <span style={{fontSize:11.5,color:"var(--t4)"}}>Clique para cadastrar</span>
        </div>}
      </div>

      {/* ── TABELA DE PRODUÇÃO ── */}
      <div style={{fontWeight:700,fontSize:14,marginBottom:12,color:"var(--t1)"}}>
        📊 Ranking de Produção
      </div>
      <div className="tbl-card">
        {sellers.length === 0 ? (
          <div className="empty">
            <div className="empty-ic">👥</div>
            <p>Nenhum vendedor cadastrado ainda. Clique em "Adicionar Vendedor" para começar.</p>
          </div>
        ) : (
          <table className="tbl">
            <thead>
              <tr>
                <th>Pos.</th>
                <th>Vendedor</th>
                <th>Cargo</th>
                <th>Perfil</th>
                <th>Vendas</th>
                <th>Receita</th>
                <th>Comissão</th>
                <th>Meta</th>
                <th>% Meta</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((s, i) => {
                const svs = fechamentos.filter(f => f.vendedorId === s.id);
                const tot = svs.reduce((a,f) => a+f.valor, 0);
                const com = svs.reduce((a,f) => a+f.comissao, 0);
                const p2  = pct(tot, s.meta);
                const c   = p2>=100 ? "var(--green)" : p2>=60 ? "var(--gold)" : "var(--red)";
                const medal = ["🥇","🥈","🥉"][i] || `#${i+1}`;
                return (
                  <tr key={s.id}>
                    <td style={{fontSize:18,textAlign:"center"}}>{medal}</td>
                    <td>
                      <span style={{display:"flex",alignItems:"center",gap:9}}>
                        <span style={{width:28,height:28,borderRadius:"50%",background:s.cor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"var(--bg)",flexShrink:0}}>
                          {inits(s.nome)}
                        </span>
                        <strong>{s.nome}</strong>
                      </span>
                    </td>
                    <td style={{color:"var(--t2)"}}>{s.cargo}</td>
                    <td><span className={`badge b-${s.role}`}>{s.role}</span></td>
                    <td style={{fontWeight:700,textAlign:"center"}}>{svs.length}</td>
                    <td className="mono" style={{color:"var(--gold2)",fontWeight:700}}>{brl(tot)}</td>
                    <td className="mono" style={{color:"var(--green)",fontWeight:700}}>{brl(com)}</td>
                    <td className="mono">{brl(s.meta)}</td>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div className="prog" style={{width:60,height:6,display:"inline-block",verticalAlign:"middle"}}>
                          <div className="prog-fill" style={{width:`${p2}%`,background:c}}/>
                        </div>
                        <span style={{fontWeight:800,color:c,fontSize:12}}>{p2}%</span>
                      </div>
                    </td>
                    <td>
                      <div className="ic-btn-row">
                        <button className="ic-btn" style={{color:"var(--green)",borderColor:"rgba(34,197,94,.3)",background:"var(--grdim)"}} onClick={()=>{setVendaModal(s);setVendaForm({cliente:"",valor:"",comissao:"",obs:""});}}>
                          <Svg d={IC.plus} size={12}/> Venda
                        </button>
                        <button className="ic-btn" onClick={()=>setEdit(s)}>
                          <Svg d={IC.edit} size={12}/> Editar
                        </button>
                        {isAdmin(user.role) && (
                          <button className="ic-btn red" onClick={()=>confirmDelete(s.id)}>
                            <Svg d={IC.trash} size={12}/> Remover
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── MODAL REGISTRAR VENDA ── */}
      {vendaModal && (
        <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setVendaModal(null)}>
          <div className="modal modal-lg" onClick={e=>e.stopPropagation()}>
            <div className="m-title">💰 Registrar Venda</div>
            <div className="m-sub" style={{marginBottom:14}}>Vendedor: <b>{vendaModal.nome}</b> · Meta: <b>{brl(vendaModal.meta)}</b></div>
            {(()=>{
              const jaComm = fechamentos.filter(f=>f.vendedorId===vendaModal.id).reduce((s,f)=>s+f.comissao,0);
              const novaC  = Number(vendaForm.comissao)||0;
              const total  = jaComm+novaC;
              const p2     = pct(total, vendaModal.meta);
              const cor    = p2>=100?"var(--green)":p2>=60?"var(--gold)":"var(--red)";
              return (
                <div style={{background:"var(--bg4)",borderRadius:"var(--r)",padding:"12px 14px",marginBottom:16,border:"1px solid var(--b2)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:6}}>
                    <span style={{color:"var(--t3)"}}>Progresso após esta venda</span>
                    <span style={{fontWeight:800,color:cor}}>{p2}%</span>
                  </div>
                  <div className="prog"><div className="prog-fill" style={{width:`${p2}%`,background:vendaModal.cor,transition:"width .4s"}}/></div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginTop:5,color:"var(--t3)"}}>
                    <span>Atual: <b style={{color:"var(--t1)"}}>{brl(jaComm)}</b></span>
                    <span>+ Esta: <b style={{color:"var(--green)"}}>{brl(novaC)}</b></span>
                    <span>Meta: <b style={{color:"var(--t1)"}}>{brl(vendaModal.meta)}</b></span>
                  </div>
                </div>
              );
            })()}
            <div className="fg">
              <div className="fgroup ff"><div className="flbl">Nome do Cliente *</div><input className="finp" value={vendaForm.cliente||""} onChange={upV("cliente")} placeholder="Nome do cliente" autoFocus/></div>
              <div className="fgroup"><div className="flbl">Valor da Venda (R$) *</div><input className="finp" type="number" value={vendaForm.valor||""} onChange={upV("valor")} placeholder="0"/></div>
              <div className="fgroup"><div className="flbl">Comissão (R$) *</div><input className="finp" type="number" value={vendaForm.comissao||""} onChange={upV("comissao")} placeholder="0"/><div style={{fontSize:11,color:"var(--t3)",marginTop:3}}>Valor que conta para a meta</div></div>
              <div className="fgroup ff"><div className="flbl">Observações</div><textarea className="fta" value={vendaForm.obs||""} onChange={upV("obs")} placeholder="Detalhes da venda…"/></div>
            </div>
            <div className="m-foot">
              <button className="btn-c" onClick={()=>setVendaModal(null)}>Cancelar</button>
              <button className="btn-s" onClick={saveVenda}>✅ Confirmar Venda</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL ADICIONAR / EDITAR ── */}
      {(addOpen || editSeller) && (
        <SellerForm
          seller={editSeller}
          sellers={sellers}
          onClose={()=>{ setEdit(null); setAdd(false); }}
          onSave={saveSeller}
        />
      )}

      {/* ── MODAL CONFIRMAR EXCLUSÃO ── */}
      {confirming && (
        <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setConfirm(null)}>
          <div className="modal" style={{maxWidth:400}} onClick={e=>e.stopPropagation()}>
            <div style={{textAlign:"center",padding:"8px 0 20px"}}>
              <div style={{fontSize:48,marginBottom:12}}>⚠️</div>
              <div className="m-title" style={{textAlign:"center"}}>Remover Vendedor?</div>
              <div style={{fontSize:13,color:"var(--t3)",marginTop:8,lineHeight:1.5}}>
                Você está prestes a remover <b style={{color:"var(--t1)"}}>{sellers.find(s=>s.id===confirming)?.nome}</b> da equipe.<br/>
                Esta ação não pode ser desfeita.
              </div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button className="btn-c" style={{flex:1}} onClick={()=>setConfirm(null)}>Cancelar</button>
              <button
                onClick={doDelete}
                style={{flex:1,padding:"9px",borderRadius:"var(--r)",border:"none",background:"var(--red)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Geist',sans-serif"}}
              >
                Sim, remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   RELATÓRIOS
══════════════════════════════════════════ */
function RelatoriosPage({leads, fechamentos, sellers, user}) {
  const totalV = fechamentos.reduce((s,f)=>s+f.valor,0);
  const totalC = fechamentos.reduce((s,f)=>s+f.comissao,0);
  const tConv  = leads.length>0?Math.round(leads.filter(l=>l.status==="fechado").length/leads.length*100):0;
  const byOrig = ORIGINS.map(o=>({lbl:o,n:leads.filter(l=>l.origem===o).length})).filter(o=>o.n>0);
  const maxO   = Math.max(...byOrig.map(o=>o.n),1);

  return (
    <div>
      <div className="ph"><h1><em>Relatórios</em></h1><p>Análise completa da operação</p></div>
      <div className="g4 mb20">
        {[
          {lbl:"Total Vendido",  val:brl(totalV),              s:"#c9a84c"},
          {lbl:"Total Comissões",val:brl(totalC),              s:"#22c55e"},
          {lbl:"Total Leads",    val:String(leads.length),     s:"#3b82f6"},
          {lbl:"Taxa Conversão", val:tConv+"%",                 s:"#a855f7"},
        ].map((k,i)=>(
          <div className="kpi anim" key={i}><div className="kpi-bar" style={{background:k.s}}/><div className="kpi-lbl">{k.lbl}</div><div className="kpi-val">{k.val}</div></div>
        ))}
      </div>
      <div className="g55 mb20">
        <div className="card">
          <div className="c-hd"><div className="c-title">Leads por Origem</div></div>
          <div className="c-body">
            {byOrig.map((o,i)=>(
              <div key={i} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12.5,marginBottom:4}}><span style={{color:"var(--t2)"}}>{o.lbl}</span><span style={{fontWeight:700,color:"var(--t1)"}}>{o.n}</span></div>
                <div className="prog" style={{height:6}}><div className="prog-fill" style={{width:`${o.n/maxO*100}%`,background:"var(--gold)"}}/></div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="c-hd"><div className="c-title">Leads por Status</div></div>
          <div className="c-body">
            {STATUS.map((s,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid var(--b1)"}}>
                <span className={`badge ${S_CLS[s]}`}>{s}</span>
                <span style={{fontWeight:700,color:"var(--t1)"}}>{leads.filter(l=>l.status===s).length}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card">
        <div className="c-hd"><div className="c-title">Produção por Vendedor</div></div>
        <div className="c-body">
          {(isVendedor(user.role)
          ? sellers.filter(s=>s.nome.toLowerCase().includes((user.nome||"").toLowerCase().split(" ")[0].toLowerCase()))
          : sellers
        ).map(s=>{
            const tot=fechamentos.filter(f=>f.vendedorId===s.id).reduce((a,f)=>a+f.valor,0);
            const p2=pct(tot,s.meta);
            return(
              <div key={s.id} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:5}}>
                  <span style={{display:"flex",alignItems:"center",gap:7,fontWeight:600,color:"var(--t1)"}}>
                    <span style={{width:22,height:22,borderRadius:"50%",background:s.cor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,color:"var(--bg)"}}>{inits(s.nome)}</span>
                    {s.nome}
                  </span>
                  <span className="mono" style={{fontWeight:700,color:"var(--gold2)"}}>{brl(tot)}</span>
                </div>
                <div className="prog"><div className="prog-fill" style={{width:`${p2}%`,background:s.cor,transition:"width .8s var(--spring)"}}/></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   CONFIGURAÇÕES
══════════════════════════════════════════ */
function ConfigPage({meta, setMeta, user, onReset, usuarios, setUsuarios}) {
  const [val,       setVal]       = useState(String(meta));
  const [resetModal, setResetModal] = useState(false);
  const [resetSenha, setResetSenha] = useState("");
  const [resetErr,   setResetErr]   = useState("");

  const confirmarReset = () => {
    const u = usuarios.find(u => u.email === user.email || u.id === user.id);
    if (!u || u.senha !== resetSenha) {
      setResetErr("Senha incorreta. Tente novamente.");
      return;
    }
    setResetModal(false);
    setResetSenha("");
    setResetErr("");
    onReset();
  };
  const [ok,        setOk]        = useState(false);
  const [storageOk, setStorageOk] = useState(null); // null=testando, true=ok, false=sem suporte

  useEffect(() => {
    async function testStorage() {
      try {
        await storage.set("crm_ping", "ok");
        const r = await storage.get("crm_ping");
        setStorageOk(r?.value === "ok");
      } catch (_) { setStorageOk(false); }
    }
    testStorage();
  }, []);

  const salvar = () => {
    const v = Number(val);
    if (v > 0) { setMeta(v); setOk(true); setTimeout(()=>setOk(false), 2000); }
    else alert("Informe um valor válido.");
  };

  const statusStorage = storageOk === null
    ? {ic:"⏳", txt:"Verificando armazenamento…", c:"var(--t3)"}
    : storageOk
    ? {ic:"🟢", txt:"Dados salvos automaticamente — persistem entre sessões e aparelhos", c:"var(--green)"}
    : {ic:"🟡", txt:"Armazenamento local indisponível — dados ficam apenas nesta sessão", c:"var(--amber)"};

  return (
    <div>
      <div className="ph"><h1><em>Configurações</em></h1><p>Personalize o sistema</p></div>

      {/* Gerenciar usuários — só admin */}
      <GerenciarUsuarios usuarios={usuarios} setUsuarios={setUsuarios}/>
      <div style={{borderTop:"1px solid var(--b1)",marginBottom:24}}/>

      {/* Modal confirmação de reset com senha */}
      {resetModal && (
        <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setResetModal(false)}>
          <div className="modal" style={{maxWidth:420}} onClick={e=>e.stopPropagation()}>
            <div style={{textAlign:"center",paddingBottom:16}}>
              <div style={{fontSize:48,marginBottom:10}}>⚠️</div>
              <div className="m-title" style={{textAlign:"center",color:"var(--red)"}}>Resetar todos os dados?</div>
              <div style={{fontSize:13,color:"var(--t3)",marginTop:8,lineHeight:1.6}}>
                Esta ação vai <b style={{color:"var(--t1)"}}>apagar permanentemente</b> todos os leads, fechamentos e vendedores cadastrados, voltando ao estado inicial de exemplo.<br/><br/>
                <b style={{color:"var(--red)"}}>Essa ação não pode ser desfeita.</b>
              </div>
            </div>
            <div className="fgroup" style={{marginBottom:6}}>
              <div className="flbl">Confirme sua senha para continuar</div>
              <input
                className="finp"
                type="password"
                placeholder="Digite sua senha de login"
                value={resetSenha}
                onChange={e=>{ setResetSenha(e.target.value); setResetErr(""); }}
                onKeyDown={e=>e.key==="Enter"&&confirmarReset()}
                autoFocus
              />
              {resetErr && <div style={{color:"var(--red)",fontSize:12,marginTop:5,fontWeight:600}}>{resetErr}</div>}
            </div>
            <div style={{display:"flex",gap:10,marginTop:16}}>
              <button className="btn-c" style={{flex:1}} onClick={()=>setResetModal(false)}>Cancelar</button>
              <button
                onClick={confirmarReset}
                style={{flex:1,padding:"9px",borderRadius:"var(--r)",border:"none",background:"var(--red)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Geist',sans-serif"}}
              >Confirmar e Resetar</button>
            </div>
          </div>
        </div>
      )}

      {/* Banner de status do armazenamento */}
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 18px",borderRadius:"var(--r)",border:`1px solid ${storageOk?"rgba(34,197,94,.2)":"rgba(245,158,11,.2)"}`,background:storageOk?"var(--grdim)":"var(--adim)",marginBottom:24,fontSize:13}}>
        <span style={{fontSize:18,flexShrink:0}}>{statusStorage.ic}</span>
        <div>
          <div style={{fontWeight:600,color:"var(--t1)",marginBottom:2}}>Status do Armazenamento</div>
          <div style={{color:statusStorage.c}}>{statusStorage.txt}</div>
        </div>
      </div>

      <div className="g55">
        <div>
          <div style={{marginBottom:24}}>
            <div className="set-title">🎯 Metas & Comercial</div>
            <div className="card" style={{padding:"4px 20px"}}>
              <div className="set-row">
                <div><div className="set-lbl">Meta mensal (R$)</div><div className="set-desc">Valor de receita alvo para o mês</div></div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <input className="finp" type="number" value={val} onChange={e=>setVal(e.target.value)} style={{width:140}}/>
                  <button className="btn-s" onClick={salvar} style={{padding:"8px 14px"}}>{ok?"✓ Salvo":"Salvar"}</button>
                </div>
              </div>
            </div>
          </div>

          <div style={{marginBottom:24}}>
            <div className="set-title">🔔 Notificações</div>
            <div className="card" style={{padding:"4px 20px"}}>
              {[
                {lbl:"Novo lead cadastrado",  desc:"Alerta ao adicionar lead"},
                {lbl:"Follow-up vencido",     desc:"Lembretes de retorno"},
                {lbl:"Meta atingida",         desc:"Notificação ao bater meta"},
                {lbl:"Fechamento registrado", desc:"Alerta de venda fechada"},
              ].map((r,i)=>(
                <div className="set-row" key={i}>
                  <div><div className="set-lbl">{r.lbl}</div><div className="set-desc">{r.desc}</div></div>
                  <label className="toggle"><input type="checkbox" defaultChecked={i<2}/><span className="tog-s"/></label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="set-title">🗄️ Dados & Armazenamento</div>
            <div className="card" style={{padding:"4px 20px"}}>
              <div className="set-row">
                <div>
                  <div className="set-lbl">Limpar todos os dados</div>
                  <div className="set-desc">Apaga leads, vendas, vendedores e volta ao exemplo inicial</div>
                </div>
                <button
                  onClick={()=>{ setResetSenha(""); setResetErr(""); setResetModal(true); }}
                  style={{padding:"7px 14px",borderRadius:"var(--rsm)",border:"1px solid rgba(239,68,68,.3)",background:"var(--rdim)",color:"var(--red)",cursor:"pointer",fontFamily:"'Geist',sans-serif",fontSize:12,fontWeight:600,flexShrink:0}}
                >
                  🗑️ Resetar dados
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div style={{marginBottom:24}}>
            <div className="set-title">👤 Meu Perfil</div>
            <div className="card" style={{padding:20}}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
                <div style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,var(--gold),var(--gold2))",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--bg)",fontWeight:800,fontSize:18}}>
                  {inits(user.nome)}
                </div>
                <div>
                  <div style={{fontWeight:700,fontSize:15,color:"var(--t1)"}}>{user.nome}</div>
                  <div style={{fontSize:12,color:"var(--t3)"}}>{user.role}</div>
                </div>
              </div>
              <span className={`badge b-${user.role}`}>{user.role}</span>
            </div>
          </div>

          <div>
            <div className="set-title">ℹ️ Sobre o Sistema</div>
            <div className="card" style={{padding:"4px 20px"}}>
              {[
                ["Versão",     "2.0.0"],
                ["Plano",      "Premium"],
                ["Storage",    storageOk===null?"Verificando…" : storageOk?"Artifact Storage API":"Memória (sessão)"],
                ["Status",     "🟢 Ativo"],
              ].map(([k,v],i)=>(
                <div className="set-row" key={i} style={{paddingTop:10,paddingBottom:10}}>
                  <span style={{color:"var(--t3)",fontSize:13}}>{k}</span>
                  <span style={{fontWeight:700,fontSize:13,color:"var(--t1)"}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ══════════════════════════════════════════
   PRODUÇÃO DIÁRIA
══════════════════════════════════════════ */
function ProducaoPage({sellers, user}) {
  const [prod, setProd, prodOk] = useStored("crm2_producao", {});
  const [dia,  setDia]          = useState(hojeISO());
  const [saved, setSaved]       = useState({});
  const [calOpen, setCalOpen]   = useState(false);
  const [calMes,  setCalMes]    = useState(() => { const d=new Date(); return {y:d.getFullYear(),m:d.getMonth()}; });

  // Lê metas do storage compartilhado com MetaDiariaPage
  const [metasStorage] = useStored("crm2_metas_diarias", null);

  const METAS_DIARIAS_DEFAULT = {
    anuncios:20, numeros:10, retornos:15, discadas:30,
    atendidas:12, agendamentos:2, visitas:1, fechamentos:1,
    conv:5, produt:40, aproveit:20, taxaFech:50,
  };

  // Usa metas do storage (editadas em Meta Diária) ou padrão
  const MD = metasStorage || METAS_DIARIAS_DEFAULT;

  // Metas semanal = diária × 6 dias | mensal = diária × 22 dias úteis
  const METAS = {
    diaria:  MD,
    semanal: Object.fromEntries(Object.entries(MD).map(([k,v])=>[k, typeof v==="number"?v*6:v])),
    mensal:  Object.fromEntries(Object.entries(MD).map(([k,v])=>[k, typeof v==="number"?v*22:v])),
  };

  const CAMPOS = [
    {k:"anuncios",    label:"Anúncios",     ic:"📢"},
    {k:"numeros",     label:"Números",      ic:"📋"},
    {k:"retornos",    label:"Retornos",     ic:"🔄"},
    {k:"discadas",    label:"Discadas",     ic:"📞"},
    {k:"atendidas",   label:"Atendidas",    ic:"✅"},
    {k:"agendamentos",label:"Agendamentos", ic:"📅"},
    {k:"visitas",     label:"Visitas",      ic:"🚶"},
    {k:"fechamentos", label:"Fechamentos",  ic:"🏆"},
  ];

  const getVal = (sellerId, campo) => {
    const key = `${dia}_${sellerId}`;
    return Number(prod[key]?.[campo]||0);
  };

  const setVal = (sellerId, campo, val) => {
    const key = `${dia}_${sellerId}`;
    setProd(p=>({...p,[key]:{...(p[key]||{}),[campo]:Number(val)||0}}));
    setSaved(s=>({...s,[sellerId]:false}));
  };

  const salvar = (sellerId) => {
    setSaved(s=>({...s,[sellerId]:true}));
    setTimeout(()=>setSaved(s=>({...s,[sellerId]:false})),2000);
  };

  // Cálculo das taxas conforme planilha:
  // Conversão        = Fechamentos / Números × 100
  // Produtividade    = Atendidas   / Discadas × 100
  // Aproveitamento   = Agendamentos / Atendidas × 100
  // Taxa Fechamento  = Fechamentos / Visitas × 100
  const calcMetrics = (sid) => {
    const v = k => getVal(sid, k);
    const safe = (a, b) => b > 0 ? ((a / b) * 100).toFixed(1) : "0.0";
    const conv     = safe(v("fechamentos"), v("numeros"));
    const produt   = safe(v("atendidas"),   v("discadas"));
    const aproveit = safe(v("agendamentos"),v("atendidas"));
    const taxaFech = safe(v("fechamentos"), v("visitas"));
    // vs meta
    const cConv    = Number(conv)    >= MD.conv     ? "var(--green)" : Number(conv)    >= MD.conv*0.6     ? "var(--gold)" : "var(--red)";
    const cProdut  = Number(produt)  >= MD.produt   ? "var(--green)" : Number(produt)  >= MD.produt*0.6   ? "var(--gold)" : "var(--red)";
    const cAprov   = Number(aproveit)>= MD.aproveit ? "var(--green)" : Number(aproveit)>= MD.aproveit*0.6 ? "var(--gold)" : "var(--red)";
    const cFech    = Number(taxaFech)>= MD.taxaFech ? "var(--green)" : Number(taxaFech)>= MD.taxaFech*0.6 ? "var(--gold)" : "var(--red)";
    return [{label:"Conversão",       formula:"Fechamentos ÷ Números", val:conv+"%",    meta:MD.conv+"%",    c:cConv},
            {label:"Produtividade",   formula:"Atendidas ÷ Discadas",  val:produt+"%",  meta:MD.produt+"%",  c:cProdut},
            {label:"Aproveitamento",  formula:"Agendamentos ÷ Atendidas",val:aproveit+"%",meta:MD.aproveit+"%",c:cAprov},
            {label:"Taxa Fechamento", formula:"Fechamentos ÷ Visitas",  val:taxaFech+"%",meta:MD.taxaFech+"%",c:cFech}];
  };

  // Totais da equipe no dia
  const sellerList = isVendedor(user.role)
    ? sellers.filter(s=>s.nome.toLowerCase().includes((user.nome||"").toLowerCase().split(" ")[0].toLowerCase()))
    : sellers;

  // Função para gerar calendário do mês
  const getDiasDoMes = (y, m) => {
    const primeiro = new Date(y, m, 1).getDay(); // 0=dom
    const total = new Date(y, m+1, 0).getDate();
    const dias = [];
    for (let i=0; i<primeiro; i++) dias.push(null);
    for (let d=1; d<=total; d++) dias.push(d);
    return dias;
  };

  const diaParaISO = (y, m, d) => {
    const mm = String(m+1).padStart(2,"0");
    const dd = String(d).padStart(2,"0");
    return `${y}-${mm}-${dd}`;
  };

  const temDados = (y, m, d) => {
    const iso = diaParaISO(y,m,d);
    return sellerList.some(s => {
      const key = `${iso}_${s.id}`;
      return prod[key] && Object.values(prod[key]).some(v=>Number(v)>0);
    });
  };

  const SEMANAS = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
  const MESES_PT = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

  const diaSelecionadoFmt = (() => {
    const [y,m,d] = dia.split("-").map(Number);
    return `${String(d).padStart(2,"0")}/${String(m).padStart(2,"0")}/${y}`;
  })();

  const totalDia = CAMPOS.map(c=>({
    ...c,
    total: sellerList.reduce((s,sl)=>s+getVal(sl.id,c.k),0),
    meta:  MD[c.k] * sellerList.length,
  }));

  // Totais acumulados da semana (últimos 6 dias úteis a partir do dia selecionado)
  const diasSemana = (() => {
    const base = new Date(dia+"T12:00:00");
    const dias = [];
    for (let i=5; i>=0; i--) {
      const d2 = new Date(base); d2.setDate(base.getDate()-i);
      const iso = d2.toISOString().split("T")[0];
      dias.push(iso);
    }
    return dias;
  })();

  const totalSemana = CAMPOS.map(campo=>({
    ...campo,
    total: sellerList.reduce((s,sl)=>s+diasSemana.reduce((a,d2)=>{
      const key=`${d2}_${sl.id}`;
      return a+Number(prod[key]?.[campo.k]||0);
    },0),0),
    meta: MD[campo.k]*6*sellerList.length,
  }));

  // Totais acumulados do mês (todos os dias do mês da data selecionada)
  const diasMes = (() => {
    const [y,m] = dia.split("-").map(Number);
    const totalDias = new Date(y, m, 0).getDate();
    const dias = [];
    for (let d2=1; d2<=totalDias; d2++) {
      const mm = String(m).padStart(2,"0");
      const dd = String(d2).padStart(2,"0");
      dias.push(`${y}-${mm}-${dd}`);
    }
    return dias;
  })();

  const totalMes = CAMPOS.map(campo=>({
    ...campo,
    total: sellerList.reduce((s,sl)=>s+diasMes.reduce((a,d2)=>{
      const key=`${d2}_${sl.id}`;
      return a+Number(prod[key]?.[campo.k]||0);
    },0),0),
    meta: MD[campo.k]*22*sellerList.length,
  }));

  return (
    <div>
      <div className="ph">
        <div className="ph-row">
          <div>
            <h1>Produção <em>Diária</em></h1>
            <p>Planilha operacional · {diaSelecionadoFmt}</p>
          </div>
          {/* Seletor de data com calendário */}
          <div style={{position:"relative"}}>
            <button
              onClick={()=>setCalOpen(o=>!o)}
              style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",borderRadius:"var(--r)",border:`1px solid ${calOpen?"var(--gold)":"var(--b2)"}`,background:calOpen?"var(--gdim)":"var(--bg4)",color:"var(--t1)",cursor:"pointer",fontFamily:"'Geist',sans-serif",fontSize:13,fontWeight:600,transition:"all .15s"}}
            >
              <span>📅</span>
              <span>{diaSelecionadoFmt}</span>
              <span style={{fontSize:10,color:"var(--t3)"}}>▼</span>
            </button>

            {calOpen && (
              <div style={{position:"absolute",right:0,top:"calc(100% + 6px)",background:"var(--bg3)",border:"1px solid var(--b2)",borderRadius:"var(--rlg)",boxShadow:"var(--shlg)",zIndex:200,width:280,padding:16,animation:"scaleIn .18s var(--spring)"}}>
                {/* Navegação do mês */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                  <button onClick={()=>setCalMes(m=>m.m===0?{y:m.y-1,m:11}:{y:m.y,m:m.m-1})}
                    style={{padding:"4px 8px",borderRadius:6,border:"none",background:"var(--bg4)",color:"var(--t1)",cursor:"pointer",fontFamily:"'Geist',sans-serif",fontSize:14}}>‹</button>
                  <span style={{fontWeight:700,fontSize:13,color:"var(--t1)"}}>{MESES_PT[calMes.m]} {calMes.y}</span>
                  <button onClick={()=>setCalMes(m=>m.m===11?{y:m.y+1,m:0}:{y:m.y,m:m.m+1})}
                    style={{padding:"4px 8px",borderRadius:6,border:"none",background:"var(--bg4)",color:"var(--t1)",cursor:"pointer",fontFamily:"'Geist',sans-serif",fontSize:14}}>›</button>
                </div>
                {/* Dias da semana */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>
                  {SEMANAS.map(s=><div key={s} style={{textAlign:"center",fontSize:10,fontWeight:700,color:"var(--t3)",padding:"3px 0"}}>{s}</div>)}
                </div>
                {/* Dias do mês */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
                  {getDiasDoMes(calMes.y, calMes.m).map((d,i)=>{
                    if (!d) return <div key={i}/>;
                    const iso = diaParaISO(calMes.y, calMes.m, d);
                    const isSel = iso===dia;
                    const isHoje2 = iso===hojeISO();
                    const hasDados = temDados(calMes.y, calMes.m, d);
                    return (
                      <button key={i} onClick={()=>{setDia(iso);setCalOpen(false);}}
                        style={{
                          padding:"5px 2px",borderRadius:6,border:`1px solid ${isSel?"var(--gold)":"transparent"}`,
                          background:isSel?"var(--gdim)":isHoje2?"var(--bg5)":"transparent",
                          color:isSel?"var(--gold2)":isHoje2?"var(--t1)":"var(--t2)",
                          cursor:"pointer",fontFamily:"'Geist Mono',monospace",fontSize:12,fontWeight:isSel||isHoje2?700:400,
                          position:"relative",transition:"all .1s"
                        }}
                      >
                        {d}
                        {hasDados&&<span style={{position:"absolute",bottom:2,left:"50%",transform:"translateX(-50%)",width:4,height:4,borderRadius:"50%",background:isSel?"var(--gold)":"var(--green)",display:"block"}}/>}
                      </button>
                    );
                  })}
                </div>
                {/* Atalhos rápidos */}
                <div style={{borderTop:"1px solid var(--b1)",marginTop:10,paddingTop:10,display:"flex",gap:6,flexWrap:"wrap"}}>
                  {[
                    {l:"Hoje",    d:hojeISO()},
                    {l:"Ontem",   d:(()=>{const x=new Date();x.setDate(x.getDate()-1);return x.toISOString().split("T")[0]})()},
                    {l:"Seg",     d:(()=>{const x=new Date();x.setDate(x.getDate()-(x.getDay()||7)+1);return x.toISOString().split("T")[0]})()},
                  ].map(({l,d:dd})=>(
                    <button key={l} onClick={()=>{setDia(dd);setCalOpen(false);}}
                      style={{padding:"4px 10px",borderRadius:20,border:"1px solid var(--b2)",background:dia===dd?"var(--gdim)":"var(--bg4)",color:dia===dd?"var(--gold2)":"var(--t2)",cursor:"pointer",fontFamily:"'Geist',sans-serif",fontSize:11,fontWeight:600}}
                    >{l}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay invisível para fechar calendário */}
      {calOpen && <div onClick={()=>setCalOpen(false)} style={{position:"fixed",inset:0,zIndex:199}}/>}

      {sellerList.length===0 && (
        <div className="empty" style={{background:"var(--surf)",border:"1px solid var(--b1)",borderRadius:"var(--rlg)"}}>
          <div className="empty-ic">👥</div><p>Nenhum vendedor cadastrado. Adicione na aba Equipe.</p>
        </div>
      )}

      {/* ── TABELA ESTILO PLANILHA ── */}
      {sellerList.length>0 && (
        <div style={{overflowX:"auto",marginBottom:20}}>
          <table style={{width:"100%",borderCollapse:"collapse",background:"var(--surf)",border:"1px solid var(--b1)",borderRadius:"var(--rlg)",overflow:"hidden",boxShadow:"var(--sh)",minWidth:700}}>
            <thead>
              <tr style={{background:"var(--bg3)"}}>
                <th style={{padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:"var(--t3)",textTransform:"uppercase",letterSpacing:".06em",borderBottom:"1px solid var(--b1)",whiteSpace:"nowrap"}}>Vendedor</th>
                {CAMPOS.map(campo=>(
                  <th key={campo.k} style={{padding:"8px 8px",textAlign:"center",fontSize:10,fontWeight:700,color:"var(--t3)",textTransform:"uppercase",letterSpacing:".04em",borderBottom:"1px solid var(--b1)",whiteSpace:"nowrap"}}>
                    {campo.ic} {campo.label}<br/>
                    <span style={{fontSize:9,color:"var(--green)",fontWeight:600}}>D:{MD[campo.k]}</span>
                    <span style={{fontSize:9,color:"var(--blue)",fontWeight:600,margin:"0 3px"}}>S:{METAS.semanal[campo.k]}</span>
                    <span style={{fontSize:9,color:"var(--purple)",fontWeight:600}}>M:{METAS.mensal[campo.k]}</span>
                  </th>
                ))}
                <th style={{padding:"10px 10px",textAlign:"center",fontSize:10.5,fontWeight:700,color:"var(--t3)",textTransform:"uppercase",borderBottom:"1px solid var(--b1)",whiteSpace:"nowrap"}}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {sellerList.map((s,i)=>(
                <tr key={s.id} style={{background:i%2===0?"transparent":"var(--bg3)",transition:"background .1s"}}
                  onMouseEnter={e=>e.currentTarget.style.background="var(--bg4)"}
                  onMouseLeave={e=>e.currentTarget.style.background=i%2===0?"transparent":"var(--bg3)"}
                >
                  <td style={{padding:"10px 14px",borderBottom:"1px solid var(--b1)"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:28,height:28,borderRadius:"50%",background:s.cor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:"var(--bg)",flexShrink:0}}>{inits(s.nome)}</div>
                      <span style={{fontWeight:600,fontSize:13,color:"var(--t1)",whiteSpace:"nowrap"}}>{s.nome.split(" ")[0]}</span>
                    </div>
                  </td>
                  {CAMPOS.map(campo=>{
                    const val = getVal(s.id,campo.k);
                    const meta = MD[campo.k];
                    const ok = meta===0 || val>=meta;
                    const quase = meta>0 && val>=meta*0.6 && val<meta;
                    return (
                      <td key={campo.k} style={{padding:"6px 6px",borderBottom:"1px solid var(--b1)",textAlign:"center"}}>
                        <input type="number" min="0"
                          value={val||""}
                          onChange={e=>setVal(s.id,campo.k,e.target.value)}
                          placeholder="0"
                          style={{
                            width:60,textAlign:"center",padding:"6px 4px",
                            borderRadius:"var(--rsm)",
                            border:`1.5px solid ${ok&&val>0?"rgba(34,197,94,.4)":quase?"rgba(245,158,11,.4)":"var(--b2)"}`,
                            background:ok&&val>0?"rgba(34,197,94,.08)":quase?"rgba(245,158,11,.08)":"var(--bg4)",
                            color:"var(--t1)",fontFamily:"'Geist Mono',monospace",fontSize:14,fontWeight:700,
                            outline:"none",transition:"all .15s"
                          }}
                          onFocus={e=>e.target.style.borderColor="var(--gold)"}
                          onBlur={e=>e.target.style.borderColor=ok&&val>0?"rgba(34,197,94,.4)":quase?"rgba(245,158,11,.4)":"var(--b2)"}
                        />
                      </td>
                    );
                  })}
                  <td style={{padding:"6px 10px",borderBottom:"1px solid var(--b1)",textAlign:"center"}}>
                    <button onClick={()=>salvar(s.id)}
                      style={{padding:"5px 12px",borderRadius:"var(--rsm)",border:"none",background:saved[s.id]?"var(--green)":"linear-gradient(135deg,var(--gold),var(--gold2))",color:saved[s.id]?"#fff":"var(--bg)",cursor:"pointer",fontFamily:"'Geist',sans-serif",fontSize:11.5,fontWeight:700,transition:"all .2s",whiteSpace:"nowrap"}}
                    >{saved[s.id]?"✅":"💾 Salvar"}</button>
                  </td>
                </tr>
              ))}
              {/* Linha de TOTAL DIA */}
              <tr style={{background:"var(--bg3)",borderTop:"2px solid var(--b2)"}}>
                <td style={{padding:"8px 14px",fontWeight:700,fontSize:12,color:"var(--gold2)"}}>📊 TOTAL DIA</td>
                {totalDia.map(cc=>{
                  const ok = cc.meta===0||cc.total>=cc.meta;
                  return (
                    <td key={cc.k} style={{padding:"8px 6px",textAlign:"center"}}>
                      <div style={{fontFamily:"'Geist Mono',monospace",fontSize:14,fontWeight:800,color:ok&&cc.total>0?"var(--green)":cc.total>0?"var(--amber)":"var(--t3)"}}>{cc.total||"—"}</div>
                      <div style={{fontSize:9,color:"var(--t4)"}}>/ {cc.meta}</div>
                    </td>
                  );
                })}
                <td/>
              </tr>
              {/* Linha de TOTAL SEMANA */}
              <tr style={{background:"var(--bg4)",borderTop:"1px solid var(--b1)"}}>
                <td style={{padding:"8px 14px",fontWeight:700,fontSize:12,color:"var(--blue)"}}>📆 TOTAL SEMANA</td>
                {totalSemana.map(cc=>{
                  const ok = cc.meta===0||cc.total>=cc.meta;
                  return (
                    <td key={cc.k} style={{padding:"8px 6px",textAlign:"center"}}>
                      <div style={{fontFamily:"'Geist Mono',monospace",fontSize:13,fontWeight:700,color:ok&&cc.total>0?"var(--green)":cc.total>0?"var(--amber)":"var(--t3)"}}>{cc.total||"—"}</div>
                      <div style={{fontSize:9,color:"var(--t4)"}}>/ {cc.meta}</div>
                    </td>
                  );
                })}
                <td/>
              </tr>
              {/* Linha de TOTAL MÊS */}
              <tr style={{background:"var(--surf)",borderTop:"2px solid var(--b2)"}}>
                <td style={{padding:"8px 14px",fontWeight:700,fontSize:12,color:"var(--purple)"}}>📅 TOTAL MÊS</td>
                {totalMes.map(cc=>{
                  const ok = cc.meta===0||cc.total>=cc.meta;
                  return (
                    <td key={cc.k} style={{padding:"8px 6px",textAlign:"center"}}>
                      <div style={{fontFamily:"'Geist Mono',monospace",fontSize:13,fontWeight:700,color:ok&&cc.total>0?"var(--green)":cc.total>0?"var(--amber)":"var(--t3)"}}>{cc.total||"—"}</div>
                      <div style={{fontSize:9,color:"var(--t4)"}}>/ {cc.meta}</div>
                    </td>
                  );
                })}
                <td/>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ── TAXAS CALCULADAS POR VENDEDOR ── */}
      {sellerList.length>0 && (
        <div>
          <div style={{fontSize:13.5,fontWeight:700,color:"var(--t1)",marginBottom:12}}>📐 Taxas de Conversão — Calculadas Automaticamente</div>
          <div style={{background:"var(--surf)",border:"1px solid var(--b1)",borderRadius:"var(--rlg)",overflow:"hidden",boxShadow:"var(--sh)"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr style={{background:"var(--bg3)"}}>
                  <th style={{padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:"var(--t3)",textTransform:"uppercase",borderBottom:"1px solid var(--b1)"}}>Vendedor</th>
                  <th style={{padding:"10px 12px",textAlign:"center",fontSize:10.5,fontWeight:700,color:"var(--t3)",borderBottom:"1px solid var(--b1)"}}>Conversão<br/><span style={{fontSize:9,fontWeight:400}}>Fech ÷ Nº × 100</span><br/><span style={{fontSize:9,color:"var(--gold)"}}>Meta: 5%</span></th>
                  <th style={{padding:"10px 12px",textAlign:"center",fontSize:10.5,fontWeight:700,color:"var(--t3)",borderBottom:"1px solid var(--b1)"}}>Produtividade<br/><span style={{fontSize:9,fontWeight:400}}>Atend ÷ Disc × 100</span><br/><span style={{fontSize:9,color:"var(--gold)"}}>Meta: 40%</span></th>
                  <th style={{padding:"10px 12px",textAlign:"center",fontSize:10.5,fontWeight:700,color:"var(--t3)",borderBottom:"1px solid var(--b1)"}}>Aproveitamento<br/><span style={{fontSize:9,fontWeight:400}}>Agend ÷ Atend × 100</span><br/><span style={{fontSize:9,color:"var(--gold)"}}>Meta: 20%</span></th>
                  <th style={{padding:"10px 12px",textAlign:"center",fontSize:10.5,fontWeight:700,color:"var(--t3)",borderBottom:"1px solid var(--b1)"}}>Taxa Fechamento<br/><span style={{fontSize:9,fontWeight:400}}>Fech ÷ Visitas × 100</span><br/><span style={{fontSize:9,color:"var(--gold)"}}>Meta: 50%</span></th>
                </tr>
              </thead>
              <tbody>
                {sellerList.map((s,i)=>{
                  const metrics = calcMetrics(s.id);
                  return (
                    <tr key={s.id} style={{background:i%2===0?"transparent":"var(--bg3)"}}>
                      <td style={{padding:"11px 14px",borderBottom:"1px solid var(--b1)"}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div style={{width:26,height:26,borderRadius:"50%",background:s.cor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:"var(--bg)"}}>{inits(s.nome)}</div>
                          <span style={{fontWeight:600,fontSize:13,color:"var(--t1)"}}>{s.nome.split(" ")[0]}</span>
                        </div>
                      </td>
                      {metrics.map((m,mi)=>(
                        <td key={mi} style={{padding:"11px 12px",textAlign:"center",borderBottom:"1px solid var(--b1)"}}>
                          <div style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:700,color:m.c}}>{m.val}</div>
                          <div style={{fontSize:10,color:"var(--t4)"}}>meta {m.meta}</div>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   META DIÁRIA
══════════════════════════════════════════ */
function MetaDiariaPage({sellers, user}) {
  // Metas diárias fixas extraídas da planilha operacional
  const METAS_FIXAS = {
    anuncios:     20,
    numeros:      10,
    retornos:     15,
    discadas:     30,
    atendidas:    12,
    agendamentos: 2,
    visitas:      1,
    fechamentos:  1,
  };

  // Admin/supervisor pode ajustar as metas fixas
  const [metas, setMetas] = useStored("crm2_metas_diarias", METAS_FIXAS);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({...METAS_FIXAS});

  // Dados de produção do dia (lidos da ProducaoPage via localStorage key compartilhado)
  // Como não temos acesso direto, usamos estado local compartilhado via window
  const [prod,,] = useStored("crm2_producao", {});
  const dia = hojeISO();

  const getVal = (sid, campo) => {
    const key = `${dia}_${sid}`;
    return Number(prod[key]?.[campo]||0);
  };

  const hoje2 = new Date().toLocaleDateString("pt-BR");

  const CAMPOS_LABELS = {
    anuncios:"📢 Anúncios", numeros:"📋 Números", retornos:"🔄 Retornos",
    discadas:"📞 Discadas", atendidas:"✅ Atendidas", agendamentos:"📅 Agendamentos",
    visitas:"🚶 Visitas", fechamentos:"🏆 Fechamentos"
  };

  const barColor = p => p>=100?"var(--green)":p>=60?"var(--gold)":"var(--red)";

  const sellerList = isVendedor(user.role)
    ? sellers.filter(s=>s.nome.toLowerCase().includes((user.nome||"").toLowerCase().split(" ")[0].toLowerCase()))
    : sellers;

  return (
    <div>
      <div className="ph">
        <div className="ph-row">
          <div>
            <h1>Meta <em>Diária</em></h1>
            <p>Progresso individual · {hoje2} · Metas operacionais da planilha</p>
          </div>
          {isSupervisor(user.role) && (
            <button className="tbtn tbtn-gold" onClick={()=>{setEditForm({...metas});setEditOpen(true);}}>
              <Svg d={IC.edit} size={14}/> Ajustar Metas
            </button>
          )}
        </div>
      </div>

      {/* Resumo das metas fixas */}
      <div style={{background:"var(--surf)",border:"1px solid var(--b1)",borderRadius:"var(--rlg)",padding:"16px 20px",marginBottom:20,boxShadow:"var(--sh)"}}>
        <div style={{fontSize:12.5,fontWeight:700,color:"var(--t2)",marginBottom:10}}>📋 Metas Diárias Fixas da Equipe</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
          {Object.entries(CAMPOS_LABELS).map(([k,l])=>(
            <div key={k} style={{background:"var(--bg3)",borderRadius:"var(--rsm)",padding:"9px 10px",display:"flex",justifyContent:"space-between",alignItems:"center",border:"1px solid var(--b1)"}}>
              <span style={{fontSize:11.5,color:"var(--t2)"}}>{l}</span>
              <span style={{fontFamily:"'Fraunces',serif",fontSize:15,fontWeight:700,color:"var(--gold2)"}}>{metas[k]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Progresso por vendedor */}
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {sellerList.map(s=>{
          const items = Object.keys(metas).map(k=>{
            const atual = getVal(s.id,k);
            const meta  = metas[k]||1;
            const p     = Math.min(100,Math.round(atual/meta*100));
            return {k, label:CAMPOS_LABELS[k], atual, meta, p};
          });
          const mediaGeral = Math.round(items.reduce((a,i)=>a+i.p,0)/items.length);
          const metaBatida = mediaGeral>=100;

          return (
            <div key={s.id} style={{background:"var(--surf)",border:`1px solid ${metaBatida?"rgba(201,168,76,.3)":"var(--b1)"}`,borderRadius:"var(--rlg)",padding:20,boxShadow:"var(--sh)",transition:"border-color .2s"}}>
              {/* Header */}
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <div style={{width:44,height:44,borderRadius:"50%",background:s.cor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:"var(--bg)",flexShrink:0,border:metaBatida?"2px solid var(--gold)":"none",boxShadow:metaBatida?"0 0 12px rgba(201,168,76,.4)":"none"}}>{inits(s.nome)}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:14,color:"var(--t1)"}}>{s.nome}</div>
                  <div style={{fontSize:12,color:"var(--t3)"}}>{s.cargo}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"'Fraunces',serif",fontSize:24,fontWeight:700,color:barColor(mediaGeral)}}>{mediaGeral}%</div>
                  <div style={{fontSize:11,color:"var(--t3)"}}>média geral</div>
                </div>
              </div>

              {/* Barra geral */}
              <div className="prog" style={{height:10,marginBottom:14}}>
                <div className="prog-fill" style={{width:`${mediaGeral}%`,background:metaBatida?"var(--gold)":barColor(mediaGeral),transition:"width .8s var(--spring)"}}/>
              </div>

              {/* Grid de indicadores */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                {items.map(item=>(
                  <div key={item.k} style={{background:"var(--bg3)",borderRadius:"var(--rsm)",padding:"10px",border:`1px solid ${item.p>=100?"rgba(34,197,94,.25)":item.p>=60?"rgba(245,158,11,.2)":"var(--b1)"}`}}>
                    <div style={{fontSize:10,color:"var(--t3)",fontWeight:600,textTransform:"uppercase",marginBottom:4,letterSpacing:".04em"}}>{item.label}</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:5}}>
                      <span style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:700,color:barColor(item.p)}}>{item.atual}</span>
                      <span style={{fontSize:11,color:"var(--t4)"}}>/ {item.meta}</span>
                    </div>
                    <div style={{height:4,background:"var(--bg4)",borderRadius:2,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${item.p}%`,background:barColor(item.p),borderRadius:2,transition:"width .6s"}}/>
                    </div>
                  </div>
                ))}
              </div>

              {metaBatida && (
                <div style={{marginTop:12,padding:"8px 14px",background:"var(--gdim)",border:"1px solid rgba(201,168,76,.3)",borderRadius:"var(--rsm)",fontSize:13,color:"var(--gold2)",fontWeight:700,textAlign:"center"}}>
                  🎉 Meta do dia atingida!
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Nota sobre preenchimento */}
      <div style={{marginTop:16,padding:"10px 14px",background:"var(--bdim)",border:"1px solid rgba(59,130,246,.2)",borderRadius:"var(--rsm)",fontSize:12,color:"var(--blue)"}}>
        💡 Preencha os dados diários na aba <b>Produção</b> para o progresso atualizar automaticamente aqui.
      </div>

      {/* Modal ajustar metas */}
      {editOpen && (
        <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setEditOpen(false)}>
          <div className="modal modal-lg" onClick={e=>e.stopPropagation()}>
            <div className="m-title">✏️ Ajustar Metas Diárias</div>
            <div className="m-sub">Defina as metas operacionais fixas da equipe</div>
            <div className="fg">
              {Object.entries(CAMPOS_LABELS).map(([k,l])=>(
                <div className="fgroup" key={k}>
                  <div className="flbl">{l}</div>
                  <input className="finp" type="number" min="0"
                    value={editForm[k]||""}
                    onChange={e=>setEditForm(p=>({...p,[k]:Number(e.target.value)}))}
                  />
                </div>
              ))}
            </div>
            <div className="m-foot">
              <button className="btn-c" onClick={()=>setEditOpen(false)}>Cancelar</button>
              <button className="btn-s" onClick={()=>{setMetas({...editForm});setEditOpen(false);}}>Salvar Metas</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   RANKING
══════════════════════════════════════════ */
function RankingPage({sellers, fechamentos, user}) {
  const [periodo, setPeriodo] = useState("mensal");

  // Para seleção customizada de semana e mês
  const [semanaRef, setSemanaRef] = useState(hojeISO()); // qualquer dia da semana desejada
  const [mesRef,    setMesRef]    = useState(hojeISO()); // qualquer dia do mês desejado
  const [calSemana, setCalSemana] = useState(false);
  const [calMes,    setCalMes]    = useState(false);
  const [calNavS,   setCalNavS]   = useState(()=>{const d=new Date();return{y:d.getFullYear(),m:d.getMonth()}});
  const [calNavM,   setCalNavM]   = useState(()=>{const d=new Date();return{y:d.getFullYear(),m:d.getMonth()}});

  const MESES_PT2 = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  const MESES_FULL = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  const SEMANAS2 = ["D","S","T","Q","Q","S","S"];

  // Converte "DD/MM/AAAA" para Date
  const parseData = (str) => {
    if (!str) return null;
    const p = str.split("/");
    if (p.length===3) return new Date(Number(p[2]), Number(p[1])-1, Number(p[0]));
    return null;
  };

  // ISO -> Date
  const isoToDate = iso => new Date(iso+"T12:00:00");

  // Datas da semana (seg a sab) que contém semanaRef
  const getDiasSemana = (isoRef) => {
    const d = isoToDate(isoRef);
    const dow = d.getDay(); // 0=dom
    const seg = new Date(d); seg.setDate(d.getDate() - (dow===0?6:dow-1));
    const dias = [];
    for (let i=0;i<6;i++) {
      const dx = new Date(seg); dx.setDate(seg.getDate()+i);
      dias.push(dx.toLocaleDateString("pt-BR"));
    }
    return dias;
  };

  // Label legível do período selecionado
  const periodoLabel = () => {
    const hoje3 = new Date().toLocaleDateString("pt-BR");
    if (periodo==="diario")  return "Hoje — "+hoje3;
    if (periodo==="semanal") {
      const dias = getDiasSemana(semanaRef);
      return `Semana: ${dias[0]} a ${dias[dias.length-1]}`;
    }
    const [y,,] = mesRef.split("-").map(Number);
    const m2 = Number(mesRef.split("-")[1])-1;
    return `${MESES_FULL[m2]} de ${y}`;
  };

  // Filtra fechamentos pelo período
  const getFechs = (s) => {
    const hoje3 = new Date().toLocaleDateString("pt-BR");
    if (periodo==="diario") {
      return fechamentos.filter(f=>f.vendedorId===s.id && f.data===hoje3);
    }
    if (periodo==="semanal") {
      const diasSem = getDiasSemana(semanaRef);
      return fechamentos.filter(f=>f.vendedorId===s.id && diasSem.includes(f.data||""));
    }
    // mensal: mesmo mês e ano de mesRef
    const [yRef, mRef] = mesRef.split("-").map(Number);
    return fechamentos.filter(f=>{
      if (f.vendedorId!==s.id) return false;
      const d = parseData(f.data);
      if (!d) return false;
      return d.getFullYear()===yRef && d.getMonth()===(mRef-1);
    });
  };

  const sorted = [...sellers].map(s=>{
    const fs = getFechs(s);
    return {
      ...s,
      vendas:   fs.length,
      receita:  fs.reduce((a,f)=>a+f.valor,0),
      comissao: fs.reduce((a,f)=>a+f.comissao,0),
    };
  }).sort((a,b)=>b.receita-a.receita);

  const medals = ["🥇","🥈","🥉","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];

  // Gera dias do calendário
  const getDiasCalMes = (y,m) => {
    const primeiro = new Date(y,m,1).getDay();
    const total    = new Date(y,m+1,0).getDate();
    const dias = [];
    for(let i=0;i<primeiro;i++) dias.push(null);
    for(let d=1;d<=total;d++) dias.push(d);
    return dias;
  };

  const btnPeriodo = (id, label) => (
    <button key={id} onClick={()=>setPeriodo(id)}
      style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${periodo===id?"var(--gold)":"var(--b2)"}`,background:periodo===id?"var(--gdim)":"var(--bg4)",color:periodo===id?"var(--gold2)":"var(--t2)",cursor:"pointer",fontFamily:"'Geist',sans-serif",fontSize:12,fontWeight:600,transition:"all .15s"}}
    >{label}</button>
  );

  return (
    <div>
      {/* Fechar calendários ao clicar fora */}
      {(calSemana||calMes) && <div onClick={()=>{setCalSemana(false);setCalMes(false);}} style={{position:"fixed",inset:0,zIndex:199}}/>}

      <div className="ph">
        <div className="ph-row" style={{flexWrap:"wrap",gap:12}}>
          <div>
            <h1><em>Ranking</em> da Equipe</h1>
            <p style={{fontSize:12}}>{periodoLabel()}</p>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
            {btnPeriodo("diario","Hoje")}
            {btnPeriodo("semanal","Semana")}
            {btnPeriodo("mensal","Mês")}

            {/* Seletor de semana */}
            {periodo==="semanal" && (
              <div style={{position:"relative"}}>
                <button onClick={()=>{setCalSemana(o=>!o);setCalMes(false);}}
                  style={{padding:"6px 12px",borderRadius:20,border:`1px solid ${calSemana?"var(--gold)":"var(--b2)"}`,background:calSemana?"var(--gdim)":"var(--bg4)",color:calSemana?"var(--gold2)":"var(--t2)",cursor:"pointer",fontFamily:"'Geist',sans-serif",fontSize:11,fontWeight:600,display:"flex",alignItems:"center",gap:5}}
                >📅 Escolher semana ▼</button>
                {calSemana && (
                  <div style={{position:"absolute",right:0,top:"calc(100% + 6px)",background:"var(--bg3)",border:"1px solid var(--b2)",borderRadius:"var(--rlg)",boxShadow:"var(--shlg)",zIndex:200,width:260,padding:14}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                      <button onClick={()=>setCalNavS(n=>n.m===0?{y:n.y-1,m:11}:{y:n.y,m:n.m-1})} style={{padding:"3px 8px",border:"none",background:"var(--bg4)",color:"var(--t1)",cursor:"pointer",borderRadius:6,fontSize:14}}>‹</button>
                      <span style={{fontWeight:700,fontSize:12,color:"var(--t1)"}}>{MESES_FULL[calNavS.m]} {calNavS.y}</span>
                      <button onClick={()=>setCalNavS(n=>n.m===11?{y:n.y+1,m:0}:{y:n.y,m:n.m+1})} style={{padding:"3px 8px",border:"none",background:"var(--bg4)",color:"var(--t1)",cursor:"pointer",borderRadius:6,fontSize:14}}>›</button>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1,marginBottom:3}}>
                      {SEMANAS2.map((s,i)=><div key={i} style={{textAlign:"center",fontSize:9,fontWeight:700,color:"var(--t3)",padding:"2px 0"}}>{s}</div>)}
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1}}>
                      {getDiasCalMes(calNavS.y,calNavS.m).map((d,i)=>{
                        if (!d) return <div key={i}/>;
                        const iso = `${calNavS.y}-${String(calNavS.m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
                        const semDias = getDiasSemana(semanaRef);
                        const fmtDia = isoToDate(iso).toLocaleDateString("pt-BR");
                        const naSem = semDias.includes(fmtDia);
                        return (
                          <button key={i} onClick={()=>{setSemanaRef(iso);setCalSemana(false);}}
                            style={{padding:"5px 2px",borderRadius:4,border:"none",background:naSem?"var(--gdim)":"transparent",color:naSem?"var(--gold2)":"var(--t2)",cursor:"pointer",fontSize:11,fontWeight:naSem?700:400,transition:"all .1s"}}
                          >{d}</button>
                        );
                      })}
                    </div>
                    <div style={{borderTop:"1px solid var(--b1)",marginTop:8,paddingTop:8,display:"flex",gap:5}}>
                      <button onClick={()=>{setSemanaRef(hojeISO());setCalSemana(false);}} style={{flex:1,padding:"4px",borderRadius:6,border:"1px solid var(--b2)",background:"var(--bg4)",color:"var(--t2)",cursor:"pointer",fontSize:10,fontFamily:"'Geist',sans-serif",fontWeight:600}}>Esta semana</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Seletor de mês */}
            {periodo==="mensal" && (
              <div style={{position:"relative"}}>
                <button onClick={()=>{setCalMes(o=>!o);setCalSemana(false);}}
                  style={{padding:"6px 12px",borderRadius:20,border:`1px solid ${calMes?"var(--gold)":"var(--b2)"}`,background:calMes?"var(--gdim)":"var(--bg4)",color:calMes?"var(--gold2)":"var(--t2)",cursor:"pointer",fontFamily:"'Geist',sans-serif",fontSize:11,fontWeight:600,display:"flex",alignItems:"center",gap:5}}
                >📅 Escolher mês ▼</button>
                {calMes && (
                  <div style={{position:"absolute",right:0,top:"calc(100% + 6px)",background:"var(--bg3)",border:"1px solid var(--b2)",borderRadius:"var(--rlg)",boxShadow:"var(--shlg)",zIndex:200,width:220,padding:14}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                      <button onClick={()=>setCalNavM(n=>({...n,y:n.y-1}))} style={{padding:"3px 8px",border:"none",background:"var(--bg4)",color:"var(--t1)",cursor:"pointer",borderRadius:6,fontSize:14}}>‹</button>
                      <span style={{fontWeight:700,fontSize:13,color:"var(--t1)"}}>{calNavM.y}</span>
                      <button onClick={()=>setCalNavM(n=>({...n,y:n.y+1}))} style={{padding:"3px 8px",border:"none",background:"var(--bg4)",color:"var(--t1)",cursor:"pointer",borderRadius:6,fontSize:14}}>›</button>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
                      {MESES_PT2.map((m2,i)=>{
                        const iso = `${calNavM.y}-${String(i+1).padStart(2,"0")}-01`;
                        const [yRef,mRef] = mesRef.split("-").map(Number);
                        const sel = yRef===calNavM.y && (mRef-1)===i;
                        return (
                          <button key={i} onClick={()=>{setMesRef(iso);setCalMes(false);}}
                            style={{padding:"8px 4px",borderRadius:6,border:`1px solid ${sel?"var(--gold)":"var(--b2)"}`,background:sel?"var(--gdim)":"var(--bg4)",color:sel?"var(--gold2)":"var(--t2)",cursor:"pointer",fontSize:11,fontWeight:sel?700:500,fontFamily:"'Geist',sans-serif",transition:"all .15s"}}
                          >{m2}</button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pódio top 3 */}
      {sorted.filter(s=>s.receita>0).length>=2 && (
        <div style={{display:"flex",justifyContent:"center",alignItems:"flex-end",gap:16,marginBottom:28,padding:"20px 0"}}>
          {(sorted.filter(s=>s.receita>0).length>=3
            ? [sorted[1],sorted[0],sorted[2]]
            : [sorted[0],sorted[1]]
          ).map((s,i)=>{
            const isFirst = sorted.filter(x=>x.receita>0).length>=3 ? i===1 : i===0;
            const h = isFirst?110:80;
            const medal = isFirst?"🥇":sorted.filter(x=>x.receita>0).length>=3&&i===0?"🥈":"🥉";
            return (
              <div key={s.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                <div style={{fontSize:isFirst?26:18}}>{medal}</div>
                <div style={{width:isFirst?56:44,height:isFirst?56:44,borderRadius:"50%",background:s.cor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:isFirst?18:13,fontWeight:800,color:"var(--bg)",border:`3px solid ${isFirst?"var(--gold)":"var(--b2)"}`,boxShadow:isFirst?"0 0 18px rgba(201,168,76,.4)":"none"}}>{inits(s.nome)}</div>
                <div style={{fontWeight:700,fontSize:isFirst?13:11,color:"var(--t1)",textAlign:"center",maxWidth:80}}>{s.nome.split(" ")[0]}</div>
                <div style={{fontFamily:"'Fraunces',serif",fontSize:isFirst?16:13,fontWeight:700,color:"var(--gold2)"}}>{brl(s.receita)}</div>
                <div style={{width:isFirst?84:64,height:h,background:`linear-gradient(180deg,${s.cor}44,${s.cor}22)`,border:`1px solid ${s.cor}44`,borderRadius:"var(--rsm) var(--rsm) 0 0",display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:8}}>
                  <span style={{fontSize:10,fontWeight:700,color:s.cor}}>{s.vendas} venda{s.vendas!==1?"s":""}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lista completa */}
      <div className="tbl-wrap">
        {sorted.map((s,i)=>(
          <div key={s.id} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 20px",borderBottom:"1px solid var(--b1)",transition:"background .1s",opacity:s.receita===0?.5:1}}
            onMouseEnter={e=>e.currentTarget.style.background="var(--bg3)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}
          >
            <div style={{fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:700,width:32,textAlign:"center",color:i===0?"var(--gold2)":i===1?"#9ca3af":i===2?"#cd7f32":"var(--t3)"}}>{medals[i]||`#${i+1}`}</div>
            <div style={{width:38,height:38,borderRadius:"50%",background:s.cor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"var(--bg)",flexShrink:0}}>{inits(s.nome)}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:13.5,color:"var(--t1)"}}>{s.nome}</div>
              <div style={{fontSize:12,color:"var(--t3)"}}>{s.cargo} · {s.vendas} venda{s.vendas!==1?"s":""}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:s.receita>0?"var(--gold2)":"var(--t3)"}}>{s.receita>0?brl(s.receita):"—"}</div>
              <div style={{fontSize:11,color:"var(--t3)"}}>{s.comissao>0?brl(s.comissao)+" comissão":""}</div>
            </div>
            <div style={{width:64,textAlign:"center"}}>
              <div style={{fontWeight:800,color:pct(s.receita,s.meta)>=100?"var(--green)":pct(s.receita,s.meta)>=60?"var(--gold)":"var(--red)",fontSize:13}}>{pct(s.receita,s.meta)}%</div>
              <div style={{fontSize:10,color:"var(--t3)"}}>da meta</div>
            </div>
          </div>
        ))}
        {sorted.every(s=>s.receita===0) && (
          <div className="empty"><div className="empty-ic">🏆</div><p>Nenhuma venda registrada para este período.</p></div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   AGENDA COMERCIAL
══════════════════════════════════════════ */
function AgendaPage({sellers, user}) {
  const [reunioes, setReunioes] = useState(D_REUNIOES);
  const [modal, setModal]       = useState(false);
  const [form,  setForm]        = useState({});
  const [filtDia, setFiltDia]   = useState(hojeISO());
  const up = k => e => setForm(p=>({...p,[k]:e.target.value}));

  const save = () => {
    if (!form.titulo?.trim()) { alert("Informe o título."); return; }
    const novo = {...form, id:uid(), status:form.status||"confirmada"};
    setReunioes(r=>[...r,novo]);
    setModal(false); setForm({});
  };

  const toggleStatus = id => setReunioes(r=>r.map(m=>m.id===id?{...m,status:m.status==="confirmada"?"pendente":"confirmada"}:m));
  const delR = id => setReunioes(r=>r.filter(m=>m.id!==id));

  const filtDiaFmt = new Date(filtDia+"T12:00:00").toLocaleDateString("pt-BR");
  const filtradas = reunioes.filter(r=>r.data===filtDiaFmt);
  const hours = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"];

  return (
    <div>
      <div className="ph">
        <div className="ph-row">
          <div><h1>Agenda <em>Comercial</em></h1><p>{filtradas.length} evento(s) para {filtDiaFmt}</p></div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <input type="date" value={filtDia} onChange={e=>setFiltDia(e.target.value)}
              style={{padding:"6px 10px",borderRadius:"var(--r)",border:"1px solid var(--b2)",background:"var(--bg4)",color:"var(--t1)",fontFamily:"'Geist',sans-serif",fontSize:13,outline:"none"}}/>
            <button className="tbtn tbtn-gold" onClick={()=>{setForm({data:filtDiaFmt,horario:"09:00",status:"confirmada",vendedor:sellers[0]?.nome||""});setModal(true);}}>
              <Svg d={IC.plus} size={14}/> Nova Reunião
            </button>
          </div>
        </div>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:4}}>
        {hours.map(h=>{
          const evento = filtradas.find(r=>r.horario===h);
          return (
            <div key={h} style={{display:"flex",gap:12,alignItems:"stretch",minHeight:48}}>
              <div style={{width:52,flexShrink:0,fontFamily:"'Geist Mono',monospace",fontSize:11.5,color:"var(--t3)",paddingTop:14,textAlign:"right"}}>{h}</div>
              <div style={{width:1,background:"var(--b1)",flexShrink:0,position:"relative"}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:evento?"var(--gold)":"var(--b2)",position:"absolute",top:12,left:-3}}/>
              </div>
              <div style={{flex:1,padding:"6px 0"}}>
                {evento ? (
                  <div style={{background:"var(--surf)",border:`1px solid ${evento.status==="confirmada"?"rgba(201,168,76,.3)":"var(--b2)"}`,borderLeft:`3px solid ${evento.status==="confirmada"?"var(--gold)":"var(--t3)"}`,borderRadius:"var(--rsm)",padding:"10px 14px",display:"flex",alignItems:"center",gap:12,boxShadow:"var(--sh)"}}>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:13.5,color:"var(--t1)",marginBottom:3}}>{evento.titulo}</div>
                      <div style={{fontSize:12,color:"var(--t3)",display:"flex",gap:12,flexWrap:"wrap"}}>
                        <span>👤 {evento.participantes}</span>
                        <span>📍 {evento.local}</span>
                        <span>🧑‍💼 {evento.vendedor}</span>
                      </div>
                    </div>
                    <span style={{padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:evento.status==="confirmada"?"var(--grdim)":"var(--adim)",color:evento.status==="confirmada"?"var(--green)":"var(--amber)"}}>{evento.status==="confirmada"?"✅ Confirmada":"⏳ Pendente"}</span>
                    <button onClick={()=>toggleStatus(evento.id)} className="ic-btn" style={{fontSize:12}}>🔄</button>
                    <button onClick={()=>delR(evento.id)} className="ic-btn red" style={{fontSize:12}}>✕</button>
                  </div>
                ) : (
                  <div style={{borderRadius:"var(--rsm)",height:36,border:"1px dashed var(--b1)",display:"flex",alignItems:"center",paddingLeft:12,cursor:"pointer",transition:"all .15s"}}
                    onClick={()=>{setForm({data:filtDiaFmt,horario:h,status:"confirmada",vendedor:sellers[0]?.nome||""});setModal(true);}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--gold)";e.currentTarget.style.background="var(--gdim)"}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--b1)";e.currentTarget.style.background="transparent"}}
                  >
                    <span style={{fontSize:11.5,color:"var(--t4)"}}>+ Adicionar evento</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="modal modal-lg" onClick={e=>e.stopPropagation()}>
            <div className="m-title">📅 Nova Reunião / Evento</div>
            <div className="m-sub" style={{marginBottom:16}}>Agende compromissos comerciais da equipe</div>
            <div className="fg">
              <div className="fgroup ff"><div className="flbl">Título *</div><input className="finp" value={form.titulo||""} onChange={up("titulo")} placeholder="Ex: Apresentação de Produto" autoFocus/></div>
              <div className="fgroup"><div className="flbl">Data</div><input className="finp" value={form.data||""} onChange={up("data")} placeholder="DD/MM/AAAA"/></div>
              <div className="fgroup"><div className="flbl">Horário</div><input className="finp" value={form.horario||""} onChange={up("horario")} placeholder="Ex: 14:00"/></div>
              <div className="fgroup"><div className="flbl">Participantes</div><input className="finp" value={form.participantes||""} onChange={up("participantes")} placeholder="Nome do cliente"/></div>
              <div className="fgroup"><div className="flbl">Local / Plataforma</div><input className="finp" value={form.local||""} onChange={up("local")} placeholder="Ex: Zoom, Presencial"/></div>
              <div className="fgroup"><div className="flbl">Vendedor Responsável</div><select className="fsel" value={form.vendedor||""} onChange={up("vendedor")}>{sellers.map(s=><option key={s.id}>{s.nome}</option>)}</select></div>
              <div className="fgroup"><div className="flbl">Status</div><select className="fsel" value={form.status||"confirmada"} onChange={up("status")}><option value="confirmada">✅ Confirmada</option><option value="pendente">⏳ Pendente</option></select></div>
            </div>
            <div className="m-foot">
              <button className="btn-c" onClick={()=>setModal(false)}>Cancelar</button>
              <button className="btn-s" onClick={save}>Salvar Evento</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   TAREFAS
══════════════════════════════════════════ */
function TarefasPage({sellers, user}) {
  const [tarefas, setTarefas] = useState(D_TAREFAS);
  const [modal,   setModal]   = useState(false);
  const [editId,  setEditId]  = useState(null); // null = nova, id = editar
  const [form,    setForm]    = useState({});
  const [filtro,  setFiltro]  = useState("todas");
  const up = k => e => setForm(p=>({...p,[k]:e.target.value}));

  const abrirNova = () => {
    setEditId(null);
    setForm({tipo:"ligacao",prioridade:"media",prazo:hoje(),responsavel:sellers[0]?.nome||""});
    setModal(true);
  };
  const abrirEdit = (t) => {
    setEditId(t.id);
    setForm({...t});
    setModal(true);
  };
  const save = () => {
    if (!form.titulo?.trim()) { alert("Informe o título."); return; }
    if (editId) {
      setTarefas(t=>t.map(x=>x.id===editId ? {...x,...form} : x));
    } else {
      setTarefas(t=>[...t,{...form,id:uid(),feita:false}]);
    }
    setModal(false); setForm({}); setEditId(null);
  };
  const toggle = id => setTarefas(t=>t.map(x=>x.id===id?{...x,feita:!x.feita}:x));
  const del    = id => setTarefas(t=>t.filter(x=>x.id!==id));

  const TIPOS = {ligacao:"📞",email:"📧",reuniao:"📅",visita:"🚶",outro:"📌"};
  const PRIOR  = {alta:{c:"var(--red)",l:"Alta"},media:{c:"var(--amber)",l:"Média"},baixa:{c:"var(--green)",l:"Baixa"}};

  const lista = tarefas.filter(t=>{
    if (filtro==="pendentes") return !t.feita;
    if (filtro==="concluidas") return t.feita;
    return true;
  });
  const pendentes = tarefas.filter(t=>!t.feita).length;

  return (
    <div>
      <div className="ph">
        <div className="ph-row">
          <div><h1><em>Tarefas</em></h1><p>{pendentes} pendente(s) · {tarefas.filter(t=>t.feita).length} concluída(s)</p></div>
          <button className="tbtn tbtn-gold" onClick={abrirNova}>
            <Svg d={IC.plus} size={14}/> Nova Tarefa
          </button>
        </div>
      </div>

      <div className="filters" style={{marginBottom:16}}>
        {["todas","pendentes","concluidas"].map(f=>(
          <button key={f} className={`sf${filtro===f?" on":""}`} onClick={()=>setFiltro(f)}>
            {f==="todas"?"Todas":f==="pendentes"?"Pendentes":"Concluídas"}
          </button>
        ))}
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {lista.length===0&&<div className="empty" style={{background:"var(--surf)",border:"1px solid var(--b1)",borderRadius:"var(--rlg)"}}><div className="empty-ic">✅</div><p>Nenhuma tarefa {filtro==="pendentes"?"pendente":filtro==="concluidas"?"concluída":"cadastrada"}.</p></div>}
        {lista.map(t=>{
          const pr = PRIOR[t.prioridade]||PRIOR.media;
          return (
            <div key={t.id} style={{background:"var(--surf)",border:"1px solid var(--b1)",borderRadius:"var(--r)",padding:"13px 16px",display:"flex",alignItems:"center",gap:12,opacity:t.feita?.6:1,boxShadow:"var(--sh)",transition:"all .15s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="var(--b2)"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="var(--b1)"}
            >
              <button onClick={()=>toggle(t.id)} style={{width:22,height:22,borderRadius:6,border:`2px solid ${t.feita?"var(--green)":"var(--b2)"}`,background:t.feita?"var(--green)":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s"}}>
                {t.feita&&<span style={{color:"#fff",fontSize:13}}>✓</span>}
              </button>
              <span style={{fontSize:18,flexShrink:0}}>{TIPOS[t.tipo]||"📌"}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,fontSize:13.5,color:t.feita?"var(--t3)":"var(--t1)",textDecoration:t.feita?"line-through":"none"}}>{t.titulo}</div>
                <div style={{fontSize:11.5,color:"var(--t3)",marginTop:2,display:"flex",gap:10,flexWrap:"wrap"}}>
                  <span>🧑‍💼 {t.responsavel}</span>
                  {t.prazo&&<span>📅 {t.prazo}</span>}
                </div>
              </div>
              <span style={{padding:"2px 9px",borderRadius:20,fontSize:11,fontWeight:700,background:`${pr.c}22`,color:pr.c,flexShrink:0}}>{pr.l}</span>
              <button onClick={()=>abrirEdit(t)} className="ic-btn" title="Editar tarefa" style={{fontSize:12}}>
                <Svg d={IC.edit} size={13}/>
              </button>
              <button onClick={()=>del(t.id)} className="ic-btn red" title="Excluir tarefa" style={{fontSize:13}}>✕</button>
            </div>
          );
        })}
      </div>

      {modal && (
        <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="m-title">{editId?"✏️ Editar Tarefa":"➕ Nova Tarefa"}</div>
            <div className="fg">
              <div className="fgroup ff"><div className="flbl">Título *</div><input className="finp" value={form.titulo||""} onChange={up("titulo")} placeholder="Descrição da tarefa" autoFocus/></div>
              <div className="fgroup"><div className="flbl">Tipo</div><select className="fsel" value={form.tipo||"ligacao"} onChange={up("tipo")}>{Object.entries(TIPOS).map(([k,v])=><option key={k} value={k}>{v} {k}</option>)}</select></div>
              <div className="fgroup"><div className="flbl">Prioridade</div><select className="fsel" value={form.prioridade||"media"} onChange={up("prioridade")}><option value="alta">🔴 Alta</option><option value="media">🟡 Média</option><option value="baixa">🟢 Baixa</option></select></div>
              <div className="fgroup"><div className="flbl">Prazo</div><input className="finp" value={form.prazo||""} onChange={up("prazo")} placeholder="DD/MM/AAAA"/></div>
              <div className="fgroup ff"><div className="flbl">Responsável</div><select className="fsel" value={form.responsavel||""} onChange={up("responsavel")}>{sellers.map(s=><option key={s.id}>{s.nome}</option>)}</select></div>
            </div>
            <div className="m-foot">
              <button className="btn-c" onClick={()=>{setModal(false);setEditId(null);}}>Cancelar</button>
              <button className="btn-s" onClick={save}>{editId?"Salvar Alterações":"Criar Tarefa"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   REUNIÕES
══════════════════════════════════════════ */
function ReunioesPage({sellers, user}) {
  const [reunioes, setReunioes] = useState(D_REUNIOES);
  const [modal,   setModal]    = useState(false);
  const [editId,  setEditId]   = useState(null);
  const [form,    setForm]     = useState({});
  const up = k => e => setForm(p=>({...p,[k]:e.target.value}));

  const STATUS_R = {confirmada:{c:"var(--green)",l:"✅ Confirmada"},pendente:{c:"var(--amber)",l:"⏳ Pendente"},realizada:{c:"var(--blue)",l:"🎯 Realizada"},cancelada:{c:"var(--red)",l:"❌ Cancelada"}};

  const abrirNova = () => {
    setEditId(null);
    setForm({status:"confirmada", vendedor:sellers[0]?.nome||"", data:hoje()});
    setModal(true);
  };
  const abrirEdit = (r) => {
    setEditId(r.id);
    setForm({...r});
    setModal(true);
  };
  const save = () => {
    if (!form.titulo?.trim()) { alert("Informe o título."); return; }
    if (editId) {
      setReunioes(r=>r.map(m=>m.id===editId ? {...m,...form} : m));
    } else {
      setReunioes(r=>[...r,{...form, id:uid(), status:form.status||"confirmada"}]);
    }
    setModal(false); setForm({}); setEditId(null);
  };
  const fechar = () => { setModal(false); setForm({}); setEditId(null); };
  const del    = id => setReunioes(r=>r.filter(m=>m.id!==id));
  const toggleS = id => setReunioes(r=>r.map(m=>m.id===id?{...m,status:m.status==="confirmada"?"realizada":m.status==="realizada"?"cancelada":"confirmada"}:m));

  return (
    <div>
      <div className="ph">
        <div className="ph-row">
          <div><h1><em>Reuniões</em></h1><p>{reunioes.length} reuniões · {reunioes.filter(r=>r.status==="confirmada").length} confirmadas</p></div>
          <button className="tbtn tbtn-gold" onClick={abrirNova}>
            <Svg d={IC.plus} size={14}/> Nova Reunião
          </button>
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {reunioes.map(r=>{
          const sr = STATUS_R[r.status]||STATUS_R.confirmada;
          return (
            <div key={r.id} style={{background:"var(--surf)",border:"1px solid var(--b1)",borderRadius:"var(--rlg)",padding:"16px 20px",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap",boxShadow:"var(--sh)"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="var(--b2)"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="var(--b1)"}
            >
              <div style={{width:44,height:44,borderRadius:10,background:`${sr.c}22`,border:`1px solid ${sr.c}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🤝</div>
              <div style={{flex:1,minWidth:160}}>
                <div style={{fontWeight:700,fontSize:14,color:"var(--t1)",marginBottom:4}}>{r.titulo}</div>
                <div style={{display:"flex",gap:12,fontSize:12,color:"var(--t3)",flexWrap:"wrap"}}>
                  <span>📅 {r.data} às {r.horario}</span>
                  <span>👤 {r.participantes}</span>
                  <span>📍 {r.local}</span>
                  <span>🧑‍💼 {r.vendedor}</span>
                </div>
                {r.notas && <div style={{fontSize:12,color:"var(--t3)",marginTop:5,fontStyle:"italic",borderTop:"1px solid var(--b1)",paddingTop:5}}>📝 {r.notas}</div>}
              </div>
              <button onClick={()=>toggleS(r.id)} style={{padding:"4px 12px",borderRadius:20,border:`1px solid ${sr.c}44`,background:`${sr.c}22`,color:sr.c,cursor:"pointer",fontFamily:"'Geist',sans-serif",fontSize:11.5,fontWeight:700,flexShrink:0}}>{sr.l}</button>
              <button onClick={()=>abrirEdit(r)} className="ic-btn" title="Editar reunião">
                <Svg d={IC.edit} size={13}/>
              </button>
              <button onClick={()=>del(r.id)} className="ic-btn red" title="Excluir reunião">✕</button>
            </div>
          );
        })}
        {reunioes.length===0&&<div className="empty" style={{background:"var(--surf)",border:"1px solid var(--b1)",borderRadius:"var(--rlg)"}}><div className="empty-ic">🤝</div><p>Nenhuma reunião cadastrada.</p></div>}
      </div>
      {modal && (
        <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&fechar()}>
          <div className="modal modal-lg" onClick={e=>e.stopPropagation()}>
            <div className="m-title">{editId?"✏️ Editar Reunião":"🤝 Nova Reunião"}</div>
            <div className="fg">
              <div className="fgroup ff"><div className="flbl">Título *</div><input className="finp" value={form.titulo||""} onChange={up("titulo")} placeholder="Assunto da reunião" autoFocus/></div>
              <div className="fgroup"><div className="flbl">Data</div><input className="finp" value={form.data||""} onChange={up("data")} placeholder="DD/MM/AAAA"/></div>
              <div className="fgroup"><div className="flbl">Horário</div><input className="finp" value={form.horario||""} onChange={up("horario")} placeholder="HH:MM"/></div>
              <div className="fgroup"><div className="flbl">Participantes</div><input className="finp" value={form.participantes||""} onChange={up("participantes")} placeholder="Nomes dos participantes"/></div>
              <div className="fgroup"><div className="flbl">Local / Plataforma</div><input className="finp" value={form.local||""} onChange={up("local")} placeholder="Zoom, Meet, Presencial…"/></div>
              <div className="fgroup"><div className="flbl">Vendedor</div><select className="fsel" value={form.vendedor||""} onChange={up("vendedor")}>{sellers.map(s=><option key={s.id}>{s.nome}</option>)}</select></div>
              <div className="fgroup"><div className="flbl">Status</div><select className="fsel" value={form.status||"confirmada"} onChange={up("status")}>{Object.entries(STATUS_R).map(([k,v])=><option key={k} value={k}>{v.l}</option>)}</select></div>
              <div className="fgroup ff"><div className="flbl">Notas / Observações</div><textarea className="fta" value={form.notas||""} onChange={up("notas")} placeholder="Pautas, objetivos, pontos importantes da reunião…" style={{minHeight:90}}/></div>
            </div>
            <div className="m-foot">
              <button className="btn-c" onClick={fechar}>Cancelar</button>
              <button className="btn-s" onClick={save}>{editId?"Salvar Alterações":"Salvar Reunião"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   CENTRAL DE INDICADORES
══════════════════════════════════════════ */
function IndicadoresPage({leads, fechamentos, sellers}) {
  const totalLeads   = leads.length;
  const totalFechs   = fechamentos.length;
  const fechados     = leads.filter(l=>l.status==="fechado").length;
  const perdidos     = leads.filter(l=>l.status==="perdido").length;
  const negociando   = leads.filter(l=>l.status==="negociacao").length;
  const totalReceit  = fechamentos.reduce((s,f)=>s+f.valor,0);
  const totalComm    = fechamentos.reduce((s,f)=>s+f.comissao,0);
  const taxaConv     = totalLeads>0?((fechados/totalLeads)*100).toFixed(1):0;
  const ticketMedio  = totalFechs>0?totalReceit/totalFechs:0;
  const taxaPerda    = totalLeads>0?((perdidos/totalLeads)*100).toFixed(1):0;

  const byOrigem = ["Instagram","WhatsApp","Indicação","Site","Google Ads","Facebook","YouTube","Outro"]
    .map(o=>({o, n:leads.filter(l=>l.origem===o).length})).filter(x=>x.n>0)
    .sort((a,b)=>b.n-a.n);
  const maxOrig = Math.max(...byOrigem.map(x=>x.n),1);

  const kpis = [
    {lbl:"Total Leads",      val:totalLeads,            s:"#3b82f6", ic:"👥"},
    {lbl:"Fechamentos",      val:totalFechs,             s:"#22c55e", ic:"✅"},
    {lbl:"Taxa de Conversão",val:taxaConv+"%",           s:"#c9a84c", ic:"🎯"},
    {lbl:"Ticket Médio",     val:brl(ticketMedio),       s:"#a855f7", ic:"💰"},
    {lbl:"Total em Vendas",  val:brl(totalReceit),       s:"#c9a84c", ic:"📊"},
    {lbl:"Total Comissões",  val:brl(totalComm),         s:"#22c55e", ic:"💎"},
    {lbl:"Taxa de Perda",    val:taxaPerda+"%",          s:"#ef4444", ic:"❌"},
    {lbl:"Em Negociação",    val:negociando,             s:"#14b8a6", ic:"🤝"},
  ];

  const sellerPerf = [...sellers].map(s=>{
    const fs = fechamentos.filter(f=>f.vendedorId===s.id);
    return {...s, vendas:fs.length, receita:fs.reduce((a,f)=>a+f.valor,0), comm:fs.reduce((a,f)=>a+f.comissao,0)};
  }).sort((a,b)=>b.receita-a.receita);
  const maxReceita = Math.max(...sellerPerf.map(s=>s.receita),1);

  return (
    <div>
      <div className="ph"><h1>Central de <em>Indicadores</em></h1><p>Performance geral da operação comercial</p></div>

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:13,marginBottom:22}}>
        {kpis.map((k,i)=>(
          <div key={i} className="kpi">
            <div className="kpi-bar" style={{background:k.s}}/>
            <div className="kpi-em">{k.ic}</div>
            <div className="kpi-lbl">{k.lbl}</div>
            <div className="kpi-val" style={{fontSize:22}}>{k.val}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:18}}>
        {/* Funil */}
        <div className="card">
          <div className="c-hd"><div className="c-title">🎯 Funil de Conversão</div></div>
          <div className="c-body">
            {[
              {l:"Total de Leads",  n:totalLeads,  c:"#3b82f6", pct:100},
              {l:"Qualificados",    n:leads.filter(l=>l.status==="qualificado"||l.status==="agendado").length, c:"#a855f7", pct:totalLeads>0?Math.round(leads.filter(l=>["qualificado","agendado"].includes(l.status)).length/totalLeads*100):0},
              {l:"Em Negociação",   n:negociando,  c:"#14b8a6", pct:totalLeads>0?Math.round(negociando/totalLeads*100):0},
              {l:"Fechados",        n:fechados,    c:"#22c55e", pct:totalLeads>0?Math.round(fechados/totalLeads*100):0},
              {l:"Perdidos",        n:perdidos,    c:"#ef4444", pct:totalLeads>0?Math.round(perdidos/totalLeads*100):0},
            ].map((item,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:90,fontSize:11.5,color:"var(--t2)",textAlign:"right",flexShrink:0}}>{item.l}</div>
                <div style={{flex:1,height:28,background:"var(--bg4)",borderRadius:6,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${item.pct}%`,background:item.c,borderRadius:6,display:"flex",alignItems:"center",paddingLeft:8,transition:"width .7s var(--spring)"}}>
                    {item.pct>15&&<span style={{fontSize:11,fontWeight:700,color:"#fff"}}>{item.pct}%</span>}
                  </div>
                </div>
                <div style={{width:28,fontWeight:700,fontSize:13,color:"var(--t1)"}}>{item.n}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Leads por origem */}
        <div className="card">
          <div className="c-hd"><div className="c-title">🔗 Leads por Origem</div></div>
          <div className="c-body">
            {byOrigem.length===0&&<div style={{color:"var(--t3)",fontSize:13}}>Nenhum lead cadastrado.</div>}
            {byOrigem.map((item,i)=>(
              <div key={i} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12.5,marginBottom:4}}>
                  <span style={{color:"var(--t2)"}}>{item.o}</span>
                  <span style={{fontWeight:700,color:"var(--t1)"}}>{item.n} ({totalLeads>0?Math.round(item.n/totalLeads*100):0}%)</span>
                </div>
                <div className="prog" style={{height:6}}>
                  <div className="prog-fill" style={{width:`${item.n/maxOrig*100}%`,background:"var(--gold)"}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance por vendedor — gráfico de barras */}
      <div className="card">
        <div className="c-hd"><div className="c-title">📊 Performance por Vendedor</div><div className="c-sub">Receita acumulada vs meta</div></div>
        <div className="c-body">
          {sellerPerf.map(s=>{
            const p2 = pct(s.receita,s.meta);
            const c  = p2>=100?"var(--green)":p2>=60?"var(--gold)":"var(--red)";
            return (
              <div key={s.id} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:5,flexWrap:"wrap",gap:4}}>
                  <span style={{display:"flex",alignItems:"center",gap:7,fontWeight:600,color:"var(--t1)"}}>
                    <span style={{width:22,height:22,borderRadius:"50%",background:s.cor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,color:"var(--bg)"}}>{inits(s.nome)}</span>
                    {s.nome}
                  </span>
                  <div style={{display:"flex",gap:12,fontSize:12}}>
                    <span style={{color:"var(--gold2)",fontFamily:"'Geist Mono',monospace",fontWeight:700}}>{brl(s.receita)}</span>
                    <span style={{color:"var(--green)",fontFamily:"'Geist Mono',monospace"}}>{brl(s.comm)} comissão</span>
                    <span style={{color:c,fontWeight:800}}>{p2}%</span>
                  </div>
                </div>
                <div className="prog" style={{height:8}}>
                  <div className="prog-fill" style={{width:`${pct(s.receita,Math.max(maxReceita,1))*100/100}%`,background:s.cor,transition:"width .8s var(--spring)"}}/>
                </div>
              </div>
            );
          })}
          {sellerPerf.length===0&&<div style={{color:"var(--t3)",fontSize:13}}>Nenhum vendedor cadastrado.</div>}
        </div>
      </div>
    </div>
  );
}


/* ══════════════════════════════════════════
   STORAGE — persiste dados via Artifact API
   com fallback seguro para memória
══════════════════════════════════════════ */
function useStored(key, fallback) {
  const [data,   setData]   = useState(fallback);
  const [ready,  setReady]  = useState(false);

  // Lê uma vez na montagem
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await storage.get(key);
        if (!cancelled && r && r.value != null) {
          setData(JSON.parse(r.value));
        }
      } catch (_) {}
      if (!cancelled) setReady(true);
    })();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line

  // Setter: atualiza estado + persiste
  const save = (updater) => {
    setData(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try { storage.set(key, JSON.stringify(next)); } catch (_) {}
      return next;
    });
  };

  return [data, save, ready];
}

/* ══════════════════════════════════════════
   APP ROOT
══════════════════════════════════════════ */
export default function App() {
  const [user,        setUser]   = useState(null);
  const [usuarios,    setUsuarios, usersOk] = useStored("crm2_usuarios", []);
  const [page,        setPage]   = useState("dashboard");
  const [mini,        setMini]   = useState(false);
  const [newLeadOpen, setNewLead]= useState(false);
  const [theme,       setTheme,  themeOk ] = useStored("crm2_theme",  "dark");
  const [search,      setSearch] = useState("");

  const [leads,       setLeads,   leadsOk  ] = useStored("crm2_leads",   D_LEADS);
  const [sellers,     setSellers, sellersOk ] = useStored("crm2_sellers", D_SELLERS);
  const [fechamentos, setFechos,  fechosOk  ] = useStored("crm2_fechs",   D_FECHAMENTOS);
  const [meta,        setMeta,    metaOk    ] = useStored("crm2_meta",    200000);

  const allReady = leadsOk && sellersOk && fechosOk && metaOk && themeOk && usersOk;

  useEffect(() => { window._setSellers = setSellers; return () => { delete window._setSellers; }; }, [setSellers]);

  // Loading screen
  if (!allReady) return (
    <>
      <style>{CSS}</style>
      <div style={{width:"100vw",height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"var(--bg)",gap:18}}>
        <div style={{width:44,height:44,borderRadius:11,background:"linear-gradient(145deg,#c9a84c,#f5dfa0,#b8922e)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Fraunces',serif",fontWeight:700,fontStyle:"italic",fontSize:20,color:"#1a1208",boxShadow:"0 4px 16px rgba(201,168,76,.4)"}}>C</div>
        <div style={{fontSize:15,fontWeight:600,color:"var(--t1)"}}>Carregando dados…</div>
        <div style={{fontSize:12,color:"var(--t3)"}}>Sincronizando armazenamento</div>
        <div style={{width:160,height:3,background:"var(--bg4)",borderRadius:2,overflow:"hidden"}}>
          <div style={{height:"100%",background:"linear-gradient(90deg,var(--gold),var(--gold2))",borderRadius:2,animation:"_ldbar 1.2s ease-in-out infinite"}}/>
        </div>
        <style>{"@keyframes _ldbar{0%{width:0%;marginLeft:0}50%{width:60%;marginLeft:20%}100%{width:0%;marginLeft:100%}}"}</style>
      </div>
    </>
  );

  // Primeira vez: nenhum usuário cadastrado → Setup
  if (!user && usuarios.length===0) return (
    <>
      <style>{CSS}</style>
      <SetupPage onSetup={u=>{ setUsuarios([u]); setUser(u); setPage("dashboard"); }}/>
    </>
  );

  if (!user) return (
    <>
      <style>{CSS}</style>
      <LoginPage onLogin={u=>{ setUser(u); setPage("dashboard"); }} usuarios={usuarios}/>
    </>
  );

  const chip = leads.filter(l => l.status==="primeiro contato" || l.status==="aguardando retorno").length;
  const tarefasChip = D_TAREFAS.filter(t=>!t.feita).length;

  const resetData = () => {
    setLeads(D_LEADS);
    setSellers(D_SELLERS);
    setFechos(D_FECHAMENTOS);
    setMeta(200000);
  };

  const renderPage = () => {
    // Bloqueia acesso direto a páginas não permitidas
    const allowed = NAV_GROUPS.flatMap(g=>g.items).find(i=>i.id===page);
    if (allowed && !canAccess(allowed, user.role)) {
      return (
        <div className="pw-gate">
          <div className="pw-ic">🚫</div>
          <div className="pw-title">Acesso Restrito</div>
          <div className="pw-sub">Seu perfil ({user.role}) não tem permissão para acessar esta seção.</div>
        </div>
      );
    }
    switch(page) {
      case "dashboard":     return <Dashboard       leads={leads} fechamentos={fechamentos} sellers={sellers} meta={meta} user={user}/>;
      case "leads":         return <LeadsPage        leads={leads} setLeads={setLeads} newLeadOpen={newLeadOpen} setNewLeadOpen={setNewLead} search={search} user={user}/>;
      case "meta":          return <MetasPage        leads={leads} fechamentos={fechamentos} sellers={sellers} meta={meta} setMeta={setMeta} user={user}/>;
      case "fechamentos":   return <FechamentosPage  fechamentos={fechamentos} setFechamentos={setFechos} sellers={sellers} search={search} user={user}/>;
      case "comissoes":     return <ComissoesPage    fechamentos={fechamentos} sellers={sellers} userRole={user.role} search={search}/>;
      case "equipe":        return <EquipePage        sellers={sellers} setSellers={setSellers} fechamentos={fechamentos} setFechamentos={setFechos} search={search} user={user}/>;
      case "relatorios":    return <RelatoriosPage    leads={leads} fechamentos={fechamentos} sellers={sellers} user={user}/>;
      case "configuracoes": return <ConfigPage        meta={meta} setMeta={setMeta} user={user} onReset={resetData} usuarios={usuarios} setUsuarios={setUsuarios}/>;
      case "producao":      return <ProducaoPage      sellers={sellers} user={user}/>;
      case "meta_diaria":   return <MetaDiariaPage    sellers={sellers} user={user}/>;
      case "ranking":       return <RankingPage        sellers={sellers} fechamentos={fechamentos} user={user}/>;
      case "agenda":        return <AgendaPage         sellers={sellers} user={user}/>;
      case "tarefas":       return <TarefasPage        sellers={sellers} user={user}/>;
      case "reunioes":      return <ReunioesPage       sellers={sellers} user={user}/>;
      case "indicadores":   return <IndicadoresPage    leads={leads} fechamentos={fechamentos} sellers={sellers}/>;
      default:              return <Dashboard        leads={leads} fechamentos={fechamentos} sellers={sellers} meta={meta} user={user}/>;
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className={`app${theme==="light"?" light-mode":""}`}>
        <Sidebar
          page={page}
          goTo={p=>{ setPage(p); setNewLead(false); setSearch(""); }}
          mini={mini}
          setMini={setMini}
          user={user}
          logout={()=>setUser(null)}
          chip={chip}
          tarefasChip={tarefasChip}
        />
        <div className="app-main">
          <Topbar
            page={page}
            toggleSb={()=>setMini(m=>!m)}
            onNewLead={()=>{ setPage("leads"); setNewLead(true); }}
            theme={theme}
            setTheme={setTheme}
            search={search}
            setSearch={setSearch}
          />
          <div className="page-scroll">
            {renderPage()}
          </div>
        </div>
      </div>
    </>
  );
}
