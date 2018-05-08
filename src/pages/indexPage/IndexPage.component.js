import * as React from 'react';
import DashboardCard from '../../components/DashboardCard';
import { Wrapper, StyledDashboardImage, StyledCard } from './IndexPage.style';
const dashboardCards = [
  {
    iconType: 'wallet',
    href: '/wallets',
    title: 'Wallet Manager'
  },
  {
    iconType: 'setting',
    href: '/settings',
    title: 'Settings'
  }
];
class Dashboard extends React.PureComponent {
  render() {
    const lightImage = 'img/content/corerz-isologo.svg';
    const darkImage = 'img/content/corerz-isologo--n.svg';
    return (
      <Wrapper>
        <div>
          <StyledDashboardImage src={darkImage} />
        </div>
        <StyledCard>
          {dashboardCards &&
            dashboardCards.map(card => (
              <DashboardCard
                key={card.title}
                href={card.href}
                iconType={card.iconType}
                title={card.title}
              />
            ))}
        </StyledCard>
      </Wrapper>
    );
  }
}
export default Dashboard;
