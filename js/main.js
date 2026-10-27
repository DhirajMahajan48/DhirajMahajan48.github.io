/* =========================================================
   Dhiraj Mahajan — Portfolio interactions
   ========================================================= */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  document.body.classList.add("is-loading");
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Preloader: a tiny "test run" ---------- */
  async function runPreloader() {
    const log = $("#preloaderLog");
    const bar = $("#preloaderBar");
    const lines = [
      '<span class="c-amber">$</span> npx playwright test portfolio.spec.js',
      '<span class="ok">✓</span> hero renders',
      '<span class="ok">✓</span> projects load (3)',
      '<span class="ok">✓</span> contact links resolve',
      '<span class="ok">✓</span> 0 critical defects',
    ];
    if (!reduceMotion) {
      for (let i = 0; i < lines.length; i++) {
        const li = document.createElement("li");
        li.innerHTML = lines[i];
        log.appendChild(li);
        bar.style.width = ((i + 1) / (lines.length + 1)) * 100 + "%";
        await wait(i === 0 ? 380 : 210);
      }
      const done = document.createElement("li");
      done.className = "final";
      done.textContent = "All tests passed — welcome.";
      log.appendChild(done);
      bar.style.width = "100%";
      await wait(450);
    }
    $("#preloader").classList.add("is-done");
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-ready");
    const portrait = $("#portrait");
    portrait.classList.add("is-glitch");
    setTimeout(() => portrait.classList.remove("is-glitch"), 1300);
  }
  window.addEventListener("load", runPreloader);

  /* ---------- Neural network background ---------- */
  (function neural() {
    const canvas = $("#neural");
    const ctx = canvas.getContext("2d");
    let w, h, dpr, nodes = [], raf;
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = innerWidth * dpr;
      h = canvas.height = innerHeight * dpr;
      const count = Math.min(90, Math.floor((innerWidth * innerHeight) / 16000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25 * dpr,
        vy: (Math.random() - 0.5) * 0.25 * dpr,
        r: (Math.random() * 1.4 + 0.6) * dpr,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const max = 140 * dpr;
      const mMax = 200 * dpr;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (!reduceMotion) {
          a.x += a.vx; a.y += a.vy;
          if (a.x < 0 || a.x > w) a.vx *= -1;
          if (a.y < 0 || a.y > h) a.vy *= -1;
        }
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < max) {
            ctx.strokeStyle = `rgba(255,179,92,${(1 - d / max) * 0.22})`;
            ctx.lineWidth = dpr * 0.8;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (md < mMax) {
          ctx.strokeStyle = `rgba(255,220,171,${(1 - md / mMax) * 0.5})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = md < mMax ? "rgba(255,220,171,0.95)" : "rgba(255,179,92,0.6)";
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
      }
      if (!reduceMotion) raf = requestAnimationFrame(draw);
    }

    resize(); draw();
    let rt;
    addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(() => { cancelAnimationFrame(raf); resize(); draw(); }, 150);
    });
    addEventListener("mousemove", (e) => { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; });
    document.addEventListener("visibilitychange", () => {
      if (reduceMotion) return;
      if (document.hidden) cancelAnimationFrame(raf);
      else draw();
    });
  })();

  /* ---------- Typed suite names ---------- */
  (function typed() {
    const el = $("#typed");
    const words = [
      "End-to-End Flows",
      "Load Testing",
      "Smoke Testing",
      "Regression Suites",
      "API + SQL Validation",
      "AI Output Validation",
      "Android & iOS",
    ];
    if (reduceMotion) return;
    let wi = 0, ci = words[0].length, deleting = true;
    (function tick() {
      const word = words[wi];
      el.textContent = word.slice(0, ci);
      let delay = deleting ? 35 : 70;
      if (deleting) {
        ci--;
        if (ci < 0) { deleting = false; wi = (wi + 1) % words.length; ci = 0; delay = 250; }
      } else {
        ci++;
        if (ci > words[wi].length) { deleting = true; ci = words[wi].length; delay = 1600; }
      }
      setTimeout(tick, delay);
    })();
  })();

  /* ---------- Reveal on scroll + counters ---------- */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      $$(".count", e.target).forEach(countUp);
      io.unobserve(e.target);
    }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  $$(".reveal").forEach((el) => io.observe(el));

  function countUp(el) {
    const to = +el.dataset.to;
    if (reduceMotion) { el.textContent = to; return; }
    const start = performance.now();
    const dur = 1600;
    (function step(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }

  /* ---------- Nav ---------- */
  const nav = $("#nav");
  const burger = $("#navBurger");
  const links = $("#navLinks");
  const progress = $("#scrollProgress");

  burger.addEventListener("click", () => {
    const open = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!open));
    links.classList.toggle("is-open", !open);
  });
  $$("a", links).forEach((a) => a.addEventListener("click", () => {
    burger.setAttribute("aria-expanded", "false");
    links.classList.remove("is-open");
  }));

  const sectionIO = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      $$("a", links).forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id));
    }),
    { rootMargin: "-45% 0px -50% 0px" }
  );
  $$("main section[id]").forEach((s) => sectionIO.observe(s));

  /* ---------- Scroll-driven bits ---------- */
  const pipeline = $("#pipeline");
  const fill = $("#pipelineFill");
  const steps = $$(".step", pipeline);

  function onScroll() {
    const y = scrollY;
    nav.classList.toggle("is-scrolled", y > 40);
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    const r = pipeline.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (innerHeight * 0.75 - r.top) / r.height));
    fill.style.width = p * 100 + "%";
    pipeline.style.setProperty("--fill", p * 100 + "%");
    steps.forEach((s, i) => s.classList.toggle("is-on", p >= i / steps.length + 0.02));
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Custom cursor, magnetic buttons, tilt ---------- */
  if (finePointer && !reduceMotion) {
    const dot = $(".cursor-dot");
    const ring = $(".cursor-ring");
    const label = $("span", ring);
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;

    addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
    });
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();

    document.addEventListener("mouseover", (e) => {
      const labelled = e.target.closest("[data-cursor]");
      const interactive = e.target.closest("a, button, input, textarea, .card, .tl-item__card");
      if (labelled && !e.target.closest("button, a")) {
        label.textContent = labelled.closest(".is-open") ? "CLOSE" : labelled.dataset.cursor;
        ring.classList.add("is-label");
        ring.classList.remove("is-hover");
      } else {
        ring.classList.remove("is-label");
        ring.classList.toggle("is-hover", !!interactive);
      }
    });

    $$(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      btn.addEventListener("mouseleave", () => (btn.style.transform = ""));
    });

    $$(".tilt").forEach((el) => {
      el.addEventListener("mouseenter", () => (el.style.transition = "transform .2s ease-out, border-color .4s"));
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 8}deg) rotateY(${(px - 0.5) * 8}deg) translateY(-4px)`;
        el.style.setProperty("--mx", px * 100 + "%");
        el.style.setProperty("--my", py * 100 + "%");
      });
      el.addEventListener("mouseleave", () => {
        el.style.transition = "";
        el.style.transform = "";
      });
    });

    const hero = $("#home");
    const portrait = $("#portrait");
    hero.addEventListener("mousemove", (e) => {
      const x = e.clientX / innerWidth - 0.5;
      const y = e.clientY / innerHeight - 0.5;
      portrait.style.transform = `perspective(1200px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
    });
    hero.addEventListener("mouseleave", () => (portrait.style.transform = ""));
  }

  /* ---------- Test Lab terminal ---------- */
  const SUITES = {
    playwright: {
      title: "~/kaabil-e2e — zsh",
      cmd: "npx playwright test --project=chromium --workers=4",
      time: "14.2s",
      lines: [
        ['<span class="c-dim">Running 10 tests using 4 workers</span>', 500],
        ["", 150],
        ['<span class="c-pass">  ✓</span>  <span class="c-dim">1</span> candidate/signup.spec.js › candidate signs up &amp; builds profile <span class="c-dim">(2.4s)</span>', 380, 1],
        ['<span class="c-pass">  ✓</span>  <span class="c-dim">2</span> recruiter/job-post.spec.js › post job &amp; attach assessment <span class="c-dim">(3.1s)</span>', 330, 1],
        ['<span class="c-pass">  ✓</span>  <span class="c-dim">3</span> hiring/pipeline.spec.js › Applied → Interview → Assessment → Hire <span class="c-dim">(4.8s)</span>', 420, 1],
        ['<span class="c-pass">  ✓</span>  <span class="c-dim">4</span> hiring/pipeline.spec.js › Applied → Reject updates candidate status <span class="c-dim">(2.2s)</span>', 300, 1],
        ['<span class="c-pass">  ✓</span>  <span class="c-dim">5</span> ai/matching.spec.js › AI candidate matching is consistent across runs <span class="c-dim">(3.6s)</span>', 450, 1],
        ['<span class="c-pass">  ✓</span>  <span class="c-dim">6</span> learning/path.spec.js › institution creates path with videos &amp; tests <span class="c-dim">(3.9s)</span>', 340, 1],
        ['<span class="c-pass">  ✓</span>  <span class="c-dim">7</span> billing/plans.spec.js › recruiter upgrades plan, payment succeeds <span class="c-dim">(4.1s)</span>', 380, 1],
        ['<span class="c-pass">  ✓</span>  <span class="c-dim">8</span> search/people.spec.js › people search enriches email ID <span class="c-dim">(2.7s)</span>', 300, 1],
        ['<span class="c-pass">  ✓</span>  <span class="c-dim">9</span> search/jobs.spec.js › direct email apply from job search <span class="c-dim">(2.9s)</span>', 300, 1],
        ['<span class="c-pass">  ✓</span> <span class="c-dim">10</span> responsive/mobile.spec.js › layout holds at 390×844 <span class="c-dim">(1.8s)</span>', 300, 1],
        ["", 200],
        ['<span class="c-pass">  10 passed</span> <span class="c-dim">(14.2s)</span>', 250],
        ['<span class="c-dim">To open last HTML report run:</span> <span class="c-amber">npx playwright show-report</span>', 0],
      ],
    },
    cucumber: {
      title: "~/ib-automation — mvn",
      cmd: 'mvn clean test -Dcucumber.filter.tags="@regression"',
      time: "41.7s",
      lines: [
        ['<span class="c-dim">[INFO] Scanning for projects...</span>', 350],
        ['<span class="c-dim">[INFO] Building ib-automation 1.0-SNAPSHOT</span>', 300],
        ['<span class="c-dim">[INFO] Running runner.TestRunner</span>', 400],
        ["", 100],
        ['<span class="c-amber">@regression</span>', 150],
        ['<span class="c-key">Feature:</span> Login &amp; user dashboard', 250],
        ['  <span class="c-key">Scenario:</span> Valid user lands on dashboard', 250],
        ['    <span class="c-key">Given</span> user is on the login page            <span class="c-pass">✓</span>', 260, 1],
        ['    <span class="c-key">When</span> user signs in with valid credentials  <span class="c-pass">✓</span>', 260, 1],
        ['    <span class="c-key">Then</span> dashboard widgets are displayed       <span class="c-pass">✓</span>', 260, 1],
        ['  <span class="c-key">Scenario:</span> Session expires after timeout', 250],
        ['    <span class="c-key">Given</span> user is signed in                    <span class="c-pass">✓</span>', 260, 1],
        ['    <span class="c-key">When</span> the session times out                <span class="c-pass">✓</span>', 260, 1],
        ['    <span class="c-key">Then</span> user is redirected to login           <span class="c-pass">✓</span>', 260, 1],
        ["", 100],
        ['<span class="c-pass">2 Scenarios (2 passed)</span>', 150],
        ['<span class="c-pass">6 Steps (6 passed)</span>', 250],
        ['<span class="c-dim">[INFO]</span> Extent report → <span class="c-amber">target/ExtentReport.html</span>', 300],
        ['<span class="c-pass">[INFO] BUILD SUCCESS</span>', 0],
      ],
    },
    jmeter: {
      title: "~/people-search-load — jmeter",
      cmd: "jmeter -n -t people-search.jmx -l results.jtl -e -o report/",
      time: "90.0s",
      lines: [
        ['<span class="c-dim">Creating summariser &lt;summary&gt;</span>', 300],
        ['<span class="c-dim">Created the tree successfully using people-search.jmx</span>', 300],
        ['<span class="c-dim">Starting standalone test @ ' + new Date().toLocaleString() + "</span>", 500],
        ['summary +   1204 in 00:00:30 =  40.1/s Avg:   212 Min:    88 Max:  1190 Err:     0 <span class="c-pass">(0.00%)</span> Active: 50', 700],
        ['summary +   1251 in 00:00:30 =  41.7/s Avg:   205 Min:    91 Max:   980 Err:     0 <span class="c-pass">(0.00%)</span> Active: 50', 700],
        ['summary +   1157 in 00:00:30 =  38.6/s Avg:   219 Min:    86 Max:  1102 Err:     0 <span class="c-pass">(0.00%)</span> Active: 0', 600],
        ['<span class="c-amber">summary =   3612 in 00:01:30 =  40.1/s Avg:   212 Min:    86 Max:  1190 Err:     0 (0.00%)</span>', 400],
        ['<span class="c-dim">Tidying up ...    ... end of run</span>', 300],
        ["", 100],
        ['<span class="c-pass">✓</span> assertion: error rate below 1%', 220, 1],
        ['<span class="c-pass">✓</span> assertion: avg response under 500 ms', 220, 1],
        ['<span class="c-pass">✓</span> assertion: no 5xx from search API', 220, 1],
        ['<span class="c-dim">HTML dashboard →</span> <span class="c-amber">report/index.html</span>', 0],
      ],
    },
  };

  const term = $("#termBody");
  const termTitle = $("#termTitle");
  const sumPass = $(".sum-pass");
  const sumTime = $(".sum-time");
  let current = "playwright";
  let runId = 0;

  async function runSuite(name) {
    const id = ++runId;
    const suite = SUITES[name];
    const alive = () => id === runId;
    termTitle.textContent = suite.title;
    term.innerHTML = "";
    let passed = 0;
    sumPass.textContent = "0 passed";
    sumTime.textContent = "running…";

    const cmdLine = document.createElement("div");
    cmdLine.innerHTML = '<span class="c-prompt">dhiraj@qa ❯</span> <span class="c-cmd"></span><span class="cursor-blk"></span>';
    term.appendChild(cmdLine);
    const cmdSpan = $(".c-cmd", cmdLine);
    for (const ch of suite.cmd) {
      if (!alive()) return;
      cmdSpan.textContent += ch;
      if (!reduceMotion) await wait(22);
    }
    $(".cursor-blk", cmdLine).remove();
    await wait(reduceMotion ? 0 : 300);

    for (const [html, delay, pass] of suite.lines) {
      if (!alive()) return;
      const div = document.createElement("div");
      div.innerHTML = html || "&nbsp;";
      term.appendChild(div);
      term.scrollTop = term.scrollHeight;
      if (pass) sumPass.textContent = ++passed + " passed";
      if (!reduceMotion) await wait(delay);
    }
    if (!alive()) return;
    sumTime.textContent = suite.time;
    const end = document.createElement("div");
    end.innerHTML = '<br><span class="c-prompt">dhiraj@qa ❯</span> <span class="cursor-blk"></span>';
    term.appendChild(end);
    term.scrollTop = term.scrollHeight;
  }

  $$(".lab__tab").forEach((tab) => tab.addEventListener("click", () => {
    $$(".lab__tab").forEach((t) => {
      t.classList.toggle("is-active", t === tab);
      t.setAttribute("aria-selected", String(t === tab));
    });
    current = tab.dataset.suite;
    runSuite(current);
  }));
  $("#rerun").addEventListener("click", () => runSuite(current));

  const termIO = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { runSuite(current); termIO.disconnect(); }
  }, { threshold: 0.4 });
  termIO.observe($(".terminal"));

  /* ---------- Project accordions ---------- */
  $$(".project").forEach((p, i) => {
    const btn = $(".project__toggle", p);
    const set = (open) => {
      p.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
    };
    if (i === 0) set(true);
    p.addEventListener("click", (e) => {
      if (window.getSelection().toString()) return;
      if (e.target.closest("a")) return;
      set(!p.classList.contains("is-open"));
      const label = $(".cursor-ring span");
      if (label && $(".cursor-ring").classList.contains("is-label")) {
        label.textContent = p.classList.contains("is-open") ? "CLOSE" : "OPEN";
      }
    });
  });

  /* ---------- Copy buttons ---------- */
  $$(".copy").forEach((btn) => btn.addEventListener("click", async () => {
    const text = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = Object.assign(document.createElement("textarea"), { value: text });
      document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
    }
    btn.textContent = "copied ✓";
    btn.classList.add("is-copied");
    setTimeout(() => { btn.textContent = "copy"; btn.classList.remove("is-copied"); }, 1600);
  }));

  /* ---------- Resume download feedback ---------- */
  $$("[data-resume]").forEach((el) => {
    const label = $(".dl-label", el);
    const original = label.textContent;
    let timer;
    el.addEventListener("click", () => {
      clearTimeout(timer);
      el.classList.remove("is-done");
      el.classList.add("is-loading");
      label.textContent = "Downloading…";
      timer = setTimeout(() => {
        el.classList.replace("is-loading", "is-done");
        label.textContent = "Downloaded ✓";
        timer = setTimeout(() => {
          el.classList.remove("is-done");
          label.textContent = original;
        }, 2600);
      }, reduceMotion ? 0 : 900);
    });
  });

  /* ---------- Contact form → mail client ---------- */
  const form = $("#contactForm");
  const note = $("#formNote");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const checks = {
      name: data.name.trim().length > 0,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()),
      message: data.message.trim().length > 0,
    };
    let ok = true;
    for (const [field, valid] of Object.entries(checks)) {
      form.elements[field].closest(".field").classList.toggle("has-error", !valid);
      if (!valid) ok = false;
    }
    if (!ok) {
      note.style.color = "var(--fail)";
      note.textContent = "✗ 1 or more assertions failed — check the fields above";
      return;
    }
    const subject = encodeURIComponent(`Portfolio enquiry from ${data.name.trim()}`);
    const body = encodeURIComponent(`${data.message.trim()}\n\n— ${data.name.trim()}\n${data.email.trim()}`);
    note.style.color = "var(--pass)";
    note.textContent = "✓ all assertions passed — opening your email app…";
    window.location.href = `mailto:dhirumahajan48@gmail.com?subject=${subject}&body=${body}`;
  });
  $$("input, textarea", form).forEach((el) =>
    el.addEventListener("input", () => el.closest(".field").classList.remove("has-error"))
  );
})();
