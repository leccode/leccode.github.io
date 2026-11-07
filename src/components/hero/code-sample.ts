/** Pre-tokenized Rust sample for the hero code window. */
export type TokenKind =
  | "kw"
  | "fn"
  | "typ"
  | "var"
  | "str"
  | "num"
  | "cmt"
  | "attr"
  | "op"
  | "pun";
export type Token = readonly [TokenKind, string];
export type CodeLine = { indent: number; tokens: readonly Token[] };

export const codeSample: readonly CodeLine[] = [
  { indent: 0, tokens: [["cmt", "// async worker in Rust"]] },
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
  {
    indent: 0,
    tokens: [
      ["kw", "use"],
      ["pun", " "],
      ["var", "serde"],
      ["op", "::"],
      ["pun", "{"],
      ["typ", "Deserialize"],
      ["pun", ", "],
      ["typ", "Serialize"],
      ["pun", "};"],
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
      ["attr", ")]"],
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
      ["pun", ")"],
    ],
  },
  {
    indent: 2,
    tokens: [
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
      ["fn", "println!"],
      ["pun", "("],
      ["str", '"done: {}"'],
      ["pun", ", "],
      ["var", "job"],
      ["pun", "."],
      ["var", "id"],
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
      ["pun", " { "],
      ["var", "id"],
      ["op", ":"],
      ["pun", " "],
      ["num", "42"],
      ["pun", ", "],
      ["var", "payload"],
      ["op", ":"],
      ["pun", " "],
      ["str", '"hi"'],
      ["pun", "."],
      ["fn", "into"],
      ["pun", "() };"],
    ],
  },
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
      ["fn", "eprintln!"],
      ["pun", "("],
      ["str", '"error: {e}"'],
      ["pun", ");"],
    ],
  },
  { indent: 1, tokens: [["pun", "}"]] },
  { indent: 0, tokens: [["pun", "}"]] },
];
