(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  requestAnimationFrame(() => document.body.classList.add("is-loaded"));
  $("#year").textContent = new Date().getFullYear();

  /* ---------- local time (WIB) in the footer ---------- */
  const clock = $("#clock");
  const timeFmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", hour12: false });
  const tick = () => { clock.textContent = timeFmt.format(new Date()); };
  tick(); setInterval(tick, 30000);

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
  const setNav = open => {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  burger.addEventListener("click", () => setNav(!nav.classList.contains("is-open")));
  $$("a", nav).forEach(a => a.addEventListener("click", () => setNav(false)));
  addEventListener("keydown", e => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) { setNav(false); burger.focus(); }
  });

  /* active nav link */
  const navLinks = $$("a", nav);
  const navObserver = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  ["work", "about", "skills", "experience", "publications", "contact"]
    .map(id => document.getElementById(id)).filter(Boolean).forEach(el => navObserver.observe(el));

  /* ---------- hero: rotating data word ---------- */
  const words = $$("#rotator em");
  if (words.length > 1 && !reduceMotion) {
    let w = 0, heroVisible = true;
    new IntersectionObserver(([e]) => (heroVisible = e.isIntersecting)).observe($("#hero"));
    setInterval(() => {
      if (!heroVisible || document.hidden) return;
      const prev = words[w];
      w = (w + 1) % words.length;
      prev.classList.replace("is-on", "is-out");
      words[w].classList.remove("is-out");
      words[w].classList.add("is-on");
      setTimeout(() => prev.classList.remove("is-out"), 650);
    }, 2600);
  }

  /* ---------- hero: cards drift with the pointer (desktop only) ---------- */
  const visual = $("#heroVisual");
  if (visual && !reduceMotion && matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const hero = $("#hero");
    let raf = 0;
    hero.addEventListener("pointermove", e => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        visual.style.setProperty("--px", ((e.clientX / innerWidth) * 2 - 1).toFixed(3));
        visual.style.setProperty("--py", ((e.clientY / innerHeight) * 2 - 1).toFixed(3));
      });
    });
    hero.addEventListener("pointerleave", () => { visual.style.setProperty("--px", 0); visual.style.setProperty("--py", 0); });
  }

  /* ---------- counters (numbers are in the HTML; this only animates them once) ---------- */
  const countUp = el => {
    const end = +el.dataset.count, t0 = performance.now(), dur = 1200;
    const step = now => {
      const p = Math.min(1, (now - t0) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (!reduceMotion) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      countUp(e.target); io.unobserve(e.target);
    }), { threshold: .6 });
    $$("[data-count]").forEach(el => io.observe(el));
  }

  /* ---------- works ---------- */
  const works = window.WORKS || [];
  const list = $("#works");
  const host = url => { try { return new URL(url).host; } catch { return url; } };
  list.innerHTML = works.map((w, i) => {
    const hit = w.noZoom ? ""
      : w.img ? `<button type="button" class="w-hit" data-i="${i}" aria-label="View image: ${w.title}"></button>`
      : w.url ? `<a class="w-hit" href="${w.url}" target="_blank" rel="noopener" aria-label="Open ${w.title}"></a>` : "";
    return `
    <li class="work-item${w.size === "full" ? " is-full" : w.featured ? " is-wide" : ""}" data-cat="${w.cat}">
      <article class="w-card${hit ? "" : " is-static"}">
        <div class="w-thumb">
          ${w.img ? `<img src="${w.img}" alt="${w.title}" loading="lazy">` : `<span class="w-placeholder">${w.url ? host(w.url) : "Visuals coming soon"}</span>`}
          <div class="w-badges">
            ${w.award ? `<span class="w-award">🏆 ${w.award}</span>` : ""}
            ${w.url ? `<span class="w-live"><i aria-hidden="true"></i>Live</span>` : ""}
          </div>
        </div>
        <div class="w-body">
          <span class="w-client">${w.client}</span>
          <h3 class="w-title">${w.title}</h3>
          <p class="w-meta">${w.meta}</p>
          ${w.url || w.repo ? `<div class="w-links">
            ${w.url ? `<a class="w-visit" href="${w.url}" target="_blank" rel="noopener">Visit Live Site <span aria-hidden="true">↗</span></a>` : ""}
            ${w.repo ? `<a class="w-visit" href="${w.repo}" target="_blank" rel="noopener">View Source Code <span aria-hidden="true">↗</span></a>` : ""}
          </div>` : ""}
        </div>
        ${hit}
      </article>
    </li>`;
  }).join("");

  /* filter, kept in the URL (?filter=twin) so a filtered view can be shared */
  const items = $$(".work-item", list);
  $$(".chip").forEach(chip => {
    const c = chip.dataset.filter, el = $("sup", chip);
    if (el) el.textContent = c === "all" ? works.length : works.filter(w => w.cat === c).length;
  });
  let visible = works.map((_, i) => i);
  const applyFilter = f => {
    $$(".chip").forEach(c => { const on = c.dataset.filter === f; c.classList.toggle("is-on", on); c.setAttribute("aria-pressed", on); });
    visible = [];
    items.forEach((li, i) => {
      const show = f === "all" || works[i].cat === f;
      li.hidden = !show;
      if (show) visible.push(i);
    });
  };
  $$(".chip").forEach(chip => chip.addEventListener("click", () => {
    const f = chip.dataset.filter, url = new URL(location.href);
    f === "all" ? url.searchParams.delete("filter") : url.searchParams.set("filter", f);
    history.replaceState(null, "", url);
    applyFilter(f);
  }));
  const startFilter = new URLSearchParams(location.search).get("filter");
  if (startFilter && $(`.chip[data-filter="${CSS.escape(startFilter)}"]`)) applyFilter(startFilter);

  /* ---------- lightbox ---------- */
  // `pool` is what the arrows cycle through: every visible project with a zoomable image.
  const lb = $("#lightbox"), lbImg = $("img", lb), lbCap = $("figcaption", lb);
  let pool = [], cur = 0, opener = null;
  const show = k => {
    cur = (k + pool.length) % pool.length;
    const p = pool[cur];
    lbImg.src = p.img; lbImg.alt = p.title;
    lbCap.innerHTML = `<b>${p.title}</b>${p.sub}`;
    lbImg.style.animation = "none"; lbImg.offsetWidth; lbImg.style.animation = "";
  };
  const open = i => {
    const ids = visible.filter(j => works[j].img && !works[j].noZoom);
    pool = ids.map(j => ({ img: works[j].img, title: works[j].title, sub: works[j].client + (works[j].award ? " · " + works[j].award : "") }));
    show(ids.indexOf(i));
  };
  const close = () => { lb.hidden = true; document.body.style.overflow = ""; opener?.focus(); };
  list.addEventListener("click", e => {
    const b = e.target.closest("button.w-hit"); if (!b) return;
    opener = b;
    open(+b.dataset.i); lb.hidden = false; document.body.style.overflow = "hidden";
    $(".lightbox__close", lb).focus();
  });
  $(".lightbox__close", lb).addEventListener("click", close);
  $(".prev", lb).addEventListener("click", () => show(cur - 1));
  $(".next", lb).addEventListener("click", () => show(cur + 1));
  lb.addEventListener("click", e => { if (e.target === lb) close(); });
  addEventListener("keydown", e => {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
    if (e.key === "Tab") {
      const f = $$("button", lb), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- publications & IP ---------- */
  const pubs = window.PUBLICATIONS || [], ips = window.IP || [];
  const ME = "Raffi Satya Nugraha";
  const me = a => a === ME ? `<b>${a}</b>` : a;
  // Long author lists: first names, then me (with "…" if names are skipped), then "et al."
  const authorLine = names => {
    if (names.length <= 4) return names.map(me).join(", ");
    const k = names.indexOf(ME), head = names.slice(0, 2).map(me);
    if (k < 0) return `${head.join(", ")}, et al.`;
    if (k <= 2) return `${names.slice(0, 3).map(me).join(", ")}, et al.`;
    return `${head.join(", ")}, …, ${me(ME)}, et al.`;
  };
  const tagClass = s => s === "Published" ? " is-done" : /accepted|in press/i.test(s) ? " is-accepted" : /presented/i.test(s) ? " is-presented" : "";
  const pubHTML = pubs.map(p => `
    <li class="pub">
      <span class="pub__tag${tagClass(p.status)}">${p.status}</span>
      <div>
        <h4>${p.url ? `<a href="${p.url}" target="_blank" rel="noopener">${p.title} <span aria-hidden="true">↗</span></a>` : p.title}</h4>
        <p class="pub__authors">${authorLine(p.authors || [])}</p>
        <p class="pub__meta">${[p.venue, p.year, p.index, p.note].filter(Boolean).join(" · ")}</p>
      </div>
    </li>`).join("");
  const ipHTML = ips.map(p => `
    <li class="pub">
      <span class="pub__tag is-ip" aria-hidden="true">©</span>
      <div>
        <h4>${p.title}</h4>
        <p class="pub__authors"><i>${p.original}</i></p>
        <p class="pub__meta">${[p.type, "Reg. No. " + p.number, p.year, p.holder].filter(Boolean).join(" · ")}</p>
      </div>
    </li>`).join("");
  $("#pubs").innerHTML =
    (pubs.length ? `<div class="pubs__group card"><h3 class="mini">Publications</h3><ol class="pub-list">${pubHTML}</ol></div>` : "") +
    (ips.length ? `<div class="pubs__group card"><h3 class="mini">Intellectual Property</h3><ol class="pub-list">${ipHTML}</ol></div>` : "");
  if (!pubs.length && !ips.length) $("#publications").remove();

  /* ---------- copy email ---------- */
  const copyBtn = $("#copyEmail"), hint = $("#copyHint");
  copyBtn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(copyBtn.dataset.email); hint.textContent = "Copied ✓"; }
    catch { location.href = "mailto:" + copyBtn.dataset.email; }
    setTimeout(() => (hint.textContent = "Click to copy"), 2000);
  });
})();
