/**
 * Tests for ContactModal.
 *
 * The send button's enable logic (spec §7) is an explicit requirement: it must be
 * derived from consent + message on every render, so it re-disables the instant
 * either one stops holding. The error path matters just as much: `onSubmit`
 * rejecting is the only signal the modal has to keep itself open and offer a retry.
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';

import { StyledTheme } from '../../store/context/StylesContext/Theme';
import SubmitError from '../../utils/SubmitError';
import ContactModal from '.';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const BOOK = { id: 'book-1', title: 'La sombra del viento', coverUrl: '' };
const AUTHOR = { firstName: 'Marina' };
const GENERIC_ERROR = 'No se pudo enviar el mensaje. Inténtalo de nuevo.';

function renderModal(overrides: {
  onClose?: () => void;
  onSubmit?: (message: string) => Promise<void>;
  book?: { id: string; title: string; coverUrl?: string };
} = {}) {
  const onClose = overrides.onClose ?? jest.fn();
  const onSubmit = overrides.onSubmit ?? jest.fn().mockResolvedValue(undefined);
  const book = overrides.book ?? BOOK;

  const markup = (isOpen: boolean) => (
    <ThemeProvider theme={StyledTheme}>
      <ContactModal
        isOpen={isOpen}
        onClose={onClose}
        book={book}
        author={AUTHOR}
        onSubmit={onSubmit}
      />
    </ThemeProvider>
  );

  const view = render(markup(true));

  return {
    ...view,
    onClose,
    onSubmit,
    /** Drives the `isOpen` prop the way the page does, so the reset path runs. */
    setOpen: (isOpen: boolean) => view.rerender(markup(isOpen)),
  };
}

const getSendButton = () => screen.getByRole('button', { name: /enviar mensaje/i });
const getMessageField = () => screen.getByLabelText('Tu mensaje para Marina');
// By label and not by role: this is what catches a broken htmlFor/id pairing,
// which would leave the legal text unassociated from the box.
const getConsentCheckbox = () => screen.getByLabelText(
  /Al enviar el mensaje le facilitaremos tu email/,
);
const queryRetryButton = () => screen.queryByRole('button', { name: /reintentar/i });

/** Promise whose settlement the test controls, to hold a send in flight. */
function createDeferred() {
  let resolve: () => void = () => {};
  let reject: () => void = () => {};
  const promise = new Promise<void>((res, rej) => {
    resolve = () => res();
    reject = () => rej(new Error('order failed'));
  });
  return { promise, resolve, reject };
}

// ─── Copy ────────────────────────────────────────────────────────────────────
// The wording was signed off word by word (it is what keeps casual requests
// down), so the two strings that changed late are pinned here.

describe('ContactModal — approved copy', () => {
  it('renders the second tip in the second person ("Te lo van a agradecer")', () => {
    renderModal();

    expect(screen.getByText(/Te lo van a agradecer mucho más que el silencio/)).toBeInTheDocument();
  });

  it('greets the author by name in the placeholder, with ellipsis characters', () => {
    renderModal();

    expect(getMessageField()).toHaveAttribute(
      'placeholder',
      'Hola Marina, soy… y escribo reseñas en… Me interesa tu libro porque…',
    );
  });
});

// ─── Book context ────────────────────────────────────────────────────────────

describe('ContactModal — book context', () => {
  it('renders the cover through next/image when the book has one', () => {
    renderModal({
      book: {
        id: 'book-1',
        title: 'La sombra del viento',
        coverUrl: 'https://res.cloudinary.com/demo/image/upload/cover.jpg',
      },
    });

    const cover = screen.getByAltText('Portada de La sombra del viento');
    // next/image rewrites the src through the optimizer for allow-listed hosts.
    expect(cover).toHaveAttribute('src', expect.stringContaining('/_next/image'));
  });

  it('falls back to the shared placeholder when there is no cover', () => {
    renderModal();

    expect(screen.queryByAltText(/Portada de/)).not.toBeInTheDocument();
    // The placeholder is decorative (aria-hidden, no accessible name), so it is
    // only reachable through the DOM: assert it renders instead of settling for
    // the absence of the cover, which an empty slot would also satisfy.
    const bookContextHeader = screen.getByText(BOOK.title).closest('div')?.parentElement;
    expect(bookContextHeader?.querySelector('svg')).toBeInTheDocument();
  });
});

// ─── Enable logic (spec §7) ──────────────────────────────────────────────────

describe('ContactModal — send button enable logic', () => {
  it('is disabled when the modal opens', () => {
    renderModal();

    const sendButton = getSendButton();
    expect(sendButton).toBeDisabled();
    expect(sendButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('stays disabled with consent given but a whitespace-only message', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(getConsentCheckbox());
    await user.type(getMessageField(), '   ');

    // Asserted so the test cannot pass just because the typing silently failed.
    expect(getMessageField()).toHaveValue('   ');
    expect(getSendButton()).toBeDisabled();
  });

  it('stays disabled with a message but no consent', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.type(getMessageField(), 'Hola, me interesa tu libro');

    expect(getSendButton()).toBeDisabled();
  });

  it('is enabled with consent and a one-word message', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(getConsentCheckbox());
    await user.type(getMessageField(), 'Hola');

    const sendButton = getSendButton();
    expect(sendButton).toBeEnabled();
    expect(sendButton).toHaveAttribute('aria-disabled', 'false');
  });

  it('re-disables immediately when consent is unchecked', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(getConsentCheckbox());
    await user.type(getMessageField(), 'Hola');
    expect(getSendButton()).toBeEnabled();

    await user.click(getConsentCheckbox());

    expect(getSendButton()).toBeDisabled();
  });

  it('re-disables immediately when the message is cleared', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(getConsentCheckbox());
    await user.type(getMessageField(), 'Hola');
    expect(getSendButton()).toBeEnabled();

    await user.clear(getMessageField());

    expect(getSendButton()).toBeDisabled();
  });
});

// ─── Submit ──────────────────────────────────────────────────────────────────

describe('ContactModal — submitting', () => {
  it('sends the trimmed message through onSubmit', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    renderModal({ onSubmit });

    await user.click(getConsentCheckbox());
    await user.type(getMessageField(), '  Hola Marina  ');
    await user.click(getSendButton());

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith('Hola Marina'));
  });

  it('shows "Enviando…" and disables the button while the send is in flight', async () => {
    const user = userEvent.setup();
    const deferred = createDeferred();
    const onSubmit = jest.fn().mockReturnValue(deferred.promise);
    renderModal({ onSubmit });

    await user.click(getConsentCheckbox());
    await user.type(getMessageField(), 'Hola');
    await user.click(getSendButton());

    const sendingButton = await screen.findByRole('button', { name: /enviando…/i });
    expect(sendingButton).toBeDisabled();
    expect(screen.queryByRole('button', { name: /enviar mensaje/i })).not.toBeInTheDocument();

    deferred.resolve();
    await waitFor(() => expect(screen.getByRole('button', { name: /enviar mensaje/i })).toBeInTheDocument());
  });
});

// ─── Error path ──────────────────────────────────────────────────────────────

/** Fills the form and presses "Enviar mensaje". */
async function submitForm(user: ReturnType<typeof userEvent.setup>) {
  await user.click(getConsentCheckbox());
  await user.type(getMessageField(), 'Hola');
  await user.click(getSendButton());
}

describe('ContactModal — failed send', () => {
  it('shows the error banner and keeps the modal open when onSubmit rejects', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockRejectedValue(new Error('order failed'));
    const onClose = jest.fn();
    renderModal({ onSubmit, onClose });

    await submitForm(user);

    expect(await screen.findByText(GENERIC_ERROR)).toBeInTheDocument();
    // Staying open is the point: the typed message must survive the failure.
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(getMessageField()).toHaveValue('Hola');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('moves focus to the banner, which sits below the fold on a phone', async () => {
    const user = userEvent.setup();
    renderModal({ onSubmit: jest.fn().mockRejectedValue(new Error('order failed')) });

    await submitForm(user);

    // Every control is disabled mid-flight, so MUI parks focus on the paper and
    // never hands it back: without this the failure is silent for a screen reader.
    await waitFor(() => expect(screen.getByRole('alert')).toHaveFocus());
  });

  it('disables "Reintentar" once the form no longer satisfies the send rules', async () => {
    const user = userEvent.setup();
    renderModal({ onSubmit: jest.fn().mockRejectedValue(new Error('order failed')) });

    await submitForm(user);
    expect(await screen.findByRole('button', { name: /reintentar/i })).toBeEnabled();

    await user.click(getConsentCheckbox());

    // Otherwise it stays clickable and does nothing, because handleSend bails out.
    const retryButton = queryRetryButton();
    expect(retryButton).toBeDisabled();
    expect(retryButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('retries the send from the "Reintentar" button', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn()
      .mockRejectedValueOnce(new Error('order failed'))
      .mockResolvedValueOnce(undefined);
    renderModal({ onSubmit });

    await submitForm(user);

    await user.click(await screen.findByRole('button', { name: /reintentar/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(2));
    // The banner belongs to the failed attempt only.
    await waitFor(() => expect(screen.queryByText(GENERIC_ERROR)).not.toBeInTheDocument());
  });
});

// ─── Which error text reaches the user ───────────────────────────────────────
// Only a SubmitError carries wording meant for a human. Everything else has to
// fall back to the approved copy: an arbitrary rejection message can hold stack
// traces or internals.

describe('ContactModal — error message source', () => {
  it('shows the server explanation and no retry for a business failure', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockRejectedValue(
      new SubmitError('Ya no quedan ejemplares de este libro.', { retryable: false }),
    );
    renderModal({ onSubmit });

    await submitForm(user);

    expect(await screen.findByText('Ya no quedan ejemplares de este libro.')).toBeInTheDocument();
    expect(screen.queryByText(GENERIC_ERROR)).not.toBeInTheDocument();
    // Retrying the same request would fail the same way.
    expect(queryRetryButton()).not.toBeInTheDocument();
  });

  it('keeps the retry button for a retryable SubmitError', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockRejectedValue(
      new SubmitError('El servidor tardó demasiado.', { retryable: true }),
    );
    renderModal({ onSubmit });

    await submitForm(user);

    expect(await screen.findByText('El servidor tardó demasiado.')).toBeInTheDocument();
    expect(queryRetryButton()).toBeInTheDocument();
  });

  it('falls back to the approved copy for a transport failure', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    renderModal({ onSubmit });

    await submitForm(user);

    expect(await screen.findByText(GENERIC_ERROR)).toBeInTheDocument();
    expect(screen.queryByText(/Failed to fetch/)).not.toBeInTheDocument();
    expect(queryRetryButton()).toBeInTheDocument();
  });

  it('falls back to the approved copy for a non-Error rejection', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockRejectedValue({ internal: 'ECONNREFUSED 10.0.0.4:27017' });
    renderModal({ onSubmit });

    await submitForm(user);

    expect(await screen.findByText(GENERIC_ERROR)).toBeInTheDocument();
    expect(screen.queryByText(/ECONNREFUSED/)).not.toBeInTheDocument();
  });
});

// ─── Dialog semantics and closing ────────────────────────────────────────────

describe('ContactModal — dialog semantics', () => {
  it('marks the dialog as modal for assistive tech', () => {
    renderModal();

    // REGRESSION: MUI sets role="dialog" but never aria-modal, so without the
    // explicit PaperProps a virtual cursor can wander to the page behind.
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('is labelled by its own title', () => {
    renderModal();

    expect(screen.getByRole('dialog')).toHaveAccessibleName('Pedir este ejemplar');
  });
});

describe('ContactModal — closing while a send is in flight', () => {
  it('closes on Esc when idle but ignores it mid-flight', async () => {
    const user = userEvent.setup();
    const deferred = createDeferred();
    const onSubmit = jest.fn().mockReturnValue(deferred.promise);
    const onClose = jest.fn();
    renderModal({ onSubmit, onClose });

    // Sanity first, so the mid-flight assertion cannot pass by accident.
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
    onClose.mockClear();

    await submitForm(user);
    await screen.findByRole('button', { name: /enviando…/i });

    await user.keyboard('{Escape}');

    // The request is already on its way: closing now would hide it with no toast.
    expect(onClose).not.toHaveBeenCalled();

    deferred.resolve();
    await waitFor(() => expect(getSendButton()).toBeInTheDocument());
  });

  it('closes on a backdrop click when idle but ignores it mid-flight', async () => {
    const user = userEvent.setup();
    const deferred = createDeferred();
    const onSubmit = jest.fn().mockReturnValue(deferred.promise);
    const onClose = jest.fn();
    const { baseElement } = renderModal({ onSubmit, onClose });

    // MUI listens on the container, not on the backdrop node itself.
    const clickOutside = () => user.click(baseElement.querySelector('.MuiDialog-container'));

    await clickOutside();
    expect(onClose).toHaveBeenCalledTimes(1);
    onClose.mockClear();

    await submitForm(user);
    await screen.findByRole('button', { name: /enviando…/i });

    await clickOutside();

    expect(onClose).not.toHaveBeenCalled();

    deferred.resolve();
    await waitFor(() => expect(getSendButton()).toBeInTheDocument());
  });
});

// ─── Reset between openings ──────────────────────────────────────────────────

describe('ContactModal — reopening after a close', () => {
  it('starts clean: the previous draft, consent and banner are gone', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockRejectedValue(new Error('order failed'));
    const { setOpen } = renderModal({ onSubmit });

    await submitForm(user);
    expect(await screen.findByText(GENERIC_ERROR)).toBeInTheDocument();

    setOpen(false);
    // The reset runs on the exit transition, not on the prop flip, so the message
    // does not visibly blank out while the sheet is still on screen.
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    setOpen(true);

    expect(getMessageField()).toHaveValue('');
    expect(getConsentCheckbox()).not.toBeChecked();
    expect(screen.queryByText(GENERIC_ERROR)).not.toBeInTheDocument();
    expect(getSendButton()).toBeDisabled();
  });
});

// ─── Cancel ──────────────────────────────────────────────────────────────────

describe('ContactModal — cancelling', () => {
  it('calls onClose without submitting', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const onClose = jest.fn();
    renderModal({ onSubmit, onClose });

    await user.click(getConsentCheckbox());
    await user.type(getMessageField(), 'Hola');
    await user.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
