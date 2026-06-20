import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import UserContext from '../../store/context/userContext/UserContext';
import { Loading, NotLogged } from '../../components';
import AccountContextBar from './AccountContextBar';
import AccountNav from './AccountNav';
import ProfileSection from './sections/ProfileSection';
import SpacesSection from './sections/SpacesSection';
import MyBooksSection from './sections/MyBooksSection';
import AddBookSection from './sections/AddBookSection';
import HelpSection from './sections/HelpSection';
import {
  AccountSection,
  DEFAULT_SECTION,
  isAccountSection,
} from './types';

const SECTION_COMPONENTS: Record<AccountSection, React.FC> = {
  profile: ProfileSection,
  spaces: SpacesSection,
  books: MyBooksSection,
  addBook: AddBookSection,
  help: HelpSection,
};

const AccountPage: React.FC = (): JSX.Element => {
  const router = useRouter();
  const { user, isLogged, loading } = useContext(UserContext);

  const activeSection = isAccountSection(router.query.section)
    ? router.query.section
    : DEFAULT_SECTION;

  const handleSelect = (section: AccountSection): void => {
    router.push(
      { pathname: '/account', query: { section } },
      undefined,
      { shallow: true },
    );
  };

  if (loading) return <Loading />;
  if (!isLogged) return <NotLogged />;

  const ActiveSection = SECTION_COMPONENTS[activeSection];

  return (
    <Page>
      <AccountContextBar userName={user.name} />
      <Layout>
        <AccountNav activeSection={activeSection} onSelect={handleSelect} />
        <Work>
          <Panel>
            <ActiveSection />
          </Panel>
        </Work>
      </Layout>
    </Page>
  );
};

const Page = styled.div`
  background: ${({ theme }) => theme.appBackground};
  min-height: 100vh;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 28px;
  max-width: 1040px;
  margin: 0 auto;
  padding: 28px;

  @media (max-width: 899px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
  }
`;

const Work = styled.div`
  min-width: 0;
`;

const Panel = styled.div`
  background: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.lightBorder};
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 1px 4px rgba(61, 58, 53, 0.07);

  @media (max-width: 480px) {
    padding: 20px 16px;
  }
`;

export default AccountPage;
