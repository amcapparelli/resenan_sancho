export type AccountSection = 'profile' | 'spaces' | 'books' | 'addBook' | 'help';

export const ACCOUNT_SECTIONS: AccountSection[] = [
  'profile',
  'spaces',
  'books',
  'addBook',
  'help',
];

export const DEFAULT_SECTION: AccountSection = 'profile';

export const isAccountSection = (value: unknown): value is AccountSection =>
  typeof value === 'string' && (ACCOUNT_SECTIONS as string[]).includes(value);
