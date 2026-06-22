import React from "react";
import { toTags, val, getMissingFields } from "../../utils/adminUtils";

const PAGE_SIZE = 15;

export default function AllEntries({
  filteredAll,
  allPage, setAllPage,
  selectedAll,
  toggleAllSelect, toggleAllEntries, handleBulkAllEntries,
  setSearchQuery, setFilterRegion, setFilterCountry,
  setFilterExpertise, setFilterClicks, setFilterStatus,
  expandedAllId, setExpandedAllId,
  liveNames,
  enrichEmail, setEnrichEmail,
  enrichSending,
  enrichMsg,
  handleSendEnrichmentLink,
  adminRole,
  handleAction, actionId,
  handleDeleteLeader,
  tableTopRef,
}) {
  return (
    <>
      <div className="rounded-lg overflow-hidden border-[1.5px] border-brand-warm-border bg-brand-parchment">
        {selectedAll.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-b-2 border-brand-navy bg-brand-navy">
            <div className="flex items-center gap-3">
              <div className="text-[1.4rem] font-bold text-white">{selectedAll.length} pending selected</div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filteredAll.filter((r) => r.status === "pending").every((r) => selectedAll.includes(r.id))}
                  onChange={toggleAllEntries}
                  className="w-4 h-4 rounded"
                />
                <span className="text-[1.3rem] font-medium text-amber-800">Select all</span>
              </label>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleBulkAllEntries("approve")} className="px-3 py-1.5 text-[1.3rem] font-semibold rounded-lg bg-green-600 text-white transition-colors">
                Approve {selectedAll.length}
              </button>
              <button onClick={() => handleBulkAllEntries("reject")} className="px-3 py-1.5 text-[1.3rem] font-semibold rounded-lg bg-red-600 text-white transition-colors">
                Reject {selectedAll.length}
              </button>
            </div>
          </div>
        )}

        {filteredAll.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-[4.8rem] mb-4 text-gray-300">—</div>
            <div className="text-lg text-gray-500">No entries match your filters</div>
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterRegion("");
                setFilterCountry("");
                setFilterExpertise("");
                setFilterClicks("");
                setFilterStatus("");
                setAllPage(1);
              }}
              className="mt-3 text-[1.4rem] text-brand-pink font-medium hover:underline cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <table ref={tableTopRef} className="w-full">
              <thead className="border-b-2 border-brand-navy bg-brand-navy">
                <tr>
                  <th className="w-10 px-2 py-3"></th>
                  {[
                    { label: "Name", align: "left" },
                    { label: "Expertise", align: "left" },
                    { label: "LinkedIn Clicks", align: "center" },
                    { label: "Details", align: "center" },
                    { label: "Status", align: "left" },
                    { label: "Date Joined", align: "left" },
                  ].map(({ label, align }) => (
                    <th key={label} className={`text-${align} text-[1.4rem] font-bold uppercase tracking-wider px-5 py-3 text-white`}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ebe0]">
                {filteredAll
                  .slice((allPage - 1) * PAGE_SIZE, allPage * PAGE_SIZE)
                  .map((item) => {
                    const isExpanded = expandedAllId === item.id;
                    const isPending = item.status === "pending";
                    const isDuplicate = isPending && liveNames.has(
                      `${item.first_name?.trim()?.toLowerCase() ?? ""} ${item.last_name?.trim()?.toLowerCase() ?? ""}`
                    );
                    return (
                      <React.Fragment key={item.id}>
                        <tr
                          tabIndex={0}
                          aria-expanded={isExpanded}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setExpandedAllId(isExpanded ? null : item.id);
                            }
                          }}
                          className="transition-colors cursor-pointer bg-transparent hover:bg-brand-warm-row focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink focus-visible:ring-inset"
                          onClick={() => setExpandedAllId(isExpanded ? null : item.id)}
                        >
                          <td className="px-2 py-3.5">
                            {isPending && (
                              <input
                                type="checkbox"
                                checked={selectedAll.includes(item.id)}
                                onChange={(e) => { e.stopPropagation(); toggleAllSelect(item.id); }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-4 h-4 rounded cursor-pointer"
                              />
                            )}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-medium text-brand-dark">{item.first_name} {item.last_name}</span>
                              {isDuplicate && (
                                <span className="flex-shrink-0 text-[1.3rem] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-300">
                                  ⚠ Possible duplicate
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex flex-wrap gap-1">
                              {toTags(item.expertise).slice(0, 3).map((tag, i) => (
                                <span key={i} className="inline-block bg-brand-blue-tint text-brand-navy text-[1.2rem] font-medium px-2 py-0.5 rounded-full border border-brand-blue-border">
                                  {tag}
                                </span>
                              ))}
                              {toTags(item.expertise).length > 3 && (
                                <span className="text-[1.2rem] text-gray-400">+{toTags(item.expertise).length - 3}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-lg text-gray-600 text-center">{item.linkedin_clicks || 0}</td>
                          <td className="px-2 py-3.5 text-center">
                            <button
                              onClick={(e) => { e.stopPropagation(); setExpandedAllId(isExpanded ? null : item.id); }}
                              className="text-[1.2rem] font-medium px-3 py-1.5 rounded-lg transition-colors bg-brand-blue-tint text-brand-navy border border-brand-blue-border hover:bg-blue-100 cursor-pointer"
                            >
                              {isExpanded ? "Hide" : "View"}
                            </button>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`text-[1.3rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                              item.status === "live" ? "bg-green-600 text-white"
                                : item.status === "pending" ? "bg-yellow-500 text-white"
                                : "bg-red-600 text-white"
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-[1.3rem] text-gray-500 whitespace-nowrap">
                            {item.created_at ? new Date(item.created_at).toLocaleDateString() : "—"}
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan="7" className="px-5 py-4 bg-brand-parchment">
                              <div className="flex flex-col gap-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="rounded-lg p-4 bg-white border border-brand-blue-border">
                                    <div className="text-[1.4rem] font-semibold uppercase tracking-wider mb-3 text-brand-navy">Entry details</div>
                                    <div className="space-y-2 text-[1.5rem] text-brand-dark-blue">
                                      <div>
                                        <span className="text-brand-navy font-semibold">Country: </span>
                                        {val(item.country) || <span className="text-gray-400 italic text-[1.3rem]">No country set</span>}
                                      </div>
                                      <div>
                                        <span className="text-brand-navy font-semibold">Expertise: </span>
                                        {toTags(item.expertise).length > 0 ? (
                                          <div className="flex flex-wrap gap-1.5 mt-1">
                                            {toTags(item.expertise).map((tag, i) => (
                                              <span key={i} title={tag} className="inline-block bg-brand-blue-tint text-brand-navy text-[1.3rem] font-medium px-2.5 py-0.5 rounded-full border border-brand-blue-border">
                                                {tag}
                                              </span>
                                            ))}
                                          </div>
                                        ) : <span className="text-gray-400 italic text-[1.3rem]">No expertise tags added</span>}
                                      </div>
                                      <div>
                                        <span className="text-brand-navy font-semibold">LinkedIn: </span>
                                        {val(item.linkedin) ? (
                                          <a href={item.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline text-brand-navy">{item.linkedin}</a>
                                        ) : <span className="text-gray-400 italic text-[1.3rem]">No LinkedIn URL</span>}
                                      </div>
                                      <div>
                                        <span className="text-brand-navy font-semibold">Leader email: </span>
                                        {val(item.leader_email) || <span className="text-gray-400 italic text-[1.3rem]">Not yet collected</span>}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="rounded-lg p-4 bg-white border border-brand-blue-border">
                                    <div className="text-[1.4rem] font-semibold uppercase tracking-wider mb-3 text-brand-navy">Summary</div>
                                    <div className="text-[1.5rem] text-brand-dark-blue leading-[1.7]">
                                      {val(item.bio) || <span className="text-gray-400 italic text-[1.3rem]">No bio provided yet</span>}
                                    </div>
                                  </div>
                                </div>

                                <div className="rounded-lg p-4 bg-white border border-brand-blue-border">
                                  <div className="text-[1.4rem] font-semibold uppercase tracking-wider mb-3 text-brand-navy">Enrich profile</div>
                                  {(() => {
                                    const missing = getMissingFields(item);
                                    return (
                                      <div className="flex flex-col gap-3">
                                        {missing.length > 0 ? (
                                          <div>
                                            <div className="text-[1.3rem] text-amber-800 font-medium mb-2">Missing fields ({missing.length}):</div>
                                            <div className="flex flex-wrap gap-1.5">
                                              {missing.map((f) => (
                                                <span key={f} className="inline-block bg-amber-50 text-amber-700 text-[1.2rem] font-medium px-2.5 py-0.5 rounded-full border border-amber-200">
                                                  {f}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="text-[1.3rem] text-green-700 font-medium">✓ All fields complete</div>
                                        )}
                                        <div className="flex flex-col gap-2">
                                          <div className="flex flex-wrap items-center gap-2">
                                            <input
                                              type="email"
                                              placeholder="Enter leader email to send magic link…"
                                              value={enrichEmail[item.id] || ""}
                                              onChange={(e) => setEnrichEmail((prev) => ({ ...prev, [item.id]: e.target.value }))}
                                              className="flex-1 min-w-[240px] border border-gray-300 rounded-lg px-3 py-2 text-[1.4rem] focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                                            />
                                            <button
                                              onClick={() => handleSendEnrichmentLink(item)}
                                              disabled={enrichSending === item.id || !enrichEmail[item.id]?.trim()}
                                              className="px-4 py-2 text-[1.4rem] font-medium rounded-lg bg-brand-pink text-white hover:bg-brand-pink/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                                            >
                                              {enrichSending === item.id ? "Sending…" : "Send magic link"}
                                            </button>
                                          </div>
                                          {enrichMsg[item.id] && (
                                            <div className={`text-[1.4rem] px-3 py-2 rounded-lg border ${
                                              enrichMsg[item.id].startsWith("✓")
                                                ? "text-green-800 bg-green-50 border-green-200"
                                                : "text-red-800 bg-red-50 border-red-200"
                                            }`}>
                                              {enrichMsg[item.id]}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>

                              <div className="mt-4 flex items-center justify-end gap-3">
                                {adminRole !== "editor" && isPending && (
                                  <>
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
                                  </>
                                )}
                                {adminRole !== "editor" && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteLeader(item.id, `${item.first_name} ${item.last_name}`); }}
                                    className="text-[1.3rem] font-medium text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 py-1.5 rounded-lg transition-colors"
                                  >
                                    Delete entry
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
              </tbody>
            </table>
          </>
        )}
      </div>

      {filteredAll.length > PAGE_SIZE && (
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-brand-warm-border flex-wrap justify-center">
          <button
            onClick={() => { setAllPage((p) => Math.max(1, p - 1)); tableTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
            disabled={allPage === 1}
            className="px-3 py-1.5 border border-gray-300 rounded text-[1.4rem] font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors hover:border-gray-400"
          >
            ← Prev
          </button>
          {Array.from({ length: Math.ceil(filteredAll.length / PAGE_SIZE) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => { setAllPage(i + 1); tableTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
              className={`px-3 py-1.5 border rounded text-[1.4rem] font-medium transition-colors ${
                allPage === i + 1
                  ? "bg-brand-navy text-white border-brand-navy"
                  : "bg-brand-parchment text-brand-dark border-gray-300 hover:border-gray-400"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => { setAllPage((p) => Math.min(Math.ceil(filteredAll.length / PAGE_SIZE), p + 1)); tableTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
            disabled={allPage === Math.ceil(filteredAll.length / PAGE_SIZE)}
            className="px-3 py-1.5 border border-gray-300 rounded text-[1.4rem] font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors hover:border-gray-400"
          >
            Next →
          </button>
        </div>
      )}
    </>
  );
}
