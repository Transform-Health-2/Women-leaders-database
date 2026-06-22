import { getInitials } from "../../utils/adminUtils";

export default function ActivityLog({
  filteredActivityLog,
  activityLog,
  activityFilter, setActivityFilter,
  activitySearch, setActivitySearch,
  activityDateRange, setActivityDateRange,
  activityDateFrom, setActivityDateFrom,
  activityDateTo, setActivityDateTo,
}) {
  if (filteredActivityLog.length === 0 && activityLog.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-[4.8rem] mb-4 text-gray-300">—</div>
        <div className="text-lg text-gray-500">No self-service activity yet</div>
        <div className="text-[1.4rem] text-gray-400 mt-2">
          Updates and deletions by leaders will appear here
        </div>
      </div>
    );
  }

  if (filteredActivityLog.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-[4.8rem] mb-4 text-gray-300">—</div>
        <div className="text-lg text-gray-500">No results match the current filters</div>
        <button
          onClick={() => {
            setActivityFilter("all");
            setActivitySearch("");
            setActivityDateRange("all");
            setActivityDateFrom("");
            setActivityDateTo("");
          }}
          className="mt-3 text-[1.4rem] text-brand-pink font-medium hover:underline cursor-pointer"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden border-[1.5px] border-brand-blue-border bg-white">
      <div className="flex items-center justify-between px-5 py-3 border-b-2 border-brand-navy bg-brand-navy">
        <div className="text-[1.4rem] font-bold text-white">Self-service activity log</div>
        <div className="text-[1.3rem] text-gray-300">{filteredActivityLog.length} event(s)</div>
      </div>
      <div className="divide-y divide-brand-warm-row-border">
        {filteredActivityLog.map((entry) => {
          const isDelete = entry.request_type === "delete";
          return (
            <div key={entry.id} className="px-5 py-4 bg-white hover:bg-brand-warm-bg transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[1.4rem] font-medium flex-shrink-0 ${
                  isDelete ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                }`}>
                  {getInitials(entry.first_name, entry.last_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg text-brand-dark">
                      {entry.first_name} {entry.last_name}
                    </span>
                    <span className={`text-[1.2rem] font-semibold px-2 py-0.5 rounded-full ${
                      isDelete ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {isDelete ? "Deleted" : "Updated"}
                    </span>
                  </div>
                  <div className="text-[1.3rem] text-gray-400 mt-0.5">
                    {entry.created_at ? new Date(entry.created_at).toLocaleString() : "—"}
                  </div>
                </div>
              </div>
              {isDelete && entry.changes && (
                <div className="mt-3 ml-14 rounded-lg p-3 bg-red-50 border border-red-200">
                  <div className="text-[1.2rem] font-semibold uppercase tracking-wider mb-1 text-gray-500">Reason</div>
                  <p className="text-[1.3rem] text-brand-dark-blue">{entry.changes}</p>
                </div>
              )}
              {!isDelete && entry.changes && (
                <div className="mt-3 ml-14 rounded-lg p-3 bg-gray-50 border border-gray-200">
                  <div className="text-[1.2rem] font-semibold uppercase tracking-wider mb-1 text-gray-500">Changes</div>
                  <div className="flex flex-col gap-1.5">
                    {Object.entries(
                      typeof entry.changes === "string" ? JSON.parse(entry.changes) : entry.changes
                    ).map(([field, v]) => (
                      <div key={field} className="text-[1.3rem] leading-[1.6]">
                        <span className="font-medium text-brand-dark capitalize">{field.replace(/_/g, " ")}</span>
                        <span className="text-gray-400 mx-1.5">·</span>
                        <span className="line-through text-gray-400">{v.old || "—"}</span>
                        <span className="text-gray-400 mx-1.5">→</span>
                        <span className="text-brand-dark-blue">{v.new || "—"}</span>
                      </div>
                    ))}
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
