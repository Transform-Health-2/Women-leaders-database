import { getInitials } from "../../utils/adminUtils";

export default function NominatedTab({
  nominatedList,
  expandedNominee, setExpandedNominee,
  copiedId,
  handleCopyMessage,
  actionId,
  handleAction,
}) {
  if (nominatedList.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-[4.8rem] mb-4 text-green-400">✓</div>
        <div className="text-lg text-green-600">No pending nominations</div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden border-[1.5px] border-brand-warm-border bg-brand-parchment">
      <div className="flex items-center justify-between px-5 py-3 border-b bg-pink-light border-brand-pink-border">
        <div className="text-[1.4rem] font-semibold text-accent-pink">
          {nominatedList.length} nominations to reach out to
        </div>
        <div className="text-[1.3rem] text-accent-purple">Click a nominee to view details</div>
      </div>

      {nominatedList.map((item) => {
        const isExpanded = expandedNominee === item.id;
        const isCopied = copiedId === item.id;
        return (
          <div key={item.id}>
            <div
              role="button"
              tabIndex={0}
              aria-expanded={isExpanded}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setExpandedNominee(isExpanded ? null : item.id);
                }
              }}
              className={`flex items-center px-5 cursor-pointer transition-colors min-h-[64px] border-b border-brand-warm-row-border ${
                isExpanded ? "bg-brand-warm-row" : "bg-white hover:bg-brand-warm-bg"
              } ${!isExpanded ? "focus-visible:ring-2 focus-visible:ring-brand-pink focus-visible:ring-inset" : ""}`}
              onClick={() => setExpandedNominee(isExpanded ? null : item.id)}
            >
              <div className="flex-shrink-0 mr-4">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-pink" />
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-[1.4rem] font-medium flex-shrink-0 mr-4 bg-pink-light text-accent-pink">
                {getInitials(item.first_name, item.last_name)}
              </div>
              <div className="flex-1 min-w-0 mr-4">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-lg truncate text-brand-dark">
                    {item.first_name} {item.last_name}
                  </span>
                </div>
                <div className="text-[1.4rem] truncate mt-0.5 text-gray-400">
                  Nominated by {item.nominator_name || item.editor_email || "—"}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {item.linkedin && (
                  <a
                    href={item.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[1.3rem] font-medium px-2.5 py-1 rounded-lg bg-brand-blue-tint text-brand-navy hover:bg-blue-50 transition-colors"
                  >
                    LinkedIn ↗
                  </a>
                )}
                <svg
                  width="16" height="16" viewBox="0 0 16 16" fill="none"
                  className={`text-gray-400 transition-transform ${isExpanded ? "rotate-180" : "rotate-0"}`}
                >
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {isExpanded && (
              <div className="px-5 py-4 bg-brand-warm-bg border-b border-brand-warm-border">
                <div className="grid gap-4 mb-4 md:grid-cols-2">
                  <div className="rounded-lg p-4 bg-brand-parchment border border-brand-pink-border">
                    <div className="text-[1.4rem] font-semibold uppercase tracking-wider mb-3 text-accent-pink">Nominator</div>
                    <div className="grid gap-2 text-[1.5rem] text-brand-dark-blue">
                      <div><span className="text-accent-pink font-semibold">Full name: </span>{item.nominator_name || "—"}</div>
                      <div><span className="text-accent-pink font-semibold">Email: </span>{item.editor_email || "—"}</div>
                    </div>
                  </div>
                  <div className="rounded-lg p-4 bg-brand-parchment border border-brand-blue-border">
                    <div className="text-[1.4rem] font-semibold uppercase tracking-wider mb-3 text-brand-navy">Nominee</div>
                    <div className="grid gap-2 text-[1.5rem] text-brand-dark-blue">
                      <div><span className="text-brand-navy font-semibold">Full name: </span>{item.first_name} {item.last_name}</div>
                      <div>
                        <span className="text-brand-navy font-semibold">Profile link: </span>
                        {item.nominate_link ? (
                          <a href={item.nominate_link} target="_blank" rel="noopener noreferrer" className="hover:underline text-brand-navy break-all">
                            {item.nominate_link}
                          </a>
                        ) : "—"}
                      </div>
                    </div>
                  </div>
                </div>

                {handleCopyMessage && (
                  <button
                    onClick={() => handleCopyMessage(item)}
                    className="mb-3 px-4 py-2 text-[1.3rem] font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {isCopied ? "✓ Copied" : "Copy outreach message"}
                  </button>
                )}

                <div className="flex gap-2 mt-4">
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
  );
}
