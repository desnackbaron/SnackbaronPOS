
const PRODUCTS=[{"id": "pulled-pork", "name": "Pulled Pork", "price": 10.0, "cat": "Specials"}, {"id": "smokey-chicken", "name": "Smokey Chicken", "price": 10.0, "cat": "Specials"}, {"id": "chicken-tandoori", "name": "Chicken Tandoori", "price": 10.0, "cat": "Specials"}, {"id": "hamburger", "name": "Hamburger", "price": 5.5, "cat": "Burgers"}, {"id": "cheeseburger", "name": "Cheeseburger", "price": 6.0, "cat": "Burgers"}, {"id": "cheeseburger-royale", "name": "Cheeseburger Royale", "price": 8.0, "cat": "Burgers"}, {"id": "spekburger", "name": "Spekburger", "price": 6.5, "cat": "Burgers"}, {"id": "broodje-curryworst", "name": "Broodje Curryworst", "price": 5.5, "cat": "Broodjes"}, {"id": "curryworst", "name": "Curryworst", "price": 2.5, "cat": "Snacks"}, {"id": "broodje-mexicano", "name": "Broodje Mexicano", "price": 7.5, "cat": "Broodjes"}, {"id": "broodje-mexicano-cheese", "name": "Mexicano Cheese", "price": 8.0, "cat": "Broodjes"}, {"id": "bicky-burger", "name": "Bicky Burger", "price": 5.5, "cat": "Burgers"}, {"id": "bicky-cheese", "name": "Bicky Cheese", "price": 6.0, "cat": "Burgers"}, {"id": "broodje-braadworst", "name": "Broodje Braadworst", "price": 8.0, "cat": "Broodjes"}, {"id": "braadworst", "name": "Braadworst", "price": 4.5, "cat": "Snacks"}, {"id": "extra-kaas", "name": "Extra kaas", "price": 0.5, "cat": "Extra's"}, {"id": "dubbel-spek", "name": "Dubbel spek", "price": 1.0, "cat": "Extra's"}, {"id": "plat-water", "name": "Plat water", "price": 2.2, "cat": "Dranken"}, {"id": "bruis-water", "name": "Bruis water", "price": 2.5, "cat": "Dranken"}, {"id": "cola", "name": "Cola", "price": 2.5, "cat": "Dranken"}, {"id": "cola-zero", "name": "Cola Zero", "price": 2.5, "cat": "Dranken"}, {"id": "dr-pepper", "name": "Dr Pepper", "price": 2.5, "cat": "Dranken"}, {"id": "fanta", "name": "Fanta", "price": 2.5, "cat": "Dranken"}, {"id": "sprite", "name": "Sprite", "price": 2.5, "cat": "Dranken"}, {"id": "jupiler", "name": "Jupiler", "price": 2.5, "cat": "Dranken"}, {"id": "ice-tea", "name": "Ice Tea", "price": 2.5, "cat": "Dranken"}, {"id": "ice-tea-peach", "name": "Ice Tea Peach", "price": 2.5, "cat": "Dranken"}, {"id": "red-bull", "name": "Red Bull", "price": 3.2, "cat": "Dranken"}, {"id": "monster", "name": "Monster", "price": 3.5, "cat": "Dranken"}];
const KEY="snackbaron_pos_v2";
let cart={};
let activeCategory="Alles";
let rushMode=false;
let editingSaleId=null;
let pendingPayment=null;

const euro=v=>new Intl.NumberFormat("nl-BE",{style:"currency",currency:"EUR"}).format(v);
const dateKey=()=>{
  const d=new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};
const getSales=()=>{try{return JSON.parse(localStorage.getItem(KEY))||[]}catch{return []}};
const saveSales=s=>localStorage.setItem(KEY,JSON.stringify(s));
const todaySales=()=>getSales().filter(s=>s.date===dateKey());
const nextOrderNo=()=>todaySales().reduce((m,s)=>Math.max(m,s.orderNo||0),0)+1;

function categories(){return ["Alles",...new Set(PRODUCTS.map(p=>p.cat))]}
function renderTabs(){
  document.getElementById("tabs").innerHTML=categories().map(c=>`<button class="${c===activeCategory?"active":""}" data-cat="${c}">${c}</button>`).join("");
  document.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{activeCategory=b.dataset.cat;renderTabs();renderProducts();});
}
function rushProducts(){
  const ids=["hamburger","cheeseburger","cheeseburger-royale","spekburger","broodje-mexicano","broodje-braadworst","cola","jupiler","plat-water"];
  return PRODUCTS.filter(p=>ids.includes(p.id));
}
function renderProducts(){
  const source=rushMode?rushProducts():PRODUCTS;
  const list=activeCategory==="Alles"?source:source.filter(p=>p.cat===activeCategory);
  document.getElementById("productGrid").innerHTML=list.map(p=>`
    <button class="product" data-id="${p.id}">
      <span class="product-name">${p.name}</span>
      <span class="product-price">${euro(p.price)}</span>
    </button>`).join("");
  document.querySelectorAll(".product").forEach(b=>b.onclick=()=>addToCart(b.dataset.id));
}
function addToCart(id){cart[id]=(cart[id]||0)+1;renderCart();}
function changeQty(id,d){cart[id]=(cart[id]||0)+d;if(cart[id]<=0)delete cart[id];renderCart();}
function cartRows(){
  return Object.entries(cart).map(([id,qty])=>{
    const p=PRODUCTS.find(x=>x.id===id);
    return {id:p.id,name:p.name,price:p.price,qty,total:p.price*qty};
  });
}
function cartTotal(){return cartRows().reduce((s,r)=>s+r.total,0)}
function renderCart(){
  const rows=cartRows();
  document.getElementById("cartItems").innerHTML=rows.length?rows.map(r=>`
    <div class="cart-line">
      <div>
        <strong>${r.name}</strong>
        <div class="qty">
          <button onclick="changeQty('${r.id}',-1)">−</button>
          <span>${r.qty}</span>
          <button onclick="changeQty('${r.id}',1)">+</button>
        </div>
      </div>
      <strong>${euro(r.total)}</strong>
    </div>`).join(""):`<div class="empty">Tik op een product om te starten.</div>`;
  document.getElementById("cartTotal").textContent=euro(cartTotal());
  document.getElementById("cartTitle").textContent=editingSaleId?"Bestelling aanpassen":"Nieuwe bestelling";
  document.getElementById("editHint").textContent=editingSaleId?"Wijzig producten en kies opnieuw de betaalmethode.":"";
}
function startPayment(type){
  if(!cartRows().length)return toast("De bestelling is leeg.");
  pendingPayment=type;
  if(type!=="Cash")return saveCurrentSale(type,null,null);
  openCashDialog();
}
function saveCurrentSale(payment,received,change){
  const rows=cartRows();
  const all=getSales();
  if(editingSaleId){
    const idx=all.findIndex(s=>s.id===editingSaleId);
    if(idx<0)return toast("Bestelling niet gevonden.");
    all[idx]={...all[idx],items:rows,total:cartTotal(),payment,received,change,edited:true,editedAt:new Date().toISOString()};
    saveSales(all);
    toast(`Bestelling #${all[idx].orderNo} aangepast.`);
  }else{
    const sale={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),orderNo:nextOrderNo(),date:dateKey(),timestamp:new Date().toISOString(),items:rows,total:cartTotal(),payment,received,change};
    all.push(sale);saveSales(all);toast(`Bestelling #${sale.orderNo} opgeslagen.`);
  }
  cart={};editingSaleId=null;pendingPayment=null;renderCart();renderOrders();
}
function openCashDialog(){
  const due=cartTotal();
  document.getElementById("cashDue").textContent=euro(due);
  document.getElementById("cashReceived").value="";
  document.getElementById("changeDue").textContent=euro(0);
  const vals=[due,Math.ceil(due/5)*5,Math.ceil(due/10)*10,20,50].filter((v,i,a)=>v>=due&&a.indexOf(v)===i).slice(0,4);
  document.getElementById("cashQuick").innerHTML=vals.map(v=>`<button data-value="${v}">${euro(v)}</button>`).join("");
  document.querySelectorAll("[data-value]").forEach(b=>b.onclick=()=>{document.getElementById("cashReceived").value=b.dataset.value;calcChange();});
  document.getElementById("cashDialog").showModal();
}
function calcChange(){
  const received=parseFloat((document.getElementById("cashReceived").value||"").replace(",","."));
  const change=isNaN(received)?0:received-cartTotal();
  document.getElementById("changeDue").textContent=euro(Math.max(0,change));
}
function confirmCash(){
  const received=parseFloat((document.getElementById("cashReceived").value||"").replace(",","."));
  if(isNaN(received)||received<cartTotal())return toast("Ontvangen bedrag is te laag.");
  const change=received-cartTotal();
  document.getElementById("cashDialog").close();
  saveCurrentSale("Cash",received,change);
}
function editSale(id){
  const sale=getSales().find(s=>s.id===id);
  if(!sale)return toast("Bestelling niet gevonden.");
  if(cartRows().length&&!confirm("De huidige bestelling vervangen?"))return;
  cart={};
  sale.items.forEach(i=>cart[i.id]=i.qty);
  editingSaleId=id;
  renderCart();
  document.getElementById("ordersDialog").close();
  toast(`Bestelling #${sale.orderNo} geopend.`);
}
function deleteSale(id){
  const all=getSales();
  const sale=all.find(s=>s.id===id);
  if(!sale)return;
  if(!confirm(`Bestelling #${sale.orderNo} verwijderen?`))return;
  saveSales(all.filter(s=>s.id!==id));
  if(editingSaleId===id){editingSaleId=null;cart={};renderCart();}
  renderOrders();toast("Bestelling verwijderd.");
}
function renderOrders(){
  const sales=[...todaySales()].sort((a,b)=>(b.orderNo||0)-(a.orderNo||0));
  document.getElementById("ordersList").innerHTML=sales.length?sales.map(s=>`
    <div class="order-row">
      <div>
        <h3>Bestelling #${s.orderNo}</h3>
        ${s.items.map(i=>`<p>${i.qty} × ${i.name}</p>`).join("")}
        <div class="order-meta">${new Date(s.timestamp).toLocaleTimeString("nl-BE",{hour:"2-digit",minute:"2-digit"})} · ${s.payment}${s.edited?" · aangepast":""}</div>
      </div>
      <div class="order-actions">
        <strong>${euro(s.total)}</strong>
        <div class="order-actions-row">
          <button class="soft small" onclick="editSale('${s.id}')">Aanpassen</button>
          <button class="danger small" onclick="deleteSale('${s.id}')">Verwijderen</button>
        </div>
      </div>
    </div>`).join(""):`<div class="empty">Nog geen bestellingen vandaag.</div>`;
}
function openOrders(){renderOrders();document.getElementById("ordersDialog").showModal();}
function openSummary(){
  const sales=todaySales(),turnover=sales.reduce((s,x)=>s+x.total,0),payments={},products={};
  sales.forEach(s=>{payments[s.payment]=(payments[s.payment]||0)+s.total;s.items.forEach(i=>{if(!products[i.name])products[i.name]={qty:0,total:0};products[i.name].qty+=i.qty;products[i.name].total+=i.total;})});
  const avg=sales.length?turnover/sales.length:0;
  const units=Object.values(products).reduce((s,x)=>s+x.qty,0);
  document.getElementById("summaryBody").innerHTML=`
    <div class="cards">
      <div class="cardbox"><span>Omzet</span><strong>${euro(turnover)}</strong></div>
      <div class="cardbox"><span>Bestellingen</span><strong>${sales.length}</strong></div>
      <div class="cardbox"><span>Gemiddeld ticket</span><strong>${euro(avg)}</strong></div>
      <div class="cardbox"><span>Verkochte stuks</span><strong>${units}</strong></div>
    </div>
    <h3>Betaalmethodes</h3>
    <table><tbody>${Object.entries(payments).map(([n,v])=>`<tr><td>${n}</td><td>${euro(v)}</td></tr>`).join("")||"<tr><td>Nog geen verkopen</td><td>€ 0,00</td></tr>"}</tbody></table>
    <h3>Producten</h3>
    <table><thead><tr><th>Product</th><th>Aantal</th><th>Omzet</th></tr></thead><tbody>${Object.entries(products).sort((a,b)=>b[1].qty-a[1].qty).map(([n,v])=>`<tr><td>${n}</td><td>${v.qty}</td><td>${euro(v.total)}</td></tr>`).join("")||"<tr><td>Nog geen verkopen</td><td>0</td><td>€ 0,00</td></tr>"}</tbody></table>`;
  document.getElementById("summaryDialog").showModal();
}
function exportCSV(){
  const data=[["Bestelnummer","Datum","Tijd","Betaalmethode","Product","Aantal","Prijs","Regeltotaal","Bestellingstotaal","Ontvangen","Wisselgeld"]];
  todaySales().forEach(s=>s.items.forEach(i=>data.push([s.orderNo,s.date,new Date(s.timestamp).toLocaleTimeString("nl-BE",{hour:"2-digit",minute:"2-digit"}),s.payment,i.name,i.qty,i.price.toFixed(2),i.total.toFixed(2),s.total.toFixed(2),s.received??"",s.change??""])));
  const csv="\ufeff"+data.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(";")).join("\n");
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download=`Snackbaron_${dateKey()}.csv`;a.click();
}
function toast(msg){const el=document.getElementById("toast");el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2000)}

document.getElementById("rushBtn").onclick=()=>{rushMode=!rushMode;document.body.classList.toggle("rush",rushMode);document.getElementById("rushBtn").textContent=rushMode?"Normale modus":"🔥 Druktemodus";activeCategory="Alles";renderTabs();renderProducts();};
document.getElementById("ordersBtn").onclick=openOrders;
document.getElementById("summaryBtn").onclick=openSummary;
document.getElementById("ordersCloseBtn").onclick=()=>document.getElementById("ordersDialog").close();
document.getElementById("summaryCloseBtn").onclick=()=>document.getElementById("summaryDialog").close();
document.getElementById("cashCloseBtn").onclick=()=>document.getElementById("cashDialog").close();
document.getElementById("cashReceived").oninput=calcChange;
document.getElementById("cashConfirmBtn").onclick=confirmCash;
document.getElementById("csvBtn").onclick=exportCSV;
document.getElementById("resetBtn").onclick=()=>{if(confirm("Alle bestellingen van vandaag verwijderen? Exporteer eerst je CSV.")){saveSales(getSales().filter(s=>s.date!==dateKey()));cart={};editingSaleId=null;renderCart();openSummary();toast("Nieuwe dag gestart.");}};
document.getElementById("clearBtn").onclick=()=>{if(cartRows().length&&confirm(editingSaleId?"Aanpassing annuleren?":"Bestelling wissen?")){cart={};editingSaleId=null;renderCart();}};
document.querySelectorAll("[data-pay]").forEach(b=>b.onclick=()=>startPayment(b.dataset.pay));

renderTabs();renderProducts();renderCart();
if("serviceWorker" in navigator)navigator.serviceWorker.register("service-worker.js").catch(()=>{});
