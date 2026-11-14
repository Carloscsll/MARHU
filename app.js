/* =========================================================
   MARHU SUSHI BAR — menú, carrito y pedido por WhatsApp
   ========================================================= */
(function () {
  "use strict";

  const MENU = window.MARHU_MENU || [];
  const CONFIG = window.MARHU_CONFIG || {};
  const STORE_KEY = "marhu-cart-v1";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const money = (n) => "$" + Number(n).toLocaleString("es-MX", { maximumFractionDigits: 2 });
  const norm = (s) => (s || "").toString().normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const esc = (s) => (s || "").toString().replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Íconos ---------- */
  const ICONS = {
    picante: { label: "Picante", html: '<img class="tag-ico" src="img/chile.png" alt="">' },
    picante2: { label: "Muy picante", html: '<span class="tag-pair"><img class="tag-ico" src="img/chile.png" alt=""><img class="tag-ico" src="img/chile.png" alt=""></span>' },
    fresco: { label: "Fresco", html: '<img class="tag-ico" src="img/pez.png" alt="">' },
    tempura: { label: "Tempurizado", html: '<span class="tag-ico tag-ico--emoji">🍤</span>' },
    horno: { label: "Al horno", html: '<svg class="tag-ico" viewBox="0 0 24 24"><rect x="2.5" y="4" width="19" height="16" rx="2" fill="#d9d9d9" stroke="#777"/><rect x="5" y="9" width="14" height="8" rx="1" fill="#555"/><circle cx="6" cy="6.5" r="1" fill="#555"/><circle cx="9" cy="6.5" r="1" fill="#555"/><rect x="13" y="5.8" width="6" height="1.4" rx=".7" fill="#555"/></svg>' },
  };
  const tagsHtml = (t) => (t || []).map((k) => ICONS[k] ? `<span title="${ICONS[k].label}" aria-label="${ICONS[k].label}">${ICONS[k].html}</span>` : "").join("");

  /* ---------- Índice de platillos ---------- */
  const ITEMS = {};
  MENU.forEach((sec) => sec.grupos.forEach((g) => g.items.forEach((it, i) => {
    it.id = `${g.id}-${i}`;
    it.grupo = g.titulo;
    it.seccion = sec.id;
    ITEMS[it.id] = it;
  })));
  const hasChoice = (it) => !!(it.v || it.o);
  const basePrice = (it) => (it.v ? null : typeof it.p === "number" ? it.p : null);
  const isPng = (src) => /\.png$/i.test(src || "");

  /* ---------- Carrito (persistente) ---------- */
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(STORE_KEY) || "[]").filter((l) => ITEMS[l.id]); } catch (e) { cart = []; }
  const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(cart)); } catch (e) { /* sin almacenamiento */ } };
  const lineKey = (l) => [l.id, l.opt || "", (l.note || "").trim().toLowerCase()].join("|");

  function addToCart(id, qty, opt, note) {
    const it = ITEMS[id];
    let price = basePrice(it);
    if (it.v) { const v = it.v.find((x) => x[0] === opt); price = v ? v[1] : null; }
    const line = { id, name: it.n, opt: opt || "", price, qty, note: (note || "").trim() };
    const existing = cart.find((l) => lineKey(l) === lineKey(line));
    if (existing) existing.qty += qty; else cart.push(line);
    changed();
    const btn = $("#cartOpen"); btn.classList.remove("bump"); void btn.offsetWidth; btn.classList.add("bump");
    toast(`${qty} × ${it.n}${opt ? " (" + opt + ")" : ""} agregado`);
  }
  function setLineQty(idx, qty) {
    if (!cart[idx]) return;
    if (qty <= 0) cart.splice(idx, 1); else cart[idx].qty = qty;
    changed();
  }
  const qtyForItem = (id) => cart.filter((l) => l.id === id).reduce((a, l) => a + l.qty, 0);
  const totals = () => {
    let total = 0, count = 0, unpriced = false;
    cart.forEach((l) => { count += l.qty; if (typeof l.price === "number") total += l.price * l.qty; else unpriced = true; });
    return { total, count, unpriced };
  };

  function changed() {
    save();
    renderBadges();
    renderRowControls();
    renderCart();
  }

  /* ---------- Render del menú ---------- */
  const menuEl = $("#menu");

  function itemRow(it) {
    const price = it.v
      ? `<span class="item__price">${it.v.map((v) => money(v[1])).join(" / ")}</span>`
      : typeof it.p === "number"
        ? `<span class="item__price">${money(it.p)}</span>`
        : `<span class="item__price item__price--text">${esc(it.pt || "Consultar")}</span>`;
    const desc = [it.d, it.v ? it.v.map((v) => v[0]).join(" / ") : ""].filter(Boolean).join(" · ");
    const thumb = it.img ? `<div class="item__thumb ${isPng(it.img) ? "item__thumb--png" : ""}"><img src="${it.img}" alt="" loading="lazy"></div>` : "";
    return `
      <div class="item" data-id="${it.id}" data-search="${esc(norm(it.n + " " + (it.d || "") + " " + it.grupo + " " + (it.o || []).join(" ")))}" tabindex="0" role="button" aria-label="${esc(it.n)}">
        ${thumb}
        <div class="item__main">
          <div class="item__name">${esc(it.n)} ${tagsHtml(it.t)}</div>
          ${desc ? `<p class="item__desc">${esc(desc)}</p>` : ""}
          <div class="item__bottom">
            ${price}
            <div class="item__ctrl" data-ctrl="${it.id}"></div>
          </div>
        </div>
      </div>`;
  }

  function featuredPhotos(sec) {
    const list = [];
    sec.grupos.forEach((g) => {
      if (g.foto) list.push({ src: g.foto, label: g.titulo === "Nigiri" ? "Nigiri maguro y sake" : g.titulo, target: g.id, isGroup: true });
      g.items.forEach((it) => { if (it.img) list.push({ src: it.img, label: it.n, target: it.id }); });
    });
    return list;
  }

  function renderMenu() {
    menuEl.innerHTML = MENU.map((sec) => {
      const photos = featuredPhotos(sec);
      const drinks = photos.filter((p) => isPng(p.src) && sec.id === "cocteleria");
      const plates = photos.filter((p) => !isPng(p.src) || sec.id !== "cocteleria");
      const strip = sec.id === "cocteleria"
        ? `<div class="drinks-strip">${drinks.map((p) => `
            <button class="drink" data-open="${p.target}" aria-label="${esc(p.label)}">
              <img src="${p.src}" alt="" loading="lazy"><span class="photo-label">${esc(p.label)}</span>
            </button>`).join("")}</div>`
        : plates.length ? `<div class="drinks-strip photo-strip">${plates.map((p) => `
            <button class="photo-card" ${p.isGroup ? `data-jump="${p.target}"` : `data-open="${p.target}"`} aria-label="${esc(p.label)}">
              <span class="torn ${isPng(p.src) ? "torn--png" : ""}"><img src="${p.src}" alt="" loading="lazy"></span>
              <span class="photo-label">${esc(p.label)}</span>
            </button>`).join("")}</div>` : "";
      const legend = sec.leyenda ? `
        <div class="legend" aria-label="Simbología">
          <span>${ICONS.picante.html} Picante</span>
          <span>${ICONS.tempura.html} Tempurizado</span>
          <span>${ICONS.fresco.html} Fresco</span>
          <span>${ICONS.horno.html} Al horno</span>
        </div>` : "";
      const many = sec.grupos.length > 8;
      return `
        <section class="section" id="sec-${sec.id}" data-section="${sec.id}">
          <h2 class="section__title">${esc(sec.titulo)}</h2>
          ${legend}
          ${strip}
          <div class="groups ${many ? "groups--three" : ""}">
            ${sec.grupos.map((g) => `
              <div class="group" id="g-${g.id}" data-group="${g.id}" data-section="${sec.id}">
                <div class="group__head">
                  <h3 class="group__title">${esc(g.titulo)}</h3>
                  ${g.unidad ? `<span class="group__unit">${esc(g.unidad)}</span>` : g.sub ? `<span class="group__sub">${esc(g.sub)}</span>` : ""}
                </div>
                <div class="group__rule" aria-hidden="true"></div>
                ${g.nota ? `<p class="group__note">${esc(g.nota)}</p>` : ""}
                ${g.items.map(itemRow).join("")}
              </div>`).join("")}
          </div>
        </section>`;
    }).join("");
    renderRowControls();
  }

  const TRASH = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function qtyHtml(q, decAttr, incAttr, name) {
    return `<div class="qty" role="group" aria-label="Cantidad de ${esc(name)}">
      <button class="qty__btn ${q === 1 ? "qty__btn--del" : ""}" ${decAttr} aria-label="${q === 1 ? "Quitar " + esc(name) + " del pedido" : "Quitar uno"}">${q === 1 ? TRASH : "−"}</button>
      <span class="qty__n" aria-live="polite">${q}</span>
      <button class="qty__btn" ${incAttr} aria-label="Agregar uno más">+</button>
    </div>`;
  }
  function renderRowControls() {
    $$("[data-ctrl]").forEach((el) => {
      const id = el.dataset.ctrl, it = ITEMS[id], q = qtyForItem(id);
      const simple = !hasChoice(it);
      const lines = cart.filter((l) => l.id === id);
      // Stepper solo si el platillo no tiene opciones y está en una sola línea sin nota
      if (q > 0 && simple && lines.length === 1) {
        el.innerHTML = qtyHtml(q, `data-dec="${id}"`, `data-inc="${id}"`, it.n);
      } else {
        el.innerHTML = (q > 0 ? `<span class="item__incart">✓ Llevas ${q}</span>` : "") +
          `<button class="item__add" data-add="${id}" aria-label="Agregar ${esc(it.n)}"><span aria-hidden="true">+</span> ${q > 0 ? "Otro" : "Agregar"}</button>`;
      }
    });
  }

  /* ---------- Navegación ---------- */
  const mainTabs = $("#mainTabs"), subTabs = $("#subTabs");
  let activeSection = MENU[0] && MENU[0].id, activeGroup = null;

  function renderTabs() {
    mainTabs.innerHTML = MENU.map((s) => `<button class="maintab" role="tab" data-sec="${s.id}" aria-selected="${s.id === activeSection}">${esc(s.titulo)}</button>`).join("");
    renderSubTabs();
  }
  function renderSubTabs() {
    const sec = MENU.find((s) => s.id === activeSection);
    if (!sec) return;
    subTabs.innerHTML = sec.grupos
      .filter((g) => { const el = $("#g-" + g.id); return !el || !el.hidden; })
      .map((g) => `<button class="chip ${g.id === activeGroup ? "is-active" : ""}" data-jump="${g.id}">${esc(g.titulo)}</button>`).join("");
  }
  function navOffset() { return $("#topbar").offsetHeight + $("#catnav").offsetHeight + 6; }
  function scrollToEl(el) {
    const y = el.getBoundingClientRect().top + window.scrollY - navOffset();
    window.scrollTo({ top: Math.max(0, y), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  function setActive(secId, groupId) {
    const secChanged = secId !== activeSection;
    activeSection = secId; activeGroup = groupId;
    $$(".maintab").forEach((b) => b.setAttribute("aria-selected", b.dataset.sec === secId));
    if (secChanged) renderSubTabs();
    $$(".chip", subTabs).forEach((c) => c.classList.toggle("is-active", c.dataset.jump === groupId));
    const chip = $(`.chip[data-jump="${groupId}"]`, subTabs);
    if (chip) subTabs.scrollTo({ left: chip.offsetLeft - subTabs.clientWidth / 2 + chip.offsetWidth / 2, behavior: "smooth" });
  }

  let spyLock = 0;
  function spy() {
    if (Date.now() < spyLock) return;
    const off = navOffset() + 20;
    const secs = $$(".section").filter((s) => !s.hidden);
    if (!secs.length) return;
    let sec = secs[0];
    for (const s of secs) if (s.getBoundingClientRect().top - off <= 0) sec = s;
    const groups = $$(".group", sec).filter((g) => !g.hidden);
    let current = groups[0];
    for (const g of groups) if (g.getBoundingClientRect().top - off <= 0) current = g;
    if (current) setActive(current.dataset.section, current.dataset.group);
  }
  let spyRaf = 0;
  window.addEventListener("scroll", () => { clearTimeout(spyRaf); spyRaf = setTimeout(spy, 40); }, { passive: true });

  /* ---------- Búsqueda ---------- */
  const searchBar = $("#searchBar"), searchInput = $("#searchInput");
  function applySearch(q) {
    const nq = norm(q.trim());
    let any = false;
    $$(".section").forEach((sec) => {
      let secAny = false;
      $$(".group", sec).forEach((g) => {
        let gAny = false;
        $$(".item", g).forEach((it) => {
          const ok = !nq || it.dataset.search.includes(nq);
          it.hidden = !ok; if (ok) gAny = true;
        });
        g.hidden = !gAny; if (gAny) secAny = true;
      });
      sec.hidden = !secAny; if (secAny) any = true;
      $$(".drinks-strip, .legend", sec).forEach((el) => (el.hidden = !!nq));
    });
    $("#emptySearch").hidden = any;
    $(".hero").hidden = !!nq;
    $("#howto").hidden = !!nq;
    if (nq) $$(".reveal").forEach((el) => el.classList.add("in"));
    renderSubTabs();
  }
  function openSearch() {
    searchBar.hidden = false;
    $("#searchToggle").setAttribute("aria-expanded", "true");
    searchInput.focus();
  }
  function closeSearch() {
    searchBar.hidden = true; searchInput.value = ""; applySearch("");
    $("#searchToggle").setAttribute("aria-expanded", "false");
  }

  /* ---------- Hoja de platillo ---------- */
  const sheet = $("#itemSheet"), sheetOverlay = $("#itemOverlay");
  let sheetItem = null, sheetQty = 1, lastFocus = null;

  function openSheet(id) {
    const it = ITEMS[id]; if (!it) return;
    sheetItem = it; sheetQty = 1; lastFocus = document.activeElement;
    const media = $("#sheetMedia");
    media.className = "sheet__media" + (it.img && isPng(it.img) ? " sheet__media--png" : "");
    media.innerHTML = it.img ? `<img src="${it.img}" alt="${esc(it.n)}">` : "";
    $("#sheetTitle").textContent = it.n;
    $("#sheetTags").innerHTML = (it.t || []).map((k) => `<span>${ICONS[k].html} ${ICONS[k].label}</span>`).join("") + `<span>${esc(it.grupo)}</span>`;
    $("#sheetDesc").textContent = it.d || "";
    const choices = $("#sheetChoices"), list = $("#sheetChoicesList");
    if (it.v || it.o) {
      choices.hidden = false;
      $("#sheetChoicesLabel").textContent = it.v ? "Elige una opción" : "Elige tu preferencia";
      const opts = it.v ? it.v : it.o.map((o) => [o, it.p]);
      list.innerHTML = opts.map((o, i) => `
        <label class="choice"><input type="radio" name="opt" value="${esc(o[0])}" ${i === 0 ? "checked" : ""}>
          <span><b>${esc(o[0])}</b></span><span class="item__price">${typeof o[1] === "number" ? money(o[1]) : ""}</span></label>`).join("");
    } else { choices.hidden = true; list.innerHTML = ""; }
    $("#sheetNote").value = "";
    updateSheet();
    sheet.hidden = false; sheetOverlay.hidden = false; document.body.classList.add("lock");
    setTimeout(() => $("#sheetAdd").focus(), 50);
  }
  function sheetOpt() { const r = $('input[name="opt"]:checked', sheet); return r ? r.value : ""; }
  function updateSheet() {
    $("#sheetQty").textContent = sheetQty;
    let price = basePrice(sheetItem);
    if (sheetItem.v) { const v = sheetItem.v.find((x) => x[0] === sheetOpt()); price = v ? v[1] : null; }
    $("#sheetAdd").textContent = typeof price === "number" ? `Agregar · ${money(price * sheetQty)}` : "Agregar (precio por confirmar)";
  }
  function closeSheet() {
    sheet.hidden = true; sheetOverlay.hidden = true;
    if ($("#cartDrawer").hidden) document.body.classList.remove("lock");
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }

  /* ---------- Carrito / pedido ---------- */
  const drawer = $("#cartDrawer"), cartOverlay = $("#cartOverlay");
  let step = 1;

  function renderBadges() {
    const { total, count, unpriced } = totals();
    const c = $("#cartCount"); c.textContent = count; c.hidden = count === 0;
    $("#floatbar").hidden = count === 0;
    $("#floatCount").textContent = count;
    $("#floatTotal").textContent = money(total) + (unpriced ? "+" : "");
  }

  function renderCart() {
    const { total, count, unpriced } = totals();
    $("#cartEmpty").hidden = count > 0;
    $("#cartList").innerHTML = cart.map((l, i) => `
      <li class="cart-item">
        <div class="cart-item__info">
          <div class="cart-item__name">${esc(l.name)}</div>
          <div class="cart-item__meta">${[l.opt, typeof l.price === "number" ? money(l.price) + " c/u" : "Precio por confirmar"].filter(Boolean).map(esc).join(" · ")}</div>
          ${l.note ? `<div class="cart-item__note">“${esc(l.note)}”</div>` : ""}
        </div>
        <div class="cart-item__side">
          <span class="cart-item__price">${typeof l.price === "number" ? money(l.price * l.qty) : "—"}</span>
          ${qtyHtml(l.qty, `data-line-dec="${i}"`, `data-line-inc="${i}"`, l.name)}
        </div>
      </li>`).join("");
    $("#cartTotal").textContent = money(total);
    $("#totalNote").hidden = !unpriced;
    if (count === 0 && step !== 1) goStep(1);
    updateFoot();
  }

  function updateFoot() {
    const btn = $("#nextBtn"), { count } = totals();
    btn.className = "btn btn--primary btn--block";
    if (step === 1) { btn.textContent = "Continuar"; btn.disabled = count === 0; }
    if (step === 2) { btn.textContent = "Revisar pedido"; btn.disabled = false; }
    if (step === 3) { btn.className = "btn btn--wa btn--block"; btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s1 2.5 1.1 2.7c.1.2 1.9 2.9 4.6 4 1.7.7 2.4.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3Z"/></svg> Confirmar y enviar por WhatsApp'; btn.disabled = false; }
  }

  function goStep(n) {
    step = n;
    $$(".drawer__panel").forEach((p) => (p.hidden = Number(p.dataset.panel) !== n));
    $$(".steps li").forEach((li) => {
      const s = Number(li.dataset.step);
      li.classList.toggle("is-active", s === n); li.classList.toggle("is-done", s < n);
    });
    $("#drawerBack").hidden = n === 1;
    $("#drawerTitle").textContent = n === 1 ? "Mi pedido" : n === 2 ? "Tus datos" : "Confirmar";
    if (n === 3) {
      $("#waPreview").innerHTML = waFormat(buildMessage());
      $("#configWarning").hidden = !!validPhone();
      $("#sentBox").hidden = true;
    }
    updateFoot();
    const panel = $(`.drawer__panel[data-panel="${n}"]`); if (panel) panel.scrollTop = 0;
    if (n === 2) setTimeout(() => { if (!$("#custName").value) $("#custName").focus(); }, 60);
  }

  function openCart() {
    lastFocus = document.activeElement;
    drawer.hidden = false; cartOverlay.hidden = false; document.body.classList.add("lock");
    goStep(1);
  }
  function closeCart() {
    drawer.hidden = true; cartOverlay.hidden = true; document.body.classList.remove("lock");
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }

  /* ---------- Formulario ---------- */
  const form = $("#orderForm");
  const mode = () => ($('input[name="modo"]:checked', form) || {}).value || "recoger";
  function syncMode() {
    const m = mode();
    $("#pickupFields").hidden = m !== "recoger";
    $("#dineFields").hidden = m !== "aqui";
  }
  function syncWhen() {
    const t = $("#pickupTime");
    t.hidden = $("#pickupWhen").value !== "hora";
    if (!t.hidden && !t.value) {
      const d = new Date(Date.now() + 30 * 60000);
      t.value = String(d.getHours()).padStart(2, "0") + ":" + String(Math.ceil(d.getMinutes() / 5) * 5 % 60).padStart(2, "0");
    }
  }
  function validate() {
    const name = $("#custName"), v = name.value.trim().replace(/\s+/g, " ");
    const ok = v.length >= 5 && v.split(" ").length >= 2;
    name.classList.toggle("is-invalid", !ok);
    $("#nameError").hidden = ok;
    if (!ok) { name.focus(); return false; }
    if (mode() === "recoger" && $("#pickupWhen").value === "hora" && !$("#pickupTime").value) { $("#pickupTime").focus(); return false; }
    return true;
  }

  /* ---------- Mensaje de WhatsApp ---------- */
  function fmtTime(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    const ap = h >= 12 ? "p.m." : "a.m.";
    return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${ap}`;
  }
  function buildMessage() {
    const { total, unpriced } = totals();
    const m = mode();
    const name = $("#custName").value.trim().replace(/\s+/g, " ");
    const lines = [];
    lines.push(`¡Hola, ${CONFIG.nombre || "MARHU Sushi Bar"}! 👋`);
    lines.push(m === "recoger"
      ? "Me gustaría hacer un pedido para *pasar a recoger*:"
      : "Me gustaría hacer un pedido para *comer en el restaurante*:");
    lines.push("");
    lines.push("*MI PEDIDO*");
    cart.forEach((l, i) => {
      const price = typeof l.price === "number" ? money(l.price * l.qty) : "precio por confirmar";
      lines.push(`${i + 1}. ${l.qty} × ${l.name}${l.opt ? ` (${l.opt})` : ""} — ${price}`);
      if (l.note) lines.push(`    _Nota: ${l.note}_`);
    });
    lines.push("");
    lines.push(`*Total: ${money(total)} MXN*`);
    if (unpriced) lines.push("_(+ artículos con precio por confirmar)_");
    lines.push("");
    lines.push(`*Nombre:* ${name}`);
    if (m === "recoger") {
      const when = $("#pickupWhen").value === "hora" && $("#pickupTime").value ? fmtTime($("#pickupTime").value) : "Lo antes posible";
      lines.push(`*Paso a recoger:* ${when}`);
    } else {
      lines.push("*Modalidad:* Comer en el restaurante");
      const p = parseInt($("#people").value, 10);
      if (p > 0) lines.push(`*Personas:* ${p}`);
    }
    const c = $("#comments").value.trim();
    if (c) lines.push(`*Comentarios:* ${c}`);
    lines.push("");
    lines.push("¡Muchas gracias! 🍣");
    return lines.join("\n");
  }
  // Vista previa con el formato de WhatsApp (*negrita*, _cursiva_)
  function waFormat(text) {
    return esc(text)
      .replace(/\*([^*\n]+)\*/g, "<b>$1</b>")
      .replace(/(^|\s)_([^_\n]+)_/g, "$1<i>$2</i>");
  }
  function validPhone() {
    const p = String(CONFIG.whatsapp || "").replace(/\D/g, "");
    return p.length >= 10 && !/^5?2?0+$/.test(p) ? p : "";
  }
  function sendWhatsApp() {
    const phone = validPhone();
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(buildMessage())}`;
    const w = window.open(url, "_blank", "noopener");
    if (!w) window.location.href = url;
    $("#sentBox").hidden = false;
  }

  /* ---------- Toast ---------- */
  let toastT = 0;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 1800);
  }

  /* ---------- Eventos ---------- */
  document.addEventListener("click", (e) => {
    const t = e.target.closest("button, .item, [data-open]");
    if (!t) return;
    const d = t.dataset;
    if (d.add) { e.stopPropagation(); const it = ITEMS[d.add]; if (hasChoice(it)) openSheet(d.add); else addToCart(d.add, 1); return; }
    if (d.inc) { e.stopPropagation(); const i = cart.findIndex((l) => l.id === d.inc); setLineQty(i, cart[i].qty + 1); return; }
    if (d.dec) { e.stopPropagation(); let i = -1; cart.forEach((l, k) => { if (l.id === d.dec) i = k; }); setLineQty(i, cart[i].qty - 1); return; }
    if (d.lineInc) { setLineQty(+d.lineInc, cart[+d.lineInc].qty + 1); return; }
    if (d.lineDec) { setLineQty(+d.lineDec, cart[+d.lineDec].qty - 1); return; }
    if (d.open) { openSheet(d.open); return; }
    if (d.jump) { const el = $("#g-" + d.jump); if (el) { spyLock = Date.now() + 700; setActive(el.dataset.section, d.jump); scrollToEl(el); } return; }
    if (d.sec) { const el = $("#sec-" + d.sec); if (el) { spyLock = Date.now() + 700; setActive(d.sec, MENU.find((s) => s.id === d.sec).grupos[0].id); scrollToEl(el); } return; }
    if (d.close === "item") { closeSheet(); return; }
    if (d.close === "cart") { closeCart(); return; }
    if (t.classList.contains("item")) { openSheet(d.id); return; }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!sheet.hidden) closeSheet();
      else if (!drawer.hidden) closeCart();
      else if (!searchBar.hidden) closeSearch();
    }
    if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("item")) {
      e.preventDefault(); openSheet(e.target.dataset.id);
    }
  });

  sheetOverlay.addEventListener("click", closeSheet);
  cartOverlay.addEventListener("click", closeCart);
  $("#sheetMinus").addEventListener("click", () => { sheetQty = Math.max(1, sheetQty - 1); updateSheet(); });
  $("#sheetPlus").addEventListener("click", () => { sheetQty = Math.min(50, sheetQty + 1); updateSheet(); });
  $("#sheetChoicesList").addEventListener("change", updateSheet);
  $("#sheetAdd").addEventListener("click", () => {
    addToCart(sheetItem.id, sheetQty, sheetOpt(), $("#sheetNote").value);
    closeSheet();
  });

  $("#cartOpen").addEventListener("click", openCart);
  $("#floatbar").addEventListener("click", openCart);
  $("#drawerBack").addEventListener("click", () => goStep(step - 1));
  $("#nextBtn").addEventListener("click", () => {
    if (step === 1) goStep(2);
    else if (step === 2) { if (validate()) goStep(3); }
    else if (step === 3) sendWhatsApp();
  });
  form.addEventListener("submit", (e) => { e.preventDefault(); if (validate()) goStep(3); });
  form.addEventListener("change", (e) => {
    if (e.target.name === "modo") syncMode();
    if (e.target.id === "pickupWhen") syncWhen();
  });
  $("#custName").addEventListener("input", () => { if (!$("#nameError").hidden) { $("#custName").classList.remove("is-invalid"); $("#nameError").hidden = true; } });
  $("#newOrder").addEventListener("click", () => {
    cart = []; changed(); form.reset(); syncMode(); syncWhen(); closeCart(); toast("Listo para un pedido nuevo");
  });

  $("#searchToggle").addEventListener("click", () => (searchBar.hidden ? openSearch() : closeSearch()));
  $("#searchClose").addEventListener("click", closeSearch);
  searchInput.addEventListener("input", () => { applySearch(searchInput.value); if (searchInput.value) window.scrollTo({ top: $("#menu").offsetTop - navOffset() }); });

  /* ---------- Portada: fotos en movimiento, botones, parallax ---------- */
  function buildMarquee() {
    const pics = [];
    Object.values(ITEMS).forEach((it) => { if (it.img) pics.push({ src: it.img, n: it.n, id: it.id }); });
    MENU.forEach((s) => s.grupos.forEach((g) => { if (g.foto) pics.push({ src: g.foto, n: "Nigiri" }); }));
    // intercala platillos y cócteles
    const food = pics.filter((p) => !isPng(p.src) || /aguachile/.test(p.src));
    const drinks = pics.filter((p) => isPng(p.src) && !/aguachile/.test(p.src));
    const mixed = [];
    for (let i = 0; i < Math.max(food.length, drinks.length); i++) { if (food[i]) mixed.push(food[i]); if (drinks[i]) mixed.push(drinks[i]); }
    $("#marquee").innerHTML = mixed.map((p) => `<button class="mq ${isPng(p.src) && !/aguachile/.test(p.src) ? "mq--png" : ""}" ${p.id ? `data-open="${p.id}"` : ""} aria-label="Ver ${esc(p.n)}"><img src="${p.src}" alt="" decoding="async"><span>${esc(p.n)}</span></button>`).join("");
  }
  const phone = validPhone();
  if (phone) $("#ctaWa").href = `https://wa.me/${phone}?text=${encodeURIComponent(`¡Hola, ${CONFIG.nombre || "MARHU Sushi Bar"}! 👋 Quisiera información.`)}`;
  else $("#ctaWa").hidden = true;
  $("#ctaMenu").addEventListener("click", (e) => {
    e.preventDefault();
    const el = $("#sec-" + MENU[0].id); if (el) scrollToEl(el);
  });

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function setScrollVar() { document.documentElement.style.setProperty("--sy", Math.min(window.scrollY, 1600).toFixed(0)); }
  if (!reduceMotion) { window.addEventListener("scroll", setScrollVar, { passive: true }); setScrollVar(); }

  function setupReveal() {
    $$(".section__title, .legend, .group").forEach((el) => el.classList.add("reveal"));
    let pending = $$(".reveal");
    /* contenido siempre visible (más confiable en cualquier celular) */ if (true) { pending.forEach((el) => el.classList.add("in")); return; }
    const check = () => {
      if (!pending.length) return;
      const limit = window.innerHeight * 0.95;
      pending = pending.filter((el) => {
        const r = el.getBoundingClientRect();
        // visible, ya pasado, u oculto por la búsqueda → mostrar
        if (r.top < limit || (r.width === 0 && r.height === 0)) { el.classList.add("in"); return false; }
        return true;
      });
    };
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    check();
    // respaldo: algunos navegadores retrasan eventos de scroll
    const iv = setInterval(() => { check(); setScrollVar(); if (!pending.length) clearInterval(iv); }, 250);
  }

  /* ---------- Inicio ---------- */
  buildMarquee();
  renderMenu();
  setupReveal();
  renderTabs();
  renderBadges();
  renderCart();
  syncMode();
  spy();
})();
