/**
 * Joins a first and a last name into a single display string.
 *
 * Guarantees, for any combination of missing, empty or whitespace-only parts:
 * no leading space, no trailing space and no doubled space in the middle. Each
 * part is trimmed on its own before joining, so a stored value like `'Marina '`
 * cannot leak an interior double space into the output.
 *
 * This matters because most authors and reviewers on the platform are
 * independent and register with no surname at all, so a missing or blank
 * `last` is the normal case, not an edge case.
 */
const buildFullName = (first?: string, last?: string): string => [first, last]
  .map((part) => (part || '').trim())
  .filter(Boolean)
  .join(' ');

export default buildFullName;
