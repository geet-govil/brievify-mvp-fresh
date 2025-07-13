import '../styles/globals.css'; // Import your global Tailwind CSS
import { AuthProvider, CampaignProvider } from '../App'; // Import contexts from App.js

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CampaignProvider>
        <Component {...pageProps} />
      </CampaignProvider>
    </AuthProvider>
  );
}

export default MyApp;