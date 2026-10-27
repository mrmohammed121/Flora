import React, { useEffect } from 'react';
import { X, Award, ExternalLink } from 'lucide-react';

export default function TeamModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const teamMembers = [
    {
      name: 'Mohammed',
      usn: '1IC24CS028',
      role: 'FULL STACK DEVELOPER',
      sub: 'PyTorch & OpenCV HSV Segmentation',
      bio: 'Implemented MobileNetV2 transfer learning, model quantization, and OpenCV HSV lesion thresholding pipelines.',
      avatarInitials: 'MD',
      gradient: 'from-emerald-500 to-teal-700',
      badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/30',
      linkedin: 'https://linkedin.com',
      github: 'https://github.com'
    },
    {
      name: 'Abhishek',
      usn: '1IC24CS001',
      role: 'GRAPHIC Designer',
      sub: 'UI/UX & Visual Asset Design',
      bio: 'Designed visual branding, intuitive interface layout aesthetics, bespoke icons, and digital presentation graphics.',
      avatarInitials: 'AB',
      gradient: 'from-blue-500 to-indigo-700',
      badgeColor: 'text-blue-400 bg-blue-950/80 border-blue-500/30',
      linkedin: 'https://linkedin.com',
      github: 'https://github.com'
    },
    {
      name: 'Lingaraja B',
      usn: '1IC24CS024',
      role: 'Structure Designer',
      sub: 'Responsive Design & Canvas Studio',
      bio: 'Architected responsive grid structures, interactive canvas studio layouts, and cross-platform component styling.',
      avatarInitials: 'LB',
      gradient: 'from-purple-500 to-pink-700',
      badgeColor: 'text-purple-400 bg-purple-950/80 border-purple-500/30',
      linkedin: 'https://linkedin.com',
      github: 'https://github.com'
    },
    {
      name: 'Sathish Kumar R',
      usn: '1IC24CS043',
      role: 'TESTER',
      sub: 'Quality Assurance & System Validation',
      bio: 'Testing the works which is completely working or not with different ways, edge-case pathology checks, and test scenarios.',
      avatarInitials: 'SK',
      gradient: 'from-amber-500 to-orange-700',
      badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-500/30',
      linkedin: 'https://linkedin.com',
      github: 'https://github.com'
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="team-modal-title"
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-scale-up text-slate-800 dark:text-slate-100 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30 mb-1.5">
              ⭐ Academic Mini-Project Showcase
            </span>
            <h2 id="team-modal-title" className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Our Team & Mentorship
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Department of Computer Science & Engineering • Academic Year 2025–2026
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close Team Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-600 dark:text-slate-300 text-sm">
          
          {/* Team Name Banner */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">Project Team</span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">AgriVision Innovators</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pioneering accessible deep learning for resilient agricultural pathology.</p>
            </div>
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Mini-Project Batch 2026
            </span>
          </div>

          {/* Project Mentor Card (Prominently Highlighted) */}
          <div className="relative p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-50 via-slate-50 to-emerald-50/40 dark:from-amber-950/30 dark:via-slate-850 dark:to-emerald-950/30 border-2 border-amber-500/70 shadow-lg shadow-amber-500/10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider mb-4 shadow-sm">
              <Award className="w-4 h-4" />
              <span>Project Mentor & Subject Matter Expert</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 p-1 shadow-md shadow-amber-500/20">
                  <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-3xl">
                    👨‍🏫
                  </div>
                </div>
                <span className="mt-2 text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-500/40 px-2 py-0.5 rounded-full">
                  Faculty Guide
                </span>
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-1">
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">VIJENDRA S N</h4>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Assistant Professor</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2.5">
                  Department of Computer Science & Engineering, VTU
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  Dedicated academic mentorship and applied research in Embedded Systems, Deep Neural Networks, and Computer Networks. Supervised system design, model verification, and agronomic pathology workflows for the FloraScan AI platform.
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">Embedded System</span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">Deep Neural Networks</span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">Computer network</span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">Project Mentor</span>
                </div>
              </div>
            </div>
          </div>

          {/* Team Members Grid (4 cards) */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Team Members
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-emerald-500/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex gap-4"
                >
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${member.gradient} flex items-center justify-center font-extrabold text-white text-base shadow-md`}>
                      {member.avatarInitials}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h5 className="font-bold text-slate-900 dark:text-white text-sm">{member.name}</h5>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${member.badgeColor}`}>
                        {member.usn}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-0.5">{member.role}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">{member.sub}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal mb-3">{member.bio}</p>

                    <div className="flex gap-2">
                      {member.linkedin ? (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded bg-slate-200 dark:bg-slate-700/70 hover:bg-blue-600 text-slate-700 dark:text-slate-300 hover:text-white transition-colors"
                          title="LinkedIn Profile"
                          aria-label={`${member.name} LinkedIn Profile`}
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        </a>
                      ) : null}
                      {member.github ? (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded bg-slate-200 dark:bg-slate-700/70 hover:bg-slate-600 text-slate-700 dark:text-slate-300 hover:text-white transition-colors"
                          title="GitHub Profile"
                          aria-label={`${member.name} GitHub Profile`}
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Close Showcase
          </button>
        </div>
      </div>
    </div>
  );
}
