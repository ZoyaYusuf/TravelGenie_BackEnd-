export function extractValidJSON(text) {
  if (!text) return null;

  try {
    // Try direct JSON
    return JSON.parse(text);
  } catch {}

  // Remove markdown fences
  text = text.replace(/```json|```/g, "").trim();

  // Extract only JSON array or object
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]") + 1;

  if (start === -1 || end === 0) return null;

  const cleaned = text.substring(start, end);

  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}
