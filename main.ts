import { mkdirSync, writeFileSync } from "node:fs";

// ---------------------------------------------------------------------------
// Entry text
// ---------------------------------------------------------------------------
// The GPS's one-line excuse for sending the driver down the wrong road.
// GPS voice: a turn instruction, smug and defensive, blaming nobody but
// taking full credit for the "shortcut" — with a fresh, specific detail.
const ENTRY =
  "In 200 feet, turn left into the wedding. The bride asked for a grand entrance, and I delivered.";

// ---------------------------------------------------------------------------
// Output rules
// ---------------------------------------------------------------------------
// The entry must be a single line of plain text, 1 to 200 characters long,
// with no line breaks and not only whitespace. Keeping the limits as named
// constants makes the gate self-check easy to audit against the rules.
const OUTPUT_DIR = "/output";
const OUTPUT_PATH = "/output/entry.txt";
const MIN_LENGTH = 1;
const MAX_LENGTH = 200;
const SINGLE_LINE_PATTERN = /\n|\r/;

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

/** Trim surrounding whitespace; the stored line is the trimmed text. */
function normalizeLine(raw: string): string {
  return raw.trim();
}

/** The line must be non-empty and no longer than the allowed maximum. */
function assertLength(line: string): void {
  if (line.length < MIN_LENGTH || line.length > MAX_LENGTH) {
    throw new Error(
      `Entry must be ${MIN_LENGTH}-${MAX_LENGTH} characters, got ${line.length}.`,
    );
  }
}

/** The line must not contain any newline or carriage-return characters. */
function assertSingleLine(line: string): void {
  if (SINGLE_LINE_PATTERN.test(line)) {
    throw new Error("Entry must be a single line.");
  }
}

/** Run every gate self-check on the candidate line. */
function validateLine(raw: string): string {
  const line = normalizeLine(raw);
  assertLength(line);
  assertSingleLine(line);
  return line;
}

// ---------------------------------------------------------------------------
// Output helper
// ---------------------------------------------------------------------------

/** Write the validated line to the output file with a trailing newline. */
function writeEntry(line: string): void {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_PATH, line + "\n", "utf8");
  console.log(`Wrote ${OUTPUT_PATH} (${line.length} characters).`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  const line = validateLine(ENTRY);
  writeEntry(line);
}

main();
