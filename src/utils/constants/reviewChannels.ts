import React from 'react';
import { AvailableMedias } from '../../interfaces/mediaForm';
import {
  AmazonIcon,
  GoodreadsIcon,
  InstagramIcon,
  TikTokIcon,
  YoutubeIcon,
  BlogIcon,
  PodcastIcon,
} from '../channelIcons';

export interface ReviewChannel {
  key: AvailableMedias;
  // Row label in the account form ("Mis reseñas literarias").
  label: string;
  // Chip label on the public reviewer card, when it differs from `label`
  // (only booktube, which the card has always shown as "YouTube").
  chipLabel?: string;
  Icon: React.FC<{ size?: number }>;
  // Per-channel field placeholders in the account form; channels without them
  // keep empty fields.
  namePlaceholder?: string;
  urlPlaceholder?: string;
}

// Single source of truth for the channel order, shared by the account form and
// the public reviewer card. Ordered from least to most effort to convey that a
// blog isn't required — see docs/new-review-channels-spec.md.
const REVIEW_CHANNELS: ReadonlyArray<ReviewChannel> = [
  {
    key: AvailableMedias.amazon, label: 'Amazon', Icon: AmazonIcon,
  },
  {
    key: AvailableMedias.goodreads, label: 'Goodreads', Icon: GoodreadsIcon,
  },
  {
    key: AvailableMedias.bookstagram, label: 'Instagram', Icon: InstagramIcon,
  },
  {
    key: AvailableMedias.tiktok,
    label: 'TikTok',
    Icon: TikTokIcon,
    namePlaceholder: '@tuusuario',
    urlPlaceholder: 'https://www.tiktok.com/@tuusuario',
  },
  {
    key: AvailableMedias.booktube, label: 'Booktube', chipLabel: 'YouTube', Icon: YoutubeIcon,
  },
  {
    key: AvailableMedias.blog, label: 'Blog', Icon: BlogIcon,
  },
  {
    key: AvailableMedias.podcast,
    label: 'Podcast',
    Icon: PodcastIcon,
    namePlaceholder: 'Nombre del podcast',
    urlPlaceholder: 'https://open.spotify.com/show/…',
  },
];

export default REVIEW_CHANNELS;
