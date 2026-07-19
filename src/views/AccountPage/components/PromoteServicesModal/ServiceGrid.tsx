import React from 'react';
import styled from 'styled-components';
import ServiceCard from './ServiceCard';
import getServiceUnavailability from './availability';
import { PromotionService, PromotionServiceKey, ServiceEligibility } from './types';

interface ServiceGridProps {
  services: PromotionService[];
  bookTitle: string;
  eligibility: ServiceEligibility;
  /** Key of the service currently opening its payment flow, if any. */
  busyServiceKey?: PromotionServiceKey | null;
  /** Blocks every CTA (e.g. a request is already in flight) without changing labels. */
  ctasDisabled?: boolean;
  onSelect: (service: PromotionService) => void;
}

/** Widest row the spec allows on desktop; beyond this the cards get too narrow. */
const MAX_COLUMNS = 4;

/**
 * Columns to lay out on desktop. Clamped to `MAX_COLUMNS` so a growing catalogue
 * wraps into a second row instead of overflowing, and floored at 1 so an empty
 * array cannot emit `repeat(0, 1fr)`, which is invalid CSS.
 */
export const getGridColumnCount = (serviceCount: number, maxColumns = MAX_COLUMNS): number => (
  Math.min(Math.max(serviceCount, 1), maxColumns)
);

/**
 * Row of comparable services. It knows nothing about the modal that usually
 * wraps it, so it can be dropped into a standalone page as is.
 *
 * Services that cannot be hired are still rendered, disabled and with an
 * explanation: the comparison is only fair if every offer is on screen. Services
 * filtered out upstream (`available: false`) never reach this component, so the
 * row sizes itself to however many it receives instead of assuming four.
 */
const ServiceGrid: React.FC<ServiceGridProps> = ({
  services,
  bookTitle,
  eligibility,
  busyServiceKey = null,
  ctasDisabled = false,
  onSelect,
}) => (
  <Grid $columns={getGridColumnCount(services.length)}>
    {services.map((service) => (
      <CardItem key={service.key}>
        <ServiceCard
          service={service}
          bookTitle={bookTitle}
          unavailability={getServiceUnavailability(service, eligibility)}
          busy={busyServiceKey === service.key}
          disabled={ctasDisabled}
          onSelect={onSelect}
        />
      </CardItem>
    ))}
  </Grid>
);

/* `$columns` only ever takes the values 1 to MAX_COLUMNS, so styled-components
   caches a handful of classes, not one per render. */
const Grid = styled.ul<{ $columns: number }>`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 14px;
  grid-template-columns: 1fr;

  @media (min-width: 560px) {
    /* Two columns at most here, but never more than there are cards: a lone
       card would otherwise sit at half width with a gap beside it. */
    grid-template-columns: repeat(${({ $columns }) => Math.min($columns, 2)}, 1fr);
  }

  @media (min-width: 900px) {
    /* One column per service, capped at four (what fits comfortably on
       desktop). A shorter catalogue closes the row instead of leaving a hole;
       a longer one wraps. The row template stays at seven tracks whatever the
       column count, because it describes a card's bands, not the row's width. */
    grid-template-columns: repeat(${({ $columns }) => $columns}, 1fr);
    /* icon · badge · title · price · content (flexible) · cta · disclosure */
    grid-template-rows: auto auto auto auto 1fr auto auto;
  }
`;

const CardItem = styled.li`
  display: flex;

  @media (min-width: 900px) {
    /* Guarded like the card itself: without subgrid, "display: grid" plus
       "span 7" would survive on their own and create implicit rows. */
    @supports (grid-template-rows: subgrid) {
      display: grid;
      grid-row: span 7;
      grid-template-rows: subgrid;
    }
  }
`;

export default ServiceGrid;
