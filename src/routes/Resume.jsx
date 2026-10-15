import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Resume() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="resume-page" style={{ paddingTop: 'calc(var(--header-h) + 2.5rem)', paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 clamp(1rem, 3vw, 2rem)' }}>
        {/* Header bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-line">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
              <Link to="/" className="hover:text-foam transition-colors">Home</Link>
              <span>/</span>
              <span className="text-foam">Resume</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foam tracking-tight">
              Curriculum Vitae
            </h1>
            <p className="text-sm text-muted mt-1">
              Bikash Dhakal · Full Stack Developer · Kathmandu, Nepal
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="/resume.pdf"
              download="Bikash_Dhakal_Resume.pdf"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-foam text-bg hover:opacity-90 transition-opacity shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download PDF</span>
            </a>

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border border-line bg-surface hover:bg-surface-2 text-foam transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>Open in New Tab</span>
            </a>

            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border border-line bg-surface hover:bg-surface-2 text-muted hover:text-foam transition-colors"
            >
              <span>View Projects</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* PDF Viewer Container */}
        <div className="rounded-xl overflow-hidden border border-line bg-surface shadow-2xl relative">
          <object
            data="/resume.pdf#view=FitH"
            type="application/pdf"
            className="w-full h-[78vh] min-h-[580px] block"
          >
            <iframe
              src="/resume.pdf#view=FitH"
              title="Bikash Dhakal Resume"
              className="w-full h-[78vh] min-h-[580px] border-0"
            >
              <div className="p-8 text-center">
                <p className="text-foam text-base font-medium mb-3">Your browser does not support inline PDF viewing.</p>
                <a
                  href="/resume.pdf"
                  download
                  className="inline-block px-5 py-2.5 rounded-lg bg-foam text-bg text-sm font-semibold"
                >
                  Download Resume PDF
                </a>
              </div>
            </iframe>
          </object>
        </div>
      </div>
    </div>
  );
}
