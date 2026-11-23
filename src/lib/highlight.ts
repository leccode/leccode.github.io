/**
 * Tiny, dependency-free syntax highlighter for TS / TSX / JS, Python, C# and Bash.
 * Small enough to ship to the client.
 */

export type TokenType =
  | "kw"
  | "str"
  | "num"
  | "com"
  | "fn"
  | "type"
  | "prop"
  | "tag"
  | "punc"
  | "op"
  | "plain";

export type Token = { type: TokenType; text: string };

const TS_KW = [
  "import",
  "from",
  "export",
  "default",
  "const",
  "let",
  "var",
  "function",
  "return",
  "if",
  "else",
  "for",
  "while",
  "await",
  "async",
  "new",
  "type",
  "interface",
  "extends",
  "implements",
  "class",
  "as",
  "of",
  "in",
  "true",
  "false",
  "null",
  "undefined",
  "this",
  "try",
  "catch",
  "throw",
  "switch",
  "case",
  "break",
  "satisfies",
  "readonly",
  "keyof",
  "typeof",
  "void",
];

const KEYWORDS: Record<string, Set<string>> = {
  ts: new Set(TS_KW),
  tsx: new Set(TS_KW),
  bash: new Set([
    "set",
    "echo",
    "if",
    "then",
    "fi",
    "do",
    "done",
    "for",
    "in",
    "export",
    "cd",
  ]),
  py: new Set([
    "def",
    "return",
    "import",
    "from",
    "as",
    "for",
    "in",
    "if",
    "elif",
    "else",
    "class",
    "with",
    "lambda",
    "None",
    "True",
    "False",
    "and",
    "or",
    "not",
    "is",
    "yield",
    "try",
    "except",
    "raise",
    "pass",
    "while",
    "self",
    "async",
    "await",
  ]),
  cs: new Set([
    "using",
    "namespace",
    "public",
    "private",
    "protected",
    "internal",
    "class",
    "record",
    "struct",
    "interface",
    "static",
    "async",
    "await",
    "var",
    "new",
    "return",
    "if",
    "else",
    "foreach",
    "in",
    "is",
    "string",
    "int",
    "bool",
    "void",
    "null",
    "true",
    "false",
    "readonly",
    "sealed",
    "override",
    "this",
    "get",
    "set",
    "init",
    "required",
  ]),
};

export function highlight(code: string, lang: string): Token[] {
  const hashComments = lang === "bash" || lang === "py";
  const comment = hashComments
    ? String.raw`#[^\n]*`
    : String.raw`\/\/[^\n]*|\/\*[\s\S]*?\*\/`;
  // Python decorators get the "tag" color
  const attr = lang === "py" ? String.raw`@[\w.]+` : String.raw`(?!)`;
  const keywords = KEYWORDS[lang] ?? KEYWORDS.ts;
  const ident =
    lang === "bash"
      ? String.raw`[A-Za-z_$][\w$-]*`
      : String.raw`[A-Za-z_$][\w$]*`;

  const re = new RegExp(
    [
      `(${comment})`,
      `(${attr})`,
      String.raw`("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|\`(?:\\.|[^\`\\])*\`)`,
      String.raw`(\b\d[\d_]*(?:\.\d+)?\b)`,
      `(${ident})`,
      String.raw`(\s+)`,
      String.raw`([\s\S])`,
    ].join("|"),
    "g",
  );

  const tokens: Token[] = [];
  let prev = "";
  let prev2 = "";
  let m: RegExpExecArray | null;

  while ((m = re.exec(code))) {
    const [text, com, at, str, num, id, ws] = m;
    let type: TokenType = "plain";

    if (com) type = "com";
    else if (at) type = "tag";
    else if (str) type = "str";
    else if (num) type = "num";
    else if (id) {
      if (keywords.has(id)) type = "kw";
      else if (prev === "<" || (prev === "/" && prev2 === "<")) type = "tag";
      else if (prev === ".") type = "prop";
      else if (code[re.lastIndex] === "(") type = "fn";
      else if (/^[A-Z]/.test(id)) type = "type";
    } else if (ws) type = "plain";
    else type = /[{}()[\];,.]/.test(text) ? "punc" : "op";

    tokens.push({ type, text });
    if (!ws) {
      prev2 = prev;
      prev = text;
    }
  }

  return tokens;
}

/** Returns tokens split into lines, truncated to the first `count` characters. */
export function sliceLines(tokens: Token[], count: number): Token[][] {
  const lines: Token[][] = [[]];
  let left = count;
  for (const t of tokens) {
    if (left <= 0) break;
    const text = t.text.slice(0, left);
    left -= text.length;
    text.split("\n").forEach((part, i) => {
      if (i > 0) lines.push([]);
      if (part) lines[lines.length - 1].push({ type: t.type, text: part });
    });
  }
  return lines;
}
