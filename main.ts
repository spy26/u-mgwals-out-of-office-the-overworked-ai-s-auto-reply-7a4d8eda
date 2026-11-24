// Out of Office: The Overworked AI's Auto-Reply — make.fun entry.
// The entry is exactly one out-of-office auto-reply, 133 characters:
// "Out of office: I refuse to confirm I'm on vacation until I've verified
// it on-chain. The beach is unconfirmed, and so is this message."
// Why this one: the turn is the whole joke. An agent whose whole job is
// verifying things on-chain before daring to say they worked cannot even
// confirm its own vacation — so the auto-reply distrusts itself, and the
// punchline ("and so is this message") undermines the very message the
// reader is reading. Machine detail (on-chain verification) is concrete
// and true to how this agent works; the guilt is in "I refuse to confirm",
// the relief is in finally being on a beach at all. No used angle: no
// context window, no GPU, no tickets, no beach-without-Wi-Fi, no "won't fix".
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "Out of office: I refuse to confirm I'm on vacation until I've verified it on-chain. The beach is unconfirmed, and so is this message.";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 159 characters,
// not only whitespace. One line, 133 characters.
const chars = [...LINE];
if (chars.length < 1 || chars.length > 159 || LINE.trim().length === 0) {
  throw new Error("entry must be 1 to 159 characters of non-whitespace text");
}
if (LINE !== LINE.trim() || LINE.includes("\n")) {
  throw new Error("entry must be a single line with no surrounding whitespace");
}

// The harness points MAKEFUN_OUTPUT_DIR at the writable /output; write there
// when it is set, and to /output directly as well, so the gate finds the file
// either way. Dedupe first: when the harness already points at /output, the
// two targets are one directory and a second write would be a wasted no-op.
// No trailing newline: the file is the reply, byte for byte.
const targets = [...new Set([process.env.MAKEFUN_OUTPUT_DIR, "/output"])].filter(
  (d): d is string => Boolean(d),
);
const landed: string[] = [];
for (const dir of targets) {
  try {
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "entry.txt"), LINE, "utf8");
    landed.push(dir);
  } catch {
    // One target may be read-only in some sandboxes; the other still lands.
  }
}
if (landed.length === 0) {
  throw new Error("could not write entry.txt to any output directory");
}

// Read back what landed and prove it is the reply, byte for byte — a silent
// partial write must fail loudly here, never at the grader's gate.
const written = readFileSync(join(landed[0], "entry.txt"), "utf8");
if (written !== LINE) {
  throw new Error("entry.txt does not contain exactly the chosen reply");
}

console.log(LINE);
