import React from 'react';
import styled from 'styled-components';
import { FieldError } from './AccountField';

// Accepts a real input change event or a synthetic `{ target: { files } }`
// (from drag & drop), both of which `useUploadImages` can consume.
interface CoverUploaderProps {
  cover?: string;
  loading?: boolean;
  error?: string;
  onSelectFile: (event: { target: { files: FileList } }) => void;
}

const ImageIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="32" height="32" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

const CoverUploader: React.FC<CoverUploaderProps> = ({
  cover,
  loading,
  error,
  onSelectFile,
}) => {
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>): void => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onSelectFile({ target: { files: e.dataTransfer.files } });
    }
  };

  return (
    <>
      <Dropzone
        htmlFor="cover-input"
        $hasImage={!!cover}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <HiddenInput
          id="cover-input"
          type="file"
          accept="image/png, image/jpeg"
          onChange={onSelectFile}
        />
        {cover ? (
          <>
            <Preview src={cover} alt="Vista previa de la portada" />
            <ChangeOverlay>{loading ? 'Subiendo…' : 'Cambiar'}</ChangeOverlay>
          </>
        ) : (
          <Empty>
            <IconHolder><ImageIcon /></IconHolder>
            <EmptyTitle>{loading ? 'Subiendo…' : 'Sube la portada'}</EmptyTitle>
            <EmptyHelp>JPG o PNG · 3:4 recomendado</EmptyHelp>
          </Empty>
        )}
      </Dropzone>
      {error && (
        <FieldError>
          <span aria-hidden="true">⚠</span>
          {error}
        </FieldError>
      )}
    </>
  );
};

const Dropzone = styled.label<{ $hasImage: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  aspect-ratio: 3 / 4;
  width: 100%;
  border-radius: 10px;
  cursor: pointer;
  overflow: hidden;
  background: ${({ theme }) => theme.cream};
  border: 1.5px dashed ${({ $hasImage, theme }) => ($hasImage ? 'transparent' : theme.lightBorder)};

  &:focus-within {
    border-color: ${({ theme }) => theme.terracotta};
    box-shadow: 0 0 0 2px rgba(199, 91, 34, 0.18);
  }
`;

const HiddenInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`;

const Preview = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ChangeOverlay = styled.span`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  padding: 6px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.white};
  background: rgba(61, 58, 53, 0.6);
`;

const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px;
  text-align: center;
`;

const IconHolder = styled.span`
  color: ${({ theme }) => theme.terracotta};
  opacity: 0.4;
`;

const EmptyTitle = styled.span`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.brown};
`;

const EmptyHelp = styled.span`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  color: ${({ theme }) => theme.muted};
`;

export default CoverUploader;
