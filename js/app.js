/* ============================================================
   Top Living — shared client logic
   Pages render against window.PROPERTIES (js/data.js)
   ============================================================ */

const COP = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
});

function formatPrice(value, op) {
    const base = COP.format(value);
    return op === "rent" ? `${base}/mes` : base;
}

function propertyCard(p) {
    const meta = [
        p.beds ? `${p.beds} hab` : null,
        p.baths ? `${p.baths} baños` : null,
        p.area ? `${p.area} m²` : null
    ].filter(Boolean);

    const badgeClass = p.badge === "Premium" || p.badge === "Destacado" ? "accent" : "";

    return `
    <a class="card" href="property.html?id=${p.id}">
        <div class="card-img" style="background-image:url('${p.image}')">
            ${p.badge ? `<span class="card-badge ${badgeClass}">${p.badge}</span>` : ""}
        </div>
        <div class="card-body">
            <div class="card-price">${formatPrice(p.price, p.op)}</div>
            <div class="card-loc">${p.neighborhood}, ${p.city}</div>
            <div class="card-meta">
                ${meta.map(m => `<span>${m}</span>`).join("")}
            </div>
        </div>
    </a>`;
}

/* -------- Homepage: featured grid -------- */
function renderFeatured(elId, n = 6) {
    const el = document.getElementById(elId);
    if (!el) return;
    const featured = PROPERTIES
        .filter(p => p.badge === "Destacado" || p.badge === "Premium" || p.badge === "Nuevo")
        .slice(0, n);
    el.innerHTML = featured.map(propertyCard).join("");
}

/* -------- Listings page: filterable grid -------- */
function initListings() {
    const grid    = document.getElementById("listingGrid");
    const count   = document.getElementById("listingCount");
    if (!grid) return;

    const opSel   = document.getElementById("fltOp");
    const typeSel = document.getElementById("fltType");
    const citySel = document.getElementById("fltCity");
    const sortSel = document.getElementById("fltSort");
    const q       = document.getElementById("fltSearch");

    // populate city dropdown from data
    const cities = [...new Set(PROPERTIES.map(p => p.city))].sort();
    cities.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c; opt.textContent = c;
        citySel.appendChild(opt);
    });

    function apply() {
        const op   = opSel.value;
        const type = typeSel.value;
        const city = citySel.value;
        const sort = sortSel.value;
        const term = (q.value || "").trim().toLowerCase();

        let list = PROPERTIES.filter(p => {
            if (op   && p.op   !== op)   return false;
            if (type && p.type !== type) return false;
            if (city && p.city !== city) return false;
            if (term) {
                const hay = `${p.title} ${p.city} ${p.neighborhood}`.toLowerCase();
                if (!hay.includes(term)) return false;
            }
            return true;
        });

        if (sort === "price_asc")  list.sort((a,b) => a.price - b.price);
        if (sort === "price_desc") list.sort((a,b) => b.price - a.price);
        if (sort === "area_desc")  list.sort((a,b) => b.area  - a.area);

        if (list.length === 0) {
            grid.innerHTML = `<div class="empty" style="grid-column:1/-1">
                Sin resultados con esos filtros. Prueba a relajar la búsqueda.
            </div>`;
        } else {
            grid.innerHTML = list.map(propertyCard).join("");
        }
        count.textContent = `${list.length} resultado${list.length === 1 ? "" : "s"}`;
    }

    [opSel, typeSel, citySel, sortSel].forEach(s => s.addEventListener("change", apply));
    q.addEventListener("input", apply);
    apply();
}

/* -------- Property detail page -------- */
function initDetail() {
    const root = document.getElementById("propertyDetail");
    if (!root) return;

    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    const p = PROPERTIES.find(x => x.id === id) || PROPERTIES[0];

    document.title = `${p.title} — Top Living Inmobiliaria`;

    root.innerHTML = `
        <div class="detail-hero" style="background-image:url('${p.gallery[0] || p.image}')"></div>
        <div class="detail-grid">
            <div class="detail-info">
                <span class="tag">${p.op === "sale" ? "Venta" : "Arriendo"}</span>
                <span class="tag">${typeLabel(p.type)}</span>
                <h1>${p.title}</h1>
                <p class="muted">${p.neighborhood}, ${p.city}</p>
                <dl>
                    <dt>Área</dt>          <dd>${p.area} m²</dd>
                    <dt>Habitaciones</dt>  <dd>${p.beds}</dd>
                    <dt>Baños</dt>         <dd>${p.baths}</dd>
                    <dt>Parqueaderos</dt>  <dd>${p.parking}</dd>
                    <dt>Año</dt>           <dd>${p.year ?? "—"}</dd>
                    <dt>Código</dt>        <dd>${p.id}</dd>
                </dl>
                <h3>Descripción</h3>
                <p>${p.description}</p>
            </div>
            <aside>
                <div class="contact-card">
                    <div class="price">${formatPrice(p.price, p.op)}</div>
                    <p class="muted" style="margin:0">${p.op === "sale" ? "Precio de venta" : "Canon mensual"}</p>
                    <form id="leadForm" onsubmit="return submitLead(event)">
                        <input required type="text"  placeholder="Nombre completo" name="name">
                        <input required type="email" placeholder="Correo electrónico" name="email">
                        <input required type="tel"   placeholder="Teléfono" name="phone">
                        <textarea name="msg" placeholder="Quiero más información" rows="3"></textarea>
                        <button class="btn btn-primary" type="submit">Contactar asesor</button>
                    </form>
                    <p class="muted" style="font-size:.8rem;margin-top:14px">
                        Al enviar aceptas nuestra política de tratamiento de datos.
                    </p>
                </div>
            </aside>
        </div>
    `;
}

function typeLabel(t) {
    return { apartment:"Apartamento", house:"Casa", studio:"Apartaestudio", office:"Oficina", lot:"Lote" }[t] || t;
}

function submitLead(ev) {
    ev.preventDefault();
    const form = ev.target;
    const data = Object.fromEntries(new FormData(form));
    // In production this would POST /api/leads (Flask). For Pages we log + ack.
    console.log("LEAD_SUBMITTED", data);
    form.innerHTML = `<div class="callout"><strong>Gracias</strong> ${data.name}, un asesor te contactará en menos de 24h.</div>`;
    return false;
}

/* -------- Boot -------- */
document.addEventListener("DOMContentLoaded", () => {
    renderFeatured("featuredGrid");
    initListings();
    initDetail();
    // highlight active nav link based on filename
    const path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(a => {
        if (a.getAttribute("href") === path) a.classList.add("active");
    });
});
