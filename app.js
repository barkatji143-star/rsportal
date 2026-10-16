const SERVICES = [
 {name:"Document Print",desc:"PDF / डॉक्यूमेंट प्रिंट",icon:"🖨️",tone:"#0878f9",tint:"#e7f2ff"},
 {name:"Aadhaar Print",desc:"अधिकृत प्रति / प्रिंट",icon:"🪪",tone:"#17a767",tint:"#e5f9ef"},
 {name:"PAN Card",desc:"PAN सर्विस रिक्वेस्ट",icon:"▤",tone:"#7048e8",tint:"#f0eaff"},
 {name:"Mobile Recharge",desc:"प्रीपेड रिचार्ज",icon:"📱",tone:"#ed8a0b",tint:"#fff1dc"},
 {name:"DTH Recharge",desc:"DTH रिचार्ज",icon:"📡",tone:"#e83e8c",tint:"#ffebf4"},
 {name:"Electricity Bill",desc:"बिजली बिल भुगतान",icon:"💡",tone:"#c99a00",tint:"#fff8d9"},
 {name:"Water Bill",desc:"पानी बिल सर्विस",icon:"💧",tone:"#079aa6",tint:"#e1fbfd"},
 {name:"Gas Bill",desc:"गैस बिल सर्विस",icon:"♨️",tone:"#e84c42",tint:"#ffebe9"},
 {name:"Voter ID",desc:"वोटर कार्ड रिक्वेस्ट",icon:"🗳️",tone:"#1681ed",tint:"#e6f3ff"},
 {name:"Ration Card",desc:"नाम / सदस्य बदलाव",icon:"📋",tone:"#0e8298",tint:"#e4f8fb"},
 {name:"Money Transfer",desc:"अधिकृत पार्टनर आवश्यक",icon:"↔️",tone:"#0878f9",tint:"#e7f2ff"},
 {name:"Banking Services",desc:"AEPS / बैंकिंग पार्टनर",icon:"🏦",tone:"#0b4b98",tint:"#e6f0ff"}
];
const $ = s => document.querySelector(s);
const money = n => "₹ " + Number(n).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2});
let balance = Number(localStorage.getItem("rsportal_demo_balance") || 0);
let transactions = JSON.parse(localStorage.getItem("rsportal_demo_tx") || "[]");
let requests = JSON.parse(localStorage.getItem("rsportal_demo_requests") || "[]");
let selectedService = null;
function save(){localStorage.setItem("rsportal_demo_balance",balance);localStorage.setItem("rsportal_demo_tx",JSON.stringify(transactions));localStorage.setItem("rsportal_demo_requests",JSON.stringify(requests));renderWallet();renderTx();renderRequests();}
function serviceCard(s){return `<button class="service" data-service="${s.name}"><span class="ico" style="--tone:${s.tone};--tint:${s.tint}">${s.icon}</span><b>${s.name}</b><small>${s.desc}</small></button>`}
function renderServices(){ $("#homeServices").innerHTML=SERVICES.slice(0,8).map(serviceCard).join("");$("#allServices").innerHTML=SERVICES.map(serviceCard).join("");document.querySelectorAll("[data-service]").forEach(b=>b.addEventListener("click",()=>openService(b.dataset.service)));}
function renderWallet(){$("#balanceTop").textContent=money(balance);$("#balanceMain").textContent=money(balance);$("#txCount").textContent=transactions.length;}
function renderTx(){const rows=$("#txRows");rows.innerHTML=transactions.slice().reverse().map(t=>`<tr><td>${new Date(t.time).toLocaleString("hi-IN")}</td><td>${escapeHtml(t.title)}</td><td>${t.kind}</td><td>${money(t.amount)}</td><td>${t.status}</td></tr>`).join("");$("#emptyTx").hidden=transactions.length>0;}
function renderRequests(){$("#requestCount").textContent=requests.length;$("#requests").innerHTML=requests.length?requests.slice().reverse().map(r=>`<div class="request-row"><b>${escapeHtml(r.service)}</b><p>${escapeHtml(r.name)} • ${escapeHtml(r.phone)}</p><small>${new Date(r.time).toLocaleString("hi-IN")} — Demo request</small></div>`).join(""):"<p>अभी कोई रिक्वेस्ट नहीं है।</p>";}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function goto(id){document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===id));document.querySelectorAll(".nav").forEach(n=>n.classList.toggle("active",n.dataset.target===id));window.scrollTo({top:0,behavior:"smooth"});}
document.querySelectorAll(".nav").forEach(b=>b.addEventListener("click",()=>goto(b.dataset.target)));
document.querySelectorAll("[data-goto]").forEach(b=>b.addEventListener("click",()=>goto(b.dataset.goto)));
function openService(name){selectedService=SERVICES.find(s=>s.name===name);$("#dialogTitle").textContent=selectedService.name;$("#dialogDesc").textContent=selectedService.desc+" — यह केवल demo request है; कोई सरकारी आवेदन/भुगतान जमा नहीं होगा।";$("#serviceDialog").showModal();}
$("#serviceForm").addEventListener("submit",e=>{e.preventDefault();requests.push({service:selectedService.name,name:$("#customerName").value.trim(),phone:$("#customerPhone").value.trim(),note:$("#customerNote").value.trim(),time:new Date().toISOString()});save();$("#serviceDialog").close();e.target.reset();alert("Demo request बन गई। यह किसी असली विभाग या सर्विस प्रोवाइडर को नहीं भेजी गई है।");goto("admin");});
$("#addMoney").addEventListener("click",()=>{const amount=Number(prompt("Demo में कितनी राशि जोड़ें? (₹)"));if(!Number.isFinite(amount)||amount<=0||amount>100000)return alert("₹1 से ₹1,00,000 तक वैध demo राशि डालें।");balance+=amount;transactions.push({title:"Demo Wallet Load",kind:"Credit",amount,time:new Date().toISOString(),status:"DEMO"});save();alert("Demo balance अपडेट हुआ। असली पैसा जमा नहीं हुआ।");});
$("#withdraw").addEventListener("click",()=>alert("Withdraw अभी demo-only है। असली withdrawal के लिए अधिकृत बैंक/पेमेंट पार्टनर, KYC और server-side verification आवश्यक है।"));
$("#search").addEventListener("input",e=>{const q=e.target.value.toLowerCase();document.querySelectorAll(".service").forEach(b=>b.hidden=!b.textContent.toLowerCase().includes(q));if(q)goto("services");});
$("#profileBtn").addEventListener("click",()=>alert("यूज़र प्रोफाइल demo है। Login/OTP और roles अभी configured नहीं हैं।"));
renderServices();renderWallet();renderTx();renderRequests();
