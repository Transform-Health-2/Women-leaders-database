import React, { useState, useEffect, useMemo } from "react";
import { api } from "../api/leaders";
import { getCountriesForGeoScope, ALL_COUNTRIES } from "../utils/countries";

const GEO_SCOPES = [
  { value: "Global", label: "Global" },
  { value: "Africa", label: "Africa" },
  { value: "Americas", label: "Americas" },
  { value: "Asia", label: "Asia" },
  { value: "Europe", label: "Europe" },
  { value: "Oceania", label: "Oceania" },
  { value: "National", label: "National only" },
];
const YEARS_OPTIONS = ["0-2 yrs", "3-7 yrs", "8-15 yrs", "15+ yrs"];
const ITEM_TYPES = ["Publication", "Project", "Award", "Initiative", "Other"];

const INPUT_CLASS =
  "w-full px-[1.6rem] py-5 border-[1.5px] border-gray-300 rounded-lg text-1.5 outline-none bg-brand-blue-tint";
const LABEL_CLASS = "block text-1.5 text-brand-dark mb-2";
const NAV_CLASS = "flex justify-between items-center pt-5 mt-2";
const BACK_CLASS =
  "bg-transparent border-0 cursor-pointer text-1.4 font-bold text-brand-dark inline-flex items-center gap-2 tracking-[0.06em] uppercase";

function ContinueBtn({ disabled, onClick, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-transparent border-0 text-1.4 font-bold tracking-[0.06em] uppercase inline-flex items-center gap-2 ${
        disabled
          ? "cursor-not-allowed text-gray-300"
          : "cursor-pointer text-brand-orange"
      }`}
    >
      {children}
    </button>
  );
}

export default function ManageProfile({ prefill, onBack, fromMagicLink, tokenMode }) {
  const isMagicLink = !!fromMagicLink;

  // Mode A: send-link flow
  const [step, setStep] = useState("identify");
  const [firstName, setFirstName] = useState(prefill?.first_name || "");
  const [lastName, setLastName] = useState(prefill?.last_name || "");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState(prefill?.linkedin || "");
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkError, setLinkError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [foundProfile, setFoundProfile] = useState(null);
  const [selectedMode, setSelectedMode] = useState("");

  // Mode B: magic-link landing flow
  const [leaderData, setLeaderData] = useState(null);
  const [leaderLoading, setLeaderLoading] = useState(isMagicLink);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editOrg, setEditOrg] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editLinkedin, setEditLinkedin] = useState("");
  const [editExpertise, setEditExpertise] = useState("");
  const [editPhoto, setEditPhoto] = useState(null);
  const [editPhotoPreview, setEditPhotoPreview] = useState(null);
  const [editCountry, setEditCountry] = useState("");
  const [editYearsExp, setEditYearsExp] = useState("");
  const [editGeoScope, setEditGeoScope] = useState("");
  const [editCountries, setEditCountries] = useState([]);
  const [editNotableItems, setEditNotableItems] = useState([]);
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [fallbackUrl, setFallbackUrl] = useState("");

  // Token expiry check — 48 hours
  const TOKEN_TTL = 48 * 60 * 60 * 1000;

  useEffect(() => {
    if (isMagicLink && fromMagicLink?.leaderId) {
      const createdAt = fromMagicLink.createdAt;
      if (!createdAt || Date.now() - createdAt > TOKEN_TTL) {
        setStatus("error");
        setErrorMsg("This link has expired. Please request a new magic link.");
        return;
      }
      api.getLeaderById(fromMagicLink.leaderId)
        .then((data) => {
          if (!data) throw new Error("Profile not found");
          setLeaderData(data);
          setEditFirstName(data.first_name || "");
          setEditLastName(data.last_name || "");
          setEditRole(data.role || "");
          setEditOrg(data.organisation || "");
          setEditBio(data.bio || "");
          setEditLinkedin(data.linkedin || "");
          setEditCountry(data.country || "");
          setEditYearsExp(data.years_experience || "");
          setEditGeoScope(data.geo_scope || "");
          setEditCountries(Array.isArray(data.countries) ? data.countries : []);
          setEditNotableItems(Array.isArray(data.notable_items) ? data.notable_items : []);
          const exp = Array.isArray(data.expertise)
            ? data.expertise.join(", ")
            : data.expertise || "";
          setEditExpertise(exp);
          setStep(tokenMode === "delete" ? "delete-magic" : "edit-magic");
        })
        .catch((err) => {
          console.error("Failed to fetch leader:", err);
          setStatus("error");
          setErrorMsg(
            "Could not load your profile. The link may be invalid or expired."
          );
        })
        .finally(() => setLeaderLoading(false));
    }
  }, []);

  async function lookupProfile() {
    if (!firstName.trim() || !lastName.trim()) return;
    setLinkLoading(true);
    setLinkError("");
    setNotFound(false);
    setFoundProfile(null);
    try {
      const match = await api.findLeader({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
      });
      if (match) {
        setFoundProfile(match);
        const url = new URL(window.location);
        url.searchParams.set("profile", `${firstName.trim()} ${lastName.trim()}`);
        window.history.replaceState({}, "", url);
      }
      else setNotFound(true);
    } catch (err) {
      console.error("Profile lookup error:", err);
      setNotFound(true);
    } finally {
      setLinkLoading(false);
    }
  }

  function back() {
    if (isMagicLink) {
      onBack();
      return;
    }
    if (step === "send-link") {
      setSelectedMode("");
      setStep("identify");
    } else {
      onBack();
    }
  }

  async function sendMagicLink() {
    if (!foundProfile) return;
    setLinkLoading(true);
    setLinkError("");
    try {
      const result = await api.requestManage({
        leaderId: foundProfile.id,
        firstName: foundProfile.first_name,
        lastName: foundProfile.last_name,
        linkedin: foundProfile.linkedin || "",
        photo_url: foundProfile.photo_url || "",
        expertise: foundProfile.expertise || [],
        mode: selectedMode,
      });
      if (result.ok) {
        setStep("sent");
      } else {
        setStep("sent");
        setErrorMsg(result.message || "Email service unavailable.");
        setFallbackUrl(result.url || "");
      }
    } catch (err) {
      setLinkError("Failed to send magic link. Please try again.");
    } finally {
      setLinkLoading(false);
    }
  }

  async function saveViaMagicLink() {
    if (!leaderData) return;
    setStatus("submitting");
    setErrorMsg("");
    try {
      if (tokenMode === "delete") {
        await api.deleteByLeader(leaderData.id, reason.trim() || null);
        await api.logSelfService({
          leaderId: leaderData.id,
          firstName: leaderData.first_name,
          lastName: leaderData.last_name,
          action: "delete",
          details: reason.trim() || null,
        });
        await api.notifyAdmin({
          subject: "Profile deleted (self-service)",
          html: `<p>${leaderData.first_name} ${leaderData.last_name} has removed their profile from the Transform Health Women Leaders Directory.</p>${
            reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""
          }`,
        });
      } else {
        const updates = {};
        if (editFirstName !== (leaderData.first_name || ""))
          updates.first_name = editFirstName || null;
        if (editLastName !== (leaderData.last_name || ""))
          updates.last_name = editLastName || null;
        if (editRole !== (leaderData.role || ""))
          updates.role = editRole || null;
        if (editOrg !== (leaderData.organisation || ""))
          updates.organisation = editOrg || null;
        if (editBio !== (leaderData.bio || ""))
          updates.bio = editBio || null;
        if (editLinkedin !== (leaderData.linkedin || ""))
          updates.linkedin = editLinkedin || null;
        const newExp = editExpertise
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        const oldExp = Array.isArray(leaderData.expertise) ? leaderData.expertise : [];
        if (JSON.stringify(newExp) !== JSON.stringify(oldExp))
          updates.expertise = newExp;

        if (editCountry !== (leaderData.country || ""))
          updates.country = editCountry || null;
        if (editYearsExp !== (leaderData.years_experience || ""))
          updates.years_experience = editYearsExp || null;
        if (editGeoScope !== (leaderData.geo_scope || ""))
          updates.geo_scope = editGeoScope || null;
        const oldCountries = Array.isArray(leaderData.countries) ? leaderData.countries : [];
        if (JSON.stringify(editCountries) !== JSON.stringify(oldCountries))
          updates.countries = editCountries;
        const oldNotable = Array.isArray(leaderData.notable_items) ? leaderData.notable_items : [];
        const cleanNotable = editNotableItems.filter(n => n.title?.trim());
        if (JSON.stringify(cleanNotable) !== JSON.stringify(oldNotable))
          updates.notable_items = cleanNotable;

        if (editPhoto) {
          try {
            const photoUrl = await api.uploadPhoto(editPhoto);
            updates.photo_url = photoUrl;
          } catch (e) {
            console.error("Photo upload failed:", e);
          }
        }

        if (Object.keys(updates).length > 0) {
          await api.updateLeader(leaderData.id, updates);
          await api.logSelfService({
            leaderId: leaderData.id,
            firstName: leaderData.first_name,
            lastName: leaderData.last_name,
            action: "update",
            details: updates,
          });
        }
        await api.notifyAdmin({
          subject: "Profile updated (self-service)",
          html: `<p>${leaderData.first_name} ${leaderData.last_name} has updated their profile.</p><pre>${JSON.stringify(
            updates,
            null,
            2
          )}</pre>`,
        });
      }
      setStep("done");
    } catch (err) {
      console.error("Save failed:", err);
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  }

  // Auto-reload page after profile update/delete so data is fresh
  useEffect(() => {
    if (step === "done") {
      const timer = setTimeout(() => {
        window.location.href = `${window.location.origin}${window.location.pathname.split('?')[0]}`;
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // ---- SENT SCREEN (magic link sent) ----
  if (step === "sent") {
    return (
      <div className="bg-brand-cream min-h-[60vh] flex items-center justify-center p-6 font-sans">
        <div className="text-center max-w-[420px]">
          <div className="text-[4.8rem] mb-4">✉</div>
          <h2 className="text-3xl font-bold text-brand-navy mb-3">
            Check your email
          </h2>
          <p className="text-1.5 text-gray-600 leading-[1.7] mb-5">
            We&apos;ve sent a magic link to <strong>{email}</strong>.
            Click the link to{" "}
            {selectedMode === "delete" ? "remove" : "update"} your profile.
          </p>
          {errorMsg && (
            <div className="text-1.3 text-red-500 mb-4 bg-red-50 rounded-lg px-4 py-3">
              <p className="mb-2">{errorMsg}</p>
              {fallbackUrl && (
                <a
                  href={fallbackUrl}
                  className="inline-block text-1.2 font-semibold text-brand-navy underline break-all hover:text-brand-orange"
                >
                  {fallbackUrl}
                </a>
              )}
            </div>
          )}
          <button onClick={onBack} className={`${BACK_CLASS} mx-auto`}>
            ← CLOSE
          </button>
        </div>
      </div>
    );
  }

  // ---- DONE SCREEN (profile saved via magic link) ----
  if (step === "done") {
    return (
      <div className="bg-brand-cream min-h-[60vh] flex items-center justify-center p-6 font-sans">
        <div className="text-center max-w-[420px]">
          <div className="text-[4.8rem] mb-4">✓</div>
          <h2 className="text-3xl font-bold text-brand-navy mb-3">
            Profile {tokenMode === "delete" ? "removed" : "updated"}
          </h2>
          <p className="text-1.5 text-gray-600 leading-[1.7] mb-5">
            {tokenMode === "delete"
              ? "Your profile has been removed from the directory."
              : "Your profile changes have been saved."}
          </p>
          <button onClick={onBack} className={`${BACK_CLASS} mx-auto`}>
            ← CLOSE
          </button>
        </div>
      </div>
    );
  }

  // ---- ERROR / LOADING (magic link landing) ----
  if (isMagicLink && status === "error" && !leaderData) {
    return (
      <div className="bg-brand-cream min-h-[60vh] flex items-center justify-center p-6 font-sans">
        <div className="text-center max-w-[420px]">
          <div className="text-[4.8rem] mb-4">!</div>
          <h2 className="text-3xl font-bold text-brand-navy mb-3">
            Link invalid
          </h2>
          <p className="text-1.5 text-gray-600 leading-[1.7] mb-5">
            {errorMsg}
          </p>
          <button onClick={onBack} className={`${BACK_CLASS} mx-auto`}>
            ← CLOSE
          </button>
        </div>
      </div>
    );
  }

  if (leaderLoading) {
    return (
      <div className="bg-brand-cream min-h-[40vh] flex items-center justify-center p-6 font-sans">
        <p className="text-1.5 text-gray-500">Loading your profile...</p>
      </div>
    );
  }

  // ---- MAIN RENDER ----
  return (
    <div className="bg-brand-cream font-sans">
      <div className="max-w-[640px] mx-auto px-6 py-8">
        {/* MODE A: IDENTIFY / FIND PROFILE */}
        {!isMagicLink && step === "identify" && (
          <div>
            <h2 className="text-[2.6rem] font-bold text-brand-navy mb-2">
              Manage your profile
            </h2>
            <p className="text-1.4 text-gray-600 leading-[1.7] mb-7">
              Enter your details to find your profile. We&apos;ll send a magic
              link to your email so you can update or remove it.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className={LABEL_CLASS}>First name</label>
                <input
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setNotFound(false);
                  }}
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Last name</label>
                <input
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setNotFound(false);
                  }}
                  className={INPUT_CLASS}
                />
              </div>
            </div>

            <div className="mb-5">
              <label className={LABEL_CLASS}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Used to verify your identity and send your profile link"
                required
                className={INPUT_CLASS}
              />
            </div>

            <div className="mb-6">
              <label className={LABEL_CLASS}>
                LinkedIn profile{" "}
                <span className="text-1.3 text-gray-400 font-normal">
                  (optional — helps us find you)
                </span>
              </label>
              <input
                value={linkedin}
                onChange={(e) => {
                  setLinkedin(e.target.value);
                  setNotFound(false);
                }}
                className={INPUT_CLASS}
              />
            </div>

            {notFound && (
              <div className="border-l-4 border-gray-300 bg-gray-50 rounded-lg px-7 py-5 mb-5">
                <p className="text-1.4 font-semibold text-brand-dark mb-1">
                  Profile not found
                </p>
                <p className="text-1.3 text-gray-500">
                  We couldn&apos;t find a profile matching those details. Try
                  your LinkedIn URL or contact the admin team.
                </p>
              </div>
            )}

            {foundProfile && (
              <div className="border-[1.5px] border-brand-navy rounded-lg px-5 py-4 mb-5 bg-brand-blue-tint">
                <p className="text-1.2 font-semibold text-brand-navy uppercase tracking-[0.06em] mb-2.5">
                  Profile found
                </p>
                <p className="text-1.5 font-bold text-brand-dark mb-1">
                  {foundProfile.first_name} {foundProfile.last_name}
                </p>
                <p className="text-1.3 text-gray-600">
                  {foundProfile.role} · {foundProfile.organisation}
                </p>
              </div>
            )}

            {!foundProfile && (
              <div className={NAV_CLASS}>
                <button onClick={onBack} className={BACK_CLASS}>
                  ← BACK
                </button>
                <ContinueBtn
                  disabled={
                    !firstName.trim() ||
                    !lastName.trim() ||
                    !email.trim() ||
                    linkLoading
                  }
                  onClick={lookupProfile}
                >
                  {linkLoading ? "SEARCHING..." : "FIND MY PROFILE →"}
                </ContinueBtn>
              </div>
            )}

            {foundProfile && (
              <div className="mt-6 pt-5 border-t border-gray-200">
                <p className="text-1.3 text-gray-500 mb-4 text-center">
                  What would you like to do?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setSelectedMode("update");
                      setStep("send-link");
                    }}
                    disabled={!email.trim()}
                    className={`px-4 py-5 rounded-lg border-[1.5px] bg-white text-1.4 font-bold tracking-[0.04em] transition-colors ${
                      email.trim()
                        ? "border-brand-navy text-brand-navy cursor-pointer hover:bg-brand-blue-tint"
                        : "border-gray-300 text-gray-400 cursor-not-allowed opacity-50"
                    }`}
                  >
                    Update profile
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMode("delete");
                      setStep("send-link");
                    }}
                    disabled={!email.trim()}
                    className={`px-4 py-5 rounded-lg border-[1.5px] bg-white text-1.4 font-bold tracking-[0.04em] transition-colors ${
                      email.trim()
                        ? "border-red-500 text-red-500 cursor-pointer hover:bg-red-50"
                        : "border-gray-300 text-gray-400 cursor-not-allowed opacity-50"
                    }`}
                  >
                    Remove profile
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODE A: SEND MAGIC LINK CONFIRMATION */}
        {!isMagicLink && step === "send-link" && foundProfile && (
          <div>
            <h2 className="text-[2.6rem] font-bold text-brand-navy mb-2">
              {selectedMode === "delete"
                ? "Remove your profile"
                : "Update your profile"}
            </h2>
            <p className="text-1.4 text-gray-600 leading-[1.7] mb-6">
              We&apos;ll send a magic link to your email address. Click the link
              to {selectedMode === "delete" ? "remove" : "update"} your profile
              directly — no admin needed.
            </p>

            <div className="border-[1.5px] border-gray-300 rounded-lg px-7 py-5 mb-7 bg-brand-blue-tint">
              <p className="text-1.5 font-bold text-brand-dark mb-0.5">
                {foundProfile.first_name} {foundProfile.last_name}
              </p>
              <p className="text-1.3 text-gray-600">
                {foundProfile.role} · {foundProfile.organisation}
              </p>
              <p className="text-1.3 text-gray-400 mt-2">
                Magic link will be sent to: <strong>{email}</strong>
              </p>
            </div>

            {linkError && (
              <p className="text-1.3 text-red-500 mb-4">{linkError}</p>
            )}

            <div className={NAV_CLASS}>
              <button onClick={() => setStep("identify")} className={BACK_CLASS}>
                ← BACK
              </button>
              <ContinueBtn disabled={linkLoading} onClick={sendMagicLink}>
                {linkLoading ? "SENDING..." : "SEND MAGIC LINK →"}
              </ContinueBtn>
            </div>
          </div>
        )}

        {/* MODE B: EDIT FORM (via magic link) */}
        {isMagicLink && step === "edit-magic" && leaderData && (() => {
          const missing = new Set();
          if (!leaderData.bio) missing.add("bio");
          if (!leaderData.country) missing.add("country");
          if (!leaderData.years_experience) missing.add("yearsExp");
          if (!leaderData.geo_scope) missing.add("geoScope");
          if (!leaderData.photo_url) missing.add("photo");
          if (!leaderData.expertise || leaderData.expertise.length === 0) missing.add("expertise");
          if (!leaderData.countries || leaderData.countries.length === 0) missing.add("countries");
          if (!leaderData.notable_items || leaderData.notable_items.length === 0) missing.add("notable");

          const MissingBadge = () => (
            <span className="ml-2 text-[1.1rem] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              Missing
            </span>
          );

          const countryOptions = editGeoScope ? getCountriesForGeoScope(editGeoScope) : ALL_COUNTRIES;

          function toggleCountry(c) {
            setEditCountries(prev =>
              prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
            );
          }

          function addNotableItem() {
            if (editNotableItems.length >= 3) return;
            setEditNotableItems(prev => [...prev, { title: "", link: "", type: "Publication" }]);
          }

          function updateNotableItem(i, field, val) {
            setEditNotableItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
          }

          function removeNotableItem(i) {
            setEditNotableItems(prev => prev.filter((_, idx) => idx !== i));
          }

          return (
            <div>
              <h2 className="text-[2.6rem] font-bold text-brand-navy mb-2">
                Update your profile
              </h2>
              {missing.size > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-6">
                  <p className="text-[1.4rem] font-semibold text-amber-800 mb-1">
                    Your profile needs a little love 💕
                  </p>
                  <p className="text-[1.3rem] text-amber-700">
                    Fields marked <span className="font-semibold">Missing</span> below are empty — filling them in makes your profile more discoverable.
                  </p>
                </div>
              )}

              <div className="space-y-5">
                {/* Basic info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL_CLASS}>First name</label>
                    <input value={editFirstName} onChange={(e) => setEditFirstName(e.target.value)} className={INPUT_CLASS} />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Last name</label>
                    <input value={editLastName} onChange={(e) => setEditLastName(e.target.value)} className={INPUT_CLASS} />
                  </div>
                </div>
                <div>
                  <label className={LABEL_CLASS}>Role / Title</label>
                  <input value={editRole} onChange={(e) => setEditRole(e.target.value)} className={INPUT_CLASS} />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Organisation</label>
                  <input value={editOrg} onChange={(e) => setEditOrg(e.target.value)} className={INPUT_CLASS} />
                </div>

                {/* Photo */}
                <div>
                  <label className={LABEL_CLASS}>
                    Profile photo {missing.has("photo") && <MissingBadge />}
                  </label>
                  {leaderData.photo_url && !editPhotoPreview && (
                    <img src={leaderData.photo_url} alt="Current" className="w-16 h-16 rounded-full object-cover border-2 border-brand-pink mb-2" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) { setEditPhoto(f); setEditPhotoPreview(URL.createObjectURL(f)); }
                    }}
                    className={`${INPUT_CLASS} cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[1.3rem] file:font-semibold file:bg-brand-blue-tint file:text-brand-navy hover:file:bg-blue-100`}
                  />
                  {editPhotoPreview && (
                    <div className="mt-3 flex items-center gap-3">
                      <img src={editPhotoPreview} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-brand-pink" />
                      <button onClick={() => { setEditPhoto(null); setEditPhotoPreview(null); }} className="text-[1.3rem] text-red-500 hover:underline cursor-pointer">Remove</button>
                    </div>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className={LABEL_CLASS}>
                    Biography {missing.has("bio") && <MissingBadge />}
                  </label>
                  <p className="text-[1.2rem] text-gray-500 mb-1">A short paragraph about your background, focus areas, and impact.</p>
                  <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} rows={4} className={`${INPUT_CLASS} resize-none`} />
                </div>

                {/* LinkedIn */}
                <div>
                  <label className={LABEL_CLASS}>LinkedIn URL</label>
                  <input value={editLinkedin} onChange={(e) => setEditLinkedin(e.target.value)} className={INPUT_CLASS} placeholder="https://linkedin.com/in/yourname" />
                </div>

                {/* Expertise */}
                <div>
                  <label className={LABEL_CLASS}>
                    Expertise {missing.has("expertise") && <MissingBadge />}
                  </label>
                  <p className="text-[1.2rem] text-gray-500 mb-1">Your areas of specialisation, comma-separated (e.g. Digital Health, AI & Automation).</p>
                  <input value={editExpertise} onChange={(e) => setEditExpertise(e.target.value)} className={INPUT_CLASS} placeholder="e.g. Digital Health, Health Systems, Policy" />
                </div>

                {/* Country + Years experience */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL_CLASS}>
                      Country {missing.has("country") && <MissingBadge />}
                    </label>
                    <select value={editCountry} onChange={(e) => setEditCountry(e.target.value)} className={`${INPUT_CLASS} ${!editCountry ? "text-gray-400" : "text-gray-900"}`}>
                      <option value="">Select country…</option>
                      {ALL_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>
                      Years of experience {missing.has("yearsExp") && <MissingBadge />}
                    </label>
                    <select value={editYearsExp} onChange={(e) => setEditYearsExp(e.target.value)} className={`${INPUT_CLASS} ${!editYearsExp ? "text-gray-400" : "text-gray-900"}`}>
                      <option value="">Select…</option>
                      {YEARS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>

                {/* Geo scope */}
                <div>
                  <label className={LABEL_CLASS}>
                    Geographical scope {missing.has("geoScope") && <MissingBadge />}
                  </label>
                  <p className="text-[1.2rem] text-gray-500 mb-1">The region where most of your work takes place.</p>
                  <select value={editGeoScope} onChange={(e) => { setEditGeoScope(e.target.value); setEditCountries([]); }} className={`${INPUT_CLASS} ${!editGeoScope ? "text-gray-400" : "text-gray-900"}`}>
                    <option value="">Select scope…</option>
                    {GEO_SCOPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>

                {/* Countries of work */}
                <div>
                  <label className={LABEL_CLASS}>
                    Countries of work {missing.has("countries") && <MissingBadge />}
                  </label>
                  <p className="text-[1.2rem] text-gray-500 mb-2">Select all countries where you actively work or have worked.</p>
                  <div className="border border-gray-300 rounded-lg bg-brand-blue-tint max-h-[180px] overflow-y-auto px-3 py-2 flex flex-col gap-1">
                    {countryOptions.map(c => (
                      <label key={c} className="flex items-center gap-2 cursor-pointer py-0.5">
                        <input
                          type="checkbox"
                          checked={editCountries.includes(c)}
                          onChange={() => toggleCountry(c)}
                          className="accent-brand-pink w-4 h-4 flex-shrink-0"
                        />
                        <span className="text-[1.3rem] text-gray-800">{c}</span>
                      </label>
                    ))}
                  </div>
                  {editCountries.length > 0 && (
                    <p className="text-[1.2rem] text-brand-navy mt-1">Selected: {editCountries.join(", ")}</p>
                  )}
                </div>

                {/* Notable items */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className={LABEL_CLASS + " mb-0"}>
                      Notable work {missing.has("notable") && <MissingBadge />}
                    </label>
                    {editNotableItems.length < 3 && (
                      <button onClick={addNotableItem} className="text-[1.3rem] text-brand-pink font-semibold hover:underline cursor-pointer">
                        + Add item
                      </button>
                    )}
                  </div>
                  <p className="text-[1.2rem] text-gray-500 mb-2">Publications, projects, awards, or initiatives — up to 3.</p>
                  {editNotableItems.length === 0 && (
                    <button onClick={addNotableItem} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-[1.3rem] text-gray-500 hover:border-brand-pink hover:text-brand-pink transition-colors cursor-pointer">
                      + Add your first notable item
                    </button>
                  )}
                  <div className="space-y-3">
                    {editNotableItems.map((item, i) => (
                      <div key={i} className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[1.3rem] font-semibold text-brand-navy">Item {i + 1}</span>
                          <button onClick={() => removeNotableItem(i)} className="text-[1.2rem] text-red-400 hover:text-red-600 cursor-pointer">Remove</button>
                        </div>
                        <input
                          value={item.title}
                          onChange={(e) => updateNotableItem(i, "title", e.target.value)}
                          placeholder="Title (e.g. Global Health Report 2024)"
                          className={INPUT_CLASS}
                        />
                        <input
                          value={item.link}
                          onChange={(e) => updateNotableItem(i, "link", e.target.value)}
                          placeholder="Link (optional)"
                          className={INPUT_CLASS}
                        />
                        <select
                          value={item.type}
                          onChange={(e) => updateNotableItem(i, "type", e.target.value)}
                          className={INPUT_CLASS}
                        >
                          {ITEM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {errorMsg && <p className="text-1.3 text-red-500 mt-4">{errorMsg}</p>}

              <div className={NAV_CLASS}>
                <button onClick={onBack} className={BACK_CLASS}>← CLOSE</button>
                <ContinueBtn disabled={status === "submitting"} onClick={saveViaMagicLink}>
                  {status === "submitting" ? "SAVING..." : "SAVE CHANGES →"}
                </ContinueBtn>
              </div>
            </div>
          );
        })()}

        {/* MODE B: DELETE CONFIRMATION (via magic link) */}
        {isMagicLink && step === "delete-magic" && leaderData && (
          <div>
            <h2 className="text-[2.6rem] font-bold text-red-500 mb-2">
              Remove your profile
            </h2>
            <p className="text-1.4 text-gray-600 leading-[1.7] mb-6">
              Are you sure you want to remove your profile from the directory?
              This action is permanent.
            </p>

            <div className="border-[1.5px] border-gray-300 rounded-lg px-7 py-5 mb-6 bg-brand-blue-tint">
              <p className="text-1.5 font-bold text-brand-dark mb-0.5">
                {leaderData.first_name} {leaderData.last_name}
              </p>
              <p className="text-1.3 text-gray-600">
                {leaderData.role} · {leaderData.organisation}
              </p>
            </div>

            <div className="mb-5">
              <label className={LABEL_CLASS}>
                Reason{" "}
                <span className="text-1.3 text-gray-400 font-normal">
                  (optional)
                </span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. No longer in this role, prefer not to be listed..."
                rows={4}
                className={`${INPUT_CLASS} resize-none`}
              />
            </div>

            {errorMsg && (
              <p className="text-1.3 text-red-500 mb-4">{errorMsg}</p>
            )}

            <div className={NAV_CLASS}>
              <button onClick={onBack} className={BACK_CLASS}>
                ← CLOSE
              </button>
              <ContinueBtn
                disabled={status === "submitting"}
                onClick={saveViaMagicLink}
              >
                {status === "submitting"
                  ? "REMOVING..."
                  : "REMOVE MY PROFILE →"}
              </ContinueBtn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
