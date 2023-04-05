import React, { useContext } from 'react';
import styledComponents from 'styled-components';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { PublicZoneLayout } from '../components/Layouts';
import { StyledTitle } from '../components';
import UserContext from '../store/context/userContext/UserContext';

const index = () => {
  const { t } = useTranslation();
  const { isLogged } = useContext(UserContext);

  return (
    <PublicZoneLayout showFooter>
      <StyledTitle
        text={t('titles.main')}
      />
      <StyledSection>
        <StyledArticleContainer>
          <StyledArticleTitle>
            <h2>
              {t('titles.homeFirst')}
            </h2>
          </StyledArticleTitle>
          <StyledArticleP>
            <p>
              {t('paragraphs.homeOne')}
            </p>
            <p>
              {t('paragraphs.homeTwo')}
            </p>
            <p>
              {t('paragraphs.homeThree')}
            </p>
          </StyledArticleP>
          <StyledNav>
            <Link href="/reviewers">
              <StyledArticleButton aria-label="Find Reviewers">{t('buttons.findReviewers')}</StyledArticleButton>
            </Link>
            <Link href="/books">
              <StyledArticleButton aria-label="Find Books">{t('buttons.seeBooks')}</StyledArticleButton>
            </Link>
          </StyledNav>
        </StyledArticleContainer>
      </StyledSection>
      <StyledSectionB>
        <StyledArticleBContainer>
          <StyledArticleTitleB>
            <h2>
              {t('titles.homeSecond')}
            </h2>
          </StyledArticleTitleB>
          <StyledArticleBP>
            <p>
              {t('paragraphs.homeFour')}
            </p>
            <p>
              {t('paragraphs.homeFive')}
            </p>
            <p>
              {t('paragraphs.homeSix')}
            </p>
          </StyledArticleBP>
          <StyledNav>
            <Link href="/books">
              <StyledArticleButton aria-label="Find Books">{t('buttons.seeBooks')}</StyledArticleButton>
            </Link>
            {
              !isLogged
                ? (
                  <Link href="/register">
                    <StyledArticleButton aria-label="Register">{t('buttons.signUp')}</StyledArticleButton>
                  </Link>
                )
                : (
                  <Link href="/myspaces">
                    <StyledArticleButton aria-label="Add literary spaces">{t('buttons.addLiterarySpaces')}</StyledArticleButton>
                  </Link>
                )
            }
          </StyledNav>
        </StyledArticleBContainer>
      </StyledSectionB>
      <StyledSection>
        <StyledArticleContainer>
          <StyledArticleTitleB>
            <h2>
              {t('titles.homeThird')}
            </h2>
          </StyledArticleTitleB>
          <StyledArticleP>
            <p>
              {t('paragraphs.homeSeven')}
            </p>
            <p>
              {t('paragraphs.homeEight')}
            </p>
            <p>
              {t('paragraphs.homeNine')}
            </p>
          </StyledArticleP>
          <StyledNav>
            <Link href="/reviewers">
              <StyledArticleButton aria-label="Find Reviewers">{t('buttons.findReviewers')}</StyledArticleButton>
            </Link>
            {
              !isLogged
                ? (
                  <Link href="/register">
                    <StyledArticleButton aria-label="Register">{t('buttons.signUp')}</StyledArticleButton>
                  </Link>
                )
                : (
                  <Link href="/addBook">
                    <StyledArticleButton aria-label="Add Book">{t('buttons.addBook')}</StyledArticleButton>
                  </Link>
                )
            }

          </StyledNav>
        </StyledArticleContainer>
      </StyledSection>
    </PublicZoneLayout>
  );
};

const StyledSectionB = styledComponents.section`
  margin-left: calc(50% - 50vw);
  width: 100vw;
`;

const StyledSection = styledComponents.section`
  margin-top: 3%;
  margin-left: calc(50% - 50vw);
  width: 100vw;
  background-color: #f5f5f0;
`;

const StyledArticleTitle = styledComponents.h2`
  font-family: ${(props) => props.theme.fontFamily};
  color: ${(props) => props.theme.contrastText};
  font-size: 1.5rem;
  grid-area: head;
  margin-bottom: 0;
`;

const StyledArticleTitleB = styledComponents.h2`
  font-family: ${(props) => props.theme.fontFamily};
  color: ${(props) => props.theme.contrastText};
  font-size: 2rem;
  grid-area: head;
  margin-bottom: 0;
`;

const StyledArticleP = styledComponents.p`
  margin-top: 0;
  font-family: ${(props) => props.theme.fontFamily};
  font-size: 1rem;
  grid-area: main;
`;

const StyledArticleBP = styledComponents.p`
  margin-top: 0;
  font-family: ${(props) => props.theme.fontFamily};
  font-size: 1rem;
  grid-area: main;
`;

const StyledNav = styledComponents.div`
  grid-area: nav;
  justify-self: center;
  align-self: center;
`;

const StyledArticleButton = styledComponents.button`
  font-family: ${(props) => props.theme.fontFamily};
  font-size: 1rem;
  width: 90%;
  margin: 5%;
  padding: 5%;
  color: ${(props) => props.theme.dark};
  background-color: ${(props) => props.theme.main};
  border-radius: 25px;
  :hover{
    cursor: pointer;
    background-color: ${(props) => props.theme.dark};
    color: ${(props) => props.theme.main};
  }
`;

const StyledArticleContainer = styledComponents.article`
  @media (max-width: 375px) {
    display: grid;
    grid-template-areas: "head"
                          "main"
                          "nav";
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
  }
  padding: 0 5% 0 5%;
  display: grid;
  grid-template-areas: "head nav"
                       "main nav";
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr;           
`;

const StyledArticleBContainer = styledComponents.article`
  @media (max-width: 375px) {
    display: grid;
    grid-template-areas: "head"
                          "main"
                          "nav";
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
  }
  padding: 0 5% 0 5%;
  display: grid;
  grid-template-areas: "nav head"
                       "nav main";
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr;           
`;
export default index;
