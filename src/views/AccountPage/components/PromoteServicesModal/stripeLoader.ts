import { loadStripe, Stripe } from '@stripe/stripe-js';

const PUBLISHABLE_KEY: string = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Loads Stripe.js on first use instead of on module evaluation: the script is
 * only needed when someone actually starts a checkout, and this way a network
 * failure surfaces as a rejected promise we can show to the user rather than
 * an unhandled rejection at page load.
 */
const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) stripePromise = loadStripe(PUBLISHABLE_KEY);
  return stripePromise;
};

/** Drops the cached failure so "Reintentar" really retries the download. */
export const resetStripe = (): void => {
  stripePromise = null;
};

export default getStripe;
