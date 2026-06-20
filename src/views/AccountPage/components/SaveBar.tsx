import React from 'react';
import styled, { keyframes } from 'styled-components';
import { primaryButton } from './styles';

interface SaveBarFeedback {
  success?: boolean;
  message?: string;
}

interface SaveBarProps {
  onSave: () => void;
  loading: boolean;
  saveLabel?: string;
  feedback?: SaveBarFeedback;
}

const CheckIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const SaveBar: React.FC<SaveBarProps> = ({
  onSave,
  loading,
  saveLabel = 'Guardar cambios',
  feedback,
}) => (
  <Wrapper>
    {feedback?.message && (
      <Banner $success={!!feedback.success} role={feedback.success ? 'status' : 'alert'}>
        {feedback.success
          ? <CheckIcon />
          : <span aria-hidden="true">⚠</span>}
        <span>{feedback.message}</span>
        {!feedback.success && (
          <RetryButton type="button" onClick={onSave}>Reintentar</RetryButton>
        )}
      </Banner>
    )}
    <Row>
      <SaveButton type="button" onClick={onSave} disabled={loading}>
        {loading && <Spinner aria-hidden="true" />}
        {loading ? 'Guardando…' : saveLabel}
      </SaveButton>
    </Row>
  </Wrapper>
);

const Wrapper = styled.div`
  margin-top: 24px;
  padding-top: 18px;
  border-top: 0.5px solid #e8dfc8;
`;

const Row = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  @media (max-width: 480px) {
    justify-content: stretch;
  }
`;

const SaveButton = styled.button`
  ${primaryButton}

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const Banner = styled.div<{ $success: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 10px 14px;
  border-radius: 8px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  background: ${({ $success, theme }) => ($success ? theme.cream : '#fdf3ee')};
  border: 1px solid ${({ $success, theme }) => ($success ? theme.success : theme.terracotta)};
  color: ${({ theme }) => theme.ink};
`;

const RetryButton = styled.button`
  margin-left: auto;
  background: none;
  border: none;
  padding: 0;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.terracotta};
  cursor: pointer;
  text-decoration: underline;
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Spinner = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-top-color: ${({ theme }) => theme.white};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export default SaveBar;
