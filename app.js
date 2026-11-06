'use strict';

// Edit names, prices, descriptions and art here. Prices are US dollars.
const products = [
  { id:'zobo', name:'Zobo', collection:'Minecraft', price:10, color:'#e0e8cf', tagline:'A blocky little softie.', personality:'The adventure buddy', description:'Meet Zobo: a little green block buddy with a surprisingly soft side. Always ready for an imaginary adventure, a quiet afternoon, or one more hug.' },
  { id:'bob-happy-gast', name:'Bob Happy Gast', collection:'Minecraft', price:10, color:'#e0e9eb', tagline:'Head in the clouds. Heart full of happy.', personality:'The happy daydreamer', description:'Bob Happy Gast floats through life with a smile. A little cloud of good vibes, Bob is happiest drifting into your next big daydream.' },
  { id:'foxey', name:'Foxey', collection:'Minecraft', price:10, color:'#f9dfc9', tagline:'Tiny paws. Big mischief.', personality:'The cheeky one', description:'A curious little fox with a fluffy tail and a twinkle in their eye. Foxey is the friend for woodland daydreams and just a tiny bit of mischief.' },
  { id:'dolfoney', name:'Dolfoney', collection:'Minecraft', price:10, color:'#d3e9ed', tagline:'Just going with the flow.', personality:'The ocean explorer', description:'Dolfoney brings a splash of happy wherever they go. This little dolphin is all about make-believe ocean adventures and taking life one little wave at a time.' },
  { id:'flowery', name:'Flowery', collection:'Originals', price:11, color:'#f5d8de', tagline:'A little sunshine, all year round.', personality:'The sunny sweetheart', description:'With a sunny little face and a whole crown of pink petals, Flowery is a pocket-sized reminder to stop and enjoy the little things.' },
  { id:'caty', name:'Caty', collection:'Originals', price:11, color:'#e6dded', tagline:'Professional nap enthusiast.', personality:'The cozy companion', description:'Caty has a tiny heart, sleepy little paws, and a big love for cozy corners. The perfect character for slow mornings and very important imaginary naps.' },
  { id:'pine-appley', name:'Pine Appley', collection:'Originals', price:11, color:'#f3e6b8', tagline:'Sweet, silly & a little spiky.', personality:'The tropical optimist', description:'Pine Appley is a sunny little pineapple with a leafy hairdo and a whole lot of cheer. A little tropical escape, no suitcase required.' },
  { id:'flootey', name:'Flootey', collection:'Originals', price:11, color:'#dce9dc', tagline:'A happy little tune with wings.', personality:'The little songbird', description:'Flootey is a minty little bird with a song in their heart. A cheerful daydreamer who finds a happy little tune in just about everything.' }
];

const money = value => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(value);
const byId = id => document.getElementById(id);
const heart = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.5a5.5 5.5 0 0 0 0-7.8Z"/></svg>';
const lookup = id => products.find(product => product.id === id);
let storageAvailable = true;
function readSaved(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { storageAvailable = false; return fallback; }
}
const savedBag = readSaved('suffy-bag-v1',{});
const savedFavorites = readSaved('suffy-favorites-v1',[]);
const bag = Object.create(null);
if (savedBag && typeof savedBag === 'object' && !Array.isArray(savedBag)) {
  for (const product of products) {
    const quantity = savedBag[product.id];
    if (Number.isInteger(quantity) && quantity > 0) bag[product.id] = Math.min(quantity,99);
  }
}
const favorites = new Set(Array.isArray(savedFavorites) ? savedFavorites.filter(id => lookup(id)) : []);
let activeFilter = 'all';
let query = '';
let toastTimer;
let previousFocus;

function persist() {
  try {
    localStorage.setItem('suffy-bag-v1',JSON.stringify(bag));
    localStorage.setItem('suffy-favorites-v1',JSON.stringify([...favorites]));
  } catch {
    if (storageAvailable) toast('Your browser can’t save this bag. Download your list to keep it.');
    storageAvailable = false;
  }
}
function toast(message) {
  clearTimeout(toastTimer);
  byId('toast').textContent = message;
  byId('toast').classList.add('visible');
  toastTimer = setTimeout(() => byId('toast').classList.remove('visible'),3000);
}
function renderProducts() {
  const visible = products.filter(p => (activeFilter === 'all' || (activeFilter === 'favorites' ? favorites.has(p.id) : p.collection === activeFilter)) && `${p.name} ${p.tagline} ${p.collection}`.toLowerCase().includes(query));
  byId('product-grid').innerHTML = visible.map(p => `
    <article class="product-card" style="--card-color:${p.color}">
      <div class="product-image">
        <button class="product-view" data-detail="${p.id}" aria-label="Meet ${p.name}"><img src="assets/${p.id}.svg" width="320" height="340" alt="${p.name} character illustration" loading="lazy"></button>
        <button class="favorite-button" data-favorite="${p.id}" aria-label="Favorite ${p.name}" aria-pressed="${favorites.has(p.id)}">${heart}</button>
        <span class="product-badge">${p.collection === 'Minecraft' ? 'MC Suffy' : 'Original Suffy'}</span>
      </div>
      <div class="product-heading"><h3><button class="name-button" data-detail="${p.id}">${p.name}</button></h3><span class="price">$${p.price}</span></div>
      <p class="product-tagline">${p.tagline}</p>
      <button class="add-button" data-add="${p.id}" aria-label="Add ${p.name} to bag">Add to bag <span aria-hidden="true">+</span></button>
    </article>`).join('');
  byId('empty-state').hidden = visible.length > 0;
  const emptyFavorites = activeFilter === 'favorites' && !query;
  byId('empty-title').textContent = emptyFavorites ? 'Your favorites are waiting to happen.' : 'No little friends found.';
  byId('empty-copy').textContent = emptyFavorites ? 'Tap a heart on any Suffy to save them here.' : 'Try another name or explore the whole gang.';
  byId('results-status').textContent = `${visible.length} ${visible.length === 1 ? 'Suffy' : 'Suffys'} shown.`;
}
function updateFavorite(id) {
  if (!lookup(id)) return;
  const oldButton = document.activeElement;
  const wasFavorite = favorites.has(id);
  if (wasFavorite) favorites.delete(id); else favorites.add(id);
  persist();
  renderProducts();
  const nextButton = document.querySelector(`[data-favorite="${id}"]`);
  if (nextButton && oldButton?.dataset.favorite === id) nextButton.focus({preventScroll:true});
  else if (oldButton?.dataset.favorite === id) document.querySelector('[data-filter="favorites"]').focus({preventScroll:true});
  toast(`${lookup(id).name} ${wasFavorite ? 'removed from' : 'saved to'} favorites ${wasFavorite ? '' : '♡'}`);
}
function addToBag(id) {
  const product = lookup(id);
  if (!product) return;
  if ((bag[id] || 0) >= 99) { toast('You can add up to 99 of each Suffy.'); return; }
  bag[id] = (bag[id] || 0) + 1;
  persist();
  renderBag();
  toast(`${product.name} is in your bag ♡`);
}
function renderBag(focusTarget) {
  const entries = products.filter(p => bag[p.id]);
  const count = entries.reduce((total,p) => total + bag[p.id],0);
  byId('bag-count').textContent = count;
  byId('open-bag').setAttribute('aria-label',`My bag, ${count} ${count === 1 ? 'item' : 'items'}`);
  byId('bag-summary').hidden = !count;
  if (!count) {
    byId('bag-items').innerHTML = '<div class="bag-empty"><span aria-hidden="true">♡</span><h3>Room for a little happy.</h3><p>Your bag is empty. Let’s find you<br>a new little friend.</p><button class="button primary" data-close="bag-dialog">Meet the Suffys <span aria-hidden="true">↗</span></button></div>';
  } else {
    byId('bag-items').innerHTML = entries.map(p => `<div class="bag-item">
      <div class="bag-item-art" style="--card-color:${p.color}"><img src="assets/${p.id}.svg" alt="" width="83" height="83"></div>
      <div><h3>${p.name}</h3><p>${p.collection} · ${money(p.price)} each</p><div class="quantity"><button data-quantity="${p.id}" data-change="-1" aria-label="Decrease ${p.name} quantity">−</button><span aria-label="Quantity ${bag[p.id]}">${bag[p.id]}</span><button data-quantity="${p.id}" data-change="1" aria-label="Increase ${p.name} quantity" ${bag[p.id] >= 99 ? 'disabled' : ''}>+</button></div></div>
      <div class="bag-item-end"><strong>${money(p.price * bag[p.id])}</strong><button class="remove-item" data-remove="${p.id}" aria-label="Remove ${p.name}">Remove</button></div>
    </div>`).join('');
  }
  byId('bag-total').textContent = money(entries.reduce((total,p) => total + p.price * bag[p.id],0));
  if (focusTarget) {
    const target = byId('bag-items').querySelector(focusTarget) || byId('bag-items').querySelector('button') || byId('bag-dialog').querySelector('.close-button');
    target.focus({preventScroll:true});
  }
}
function openDialog(id) {
  const dialog = byId(id);
  if (dialog.open) return;
  previousFocus = document.activeElement;
  dialog.showModal();
  document.body.style.overflow = 'hidden';
}
function showProduct(id) {
  const p = lookup(id);
  if (!p) return;
  byId('product-detail').innerHTML = `<div class="detail-layout"><div class="detail-art" style="--card-color:${p.color}"><img src="assets/${p.id}.svg" alt="${p.name} character illustration" width="400" height="400"></div><div class="detail-copy"><p class="eyebrow">${p.collection.toUpperCase()} · ${p.personality.toUpperCase()}</p><h2 id="detail-name">${p.name}</h2><p class="detail-tagline">${p.tagline}</p><p class="detail-description">${p.description}</p><strong class="detail-price">${money(p.price)}<small>USD</small></strong><button class="button primary" data-add="${p.id}" aria-label="Add ${p.name} to bag">Add to my bag <span aria-hidden="true">+</span></button><p class="detail-note">Character illustration · Online checkout not yet available.</p></div></div>`;
  openDialog('product-dialog');
}
function setFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll('[data-filter]').forEach(button => {
    const active = button.dataset.filter === filter;
    button.classList.toggle('active',active);
    button.setAttribute('aria-pressed',active);
  });
  renderProducts();
}
function orderText() {
  const entries = products.filter(p => bag[p.id]);
  const total = entries.reduce((sum,p) => sum + p.price * bag[p.id],0);
  return ['SUFFY STORE — MY ORDER LIST','',...entries.map(p => `${bag[p.id]} × ${p.name} (${p.collection}) — ${money(p.price)} each — ${money(p.price * bag[p.id])}`),'',`Subtotal: ${money(total)} USD`,'Shipping and tax are not included.','','This is a saved list, not a placed order. No payment has been taken.'].join('\n');
}
document.addEventListener('click',event => {
  const button = event.target.closest('button');
  if (!button) return;
  const data = button.dataset;
  if (data.add) addToBag(data.add);
  else if (data.detail) showProduct(data.detail);
  else if (data.favorite) updateFavorite(data.favorite);
  else if (data.filter) setFilter(data.filter);
  else if (data.close) byId(data.close).close();
  else if (data.quantity) {
    const id = data.quantity;
    if (!lookup(id)) return;
    bag[id] = Math.max(0,Math.min(99,(bag[id] || 0) + Number(data.change)));
    if (!bag[id]) delete bag[id];
    persist();
    renderBag(`[data-quantity="${id}"][data-change="${data.change}"]`);
  } else if (data.remove) {
    delete bag[data.remove];
    persist();
    renderBag('button');
    toast(`${lookup(data.remove).name} removed from bag.`);
  }
});
byId('search').addEventListener('input',event => { query = event.target.value.trim().toLowerCase(); renderProducts(); });
byId('reset-filters').addEventListener('click',() => { query = ''; byId('search').value = ''; setFilter('all'); document.querySelector('[data-filter="all"]').focus(); });
byId('surprise-me').addEventListener('click',() => showProduct(products[Math.floor(Math.random() * products.length)].id));
byId('open-bag').addEventListener('click',() => { renderBag(); openDialog('bag-dialog'); });
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('click',event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close',() => { document.body.style.overflow = ''; if (previousFocus?.isConnected) previousFocus.focus({preventScroll:true}); });
});
byId('download-list').addEventListener('click',() => {
  const url = URL.createObjectURL(new Blob([orderText()],{type:'text/plain;charset=utf-8'}));
  const link = document.createElement('a'); link.href = url; link.download = 'my-suffy-order-list.txt';
  document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url),1000);
  toast('Your Suffy list is ready to save ♡');
});
byId('copy-list').addEventListener('click',async () => {
  try { await navigator.clipboard.writeText(orderText()); toast('Order list copied ♡'); }
  catch { toast('Copy isn’t available here. Use “Save my order list” instead.'); }
});
renderProducts();
renderBag();
