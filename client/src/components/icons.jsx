import React from "react";

export function LinkedInIcon({ className = "", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <rect width="24" height="24" rx="3" fill="#0A66C2"/>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z" fill="white"/>
    </svg>
  );
}

export function PersonIcon({ className = "", ...props }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#02598E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

export function OrgIcon({ className = "", ...props }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#02598E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  );
}

export function LocationIcon({ className = "", ...props }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#02598E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
