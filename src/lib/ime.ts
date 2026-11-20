// Some keyboards send Enter while the candidate is still being composed.
// WebKit can report that final keystroke with keyCode 229 but isComposing false.
export function isImeComposing(event: Pick<KeyboardEvent, "isComposing" | "keyCode">): boolean {
  return event.isComposing || event.keyCode === 229;
}
