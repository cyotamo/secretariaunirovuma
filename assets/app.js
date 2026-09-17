const profiles = {
  student: {name:"Estudante", role:"Nível I · Solicitante", unit:"FACEE", initials:"ES", type:"student"},
  secretary: {name:"Secretaria", role:"Nível I · Atendimento", unit:"Reitoria", initials:"SR", type:"secretary"},
  office: {name:"Gabinete do Reitor", role:"Tramitação", unit:"Reitoria", initials:"GR", type:"office"},
  director: {name:"Director da FACEE", role:"Nível II · Parecer", unit:"FACEE", initials:"DF", type:"opinion", next:"Director Adjunto Pedagógico"},
  deputy: {name:"Director Adjunto Pedagógico", role:"Nível II · Parecer", unit:"FACEE", initials:"DA", type:"opinion", next:"Chefe de Departamento"},
  chief: {name:"Chefe de Departamento", role:"Nível II · Parecer", unit:"FACEE", initials:"CD", type:"opinion", next:"Director do Curso"},
  course: {name:"Director do Curso", role:"Nível II · Parecer", unit:"FACEE", initials:"DC", type:"opinion", next:"Director do Curso · emitir parecer"},
  rector: {name:"Reitor", role:"Nível III · Autorização", unit:"Reitoria", initials:"RE", type:"rector"}
};

const process = {
  id:"EXP-2026-00125",
  type:"Exposição",
  subject:"Exposição dirigida ao Reitor",
  applicant:"João Manuel",
  origin:"FACEE",
  date:"17/09/2026",
  text:"Venho por este meio apresentar uma exposição relativa à situação descrita no documento anexo, solicitando a apreciação e decisão da Reitoria.",
  docs:["Exposição.pdf","Comprovativo.pdf"],
  current:"Gabinete do Reitor",
  events:[
    ["Solicitação submetida","Estudante","17/09/2026 · 08:41","done"],
    ["Recebida pela Secretaria","Secretaria","17/09/2026 · 08:43","done"],
    ["Encaminhada ao Gabinete do Reitor","Secretaria","17/09/2026 · 09:02","done"],
    ["Recebida pelo Gabinete do Reitor","Gabinete do Reitor","17/09/2026 · 09:10","current"],
    ["Pareceres","FACEE · DRH · DF · FD","A aguardar","pending"],
    ["Decisão do Reitor","Reitor","A aguardar","pending"]
  ],
  opinions:[
    ["FACEE","Recebido","done"],
    ["DRH","Recebido","done"],
    ["Direcção de Finanças","A aguardar","pending"],
    ["Faculdade de Direito","Recebido","done"]
  ]
};

let state={profile:"student", view:"home", submitted:false, selectedType:"Exposição"};

const $=s=>document.querySelector(s);
const icon=id=>`<svg class="icon"><use href="#${id}"></use></svg>`;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const p=()=>profiles[state.profile];

const navFor=()=>{
  const t=p().type;
  if(t==="student") return [["home","Início","home"],["new","Nova solicitação","plus"],["requests","Minhas solicitações","folder"]];
  if(t==="secretary") return [["received","Solicitações recebidas","folder"],["rejected","Recusadas","folder"],["approved","Aprovadas","check"],["search","Buscar processo","search"]];
  if(t==="office") return [["received","Solicitações recebidas","folder"],["returned","Devolvidas","folder"],["rejected","Recusadas","folder"],["approved","Aprovadas","check"]];
  if(t==="opinion") return [["opinions","Pareceres","folder"],["history","Processos","folder"]];
  return [["decisions","Autorizações","check"],["history","Processos","folder"]];
};

function setup(){
  const select=$("#profileSelect");
  select.innerHTML=Object.entries(profiles).map(([id,x])=>`<option value="${id}">${x.name}</option>`).join("");
  select.value=state.profile;
  select.onchange=e=>{state.profile=e.target.value;state.view="home";render()};
  $("#menuButton").onclick=()=>$("#sidebar").classList.toggle("open");
  $(".modal-bg").onclick=closeModal;
  render();
}

function render(){
  const profile=p();
  $("#sideAvatar").textContent=profile.initials;
  $("#topAvatar").textContent=profile.initials;
  $("#sideName").textContent=profile.name;
  $("#sideRole").textContent=profile.role;
  $("#profileSelect").value=state.profile;
  renderNav();
  $("#crumb").textContent=crumbs[state.view]||"Início";
  $("#app").innerHTML=view();
  bind();
}

const crumbs={home:"Início",new:"Nova solicitação",requests:"Minhas solicitações",received:"Solicitações recebidas",rejected:"Recusadas",approved:"Aprovadas",search:"Buscar processo",returned:"Devolvidas",opinions:"Pareceres",history:"Processos",decisions:"Autorizações",detail:"Processo"};

function renderNav(){
  $("#nav").innerHTML =
    navFor().map(([v,label,ic])=>`<button class="nav-item ${state.view===v?"active":""}" data-view="${v}">${icon(ic)}<span>${label}</span></button>`).join("") +
    `<div class="nav-extra">
      <button class="nav-item" data-view="profile">${icon("user")}<span>Meu perfil</span></button>
      <button class="nav-item" data-view="settings">${icon("settings")}<span>Configuração</span></button>
    </div>`;
}

function pageTitle(title,sub=""){
  return `<div class="page-title"><div><h1>${title}</h1>${sub?`<p>${sub}</p>`:""}</div></div>`;
}
function pill(label,kind="blue"){return `<span class="pill ${kind}">${label}</span>`}

function view(){
  const t=p().type;
  if(state.view==="new") return newRequest();
  if(state.view==="requests") return studentRequests();
  if(state.view==="received") return received();
  if(state.view==="rejected") return simpleList("Solicitações recusadas", "Não existem processos recusados para este perfil.");
  if(state.view==="approved") return simpleList("Solicitações aprovadas", "Não existem processos aprovados para este perfil.");
  if(state.view==="search") return searchProcess();
  if(state.view==="returned") return simpleList("Solicitações devolvidas", "Processos devolvidos para correcção ou informação adicional.");
  if(state.view==="opinions") return opinions();
  if(state.view==="decisions") return decisions();
  if(state.view==="history") return history();
  if(state.view==="profile") return profileView();
  if(state.view==="settings") return settingsView();
  return home(t);
}

function home(t){
  const messages = {
    student: {
      kicker:"SECRETARIA ONLINE",
      title:"Olá, Estudante.",
      text:"Bem-vindo à Secretaria Online. Utilize o menu para submeter e acompanhar as suas solicitações."
    },
    secretary: {
      kicker:"SECRETARIA",
      title:"Bem-vindo à Secretaria.",
      text:"Consulte as solicitações recebidas e encaminhe cada processo para a unidade competente."
    },
    office: {
      kicker:"REITORIA",
      title:"Bem-vindo ao Gabinete do Reitor.",
      text:"Consulte os processos recebidos e encaminhe-os para as unidades das quais necessita de parecer."
    },
    opinion: {
      kicker:"ÁREA DE PARECER",
      title:`Bem-vindo, ${p().name}.`,
      text:"Consulte os processos que aguardam a sua intervenção e encaminhe-os pela cadeia hierárquica."
    },
    rector: {
      kicker:"REITORIA",
      title:"Bem-vindo, Reitor.",
      text:"Consulte os processos que aguardam decisão e analise os pareceres antes de decidir."
    }
  };
  const m = messages[t] || messages.student;
  return `
    <div class="welcome-only">
      <div class="welcome-copy">
        <span class="kicker">${m.kicker}</span>
        <h1>${m.title}</h1>
        <p>${m.text}</p>
      </div>
    </div>
  `;
}

function profileView(){
  return pageTitle("Meu perfil","Informação do utilizador actual.")+
  `<div class="simple-card">
    <div class="profile-large"><div class="avatar">${p().initials}</div><div><h2>${p().name}</h2><p>${p().role} · ${p().unit}</p></div></div>
  </div>`;
}
function settingsView(){
  return pageTitle("Configuração","Preferências da Secretaria Online.")+
  `<div class="simple-card"><div class="setting-row"><div><strong>Notificações</strong><small>Receber avisos sobre alterações aos processos.</small></div><label class="switch"><input type="checkbox" checked><span></span></label></div></div>`;
}

function requestRows(){
 return `<div class="list-card"><div class="list-head"><span>PROCESSO</span><span>DATA</span><span>TIPO</span><span>SITUAÇÃO</span><span></span></div>
 <div class="list-row"><strong>${process.id}</strong><span>${process.date}</span><span>${process.type}</span>${pill("Em tramitação","blue")}<button class="eye" data-open="${process.id}" title="Ver processo">${icon("eye")}</button></div>
 <div class="list-row"><strong>REC-2026-00114</strong><span>12/09/2026</span><span>Reclamação</span>${pill("Concluído","green")}<button class="eye" data-open="REC-2026-00114">${icon("eye")}</button></div></div>`;
}

function studentRequests(){return pageTitle("Minhas solicitações","Todas as solicitações submetidas através da Secretaria Online.")+requestRows();}

function newRequest(){
 return pageTitle("Nova solicitação","Seleccione o tipo e preencha o pedido.")+
 `<div class="form-card">
   <label class="label">Tipo de solicitação</label>
   <select id="requestType" class="input"><option>Exposição</option><option>Reclamação</option><option>Queixa</option></select>
   <div class="field"><label class="label" id="contentLabel">Exposição</label><textarea id="requestText" class="input textarea" placeholder="Escreva aqui o conteúdo da sua solicitação..."></textarea></div>
   <div class="upload"><div class="upload-icon">${icon("file")}</div><div><strong>Documentos comprovativos</strong><small>Opcional · PDF, JPG ou PNG</small></div><label class="btn secondary upload-btn">Anexar<input id="files" type="file" multiple hidden></label></div>
   <div id="filesList" class="files-list"></div>
   <div class="form-footer"><button class="btn secondary" data-view="home">Cancelar</button><button class="btn primary" id="submitRequest">${icon("send")}Enviar solicitação</button></div>
 </div>`;
}

function received(){
 return pageTitle("Solicitações recebidas","Processos encaminhados para a sua área.")+
 `<div class="list-card"><div class="list-head"><span>PROCESSO</span><span>DATA</span><span>TIPO</span><span>SITUAÇÃO</span><span></span></div>
 ${workListRow(process.id,process.date,process.type,"Recebida")}
 <div class="list-row"><strong>QUE-2026-00108</strong><span>15/09/2026</span><span>Queixa</span>${pill("Em tramitação","blue")}<button class="eye" data-open="QUE-2026-00108">${icon("eye")}</button></div></div>`;
}

function workListRow(id,date,type,statusLabel){return `<div class="list-row"><strong>${id}</strong><span>${date}</span><span>${type}</span>${pill(statusLabel,"blue")}<button class="eye" data-open="${id}">${icon("eye")}</button></div>`;}

function workRow(id,subject,person,date,statusLabel){
 return `<div class="work-row"><div><span class="process-id">${id}</span><h3>${subject}</h3><p>${person} · ${date}</p></div>${pill(statusLabel,"blue")}<button class="btn secondary" data-open="${id}">Abrir ${icon("arrow")}</button></div>`;
}

function simpleList(title,sub){return pageTitle(title,sub)+`<div class="empty">${icon("folder")}<strong>${sub}</strong></div>`;}

function searchProcess(){return pageTitle("Buscar processo","Introduza o número do processo para consultar o seu estado.")+`<div class="search-box"><div class="search-input">${icon("search")}<input id="processSearch" placeholder="Ex.: EXP-2026-00125"><button class="btn primary" id="searchBtn">Buscar</button></div><div id="searchResult"></div></div>`;}

function opinions(){
 const prof=p();
 return pageTitle("Pareceres","Processos que aguardam a sua intervenção.")+
 `<div class="work-card">${workRow(process.id,process.subject,prof.next==="Director do Curso · emitir parecer"?"Chefe de Departamento":"Pedido da hierarquia",process.date,"Aguarda parecer")}</div>`;
}

function decisions(){return pageTitle("Autorizações","Processos aguardando decisão do Reitor.")+
 `<div class="work-card">${workRow(process.id,process.subject,`${process.opinions.filter(x=>x[2]==="done").length} de ${process.opinions.length} pareceres recebidos`,process.date,"Aguarda decisão")}</div>`;}

function history(){return pageTitle("Processos","Histórico dos processos que passaram pela sua área.")+requestRows();}

function bind(){
 document.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>{state.view=b.dataset.view;render()});
 document.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>openProcess(b.dataset.open));
 const type=$("#requestType");
 if(type){
   type.onchange=()=>{$("#contentLabel").textContent=type.value;$("#requestText").placeholder=`Escreva aqui o conteúdo da sua ${type.value.toLowerCase()}...`};
   $("#files").onchange=e=>{
     $("#filesList").innerHTML=[...e.target.files].map(f=>`<span>${esc(f.name)}</span>`).join("");
   };
   $("#submitRequest").onclick=()=>{
     if(!$("#requestText").value.trim()){showToast("Escreva o conteúdo da solicitação.");return}
     showToast("Solicitação enviada. Protocolo EXP-2026-00126.");
     setTimeout(()=>{state.view="requests";render()},1000);
   };
 }
 if($("#searchBtn")) $("#searchBtn").onclick=()=>{
   const q=$("#processSearch").value.trim().toUpperCase();
   $("#searchResult").innerHTML=q===process.id?`<div class="search-result"><div><span class="process-id">${process.id}</span><h2>${process.subject}</h2><p>Actualmente: <strong>${process.current}</strong></p></div>${pill("Em tramitação","blue")}<button class="btn secondary" data-open="${process.id}">Ver processo</button></div>`:`<div class="not-found">Processo não encontrado.</div>`;
   document.querySelector("[data-open]")?.addEventListener("click",()=>openProcess(process.id));
 };
}

function openProcess(id){
 const isMain=id===process.id;
 const title=isMain?process.subject:(id==="REC-2026-00114"?"Reclamação":"Queixa");
 const prof=p();
 let actions="";
 if(prof.type==="secretary"){
   actions=`<div class="action-grid"><button class="btn secondary" id="returnBtn">Devolver ao estudante</button><button class="btn primary" id="forwardBtn">Encaminhar</button></div>`;
 } else if(prof.type==="office"){
   actions=`<div class="action-grid"><button class="btn secondary" id="rejectBtn">Devolver / recusar</button><button class="btn primary" id="opinionBtn">Solicitar parecer</button></div>`;
 } else if(prof.type==="opinion"){
   actions=`<div class="action-grid"><button class="btn secondary" id="forwardNext">Encaminhar para ${esc(prof.next)}</button><button class="btn primary" id="giveOpinion">Emitir parecer</button></div>`;
 } else if(prof.type==="rector"){
   actions=`<div class="action-grid"><button class="btn secondary" id="decisionReturn">Devolver</button><button class="btn danger" id="decisionReject">Recusar</button><button class="btn primary" id="decisionApprove">Autorizar</button></div>`;
 }
 $("#modalPanel").innerHTML=`
   <button class="close" onclick="closeModal()">×</button>
   <span class="kicker">PROCESSO</span>
   <div class="modal-heading"><div><span class="process-id">${id}</span><h2>${title}</h2><p>${isMain?process.applicant:"Estudante"} · ${isMain?process.date:"15/09/2026"}</p></div>${pill(isMain?"Em tramitação":"Concluído",isMain?"blue":"green")}</div>
   <div class="tabs"><button class="tab active">Processo</button><button class="tab">Histórico</button></div>
   <div class="process-content">
     <div class="block"><label>Conteúdo</label><p>${isMain?process.text:"Conteúdo da solicitação disponível para consulta."}</p></div>
     <div class="block"><label>Documentos</label><div class="docs">${(isMain?process.docs:["Documento.pdf"]).map(d=>`<div class="doc">${icon("file")}<span>${d}</span></div>`).join("")}</div></div>
     ${isMain?`<div class="block"><label>Tramitação</label><div class="timeline">${process.events.map(e=>`<div class="event ${e[3]}"><i>${e[3]==="done"?"✓":e[3]==="current"?"●":"○"}</i><div><strong>${e[0]}</strong><small>${e[1]} · ${e[2]}</small></div></div>`).join("")}</div></div>`:""}
     ${prof.type==="office"&&isMain?`<div class="block"><label>Pareceres</label><div class="opinions">${process.opinions.map(o=>`<div><strong>${o[0]}</strong>${pill(o[1],o[2]==="done"?"green":"amber")}</div>`).join("")}</div></div>`:""}
   </div>
   ${actions}
 `;
 $("#modal").classList.add("show");
 bindModal(prof);
}

function bindModal(prof){
 $("#forwardBtn")?.addEventListener("click",()=>openForward());
 $("#returnBtn")?.addEventListener("click",()=>showReason("Devolver ao estudante"));
 $("#rejectBtn")?.addEventListener("click",()=>showReason("Devolver / recusar"));
 $("#opinionBtn")?.addEventListener("click",()=>openOpinions());
 $("#forwardNext")?.addEventListener("click",()=>showToast("Processo encaminhado para o próximo responsável."));
 $("#giveOpinion")?.addEventListener("click",()=>showOpinion());
 $("#decisionApprove")?.addEventListener("click",()=>showToast("Despacho de autorização registado."));
 $("#decisionReject")?.addEventListener("click",()=>showReason("Motivo da recusa"));
 $("#decisionReturn")?.addEventListener("click",()=>showReason("Motivo da devolução"));
}

function openForward(){
 $("#modalPanel").insertAdjacentHTML("beforeend",`<div class="inline-action"><label class="label">Encaminhar para</label><select class="input"><option>Gabinete do Reitor</option><option>Vice-Reitor</option><option>Gabinete Jurídico</option></select><button class="btn primary" id="doForward">Confirmar encaminhamento</button></div>`);
 $("#doForward").onclick=()=>{closeModal();showToast("Processo encaminhado.");};
}
function showReason(title){
 $("#modalPanel").insertAdjacentHTML("beforeend",`<div class="inline-action"><label class="label">${title}</label><textarea class="input textarea" placeholder="Escreva a justificação..."></textarea><button class="btn primary" id="saveReason">Confirmar</button></div>`);
 $("#saveReason").onclick=()=>{closeModal();showToast("Operação registada.");};
}
function openOpinions(){
 $("#modalPanel").insertAdjacentHTML("beforeend",`<div class="inline-action"><label class="label">Solicitar parecer a</label><div class="checks">${["FACEE","FCSF","Faculdade de Direito","DRH","Direcção de Finanças"].map(x=>`<label><input type="checkbox" value="${x}"> ${x}</label>`).join("")}</div><button class="btn primary" id="sendOpinions">Enviar pedidos de parecer</button></div>`);
 $("#sendOpinions").onclick=()=>{closeModal();showToast("Pedidos de parecer enviados.");};
}
function showOpinion(){
 $("#modalPanel").insertAdjacentHTML("beforeend",`<div class="inline-action"><label class="label">Parecer</label><textarea class="input textarea" placeholder="Escreva o parecer..."></textarea><button class="btn primary" id="saveOpinion">Registar parecer</button></div>`);
 $("#saveOpinion").onclick=()=>{closeModal();showToast("Parecer registado e encaminhado.");};
}
function closeModal(){$("#modal").classList.remove("show")}
function showToast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2600)}
window.closeModal=closeModal;
setup();