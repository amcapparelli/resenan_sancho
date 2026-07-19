export type PromotionServiceKey = 'freeCopies' | 'copies5' | 'featuredWeek' | 'boost25';

export type PromotionServiceIcon = 'gift' | 'books' | 'star' | 'rocket';

/** Marketing badge. It is replaced by the status badge when the service is not available. */
export type PromotionServiceBadge = 'nuevo' | 'topReach';

export interface PromotionService {
  /** Presentation identity inside the frontend. */
  key: PromotionServiceKey;
  /**
   * Id the payments backend understands: it maps this id to the copies and the
   * price it actually charges. It is part of the API contract, so it travels in
   * the catalogue instead of being derived from `key`.
   */
  id: number;
  /** Copies the service adds to the book. 0 when it does not add any. */
  copies: number;
  priceCents: number;
  /**
   * Global switch owned by the backend: the service exists but nobody can buy
   * it yet. It is per offer, not per book.
   */
  enabled: boolean;
  /** Free services get a softer visual treatment and skip the payment flow. */
  free?: boolean;
  /** Can only be claimed once per book (checked against `freePromoAvailable`). */
  oneTimePerBook?: boolean;
  /** Only sellable when the book is available on paper. */
  requiresPaperFormat?: boolean;
  name: string;
  benefit: string;
  bullets: string[];
  details: string;
  icon: PromotionServiceIcon;
  badge?: PromotionServiceBadge;
  ctaLabel: string;
  /** Small print under the CTA. */
  ctaNote?: string;
}

export type ServiceUnavailableReason =
  | 'freeAlreadyUsed'
  | 'disabledGlobally'
  | 'requiresPaperFormat';

export interface ServiceUnavailability {
  reason: ServiceUnavailableReason;
  /** Status badge, shown instead of the marketing one. */
  badgeLabel: string;
  /** Replaces the CTA. It is what a screen reader announces, so it must explain itself. */
  message: string;
}

/** Book facts the availability rules depend on. */
export interface ServiceEligibility {
  freePromoAvailable: boolean;
  hasPaperFormat: boolean;
}
