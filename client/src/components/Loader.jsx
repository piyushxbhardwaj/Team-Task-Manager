const Loader = ({ fullPage = false }) => {
  return (
    <div className={`loader-container ${fullPage ? 'full-page' : ''}`}>
      <div className="spinner"></div>
      <style jsx="true">{`
        .loader-container {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .full-page {
          height: 100vh;
          width: 100vw;
          position: fixed;
          top: 0;
          left: 0;
          background: var(--bg-color);
          z-index: 1000;
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(139, 92, 246, 0.1);
          border-top-color: var(--accent-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
