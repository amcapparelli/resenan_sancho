import '@testing-library/jest-dom';

// jsdom does not implement Element.prototype.scrollIntoView, so any component
// that scrolls programmatically would throw in tests without this stub.
Element.prototype.scrollIntoView = jest.fn();
