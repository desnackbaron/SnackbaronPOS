
const PRODUCTS = [{"id": "pulled-pork", "name": "Pulled Pork", "price": 10.0, "cat": "Specials"}, {"id": "smokey-chicken", "name": "Smokey Chicken", "price": 10.0, "cat": "Specials"}, {"id": "chicken-tandoori", "name": "Chicken Tandoori", "price": 10.0, "cat": "Specials"}, {"id": "hamburger", "name": "Hamburger", "price": 5.5, "cat": "Burgers"}, {"id": "cheeseburger", "name": "Cheeseburger", "price": 6.0, "cat": "Burgers"}, {"id": "cheeseburger-royale", "name": "Cheeseburger Royale", "price": 8.0, "cat": "Burgers"}, {"id": "spekburger", "name": "Spekburger", "price": 6.5, "cat": "Burgers"}, {"id": "broodje-curryworst", "name": "Broodje Curryworst", "price": 5.5, "cat": "Broodjes"}, {"id": "curryworst", "name": "Curryworst", "price": 2.5, "cat": "Snacks"}, {"id": "broodje-mexicano", "name": "Broodje Mexicano", "price": 7.5, "cat": "Broodjes"}, {"id": "broodje-mexicano-cheese", "name": "Mexicano Cheese", "price": 8.0, "cat": "Broodjes"}, {"id": "bicky-burger", "name": "Bicky Burger", "price": 5.5, "cat": "Burgers"}, {"id": "bicky-cheese", "name": "Bicky Cheese", "price": 6.0, "cat": "Burgers"}, {"id": "broodje-braadworst", "name": "Broodje Braadworst", "price": 8.0, "cat": "Broodjes"}, {"id": "braadworst", "name": "Braadworst", "price": 4.5, "cat": "Snacks"}, {"id": "extra-kaas", "name": "Extra kaas", "price": 0.5, "cat": "Extra's"}, {"id": "plat-water", "name": "Plat water", "price": 2.2, "cat": "Dranken"}, {"id": "bruis-water", "name": "Bruis water", "price": 2.5, "cat": "Dranken"}, {"id": "cola", "name": "Cola", "price": 2.5, "cat": "Dranken"}, {"id": "cola-zero", "name": "Cola Zero", "price": 2.5, "cat": "Dranken"}, {"id": "dr-pepper", "name": "Dr Pepper", "price": 2.5, "cat": "Dranken"}, {"id": "fanta", "name": "Fanta", "price": 2.5, "cat": "Dranken"}, {"id": "sprite", "name": "Sprite", "price": 2.5, "cat": "Dranken"}, {"id": "jupiler", "name": "Jupiler", "price": 2.5, "cat": "Dranken"}, {"id": "ice-tea", "name": "Ice Tea", "price": 2.5, "cat": "Dranken"}, {"id": "ice-tea-peach", "name": "Ice Tea Peach", "price": 2.5, "cat": "Dranken"}, {"id": "red-bull", "name": "Red Bull", "price": 3.2, "cat": "Dranken"}, {"id": "monster", "name": "Monster", "price": 3.5, "cat": "Dranken"}];
const STORAGE_KEY = "snackbaron_sales_v1";
let cart = {};
let activeCategory = "Alles";

const euro = value => new Intl.NumberFormat("nl-BE", {style:"currency", currency:"EUR"}).format(value);
const todayKey = () => new Date().toISOString().slice(0,10);

function getSales(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function saveSales(sales){ localStorage.setItem(STORAGE_KEY, JSON.stringify(sales)); }

function categories(){
  return ["Alles", ...new Set(PRODUCTS.map(p=>p.cat))];
}
function renderTabs(){
  const el = document.getElementById("categoryTabs");
  el.innerHTML = categories().map(c=>`<button class="${c===activeCategory?"active":""}" data-cat="${c}">${c}</button>`).join("");
  el.querySelectorAll("button").forEach(b=>b.onclick=()=>{activeCategory=b.dataset.cat;renderTabs();renderProducts();});
}
function renderProducts(){
  const list = activeCategory==="Alles" ? PRODUCTS : PRODUCTS.filter(p=>p.cat===activeCategory);
  document.getElementById("productGrid").innerHTML = list.map(p=>`
    <button class="product-btn" data-id="${p.id}">
      <span class="product-name">${p.name}</span>
      <span class="product-price">${euro(p.price)}</span>
    </button>`).join("");
  document.querySelectorAll(".product-btn").forEach(b=>b.onclick=()=>addToCart(b.dataset.id));
}
function addToCart(id){
  cart[id]=(cart[id]||0)+1;
  renderCart();
}
function changeQty(id, delta){
  cart[id]=(cart[id]||0)+delta;
  if(cart[id]<=0) delete cart[id];
  renderCart();
}
function cartRows(){
  return Object.entries(cart).map(([id,qty])=>{
    const p=PRODUCTS.find(x=>x.id===id);
    return {...p, qty, total:p.price*qty};
  });
}
function cartTotal(){ return cartRows().reduce((s,r)=>s+r.total,0); }
function renderCart(){
  const rows=cartRows();
  const el=document.getElementById("cartItems");
  el.innerHTML = rows.length ? rows.map(r=>`
    <div class="cart-line">
      <div>
        <strong>${r.name}</strong>
        <div class="qty-controls">
          <button onclick="changeQty('${r.id}',-1)">−</button>
          <span>${r.qty}</span>
          <button onclick="changeQty('${r.id}',1)">+</button>
        </div>
      </div>
      <div class="line-price">${euro(r.total)}</div>
    </div>`).join("") : `<div class="empty">Tik op een product om te starten.</div>`;
  document.getElementById("cartTotal").textContent=euro(cartTotal());
}
function checkout(payment){
  const rows=cartRows();
  if(!rows.length) return toast("De bestelling is leeg.");
  const sale={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),timestamp:new Date().toISOString(),date:todayKey(),payment,items:rows,total:cartTotal()};
  const sales=getSales(); sales.push(sale); saveSales(sales);
  cart={}; renderCart(); toast(`Verkoop opgeslagen: ${euro(sale.total)} via ${payment}`);
}
function todaysSales(){ return getSales().filter(s=>s.date===todayKey()); }
function summaryHtml(){
  const sales=todaysSales();
  const turnover=sales.reduce((s,x)=>s+x.total,0);
  const avg=sales.length?turnover/sales.length:0;
  const payments={};
  const products={};
  sales.forEach(s=>{
    payments[s.payment]=(payments[s.payment]||0)+s.total;
    s.items.forEach(i=>{
      if(!products[i.name]) products[i.name]={qty:0,total:0};
      products[i.name].qty+=i.qty; products[i.name].total+=i.total;
    });
  });
  const payRows=Object.entries(payments).sort((a,b)=>b[1]-a[1]).map(([n,v])=>`<tr><td>${n}</td><td>${euro(v)}</td></tr>`).join("");
  const prodRows=Object.entries(products).sort((a,b)=>b[1].qty-a[1].qty).map(([n,v])=>`<tr><td>${n}</td><td>${v.qty}</td><td>${euro(v.total)}</td></tr>`).join("");
  return `
    <div class="summary-cards">
      <div class="summary-card"><span>Omzet</span><strong>${euro(turnover)}</strong></div>
      <div class="summary-card"><span>Bestellingen</span><strong>${sales.length}</strong></div>
      <div class="summary-card"><span>Gemiddelde ticket</span><strong>${euro(avg)}</strong></div>
      <div class="summary-card"><span>Verkochte stuks</span><strong>${Object.values(products).reduce((s,x)=>s+x.qty,0)}</strong></div>
    </div>
    <h3>Betaalmethodes</h3>
    <table class="summary-table"><tbody>${payRows||"<tr><td>Nog geen verkopen</td><td>€ 0,00</td></tr>"}</tbody></table>
    <h3>Producten</h3>
    <table class="summary-table"><thead><tr><th>Product</th><th>Aantal</th><th>Omzet</th></tr></thead><tbody>${prodRows||"<tr><td>Nog geen verkopen</td><td>0</td><td>€ 0,00</td></tr>"}</tbody></table>`;
}
function openSummary(){
  document.getElementById("summaryContent").innerHTML=summaryHtml();
  document.getElementById("summaryDialog").showModal();
}
function exportCSV(){
  const rows=[["Datum","Tijd","Betaalmethode","Product","Aantal","Prijs per stuk","Totaal regel","Totaal bestelling"]];
  todaysSales().forEach(s=>s.items.forEach(i=>rows.push([
    s.date,new Date(s.timestamp).toLocaleTimeString("nl-BE",{hour:"2-digit",minute:"2-digit"}),
    s.payment,i.name,i.qty,i.price.toFixed(2),i.total.toFixed(2),s.total.toFixed(2)
  ])));
  const csv=rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(";")).join("\n");
  const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=`Snackbaron_${todayKey()}.csv`; a.click();
}
function undoLastSale(){
  const sales=getSales(); const idx=[...sales].map((s,i)=>({s,i})).reverse().find(x=>x.s.date===todayKey());
  if(!idx) return toast("Er is geen verkoop om te verwijderen.");
  if(confirm(`Laatste verkoop van ${euro(idx.s.total)} verwijderen?`)){
    sales.splice(idx.i,1); saveSales(sales); openSummary(); toast("Laatste verkoop verwijderd.");
  }
}
function resetDay(){
  const sales=getSales();
  if(!todaysSales().length) return toast("Er zijn vandaag nog geen verkopen.");
  if(confirm("Alle verkopen van vandaag verwijderen? Exporteer eerst je CSV.")){
    saveSales(sales.filter(s=>s.date!==todayKey())); openSummary(); toast("Nieuwe dag gestart.");
  }
}
function toast(msg){
  const el=document.getElementById("toast"); el.textContent=msg; el.classList.add("show");
  setTimeout(()=>el.classList.remove("show"),2200);
}

document.getElementById("clearCartBtn").onclick=()=>{ if(cartRows().length && confirm("Bestelling wissen?")){cart={};renderCart();} };
document.querySelectorAll("[data-payment]").forEach(b=>b.onclick=()=>checkout(b.dataset.payment));
document.getElementById("summaryBtn").onclick=openSummary;
document.getElementById("closeSummaryBtn").onclick=()=>document.getElementById("summaryDialog").close();
document.getElementById("exportBtn").onclick=exportCSV;
document.getElementById("undoSaleBtn").onclick=undoLastSale;
document.getElementById("resetDayBtn").onclick=resetDay;
document.getElementById("fullscreenBtn").onclick=()=>document.documentElement.requestFullscreen?.();

renderTabs(); renderProducts(); renderCart();

if("serviceWorker" in navigator) navigator.serviceWorker.register("service-worker.js").catch(()=>{});
