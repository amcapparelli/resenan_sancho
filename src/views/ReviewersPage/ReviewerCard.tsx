import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Reviewer } from '../../interfaces/reviewer';

// ─── Channel icon SVGs ─────────────────────────────────────────────────────

const BlogIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const YoutubeIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polygon points="10,8 16,12 10,16" />
  </svg>
);

const InstagramIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
);

const GoodreadsIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12" aria-hidden="true">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const AmazonIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12" aria-hidden="true">
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <line x1="9" y1="7" x2="15" y2="7" />
    <line x1="9" y1="11" x2="15" y2="11" />
    <line x1="9" y1="15" x2="12" y2="15" />
  </svg>
);

// ─── Channel config ────────────────────────────────────────────────────────

type ChannelKey = 'blog' | 'booktube' | 'bookstagram' | 'goodreads' | 'amazon';

interface ChannelConfig {
  key: ChannelKey;
  label: string;
  Icon: React.FC;
}

const CHANNEL_CONFIG: ChannelConfig[] = [
  { key: 'blog', label: 'Blog', Icon: BlogIcon },
  { key: 'booktube', label: 'YouTube', Icon: YoutubeIcon },
  { key: 'bookstagram', label: 'Instagram', Icon: InstagramIcon },
  { key: 'goodreads', label: 'Goodreads', Icon: GoodreadsIcon },
  { key: 'amazon', label: 'Amazon', Icon: AmazonIcon },
];

// ─── Styled components ─────────────────────────────────────────────────────

const Card = styled.article`
  background: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.lightBorder};
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 20px 20px 0px 20px;
  box-shadow: 0 1px 4px rgba(61, 58, 53, 0.07);
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 6px 20px rgba(61, 58, 53, 0.14);
    transform: translateY(-2px);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover {
      transform: none;
    }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 14px;
`;

const AvatarImage = styled.img`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.lightBorder};
  flex-shrink: 0;
  object-fit: cover;
`;

const AvatarInitials = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.lightBorder};
  flex-shrink: 0;
  background: ${({ theme }) => theme.amber};
  color: ${({ theme }) => theme.ink};
  font-family: 'Fraunces', serif;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
`;

const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
`;

const ReviewerName = styled.h2`
  font-family: 'Fraunces', serif;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.ink};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// Wrapper with flex: 1 so description section takes available vertical space
const DescriptionWrapper = styled.div`
  flex: 1;
  margin-bottom: 14px;
`;

interface DescriptionTextProps {
  $expanded: boolean;
}

const DescriptionText = styled.p<DescriptionTextProps>`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  line-height: 1.6;
  color: #5a524a;
  margin: 0;

  ${({ $expanded }) =>
    $expanded
      ? `overflow: visible; display: block;`
      : `
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
      `}
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin-top: 4px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  color: ${({ theme }) => theme.terracotta};
  cursor: pointer;
  display: block;
`;

// Section separator that bleeds to the card edges and restores inner padding
const SectionDivider = styled.div`
  border-top: 0.5px solid #e8dfc8;
  margin: 0 -20px;
  padding: 12px 20px 0;
`;

const SectionLabel = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.brown};
  margin: 0 0 6px;
`;

const ChipsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
`;

const ChannelChip = styled.a`
  background: ${({ theme }) => theme.cream};
  border: 1px solid ${({ theme }) => theme.lightBorder};
  border-radius: 6px;
  padding: 4px 10px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.brown};
  text-decoration: none;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;

  &:hover {
    background: #efe5c8;
    border-color: ${({ theme }) => theme.terracotta};
    color: ${({ theme }) => theme.terracotta};
  }
`;

const GenreChip = styled.span`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.lightBorder};
  border-radius: 4px;
  padding: 3px 8px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: ${({ theme }) => theme.ink};
`;

const MoreGenresChip = styled.button`
  background: ${({ theme }) => theme.cream};
  border: 1px dashed ${({ theme }) => theme.lightBorder};
  border-radius: 4px;
  padding: 3px 8px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 11px;
  color: ${({ theme }) => theme.brown};
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.terracotta};
    color: ${({ theme }) => theme.terracotta};
  }
`;

// ─── Sub-components ────────────────────────────────────────────────────────

interface AvatarProps {
  avatar: string;
  name: string;
  lastName: string;
}

const Avatar: React.FC<AvatarProps> = ({ avatar, name, lastName }) => {
  const fullName = `${name} ${lastName}`.trim();

  if (avatar) {
    return (
      <AvatarImage
        src={avatar}
        alt={`Avatar de ${fullName}`}
        width={52}
        height={52}
      />
    );
  }

  const initials = `${name.charAt(0)}${lastName.charAt(0)}`;

  return (
    <AvatarInitials aria-label={`Iniciales de ${fullName}`}>
      {initials}
    </AvatarInitials>
  );
};

// ─── Main component ────────────────────────────────────────────────────────

const MAX_GENRES_VISIBLE = 4;
// Approximate threshold — avoids measuring DOM; toggle only shown when text is clearly long
const DESCRIPTION_TOGGLE_THRESHOLD = 240;

interface ReviewerCardProps {
  reviewer: Reviewer & { _id?: string };
}

const ReviewerCard: React.FC<ReviewerCardProps> = ({ reviewer }) => {
  const { t } = useTranslation();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [areGenresExpanded, setAreGenresExpanded] = useState(false);

  const { author, description, genres, formats } = reviewer;
  const fullName = `${author.name} ${author.lastName}`.trim();

  // Channels: only render those with a non-empty url
  const activeChannels = CHANNEL_CONFIG.filter(({ key }) => {
    const channel = reviewer[key];
    return channel && channel.url && channel.url.trim() !== '';
  });

  const hasChannels = activeChannels.length > 0;
  const showDescriptionToggle = description && description.length > DESCRIPTION_TOGGLE_THRESHOLD;

  // Genre display: cap at 4 unless expanded
  const visibleGenres = areGenresExpanded ? genres : genres.slice(0, MAX_GENRES_VISIBLE);
  const hiddenGenresCount = genres.length - MAX_GENRES_VISIBLE;

  return (
    <Card>
      {/* Header: avatar + name */}
      <Header>
        <Avatar
          avatar={author.avatar}
          name={author.name}
          lastName={author.lastName}
        />
        <NameBlock>
          <ReviewerName title={fullName}>{fullName}</ReviewerName>
        </NameBlock>
      </Header>

      {/* Description with expand/collapse */}
      <DescriptionWrapper>
        <DescriptionText $expanded={isDescriptionExpanded}>
          {description}
        </DescriptionText>
        {showDescriptionToggle && (
          <ToggleButton
            type="button"
            onClick={() => setIsDescriptionExpanded((prev) => !prev)}
            aria-expanded={isDescriptionExpanded}
          >
            {isDescriptionExpanded ? 'Ver menos' : 'Ver más'}
          </ToggleButton>
        )}
      </DescriptionWrapper>

      {/* Channels section */}
      {hasChannels && (
        <SectionDivider>
          <SectionLabel>MIRA SUS RESEÑAS EN</SectionLabel>
          <ChipsRow>
            {activeChannels.map(({ key, label, Icon }) => {
              const channel = reviewer[key];
              const chipLabel = channel.name && channel.name.trim() !== ''
                ? channel.name
                : label;

              return (
                <ChannelChip
                  key={key}
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver reseñas en ${label} de ${fullName}`}
                >
                  <Icon />
                  {chipLabel}
                </ChannelChip>
              );
            })}
          </ChipsRow>
        </SectionDivider>
      )}

      {/* Genres section */}
      {genres.length > 0 && (
        <SectionDivider>
          <SectionLabel>GÉNEROS</SectionLabel>
          <ChipsRow>
            {visibleGenres.map((genre) => (
              <GenreChip key={genre}>{t(`genres.${genre}`)}</GenreChip>
            ))}

            {!areGenresExpanded && hiddenGenresCount > 0 && (
              <MoreGenresChip
                type="button"
                onClick={() => setAreGenresExpanded(true)}
                aria-label={`Mostrar todos los géneros de ${fullName}`}
              >
                +{hiddenGenresCount} más
              </MoreGenresChip>
            )}

            {areGenresExpanded && genres.length > MAX_GENRES_VISIBLE && (
              <MoreGenresChip
                type="button"
                onClick={() => setAreGenresExpanded(false)}
                aria-label={`Colapsar géneros de ${fullName}`}
              >
                Ver menos
              </MoreGenresChip>
            )}
          </ChipsRow>
        </SectionDivider>
      )}

      {/* Formats section */}
      {formats.length > 0 && (
        <SectionDivider>
          <SectionLabel>FORMATOS</SectionLabel>
          <ChipsRow>
            {formats.map((format) => (
              <GenreChip key={format}>{format}</GenreChip>
            ))}
          </ChipsRow>
        </SectionDivider>
      )}
    </Card>
  );
};

export default ReviewerCard;
