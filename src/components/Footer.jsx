import React from 'react';

function Footer() {
  return (
    <footer style={{
      backgroundColor: '#F8FAFC',    
      color: '#64748B',              
      textAlign: 'center',
      padding: '20px 0',
      fontSize: '13px',
      borderTop: '1px solid #E2E8F0',
      marginTop: 'auto'             
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <p style={{ margin: '0 0 6px 0', fontWeight: '600' }}>
          KT AIVLE School 9th Mini-Project 4th — Team 21
        </p>
        <p style={{ margin: 0, fontSize: '11px', color: '#94A3B8' }}>
          © 2026 도서 관리 시스템 All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;