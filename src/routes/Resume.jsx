import { Link } from 'react-router-dom';

export default function Resume() {
  return (
    <div className="resume-page">
      <div className="resume-shell">
        <div className="resume-heading">
          <div>
            <div className="resume-breadcrumb">
              <Link to="/" className="hover:text-foam transition-colors">Home</Link>
              <span>/</span>
              <span className="text-foam">Resume</span>
            </div>
            <h1 className="resume-title">Curriculum Vitae</h1>
            <p className="resume-subtitle">
              Bikash Dhakal · Full Stack Developer · Kathmandu, Nepal
            </p>
          </div>

          <div className="resume-actions">
            <a
              href="/resume.pdf"
              download="Bikash_Dhakal_Resume.pdf"
              className="resume-action resume-action-primary"
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
              className="resume-action"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>Open in New Tab</span>
            </a>

            <Link
              to="/projects"
              className="resume-action"
            >
              <span>View Projects</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        <div className="resume-viewer">
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
              <div className="resume-fallback">
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
