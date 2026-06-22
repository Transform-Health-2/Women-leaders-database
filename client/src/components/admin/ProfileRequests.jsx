import { getInitials, toTags } from "../../utils/adminUtils";

export default function ProfileRequests({
  pending,
  expandedId, setExpandedId,
  actionId,
  handleAction,
}) {
  if (pending.length === 0) {
    return (
      <div className="rounded-lg overflow-hidden border-2 border-brand-navy bg-white">
        <div className="text-center py-20">
          <div className="text-[4.8rem] mb-4 text-green-400">✓</div>
          <div className="text-lg text-green-600">No new submissions</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden border-2 border-brand-navy bg-white">
      <div className="rounded-lg overflow-hidden border-[1.5px] border-brand-warm-border bg-brand-parchment">
        <div className="flex items-center justify-between px-5 py-3 border-b-2 border-brand-navy bg-brand-navy">
          <div className="text-[1.4rem] font-bold text-white">{pending.length} pending submission(s)</div>
        </div>
        {pending.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div key={item.id}>
              <div
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setExpandedId(isExpanded ? null : item.id);
                  }
                }}
                className={`flex items-center px-5 cursor-pointer transition-colors min-h-[64px] border-b border-brand-warm-row-border ${
                  isExpanded ? "bg-brand-warm-row" : "bg-white hover:bg-brand-warm-bg"
                } ${!isExpanded ? "focus-visible:ring-2 focus-visible:ring-brand-pink focus-visible:ring-inset" : ""}`}
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
              >
                <div className="flex-shrink-0 mr-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[1.4rem] font-medium flex-shrink-0 mr-4 bg-brand-blue-tint text-brand-navy">
                  {getInitials(item.first_name, item.last_name)}
                </div>
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-lg truncate text-brand-dark">{item.first_name} {item.last_name}</span>
                    <span className="text-[1.4rem] truncate text-gray-500">{item.role}</span>
                  </div>
                  <div className="text-[1.4rem] truncate mt-0.5 text-gray-400">{item.organisation}</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                  className={`text-gray-400 transition-transform ${isExpanded ? "rotate-180" : "rotate-0"}`}
                >
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {isExpanded && (
                <div className="px-5 py-4 bg-brand-warm-bg border-b border-brand-warm-border">
                  <div className="grid gap-4 mb-4 md:grid-cols-2">
                    <div className="rounded-lg p-4 bg-white border border-brand-blue-border">
                      <div className="text-[1.4rem] font-semibold uppercase tracking-wider mb-2 text-brand-navy">Personal</div>
                      <div className="grid gap-2 text-[1.5rem] text-brand-dark-blue">
                        <div><span className="text-brand-navy font-semibold">Email: </span>{item.editor_email || item.email || "—"}</div>
                        <div><span className="text-brand-navy font-semibold">Role: </span>{item.role || "—"}</div>
                        <div><span className="text-brand-navy font-semibold">Organisation: </span>{item.organisation || "—"}</div>
                        <div><span className="text-brand-navy font-semibold">Country: </span>{item.country || "—"}</div>
                        <div><span className="text-brand-navy font-semibold">Experience: </span>{item.years_experience || item.yearsExp || "—"}</div>
                        <div><span className="text-brand-navy font-semibold">Geo scope: </span>{item.geo_scope || "—"}</div>
                        <div><span className="text-brand-navy font-semibold">Works across: </span>{item.countries || "—"}</div>
                        <div>
                          <span className="text-brand-navy font-semibold">Submitted: </span>
                          {item.created_at ? new Date(item.created_at).toLocaleString() : "—"}
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg p-4 bg-white border border-brand-blue-border">
                      <div className="text-[1.4rem] font-semibold uppercase tracking-wider mb-2 text-brand-navy">Expertise</div>
                      <div className="mb-3">
                        {toTags(item.expertise).length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {toTags(item.expertise).map((tag, i) => (
                              <span key={i} title={tag} className="inline-block bg-brand-blue-tint text-brand-navy text-[1.3rem] font-medium px-2.5 py-0.5 rounded-full border border-brand-blue-border">
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : "—"}
                      </div>
                      <div className="text-[1.4rem] font-semibold uppercase tracking-wider mb-2 text-brand-navy">LinkedIn</div>
                      <div className="mb-3 text-[1.5rem]">
                        {item.linkedin ? (
                          <a href={item.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline text-brand-navy break-all">
                            {item.linkedin}
                          </a>
                        ) : "—"}
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 mb-4 md:grid-cols-2">
                    <div className="rounded-lg p-4 bg-white border border-brand-blue-border">
                      <div className="text-[1.4rem] font-semibold uppercase tracking-wider mb-2 text-brand-navy">Bio</div>
                      <div className="text-[1.5rem] text-brand-dark-blue leading-[1.7] break-words">{item.bio || "—"}</div>
                    </div>
                    <div className="rounded-lg p-4 bg-white border border-brand-blue-border">
                      <div className="text-[1.4rem] font-semibold uppercase tracking-wider mb-2 text-brand-navy">Notable items</div>
                      {(() => {
                        const raw = item.notable_items || item.notableItems;
                        const items = Array.isArray(raw)
                          ? raw
                          : typeof raw === "string"
                            ? (() => { try { return JSON.parse(raw); } catch { return []; } })()
                            : [];
                        return items.length > 0 ? (
                          <div className="flex flex-col gap-2">
                            {items.map((ni, i) => (
                              <div key={i} className="text-[1.5rem] text-brand-dark-blue">
                                <span className="font-semibold">{ni.title || "—"}</span>
                                {ni.type && <span className="text-gray-500"> ({ni.type})</span>}
                                {ni.link && (
                                  <span> — <a href={ni.link} target="_blank" rel="noopener noreferrer" className="hover:underline text-brand-navy break-all">{ni.link}</a></span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : "—";
                      })()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(item.id, "approve")}
                      disabled={actionId === item.id}
                      className="px-4 py-2 text-[1.4rem] font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {actionId === item.id ? "..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleAction(item.id, "reject")}
                      disabled={actionId === item.id}
                      className="px-4 py-2 text-[1.4rem] font-medium rounded-lg border-[1.5px] border-red-400 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
