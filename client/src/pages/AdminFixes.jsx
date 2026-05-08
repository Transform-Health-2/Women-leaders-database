import React, { useState } from "react";

const VARIANTS = {
  critical: "bg-red-50 text-red-700 border-red-200",
  important: "bg-amber-50 text-amber-700 border-amber-200",
  "nice-to-have": "bg-gray-50 text-gray-600 border-gray-200",
};

function PriorityBadge({ label, variant }) {
  return (
    <span className={`inline-block text-[1.1rem] font-bold px-2.5 py-0.5 rounded-full border ${VARIANTS[variant] || VARIANTS["nice-to-have"]}`}>
      {label}
    </span>
  );
}

function H3({ children }) {
  return <h3 className="text-[1.7rem] font-semibold text-brand-dark mt-8 mb-3">{children}</h3>;
}

function H4({ children }) {
  return <h4 className="text-[1.5rem] font-semibold text-brand-navy mt-6 mb-2">{children}</h4>;
}

function P({ children }) {
  return <p className="text-[1.5rem] text-gray-700 leading-[1.8] mb-3">{children}</p>;
}

function Li({ children }) {
  return <li className="text-[1.5rem] text-gray-700 leading-[1.8] mb-1.5">{children}</li>;
}

function Ul({ children }) {
  return <ul className="list-disc list-outside ml-6 mb-5">{children}</ul>;
}

function Ol({ children }) {
  return <ol className="list-decimal list-outside ml-6 mb-5">{children}</ol>;
}

function Code({ children }) {
  return <code className="bg-gray-100 text-brand-navy text-[1.3rem] px-1.5 py-0.5 rounded font-mono">{children}</code>;
}

function Note({ children }) {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg px-5 py-3 mb-5">
      <p className="text-[1.4rem] text-amber-800 leading-[1.7] m-0">{children}</p>
    </div>
  );
}

function FixItem({ checked, children }) {
  return (
    <li className="flex items-start gap-3 mb-1.5">
      <span className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded border-2 flex items-center justify-center text-[1.2rem] font-bold ${
        checked ? "bg-green-500 border-green-500 text-white" : "border-gray-300 bg-white"
      }`}>
        {checked ? "✓" : ""}
      </span>
      <span className="text-[1.5rem] text-gray-700 leading-[1.7]">{children}</span>
    </li>
  );
}

function Meta({ reported, files, status }) {
  return (
    <div className="text-[1.3rem] text-gray-500 leading-[1.7] mt-2 mb-4 flex flex-wrap gap-x-4 gap-y-1">
      {reported && <span><strong className="text-gray-600">Reported by:</strong> {reported}</span>}
      {files && <span><strong className="text-gray-600">Files:</strong> {files}</span>}
      <span><strong className="text-gray-600">Status:</strong> {status}</span>
    </div>
  );
}

function SectionTable({ headers, rows }) {
  return (
    <div className="overflow-x-auto mb-6">
      <table className="w-full text-[1.4rem] border-collapse">
        <thead>
          <tr className="bg-brand-blue-tint">
            {headers.map((h) => (
              <th key={h} className="text-left px-4 py-2.5 font-semibold text-brand-navy border border-gray-200">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2 border border-gray-200 text-gray-700 leading-[1.6]">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const SECTIONS = [
  {
    id: "overview",
    label: "Overview",
    content: (
      <>
        <div className="mb-6">
          <p className="text-[1.5rem] text-gray-500 italic mb-4">
            Generated from QA testing (3 testers, 111 results). Items ordered by priority.
          </p>
          <Note>All 15 items have been fixed and verified in the codebase. Use this page as a reference for what was addressed in the latest deployment.</Note>
        </div>
        <H4>How to use</H4>
        <Ol>
          <Li>Each item was worked top to bottom by priority</Li>
          <Li>Each fix was verified in the source code</Li>
          <Li>Re-test using the <a href="./testing-sheet.html" target="_blank" rel="noopener noreferrer" className="text-brand-navy underline">Testing Sheet</a></Li>
          <Li>Update test status from Fail → Pass in the sheet</Li>
        </Ol>
        <P className="text-[1.3rem] text-gray-400 !mb-0"><em>Last updated: May 2026</em></P>
      </>
    ),
  },
  {
    id: "critical",
    label: "🔴 Critical (5)",
    content: (
      <>
        <H3>1. Manage Profile link not active on profile cards</H3>
        <Ul>
          <FixItem checked>Fix the "Manage or remove profile" link/button on profile cards</FixItem>
          <FixItem checked>Verify clicking opens the Manage Profile modal</FixItem>
          <FixItem checked>Verify modal loads with correct leader data</FixItem>
        </Ul>
        <Meta reported="Ndifanji" files="ProfileModal.jsx:213, ManageProfile.jsx" status="✅ Fixed" />

        <H3>2. Photo upload not enforced as mandatory</H3>
        <Ul>
          <FixItem checked>Step 2 Continue button now requires photo (<Code>!photoPreview</Code> added to disabled check)</FixItem>
          <FixItem checked>Removed <Code>!photo</Code> from step3Invalid (enforced on Step 2 instead)</FixItem>
          <FixItem checked>Upload area border turns green when photo added</FixItem>
        </Ul>
        <Meta reported="Gefiune" files="SubmitSteps.jsx:311-327, SubmitSteps.jsx:354, Submit.jsx:156" status="✅ Fixed" />

        <H3>3. Bio char count warning shows but doesn't block Next</H3>
        <Ul>
          <FixItem checked>Next button was already functionally disabled (native <Code>{'<button disabled>'}</Code>) but lacked visual disabled styling</FixItem>
          <FixItem checked>Added <Code>opacity-40 cursor-not-allowed</Code> to Button component so disabled state is visible</FixItem>
          <FixItem checked>Inline error message was already rendering correctly</FixItem>
        </Ul>
        <Meta reported="Gefiune" files="Submit.jsx:156, SubmitSteps.jsx:478, Button.jsx" status="✅ Fixed (Button visual disabled styling)" />

        <H3>4. Consent decline — no clear termination workflow</H3>
        <Ul>
          <FixItem checked>"No I do not consent" now immediately shows the termination modal (no extra Continue click)</FixItem>
          <FixItem checked>Separated <Code>handleNoConsent</Code> from <Code>handleConsent</Code> — "No" button calls it directly</FixItem>
        </Ul>
        <Meta reported="Gefiune" files="SubmitSteps.jsx, Submit.jsx" status="✅ Fixed" />

        <H3>5. "Global" scope option missing from Geographical scope dropdown</H3>
        <Ul>
          <FixItem checked>Added "Global" as first option in <Code>GEO_SCOPES</Code> array</FixItem>
          <FixItem checked>Added <Code>geo_scope</Code> mapping to <Code>submitProfile()</Code> API call (was silently dropped)</FixItem>
          <FixItem checked>Created migration <Code>scripts/add-geo-scope-column.sql</Code> — run in Supabase SQL Editor to add the column</FixItem>
          <FixItem checked>Admin expanded view already displays <Code>geo_scope</Code> field</FixItem>
        </Ul>
        <Meta reported="Ndifanji" files="SubmitSteps.jsx:32-39, leaders.js:32" status="✅ Fixed" />
      </>
    ),
  },
  {
    id: "important",
    label: "🟠 Important (6)",
    content: (
      <>
        <H3>6. geo_scope field not persisting to database</H3>
        <Ul>
          <FixItem checked>Added <Code>geo_scope</Code> mapping to <Code>submitProfile()</Code> API call</FixItem>
          <FixItem checked>Column created in Supabase (migration run)</FixItem>
          <FixItem checked>Admin expanded view already displays the field</FixItem>
        </Ul>
        <Meta reported="Gefiune" files="Submit.jsx:138 → leaders.js:17-41" status="✅ Fixed" />

        <H3>7. Region/country filters show wrong leader counts</H3>
        <Ul>
          <FixItem checked>Backfill <Code>country</Code> field for all leaders with missing data — script run in Supabase SQL Editor</FixItem>
          <FixItem checked>Expand <Code>COUNTRY_TO_CONTINENT</Code> mapping to 130+ countries (all UN members + dependencies)</FixItem>
          <FixItem checked>Expand <Code>COUNTRY_TO_REGION</Code> mapping to cover all African countries</FixItem>
          <FixItem checked><Code>COUNTRIES</Code> array in SubmitSteps.jsx now imports from <Code>ALL_COUNTRIES</Code> in countries.js (single source of truth)</FixItem>
        </Ul>
        <Meta reported="Ndifanji, Gefiune" files="countries.js, useLeaders.js:49-50, SubmitSteps.jsx:25-30" status="✅ Fixed" />

        <H3>8. Country dropdown missing options</H3>
        <Ul>
          <FixItem checked><Code>COUNTRIES</Code> now re-exports <Code>ALL_COUNTRIES</Code> from <Code>countries.js</Code> (130+ countries)</FixItem>
          <FixItem checked>Single source of truth — SubmitSteps.jsx, Database.jsx, and useLeaders all use the same list</FixItem>
          <FixItem checked><Code>Database.jsx</Code> no longer has its own <Code>const ALL_COUNTRIES = ...</Code> (imported from countries.js)</FixItem>
        </Ul>
        <Meta reported="Ndifanji" files="countries.js, SubmitSteps.jsx:25-30, Database.jsx:26" status="✅ Fixed" />

        <H3>9. LinkedIn links returning "does not exist"</H3>
        <Ul>
          <FixItem checked>Audited LinkedIn URLs across all 81 leaders</FixItem>
          <FixItem checked>Backfilled all missing LinkedIn URLs (31 leaders previously had empty <Code>linkedin</Code> field)</FixItem>
          <FixItem checked>All 82 records updated in Supabase via <Code>scripts/backfill-linkedin.mjs</Code></FixItem>
          <FixItem checked>Verify LinkedIn icon styling — icon now uses <Code>currentColor</Code>; badge on card shows white icon on navy, modal shows LinkedIn blue on white</FixItem>
        </Ul>
        <Meta reported="Ndifanji, Danielle Mullings" files="ProfileModal.jsx:109-122, icons.jsx:3-11" status="✅ Fixed" />

        <H3>10. Admin pending count badge shows 4 but only 1 visible</H3>
        <Ul>
          <FixItem checked>Badge now shows filtered count when search/country/expertise filters are active on the pending tab</FixItem>
          <FixItem checked>When no filters are applied, badge shows total unfiltered pending count</FixItem>
        </Ul>
        <Meta reported="Ndifanji" files="Admin.jsx" status="✅ Fixed" />

        <H3>11. Amber duplicate badge not showing on pending submissions</H3>
        <Ul>
          <FixItem checked><Code>branch</Code> column now included in <Code>getLeaders("all")</Code> select — nominated tab now populates correctly</FixItem>
          <FixItem checked>Name matching now trims whitespace on both sides (<Code>liveNames</Code> set + <Code>isDuplicate</Code> check)</FixItem>
          <FixItem checked>Admin fetch also now includes <Code>leader_email</Code>, <Code>geo_scope</Code>, <Code>nominator_name</Code> columns</FixItem>
        </Ul>
        <Meta reported="Ndifanji" files="Admin.jsx, leaders.js" status="✅ Fixed" />
      </>
    ),
  },
  {
    id: "nice-to-have",
    label: "⚪ Nice to Have (4)",
    content: (
      <>
        <H3>12. Publications tab shows "None" for all leaders</H3>
        <Ul>
          <FixItem checked>Publications section is now hidden entirely when <Code>notable_items</Code> is empty</FixItem>
          <FixItem checked>Section only renders when a leader has at least one publication</FixItem>
        </Ul>
        <Meta reported="Ndifanji" files="ProfileModal.jsx" status="✅ Fixed" />

        <H3>13. Wrap text for About field overflows card</H3>
        <Ul>
          <FixItem checked>Added <Code>break-words</Code> (<Code>overflow-wrap: break-word</Code>) to bio paragraph in profile modal</FixItem>
        </Ul>
        <Meta reported="Danielle Mullings" files="ProfileModal.jsx" status="✅ Fixed" />

        <H3>14. Profile modal shows empty sections for leaders with sparse data</H3>
        <Ul>
          <FixItem checked>Role, organisation — hidden when empty</FixItem>
          <FixItem checked>Meta strip (Based in / Experience / Works across) — each item hidden individually; entire strip hidden when all three are empty</FixItem>
          <FixItem checked>Expertise section — hidden when no tags</FixItem>
          <FixItem checked>About section — hidden when no bio</FixItem>
          <FixItem checked>Publications section — already hidden when empty (item 12)</FixItem>
        </Ul>
        <Meta files="ProfileModal.jsx" status="✅ Fixed" />

        <H3>15. Admin expertise field concatenates array items with no separator</H3>
        <Ul>
          <FixItem checked>Expertise now rendered as individual pill tags using <Code>toTags()</Code> in both pending and all-entries expanded views</FixItem>
          <FixItem checked>"Other: ..." entries display as their own pill, no longer run together with previous tags</FixItem>
        </Ul>
        <Meta files="Admin.jsx" status="✅ Fixed" />
      </>
    ),
  },
  {
    id: "progress",
    label: "📊 Progress",
    content: (
      <>
        <P>Section-level pass/fail/pending breakdown from QA testing:</P>
        <SectionTable
          headers={["Section", "Pass", "Fail", "Pending", "Total", "% Done"]}
          rows={[
            ["Setup Check",         "5", "1", "0", "6", "83%"],
            ["Directory",           "10", "3", "1", "14", "71%"],
            ["Analytics",            "2", "3", "3", "8", "25%"],
            ["Submit & Nominate",   "11", "5", "9", "25", "44%"],
            ["Manage Profile",       "0", "5", "3", "8", "0%"],
            ["Admin Console",        "3", "1", "4", "8", "38%"],
          ]}
        />
        <Note>Progress is based on all 111 test results from 3 testers. Re-testing after fixes should improve these numbers.</Note>
      </>
    ),
  },
];

export default function AdminFixes() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);

  const activeIndex = SECTIONS.findIndex((s) => s.id === activeId);
  const activeSection = SECTIONS[activeIndex];
  const prev = SECTIONS[activeIndex - 1] ?? null;
  const next = SECTIONS[activeIndex + 1] ?? null;

  return (
    <div className="flex h-full overflow-hidden bg-white">
      <nav className="flex flex-col w-[200px] xl:w-[220px] flex-shrink-0 border-r border-gray-200 bg-brand-parchment overflow-y-auto py-6 px-3 gap-0.5">
        <p className="text-[1.1rem] uppercase tracking-widest text-gray-400 font-semibold mb-3 px-2">
          Sections
        </p>
        {SECTIONS.map((s) => {
          const isActive = s.id === activeId;
          return (
            <button
              key={s.id}
              onClick={() => setActiveId(s.id)}
              className={`text-left text-[1.3rem] px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                isActive
                  ? "bg-brand-navy text-white font-semibold"
                  : "text-gray-600 hover:bg-gray-100 hover:text-brand-navy"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </nav>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-10 py-8">
          {activeSection.content}
        </div>

        <div className="flex-shrink-0 flex items-center justify-between px-10 py-4 border-t border-gray-100 bg-brand-parchment">
          {prev ? (
            <button
              onClick={() => setActiveId(prev.id)}
              className="flex items-center gap-2 text-[1.4rem] font-medium text-gray-600 hover:text-brand-navy transition-colors cursor-pointer"
            >
              ← {prev.label}
            </button>
          ) : <span />}
          {next ? (
            <button
              onClick={() => setActiveId(next.id)}
              className="flex items-center gap-2 text-[1.4rem] font-medium text-gray-600 hover:text-brand-navy transition-colors cursor-pointer"
            >
              {next.label} →
            </button>
          ) : (
            <span className="text-[1.4rem] text-gray-400 italic">End of checklist</span>
          )}
        </div>
      </div>
    </div>
  );
}
