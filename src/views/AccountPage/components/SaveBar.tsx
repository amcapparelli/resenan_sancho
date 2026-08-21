import React from 'react';
import styled from 'styled-components';
import { buttonSpinner, primaryButton } from '../../../components/styles';
import { CheckIcon } from '../../../components/icons';

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
  background: ${({ $success, theme }) => ($success ? theme.cream : theme.terracottaSoft)};
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

const Spinner = styled.span`
  ${buttonSpinner}
`;

export default SaveBar;
