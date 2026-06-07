import React from 'react';
import styled from 'styled-components';

interface ResultsMetaProps {
  total: number;
}

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 28px 12px;
`;

const Count = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  color: ${({ theme }) => theme.ink};
  margin: 0;
`;

const CountNumber = styled.span`
  font-weight: 600;
`;

const CountLabel = styled.span`
  font-weight: 400;
`;

const ResultsMeta: React.FC<ResultsMetaProps> = ({ total }) => (
  <Row>
    <Count>
      <CountNumber>{total}</CountNumber>
      <CountLabel> libros disponibles</CountLabel>
    </Count>
  </Row>
);

export default ResultsMeta;
