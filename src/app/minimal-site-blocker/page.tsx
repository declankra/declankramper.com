export default function MinimalSiteBlockerPage() {
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
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'relative'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '40px', paddingTop: '40px' }}>
        <h1 style={{ fontSize: '2.5em', color: '#111' }}>Minimal Website Blocker</h1>
        <p style={{ fontSize: '1.1em', color: '#555' }}>Focus on what matters. Block distractions with privacy.</p>
      </header>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.8em', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>What is it?</h2>
        <p>
          Minimal Website Blocker is a simple, no-nonsense Safari extension for iOS and Mac.
          I built it for myself because I wanted to block distracting websites without compromising my privacy.
          Most website blockers track your browsing activity – this one doesn't.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.8em', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Why Privacy Matters</h2>
        <p>
          Many browser extensions that block websites watch every site you visit. They might check your current site against a blocklist, but this means they know your browsing habits.
          Often, this data is sold or used for advertising.
        </p>
        <p>
          <strong>Minimal Website Blocker is different.</strong> It's designed to protect your privacy. It doesn't need to know where you're going to do its job effectively. Your browsing data stays yours.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.8em', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Features</h2>
        <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
          <li style={{ marginBottom: '10px' }}>✓ <strong>Simple & Intuitive:</strong> Easily enable it in Safari's extension settings. No complicated setup.</li>
          <li style={{ marginBottom: '10px' }}>✓ <strong>Privacy-Focused:</strong> We don't track or sell your browsing data. Ever.</li>
          <li style={{ marginBottom: '10px' }}>✓ <strong>For iOS & Mac:</strong> Block sites seamlessly across your Apple devices.</li>
          <li style={{ marginBottom: '10px' }}>✓ <strong>Open Source:</strong> Transparency you can trust. Check out the code yourself!</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px', textAlign: 'center' }}>
        {/* Placeholder for App Store links - you'll need to add these when available */}
        <p style={{ fontSize: '1.1em', marginBottom: '10px' }}>Coming soon to the App Store!</p>
        {/*
        <a href="#" style={{ display: 'inline-block', marginRight: '10px', padding: '10px 15px', backgroundColor: '#007aff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>Download for iOS</a>
        <a href="#" style={{ display: 'inline-block', padding: '10px 15px', backgroundColor: '#007aff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>Download for Mac</a>
        */}
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.8em', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Open Source</h2>
        <p>
          This app is open source. You can view the source code, contribute, or raise issues on GitHub.
        </p>
        <p style={{ textAlign: 'center' }}>
          <a href="https://github.com/declankra/site-blocker-extension" target="_blank" rel="noopener noreferrer" style={{ color: '#007aff', textDecoration: 'none', fontWeight: 'bold' }}>
            View on GitHub
          </a>
        </p>
      </section>

      <footer style={{ textAlign: 'center', paddingTop: '20px', borderTop: '1px solid #eee', fontSize: '0.9em', color: '#777' }}>
        <p>
          Made by a human who also gets distracted.
        </p>
        <p style={{ marginBottom: '10px' }}>
          <a href="https://declankramper.com" target="_blank" rel="noopener noreferrer" style={{ color: '#007aff', textDecoration: 'none' }}>
            learn about the human who made it
          </a>
        </p>
        <p style={{ marginBottom: '10px' }}>
          Need help or have questions? Email me at <a href="mailto:business@dkbuild.co" style={{ color: '#007aff', textDecoration: 'none' }}>business@dkbuild.co</a>.
        </p>
        <p>
          <a href="/minimal-site-blocker/privacy" style={{ color: '#007aff', textDecoration: 'none' }}>Privacy Policy</a>
        </p>
      </footer>
    </div>
  );
}
