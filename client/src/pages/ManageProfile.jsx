import React, { useState } from "react";
import axios from "axios";
import { MOCK_LEADERS } from "../data/mockData";

const INPUT_CLASS = "w-full px-[1.6rem] py-[1.4rem] border-[1.5px] border-gray-300 rounded-[10px] text-[1.5rem] outline-none bg-brand-blue-tint";
const LABEL_CLASS = "block text-[1.5rem] text-[#111] mb-2";
const NAV_CLASS  = "flex justify-between items-center pt-5 mt-2";
const BACK_CLASS = "bg-transparent border-0 cursor-pointer text-[1.4rem] font-bold text-[#111] inline-flex items-center gap-2 tracking-[0.06em] uppercase";

function ContinueBtn({ disabled, onClick, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-transparent border-0 text-[1.4rem] font-bold tracking-[0.06em] uppercase inline-flex items-center gap-2 ${
        disabled ? "cursor-not-allowed text-[#ccc]" : "cursor-pointer text-[#E8571D]"
      }`}
    >
      {children}
    </button>
  );
}

export default function ManageProfile({ prefill, onBack }) {
  const isVerified = prefill?._verified === true;

  const [step, setStep] = useState(isVerified ? "edit" : "identify");
  const [requestType, setRequestType] = useState("");
  const [firstName, setFirstName] = useState(prefill?.first_name || "");
  const [lastName, setLastName] = useState(prefill?.last_name || "");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState(prefill?.linkedin || "");
  const [changes, setChanges] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkError, setLinkError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [foundProfile, setFoundProfile] = useState(null);

  async function requestMagicLink() {
    if (!email) return;
    setLinkLoading(true);
    setLinkError("");
    try {
      const url = import.meta.env.VITE_APPS_SCRIPT_URL || "";
      if (!url) {
        setLinkSent(true);
        return;
      }
      const r = await axios.post(
        url,
        { action: "sendProfileLink", firstName, lastName, email, linkedin },
        { headers: { "Content-Type": "application/json" } }
      );
      if (r.data?.ok) setLinkSent(true);
      else if (r.data?.error === "not_found")
        setLinkError("We couldn't find a profile matching those details.");
      else setLinkError("Something went wrong. Please try again.");
    } catch {
      setLinkError("Something went wrong. Please try again.");
    } finally {
      setLinkLoading(false);
    }
  }

  function lookupProfile() {
    if (!firstName.trim() || !lastName.trim()) return;
    const q = firstName.trim().toLowerCase();
    const match = MOCK_LEADERS.find(
      (l) =>
        l.first_name.toLowerCase().includes(q) ||
        l.last_name.toLowerCase().includes(q) ||
        (l.first_name + " " + l.last_name)
          .toLowerCase()
          .includes(q + " " + lastName.trim().toLowerCase())
    );
    if (match) {
      setFoundProfile(match);
      setNotFound(false);
    } else {
      setNotFound(true);
      setFoundProfile(null);
    }
  }

  function back() {
    if (step === "edit" || step === "remove") setStep("identify");
    else onBack();
  }

  async function submit() {
    setStatus("submitting");
    try {
      const url = import.meta.env.VITE_APPS_SCRIPT_URL || "";
      if (!url) {
        setTimeout(() => setStatus("submitted"), 1000);
        return;
      }
      const payload = {
        action: "profileRequest",
        requestType,
        firstName: foundProfile?.first_name || firstName,
        lastName: foundProfile?.last_name || lastName,
        email,
        linkedin: foundProfile?.linkedin || linkedin,
        changes: requestType === "update" ? changes : "",
        reason: requestType === "delete" ? reason : "",
      };
      const r = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });
      if (r.data?.ok) setStatus("submitted");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "submitted") {
    return (
      <div className="bg-brand-cream min-h-[60vh] flex items-center justify-center p-6 font-sans">
        <div className="text-center max-w-[420px]">
          <div className="text-[4.8rem] mb-4">
            {requestType === "delete" ? "✓" : "★"}
          </div>
          <h2 className="text-[2.4rem] font-bold text-brand-navy mb-3">
            Request received
          </h2>
          <p className="text-[1.5rem] text-[#444] leading-[1.7] mb-5">
            {requestType === "delete"
              ? "Your removal request has been sent. The admin team will process it shortly."
              : "Your update request has been sent. The admin team will review and apply the changes shortly."}
          </p>
          <p className="text-[1.3rem] text-gray-400">
            You'll be notified by email at {email}
          </p>
        </div>
      </div>
    );
  }

  if (linkSent) {
    return (
      <div className="bg-brand-cream min-h-[60vh] flex items-center justify-center p-6 font-sans">
        <div className="text-center max-w-[420px]">
          <div className="text-[4.8rem] mb-4">✉</div>
          <h2 className="text-[2.4rem] font-bold text-brand-navy mb-3">
            Check your inbox
          </h2>
          <p className="text-[1.5rem] text-[#444] leading-[1.7] mb-2">
            We've sent your profile link to <strong>{email}</strong>.
          </p>
          <p className="text-[1.3rem] text-gray-400 mb-5">
            The link can only be used once. Check your spam folder if you don't
            see it.
          </p>
          <button
            onClick={() => {
              setLinkSent(false);
              setLinkError("");
            }}
            className="bg-transparent border-0 cursor-pointer text-[1.3rem] text-brand-navy underline"
          >
            Try again with a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream font-sans">
      <div className="max-w-[640px] mx-auto px-6 py-8">
        {step === "identify" && (
          <div>
            <h2 className="text-[2.6rem] font-bold text-brand-navy mb-2">
              Manage your profile
            </h2>
            <p className="text-[1.4rem] text-[#444] leading-[1.7] mb-7">
              Enter your details to find and update or remove your profile from
              the database.
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
                placeholder="We'll send your profile link here — not stored"
                className={INPUT_CLASS}
              />
            </div>

            <div className="mb-6">
              <label className={LABEL_CLASS}>
                LinkedIn profile{" "}
                <span className="text-[1.3rem] text-gray-400 font-normal">
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
              <div className="border-l-4 border-gray-300 bg-[#f9fafb] rounded-lg px-[1.8rem] py-[1.4rem] mb-5">
                <p className="text-[1.4rem] font-semibold text-[#111] mb-1">
                  Profile not found
                </p>
                <p className="text-[1.3rem] text-[#666]">
                  We couldn't find a profile matching those details. Try your
                  LinkedIn URL or contact the admin team.
                </p>
              </div>
            )}

            {foundProfile && (
              <div className="border-[1.5px] border-brand-navy rounded-[10px] px-5 py-4 mb-5 bg-brand-blue-tint">
                <p className="text-[1.2rem] font-semibold text-brand-navy uppercase tracking-[0.06em] mb-2.5">
                  Profile found
                </p>
                <p className="text-[1.5rem] font-bold text-[#111] mb-1">
                  {foundProfile.first_name} {foundProfile.last_name}
                </p>
                <p className="text-[1.3rem] text-[#555]">
                  {foundProfile.role} · {foundProfile.organisation}
                </p>
              </div>
            )}

            <div className={NAV_CLASS}>
              <button onClick={onBack} className={BACK_CLASS}>
                ← BACK
              </button>
              <ContinueBtn
                disabled={!firstName || !lastName}
                onClick={lookupProfile}
              >
                FIND MY PROFILE →
              </ContinueBtn>
            </div>

            {foundProfile && (
              <div className="mt-6 pt-5 border-t border-[#e5e7eb]">
                <p className="text-[1.3rem] text-[#666] mb-4 text-center">
                  What would you like to do?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setRequestType("update");
                      setStep("edit");
                    }}
                    className="px-4 py-[1.4rem] rounded-[10px] border-[1.5px] border-brand-navy bg-white text-brand-navy text-[1.4rem] font-bold cursor-pointer tracking-[0.04em] hover:bg-brand-blue-tint transition-colors"
                  >
                    Update profile
                  </button>
                  <button
                    onClick={() => {
                      setRequestType("delete");
                      setStep("remove");
                    }}
                    className="px-4 py-[1.4rem] rounded-[10px] border-[1.5px] border-red-500 bg-white text-red-500 text-[1.4rem] font-bold cursor-pointer tracking-[0.04em] hover:bg-red-50 transition-colors"
                  >
                    Remove profile
                  </button>
                </div>
              </div>
            )}

            {foundProfile && (
              <div className="mt-4 text-center">
                <button
                  onClick={requestMagicLink}
                  disabled={linkLoading || !email}
                  className={`bg-transparent border-0 cursor-pointer text-[1.3rem] text-brand-navy underline transition-opacity ${
                    !email || linkLoading ? "opacity-40" : "opacity-100"
                  }`}
                >
                  {linkLoading
                    ? "Sending..."
                    : "Or send my profile to this email instead →"}
                </button>
                {linkError && (
                  <p className="text-[1.3rem] text-red-500 mt-1.5">{linkError}</p>
                )}
              </div>
            )}
          </div>
        )}

        {(step === "edit" || step === "remove") && (
          <div>
            {foundProfile && (
              <div className="border-[1.5px] border-gray-300 rounded-[10px] px-[1.8rem] py-[1.4rem] mb-7 bg-brand-blue-tint">
                <p className="text-[1.5rem] font-bold text-[#111] mb-0.5">
                  {foundProfile.first_name} {foundProfile.last_name}
                </p>
                <p className="text-[1.3rem] text-[#555]">
                  {foundProfile.role} · {foundProfile.organisation}
                </p>
              </div>
            )}

            {step === "edit" ? (
              <>
                <h2 className="text-[2.6rem] font-bold text-brand-navy mb-2">
                  Update your profile
                </h2>
                <p className="text-[1.4rem] text-[#444] leading-[1.7] mb-6">
                  Describe what you'd like to change — role, organisation, bio,
                  expertise, or LinkedIn.
                </p>

                {foundProfile && (
                  <div className="border-l-4 border-gray-300 bg-[#f9fafb] rounded-lg px-[1.8rem] py-[1.4rem] mb-5">
                    <p className="text-[1.2rem] text-gray-400 font-semibold uppercase tracking-[0.06em] mb-2">
                      Current details
                    </p>
                    {foundProfile.role && (
                      <p className="text-[1.3rem] text-[#555] mb-1">
                        <strong>Role:</strong> {foundProfile.role}
                      </p>
                    )}
                    {foundProfile.organisation && (
                      <p className="text-[1.3rem] text-[#555] mb-1">
                        <strong>Organisation:</strong>{" "}
                        {foundProfile.organisation}
                      </p>
                    )}
                    {foundProfile.bio && (
                      <p className="text-[1.3rem] text-[#555] mb-1">
                        <strong>Bio:</strong> {foundProfile.bio}
                      </p>
                    )}
                    {foundProfile.expertise && (
                      <p className="text-[1.3rem] text-[#555]">
                        <strong>Expertise:</strong> {foundProfile.expertise}
                      </p>
                    )}
                  </div>
                )}

                <div className="mb-6">
                  <label className={LABEL_CLASS}>
                    What would you like to change?
                  </label>
                  <textarea
                    value={changes}
                    onChange={(e) => setChanges(e.target.value)}
                    placeholder="e.g. New role: Chief Digital Officer at WHO. Update bio to: ..."
                    rows={6}
                    className={`${INPUT_CLASS} resize-none`}
                  />
                </div>

                <div className={NAV_CLASS}>
                  <button onClick={back} className={BACK_CLASS}>
                    ← BACK
                  </button>
                  <ContinueBtn disabled={!changes} onClick={() => setStep("review")}>
                    REVIEW →
                  </ContinueBtn>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-[2.6rem] font-bold text-red-500 mb-2">
                  Remove your profile
                </h2>
                <p className="text-[1.4rem] text-[#444] leading-[1.7] mb-6">
                  Optional — let us know why. This helps us improve the
                  database.
                </p>

                <div className="mb-5">
                  <label className={LABEL_CLASS}>
                    Reason{" "}
                    <span className="text-[1.3rem] text-gray-400 font-normal">
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

                <div className="border-l-4 border-red-300 bg-red-50 rounded-lg px-[1.8rem] py-[1.4rem] mb-6">
                  <p className="text-[1.3rem] text-[#666]">
                    Your profile will be removed from the public database after
                    admin review.
                  </p>
                </div>

                <div className={NAV_CLASS}>
                  <button onClick={back} className={BACK_CLASS}>
                    ← BACK
                  </button>
                  <ContinueBtn disabled={false} onClick={() => setStep("review")}>
                    REVIEW →
                  </ContinueBtn>
                </div>
              </>
            )}
          </div>
        )}

        {step === "review" && (
          <div>
            <h2 className="text-[2.6rem] font-bold text-brand-navy mb-7">
              Review your request
            </h2>

            {(foundProfile || firstName) && (
              <div className="border-[1.5px] border-gray-300 rounded-[10px] px-[1.8rem] py-[1.4rem] mb-5 bg-brand-blue-tint">
                <p className="text-[1.5rem] font-bold text-[#111] mb-0.5">
                  {foundProfile?.first_name || firstName}{" "}
                  {foundProfile?.last_name || lastName}
                </p>
                <p className="text-[1.3rem] text-gray-400">{email}</p>
              </div>
            )}

            <div className="border-[1.5px] border-gray-300 rounded-[10px] overflow-hidden mb-6">
              <div className="flex justify-between items-center px-[1.8rem] py-[1.4rem] border-b border-[#e5e7eb]">
                <span className="text-[1.4rem] text-[#666]">Request type</span>
                <span
                  className={`text-[1.3rem] font-bold ${
                    requestType === "delete" ? "text-red-500" : "text-brand-navy"
                  }`}
                >
                  {requestType === "delete"
                    ? "Remove profile"
                    : "Update profile"}
                </span>
              </div>
              {requestType === "update" && changes && (
                <div className="px-[1.8rem] py-[1.4rem]">
                  <p className="text-[1.3rem] text-[#666] mb-1.5">
                    Changes requested
                  </p>
                  <p className="text-[1.4rem] text-[#111] leading-[1.6]">
                    {changes}
                  </p>
                </div>
              )}
              {requestType === "delete" && reason && (
                <div className="px-[1.8rem] py-[1.4rem]">
                  <p className="text-[1.3rem] text-[#666] mb-1.5">Reason</p>
                  <p className="text-[1.4rem] text-[#111] leading-[1.6]">
                    {reason}
                  </p>
                </div>
              )}
            </div>

            {status === "error" && (
              <p className="text-[1.3rem] text-red-500 mb-4">
                Something went wrong. Please try again.
              </p>
            )}

            <div className={NAV_CLASS}>
              <button
                onClick={() =>
                  setStep(requestType === "delete" ? "remove" : "edit")
                }
                className={BACK_CLASS}
              >
                ← BACK
              </button>
              <ContinueBtn
                disabled={status === "submitting"}
                onClick={submit}
              >
                {status === "submitting" ? "SUBMITTING..." : "SUBMIT REQUEST →"}
              </ContinueBtn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
