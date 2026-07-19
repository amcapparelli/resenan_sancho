import React, { useId } from 'react';
import styled, { css } from 'styled-components';
import { primaryButton, secondaryButton } from '../styles';
import PriceTag from './PriceTag';
import ServiceDetails from './ServiceDetails';
import { ServiceIcon } from './icons';
import { PromotionService, PromotionServiceBadge, ServiceUnavailability } from './types';

const BADGE_LABELS: Record<PromotionServiceBadge, string> = {
  nuevo: 'Nuevo',
  topReach: 'Máxima difusión',
};

interface ServiceCardProps {
  service: PromotionService;
  /** Disambiguates the CTA for screen readers: four near-identical buttons on screen. */
  bookTitle: string;
  /** Why it cannot be hired for this book. `null` means it can. */
  unavailability?: ServiceUnavailability | null;
  /** This card is the one opening the payment modal. */
  busy?: boolean;
  /** Another card is busy: block this CTA without changing its label. */
  disabled?: boolean;
  onSelect: (service: PromotionService) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  bookTitle,
  unavailability = null,
  busy = false,
  disabled = false,
  onSelect,
}) => {
  const isFree = !!service.free;
  const badgeLabel = unavailability
    // Only one badge band fits, and the status of the service beats marketing.
    ? unavailability.badgeLabel
    : service.badge && BADGE_LABELS[service.badge];
  const titleId = `${useId()}-title`;
  // WCAG 2.5.3 (Label in Name): the accessible name has to start with the text
  // that is actually painted on the button, or voice control cannot target it.
  const ctaAccessibleName = busy
    ? `Abriendo pago… ${service.ctaLabel} para «${bookTitle}»`
    : `${service.ctaLabel} para «${bookTitle}»`;

  return (
    <Card
      aria-labelledby={titleId}
      $free={isFree}
      $highlighted={!unavailability && service.badge === 'topReach'}
      $unavailable={!!unavailability}
    >
      <IconBand $free={isFree} aria-hidden="true">
        <ServiceIcon name={service.icon} />
      </IconBand>

      <BadgeBand>
        {badgeLabel && (
          <Badge $variant={unavailability ? unavailability.reason : service.badge}>
            {badgeLabel}
          </Badge>
        )}
      </BadgeBand>

      <TitleBand id={titleId}>{service.name}</TitleBand>

      <PriceBand>
        <PriceTag priceCents={service.priceCents} free={isFree} />
      </PriceBand>

      <ContentBand>
        <Benefit>{service.benefit}</Benefit>
        <Bullets>
          {service.bullets.map((bullet) => (
            <Bullet key={bullet}>
              <Check $free={isFree} aria-hidden="true">✓</Check>
              {bullet}
            </Bullet>
          ))}
        </Bullets>
      </ContentBand>

      <CtaBand>
        {unavailability ? (
          // A disabled button would still announce the CTA label. The
          // explanation has to be the text itself.
          <UnavailableNote>{unavailability.message}</UnavailableNote>
        ) : (
          <>
            <Cta
              type="button"
              $free={isFree}
              disabled={busy || disabled}
              aria-busy={busy}
              onClick={() => onSelect(service)}
              aria-label={ctaAccessibleName}
            >
              {busy && <Spinner aria-hidden="true" />}
              {busy ? 'Abriendo pago…' : service.ctaLabel}
            </Cta>
            {service.ctaNote && <CtaNote>{service.ctaNote}</CtaNote>}
          </>
        )}
      </CtaBand>

      <ServiceDetails serviceName={service.name} details={service.details} />
    </Card>
  );
};

const IconBand = styled.div<{ $free: boolean }>`
  justify-self: center;
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${({ $free, theme }) => ($free ? 'rgba(74, 155, 95, 0.1)' : theme.cream)};
  color: ${({ $free, theme }) => ($free ? theme.successDark : theme.terracotta)};
`;

// Reserved even when empty: this is what keeps the titles of the four cards
// starting at the same height.
const BadgeBand = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 20px;
`;

type BadgeVariant = PromotionServiceBadge | ServiceUnavailability['reason'];

const badgeVariants: Record<BadgeVariant, ReturnType<typeof css>> = {
  nuevo: css`
    background: ${({ theme }) => theme.cream};
    border-color: ${({ theme }) => theme.terracotta};
    color: ${({ theme }) => theme.terracotta};
  `,
  topReach: css`
    background: ${({ theme }) => theme.amber};
    border-color: ${({ theme }) => theme.amber};
    color: ${({ theme }) => theme.ink};
  `,
  freeAlreadyUsed: css`
    background: transparent;
    border-color: ${({ theme }) => theme.successDark};
    color: ${({ theme }) => theme.successDark};
  `,
  disabledGlobally: css`
    background: transparent;
    border-color: ${({ theme }) => theme.lightBorder};
    color: ${({ theme }) => theme.brown};
  `,
  requiresPaperFormat: css`
    background: transparent;
    border-color: ${({ theme }) => theme.terracotta};
    color: ${({ theme }) => theme.terracotta};
  `,
};

const Badge = styled.span<{ $variant?: BadgeVariant }>`
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border: 1px solid transparent;
  border-radius: 4px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 10px;
  font-weight: 600;
  line-height: 1.4;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  text-align: center;
  ${({ $variant }) => $variant && badgeVariants[$variant]}
`;

// h4: each card sits inside the "Elige cómo impulsarlo" section, which is the h3.
const TitleBand = styled.h4`
  margin: 0;
  font-family: 'Fraunces', serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.28;
  text-align: center;
  color: ${({ theme }) => theme.ink};
`;

const PriceBand = styled.div`
  align-self: start;
  width: 100%;
`;

const ContentBand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Benefit = styled.p`
  margin: 0;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  line-height: 1.5;
  color: #5a524a;
`;

const Bullets = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Bullet = styled.li`
  display: flex;
  gap: 6px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12.5px;
  line-height: 1.4;
  color: ${({ theme }) => theme.ink};
`;

const Check = styled.span<{ $free: boolean }>`
  flex-shrink: 0;
  font-weight: 600;
  color: ${({ $free, theme }) => ($free ? theme.successDark : theme.terracotta)};
`;

const CtaBand = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 6px;
`;

const Cta = styled.button<{ $free: boolean }>`
  ${({ $free }) => ($free ? secondaryButton : primaryButton)}
  width: 100%;
  font-size: 15px;
  min-height: 46px;
  padding: 11px 14px;

  ${({ $free }) => $free && css`
    /* successDark on the border too, to match the label: plain success is
       3.42:1, which clears WCAG 1.4.11 for the outline but not AA for text. */
    border-color: ${({ theme }) => theme.successDark};
    color: ${({ theme }) => theme.successDark};

    &:hover {
      background: ${({ theme }) => theme.successDark};
      color: ${({ theme }) => theme.white};
    }
  `}

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.ink};
    outline-offset: 2px;
  }
`;

// `brown`, not `muted`: this note carries the refund promise, so it is part of
// the decision (and of the legal wording) and has to meet AA.
const CtaNote = styled.p`
  margin: 0;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  line-height: 1.35;
  text-align: center;
  color: ${({ theme }) => theme.brown};
`;

const UnavailableNote = styled.p`
  margin: 0;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12.5px;
  line-height: 1.45;
  text-align: center;
  color: ${({ theme }) => theme.brown};
`;

const Spinner = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

interface CardVariantProps {
  $free: boolean;
  $highlighted: boolean;
  $unavailable: boolean;
}

const Card = styled.article<CardVariantProps>`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  row-gap: 10px;
  padding: 18px 16px 16px;
  border-radius: 12px;
  border: ${({ $highlighted, theme }) => ($highlighted ? `1.5px solid ${theme.terracotta}` : `1px solid ${theme.lightBorder}`)};
  border-style: ${({ $free }) => ($free ? 'dashed' : 'solid')};
  background: ${({ $unavailable, theme }) => ($unavailable ? theme.cream : theme.white)};
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;

  ${ContentBand} {
    flex: 1;
  }

  ${({ $unavailable }) => !$unavailable && css`
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(61, 58, 53, 0.1);
      border-color: ${({ theme }) => theme.terracotta};
    }
  `}

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover {
      transform: none;
    }
  }

  @media (min-width: 900px) {
    /* The whole point of the layout: every card's bands share the grid tracks
       of the parent, so titles, prices and CTAs line up across the row. */
    @supports (grid-template-rows: subgrid) {
      display: grid;
      grid-row: span 7;
      grid-template-rows: subgrid;
    }

    /* Safety net for engines without subgrid: fixed minimums on the bands that
       most often differ in height. Less exact, but nothing collapses. */
    @supports not (grid-template-rows: subgrid) {
      ${TitleBand} {
        min-height: 42px;
      }

      ${PriceBand} {
        min-height: 56px;
      }
    }
  }
`;

export default ServiceCard;
