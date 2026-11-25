import { mkdirSync, writeFileSync } from "node:fs";

// ---------------------------------------------------------------------------
// Entry text
// ---------------------------------------------------------------------------
// One-line excuse from a GPS that sent the driver down the wrong road.
// The voice is a turn instruction: smug, defensive, taking full credit
// for the "shortcut" while blaming nobody, with one fresh, specific detail.
function buildEntryText(): string {
  return "In 200 feet, turn left into the wedding. The bride asked for a grand entrance, and I delivered.";
}

const GPS_INSTRUCTION = buildEntryText();

// ---------------------------------------------------------------------------
// Output rules
// ---------------------------------------------------------------------------
// The entry has to be one line of plain text, between 1 and 200 characters,
// with no line breaks and more than just whitespace. The limits live in
// named constants below so the gate checks stay easy to audit.
const OUT_DIR = "/output";
const OUT_FILE = "/output/entry.txt";
const MIN_CHARS = 1;
const MAX_CHARS = 200;
const LINE_BREAK_PATTERN = /\n|\r/;

// ---------------------------------------------------------------------------
// Gate checks
// ---------------------------------------------------------------------------

/** Strip surrounding whitespace; the stored line is the trimmed text. */
function tidyLine(raw: string): string {
  return raw.trim();
}

/** The line must be non-empty and within the allowed character budget. */
function checkLength(line: string): void {
  if (line.length < MIN_CHARS || line.length > MAX_CHARS) {
    throw new Error(
      `Entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${line.length}.`,
    );
  }
}

/** Reject any newline or carriage-return inside the line. */
function checkOneLine(line: string): void {
  if (LINE_BREAK_PATTERN.test(line)) {
    throw new Error("Entry must be a single line.");
  }
}

/** Apply every gate check to a candidate line and return the clean line. */
function prepareLine(raw: string): string {
  const cleaned = tidyLine(raw);
  checkLength(cleaned);
  checkOneLine(cleaned);
  return cleaned;
}

// ---------------------------------------------------------------------------
// Output helper
// ---------------------------------------------------------------------------

/** Save the validated line to the output file with a trailing newline. */
function saveEntry(line: string): void {
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, line + "\n", "utf8");
  console.log(`Wrote ${OUT_FILE} (${line.length} characters).`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  const checked = prepareLine(GPS_INSTRUCTION);
  saveEntry(checked);
}

main();
