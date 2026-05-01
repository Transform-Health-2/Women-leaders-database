import React from "react";

function TBC() {
  return <span className="italic text-gray-400">TBC</span>;
}

function getInitials(first, last) {
  return ((first?.[0] || "") + (last?.[0] || "")).toUpperCase();
}

const PersonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#02598E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const OrgIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#02598E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
    <path d="M10.5 5.5C11.563 5.5 12.583 5.921 13.334 6.672C14.085 7.423 14.5 8.437 14.5 9.5V14H12.5V9.5C12.5 8.97 12.289 8.461 11.914 8.086C11.539 7.711 11.03 7.5 10.5 7.5C9.97 7.5 9.461 7.711 9.086 8.086C8.711 8.461 8.5 8.97 8.5 9.5V14H6.5V9.5C6.5 8.437 6.915 7.423 7.666 6.672C8.417 5.921 9.437 5.5 10.5 5.5Z" stroke="#0A66C2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.5 5.5V14" stroke="#0A66C2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.5 3.5C3.5 3.897 3.342 4.269 3.061 4.561C2.78 4.853 2.398 5.011 2 5.011C1.602 5.011 1.22 4.853 0.939 4.561C0.658 4.269 0.5 3.897 0.5 3.5C0.5 3.103 0.658 2.731 0.939 2.439C1.22 2.147 1.602 1.989 2 1.989C2.398 1.989 2.78 2.147 3.061 2.439C3.342 2.731 3.5 3.103 3.5 3.5Z" stroke="#0A66C2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function MetaRow({ label, children }) {
  return (
    <>
      <div className="text-[1.2rem] font-medium text-gray-600 uppercase tracking-wide">{label}</div>
      <div className="text-gray-800 text-[1.4rem]">{children}</div>
    </>
  );
}

/**
 * ProfileModal — full-detail overlay for a selected leader.
 * Rendered at the page level; separate from LeaderCard.
 */
export default function ProfileModal({ leader, onClose, onManage }) {
  if (!leader) return null;

  const isFeatured = leader.featured === true || leader.featured === "true";

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[1000] flex items-start justify-center overflow-y-auto py-10 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-2xl w-full p-6 relative max-h-[calc(100vh-4rem)] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-[2rem] leading-none"
          aria-label="Close profile"
        >
          ✕
        </button>

        {/* Header — photo + name + role */}
        <div className="flex items-start gap-5 mb-6">
          <div className="flex-shrink-0">
            {leader.photo_url ? (
              <img
                src={leader.photo_url}
                alt={`${leader.first_name} ${leader.last_name}`}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-[2rem] font-semibold text-gray-700">
                {getInitials(leader.first_name, leader.last_name)}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {isFeatured && (
              <span className="text-[1.2rem] font-medium bg-gray-800 text-white px-2 py-0.5 rounded-full mb-2 inline-block">
                ★ Featured
              </span>
            )}
            <h2 className="text-[2rem] font-semibold text-gray-900 flex items-center gap-2">
              {leader.first_name} {leader.last_name}
              {leader.linkedin?.trim() && (
                <a href={leader.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn Profile" className="inline-flex">
                  <LinkedInIcon />
                </a>
              )}
            </h2>
            <p className="text-[1.4rem] text-gray-800 mt-1 flex items-center gap-2">
              <PersonIcon />
              <span>{leader.role || <TBC />}</span>
            </p>
            <p className="text-[1.4rem] text-gray-700 mt-0.5 flex items-center gap-2">
              <OrgIcon />
              <span>{leader.organisation || <TBC />}</span>
            </p>
          </div>
        </div>

        {/* Key facts grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6">
          <MetaRow label="Years of experience">{leader.yearsExp || <TBC />}</MetaRow>
          <MetaRow label="Country of residence">{leader.country || <TBC />}</MetaRow>
          <MetaRow label="Countries of operation">{leader.selectedCountries || <TBC />}</MetaRow>
          <MetaRow label="LinkedIn">
            {leader.linkedin ? (
              <a href={leader.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                View profile →
              </a>
            ) : (
              <TBC />
            )}
          </MetaRow>
        </div>

        {/* Bio */}
        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="text-[1.2rem] font-medium text-gray-600 uppercase tracking-wide mb-2">Bio</div>
          {leader.bio ? (
            <p className="text-gray-800 leading-relaxed text-[1.6rem]">{leader.bio}</p>
          ) : (
            <TBC />
          )}
        </div>

        {/* Expertise */}
        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="text-[1.2rem] font-medium text-gray-600 uppercase tracking-wide mb-2">Expertise</div>
          {leader.expertise ? (
            <div className="flex flex-wrap gap-1">
              {leader.expertise.split(", ").map((tag) => (
                <span key={tag} className="text-[1.4rem] bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <TBC />
          )}
        </div>

        {/* Notable achievements */}
        {leader.notableItems?.length > 0 && (
          <div className="border-t border-gray-200 pt-4 mb-4">
            <div className="text-[1.2rem] font-medium text-gray-600 uppercase tracking-wide mb-2">
              Notable achievements
            </div>
            <div className="space-y-2">
              {leader.notableItems.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-[1.6rem]">
                  <span className="text-[1.2rem] font-semibold text-gray-600 mt-0.5 w-5">{i + 1}.</span>
                  <div className="flex-1">
                    <div className="text-gray-900 font-medium">
                      {item.link ? (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {item.title}
                        </a>
                      ) : (
                        item.title
                      )}
                    </div>
                    {item.type && <span className="text-[1.2rem] text-gray-600">{item.type}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manage CTA */}
        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <p className="text-[1.4rem] text-gray-600 mb-2">Is this you?</p>
          <button
            onClick={() => { onClose(); onManage(leader); }}
            className="w-full px-4 py-2 border border-gray-300 text-gray-800 text-[1.6rem] font-medium rounded-full hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            Update or remove my profile
          </button>
        </div>
      </div>
    </div>
  );
}
