import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>© {new Date().getFullYear()} FitTrack — Gym Membership Management System &nbsp;·&nbsp;</p>
      </div>
    </footer>
  );
}
