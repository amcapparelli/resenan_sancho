import React, {
  useEffect, useId, useRef, useState,
} from 'react';
import Dialog from '@mui/material/Dialog';
import styled from 'styled-components';

import { buttonSpinner, primaryButton, secondaryButton } from '../styles';
import SubmitError from '../../utils/SubmitError';
import { buildAuthorName } from '../../utils/seo/bookSeo';
import BookContextHeader from './BookContextHeader';
import ConsentCheckbox from './ConsentCheckbox';
import MessageField from './MessageField';
import TipsBox from './TipsBox';
import { CloseIcon } from './icons';

/** Shown for anything that is not an explained business failure. */
const GENERIC_ERROR_MESSAGE = 'No se pudo enviar el mensaje. Inténtalo de nuevo.';

interface SendFailure {
  message: string;
  /** False hides "Reintentar": the same request would fail the same way. */
  retryable: boolean;
}

/**
 * Only a SubmitError carries text that was meant for the user (a business rule
 * the server explained). Anything else — network, non-JSON answer, a bug — gets
 * the generic copy: its message is not reviewed product wording and could leak
 * internals.
 *
 * A SubmitError with a blank message gets the generic copy too, so the banner can
 * never render empty. `useOrderBook` already refuses to build one, but the promise
 * comes from a prop and the contract belongs here, at the point of use.
 */
const toSendFailure = (error: unknown): SendFailure => {
  if (!(error instanceof SubmitError)) {
    return { message: GENERIC_ERROR_MESSAGE, retryable: true };
  }

  const message = error.message.trim();
  if (!message) return { message: GENERIC_ERROR_MESSAGE, retryable: true };

  return { message, retryable: error.retryable };
};

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: {
    id: string;
    title: string;
    coverUrl?: string;
  };
  author: {
    firstName: string;
    /**
     * Optional on purpose: the API types it as a string, but this platform is
     * mostly independent authors and many register with no surname at all, so
     * it arrives missing, empty or whitespace-only often enough to plan for.
     */
    lastName?: string;
  };
  /**
   * Sends the request. It MUST reject when the send fails: a rejection is how
   * the modal knows to show its error banner and stay open.
   */
  onSubmit: (message: string) => Promise<void>;
}

const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  book,
  author,
  onSubmit,
}) => {
  // Two names for two jobs, deliberately not unified: the context header can
  // afford the full name (its height comes from the 40×54 cover and the line
  // truncates with an ellipsis), while the heading and the placeholder greet the
  // author by first name only, which is what keeps the heading on one line on a
  // phone. `buildAuthorName` drops empty parts so a missing surname cannot leave
  // a trailing space behind.
  const authorFullName = buildAuthorName({
    name: author.firstName,
    lastName: author.lastName ?? '',
  });

  const baseId = useId();
  const titleId = `${baseId}-title`;
  const messageId = `${baseId}-message`;
  const consentId = `${baseId}-consent`;

  const errorBannerRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendFailure, setSendFailure] = useState<SendFailure | null>(null);

  // Derived on purpose (spec §7): keeping it in state and syncing it with an
  // effect would leave a frame where the button disagrees with the form.
  const isSendEnabled = consentChecked && message.trim().length > 0;

  // The page keeps this component mounted between openings, so the form has to
  // be cleared by hand or a cancelled draft would come back on the next open.
  // Done on `onExited` and not as soon as `isOpen` flips: clearing it up front
  // blanks the message in front of the user while the sheet is still fading out.
  const resetForm = () => {
    setMessage('');
    setConsentChecked(false);
    setSendFailure(null);
    // Unreachable while the page closes the modal only after `onSubmit` settles,
    // but a caller that dropped `isOpen` mid-flight would otherwise reopen the
    // modal stuck on "Enviando…".
    setIsSubmitting(false);
  };

  // Failing at the bottom of a scrollable sheet is easy to miss, and by then MUI
  // has parked focus on the paper (every control was disabled mid-flight), so the
  // banner takes focus: that both announces it and scrolls it into view.
  useEffect(() => {
    if (sendFailure) errorBannerRef.current?.focus();
  }, [sendFailure]);

  const handleSend = async () => {
    if (!isSendEnabled || isSubmitting) return;
    setSendFailure(null);
    setIsSubmitting(true);
    try {
      await onSubmit(message.trim());
    } catch (error) {
      // The page owns the request and the toast; the modal only reports failure
      // here so the user can retry without retyping the message.
      setSendFailure(toSendFailure(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  // A send in flight must not be interrupted by Esc, the backdrop or Cancelar:
  // the request would still reach the author with no feedback on screen.
  const handleClose = () => {
    if (!isSubmitting) onClose();
  };

  return (
    <StyledDialog
      open={isOpen}
      onClose={handleClose}
      maxWidth={false}
      aria-labelledby={titleId}
      // MUI puts role="dialog" on the paper but never emits aria-modal, so
      // without this a screen reader's virtual cursor can wander to the page
      // behind the sheet even though the keyboard focus trap holds.
      PaperProps={{ 'aria-modal': true }}
      // Both hooks, not just `onExited`: reopening while the sheet is still
      // fading out reverses the transition to enter, so `onExited` never fires
      // and the old draft, consent and error banner would survive into the new
      // opening (the banner silently, since its identity did not change).
      // `onEnter` is a no-op in the normal flow, where the form is already clean.
      TransitionProps={{ onExited: resetForm, onEnter: resetForm }}
    >
      {/* MUI traps focus inside the dialog, closes it on Esc and restores focus
          to the trigger. Its default transition is a plain fade, which is
          already what `prefers-reduced-motion` asks for here. */}
      <CloseButton
        type="button"
        onClick={handleClose}
        disabled={isSubmitting}
        aria-label="Cerrar"
      >
        <CloseIcon />
      </CloseButton>

      <Body>
        <HeaderSlot>
          <BookContextHeader
            title={book.title}
            authorName={authorFullName}
            coverUrl={book.coverUrl}
          />
        </HeaderSlot>

        {/* First name only, and in a single text node: it keeps the accessible
            name clean and the heading on one line at 20px on a 360px phone,
            which a full name would not do. */}
        <Title id={titleId}>{`Pedir este ejemplar a ${author.firstName}`}</Title>

        <TipsBox />

        <MessageField
          id={messageId}
          value={message}
          authorName={author.firstName}
          disabled={isSubmitting}
          onChange={setMessage}
        />

        <ConsentCheckbox
          id={consentId}
          checked={consentChecked}
          disabled={isSubmitting}
          onChange={setConsentChecked}
        />

        {sendFailure && (
          <ErrorBanner role="alert" ref={errorBannerRef} tabIndex={-1}>
            <span aria-hidden="true">⚠</span>
            <span>{sendFailure.message}</span>
            {/* Retrying runs the same guard as the send button, so it has to be
                disabled under the same conditions or it is a silent no-op. */}
            {sendFailure.retryable && (
              <RetryButton
                type="button"
                onClick={handleSend}
                disabled={!isSendEnabled}
                aria-disabled={!isSendEnabled}
              >
                Reintentar
              </RetryButton>
            )}
          </ErrorBanner>
        )}
      </Body>

      <Footer>
        <CancelButton type="button" onClick={handleClose} disabled={isSubmitting}>
          Cancelar
        </CancelButton>
        <SendButton
          type="button"
          onClick={handleSend}
          disabled={!isSendEnabled || isSubmitting}
          aria-disabled={!isSendEnabled || isSubmitting}
        >
          {isSubmitting && <Spinner aria-hidden="true" />}
          {isSubmitting ? 'Enviando…' : 'Enviar mensaje'}
        </SendButton>
      </Footer>
    </StyledDialog>
  );
};

const StyledDialog = styled(Dialog)`
  & .MuiBackdrop-root {
    background: rgba(61, 58, 53, 0.55);
    backdrop-filter: blur(2px);
  }

  & .MuiDialog-paper {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 480px;
    margin: 24px;
    border-radius: 14px;
    background: ${({ theme }) => theme.white};
    box-shadow: 0 24px 60px rgba(61, 58, 53, 0.28);
    /* Keeps scrolled body content from painting over the rounded corners. */
    overflow: hidden;
  }

  /* Bottom sheet on phones and small tablets: the audience is mostly mobile and
     a sheet anchored to the bottom is easier to reach with the thumb. */
  @media (max-width: 899px) {
    & .MuiDialog-container {
      align-items: flex-end;
    }

    & .MuiDialog-paper {
      margin: 0;
      max-width: 100%;
      max-height: 92vh;
      border-radius: 16px 16px 0 0;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  /* Opaque (paper colour), not transparent as elsewhere: the body scrolls
     underneath on phones and tips text would slide behind a bare X. */
  background: ${({ theme }) => theme.white};
  color: ${({ theme }) => theme.brown};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.cream};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.ink};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Body = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 26px 4px;

  @media (max-width: 899px) {
    padding: 16px 20px 4px;
  }
`;

/* Keeps the book title clear of the absolutely positioned close button. */
const HeaderSlot = styled.div`
  padding-right: 32px;
`;

const Title = styled.h2`
  margin: 0 0 14px;
  font-family: 'Fraunces', serif;
  font-weight: 600;
  font-size: 22px;
  line-height: 1.2;
  color: ${({ theme }) => theme.ink};

  /* Tighter only on the sheet: the desktop dialog never ran out of height, so
     it keeps the roomier rhythm. Same reasoning in TipsBox, MessageField and
     BookContextHeader. */
  @media (max-width: 899px) {
    margin-bottom: 10px;
    font-size: 20px;
  }
`;

const ErrorBanner = styled.div`
  display: flex;
  align-items: center;
  /* Wraps so the message is not crushed by "Reintentar" on a 320px screen. */
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
  padding: 10px 14px;
  border-radius: 8px;
  background: ${({ theme }) => theme.terracottaSoft};
  border: 1px solid ${({ theme }) => theme.terracotta};
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.ink};

  /* Focused programmatically when the send fails, so it needs a visible ring. */
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.ink};
    outline-offset: 2px;
  }
`;

const RetryButton = styled.button`
  margin-left: auto;
  padding: 0;
  background: none;
  border: none;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.terracotta};
  cursor: pointer;
  text-decoration: underline;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px 26px 26px;
  border-top: 0.5px solid #e8dfc8;

  @media (max-width: 899px) {
    flex-direction: column-reverse;
    /* The sheet sits flush against the viewport bottom, so "Cancelar" would land
       in the iOS home-indicator strip without the safe-area inset. */
    padding: 16px 20px calc(22px + env(safe-area-inset-bottom));
  }
`;

const CancelButton = styled.button`
  ${secondaryButton}
`;

const SendButton = styled.button`
  ${primaryButton}
`;

const Spinner = styled.span`
  ${buttonSpinner}
`;

export default ContactModal;
