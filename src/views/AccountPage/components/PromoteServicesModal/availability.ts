import { PromotionService, ServiceEligibility, ServiceUnavailability } from './types';

const FREE_ALREADY_USED: ServiceUnavailability = {
  reason: 'freeAlreadyUsed',
  badgeLabel: '✓ Ya usado',
  message: 'Ya usaste los 2 gratuitos de este libro. Puedes seguir con los otros servicios.',
};

const DISABLED_GLOBALLY: ServiceUnavailability = {
  reason: 'disabledGlobally',
  badgeLabel: 'Próximamente',
  message: 'Todavía no está disponible. Lo estamos preparando.',
};

const REQUIRES_PAPER_FORMAT: ServiceUnavailability = {
  reason: 'requiresPaperFormat',
  badgeLabel: 'Necesita papel',
  message: 'Tu libro no está en papel. Añade ese formato y podrás contratarlo.',
};

/**
 * Returns why a service cannot be hired for this book, or `null` when it can.
 *
 * Order matters: a globally disabled service always wins over any book-level
 * requirement. Asking someone to edit their book to unlock something that
 * nobody can buy right now would be a dead end.
 */
const getServiceUnavailability = (
  service: PromotionService,
  eligibility: ServiceEligibility,
): ServiceUnavailability | null => {
  if (!service.enabled) return DISABLED_GLOBALLY;
  if (service.oneTimePerBook && !eligibility.freePromoAvailable) return FREE_ALREADY_USED;
  if (service.requiresPaperFormat && !eligibility.hasPaperFormat) return REQUIRES_PAPER_FORMAT;
  return null;
};

export default getServiceUnavailability;
