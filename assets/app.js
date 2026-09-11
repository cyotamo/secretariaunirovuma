const views=["dashboard","new","requests","status","profile","settings"];
const labels={dashboard:"Início",new:"Nova solicitação",requests:"Minhas solicitações",status:"Estado dos processos",profile:"Meu perfil",settings:"Configuração"};
const state={service:"Pedido de férias"};
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);

function go(view){
  views.forEach(v=>{const el=$("#view-"+v); if(el) el.classList.toggle("active-view",v===view)});
  $$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
  $("#pageCrumb").textContent=labels[view]||"Início";
  window.scrollTo({top:0,behavior:"smooth"});
  $("#sidebar").classList.remove("open");
}
document.addEventListener("click",e=>{
  const nav=e.target.closest("[data-view]");
  if(nav) go(nav.dataset.view);
  const open=e.target.closest("[data-open]");
  if(open) openModal(open.dataset.open);
  const svc=e.target.closest("[data-service]");
  if(svc){state.service=svc.dataset.service; selectService(state.service)}
});
$("#menuBtn").onclick=()=>$("#sidebar").classList.toggle("open");
$("#modalClose").onclick=closeModal;
$(".modal-backdrop").onclick=closeModal;
function openModal(id){
  const data={
    "SOL-2026-00125":["SOL-2026-00125","Pedido de férias","Pedido submetido em 10 de Setembro de 2026."],
    "SOL-2026-00118":["SOL-2026-00118","Declaração de serviço","Documento emitido e processo concluído."],
    "SOL-2026-00097":["SOL-2026-00097","Pedido de formação","O processo aguarda parecer da Unidade Orgânica."],
    "SOL-2026-00061":["SOL-2026-00061","Dispensa de serviço","Processo encerrado após decisão desfavorável."]
  }[id]||[id,"Solicitação","Processo administrativo."];
  $("#modalId").textContent=data[0];$("#modalTitle").textContent=data[1];$("#modalDesc").textContent=data[2];
  $("#processModal").classList.add("show");
}
function closeModal(){$("#processModal").classList.remove("show")}
function selectService(service){
  $$(".catalog-item").forEach(x=>x.classList.toggle("selected",x.dataset.service===service));
  $("#formTitle").textContent=service;
  const subtitles={
    "Pedido de férias":"Preencha os dados do período pretendido.",
    "Licença":"Indique o tipo e o período da licença pretendida.",
    "Declaração":"Seleccione o documento ou declaração que necessita.",
    "Formação":"Indique a formação pretendida e a respectiva fundamentação.",
    "Reembolso":"Apresente os dados e documentos do pedido de reembolso.",
    "Outros":"Descreva a solicitação que pretende apresentar."
  };
  $("#formSubtitle").textContent=subtitles[service]||"Preencha os dados da sua solicitação.";
}
$("#requestForm").addEventListener("submit",e=>{
  e.preventDefault();
  const toast=$("#toast");toast.classList.add("show");
  setTimeout(()=>{toast.classList.remove("show");go("requests")},1800);
});
$("#modalAction").onclick=()=>{closeModal();go("status")};
$("#fileInput").addEventListener("change",e=>{
  if(e.target.files.length){
    const p=e.target.closest(".upload").querySelector("p");
    p.innerHTML=`<strong>${e.target.files.length} ficheiro(s) seleccionado(s)</strong>`;
  }
});
selectService("Pedido de férias");