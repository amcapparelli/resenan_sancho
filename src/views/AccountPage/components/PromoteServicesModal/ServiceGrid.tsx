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

/**
 * Row of comparable services. It knows nothing about the modal that usually
 * wraps it, so it can be dropped into a standalone page as is.
 *
 * Unavailable services are rendered too, disabled and with an explanation: the
 * comparison is only fair if the four columns are always there.
 */
const ServiceGrid: React.FC<ServiceGridProps> = ({
  services,
  bookTitle,
  eligibility,
  busyServiceKey = null,
  ctasDisabled = false,
  onSelect,
}) => (
  <Grid>
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

const Grid = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 14px;
  grid-template-columns: 1fr;

  @media (min-width: 560px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 900px) {
    /* Always four columns: services are never hidden, only disabled.
       This hardcodes the current catalogue size. When the backend starts
       serving the catalogue, a count other than 4 will leave a gap (fewer) or
       overflow the row (more); the layout has to be revisited then, not made
       dynamic now — see the growth note in the spec. */
    grid-template-columns: repeat(4, 1fr);
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
