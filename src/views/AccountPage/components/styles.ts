import { css } from 'styled-components';

// Shared visual primitives for the account area. Kept as `css` fragments so they
// can be applied to either <button>/<a> (buttons) or <input>/<select>/<textarea>
// (fields) without duplicating the design-system values.

// Primary action — confirm / save / business action (solid terracotta).
export const primaryButton = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: ${({ theme }) => theme.terracotta};
  color: ${({ theme }) => theme.white};
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  padding: 11px 22px;
  min-height: 44px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.15s ease, transform 0.1s ease;

  &:hover {
    background: #a84a1b;
  }

  &:active {
    background: #8f3f17;
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:active {
      transform: none;
    }
  }
`;

// Secondary action — non-primary actions (Cambiar avatar, Editar). Also used as
// the destructive trigger per spec (outline terracotta that fills on hover).
export const secondaryButton = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: transparent;
  color: ${({ theme }) => theme.terracotta};
  border: 1.5px solid ${({ theme }) => theme.terracotta};
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  padding: 10px 20px;
  min-height: 44px;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.terracotta};
    color: ${({ theme }) => theme.white};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// Unified form field (input / select / textarea).
export const fieldBase = css`
  width: 100%;
  box-sizing: border-box;
  background: ${({ theme }) => theme.white};
  border: 1.5px solid ${({ theme }) => theme.lightBorder};
  border-radius: 8px;
  padding: 10px 14px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  color: ${({ theme }) => theme.ink};
  min-height: 44px;

  &:focus {
    border-color: ${({ theme }) => theme.terracotta};
    outline: none;
    box-shadow: 0 0 0 2px rgba(199, 91, 34, 0.18);
  }

  &:disabled {
    background: #f4eedd;
    color: #9a8c7e;
    cursor: not-allowed;
    border-color: #e8dfc8;
  }
`;
