import React, { useState, useEffect, useMemo, useRef } from "react";
import { api } from "../api/leaders";
import { supabase } from "../supabase";
import { COUNTRY_TO_REGION, REGION_LABELS, ALL_COUNTRIES } from "../utils/countries";
import { toTags, toTitleCase } from "../utils/adminUtils";
import AdminManual from "./AdminManual";
import AdminLogin from "../components/AdminLogin";
import ActivityLog from "../components/admin/ActivityLog";
import ManageAdmins from "../components/admin/ManageAdmins";
import NominatedTab from "../components/admin/NominatedTab";
import ProfileRequests from "../components/admin/ProfileRequests";
import AllEntries from "../components/admin/AllEntries";
// import QAReport from "./QAReport";

const SIDEBAR_ITEMS = [
  { id: "all", label: "All Entries", icon: "list" },
  { id: "requests", label: "Profile Requests", icon: "mail" },
  { id: "nominated", label: "Nominated", icon: "user-plus" },
  { id: "activity", label: "Activity Log", icon: "activity" },
  { id: "manage-admins", label: "Manage Admins", icon: "shield" },
  { id: "divider", label: "", icon: "divider" },
  { id: "embed", label: "Notes to Agency", icon: "embed" },
  // { id: "tests", label: "Test Results", icon: "test" },
  // { id: "fixes", label: "Test Fixes", icon: "fixes" },
];

function InboxIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function UserPlusIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="16" y1="11" x2="22" y2="11" />
    </svg>
  );
}

function TestIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function FixesIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 14l2 2 4-4" />
    </svg>
  );
}

function ManualIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

function EmbedIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

const ICONS = {
  inbox: InboxIcon,
  mail: MailIcon,
  list: ListIcon,
  "user-plus": UserPlusIcon,
  activity: ActivityIcon,
  test: TestIcon,
  fixes: FixesIcon,
  manual: ManualIcon,
  embed: EmbedIcon,
  shield: ShieldIcon,
};


export default function Admin({ onGoToDirectory }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [adminRole, setAdminRole] = useState(null);
  const [adminRoleLoading, setAdminRoleLoading] = useState(false);

  const [pending, setPending] = useState([]);
  const [nominated, setNominated] = useState([]);
  const [all, setAll] = useState([]);
  const [requests, setRequests] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash;
    const match = hash.match(/[?&]tab=([^&]+)/);
    const tab = match ? match[1] : "all";
    const validTabs = ["all", "requests", "nominated", "activity", "documentation", "embed", "manage-admins"];
    return validTabs.includes(tab) ? tab : "all";
  });
  const [requestSubTab, setRequestSubTab] = useState("new");
  const [selectedAll, setSelectedAll] = useState([]);
  const [actionId, setActionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterRegion, setFilterRegion] = useState("");
  const [filterExpertise, setFilterExpertise] = useState("");
  const [filterClicks, setFilterClicks] = useState(""); // "", "high", "low", "least"
  const [filterStatus, setFilterStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("az");
  const [activityFilter, setActivityFilter] = useState("all"); // "all", "update", "delete"
  const [activitySearch, setActivitySearch] = useState("");
  const [activityDateRange, setActivityDateRange] = useState("all"); // "all", "7", "14", "30", "custom"
  const [activityDateFrom, setActivityDateFrom] = useState("");
  const [activityDateTo, setActivityDateTo] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [expandedAllId, setExpandedAllId] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [actionIsError, setActionIsError] = useState(false);
  const [allPage, setAllPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [expandedNominee, setExpandedNominee] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(null);
  const [expandedTester, setExpandedTester] = useState(null);
  const [expandedTestSection, setExpandedTestSection] = useState(null);
  const [testFilterTester, setTestFilterTester] = useState("");
  const [testFilterStatus, setTestFilterStatus] = useState("");
  const [testFilterSearch, setTestFilterSearch] = useState("");
  const [enrichEmail, setEnrichEmail] = useState({});
  const [enrichSending, setEnrichSending] = useState(null);
  const [enrichMsg, setEnrichMsg] = useState({});
  const [manageAdmins, setManageAdmins] = useState([]);
  const [manageAdminsLoading, setManageAdminsLoading] = useState(false);
  const [manageAdminsMsg, setManageAdminsMsg] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("admin");
  const [adminActivity, setAdminActivity] = useState([]);
  const [adminActivityLoading, setAdminActivityLoading] = useState(false);
  const [adminSearch, setAdminSearch] = useState("");
  const PAGE_SIZE = 15;
  const tableTopRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  // Read initial tab from URL hash: #/admin?tab=requests
  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/[?&]tab=([^&]+)/);
    if (match) {
      const tab = match[1];
      const validTabs = ["all", "requests", "nominated", "activity", "documentation", "embed", "manage-admins"];
      if (validTabs.includes(tab)) setActiveTab(tab);
    }
  }, []);

  // Sync active tab to URL hash
  useEffect(() => {
    const hash = window.location.hash;
    const base = hash.split("?")[0] || "#/admin";
    const newHash = `${base}?tab=${activeTab}`;
    if (hash !== newHash) {
      window.history.replaceState(null, "", newHash);
    }
  }, [activeTab]);

  useEffect(() => {
    loadActiveTabData();
  }, [activeTab]);

  // Load admin list + activity when Manage Admins tab is opened
  useEffect(() => {
    if (activeTab === "manage-admins" && adminRole === "super_admin") {
      loadManageAdmins();
      loadAdminActivity();
    }
  }, [activeTab, adminRole]);

  // Auto-dismiss action messages after 5s
  useEffect(() => {
    if (!actionMessage) return;
    const t = setTimeout(() => setActionMessage(""), 5000);
    return () => clearTimeout(t);
  }, [actionMessage]);

  // Auth state listener
  useEffect(() => {
    setAuthLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchAdminRole(session.user.email);
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchAdminRole(session.user.email);
      } else {
        setUser(null);
        setAdminRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchAdminRole(email) {
    setAdminRoleLoading(true);
    try {
      const role = await api.getAdminRole(email);
      setAdminRole(role);
    } catch {
      setAdminRole(null);
    } finally {
      setAdminRoleLoading(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  async function loadData() {
    setLoading(true);
    try {
      const allLeaders = (await api.getLeaders("all")) || [];
      setAll(allLeaders);
      setPending(
        allLeaders.filter((l) => l.status === "pending" && l.branch !== "nominate")
      );
      setNominated(
        allLeaders.filter((l) => l.status === "pending" && l.branch === "nominate")
      );
      await loadActiveTabData();
    } catch (e) {
      console.error("Failed to load admin data:", e);
    } finally {
      setLoading(false);
    }
  }

  async function loadActiveTabData() {
    const isDataTab = activeTab === "all" || activeTab === "nominated" || activeTab === "requests";
    if (isDataTab) setTabLoading(true);
    try {
      if (activeTab === "all" || activeTab === "nominated") {
        const allLeaders = (await api.getLeaders("all")) || [];
        setAll(allLeaders);
        setPending(
          allLeaders.filter(
            (l) => l.status === "pending" && l.branch !== "nominate"
          )
        );
        setNominated(
          allLeaders.filter(
            (l) => l.status === "pending" && l.branch === "nominate"
          )
        );
      } else if (activeTab === "requests") {
        const reqs = await api.getRequests();
        if (reqs?.length) setRequests(reqs);
      }
    } catch (e) {
      console.error("Failed to load tab data:", e);
    } finally {
      if (isDataTab) setTabLoading(false);
    }
  }

  async function confirmAction(id, action) {
    setActionId(id);
    setActionMessage("");
    setActionIsError(false);
    try {
      if (action === "approve") await api.approveRequest(id);
      else await api.rejectRequest(id);

      const item = all.find((i) => i.id === id);
      const updated = item
        ? { ...item, status: action === "approve" ? "live" : "rejected" }
        : null;
      if (updated) setAll(all.map((i) => (i.id === id ? updated : i)));
      setPending((current) => current.filter((p) => p.id !== id));
      setNominated((current) => current.filter((p) => p.id !== id));
      setActionMessage(
        action === "approve"
          ? "Profile approved and published."
          : "Profile rejected and removed from pending."
      );
      setExpandedId(null);
      setExpandedAllId(null);
      setExpandedNominee(null);
    } catch (e) {
      console.error(e);
      setActionIsError(true);
      setActionMessage("Unable to complete action. Please try again.");
    } finally {
      setActionId(null);
    }
  }

  function handleAction(id, action) {
    const item =
      pending.find((i) => i.id === id) ||
      nominatedList.find((i) => i.id === id);
    const name = `${item?.first_name || ""} ${item?.last_name || ""}`.trim();
    if (action === "approve") {
      setShowConfirm({
        title: "Approve profile?",
        message: `${name} will be published to the public directory.`,
        action: "approve",
        confirmLabel: "Approve",
        onConfirm: () => confirmAction(id, action),
      });
    } else {
      setShowConfirm({
        title: "Reject profile?",
        message: `${name} will be removed from the pending queue.`,
        action: "reject",
        confirmLabel: "Reject",
        onConfirm: () => confirmAction(id, action),
      });
    }
  }

  function handleDeleteTestResult(id, scenario) {
    setShowConfirm({
      title: "Delete test result?",
      message: `"${scenario}" will be permanently removed.`,
      action: "delete",
      confirmLabel: "Delete",
      onConfirm: async () => {
        setShowConfirm(null);
        try {
          await api.deleteTestResult(id);
          setTestResults((prev) => prev.filter((r) => r.id !== id));
          setActionMessage("Test result deleted.");
        } catch (e) {
          setActionIsError(true);
          setActionMessage("Delete failed.");
        }
      },
    });
  }

  function handleClearTesterResults(name) {
    setShowConfirm({
      title: "Clear all results for this tester?",
      message: `All test results for "${name}" will be permanently removed. This cannot be undone.`,
      action: "delete",
      confirmLabel: "Clear all",
      onConfirm: async () => {
        setShowConfirm(null);
        try {
          await api.deleteTestResultsForTester(name);
          setTestResults((prev) => prev.filter((r) => r.tester_name !== name));
          setExpandedTester((prev) => (prev === name ? null : prev));
          setActionMessage(`All results cleared for ${name}.`);
        } catch (e) {
          setActionIsError(true);
          setActionMessage("Clear failed.");
        }
      },
    });
  }

  const handleRefresh = () => loadData();

  function buildOutreachMessage(item) {
    const name = item.first_name || "there";
    const nominator = item.editor_email || item.editorEmail || "a colleague";
    const role = item.role || "your work";
    const org = item.organisation || "";
    return `Hi ${name},\n\nYou've been nominated to be featured in the Transform Health Women Leaders in Digital Health Database — a global initiative to increase visibility and representation of women leaders in digital health across Africa and beyond.\n\n${
      org
        ? `We'd love to include your profile (${role} at ${org}) in the directory.\n\n`
        : ""
    }If you'd like to learn more or have your profile added, please reply to this message or visit transformhealthcoalition.org/leaders.\n\nWarm regards,\nThe Transform Health Team`;
  }

  async function handleCopyMessage(item) {
    const msg = buildOutreachMessage(item);
    try {
      await navigator.clipboard.writeText(msg);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = msg;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handleSendUpdateLink(req) {
    setActionId(req.id);
    setActionMessage("");
    setActionIsError(false);
    try {
      // Use leader_email from the leaders table (admin-only field)
      const { data: leader } = await api
        .getLeaders("all")
        .then((all) => ({ data: all.find((l) => l.id === req.leader_id) }));

      if (!leader?.leader_email) {
        throw new Error("Leader email not found");
      }

      await api.requestManage({
        leaderId: req.leader_id,
        firstName: req.first_name,
        lastName: req.last_name,
        linkedin: req.linkedin,
      });
      setRequests((current) =>
        current.map((r) => (r.id === req.id ? { ...r, link_sent: true } : r))
      );
      setActionMessage(`Update link sent to ${leader.leader_email}.`);
    } catch (e) {
      console.error(e);
      setRequests((current) =>
        current.map((r) => (r.id === req.id ? { ...r, link_sent: true } : r))
      );
      setActionMessage(
        `Link marked as sent for ${req.first_name} ${req.last_name}.`
      );
    } finally {
      setActionId(null);
    }
  }

  async function handleDeleteLeader(id, name) {
    setShowConfirm({
      title: "Delete entry permanently?",
      message: `"${name}" will be permanently removed from the database. This cannot be undone.`,
      action: "delete",
      confirmLabel: "Delete",
      onConfirm: async () => {
        setShowConfirm(null);
        setActionIsError(false);
        try {
          await api.deleteLeader(id);
          setAll((prev) => prev.filter((l) => l.id !== id));
          setExpandedAllId(null);
          setActionMessage("Entry permanently deleted.");
        } catch (e) {
          setActionIsError(true);
          setActionMessage(
            "Delete failed — run the missing RLS policy in Supabase (see scripts/add-delete-policy.sql)."
          );
        }
      },
    });
  }

  async function handleSendEnrichmentLink(item) {
    const email = enrichEmail[item.id]?.trim();
    if (!email) return;
    setEnrichSending(item.id);
    setEnrichMsg((prev) => ({ ...prev, [item.id]: "" }));
    try {
      const result = await api.sendEnrichmentLink({ leaderId: item.id, email });
      // Email saved to DB regardless — update local state
      setAll((prev) =>
        prev.map((l) => (l.id === item.id ? { ...l, leader_email: email } : l))
      );
      if (result?.ok === false) {
        // Email service down — give admin the direct link to share manually
        setEnrichMsg((prev) => ({
          ...prev,
          [item.id]: `✗ Email service unavailable — share this link manually:\n${result.url}`,
        }));
      } else {
        setEnrichMsg((prev) => ({ ...prev, [item.id]: `✓ Magic link sent to ${email}` }));
      }
    } catch (e) {
      setEnrichMsg((prev) => ({ ...prev, [item.id]: `✗ Failed: ${e.message}` }));
    } finally {
      setEnrichSending(null);
    }
  }

  async function loadManageAdmins() {
    setManageAdminsMsg("");
    setManageAdminsLoading(true);
    try {
      const res = await api.manageAdmin({ action: "list", invokerEmail: user.email });
      if (res.ok) setManageAdmins(res.data || []);
      else setManageAdminsMsg("✗ Failed to load");
    } catch (e) {
      setManageAdminsMsg("✗ Failed to load: " + e.message);
    } finally {
      setManageAdminsLoading(false);
    }
  }

  async function loadAdminActivity() {
    setAdminActivityLoading(true);
    try {
      const res = await api.manageAdmin({ action: "activity", invokerEmail: user.email });
      if (res.ok) setAdminActivity(res.data || []);
    } catch (_e) {
      // non-fatal — table may not exist yet
    } finally {
      setAdminActivityLoading(false);
    }
  }

  async function handleAddAdmin() {
    const email = newAdminEmail.trim();
    if (!email) return;
    setManageAdminsMsg("");
    try {
      const res = await api.manageAdmin({ action: "add", email, role: newAdminRole, invokerEmail: user.email });
      if (res.ok) {
        setManageAdminsMsg(`✓ ${res.message}`);
        setNewAdminEmail("");
        loadManageAdmins();
        loadAdminActivity();
      } else {
        setManageAdminsMsg(`✗ ${res.error}`);
      }
    } catch (e) {
      setManageAdminsMsg(`✗ ${e.message}`);
    }
  }

  async function handleRemoveAdmin(email) {
    setManageAdminsMsg("");
    try {
      const res = await api.manageAdmin({ action: "remove", email, invokerEmail: user.email });
      if (res.ok) {
        setManageAdminsMsg(`✓ ${res.message}`);
        loadManageAdmins();
        loadAdminActivity();
      } else {
        setManageAdminsMsg(`✗ ${res.error}`);
      }
    } catch (e) {
      setManageAdminsMsg(`✗ ${e.message}`);
    }
  }


  function toggleDeleteSelect(id) {
    setSelectedDeletes((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
    );
  }

  function toggleAllSelect(id) {
    setSelectedAll((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
    );
  }

  function toggleAllEntries() {
    const pendingRows = filteredAll.filter((r) => r.status === "pending");
    const allSelected = pendingRows.every((r) => selectedAll.includes(r.id));
    if (allSelected) setSelectedAll([]);
    else setSelectedAll(pendingRows.map((r) => r.id));
  }

  function handleBulkAllEntries(action) {
    if (selectedAll.length === 0) return;
    const label = action === "approve" ? "Approve" : "Reject";
    setShowConfirm({
      title: `${label} ${selectedAll.length} submission(s)?`,
      message:
        action === "approve"
          ? "These profiles will be published to the public directory."
          : "These profiles will be removed from the pending queue.",
      action,
      confirmLabel: `${label} ${selectedAll.length}`,
      onConfirm: () => {
        selectedAll.forEach((id) => confirmAction(id, action));
        setSelectedAll([]);
      },
    });
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setRequestSubTab("new");
    setFilterStatus("");
    setSelectedAll([]);
    setExpandedId(null);
    setExpandedAllId(null);
    setExpandedNominee(null);
    setExpandedTester(null);
    setExpandedTestSection(null);
    setTestFilterTester("");
    setTestFilterStatus("");
    setTestFilterSearch("");
    setActivityFilter("all");
    setActivitySearch("");
    setActivityDateRange("all");
    setActivityDateFrom("");
    setActivityDateTo("");
    setAllPage(1);
    setSearchQuery("");
    setFilterCountry("");
    setFilterRegion("");
    setFilterExpertise("");
  };

  const pendingCount = pending.length;
  const nominatedList = nominated;
  const nominatedCount = nominated.length;
  const requestsCount = requests.filter((r) => r.status === "pending").length;
  const totalPendingCount = pending.length + requestsCount;
  const liveCount = all.filter((item) => item.status === "live").length;
  const rejectedCount = all.filter((item) => item.status === "rejected").length;
  const allCount = all.length;

  const countries = useMemo(() => {
    const set = new Set();
    all.forEach((item) => {
      if (item.country) set.add(item.country);
    });
    return Array.from(set).sort();
  }, [all]);

  const countriesByRegion = useMemo(() => {
    const grouped = {};
    ALL_COUNTRIES.forEach((country) => {
      const key = COUNTRY_TO_REGION[country] || "other";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(country);
    });
    return Object.entries(grouped)
      .map(([key, list]) => ({
        key,
        label: REGION_LABELS[key] || "Other",
        countries: list.sort(),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  const filteredCountries = useMemo(() => {
    if (!filterRegion) return countriesByRegion;
    return countriesByRegion.filter((r) => r.key === filterRegion);
  }, [countriesByRegion, filterRegion]);

  const expertiseOptions = useMemo(() => {
    const seen = new Set();
    const options = new Set();
    all.forEach((item) => {
      toTags(item.expertise).forEach((tag) => {
        const trimmed = tag.trim();
        const stripped = trimmed.replace(/^Other:\s*/i, "").trim();
        const normalized = stripped
          ? toTitleCase(stripped)
          : "Other";
        if (seen.has(normalized.toLowerCase())) return;
        seen.add(normalized.toLowerCase());
        options.add(normalized);
      });
    });
    return Array.from(options).sort();
  }, [all]);

  const liveNames = useMemo(() => {
    const set = new Set();
    all
      .filter((l) => l.status === "live")
      .forEach((l) => {
        set.add(
          `${l.first_name?.trim()?.toLowerCase() ?? ""} ${
            l.last_name?.trim()?.toLowerCase() ?? ""
          }`
        );
      });
    return set;
  }, [all]);

  const filteredAll = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const results = all.filter((item) => {
      const text = [
        item.first_name,
        item.last_name,
        item.role,
        item.organisation,
        item.editor_email,
        item.leader_email,
        item.expertise,
        item.country,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (query && !text.includes(query)) return false;
      if (filterCountry && item.country !== filterCountry) return false;
      // Expertise filter
      if (filterExpertise) {
        const tags = toTags(item.expertise);
        if (!tags.includes(filterExpertise)) return false;
      }
      // LinkedIn clicks filter
      if (filterClicks === "high") {
        if ((item.linkedin_clicks || 0) < 1) return false;
      } else if (filterClicks === "low") {
        if ((item.linkedin_clicks || 0) > 0) return false;
      }
      // Status filter
      if (filterStatus && item.status !== filterStatus) return false;
      return true;
    });
    return results.slice().sort((a, b) => {
      // Sort by clicks first if clicks filter is active
      if (filterClicks === "high") {
        return (b.linkedin_clicks || 0) - (a.linkedin_clicks || 0);
      }
      if (filterClicks === "low") {
        return (a.linkedin_clicks || 0) - (b.linkedin_clicks || 0);
      }
      const l = `${a.last_name} ${a.first_name}`.toLowerCase();
      const r = `${b.last_name} ${b.first_name}`.toLowerCase();
      return sortOrder === "za"
        ? r < l
          ? -1
          : r > l
          ? 1
          : 0
        : l < r
        ? -1
        : l > r
        ? 1
        : 0;
    });
  }, [
    all,
    searchQuery,
    filterCountry,
    filterExpertise,
    filterClicks,
    filterStatus,
    sortOrder,
  ]);

  const activityLog = useMemo(() => {
    return requests
      .filter(r => r.status === "approved" && (r.request_type === "update" || r.request_type === "delete"))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [requests]);

  const filteredActivityLog = useMemo(() => {
    return activityLog.filter(entry => {
      if (activityFilter !== "all" && 
          ((activityFilter === "delete" && entry.request_type !== "delete") ||
           (activityFilter === "update" && entry.request_type !== "update")))
        return false;
      if (activitySearch) {
        const name = `${entry.first_name} ${entry.last_name}`.toLowerCase();
        if (!name.includes(activitySearch.toLowerCase())) return false;
      }
      if (activityDateRange !== "all" && entry.created_at) {
        const entryDate = new Date(entry.created_at);
        const now = new Date();
        if (activityDateRange === "7") {
          const cutoff = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
          if (entryDate < cutoff) return false;
        } else if (activityDateRange === "14") {
          const cutoff = new Date(now.getTime() - 14 * 24 * 3600 * 1000);
          if (entryDate < cutoff) return false;
        } else if (activityDateRange === "30") {
          const cutoff = new Date(now.getTime() - 30 * 24 * 3600 * 1000);
          if (entryDate < cutoff) return false;
        } else if (activityDateRange === "custom") {
          if (activityDateFrom) {
            const from = new Date(activityDateFrom);
            from.setHours(0, 0, 0, 0);
            if (entryDate < from) return false;
          }
          if (activityDateTo) {
            const to = new Date(activityDateTo);
            to.setHours(23, 59, 59, 999);
            if (entryDate > to) return false;
          }
        }
      }
      return true;
    });
  }, [activityLog, activityFilter, activitySearch, activityDateRange, activityDateFrom, activityDateTo]);

  const sidebarItems = [
    { ...SIDEBAR_ITEMS[0], count: allCount },
    { ...SIDEBAR_ITEMS[1], count: pending.length },
    { ...SIDEBAR_ITEMS[2], count: nominatedCount },
    { ...SIDEBAR_ITEMS[3], count: activityLog.length },
    ...(adminRole === "super_admin" ? [{ ...SIDEBAR_ITEMS[4] }] : []), // manage-admins (super admin only)
    SIDEBAR_ITEMS[5], // divider
    SIDEBAR_ITEMS[6], // Notes to Agency (with spacing)
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-brand-sand flex items-center justify-center">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onLogin={(u) => setUser(u)} />;
  }

  return (
    <div className="flex flex-col h-screen bg-brand-sand overflow-hidden">
      <header className="border-b-4 border-brand-pink bg-white shadow-md flex-shrink-0">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-4 px-8 py-4">
          <div className="flex items-center gap-4">
            <img
              src="illustrations/TH-Logo-Tag-Top-FC.png"
              alt="Transform Health"
              className="h-12 block"
            />
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-brand-navy">
              Admin Console
            </div>
          </div>
          <div className="flex justify-end items-center gap-3">
            <span className="text-[1.3rem] text-gray-500 hidden md:block truncate max-w-[200px]">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="text-[1.3rem] font-medium text-brand-pink border border-brand-pink px-3 py-1.5 rounded-lg hover:bg-brand-pink hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className={`w-72 flex-shrink-0 border-r-4 border-brand-pink bg-brand-navy shadow-md flex flex-col ${activeTab === "documentation" ? "hidden" : ""}`}>
          <div className="px-6 py-5 border-b-2 border-brand-pink">
            <div className="flex items-center justify-center">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center justify-center rounded-lg border-2 border-brand-yellow px-4 py-3 text-[1.6rem] font-bold text-brand-yellow bg-transparent hover:bg-brand-pink hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2"
              >
                Refresh ↻
              </button>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {sidebarItems.map((item) => {
              // Divider row
              if (item.id === "divider") {
                return (
                  <hr
                    key="divider"
                    className="my-2 border-t border-brand-pink border-opacity-30"
                  />
                );
              }

              const Icon = ICONS[item.icon];
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  title={{
                    all: "Browse and manage the full database",
                    requests: "Review and approve new submissions",
                    nominated: "Reach out to third-party nominations",
                    activity: "Track self-service updates and deletions",
                    embed: "Instructions for the web agency embedding the directory",
                    "manage-admins": "Manage admin user roles (super admin only)",
                    documentation: "Guides, workflows, and admin reference",
                  }[item.id] || item.label}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-md text-xl font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2 ${
                    isActive
                      ? "bg-brand-pink text-white border border-brand-pink"
                      : "bg-transparent text-white border border-transparent hover:bg-brand-pink hover:bg-opacity-20"
                  }`}
                >
                  <span
                    className={isActive ? "text-white" : "text-brand-yellow"}
                  >
                    <Icon />
                  </span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {(item.id === "tests" || item.id === "fixes") && (
                    <span
                      className={`text-[1.2rem] font-bold px-2 py-1 rounded tracking-wider ${
                        isActive
                          ? "bg-amber-200 text-amber-800"
                          : "bg-amber-400/80 text-amber-900"
                      }`}
                    >
                      DEV
                    </span>
                  )}
                  {item.count !== undefined && (
                    <span
                      className={`text-[1.6rem] font-bold px-2 py-0.5 rounded-lg ${
                        isActive
                          ? "bg-white text-brand-navy"
                          : "bg-brand-yellow text-brand-navy"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="px-3 py-4 border-t border-gray-200 flex flex-col gap-2">
            <button
              onClick={() => setActiveTab("documentation")}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-3 text-[1.6rem] font-medium text-gray-600 bg-white hover:bg-gray-50 hover:text-brand-navy transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink focus-visible:ring-offset-2"
            >
              <ManualIcon />
              Documentation
            </button>
            <button
              onClick={() => window.open(window.location.origin + window.location.pathname, "_blank")}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-brand-pink px-3 py-3 text-[1.6rem] font-medium text-brand-pink bg-brand-parchment hover:bg-brand-pink hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink focus-visible:ring-offset-2"
            >
              View directory
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Page header + stats - hidden for Tests tab */}
          {activeTab !== "tests" &&
            activeTab !== "documentation" &&
            activeTab !== "fixes" &&
            activeTab !== "embed" && (
              <div className="px-8 py-6 border-b border-brand-warm-border flex-shrink-0 bg-gradient-to-br from-brand-sand to-[#ede7d8]">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="text-3xl font-semibold text-brand-navy tracking-heading">
                      {sidebarItems.find((s) => s.id === activeTab)?.label}
                    </h2>
                  </div>
                  {activeTab === "all" && (
                    <div className="grid grid-cols-3 gap-3 text-center sm:text-right">
                    <div className="bg-brand-orange rounded-lg px-[1.6rem] py-[1.2rem] border-2 border-brand-orange" title="New profile submissions waiting for approval">
                      <div className="text-[1.4rem] font-bold uppercase tracking-wider text-white">
                        Pending
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {totalPendingCount}
                      </div>
                    </div>
                    <div className="bg-green-500 rounded-lg px-[1.6rem] py-[1.2rem] border-2 border-green-600" title="Approved profiles published to the public directory">
                      <div className="text-[1.4rem] font-bold uppercase tracking-wider text-white">
                        Live
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {liveCount}
                      </div>
                    </div>
                    <div className="bg-red-600 rounded-lg px-[1.6rem] py-[1.2rem] border-2 border-red-700" title="Profiles that have been declined">
                      <div className="text-[1.4rem] font-bold uppercase tracking-wider text-white">
                        Rejected
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {rejectedCount}
                      </div>
                    </div>
                  </div>
                  )}
                </div>
              </div>
            )}

          {/* Filter bar - hidden for documentation, activity, and nominated tabs */}
          {activeTab !== "tests" &&
            activeTab !== "documentation" &&
            activeTab !== "fixes" &&
            activeTab !== "activity" &&
            activeTab !== "nominated" && (
              <div className="px-8 py-3 border-b-2 border-brand-navy flex-shrink-0 bg-white">
                <div className="flex flex-col gap-2">
                  {/* Row 1: core filters */}
                  <div className="flex flex-wrap gap-2 items-center">
                    <input
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setAllPage(1);
                      }}
                      placeholder="Search name, org, role, expertise"
                      className="min-w-[200px] rounded-lg border-2 border-gray-400 px-3 py-1.5 text-[1.3rem] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink focus:border-brand-navy bg-white text-gray-900"
                    />
                    <select
                      value={filterRegion}
                      onChange={(e) => {
                        setFilterRegion(e.target.value);
                        setFilterCountry("");
                        setAllPage(1);
                      }}
                      className="rounded-lg border-2 border-gray-400 px-3 py-1.5 text-[1.3rem] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink focus:border-brand-navy bg-white text-gray-900"
                    >
                      <option value="">All regions</option>
                      {countriesByRegion.map((r) => (
                        <option key={r.key} value={r.key}>{r.label}</option>
                      ))}
                    </select>
                    <select
                      value={filterCountry}
                      onChange={(e) => {
                        setFilterCountry(e.target.value);
                        setAllPage(1);
                      }}
                      className="rounded-lg border-2 border-gray-400 px-3 py-1.5 text-[1.3rem] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink focus:border-brand-navy bg-white text-gray-900"
                    >
                      <option value="">All countries{filterRegion ? ` in ${REGION_LABELS[filterRegion] || ""}` : ""}</option>
                      {filteredCountries.map((region) => (
                        <optgroup key={region.key} label={region.label}>
                          {region.countries.map((country) => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <select
                      value={filterExpertise}
                      onChange={(e) => {
                        setFilterExpertise(e.target.value);
                        setAllPage(1);
                      }}
                      className="rounded-lg border-2 border-gray-400 px-3 py-1.5 text-[1.3rem] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink focus:border-brand-navy bg-white text-gray-900"
                    >
                      <option value="">All expertise</option>
                      {expertiseOptions.map((expertise) => (
                        <option key={expertise} value={expertise}>{expertise}</option>
                      ))}
                    </select>
                  </div>
                  {/* Row 2: admin-only filters + count */}
                  {activeTab === "all" && (
                    <div className="flex flex-wrap gap-2 items-center">
                      <select
                        value={filterClicks}
                        onChange={(e) => {
                          setFilterClicks(e.target.value);
                          setAllPage(1);
                        }}
                        className="rounded-lg border-2 border-gray-400 px-3 py-1.5 text-[1.3rem] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink focus:border-brand-navy bg-white text-gray-900"
                      >
                        <option value="">All click counts</option>
                        <option value="high">🔥 Most clicked (high)</option>
                        <option value="low">📉 Least clicked (low)</option>
                      </select>
                      <select
                        value={filterStatus}
                        onChange={(e) => {
                          setFilterStatus(e.target.value);
                          setAllPage(1);
                        }}
                        className="rounded-lg border-2 border-gray-400 px-3 py-1.5 text-[1.3rem] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink focus:border-brand-navy bg-white text-gray-900"
                      >
                        <option value="">All statuses</option>
                        <option value="pending">Pending</option>
                        <option value="live">Live</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      {(searchQuery || filterRegion || filterCountry || filterExpertise || filterClicks || filterStatus) && (
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
                          className="h-8 flex items-center gap-1 px-3 border-2 border-red-300 rounded-lg bg-white text-red-500 text-[1.2rem] font-semibold cursor-pointer hover:bg-red-50"
                        >
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 4L4 12M4 4l8 8"/></svg>
                          Clear
                        </button>
                      )}
                      <div className="text-[1.3rem] font-semibold text-brand-navy ml-auto">
                        {filteredAll.length} of {allCount} total entries
                      </div>
                    </div>
                  )}
                  {/* Stats for non-All-Entries tabs */}
                  {activeTab !== "all" && (
                    <div className="text-[1.3rem] font-semibold text-brand-navy">
                      {activeTab === "nominated"
                        ? `${nominatedCount} nominated`
                        : activeTab === "requests"
                        ? `${pending.length} new`
                        : activeTab === "activity"
                        ? `${activityLog.length} events`
                        : activeTab === "manage-admins"
                        ? `${manageAdmins.length} user${manageAdmins.length !== 1 ? "s" : ""}`
                        : `${requestsCount} pending nominations`}
                    </div>
                  )}
                </div>
                {actionMessage && (
                  <div
                    className={`mt-4 rounded-lg px-4 py-3 text-lg border ${
                      actionIsError
                        ? "border-red-300 bg-red-50 text-red-800"
                        : "border-brand-green-border bg-green-50 text-green-800"
                    }`}
                  >
                    {actionMessage}
                  </div>
                )}
              </div>
            )}

          {/* Activity Log filter bar — replaces general filter bar for activity tab */}
          {activeTab === "activity" && (
            <div className="px-8 py-3 border-b-2 border-brand-navy flex-shrink-0 bg-white">
              <div className="flex items-center gap-3 flex-wrap">
                <select
                  value={activityFilter}
                  onChange={(e) => setActivityFilter(e.target.value)}
                  className="rounded-lg border-2 border-gray-400 px-3 py-2 text-lg font-medium shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink focus:border-brand-navy bg-white text-gray-900"
                >
                  <option value="all">All actions</option>
                  <option value="update">Updates</option>
                  <option value="delete">Deletes</option>
                </select>
                <select
                  value={activityDateRange}
                  onChange={(e) => setActivityDateRange(e.target.value)}
                  className="rounded-lg border-2 border-gray-400 px-3 py-2 text-lg font-medium shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink focus:border-brand-navy bg-white text-gray-900"
                >
                  <option value="all">All time</option>
                  <option value="7">Last 7 days</option>
                  <option value="14">Last 14 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="custom">Custom range…</option>
                </select>
                {activityDateRange === "custom" && (
                  <>
                    <input
                      type="date"
                      value={activityDateFrom}
                      onChange={(e) => setActivityDateFrom(e.target.value)}
                      className="rounded-lg border-2 border-gray-400 px-3 py-2 text-lg font-medium shadow-sm bg-white text-gray-900"
                    />
                    <span className="text-lg text-gray-500">to</span>
                    <input
                      type="date"
                      value={activityDateTo}
                      onChange={(e) => setActivityDateTo(e.target.value)}
                      className="rounded-lg border-2 border-gray-400 px-3 py-2 text-lg font-medium shadow-sm bg-white text-gray-900"
                    />
                  </>
                )}
                <input
                  type="text"
                  placeholder="Search by name…"
                  value={activitySearch}
                  onChange={(e) => setActivitySearch(e.target.value)}
                  className="min-w-[180px] rounded-lg border-2 border-gray-400 px-4 py-2 text-lg font-medium shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink focus:border-brand-navy bg-white text-gray-900 placeholder-gray-400"
                />
                {(activityFilter !== "all" || activitySearch || activityDateRange !== "all") && (
                  <button
                    onClick={() => { setActivityFilter("all"); setActivitySearch(""); setActivityDateRange("all"); setActivityDateFrom(""); setActivityDateTo(""); }}
                    className="text-[1.3rem] text-brand-pink font-medium hover:underline whitespace-nowrap cursor-pointer"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-8 py-6 bg-white">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-4 border-brand-navy border-t-transparent rounded-full animate-spin" />
                  <p className="text-[1.4rem] text-gray-500 font-medium">Loading admin data…</p>
                </div>
              </div>
            ) : tabLoading && activeTab !== "documentation" && activeTab !== "activity" ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-3 border-brand-navy border-t-transparent rounded-full animate-spin" />
                  <p className="text-[1.4rem] text-gray-400 font-medium">Loading…</p>
                </div>
              </div>
            ) : activeTab === "requests" ? (
              <ProfileRequests
                pending={pending}
                expandedId={expandedId}
                setExpandedId={setExpandedId}
                actionId={actionId}
                handleAction={handleAction}
              />
            ) : activeTab === "activity" ? (
              <ActivityLog
                filteredActivityLog={filteredActivityLog}
                activityLog={activityLog}
                activityFilter={activityFilter}
                setActivityFilter={setActivityFilter}
                activitySearch={activitySearch}
                setActivitySearch={setActivitySearch}
                activityDateRange={activityDateRange}
                setActivityDateRange={setActivityDateRange}
                activityDateFrom={activityDateFrom}
                setActivityDateFrom={setActivityDateFrom}
                activityDateTo={activityDateTo}
                setActivityDateTo={setActivityDateTo}
              />
            ) : activeTab === "nominated" ? (
              <NominatedTab
                nominatedList={nominatedList}
                expandedNominee={expandedNominee}
                setExpandedNominee={setExpandedNominee}
                copiedId={copiedId}
                handleCopyMessage={handleCopyMessage}
                actionId={actionId}
                handleAction={handleAction}
              />
            ) : activeTab === "all" ? (
              <AllEntries
                filteredAll={filteredAll}
                allPage={allPage}
                setAllPage={setAllPage}
                selectedAll={selectedAll}
                toggleAllSelect={toggleAllSelect}
                toggleAllEntries={toggleAllEntries}
                handleBulkAllEntries={handleBulkAllEntries}
                setSearchQuery={setSearchQuery}
                setFilterRegion={setFilterRegion}
                setFilterCountry={setFilterCountry}
                setFilterExpertise={setFilterExpertise}
                setFilterClicks={setFilterClicks}
                setFilterStatus={setFilterStatus}
                expandedAllId={expandedAllId}
                setExpandedAllId={setExpandedAllId}
                liveNames={liveNames}
                enrichEmail={enrichEmail}
                setEnrichEmail={setEnrichEmail}
                enrichSending={enrichSending}
                enrichMsg={enrichMsg}
                handleSendEnrichmentLink={handleSendEnrichmentLink}
                adminRole={adminRole}
                handleAction={handleAction}
                actionId={actionId}
                handleDeleteLeader={handleDeleteLeader}
                tableTopRef={tableTopRef}
              />
            ) : activeTab === "manage-admins" && adminRole === "super_admin" ? (
              <ManageAdmins
                newAdminEmail={newAdminEmail}
                setNewAdminEmail={setNewAdminEmail}
                newAdminRole={newAdminRole}
                setNewAdminRole={setNewAdminRole}
                handleAddAdmin={handleAddAdmin}
                manageAdminsMsg={manageAdminsMsg}
                adminSearch={adminSearch}
                setAdminSearch={setAdminSearch}
                loadManageAdmins={loadManageAdmins}
                loadAdminActivity={loadAdminActivity}
                manageAdminsLoading={manageAdminsLoading}
                manageAdmins={manageAdmins}
                user={user}
                setShowConfirm={setShowConfirm}
                handleRemoveAdmin={handleRemoveAdmin}
                adminActivityLoading={adminActivityLoading}
                adminActivity={adminActivity}
              />
            ) : activeTab === "embed" ? (
              <div className="p-8 max-w-[900px] mx-auto">
                <h2 className="text-3xl font-semibold text-brand-navy tracking-heading mb-6">
                  Embedding the Directory into the TH Website
                </h2>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
                  <p className="text-[1.5rem] text-amber-800 font-medium">
                    This guide is for the web agency building the Transform Health website at{" "}
                    <a href="https://transformhealth.rrzdev.co.za" target="_blank" rel="noopener noreferrer" className="underline">
                      transformhealth.rrzdev.co.za
                    </a>
                    .
                    Share this tab with them so they know how to embed the Women Leaders Directory.
                  </p>
                </div>

                <section className="mb-8">
                  <h3 className="text-2xl font-semibold text-brand-navy mb-3">Overview</h3>
                  <p className="text-[1.5rem] text-gray-700 leading-[1.7] mb-3">
                    The Women Leaders Directory is a standalone React application deployed on GitHub Pages.
                    It is <strong>not</strong> part of the WordPress site — it lives at its own URL and gets
                    embedded into the TH website.
                  </p>
                  <p className="text-[1.5rem] text-gray-700 leading-[1.7]">
                    <strong>Live URL:</strong>{" "}
                    <code className="bg-gray-100 px-2 py-1 rounded text-[1.4rem]">https://tich-labs.github.io/transform-health-directory/</code>
                  </p>
                </section>

                <section className="mb-8">
                  <h3 className="text-2xl font-semibold text-brand-navy mb-3">
                    Header &amp; Footer — Demo Only
                  </h3>
                  <p className="text-[1.5rem] text-gray-700 leading-[1.7] mb-3">
                    The current site header and footer (nav bar with dropdowns, multi-column footer)
                    are <strong>only for demo purposes</strong> — they let the TH team visualise
                    how the directory will look when embedded in the real site.
                  </p>
                  <p className="text-[1.5rem] text-gray-700 leading-[1.7] mb-3">
                    <strong>The web agency should NOT replicate or use these.</strong> The agency will
                    provide the real TH site navigation and footer, and the directory will sit within
                    that chrome.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
                    <p className="text-[1.4rem] text-blue-800">
                      <strong>Tip:</strong> The demo header and footer are <strong>hidden by default</strong> — what you see is already the embedded view. Click the eye button <span className="text-xl">👁️</span> at the bottom-right of any page to temporarily show them for comparison.
                    </p>
                  </div>
                </section>

                <section className="mb-8">
                  <h3 className="text-2xl font-semibold text-brand-navy mb-3">Embedding Options</h3>

                  <div className="mb-5">
                    <h4 className="text-[1.7rem] font-semibold text-brand-navy mb-2">
                      Option A: Iframe Embed (Recommended)
                    </h4>
                    <p className="text-[1.5rem] text-gray-700 leading-[1.7] mb-2">
                      Place the directory in a full-width page on the TH site using an iframe:
                    </p>
                    <pre className="bg-gray-900 text-green-300 p-4 rounded-lg text-[1.3rem] overflow-x-auto leading-[1.6]">
{`<iframe
  src="https://tich-labs.github.io/transform-health-directory/?chrome=hidden"
  width="100%"
  height="800px"
  style="border:none;overflow-y:auto"
  title="Women Leaders in Digital Health Directory"
></iframe>`}
                    </pre>
                    <p className="text-[1.4rem] text-gray-600 mt-2">
                      The <code className="bg-gray-100 px-1.5 py-0.5 rounded">?chrome=hidden</code> parameter
                      hides the demo header/footer automatically. Adjust the height as needed or use
                      a JavaScript resize handler for a seamless experience.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[1.7rem] font-semibold text-brand-navy mb-2">
                      Option B: Link Out
                    </h4>
                    <p className="text-[1.5rem] text-gray-700 leading-[1.7] mb-2">
                      Link directly to the directory from the TH site navigation:
                    </p>
                    <pre className="bg-gray-900 text-green-300 p-4 rounded-lg text-[1.3rem] overflow-x-auto leading-[1.6]">
{`<a href="https://tich-labs.github.io/transform-health-directory/"
   target="_blank"
   rel="noopener noreferrer">
  Women Leaders in Digital Health Directory
</a>`}
                    </pre>
                  </div>
                </section>

                <section className="mb-8">
                  <h3 className="text-2xl font-semibold text-brand-navy mb-3">URL Parameters</h3>
                  <table className="w-full text-[1.4rem] border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left px-4 py-2 border border-gray-200 font-semibold">Parameter</th>
                        <th className="text-left px-4 py-2 border border-gray-200 font-semibold">Value</th>
                        <th className="text-left px-4 py-2 border border-gray-200 font-semibold">Effect</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-2 border border-gray-200"><code>?chrome=hidden</code></td>
                        <td className="px-4 py-2 border border-gray-200"><code>hidden</code></td>
                        <td className="px-4 py-2 border border-gray-200">Hides the demo header, nav bar, and footer</td>
                      </tr>
                    </tbody>
                  </table>
                </section>

                <section className="mb-8">
                  <h3 className="text-2xl font-semibold text-brand-navy mb-3">What the TH Team Needs to Provide</h3>
                  <ul className="list-disc pl-6 text-[1.5rem] text-gray-700 leading-[1.7] space-y-2">
                    <li>
                      <strong>A page or section</strong> on the TH website where the directory will be
                      embedded (full-width recommended)
                    </li>
                    <li>
                      <strong>If iframe:</strong> the page dimensions so we can set appropriate height
                    </li>
                    <li>
                      <strong>If link-out:</strong> the placement in the site navigation
                    </li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h3 className="text-2xl font-semibold text-brand-navy mb-3">Notes for the Agency</h3>
                  <ul className="list-disc pl-6 text-[1.5rem] text-gray-700 leading-[1.7] space-y-2">
                    <li>
                      The directory is fully responsive — works on mobile, tablet, and desktop
                    </li>
                    <li>
                      No API calls or CORS configuration needed — it is a static site that calls
                      Supabase directly from the browser
                    </li>
                    <li>
                      If using an iframe, ensure your CSP (Content Security Policy) allows the
                      directory URL and Supabase API endpoints
                    </li>
                    <li>
                      The directory has its own search, filter, and analytics — it is self-contained
                    </li>
                    <li>
                      No login is required for public users — the directory is fully open
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-2xl font-semibold text-brand-navy mb-3">Testing the Embed</h3>
                  <p className="text-[1.5rem] text-gray-700 leading-[1.7]">
                    To test: open the directory with{" "}
                    <code className="bg-gray-100 px-1.5 py-0.5 rounded">?chrome=hidden</code> in an iframe
                    on your local dev environment, or visit the URL directly with that parameter.
                    The TH team can also use the eye button <span className="text-xl">👁️</span> on the live
                    site to preview the chrome-less view.
                  </p>
                </section>
              </div>
            ) : activeTab === "documentation" ? (
              <AdminManual onBackToAdmin={() => handleTabChange("all")} />
            ) : null}
          </div>
        </main>
      </div>

      <footer className="border-t border-gray-200 bg-brand-parchment flex-shrink-0">
        <div className="max-w-[1440px] mx-auto px-8 py-3 text-center">
          <div className="text-[1.3rem] text-gray-400">
            Women Leaders in Digital Health Database — Admin console
          </div>
        </div>
      </footer>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/[0.45]">
          <div className="rounded-2xl px-8 py-6 shadow-xl max-w-sm mx-4 bg-white border border-brand-warm-border">
            <div
              className={`text-xl font-semibold mb-2 ${
                showConfirm.action === "reject" ||
                showConfirm.action === "delete" ||
                showConfirm.action === "remove-admin"
                  ? "text-red-600"
                  : "text-brand-navy"
              }`}
            >
              {showConfirm.title}
            </div>
            <div className="text-[1.5rem] mb-6 text-gray-600 leading-[1.6]">
              {showConfirm.message}
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(null)}
                className="px-5 py-2.5 text-[1.5rem] font-medium rounded-full border-[1.5px] border-gray-300 text-gray-500 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirm(null);
                  if (showConfirm.onConfirm) showConfirm.onConfirm();
                }}
                className={`px-5 py-2.5 text-[1.5rem] font-medium rounded-full text-white transition-colors ${
                  showConfirm.action === "reject" ||
                  showConfirm.action === "delete" ||
                  showConfirm.action === "remove-admin"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-brand-navy hover:bg-brand-navy-hover"
                }`}
              >
                {showConfirm.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
