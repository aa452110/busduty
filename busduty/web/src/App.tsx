import LandingPage from './LandingPage';
import BusDutyApp from './BusDutyApp';
import OfficeView from './OfficeView';
import AboutPage from './AboutPage';
import SignupPage from './SignupPage';
import SignInPage from './SignInPage';
import AccountPage from './AccountPage';

export default function App() {
  const path = window.location.pathname;
  
  // Route to different components based on path
  if (path === '/busduty') {
    return <BusDutyApp />;
  } else if (path === '/office') {
    return <OfficeView />;
  } else if (path === '/about') {
    return <AboutPage />;
  } else if (path === '/signup') {
    return <SignupPage />;
  } else if (path === '/signin') {
    return <SignInPage />;
  } else if (path === '/account') {
    return <AccountPage />;
  } else {
    return <LandingPage />;
  }
}