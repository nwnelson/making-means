/** Preserve stack locations without forwarding provider messages or request objects. */
export function inquiryError(message: string, source: unknown): Error {
  const error = new Error(message);
  if (source instanceof Error && source.stack) {
    const frames = source.stack.split("\n").filter((line) => /^\s+at /.test(line));
    if (frames.length) error.stack = `${error.name}: ${message}\n${frames.join("\n")}`;
  }
  return error;
}
