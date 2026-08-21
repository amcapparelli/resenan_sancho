import React from 'react';
import Image from 'next/image';
import styled, { css } from 'styled-components';
import BookCoverFallback from '../BookCoverFallback';
import { isOptimizedImageHost } from '../../utils/imageHost';

interface BookContextHeaderProps {
  title: string;
  authorName: string;
  coverUrl?: string;
}

const BookContextHeader: React.FC<BookContextHeaderProps> = ({
  title,
  authorName,
  coverUrl,
}) => {
  // Trim guards against whitespace-only legacy covers ("  "), which would render
  // a broken image instead of the fallback.
  const hasCover = Boolean(coverUrl?.trim());

  return (
    <Header>
      <CoverFrame>
        {hasCover ? (
          <CoverImage
            src={coverUrl}
            alt={`Portada de ${title}`}
            fill
            // The CSS slot is 40px wide; the browser scales that by the device
            // pixel ratio on its own. Serving it through next/image (like the
            // detail hero and the cards) is what keeps the thumbnail from
            // downloading the full-size Cloudinary original.
            sizes="40px"
            unoptimized={!isOptimizedImageHost(coverUrl)}
          />
        ) : (
          <BookCoverFallback />
        )}
      </CoverFrame>

      <Info>
        <BookTitle>{title}</BookTitle>
        <AuthorName>{`de ${authorName}`}</AuthorName>
      </Info>
    </Header>
  );
};

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

/* Sizing container for the fill-mode cover: `position: relative` is required by
   next/image `fill`, and it also gives BookCoverFallback its 40×54 slot. */
const CoverFrame = styled.div`
  position: relative;
  width: 40px;
  height: 54px;
  flex-shrink: 0;
  border-radius: 5px;
  overflow: hidden;
  background: ${({ theme }) => theme.cream};
  border: 1px solid ${({ theme }) => theme.lightBorder};
`;

const CoverImage = styled(Image)`
  object-fit: cover;
`;

const Info = styled.div`
  min-width: 0;
`;

/* One line with ellipsis: long titles must not push the close button around. */
const oneLine = css`
  margin: 0;
  font-family: 'Source Sans 3', sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BookTitle = styled.p`
  ${oneLine}
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.ink};
`;

const AuthorName = styled.p`
  ${oneLine}
  font-size: 12px;
  color: ${({ theme }) => theme.muted};
`;

export default BookContextHeader;
