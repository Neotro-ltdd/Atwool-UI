import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import './LandingPage.css';

interface LandingPageProps {
  onOpenLogin: (roleHint?: string) => void;
  currentUser?: any;
  onNavigateDashboard?: () => void;
  selectedCampus?: string;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  currentUser,
  onNavigateDashboard,
  theme = 'light',
  onToggleTheme,
}) => {
  const [timeLeft, setTimeLeft] = useState({ d: '00', h: '00', m: '00', s: '00' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    function getTarget() {
      const now = new Date();
      // Target: Friday 16:00 UTC (5:00 PM West Africa Time / WAT)
      const target = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 16, 0, 0));
      target.setUTCDate(target.getUTCDate() + ((5 - target.getUTCDay() + 7) % 7));
      if (target <= now) {
        target.setUTCDate(target.getUTCDate() + 7);
      }
      return target;
    }

    function calculateTime() {
      const diffSeconds = Math.max(0, Math.floor((getTarget().getTime() - Date.now()) / 1000));
      const days = Math.floor(diffSeconds / 86400);
      const hours = Math.floor((diffSeconds % 86400) / 3600);
      const mins = Math.floor((diffSeconds % 3600) / 60);
      const secs = diffSeconds % 60;

      setTimeLeft({
        d: String(days).padStart(2, '0'),
        h: String(hours).padStart(2, '0'),
        m: String(mins).padStart(2, '0'),
        s: String(secs).padStart(2, '0'),
      });
    }

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-page">
      <header>
        <div className="wrap nav">
          <a className="brand" href="#top">
            <img
              src="/attwool-logo.jpg"
              alt="Attwool Schools Official Crest"
              className="brand-logo"
            />
            <span>Attwool Schools</span>
          </a>
          <nav className="links">
            <a href="#cycle">Reporting cycle</a>
            <a href="#roles">Roles</a>
            <a href="#campuses">Campuses</a>
            <a href="#trust">Compliance</a>
          </nav>

          {/* Day / Night Theme Toggle */}
          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to day mode' : 'Switch to night mode'}
            title={theme === 'dark' ? 'Switch to day mode' : 'Switch to night mode'}
          >
            {theme === 'dark' ? (
              <Sun className="theme-icon sun" />
            ) : (
              <Moon className="theme-icon moon" />
            )}
          </button>

          {currentUser ? (
            <button
              type="button"
              className="btn p"
              onClick={onNavigateDashboard}
            >
              Staff Workspace →
            </button>
          ) : (
            <button
              type="button"
              className="btn p"
              onClick={() => onOpenLogin()}
            >
              Staff login
            </button>
          )}

          {/* Mobile Collapsible Navigation Trigger */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              color: 'inherit',
              padding: '6px',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Collapsible Mobile Drawer */}
        {mobileMenuOpen && (
          <div
            className="mobile-nav-drawer"
            style={{
              padding: '16px 20px',
              borderTop: '1px solid var(--line)',
              background: 'var(--surf)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <a
              href="#cycle"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontWeight: 600, fontSize: '14px', color: 'var(--ink)' }}
            >
              Reporting cycle
            </a>
            <a
              href="#roles"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontWeight: 600, fontSize: '14px', color: 'var(--ink)' }}
            >
              Roles &amp; Governance
            </a>
            <a
              href="#campuses"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontWeight: 600, fontSize: '14px', color: 'var(--ink)' }}
            >
              Campuses Overview
            </a>
            <a
              href="#trust"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontWeight: 600, fontSize: '14px', color: 'var(--ink)' }}
            >
              Compliance &amp; NDPA
            </a>
          </div>
        )}
      </header>

      <main id="top">
        <div className="hero">
          <div className="wrap">
            <span className="pill">
              <i className="dot"></i>First Term 2026/2027 · Week 1 open
            </span>
            <h1>
              Weekly reporting, <em>made effortless</em> for every teacher
            </h1>
            <p className="lead">
              One secure portal for curriculum pacing, direct Principal review and school-wide governance across Attwool College and Sunflower.
            </p>
            <div className="cta" id="login">
              {currentUser ? (
                <button
                  type="button"
                  className="btn p"
                  onClick={onNavigateDashboard}
                >
                  Enter staff portal →
                </button>
              ) : (
                <button
                  type="button"
                  className="btn p"
                  onClick={() => onOpenLogin()}
                >
                  Enter staff portal →
                </button>
              )}
              <a className="btn s" href="#cycle">
                See how it works
              </a>
            </div>
            <div className="count" aria-label="Time until Friday 5:00 PM WAT cutoff">
              <div>
                <b>{timeLeft.d}</b>
                <span>Days</span>
              </div>
              <div>
                <b>{timeLeft.h}</b>
                <span>Hours</span>
              </div>
              <div>
                <b>{timeLeft.m}</b>
                <span>Mins</span>
              </div>
              <div>
                <b>{timeLeft.s}</b>
                <span>Secs</span>
              </div>
            </div>
            <p className="small">until submission cutoff · Friday, 5:00 PM WAT</p>
            <p className="small" style={{ marginTop: 18 }}>
              Evaluating as QA or staff?{' '}
              <a
                href="#login"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenLogin();
                }}
              >
                Try an instant test role: Teacher, Director or Admin →
              </a>
            </p>
          </div>
        </div>

        <section style={{ paddingTop: 24 }}>
          <div className="wrap">
            <div className="stats">
              <div>
                <b>4</b>
                <span>Campuses connected</span>
              </div>
              <div>
                <b>20s</b>
                <span>Draft autosave</span>
              </div>
              <div>
                <b>Direct</b>
                <span>Director review</span>
              </div>
              <div>
                <b>NDPA</b>
                <span>2023 compliant</span>
              </div>
            </div>
          </div>
        </section>

        <section id="cycle">
          <div className="wrap">
            <div className="eyebrow">The 7-step cycle</div>
            <h2>From lesson to leadership insight</h2>
            <p className="sub">
              A clear weekly rhythm replaces scattered forms with a single, trackable flow.
            </p>
            <div className="steps">
              <div className="card step">
                <h3>Plan</h3>
                <p>Pick your class, subject and week from your assigned timetable.</p>
              </div>
              <div className="card step">
                <h3>Report</h3>
                <p>Log topics covered against the scheme of work.</p>
              </div>
              <div className="card step">
                <h3>Assess</h3>
                <p>Record assessments, homework and learner progress.</p>
              </div>
              <div className="card step">
                <h3>Flag</h3>
                <p>Raise confidential safeguarding or support concerns.</p>
              </div>
              <div className="card step">
                <h3>Submit</h3>
                <p>Send before Friday’s cutoff. Drafts autosave as you go.</p>
              </div>
              <div className="card step">
                <h3>Director review</h3>
                <p>Direct executive review, recommendations and feedback across all campuses.</p>
              </div>
              <div className="card step">
                <h3>Governance</h3>
                <p>Director sees pacing and compliance across all branches.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="alt" id="roles">
          <div className="wrap">
            <div className="eyebrow">Built for each role</div>
            <h2>Everyone sees exactly what they need</h2>
            <div className="roles">
              <div className="card">
                <span className="tag">Teacher / Staff</span>
                <h3>Fast, forgiving reporting</h3>
                <p>Weekly curriculum reports submitted directly to the School Director with zero middle gates.</p>
              </div>
              <div className="card">
                <span className="tag">School Director</span>
                <h3>Review &amp; feedback</h3>
                <p>Review all branch reports, provide pedagogical recommendations and apply institutional seal across all campuses.</p>
              </div>
              <div className="card">
                <span className="tag">School Admin</span>
                <h3>Campus &amp; Staff Management</h3>
                <p>Campus facilities, staff provisioning, role allocations and security compliance under NDPA 2023.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="campuses">
          <div className="wrap">
            <div className="eyebrow">Campuses</div>
            <h2>One portal, every campus</h2>
            <div className="camp">
              <div className="card">
                <i></i>
                <div>
                  <b>Attwool College</b>
                  <span>Awoyaya</span>
                </div>
              </div>
              <div className="card">
                <i></i>
                <div>
                  <b>Attwool College</b>
                  <span>Agungi</span>
                </div>
              </div>
              <div className="card">
                <i></i>
                <div>
                  <b>Attwool Sunflower</b>
                  <span>Awoyaya</span>
                </div>
              </div>
              <div className="card">
                <i></i>
                <div>
                  <b>Attwool Sunflower</b>
                  <span>Agungi</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="alt" id="trust">
          <div className="wrap">
            <div className="eyebrow">Trust &amp; safeguarding</div>
            <h2>Confidential by design</h2>
            <p className="sub">
              Sensitive concerns are restricted to authorised leadership, and personal data is handled in line with the Nigeria Data Protection Act 2023.
            </p>
            <div className="qa">
              <b>Ready to submit this week’s report?</b>
              <button
                type="button"
                className="btn p"
                style={{ marginLeft: 'auto' }}
                onClick={() => (currentUser ? onNavigateDashboard?.() : onOpenLogin())}
              >
                {currentUser ? 'Go to workspace →' : 'Staff login →'}
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <span>© 2026 Attwool Schools · Lagos, Nigeria</span>
          <span>powered by Neotro Ltd</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
