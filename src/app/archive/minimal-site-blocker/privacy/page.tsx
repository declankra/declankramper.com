import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Minimal Website Blocker',
  description: 'Privacy policy for Minimal Website Blocker - we don\'t collect, store, or share any of your personal data or browsing activity.',
};

export default function PrivacyPolicyPage() {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      maxWidth: '600px',
      margin: '50px auto',
      padding: '20px',
      lineHeight: '1.6',
      color: '#333',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5em', color: '#111' }}>Privacy Policy</h1>
        <p style={{ fontSize: '1.1em', color: '#555' }}>Minimal Website Blocker</p>
      </header>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.8em', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Our Commitment to Your Privacy</h2>
        <p>
          This Privacy Policy explains how Minimal Website Blocker (the "App") handles information. Your privacy is critically important to us. The App is designed from the ground up to protect your privacy.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.8em', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>No Data Collection</h2>
        <p>
          <strong>Minimal Website Blocker does not collect, store, transmit, or share any of your personal data or browsing activity.</strong>
        </p>
        <p>
          The App functions locally on your device. It does not require an internet connection to perform its core function of blocking websites, nor does it communicate any information about your website usage to us or any third party.
        </p>
        <ul>
          <li>We do not know which websites you visit.</li>
          <li>We do not know which websites you choose to block.</li>
          <li>We do not track your usage of the App.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.8em', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>How it Works (The Privacy Part)</h2>
        <p>
          Unlike many browser extensions that need to see the website you are navigating to in order to check it against a blocklist, Minimal Website Blocker is designed to work without this level of access to your browsing data. Its blocking mechanism is self-contained and does not report your activity.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.8em', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Open Source</h2>
        <p>
          Minimal Website Blocker is open source. You are encouraged to review the code to verify its privacy claims. You can find the source code on <a href="https://github.com/declankra/site-blocker-extension" target="_blank" rel="noopener noreferrer" style={{ color: '#007aff', textDecoration: 'none' }}>GitHub</a>.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.8em', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will be posted on this page. Since we collect no data, changes are unlikely to affect how your data is handled (as it is not handled at all).
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.8em', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at <a href="mailto:business@dkbuild.co" style={{ color: '#007aff', textDecoration: 'none' }}>business@dkbuild.co</a>.
        </p>
      </section>

      <footer style={{ textAlign: 'center', paddingTop: '20px', borderTop: '1px solid #eee', fontSize: '0.9em', color: '#777' }}>
        <p>
          <a href="/archive/minimal-site-blocker" style={{ color: '#007aff', textDecoration: 'none' }}>Back to Minimal Site Blocker Home</a>
        </p>
        <p>Last Updated: {new Date().toLocaleDateString()}</p>
      </footer>
    </div>
  );
} 
