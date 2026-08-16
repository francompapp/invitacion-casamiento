import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navigation from './components/Navigation/Navigation';
import Hero from './components/Hero/Hero';
import Schedule from './components/Schedule/Schedule';
import Location from './components/Location/Location';
import DressCode from './components/DressCode/DressCode';
import RSVP from './components/RSVP/RSVP';
import Gifts from './components/Gifts/Gifts';
import AfterParty from './components/AfterParty/AfterParty';
import PracticalInfo from './components/PracticalInfo/PracticalInfo';
import Footer from './components/Footer/Footer';
import { fetchGuestGroupByToken } from './utils/guestSheet';
import './App.css';

function InvitationPage({ token }) {
  const [guestGroup, setGuestGroup] = useState(null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    if (token) {
      fetchGuestGroupByToken(token)
        .then((data) => { setGuestGroup(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [token]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Cargando tu invitación...</p>
      </div>
    );
  }

  return (
    <>
      <Hero guestGroup={guestGroup} />
      <Schedule />
      <Location />
      <DressCode />
      <RSVP guestGroup={guestGroup} />
      <Gifts />
      <AfterParty />
      <PracticalInfo />
    </>
  );
}

function TokenPage() {
  const { token } = useParams();
  return <InvitationPage token={token} />;
}

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/:token" element={<TokenPage />} />
          <Route path="/" element={<InvitationPage token={null} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
