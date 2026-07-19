import getServiceUnavailability from './availability';
import promotionServices from './catalog';
import { PromotionService } from './types';

const findService = (key: string): PromotionService => (
  promotionServices.find((service) => service.key === key)
);

const freeCopies = findService('freeCopies');
const boost25 = findService('boost25');
const featuredWeek = findService('featuredWeek');

const eligible = { freePromoAvailable: true, hasPaperFormat: true };

describe('getServiceUnavailability', () => {
  it('allows a service when the book meets every requirement', () => {
    expect(getServiceUnavailability(boost25, eligible)).toBeNull();
  });

  it('blocks the free service once it has been used for the book', () => {
    const result = getServiceUnavailability(freeCopies, { ...eligible, freePromoAvailable: false });
    expect(result.reason).toBe('freeAlreadyUsed');
  });

  it('blocks boost25 when the book is not available on paper', () => {
    const result = getServiceUnavailability(boost25, { ...eligible, hasPaperFormat: false });
    expect(result.reason).toBe('requiresPaperFormat');
  });

  it('blocks any service that is switched off globally', () => {
    const result = getServiceUnavailability(featuredWeek, eligible);
    expect(result.reason).toBe('disabledGlobally');
  });

  it('prefers the global switch over the paper requirement', () => {
    const result = getServiceUnavailability(
      { ...boost25, enabled: false },
      { ...eligible, hasPaperFormat: false },
    );
    expect(result.reason).toBe('disabledGlobally');
  });
});
