/* Dados de demonstração isolados da interface: prontos para futura API. */
const profiles = {
  student: {
    name: "Estudante",
    role: "Solicitante · Nível I",
    unit: "FACEE",
    initials: "ES",
    level: 1,
  },
  director: {
    name: "Director da FACEE",
    role: "Parecer · Nível II",
    unit: "FACEE",
    initials: "DF",
    level: 2,
  },
  deputy: {
    name: "Director Adjunto Pedagógico",
    role: "Parecer · Nível II",
    unit: "FACEE",
    initials: "DA",
    level: 2,
  },
  chief: {
    name: "Chefe de Departamento",
    role: "Parecer · Nível II",
    unit: "FACEE",
    initials: "CD",
    level: 2,
  },
  course: {
    name: "Director do Curso",
    role: "Parecer · Nível II",
    unit: "FACEE",
    initials: "DC",
    level: 2,
  },
  office: {
    name: "Gabinete do Reitor",
    role: "Coordenação da Reitoria",
    unit: "Reitoria",
    initials: "GR",
    level: 2,
  },
  rector: {
    name: "Reitor",
    role: "Autorização · Nível III",
    unit: "Reitoria",
    initials: "RE",
    level: 3,
  },
  secretary: {
    name: "Secretaria da Reitoria",
    role: "Recepção e notificação",
    unit: "Reitoria",
    initials: "SR",
    level: 2,
  },
};
const process = {
  id: "EXP-2026-00125",
  applicant: "Estudante",
  subject: "Exposição / Pedido dirigido ao Reitor",
  origin: "FACEE",
  date: "10 Setembro 2026",
  documents: [
    "Exposição dirigida ao Reitor.pdf",
    "Comprovativo de matrícula.pdf",
  ],
  opinions: [
    ["FACEE", "Parecer recebido", "done"],
    ["Direcção de Recursos Humanos", "Parecer recebido", "done"],
    ["Direcção de Finanças", "A aguardar", "waiting"],
    ["Faculdade de Direito", "Parecer recebido", "done"],
  ],
};
const units = [
  "FACEE",
  "FCSF",
  "Faculdade de Direito",
  "DRH",
  "Direcção de Finanças",
  "Outra unidade",
];
let state = {
  profile: "student",
  view: "dashboard",
  accepted: false,
  newStep: "choose",
};
const $ = (s) => document.querySelector(s);
const icon = (id) => `<svg><use href="#${id}"/></svg>`;
const nav = [
  ["dashboard", "i-home", "Início"],
  ["new", "i-plus", "Nova solicitação"],
  ["requests", "i-folder", "Meus processos"],
  ["notifications", "i-bell", "Notificações"],
];
const active = () => profiles[state.profile];
const escape = (s) =>
  s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
function setup() {
  const select = $("#profileSelect");
  select.innerHTML = Object.entries(profiles)
    .map(([id, p]) => `<option value="${id}">${p.name}</option>`)
    .join("");
  select.onchange = (e) => {
    state.profile = e.target.value;
    state.view = "dashboard";
    state.accepted = false;
    render();
  };
  $("#menuBtn").onclick = () => $("#sidebar").classList.toggle("open");
  $(".modal-backdrop").onclick = closeModal;
  render();
}
function render() {
  const p = active();
  $("#profileSelect").value = state.profile;
  ["sideAvatar", "topAvatar"].forEach(
    (id) => ($("#" + id).textContent = p.initials),
  );
  $("#sideName").textContent = p.name;
  $("#sideRole").textContent = p.role;
  $("#sideUnit").textContent = p.unit;
  renderNav();
  const crumbs = {
    dashboard: "Início",
    new: "Nova solicitação",
    requests: "Meus processos",
    notifications: "Notificações",
    opinions: "Pareceres",
    authorizations: "Decisões",
  };
  $("#pageCrumb").textContent = crumbs[state.view] || "Início";
  $("#app").innerHTML = views[state.view]();
  bind();
}
function renderNav() {
  $("#mainNav").innerHTML = nav
    .map(
      (n) =>
        `<button class="nav-item ${state.view === n[0] ? "active" : ""}" data-view="${n[0]}">${icon(n[1])}${n[2]}${n[0] === "notifications" ? '<b class="nav-badge">2</b>' : ""}</button>`,
    )
    .join("");
}
const header = (eyebrow, title, text, action = "") =>
  `<div class="page-title"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${text}</p></div>${action}</div>`;
const status = (label = "Em tramitação", kind = "") =>
  `<span class="status-pill ${kind}">${label}</span>`;
const processTop = (showLocation = false) =>
  `<div class="process-top"><div><span class="process-id">${process.id}</span><h2>${process.subject}</h2><span class="process-meta">${process.applicant} · ${process.date}</span></div>${status(active().level === 1 ? "Em tramitação" : "Em análise")}</div>${showLocation ? `<div class="location"><strong>Actualmente: ${active().level === 1 ? "Gabinete do Reitor" : "FACEE · Chefe de Departamento"}</strong><span>Última actualização: Hoje, 09:42</span></div>` : ""}`;
const timeline = () => {
  const steps = [
    ["Solicitação submetida", "Estudante", "done"],
    ["Recebida pela Secretaria", "Secretaria da Reitoria", "done"],
    ["Encaminhada ao Gabinete do Reitor", "Reitoria", "done"],
    ["Parecer solicitado à FACEE", "Unidade Orgânica", "done"],
    ["Em análise pela FACEE", "Chefe de Departamento", "current"],
    ["Parecer recebido", "Retorno pela cadeia hierárquica", ""],
    ["Decisão do Reitor", "Reitoria", ""],
    ["Concluído", "Secretaria notificará o requerente", ""],
  ];
  return `<div class="timeline">${steps.map(([t, s, c], i) => `<div class="timeline-item ${c}"><span class="timeline-dot">${c === "done" ? "✓" : c === "current" ? "●" : i + 1}</span><div><strong>${t}</strong><small>${s}${c === "current" ? " · Etapa actual" : ""}</small></div></div>`).join("")}</div>`;
};
const docs = () =>
  `<div class="documents"><h3>Documentos</h3>${process.documents.map((d) => `<div class="doc">${icon("i-file")}<span>${d}</span></div>`).join("")}</div>`;
const opinions = () =>
  `<div class="opinion-list">${process.opinions.map((x) => `<div class="opinion-row"><strong>${x[0]}</strong><span class="opinion-status ${x[2]}">${x[2] === "done" ? "✓" : "●"} ${x[1]}</span><button class="quiet-btn" data-toast="Parecer de ${escape(x[0])} aberto.">Consultar</button></div>`).join("")}</div>`;
function studentHome() {
  return (
    header(
      "INÍCIO",
      "Olá, Estudante",
      "Acompanhe os seus processos administrativos.",
      '<button class="primary" data-view="new">+ Nova solicitação</button>',
    ) +
    `<p class="section-label">PROCESSO EM DESTAQUE</p><section class="feature-process">${processTop(true)}<div class="feature-footer"><div class="summary"><strong>3 processos no total</strong><span>•</span>1 em tramitação<span>•</span>1 concluído<span>•</span>1 a aguardar</div><button class="quiet-btn" data-open-process>Acompanhar processo →</button></div></section>`
  );
}
function workerHome() {
  const p = active(),
    rector = p.level === 3;
  return (
    header(
      rector ? "DECISÕES" : "ÁREA DE TRABALHO",
      rector
        ? "Processos aguardando decisão"
        : "Processos que necessitam da sua intervenção",
      rector
        ? "Consulte os pareceres disponíveis e emita o despacho final."
        : "A sua fila mostra apenas as acções que requerem atenção agora.",
    ) +
    `<section class="work-list"><div class="work-row"><span class="process-id">${process.id}</span><p>${process.subject}<br><small>${rector ? "4 pareceres recebidos · Todos os pareceres disponíveis" : "Solicitado pelo Gabinete do Reitor · FACEE"}</small></p><button class="quiet-btn" data-view="${rector ? "authorizations" : "opinions"}">${rector ? "Consultar processo" : p.name.includes("Director") ? "Emitir parecer" : "Analisar"} →</button></div><div class="work-row"><span class="process-id">EXP-2026-00119</span><p>Pedido académico<br><small>Recebido hoje</small></p><button class="quiet-btn" data-toast="Processo de demonstração aberto.">Analisar →</button></div></section>`
  );
}
function requests() {
  return (
    header(
      "PROCESSOS",
      "Meus processos",
      "Consulte e acompanhe as solicitações submetidas.",
      active().level === 1
        ? '<button class="primary" data-view="new">+ Nova solicitação</button>'
        : "",
    ) +
    `<section class="surface"><div class="toolbar"><input class="search" placeholder="Pesquisar por número ou assunto" aria-label="Pesquisar processos"><div class="filters"><button class="filter active">Todos</button><button class="filter">Em tramitação</button><button class="filter">Concluídos</button><button class="filter">Recusados</button></div></div><div class="process-list"><div class="list-row" data-open-process><span class="process-id">${process.id}</span><div class="list-subject"><strong>${process.subject}</strong><span>${process.date}</span></div>${status("Em tramitação")}<span class="list-date">Gabinete do Reitor</span>${icon("i-chevron")}</div><div class="list-row" data-toast="Processo EXP-2026-00118 aberto."><span class="process-id">EXP-2026-00118</span><div class="list-subject"><strong>Pedido de declaração</strong><span>03 Setembro 2026</span></div>${status("Concluído", "green")}<span class="list-date">Secretaria</span>${icon("i-chevron")}</div></div></section>`
  );
}
function detail() {
  return `${processTop(true)}<div class="detail-grid"><div><h3>Tramitação</h3>${timeline()}</div><div class="side-stack">${docs()}<details class="history"><summary>Consultar histórico completo</summary><p>10 Set 2026 · 09:42 — Gabinete do Reitor encaminhou o processo para a FACEE.<br>10 Set 2026 · 08:15 — Secretaria registou a solicitação.</p></details></div></div>`;
}
function newRequest() {
  if (state.newStep === "choose")
    return (
      header(
        "NOVA SOLICITAÇÃO",
        "O que pretende solicitar?",
        "Escolha um serviço para continuar.",
      ) +
      `<section class="service-list">${[
        ["Exposição / Requerimento", "Dirija um pedido à Reitoria"],
        ["Pedido de férias", "Solicite um período de férias"],
        ["Licença / Dispensa", "Submeta o pedido com anexos"],
        ["Declaração", "Peça uma declaração institucional"],
        ["Pedido de formação", "Registe o seu pedido de formação"],
        ["Outro", "Descreva a sua solicitação"],
      ]
        .map(
          (x) =>
            `<button class="service" data-service><div><strong>${x[0]}</strong><span>${x[1]}</span></div>${icon("i-chevron")}</button>`,
        )
        .join("")}</section>`
    );
  return (
    header(
      "NOVA SOLICITAÇÃO",
      "Exposição / Requerimento",
      "Preencha os dados essenciais e anexe os documentos de suporte.",
    ) +
    `<section class="form-panel"><div class="form-header"><h2>Dados da solicitação</h2><p>O seu pedido será encaminhado automaticamente para os responsáveis competentes.</p></div><form class="request-form" id="requestForm"><div class="field"><label>Assunto</label><input value="Exposição / Pedido dirigido ao Reitor"></div><div class="field"><label>Exposição</label><textarea rows="6">Exposição dirigida ao Magnífico Reitor.</textarea></div><div class="upload">${icon("i-file")}<span><strong>Documentos comprovativos</strong><br>PDF, JPG ou PNG · Máx. 10 MB por ficheiro</span></div><div class="form-footer"><span>Campos assinalados são obrigatórios.</span><button class="primary">Enviar solicitação</button></div></form></section>`
  );
}
function intervention() {
  const p = active();
  if (state.profile === "office") return officeView();
  const next =
    {
      director: "Director Adjunto Pedagógico",
      deputy: "Chefe de Departamento",
      chief: "Director do Curso",
      secretary: "Gabinete do Reitor",
    }[state.profile] || "Chefe de Departamento";
  return (
    header(
      "PEDIDO DE PARECER",
      process.id,
      "Solicitado pelo Gabinete do Reitor · Unidade: FACEE",
    ) +
    `<section class="process-detail">${processTop()}<div class="detail-grid"><div><h3>Tramitação interna</h3><div class="internal-chain">${[
      "Director da Faculdade",
      "Director Adjunto Pedagógico",
      "Chefe de Departamento",
      "Director do Curso",
    ]
      .map(
        (x) =>
          `<span class="chain-step ${p.name === x ? "current" : ""}">${x}</span><span class="chain-arrow">→</span>`,
      )
      .join("")
      .replace(
        /<span class="chain-arrow">→<\/span>$/,
        "",
      )}</div><div class="notice"><strong>${p.name}</strong> é actualmente responsável. Encaminhe o processo ou emita o parecer conforme a sua competência.</div><div class="action-row"><button class="secondary" data-toast="Processo devolvido para esclarecimento.">Devolver</button><button class="secondary" data-toast="Parecer registado no processo.">Emitir parecer</button><button class="primary" data-toast="Processo encaminhado para ${next}.">Encaminhar</button></div></div><div>${docs()}</div></div></section>`
  );
}
function officeView() {
  return (
    header(
      "GABINETE DO REITOR",
      "Novo processo recebido",
      "Faça a triagem e solicite parecer às Unidades Orgânicas necessárias.",
    ) +
    `<section class="process-detail">${processTop()}<div class="action-row"><button class="secondary" data-toast="Processo devolvido para esclarecimento.">Devolver / Recusar</button><button class="primary" data-accept>${state.accepted ? "Processo aceite" : "Aceitar processo"}</button></div>${state.accepted ? `<div class="documents"><h3>Solicitar parecer</h3><p class="notice">Seleccione as Unidades Orgânicas. O Gabinete não encaminha directamente a pessoas.</p><div class="internal-chain">${units.map((u, i) => `<label class="chain-step"><input type="checkbox" ${i === 0 ? "checked" : ""}> ${u}</label>`).join("")}</div><button class="primary" data-toast="Pedido de parecer enviado às Unidades seleccionadas.">Solicitar parecer</button></div>` : ""}<div class="documents"><h3>Pareceres solicitados <small>— 3 de 4 recebidos</small></h3>${opinions()}</div></section>`
  );
}
function authorization() {
  return (
    header(
      "DECISÕES",
      "Processos aguardando decisão",
      "Todos os pareceres necessários estão disponíveis para consulta.",
    ) +
    `<section class="process-detail">${processTop()}<div class="detail-grid"><div><h3>Pareceres solicitados <small>— 3 de 4 recebidos</small></h3>${opinions()}<div class="action-row"><button class="secondary" data-toast="Pedido devolvido para esclarecimento.">Devolver</button><button class="secondary" data-toast="Pedido de parecer adicional aberto.">Solicitar parecer adicional</button><button class="secondary" data-toast="Decisão de recusa preparada.">Recusar</button><button class="primary" data-decision>Autorizar</button></div></div><div>${docs()}<details class="history"><summary>Consultar histórico</summary><p>O processo foi recebido do Gabinete do Reitor e os pareceres foram consolidados por Unidade Orgânica.</p></details></div></div></section>`
  );
}
function notifications() {
  return (
    header(
      "NOTIFICAÇÕES",
      "Actualizações recentes",
      "Acompanhe apenas os acontecimentos que exigem a sua atenção.",
    ) +
    `<section class="surface"><div class="process-list"><div class="list-row" data-open-process><div class="list-subject"><strong>Novo andamento no processo</strong><span>${process.id} foi encaminhado para a FACEE.</span></div><span class="list-date">Há 10 minutos</span>${icon("i-chevron")}</div><div class="list-row"><div class="list-subject"><strong>Acção necessária</strong><span>O processo ${process.id} aguarda o seu parecer.</span></div><span class="list-date">Hoje, 09:42</span>${icon("i-chevron")}</div></div></section>`
  );
}
const views = {
  dashboard: () => (active().level === 1 ? studentHome() : workerHome()),
  new: newRequest,
  requests,
  notifications,
  opinions: intervention,
  authorizations: authorization,
};
function openModal() {
  $("#modalContent").innerHTML =
    `<button class="modal-close" data-close>×</button><p class="eyebrow">DETALHE DO PROCESSO</p><h2>${process.id}</h2><p>${process.subject}</p><section class="process-detail">${detail()}</section>`;
  $("#modal").classList.add("show");
}
function decisionModal() {
  $("#modalContent").innerHTML =
    `<button class="modal-close" data-close>×</button><p class="eyebrow">DECISÃO DO REITOR</p><h2>Autorizar processo</h2><p>O despacho seguirá para a Secretaria e, depois, para o requerente.</p><div class="field"><label>Despacho / decisão</label><textarea rows="5" placeholder="Registe o despacho do Magnífico Reitor..."></textarea></div><div class="action-row"><button class="primary" data-toast="Despacho emitido. Processo devolvido à Secretaria para notificação.">Emitir despacho</button></div>`;
  $("#modal").classList.add("show");
}
function closeModal() {
  $("#modal").classList.remove("show");
}
function toast(message) {
  $("#toast").textContent = `✓ ${message}`;
  $("#toast").classList.add("show");
  setTimeout(() => $("#toast").classList.remove("show"), 3400);
}
function bind() {
  document.querySelectorAll("[data-view]").forEach(
    (b) =>
      (b.onclick = () => {
        state.view = b.dataset.view;
        $("#sidebar").classList.remove("open");
        render();
      }),
  );
  document
    .querySelectorAll("[data-open-process]")
    .forEach((b) => (b.onclick = openModal));
  document
    .querySelectorAll("[data-toast]")
    .forEach((b) => (b.onclick = () => toast(b.dataset.toast)));
  document
    .querySelectorAll("[data-close]")
    .forEach((b) => (b.onclick = closeModal));
  document.querySelectorAll("[data-service]").forEach(
    (b) =>
      (b.onclick = () => {
        state.newStep = "form";
        render();
      }),
  );
  const a = $("[data-accept]");
  if (a)
    a.onclick = () => {
      state.accepted = true;
      render();
    };
  const d = $("[data-decision]");
  if (d) d.onclick = decisionModal;
  const f = $("#requestForm");
  if (f)
    f.onsubmit = (e) => {
      e.preventDefault();
      toast(`Protocolo digital ${process.id} registado com sucesso.`);
      state.view = "requests";
      state.newStep = "choose";
      setTimeout(render, 600);
    };
}
setup();
