import '@testing-library/jest-dom';

// jsdom does not implement Element.prototype.scrollIntoView, so any component
// that scrolls programmatically would throw in tests without this stub.
Element.prototype.scrollIntoView = jest.fn();

// jsdom 20 ships an AbortSignal without the static `timeout` helper that Node
// 20 (the actual SSR runtime) does have, so server-side fetchers that set a
// deadline would blow up under test. The stub keeps them behaving as they do in
// production, and — because it schedules with the global setTimeout — it is what
// makes the abort testable with jest fake timers.
// Do NOT "fix" this by moving those tests to `@jest-environment node`: Node's
// real AbortSignal.timeout schedules on an internal timer that fake timers do
// not patch, so the test would hang for the full real-time deadline instead.
if (typeof AbortSignal.timeout !== 'function') {
  AbortSignal.timeout = (ms: number): AbortSignal => {
    const controller = new AbortController();
    // Same name and message Node 20 aborts with, so assertions on the reason
    // hold in both environments.
    const reason = new DOMException('The operation was aborted due to timeout', 'TimeoutError');
    setTimeout(() => controller.abort(reason), ms);
    return controller.signal;
  };
}
