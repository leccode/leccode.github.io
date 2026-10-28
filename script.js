/* ============================================================
   THEME TOGGLE
   ============================================================ */
(function () {
  const html = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  const icon = toggle.querySelector("i");

  function updateIcon(theme) {
    icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
  }

  const initialTheme = html.getAttribute("data-theme") || "dark";
  updateIcon(initialTheme);

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    html.setAttribute("data-theme", savedTheme);
    updateIcon(savedTheme);
  }

  toggle.addEventListener("click", () => {
    const current = html.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateIcon(next);
  });
})();

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#" || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
})();

/* ============================================================
   FOOTER YEAR
   ============================================================ */
(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

/* ============================================================
   CODING TYPING ANIMATION (Rust)
   ============================================================ */
(function () {
  const codeBody = document.getElementById("codeBody");
  if (!codeBody) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const codeLines = [
    { indent: 0, tokens: [["cmt", "// async worker in Rust 🦀"]] },
    {
      indent: 0,
      tokens: [
        ["kw", "use"],
        ["pun", " "],
        ["var", "std"],
        ["op", "::"],
        ["var", "error"],
        ["op", "::"],
        ["typ", "Error"],
        ["pun", ";"],
      ],
    },
    {
      indent: 0,
      tokens: [
        ["kw", "use"],
        ["pun", " "],
        ["var", "std"],
        ["op", "::"],
        ["var", "time"],
        ["op", "::"],
        ["typ", "Duration"],
        ["pun", ";"],
      ],
    },
    { indent: 0, tokens: [] },
    {
      indent: 0,
      tokens: [
        ["kw", "use"],
        ["pun", " "],
        ["var", "serde"],
        ["op", "::"],
        ["pun", "{ "],
        ["typ", "Deserialize"],
        ["pun", ", "],
        ["typ", "Serialize"],
        ["pun", " };"],
      ],
    },
    {
      indent: 0,
      tokens: [
        ["kw", "use"],
        ["pun", " "],
        ["var", "tokio"],
        ["op", "::"],
        ["var", "time"],
        ["pun", ";"],
      ],
    },
    { indent: 0, tokens: [] },
    {
      indent: 0,
      tokens: [
        ["attr", "#[derive("],
        ["typ", "Debug"],
        ["pun", ", "],
        ["typ", "Serialize"],
        ["pun", ", "],
        ["typ", "Deserialize"],
        ["pun", ")]"],
      ],
    },
    {
      indent: 0,
      tokens: [
        ["kw", "pub struct"],
        ["pun", " "],
        ["typ", "Job"],
        ["pun", " {"],
      ],
    },
    {
      indent: 1,
      tokens: [
        ["kw", "pub"],
        ["pun", " "],
        ["var", "id"],
        ["op", ":"],
        ["pun", " "],
        ["typ", "u64"],
        ["pun", ","],
      ],
    },
    {
      indent: 1,
      tokens: [
        ["kw", "pub"],
        ["pun", " "],
        ["var", "payload"],
        ["op", ":"],
        ["pun", " "],
        ["typ", "String"],
        ["pun", ","],
      ],
    },
    { indent: 0, tokens: [["pun", "}"]] },
    { indent: 0, tokens: [] },
    {
      indent: 0,
      tokens: [
        ["kw", "pub async fn"],
        ["pun", " "],
        ["fn", "process"],
        ["pun", "("],
        ["var", "job"],
        ["op", ":"],
        ["pun", " "],
        ["typ", "Job"],
        ["pun", ") "],
        ["op", "->"],
        ["pun", " "],
        ["typ", "Result"],
        ["op", "<"],
        ["pun", "(), "],
        ["typ", "Box"],
        ["op", "<"],
        ["kw", "dyn"],
        ["pun", " "],
        ["typ", "Error"],
        ["op", ">>"],
        ["pun", " {"],
      ],
    },
    { indent: 1, tokens: [["cmt", "// simulate async I/O"]] },
    {
      indent: 1,
      tokens: [
        ["var", "time"],
        ["op", "::"],
        ["fn", "sleep"],
        ["pun", "("],
        ["typ", "Duration"],
        ["op", "::"],
        ["fn", "from_millis"],
        ["pun", "("],
        ["num", "120"],
        ["pun", "))."],
        ["kw", "await"],
        ["pun", ";"],
      ],
    },
    {
      indent: 1,
      tokens: [
        ["var", "println!"],
        ["pun", "("],
        ["str", '"done: {} ({})"'],
        ["pun", ", "],
        ["var", "job"],
        ["pun", "."],
        ["var", "id"],
        ["pun", ", "],
        ["var", "job"],
        ["pun", "."],
        ["var", "payload"],
        ["pun", ");"],
      ],
    },
    {
      indent: 1,
      tokens: [
        ["typ", "Ok"],
        ["pun", "(())"],
      ],
    },
    { indent: 0, tokens: [["pun", "}"]] },
    { indent: 0, tokens: [] },
    { indent: 0, tokens: [["attr", "#[tokio::main]"]] },
    {
      indent: 0,
      tokens: [
        ["kw", "async fn"],
        ["pun", " "],
        ["fn", "main"],
        ["pun", "() {"],
      ],
    },
    {
      indent: 1,
      tokens: [
        ["kw", "let"],
        ["pun", " "],
        ["var", "job"],
        ["pun", " = "],
        ["typ", "Job"],
        ["pun", " {"],
      ],
    },
    {
      indent: 2,
      tokens: [
        ["var", "id"],
        ["op", ":"],
        ["pun", " "],
        ["num", "42"],
        ["pun", ","],
      ],
    },
    {
      indent: 2,
      tokens: [
        ["var", "payload"],
        ["op", ":"],
        ["pun", " "],
        ["str", '"hello"'],
        ["pun", "."],
        ["fn", "into"],
        ["pun", "(),"],
      ],
    },
    { indent: 1, tokens: [["pun", "};"]] },
    {
      indent: 1,
      tokens: [
        ["kw", "if let"],
        ["pun", " "],
        ["typ", "Err"],
        ["pun", "("],
        ["var", "e"],
        ["pun", ") = "],
        ["fn", "process"],
        ["pun", "("],
        ["var", "job"],
        ["pun", ")."],
        ["kw", "await"],
        ["pun", " {"],
      ],
    },
    {
      indent: 2,
      tokens: [
        ["var", "eprintln!"],
        ["pun", "("],
        ["str", '"error: {e}"'],
        ["pun", ");"],
      ],
    },
    { indent: 1, tokens: [["pun", "}"]] },
    { indent: 0, tokens: [["pun", "}"]] },
  ];

  const fragment = document.createDocumentFragment();
  const lineElements = [];

  codeLines.forEach((line, idx) => {
    const lineDiv = document.createElement("div");
    lineDiv.className = "line";

    const numDiv = document.createElement("span");
    numDiv.className = "line-num";
    numDiv.textContent = (idx + 1).toString();

    const contentDiv = document.createElement("span");
    contentDiv.className = "line-content";

    if (line.indent > 0) {
      contentDiv.appendChild(document.createTextNode("  ".repeat(line.indent)));
    }

    line.tokens.forEach(([cls, text]) => {
      const span = document.createElement("span");
      span.className = cls;
      span.textContent = text;
      contentDiv.appendChild(span);
    });

    lineDiv.appendChild(numDiv);
    lineDiv.appendChild(contentDiv);
    fragment.appendChild(lineDiv);
    lineElements.push({ lineDiv, contentDiv });
  });

  codeBody.appendChild(fragment);

  if (reducedMotion) {
    const cursor = document.createElement("span");
    cursor.className = "cursor";
    lineElements[lineElements.length - 1].contentDiv.appendChild(cursor);
    return;
  }

  lineElements.forEach((le) => {
    le.lineDiv.style.opacity = "0";
  });

  const cursor = document.createElement("span");
  cursor.className = "cursor";

  function revealNext(index) {
    if (index >= lineElements.length) return;

    if (cursor.parentNode) cursor.parentNode.removeChild(cursor);

    const le = lineElements[index];
    le.lineDiv.style.transition = "opacity 0.15s ease";
    le.lineDiv.style.opacity = "1";
    le.contentDiv.appendChild(cursor);

    setTimeout(() => revealNext(index + 1), 160 + Math.random() * 100);
  }

  setTimeout(() => revealNext(0), 350);
})();
