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
            {t('titles.homeFirst')}
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
            <StyledArticleButton href="/reviewers" aria-label="Find Reviewers">{t('buttons.findReviewers')}</StyledArticleButton>
            <StyledArticleButton href="/books" aria-label="Find Books">{t('buttons.seeBooks')}</StyledArticleButton>
          </StyledNav>
        </StyledArticleContainer>
      </StyledSection>
      <StyledSectionB>
        <StyledArticleBContainer>
          <StyledArticleTitleB>
            {t('titles.homeSecond')}
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
            <StyledArticleButton href="/books" aria-label="Find Books">{t('buttons.seeBooks')}</StyledArticleButton>
            {
              !isLogged
                ? (
                  <StyledArticleButton href="/register" aria-label="Register">{t('buttons.signUp')}</StyledArticleButton>
                )
                : (
                  <StyledArticleButton href="/myspaces" aria-label="Add literary spaces">{t('buttons.addLiterarySpaces')}</StyledArticleButton>
                )
            }
          </StyledNav>
        </StyledArticleBContainer>
      </StyledSectionB>
      <StyledSection>
        <StyledArticleContainer>
          <StyledArticleTitleB>
            {t('titles.homeThird')}
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
            <StyledArticleButton href="/reviewers" aria-label="Find Reviewers">{t('buttons.findReviewers')}</StyledArticleButton>
            {
              !isLogged
                ? (
                  <StyledArticleButton href="/register" aria-label="Register">{t('buttons.signUp')}</StyledArticleButton>
                )
                : (
                  <StyledArticleButton href="/addBook" aria-label="Add Book">{t('buttons.addBook')}</StyledArticleButton>
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

const StyledArticleP = styledComponents.div`
  margin-top: 0;
  font-family: ${(props) => props.theme.fontFamily};
  font-size: 1rem;
  grid-area: main;
`;

const StyledArticleBP = styledComponents.div`
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

const StyledArticleButton = styledComponents(Link)`
  display: inline-block;
  text-decoration: none;
  font-family: ${(props) => props.theme.fontFamily};
  font-size: 1rem;
  width: 90%;
  margin: 5%;
  padding: 5%;
  color: ${(props) => props.theme.dark};
  background-color: ${(props) => props.theme.main};
  border-radius: 25px;
  text-align: center;
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
