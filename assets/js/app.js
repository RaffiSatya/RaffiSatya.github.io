(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  requestAnimationFrame(() => document.body.classList.add("is-loaded"));
  $("#year").textContent = new Date().getFullYear();

  /* ---------- clock (WIB) ---------- */
  const clock = $("#clock");
  const tick = () => {
    clock.textContent = new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Jakarta", hour12: false });
  };
  tick(); setInterval(tick, 1000);

  /* ---------- scroll progress + topbar ---------- */
  const bar = $(".progress span");
  const topbar = $(".topbar");
  const onScroll = () => {
    const h = document.documentElement;
    bar.style.transform = `scaleX(${h.scrollTop / (h.scrollHeight - h.clientHeight || 1)})`;
    topbar.classList.toggle("is-scrolled", h.scrollTop > 20);
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- mobile nav ---------- */
  const burger = $("#burger"), nav = $("#nav");
  const setNav = open => { nav.classList.toggle("is-open", open); burger.setAttribute("aria-expanded", open); };
  burger.addEventListener("click", () => setNav(!nav.classList.contains("is-open")));
  $$("a", nav).forEach(a => a.addEventListener("click", () => setNav(false)));

  /* active nav link */
  const navLinks = $$("a", nav);
  const navObserver = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  ["about", "work", "experience", "publications", "contact"].map(id => document.getElementById(id)).filter(Boolean).forEach(el => navObserver.observe(el));

  /* ---------- counters ---------- */
  const count = el => {
    const end = +el.dataset.count, pad = +el.dataset.pad || 0, t0 = performance.now(), dur = 1400;
    const step = now => {
      const p = Math.min(1, (now - t0) / dur), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
      el.textContent = String(v).padStart(pad, "0");
      if (p < 1) requestAnimationFrame(step);
    };
    reduceMotion ? (el.textContent = String(end).padStart(pad, "0")) : requestAnimationFrame(step);
  };

  /* ---------- reveal ---------- */
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("is-in");
    $$("[data-count]", e.target).forEach(count);
    io.unobserve(e.target);
  }), { threshold: .12 });
  const observeReveals = root => $$(".reveal", root).forEach(el => io.observe(el));

  /* ---------- topographic contours (marching squares) ---------- */
  const cv = $("#contours"), ctx = cv.getContext("2d");
  let W, H, dpr, running = true, t = 0;
  const CELL = 16, LEVELS = 11;
  const field = (x, y, t) =>
    Math.sin(x * .0042 + t * .6) * Math.cos(y * .0051 - t * .4) +
    .6 * Math.sin((x + y) * .0031 + t * .3) +
    .45 * Math.cos(Math.hypot(x - W * .72, y - H * .45) * .0095 - t * .5) +
    .3 * Math.sin(x * .011 - y * .007 + t * .2);
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const draw = () => {
    const cols = Math.ceil(W / CELL) + 1, rows = Math.ceil(H / CELL) + 1;
    const v = new Float32Array(cols * rows);
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) v[j * cols + i] = field(i * CELL, j * CELL, t);
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = getComputedStyle(cv).color;
    for (let l = 0; l < LEVELS; l++) {
      const iso = -1.9 + l * (3.8 / (LEVELS - 1));
      ctx.lineWidth = l % 5 === 0 ? 1.4 : .7;
      ctx.beginPath();
      for (let j = 0; j < rows - 1; j++) for (let i = 0; i < cols - 1; i++) {
        const a = v[j * cols + i], b = v[j * cols + i + 1], c = v[(j + 1) * cols + i + 1], d = v[(j + 1) * cols + i];
        const idx = (a > iso) | ((b > iso) << 1) | ((c > iso) << 2) | ((d > iso) << 3);
        if (idx === 0 || idx === 15) continue;
        const x = i * CELL, y = j * CELL, lerp = (p, q) => (iso - p) / (q - p);
        const T = [x + CELL * lerp(a, b), y], R = [x + CELL, y + CELL * lerp(b, c)],
              B = [x + CELL * lerp(d, c), y + CELL], L = [x, y + CELL * lerp(a, d)];
        const seg = (p, q) => { ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); };
        switch (idx) {
          case 1: case 14: seg(L, T); break;
          case 2: case 13: seg(T, R); break;
          case 3: case 12: seg(L, R); break;
          case 4: case 11: seg(R, B); break;
          case 5: seg(L, T); seg(R, B); break;
          case 6: case 9: seg(T, B); break;
          case 7: case 8: seg(L, B); break;
          case 10: seg(T, R); seg(L, B); break;
        }
      }
      ctx.stroke();
    }
  };
  let last = 0;
  const loop = now => {
    if (running && now - last > 50) { t += .012; draw(); last = now; }
    requestAnimationFrame(loop);
  };
  resize(); draw();
  addEventListener("resize", () => { resize(); draw(); });
  if (!reduceMotion) {
    new IntersectionObserver(([e]) => (running = e.isIntersecting)).observe(cv);
    requestAnimationFrame(loop);
  }

  /* ---------- crosshair coordinates ---------- */
  const hero = $("#hero"), cross = $("#crosshair"), coord = $("#coord");
  const LAT0 = -7.759, LON0 = 110.378, SPAN = .06;
  hero.addEventListener("pointermove", e => {
    const r = hero.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    cross.style.setProperty("--x", x + "px"); cross.style.setProperty("--y", y + "px");
    const lat = LAT0 + SPAN * (.5 - y / r.height), lon = LON0 + SPAN * (x / r.width - .5);
    coord.textContent = `${Math.abs(lat).toFixed(5)}° ${lat < 0 ? "S" : "N"} · ${lon.toFixed(5)}° E`;
  });

  /* ---------- works ---------- */
  const works = window.WORKS || [];
  const list = $("#works");
  const host = url => { try { return new URL(url).host; } catch { return url; } };
  list.innerHTML = works.map((w, i) => {
    const hit = w.noZoom ? ""
      : w.img
      ? `<button type="button" class="w-hit" data-i="${i}" aria-label="${w.gallery ? "Open gallery" : "View image"}: ${w.title}"></button>`
      : w.url ? `<a class="w-hit" href="${w.url}" target="_blank" rel="noopener" aria-label="Open ${w.title}"></a>` : "";
    return `
    <li class="work-item${w.size === "full" ? " is-full" : w.featured ? " is-wide" : ""}" data-cat="${w.cat}">
      <article class="w-card${hit ? "" : " is-static"}">
        <div class="w-thumb">
          ${w.img ? `<img src="${w.img}" alt="${w.title}" loading="lazy">` : `<span class="w-placeholder">${w.url ? host(w.url) : "Visuals coming soon"}</span>`}
          <div class="w-badges">
            ${w.award ? `<span class="w-award">🏆 ${w.award}</span>` : ""}
            ${w.url ? `<span class="w-live"><i></i>Live</span>` : ""}
          </div>
        </div>
        <div class="w-body">
          <span class="w-client">${w.client}</span>
          <h3 class="w-title">${w.title}</h3>
          <p class="w-meta">${w.meta}</p>
          ${w.url ? `<a class="w-visit" href="${w.url}" target="_blank" rel="noopener">Visit live ↗</a>` : ""}
          ${w.repo ? `<a class="w-visit" href="${w.repo}" target="_blank" rel="noopener">Source code ↗</a>` : ""}
        </div>
        ${hit}
      </article>
    </li>`;
  }).join("");

  /* filter */
  const items = $$(".work-item", list);
  $$(".chip").forEach(chip => {
    const c = chip.dataset.filter, el = $("sup", chip);
    if (el) el.textContent = c === "all" ? works.length : works.filter(w => w.cat === c).length;
  });
  let visible = works.map((_, i) => i);
  $$(".chip").forEach(chip => chip.addEventListener("click", () => {
    const f = chip.dataset.filter;
    $$(".chip").forEach(c => { c.classList.toggle("is-on", c === chip); c.setAttribute("aria-pressed", c === chip); });
    visible = [];
    items.forEach((li, i) => {
      const show = f === "all" || works[i].cat === f;
      li.hidden = !show;
      if (show) visible.push(i);
    });
  }));

  /* ---------- lightbox ---------- */
  // `pool` is what the arrows cycle through: a project's gallery, or every visible project with an image.
  const lb = $("#lightbox"), lbImg = $("img", lb), lbCap = $("figcaption", lb);
  let pool = [], cur = 0;
  const show = k => {
    cur = (k + pool.length) % pool.length;
    const p = pool[cur];
    lbImg.src = p.img; lbImg.alt = p.title;
    lbCap.innerHTML = `<b>${p.title}</b>${p.sub}${pool.length > 1 && p.gallery ? ` · ${cur + 1}/${pool.length}` : ""}`;
    lbImg.style.animation = "none"; lbImg.offsetWidth; lbImg.style.animation = "";
  };
  const step = d => show(cur + d);
  const open = i => {
    const w = works[i];
    if (w.gallery) {
      pool = w.gallery.map(g => ({ ...g, gallery: true }));
      show(0);
    } else {
      const ids = visible.filter(j => works[j].img && !works[j].gallery && !works[j].noZoom);
      pool = ids.map(j => ({ img: works[j].img, title: works[j].title, sub: works[j].client + (works[j].award ? " · " + works[j].award : "") }));
      show(ids.indexOf(i));
    }
  };
  const close = () => { lb.hidden = true; document.body.style.overflow = ""; };
  list.addEventListener("click", e => {
    const b = e.target.closest("button.w-hit"); if (!b) return;
    open(+b.dataset.i); lb.hidden = false; document.body.style.overflow = "hidden";
    $(".lightbox__close", lb).focus();
  });
  $(".lightbox__close", lb).addEventListener("click", close);
  $(".prev", lb).addEventListener("click", () => step(-1));
  $(".next", lb).addEventListener("click", () => step(1));
  lb.addEventListener("click", e => { if (e.target === lb) close(); });
  addEventListener("keydown", e => {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  /* ---------- publications & IP ---------- */
  const pubs = window.PUBLICATIONS || [], ips = window.IP || [];
  const ME = "Raffi Satya Nugraha";
  const me = a => a === ME ? `<b>${a}</b>` : a;
  // Long author lists: first two names, then me (with "…" if names are skipped), then "et al."
  const authorLine = list => {
    if (list.length <= 4) return list.map(me).join(", ");
    const k = list.indexOf(ME), head = list.slice(0, 2).map(me);
    if (k < 0) return `${head.join(", ")}, et al.`;
    if (k <= 2) return `${list.slice(0, 3).map(me).join(", ")}, et al.`;
    return `${head.join(", ")}, …, ${me(ME)}, et al.`;
  };
  const pubHTML = pubs.map(p => `
    <li class="pub">
      <span class="pub__tag${p.status === "Published" ? " is-done" : /accepted|in press/i.test(p.status) ? " is-accepted" : /presented/i.test(p.status) ? " is-presented" : ""}">${p.status}</span>
      <div>
        <h4>${p.url ? `<a href="${p.url}" target="_blank" rel="noopener">${p.title} ↗</a>` : p.title}</h4>
        <p class="pub__authors">${authorLine(p.authors || [])}</p>
        <p class="pub__meta mono">${[p.venue, p.year, p.index, p.note].filter(Boolean).join(" · ")}</p>
      </div>
    </li>`).join("");
  const ipHTML = ips.map(p => `
    <li class="pub">
      <span class="pub__tag is-ip">©</span>
      <div>
        <h4>${p.title}</h4>
        <p class="pub__authors"><i>${p.original}</i></p>
        <p class="pub__meta mono">${[p.type, "Reg. No. " + p.number, p.year, p.holder].filter(Boolean).join(" · ")}</p>
      </div>
    </li>`).join("");
  $("#pubs").innerHTML =
    (pubs.length ? `<div class="pubs__group reveal"><h3 class="mini mono">Publications</h3><ol class="pub-list">${pubHTML}</ol></div>` : "") +
    (ips.length ? `<div class="pubs__group reveal"><h3 class="mini mono">Intellectual Property</h3><ol class="pub-list">${ipHTML}</ol></div>` : "");
  if (!pubs.length && !ips.length) $("#publications").remove();

  /* ---------- capability hover origin ---------- */
  $$(".cap").forEach(c => c.addEventListener("pointerenter", e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", e.clientX - r.left + "px");
    c.style.setProperty("--my", e.clientY - r.top + "px");
  }));

  /* ---------- copy email ---------- */
  const copyBtn = $("#copyEmail"), hint = $("#copyHint");
  copyBtn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(copyBtn.dataset.email); hint.textContent = "Copied ✓"; }
    catch { location.href = "mailto:" + copyBtn.dataset.email; }
    setTimeout(() => (hint.textContent = "Click to copy"), 2000);
  });

  observeReveals(document);
  $$(".sec-head").forEach(h => io.observe(h));
})();
