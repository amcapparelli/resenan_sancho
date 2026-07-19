/* eslint-disable no-underscore-dangle */
import React, {
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import Dialog from '@mui/material/Dialog';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Elements } from '@stripe/react-stripe-js';
import type { Stripe } from '@stripe/stripe-js';
import styled from 'styled-components';
import UserContext from '../../../../store/context/userContext/UserContext';
import { useFetch } from '../../../../utils/customHooks';
import { promotions as promotionsUrl } from '../../../../config/routes';
import { Book } from '../../../../interfaces/books';
import AvailableFormats from '../../../../interfaces/formats';
import SUPPORT_EMAIL from '../../../../utils/constants/support';
import { PaymentCheckout } from '../../../../components';
import { primaryButton } from '../styles';
import ModalHeader from './ModalHeader';
import ServiceGrid from './ServiceGrid';
import getStripe, { resetStripe } from './stripeLoader';
import { BookIcon, LockIcon } from './icons';
import { PromotionService } from './types';

interface ClaimFeedback {
  message: string;
  success: boolean;
}

interface PromoteServicesModalProps {
  open: boolean;
  book: Book;
  /** Catalogue to render. Today it comes from a local constant, tomorrow from the API. */
  services: PromotionService[];
  onClose: () => void;
}

const buildCheckoutDescription = (service: PromotionService, bookTitle: string): string => (
  service.copies > 0
    ? `Añadir ${service.copies} ejemplares para reseña de ${bookTitle}`
    : `${service.name}: ${bookTitle}`
);

const PromoteServicesModal: React.FC<PromoteServicesModalProps> = ({
  open,
  book,
  services,
  onClose,
}) => {
  const { user } = useContext(UserContext);
  const titleId = `${useId()}-title`;
  const isMobile = useMediaQuery('(max-width:559px)');
  const isMounted = useRef(true);
  // Closing hides the dialog but does not unmount it (MyBooksSection keeps the
  // instance while a book is selected), so `isMounted` cannot tell us whether
  // the user is still looking at it. This ref can.
  const openRef = useRef(open);
  const feedbackRef = useRef<HTMLParagraphElement>(null);

  const [claimResponse, claimFreeCopies, claiming] = useFetch();
  // Local mirror of the claim result. It lets us drop a failed claim on close
  // while keeping a successful one, which is not the same thing (see below).
  const [claimFeedback, setClaimFeedback] = useState<ClaimFeedback | null>(null);
  // Service whose payment modal is being opened (Stripe.js still loading).
  const [openingService, setOpeningService] = useState<PromotionService | null>(null);
  const [paidService, setPaidService] = useState<PromotionService | null>(null);
  const [stripe, setStripe] = useState<Stripe | null>(null);
  // Service whose checkout could not be opened, kept so "Reintentar" retries
  // that same service and not an arbitrary one.
  const [failedService, setFailedService] = useState<PromotionService | null>(null);

  // StrictMode runs setup → cleanup → setup in development, so the flag has to
  // be raised again on every setup or the guards below would block for good.
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => { openRef.current = open; }, [open]);

  useEffect(() => {
    if (claimResponse.message) {
      setClaimFeedback({
        message: claimResponse.message,
        success: !!claimResponse.success,
      });
    }
  }, [claimResponse.message, claimResponse.success]);

  // Closing must not leave a checkout half-open: reopening the same book would
  // pop the card modal on its own, or show a stale error.
  //
  // A *successful* claim is deliberately kept. Reopening the same book does not
  // remount (the key only changes between books) and `book` still holds the
  // stale object with freePromoAvailable: true, because MyBooksSection only
  // refreshes it when "Promocionar" is pressed again. This persisted success is
  // therefore the only thing keeping the free CTA hidden after claiming it —
  // clearing it here would hand the user a second "Activar gratis" button for
  // copies they already have.
  useEffect(() => {
    if (!open) {
      setPaidService(null);
      setFailedService(null);
      setClaimFeedback((previous) => (previous && previous.success ? previous : null));
    }
  }, [open]);

  // Claiming the free copies removes the button that had focus, which would
  // drop focus to <body> inside the focus trap. Send it to the answer instead.
  useEffect(() => {
    if (claimFeedback) feedbackRef.current?.focus();
  }, [claimFeedback]);

  const startCheckout = useCallback(async (service: PromotionService) => {
    setFailedService(null);
    setOpeningService(service);
    try {
      const stripeInstance = await getStripe();
      if (!stripeInstance) throw new Error('Stripe.js could not be loaded');
      // Stripe.js can take seconds to download; the modal may have been closed
      // in the meantime. Opening the card modal now would charge for something
      // the user walked away from.
      if (!isMounted.current || !openRef.current) return;
      setStripe(stripeInstance);
      setPaidService(service);
    } catch {
      // Nothing was charged: the card modal never opened.
      resetStripe();
      if (isMounted.current && openRef.current) setFailedService(service);
    } finally {
      // The spinner is cleared either way: it must never survive the attempt.
      if (isMounted.current) setOpeningService(null);
    }
  }, []);

  const handleSelect = useCallback((service: PromotionService) => {
    if (service.free) {
      claimFreeCopies(`${promotionsUrl}/${book._id}`, 'put', {
        copies: service.copies,
        author: user._id,
        chosenPromo: service.id,
      });
      return;
    }
    startCheckout(service);
  }, [book._id, claimFreeCopies, startCheckout, user._id]);

  const eligibility = {
    // The book prop is only refreshed when the modal closes, so the successful
    // claim of this session has to be taken into account here.
    freePromoAvailable: book.freePromoAvailable && !(claimFeedback && claimFeedback.success),
    hasPaperFormat: book.formats.includes(AvailableFormats.papel),
  };

  const hasServices = services.length > 0;

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth={false}
      aria-labelledby={titleId}
    >
      <ModalHeader
        titleId={titleId}
        title={book.title}
        coverUrl={book.cover}
        availableCopies={book.copies}
        onClose={onClose}
      />

      <Body>
        {hasServices ? (
          <>
            <BodyTitle>Elige cómo impulsarlo</BodyTitle>
            <BodySubtitle>Cada servicio se aplica solo a este libro.</BodySubtitle>

            {failedService && (
              <ErrorBanner role="alert">
                <span aria-hidden="true">⚠</span>
                No se pudo abrir el pago. No se te ha cobrado nada.
                <RetryButton type="button" onClick={() => startCheckout(failedService)}>
                  Reintentar
                </RetryButton>
              </ErrorBanner>
            )}

            {/* Mounted from the start and left in the tree: a live region only
                announces content added to a region that already existed. */}
            <FeedbackRegion role="status" aria-live="polite">
              {claimFeedback && (
                <FeedbackBanner
                  ref={feedbackRef}
                  tabIndex={-1}
                  $success={claimFeedback.success}
                >
                  {claimFeedback.message}
                </FeedbackBanner>
              )}
            </FeedbackRegion>

            <ServiceGrid
              services={services}
              bookTitle={book.title}
              eligibility={eligibility}
              busyServiceKey={openingService ? openingService.key : null}
              ctasDisabled={claiming || openingService !== null}
              onSelect={handleSelect}
            />
          </>
        ) : (
          <EmptyCatalog>
            <EmptyIcon aria-hidden="true"><BookIcon size={40} /></EmptyIcon>
            <BodyTitle>Ahora mismo no hay servicios disponibles</BodyTitle>
            <BodySubtitle>
              Estamos preparando novedades. Si necesitas ejemplares para este libro,
              {' '}
              <MailLink href={`mailto:${SUPPORT_EMAIL}`}>escríbenos</MailLink>
              .
            </BodySubtitle>
            <CloseCatalogButton type="button" onClick={onClose}>Cerrar</CloseCatalogButton>
          </EmptyCatalog>
        )}
      </Body>

      <Footer>
        <LockIcon />
        Pago seguro con tarjeta · No guardamos los datos de tu tarjeta · ¿Dudas?
        {' '}
        <MailLink href={`mailto:${SUPPORT_EMAIL}`}>Escríbenos</MailLink>
      </Footer>

      {paidService && stripe && (
        <Elements stripe={stripe}>
          <PaymentCheckout
            open
            onClose={() => setPaidService(null)}
            amountCents={paidService.priceCents}
            image={book.cover}
            bookTitle={book.title}
            description={buildCheckoutDescription(paidService, book.title)}
            chosenPromo={paidService.id}
            bookId={book._id}
          />
        </Elements>
      )}
    </StyledDialog>
  );
};

// MUI keeps focus inside the dialog, moves it to the paper (never to the first
// CTA, which would make Enter a purchase) and restores it to the "Promocionar"
// button on close.
const StyledDialog = styled(Dialog)`
  & .MuiBackdrop-root {
    background: rgba(61, 58, 53, 0.55);
    backdrop-filter: blur(2px);
  }

  & .MuiDialog-paper {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 1040px;
    max-height: 86vh;
    margin: 24px;
    border-radius: 14px;
    background: ${({ theme }) => theme.appBackground};
    box-shadow: 0 24px 60px rgba(61, 58, 53, 0.28);
    overflow: hidden;
  }

  @media (max-width: 559px) {
    & .MuiDialog-paper {
      margin: 0;
      max-height: 100%;
      border-radius: 0;
    }
  }
`;

const Body = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 18px 22px 22px;

  @media (max-width: 559px) {
    padding: 16px;
  }
`;

const BodyTitle = styled.h3`
  margin: 0;
  font-family: 'Fraunces', serif;
  font-weight: 600;
  font-size: 18px;
  color: ${({ theme }) => theme.ink};
`;

const BodySubtitle = styled.p`
  margin: 2px 0 16px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.brown};
`;

const ErrorBanner = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
  padding: 10px 14px;
  border-radius: 8px;
  background: ${({ theme }) => theme.terracottaSoft};
  border: 1px solid ${({ theme }) => theme.terracotta};
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.ink};
`;

const RetryButton = styled.button`
  min-height: 32px;
  padding: 0 4px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.terracotta};
  text-decoration: underline;
`;

const FeedbackRegion = styled.div`
  &:empty {
    display: none;
  }
`;

const FeedbackBanner = styled.p<{ $success: boolean }>`
  margin: 0 0 14px;
  padding: 10px 14px;
  border-radius: 8px;
  background: ${({ theme }) => theme.cream};
  border: 1px solid ${({ $success, theme }) => ($success ? theme.success : theme.terracotta)};
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.ink};

  /* It receives focus programmatically after a claim, so it needs a ring. */
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.ink};
    outline-offset: 2px;
  }
`;

const EmptyCatalog = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding: 48px 20px;
`;

const EmptyIcon = styled.div`
  color: ${({ theme }) => theme.terracotta};
  opacity: 0.4;
`;

const CloseCatalogButton = styled.button`
  ${primaryButton}
  margin-top: 8px;
`;

const Footer = styled.footer`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  padding: 12px 22px;
  background: ${({ theme }) => theme.cream};
  border-top: 1px solid ${({ theme }) => theme.lightBorder};
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  color: ${({ theme }) => theme.brown};

  @media (max-width: 559px) {
    padding: 12px 16px;
  }
`;

const MailLink = styled.a`
  color: ${({ theme }) => theme.terracotta};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export default PromoteServicesModal;
