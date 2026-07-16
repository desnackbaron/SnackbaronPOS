
const PRODUCTS=[{"id": "pulled-pork", "name": "Pulled Pork", "price": 10.0, "cat": "Specials"}, {"id": "smokey-chicken", "name": "Smokey Chicken", "price": 10.0, "cat": "Specials"}, {"id": "chicken-tandoori", "name": "Chicken Tandoori", "price": 10.0, "cat": "Specials"}, {"id": "hamburger", "name": "Hamburger", "price": 5.5, "cat": "Burgers"}, {"id": "cheeseburger", "name": "Cheeseburger", "price": 6.0, "cat": "Burgers"}, {"id": "cheeseburger-royale", "name": "Cheeseburger Royale", "price": 8.0, "cat": "Burgers"}, {"id": "spekburger", "name": "Spekburger", "price": 6.5, "cat": "Burgers"}, {"id": "broodje-curryworst", "name": "Broodje Curryworst", "price": 5.5, "cat": "Broodjes"}, {"id": "curryworst", "name": "Curryworst", "price": 2.5, "cat": "Snacks"}, {"id": "broodje-mexicano", "name": "Broodje Mexicano", "price": 7.5, "cat": "Broodjes"}, {"id": "broodje-mexicano-cheese", "name": "Mexicano Cheese", "price": 8.0, "cat": "Broodjes"}, {"id": "bicky-burger", "name": "Bicky Burger", "price": 5.5, "cat": "Burgers"}, {"id": "bicky-cheese", "name": "Bicky Cheese", "price": 6.0, "cat": "Burgers"}, {"id": "broodje-braadworst", "name": "Broodje Braadworst", "price": 8.0, "cat": "Broodjes"}, {"id": "braadworst", "name": "Braadworst", "price": 4.5, "cat": "Snacks"}, {"id": "extra-kaas", "name": "Extra kaas", "price": 0.5, "cat": "Extra's"}, {"id": "dubbel-spek", "name": "Dubbel spek", "price": 1.0, "cat": "Extra's"}, {"id": "plat-water", "name": "Plat water", "price": 2.2, "cat": "Dranken", "image": "images/plat-water.png"}, {"id": "bruis-water", "name": "Bruis water", "price": 2.5, "cat": "Dranken", "image": "images/bruis-water.png"}, {"id": "cola", "name": "Cola", "price": 2.5, "cat": "Dranken", "image": "images/cola.png"}, {"id": "cola-zero", "name": "Cola Zero", "price": 2.5, "cat": "Dranken", "image": "images/cola-zero.png"}, {"id": "dr-pepper", "name": "Dr Pepper", "price": 2.5, "cat": "Dranken", "image": "images/dr-pepper.png"}, {"id": "fanta", "name": "Fanta", "price": 2.5, "cat": "Dranken", "image": "images/fanta.png"}, {"id": "sprite", "name": "Sprite", "price": 2.5, "cat": "Dranken", "image": "images/sprite.png"}, {"id": "jupiler", "name": "Jupiler", "price": 2.5, "cat": "Dranken", "image": "images/jupiler.png"},{"id": "jupiler-00", "name": "Jupiler 0.0", "price": 2.5, "cat": "Dranken", "image": "images/jupiler-00.png"}, {"id": "ice-tea", "name": "Ice Tea", "price": 2.5, "cat": "Dranken", "image": "images/ice-tea.png"}, {"id": "ice-tea-peach", "name": "Ice Tea Peach", "price": 2.5, "cat": "Dranken", "image": "images/ice-tea-peach.png"}, {"id": "red-bull", "name": "Red Bull", "price": 3.2, "cat": "Dranken", "image": "images/red-bull.png"}, {"id": "monster", "name": "Monster", "price": 3.5, "cat": "Dranken", "image": "images/monster.png"}];
const COSTS={"hamburger": 1.456, "cheeseburger": 1.406, "cheeseburger-royale": 2.147, "spekburger": 1.77, "bicky-burger": 1.547, "bicky-cheese": 1.7, "broodje-mexicano": 2.276, "broodje-mexicano-cheese": 2.476, "broodje-braadworst": 2.567, "braadworst": 1.478, "pulled-pork": 3.415, "smokey-chicken": 3.289, "chicken-tandoori": 3.37, "broodje-curryworst": 1.519, "curryworst": 0.53, "extra-kaas": 0.2, "plat-water": 0.442, "bruis-water": 0.547, "cola": 0.915, "cola-zero": 0.952, "fanta": 0.951, "sprite": 0.664, "jupiler": 1.08, "jupiler-00": 0.88, "red-bull": 1.367, "ice-tea": 0.68, "ice-tea-peach": 0.837, "dr-pepper": 0.863};
const KEY="snackbaron_pos_v2";
const HELD_KEY="snackbaron_pos_held_v1";
let cart={};
let activeCategory="Alles";
let editingSaleId=null;
let pendingPayment=null;
let cashCents="";

const euro=v=>new Intl.NumberFormat("nl-BE",{style:"currency",currency:"EUR"}).format(v);
const dateKey=()=>{
  const d=new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};
const getSales=()=>{try{return JSON.parse(localStorage.getItem(KEY))||[]}catch{return []}};
const saveSales=s=>localStorage.setItem(KEY,JSON.stringify(s));
const todaySales=()=>getSales().filter(s=>s.date===dateKey());
const nextOrderNo=()=>todaySales().reduce((m,s)=>Math.max(m,s.orderNo||0),0)+1;
const getHeld=()=>{try{return JSON.parse(localStorage.getItem(HELD_KEY))||[]}catch{return []}};
const saveHeld=h=>{localStorage.setItem(HELD_KEY,JSON.stringify(h));updateHeldCount();};
function updateHeldCount(){document.getElementById("heldCount").textContent=getHeld().length;}


function categories(){return ["Alles",...new Set(PRODUCTS.map(p=>p.cat))]}
function renderTabs(){
  document.getElementById("tabs").innerHTML=categories().map(c=>`<button class="${c===activeCategory?"active":""}" data-cat="${c}">${c}</button>`).join("");
  document.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{activeCategory=b.dataset.cat;renderTabs();renderProducts();});
}
function renderProducts(){
  const list=activeCategory==="Alles"?PRODUCTS:PRODUCTS.filter(p=>p.cat===activeCategory);
  document.getElementById("productGrid").innerHTML=list.map(p=>`
    <button class="product ${p.image ? "has-image" : ""}" data-id="${p.id}">
      ${p.image ? `<img class="product-image" src="${p.image}" alt="${p.name}">` : ""}
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
function itemCost(item){
  return Object.prototype.hasOwnProperty.call(COSTS,item.id) ? COSTS[item.id] : null;
}
function rowsFoodcost(rows){
  return rows.reduce((sum,item)=>{
    const cost=itemCost(item);
    return sum+(cost===null?0:cost*item.qty);
  },0);
}
function rowsUnknownCostIds(rows){
  return [...new Set(rows.filter(item=>itemCost(item)===null).map(item=>item.id))];
}
function rowsGrossProfit(rows){
  return rows.reduce((sum,item)=>{
    const cost=itemCost(item);
    return sum+(cost===null?0:(item.price-cost)*item.qty);
  },0);
}
function saleFoodcost(sale){return rowsFoodcost(sale.items||[])}
function saleGrossProfit(sale){return rowsGrossProfit(sale.items||[])}

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
  document.getElementById("cartFoodcost").textContent=euro(rowsFoodcost(rows));
  document.getElementById("cartGrossProfit").textContent=euro(rowsGrossProfit(rows));
  document.getElementById("cartTitle").firstChild.textContent=editingSaleId?"Bestelling aanpassen ":"Nieuwe bestelling ";
  document.getElementById("nextOrderBadge").textContent=editingSaleId?"#"+(getSales().find(s=>s.id===editingSaleId)?.orderNo||"?"):"#"+nextOrderNo();
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
  cart={};editingSaleId=null;pendingPayment=null;renderCart();renderOrders();updateCustomerCounter();
}
function cashValue(){
  return cashCents ? Number(cashCents)/100 : 0;
}
function renderCashInput(){
  document.getElementById("cashReceived").value=euro(cashValue());
  calcChange();
}
function setCashAmount(value){
  cashCents=String(Math.round(Number(value)*100));
  renderCashInput();
}
function cashKey(key){
  if(key==="clear") cashCents="";
  else if(key==="back") cashCents=cashCents.slice(0,-1);
  else if(/^\d$/.test(key)){
    if(cashCents.length<7) cashCents=(cashCents+key).replace(/^0+(?=\d)/,"");
  }
  renderCashInput();
}
function openCashDialog(){
  const due=cartTotal();
  cashCents="";
  document.getElementById("cashDue").textContent=euro(due);
  const vals=[due,Math.ceil(due/5)*5,Math.ceil(due/10)*10,20,50]
    .filter((v,i,a)=>v>=due&&a.indexOf(v)===i).slice(0,4);
  document.getElementById("cashQuick").innerHTML=vals
    .map(v=>`<button data-value="${v}">${euro(v)}</button>`).join("");
  document.querySelectorAll("[data-value]").forEach(b=>b.onclick=()=>setCashAmount(b.dataset.value));
  renderCashInput();
  document.getElementById("cashDialog").showModal();
}
function calcChange(){
  const change=cashValue()-cartTotal();
  document.getElementById("changeDue").textContent=euro(Math.max(0,change));
}
function confirmCash(){
  const received=cashValue();
  if(received<cartTotal())return toast("Ontvangen bedrag is te laag.");
  const change=received-cartTotal();
  document.getElementById("cashDialog").close();
  saveCurrentSale("Cash",received,change);
}

function newCustomer(){
  if(editingSaleId){
    if(!confirm("Je past momenteel een eerdere bestelling aan. Aanpassing annuleren en een nieuwe klant starten?")) return;
    editingSaleId=null;
    cart={};
    renderCart();
    toast("Nieuwe klant gestart.");
    return;
  }
  if(cartRows().length){
    if(!confirm("Deze bestelling is nog niet betaald. Wissen en een nieuwe klant starten?")) return;
  }
  cart={};
  renderCart();
  toast("Nieuwe klant gestart.");
}
function holdCurrentOrder(){
  const rows=cartRows();
  if(!rows.length)return toast("De bestelling is leeg.");
  if(editingSaleId)return toast("Sla eerst de aanpassing op of annuleer ze.");
  const held=getHeld();
  held.push({
    id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),
    createdAt:new Date().toISOString(),
    items:rows,
    total:cartTotal()
  });
  saveHeld(held);
  cart={};
  renderCart();
  toast("Bestelling in wacht gezet.");
}
function renderHeld(){
  const held=getHeld();
  document.getElementById("heldList").innerHTML=held.length?held.map((h,idx)=>`
    <div class="held-row">
      <div>
        <h3>Wachtende bestelling ${idx+1}</h3>
        ${h.items.map(i=>`<p>${i.qty} × ${i.name}</p>`).join("")}
        <small>${new Date(h.createdAt).toLocaleTimeString("nl-BE",{hour:"2-digit",minute:"2-digit"})}</small>
      </div>
      <div class="held-actions">
        <strong>${euro(h.total)}</strong>
        <button class="soft small" onclick="resumeHeld('${h.id}')">Verdergaan</button>
        <button class="danger small" onclick="deleteHeld('${h.id}')">Verwijderen</button>
      </div>
    </div>`).join(""):`<div class="empty">Geen wachtende bestellingen.</div>`;
}
function openHeld(){
  renderHeld();
  document.getElementById("heldDialog").showModal();
}
function resumeHeld(id){
  if(cartRows().length&&!confirm("De huidige bestelling vervangen?"))return;
  const held=getHeld();
  const found=held.find(h=>h.id===id);
  if(!found)return;
  cart={};
  found.items.forEach(i=>cart[i.id]=i.qty);
  saveHeld(held.filter(h=>h.id!==id));
  renderCart();
  document.getElementById("heldDialog").close();
  toast("Wachtende bestelling geopend.");
}
function deleteHeld(id){
  if(!confirm("Wachtende bestelling verwijderen?"))return;
  saveHeld(getHeld().filter(h=>h.id!==id));
  renderHeld();
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
        <div class="order-meta">${new Date(s.timestamp).toLocaleTimeString("nl-BE",{hour:"2-digit",minute:"2-digit"})} · ${s.payment}${s.edited?" · aangepast":""}</div><div class="order-meta">Foodcost ${euro(saleFoodcost(s))} · Brutowinst ${euro(saleGrossProfit(s))}</div>
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


function openCockpit(){
  const sales=todaySales();
  const turnover=sales.reduce((sum,s)=>sum+s.total,0);
  const avg=sales.length?turnover/sales.length:0;
  const totalFoodcost=sales.reduce((sum,s)=>sum+saleFoodcost(s),0);
  const totalGrossProfit=sales.reduce((sum,s)=>sum+saleGrossProfit(s),0);
  const productStats={};
  const paymentStats={};

  sales.forEach(s=>{
    paymentStats[s.payment]=(paymentStats[s.payment]||0)+s.total;
    s.items.forEach(i=>{
      if(!productStats[i.name]) productStats[i.name]={qty:0,total:0};
      productStats[i.name].qty+=i.qty;
      productStats[i.name].total+=i.total;
    });
  });

  const topProducts=Object.entries(productStats)
    .sort((a,b)=>b[1].qty-a[1].qty)
    .slice(0,5);

  const hours={};
  sales.forEach(s=>{
    const hour=new Date(s.timestamp).getHours();
    hours[hour]=(hours[hour]||0)+1;
  });
  const busiest=Object.entries(hours).sort((a,b)=>b[1]-a[1])[0];

  const drinkNames=PRODUCTS.filter(p=>p.cat==="Dranken").map(p=>p.name);
  let drinks=0;
  let food=0;
  sales.forEach(s=>s.items.forEach(i=>{
    if(drinkNames.includes(i.name)) drinks+=i.qty;
    else food+=i.qty;
  }));
  const drinkRatio=(drinks+food)?(drinks/(drinks+food))*100:0;

  document.getElementById("cockpitBody").innerHTML=`
    <div class="cockpit-grid">
      <div class="cockpit-card"><span>Omzet vandaag</span><strong>${euro(turnover)}</strong></div>
      <div class="cockpit-card"><span>Klanten</span><strong>${sales.length}</strong></div>
      <div class="cockpit-card"><span>Gemiddeld ticket</span><strong>${euro(avg)}</strong></div><div class="cockpit-card"><span>Foodcost vandaag</span><strong>${euro(totalFoodcost)}</strong></div><div class="cockpit-card"><span>Brutowinst vandaag</span><strong>${euro(totalGrossProfit)}</strong></div>
      <div class="cockpit-card"><span>Drank aandeel</span><strong>${drinkRatio.toFixed(0)}%</strong></div>
      <div class="cockpit-card"><span>Drukste uur</span><strong>${busiest?String(busiest[0]).padStart(2,"0")+":00":"—"}</strong></div>
      <div class="cockpit-card"><span>Wachtende bestellingen</span><strong>${getHeld().length}</strong></div>
    </div>

    <h3>Topproducten</h3>
    <div class="cockpit-list">
      ${topProducts.length?topProducts.map(([name,v],idx)=>`
        <div class="cockpit-list-row">
          <span>${idx+1}. ${name}</span>
          <strong>${v.qty} stuks · ${euro(v.total)}</strong>
        </div>`).join(""):`<div class="empty">Nog geen verkopen vandaag.</div>`}
    </div>

    <h3>Betaalmethodes</h3>
    <div class="cockpit-list">
      ${Object.entries(paymentStats).length?Object.entries(paymentStats).map(([name,total])=>`
        <div class="cockpit-list-row">
          <span>${name}</span>
          <strong>${euro(total)}</strong>
        </div>`).join(""):`<div class="empty">Nog geen verkopen vandaag.</div>`}
    </div>`;
  document.getElementById("cockpitDialog").showModal();
}

function openTraffic(){
  const sales=todaySales();
  const hours={};

  sales.forEach(s=>{
    const d=new Date(s.timestamp);
    const hour=d.getHours();
    hours[hour]=(hours[hour]||0)+1;
  });

  const startHour=sales.length?Math.min(...sales.map(s=>new Date(s.timestamp).getHours())):10;
  const endHour=sales.length?Math.max(...sales.map(s=>new Date(s.timestamp).getHours())):18;
  const maxCount=Math.max(1,...Object.values(hours));
  const busiestEntry=Object.entries(hours).sort((a,b)=>b[1]-a[1])[0];
  const quietEntries=Object.entries(hours).sort((a,b)=>a[1]-b[1]);
  const quietestEntry=quietEntries[0];
  const avg=sales.length? sales.length / Math.max(1,(endHour-startHour+1)) : 0;

  let rows="";
  for(let h=startHour;h<=endHour;h++){
    const count=hours[h]||0;
    const width=(count/maxCount)*100;
    rows+=`
      <div class="traffic-row">
        <div class="traffic-hour">${String(h).padStart(2,"0")}:00</div>
        <div class="traffic-bar-wrap">
          <div class="traffic-bar" style="width:${width}%"></div>
        </div>
        <div class="traffic-count">${count} klant${count===1?"":"en"}</div>
      </div>`;
  }

  const busiestText=busiestEntry
    ? `${String(busiestEntry[0]).padStart(2,"0")}:00 · ${busiestEntry[1]} klanten`
    : "Nog geen gegevens";

  const quietestText=quietestEntry
    ? `${String(quietestEntry[0]).padStart(2,"0")}:00 · ${quietestEntry[1]} klanten`
    : "Nog geen gegevens";

  document.getElementById("trafficBody").innerHTML=`
    <div class="traffic-summary">
      <div class="traffic-card"><span>Drukste uur</span><strong>${busiestText}</strong></div>
      <div class="traffic-card"><span>Kalmste uur</span><strong>${quietestText}</strong></div>
      <div class="traffic-card"><span>Gemiddeld per uur</span><strong>${avg.toFixed(1).replace(".",",")}</strong></div>
    </div>
    ${rows || '<div class="empty">Nog geen verkopen vandaag.</div>'}
    <div class="traffic-note">
      Gebruik dit overzicht na enkele verkoopdagen om rustige momenten te herkennen.
      Uren zonder verkoop blijven zichtbaar met 0 klanten.
    </div>`;
  document.getElementById("trafficDialog").showModal();
}

function openSummary(){
  const sales=todaySales(),turnover=sales.reduce((s,x)=>s+x.total,0),payments={},products={};
  sales.forEach(s=>{payments[s.payment]=(payments[s.payment]||0)+s.total;s.items.forEach(i=>{if(!products[i.name])products[i.name]={qty:0,total:0};products[i.name].qty+=i.qty;products[i.name].total+=i.total;})});
  const avg=sales.length?turnover/sales.length:0;
  const units=Object.values(products).reduce((s,x)=>s+x.qty,0);
  const totalFoodcost=sales.reduce((sum,s)=>sum+saleFoodcost(s),0);
  const totalGrossProfit=sales.reduce((sum,s)=>sum+saleGrossProfit(s),0);
  const unknownIds=[...new Set(sales.flatMap(s=>rowsUnknownCostIds(s.items||[])))];
  document.getElementById("summaryBody").innerHTML=`
    <div class="cards">
      <div class="cardbox"><span>Omzet</span><strong>${euro(turnover)}</strong></div>
      <div class="cardbox"><span>Bestellingen</span><strong>${sales.length}</strong></div>
      <div class="cardbox"><span>Gemiddeld ticket</span><strong>${euro(avg)}</strong></div>
      <div class="cardbox"><span>Verkochte stuks</span><strong>${units}</strong></div><div class="cardbox"><span>Foodcost</span><strong>${euro(totalFoodcost)}</strong></div><div class="cardbox"><span>Brutowinst</span><strong>${euro(totalGrossProfit)}</strong></div>
    </div>
    <h3>Betaalmethodes</h3>
    <table><tbody>${Object.entries(payments).map(([n,v])=>`<tr><td>${n}</td><td>${euro(v)}</td></tr>`).join("")||"<tr><td>Nog geen verkopen</td><td>€ 0,00</td></tr>"}</tbody></table>
    <h3>Producten</h3>
    <table><thead><tr><th>Product</th><th>Aantal</th><th>Omzet</th></tr></thead><tbody>${Object.entries(products).sort((a,b)=>b[1].qty-a[1].qty).map(([n,v])=>`<tr><td>${n}</td><td>${v.qty}</td><td>${euro(v.total)}</td></tr>`).join("")||"<tr><td>Nog geen verkopen</td><td>0</td><td>€ 0,00</td></tr>"}</tbody></table>
    ${unknownIds.length?`<div class="finance-warning">Geen kostprijs ingesteld voor: ${unknownIds.map(id=>PRODUCTS.find(p=>p.id===id)?.name||id).join(", ")}. Deze producten tellen nog niet mee in foodcost en brutowinst.</div>`:""}`;
  document.getElementById("summaryDialog").showModal();
}
function exportCSV(){
  const data=[["Bestelnummer","Datum","Tijd","Betaalmethode","Product","Aantal","Prijs","Regeltotaal","Bestellingstotaal","Ontvangen","Wisselgeld"]];
  todaySales().forEach(s=>s.items.forEach(i=>data.push([s.orderNo,s.date,new Date(s.timestamp).toLocaleTimeString("nl-BE",{hour:"2-digit",minute:"2-digit"}),s.payment,i.name,i.qty,i.price.toFixed(2),i.total.toFixed(2),s.total.toFixed(2),s.received??"",s.change??""])));
  const csv="\ufeff"+data.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(";")).join("\n");
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download=`Snackbaron_${dateKey()}.csv`;a.click();
}
function updateCustomerCounter(){
 document.getElementById("customerNo").textContent=String(todaySales().length+1);
}

function updateConnectionStatus(){
  const el=document.getElementById("connectionStatus");
  if(!el)return;
  const online=navigator.onLine;
  el.textContent=online?"● Online":"● Offline";
  el.classList.toggle("online",online);
  el.classList.toggle("offline",!online);
}
window.addEventListener("online",()=>{
  updateConnectionStatus();
  toast("Internetverbinding hersteld.");
});
window.addEventListener("offline",()=>{
  updateConnectionStatus();
  toast("Offline modus actief. Verkopen blijven bewaard.");
});


function exportSnackbaronPRO(){
  const sales=todaySales();
  if(!sales.length)return toast("Nog geen verkopen om te exporteren.");

  const counts={};
  sales.forEach(s=>(s.items||[]).forEach(i=>counts[i.id]=(counts[i.id]||0)+i.qty));

  const total=sales.reduce((sum,s)=>sum+s.total,0);
  const foodcost=sales.reduce((sum,s)=>sum+saleFoodcost(s),0);
  const gross=sales.reduce((sum,s)=>sum+saleGrossProfit(s),0);
  const cash=sales.filter(s=>s.payment==="Cash").reduce((sum,s)=>sum+s.total,0);
  const payconiq=sales.filter(s=>s.payment==="Payconiq").reduce((sum,s)=>sum+s.total,0);

  const header=[
    "Datum","Dag","Week","Maand","Standplaats","Weer","Personeel","Klanten",
    "Hamburger","Angus Beefburger","Kip Burger XL","Cheeseburger","Cheeseburger Royale",
    "Spekburger","Bicky","Bicky Cheese","Mexicano","Mexicano Cheese","Broodje Braadworst",
    "Losse Braadworst","Pulled Pork","Smokey Chicken","Chicken Tandoori","BR.Curry worst",
    "Losse Curry Worst","Extra Kaas ","Water","Bruis","Cola","Cola Zero","Fanta","Sprite",
    "Jupiler","Jupiler 0,0","Red Bull","Ice Tea","Peach","Dr Pepper",
    "Food stuks","Drank stuks","Totaal stuks","Theoretische omzet","Theoretische kost",
    "Brutowinst","Cash","Payconiq","Werkelijke omzet","Verschil","Gas/Diesel","Standgeld",
    "Overige kosten","Netto dagresultaat","Opmerking","Aantal Lepinja's","Aantal buns","Aantal Bicky broodjes"
  ];

  const foodIds=PRODUCTS.filter(p=>p.cat!=="Dranken").map(p=>p.id);
  const drinkIds=PRODUCTS.filter(p=>p.cat==="Dranken").map(p=>p.id);
  const foodUnits=foodIds.reduce((s,id)=>s+(counts[id]||0),0);
  const drinkUnits=drinkIds.reduce((s,id)=>s+(counts[id]||0),0);
  const d=new Date();
  const weekNo=(()=>{
    const x=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));
    const day=x.getUTCDay()||7;x.setUTCDate(x.getUTCDate()+4-day);
    const y=new Date(Date.UTC(x.getUTCFullYear(),0,1));
    return Math.ceil((((x-y)/86400000)+1)/7);
  })();

  const row=[
    dateKey(),d.toLocaleDateString("nl-BE",{weekday:"short"}),weekNo,
    d.toLocaleDateString("nl-BE",{month:"long"}),"","","Alleen",sales.length,
    counts["hamburger"]||0,0,0,counts["cheeseburger"]||0,counts["cheeseburger-royale"]||0,
    counts["spekburger"]||0,counts["bicky-burger"]||0,counts["bicky-cheese"]||0,
    counts["broodje-mexicano"]||0,counts["broodje-mexicano-cheese"]||0,
    counts["broodje-braadworst"]||0,counts["braadworst"]||0,counts["pulled-pork"]||0,
    counts["smokey-chicken"]||0,counts["chicken-tandoori"]||0,
    counts["broodje-curryworst"]||0,counts["curryworst"]||0,counts["extra-kaas"]||0,
    counts["plat-water"]||0,counts["bruis-water"]||0,counts["cola"]||0,
    counts["cola-zero"]||0,counts["fanta"]||0,counts["sprite"]||0,counts["jupiler"]||0,
    counts["jupiler-00"]||0,counts["red-bull"]||0,counts["ice-tea"]||0,
    counts["ice-tea-peach"]||0,counts["dr-pepper"]||0,
    foodUnits,drinkUnits,foodUnits+drinkUnits,total,foodcost,gross,cash,payconiq,
    cash+payconiq,(cash+payconiq)-total,"","","",gross,"Export Snackbaron POS","","",""
  ];

  const csv="\ufeff"+[header,row].map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(";")).join("\n");
  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
  a.download=`Snackbaron_PRO_import_${dateKey()}.csv`;
  a.click();
}

function toast(msg){const el=document.getElementById("toast");el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2000)}

document.getElementById("newCustomerBtn").onclick=newCustomer;
document.getElementById("holdBtn").onclick=holdCurrentOrder;
document.getElementById("heldBtn").onclick=openHeld;
document.getElementById("heldCloseBtn").onclick=()=>document.getElementById("heldDialog").close();
document.getElementById("ordersBtn").onclick=openOrders;
document.getElementById("cockpitBtn").onclick=openCockpit;
document.getElementById("cockpitCloseBtn").onclick=()=>document.getElementById("cockpitDialog").close();
document.getElementById("trafficBtn").onclick=openTraffic;
document.getElementById("trafficCloseBtn").onclick=()=>document.getElementById("trafficDialog").close();
document.getElementById("summaryBtn").onclick=openSummary;
document.getElementById("ordersCloseBtn").onclick=()=>document.getElementById("ordersDialog").close();
document.getElementById("summaryCloseBtn").onclick=()=>document.getElementById("summaryDialog").close();
document.getElementById("cashCloseBtn").onclick=()=>document.getElementById("cashDialog").close();
document.querySelectorAll("[data-key]").forEach(b=>b.onclick=()=>cashKey(b.dataset.key));
document.getElementById("cashConfirmBtn").onclick=confirmCash;
document.getElementById("csvBtn").onclick=exportCSV;
document.getElementById("proExportBtn").onclick=exportSnackbaronPRO;
document.getElementById("resetBtn").onclick=()=>{if(confirm("Alle bestellingen van vandaag verwijderen? Exporteer eerst je CSV.")){saveSales(getSales().filter(s=>s.date!==dateKey()));cart={};editingSaleId=null;renderCart();openSummary();updateCustomerCounter();toast("Nieuwe dag gestart.");}};
document.getElementById("clearBtn").onclick=()=>{if(cartRows().length&&confirm(editingSaleId?"Aanpassing annuleren?":"Bestelling wissen?")){cart={};editingSaleId=null;renderCart();}};
document.querySelectorAll("[data-pay]").forEach(b=>b.onclick=()=>startPayment(b.dataset.pay));

renderTabs();renderProducts();renderCart();updateCustomerCounter();updateHeldCount();
if("serviceWorker" in navigator){
  window.addEventListener("load",()=>{
    navigator.serviceWorker.register("service-worker.js").then(reg=>{
      reg.update().catch(()=>{});
    }).catch(()=>{});
  });
}
updateConnectionStatus();
