import React, { useState } from 'react'
import axios from 'axios'
import { MOCK_LEADERS } from '../data/mockData'

export default function ManageProfile({ prefill, onBack }) {
  const isVerified = prefill?._verified === true

  const [step, setStep] = useState(isVerified ? 'edit' : 'identify')
  const [requestType, setRequestType] = useState('')
  const [firstName, setFirstName] = useState(prefill?.first_name || '')
  const [lastName, setLastName] = useState(prefill?.last_name || '')
  const [email, setEmail] = useState('')
  const [linkedin, setLinkedin] = useState(prefill?.linkedin || '')
  const [changes, setChanges] = useState('')
  const [reason, setReason] = useState('')
  const [status, setStatus] = useState('')
  const [linkSent, setLinkSent] = useState(false)
  const [linkLoading, setLinkLoading] = useState(false)
  const [linkError, setLinkError] = useState('')
  const [notFound, setNotFound] = useState(false)
  const [foundProfile, setFoundProfile] = useState(null)

  async function requestMagicLink() {
    if (!email) return
    setLinkLoading(true)
    setLinkError('')
    try {
      const url = import.meta.env.VITE_APPS_SCRIPT_URL || ''
      if (!url) {
        setLinkSent(true)
        return
      }
      const r = await axios.post(
        url,
        { action: 'sendProfileLink', firstName, lastName, email, linkedin },
        { headers: { 'Content-Type': 'application/json' } }
      )
      if (r.data?.ok) {
        setLinkSent(true)
      } else if (r.data?.error === 'not_found') {
        setLinkError("We couldn't find a profile matching those details.")
      } else {
        setLinkError('Something went wrong. Please try again.')
      }
    } catch (err) {
      console.error(err)
      setLinkError('Something went wrong. Please try again.')
    } finally {
      setLinkLoading(false)
    }
  }

  function lookupProfile() {
    if (!firstName.trim() || !lastName.trim()) return
    const q = firstName.trim().toLowerCase()
    const match = MOCK_LEADERS.find(
      (l) =>
        l.first_name.toLowerCase().includes(q) ||
        l.last_name.toLowerCase().includes(q) ||
        (l.first_name + ' ' + l.last_name).toLowerCase().includes(q + ' ' + lastName.trim().toLowerCase())
    )
    if (match) {
      setFoundProfile(match)
      setNotFound(false)
    } else {
      setNotFound(true)
      setFoundProfile(null)
    }
  }

  function startEdit() {
    setStep('edit')
  }

  function startRemove() {
    setRequestType('delete')
    setStep('remove')
  }

  function back() {
    if (step === 'edit' || step === 'remove') {
      setStep('identify')
    } else {
      onBack()
    }
  }

  async function submit() {
    setStatus('submitting')
    try {
      const url = import.meta.env.VITE_APPS_SCRIPT_URL || ''
      if (!url) {
        setTimeout(() => setStatus('submitted'), 1000)
        return
      }
      const payload = {
        action: 'profileRequest',
        requestType,
        firstName: foundProfile?.first_name || firstName,
        lastName: foundProfile?.last_name || lastName,
        email,
        linkedin: foundProfile?.linkedin || linkedin,
        changes: requestType === 'update' ? changes : '',
        reason: requestType === 'delete' ? reason : '',
      }
      const r = await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json' },
      })
      if (r.data?.ok) setStatus('submitted')
      else setStatus('error')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  if (status === 'submitted') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center max-w-md">
          <div className="text-4xl mb-4">{requestType === 'delete' ? '✓' : '★'}</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Request received</h2>
          <p className="text-gray-600 mb-4">
            {requestType === 'delete'
              ? 'Your removal request has been sent. The admin team will process it shortly.'
              : 'Your update request has been sent. The admin team will review and apply the changes shortly.'}
          </p>
          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
            You'll be notified by email at {email}
          </div>
        </div>
      </div>
    )
  }

  if (linkSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center max-w-md">
          <div className="text-4xl mb-4">✉</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Check your inbox</h2>
          <p className="text-gray-600 text-sm mb-4">
            We've sent your current profile details to <span className="font-medium">{email}</span>.
          </p>
          <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded">
            The link can only be used once. Check your spam folder if you don't see it.
          </div>
          <button
            onClick={() => { setLinkSent(false); setLinkError(''); }}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Try again with a different email
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Manage My Profile
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6">
        {step === 'identify' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium mb-1">Find your profile</h2>
            <p className="text-sm text-gray-500 mb-5">
              Enter your details to view and manage your current profile.
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First name
                  </label>
                  <input
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value); setNotFound(false); }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last name
                  </label>
                  <input
                    value={lastName}
                    onChange={(e) => { setLastName(e.target.value); setNotFound(false); }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="For admin to contact you"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn profile (optional)
                </label>
                <input
                  value={linkedin}
                  onChange={(e) => { setLinkedin(e.target.value); setNotFound(false); }}
                  placeholder="Helps us find your profile if name doesn't match"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                />
              </div>

              {notFound && (
                <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-xs text-gray-600">
                  <p className="font-medium text-gray-800 mb-1">Profile not found</p>
                  <p>We couldn't find a profile matching those details. Try your LinkedIn URL or email the admin team directly.</p>
                </div>
              )}

              {foundProfile && (
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">Current profile</p>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600 flex-shrink-0">
                      {((foundProfile.first_name?.[0] || '') + (foundProfile.last_name?.[0] || '')).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {foundProfile.first_name} {foundProfile.last_name}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {foundProfile.role} · {foundProfile.organisation}
                      </p>
                      {foundProfile.expertise && (
                        <span className="inline-block text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full mt-1.5">
                          {foundProfile.expertise}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={lookupProfile}
                disabled={!firstName || !lastName}
                className="w-full px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 disabled:opacity-40 transition-colors"
              >
                Find my profile
              </button>

              {foundProfile && (
                <>
                  <div className="flex items-center gap-3 py-2">
                    <div className="flex-1 border-t border-gray-200" />
                    <span className="text-xs text-gray-400 font-medium">or</span>
                    <div className="flex-1 border-t border-gray-200" />
                  </div>

                  <button
                    type="button"
                    onClick={requestMagicLink}
                    disabled={linkLoading || !email}
                    className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 disabled:opacity-40 transition-colors"
                  >
                    {linkLoading ? 'Sending...' : 'Send my profile to this email →'}
                  </button>
                  {linkError && (
                    <p className="text-xs text-red-600 text-center">{linkError}</p>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {(step === 'edit' || step === 'remove') && foundProfile && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-5 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600 flex-shrink-0">
                {((foundProfile.first_name?.[0] || '') + (foundProfile.last_name?.[0] || '')).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {foundProfile.first_name} {foundProfile.last_name}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {foundProfile.role} · {foundProfile.organisation}
                </p>
              </div>
            </div>

            {step === 'edit' ? (
              <>
                <h2 className="text-lg font-medium mb-1">Update your profile</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Describe what you'd like to change — role, organisation, bio, expertise, or LinkedIn.
                </p>

                <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 space-y-1">
                  <p className="font-medium text-gray-500 mb-2">Current details:</p>
                  {foundProfile.role && <p><span className="font-medium">Role:</span> {foundProfile.role}</p>}
                  {foundProfile.organisation && <p><span className="font-medium">Organisation:</span> {foundProfile.organisation}</p>}
                  {foundProfile.bio && <p><span className="font-medium">Bio:</span> {foundProfile.bio}</p>}
                  {foundProfile.expertise && <p><span className="font-medium">Expertise:</span> {foundProfile.expertise}</p>}
                </div>

                <textarea
                  value={changes}
                  onChange={(e) => setChanges(e.target.value)}
                  placeholder="e.g. New role: Chief Digital Officer at WHO. Update bio to: ..."
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 resize-none"
                />

                <div className="flex justify-between mt-6 pt-4 border-t">
                  <button
                    onClick={back}
                    className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:border-gray-400"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => { setRequestType('update'); setStep('review'); }}
                    disabled={!changes}
                    className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium disabled:opacity-50 hover:bg-gray-800"
                  >
                    Review →
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-medium mb-1">Remove your profile</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Optional — let us know why. This helps us improve the database.
                </p>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. No longer in this role, prefer not to be listed..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 resize-none"
                />
                <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-500">
                  Your profile will be removed from the public database after admin review.
                </div>

                <div className="flex justify-between mt-6 pt-4 border-t">
                  <button
                    onClick={back}
                    className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:border-gray-400"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep('review')}
                    className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800"
                  >
                    Review →
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {step === 'review' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Review your request</h2>

            <div className="flex items-start gap-3 mb-5 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600 flex-shrink-0">
                {((foundProfile?.first_name?.[0] || firstName?.[0] || '') + (foundProfile?.last_name?.[0] || lastName?.[0] || '')).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {foundProfile?.first_name || firstName} {foundProfile?.last_name || lastName}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{email}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Request</span>
                <span
                  className={`font-medium px-2 py-0.5 rounded-full text-xs ${
                    requestType === 'delete'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {requestType === 'delete' ? 'Remove profile' : 'Update profile'}
                </span>
              </div>
              {requestType === 'update' && changes && (
                <div className="py-2 border-b">
                  <span className="text-gray-500 block mb-1">Changes</span>
                  <p className="text-gray-700 text-xs bg-gray-50 p-3 rounded-md">{changes}</p>
                </div>
              )}
              {requestType === 'delete' && reason && (
                <div className="py-2 border-b">
                  <span className="text-gray-500 block mb-1">Reason</span>
                  <p className="text-gray-700 text-xs bg-gray-50 p-3 rounded-md">{reason}</p>
                </div>
              )}
            </div>

            {status === 'error' && (
              <div className="mt-4 text-red-600 text-sm">
                Error submitting. Please try again.
              </div>
            )}

            <button
              onClick={submit}
              disabled={status === 'submitting'}
              className="w-full mt-6 px-6 py-2.5 bg-gray-900 text-white rounded-full font-medium text-sm disabled:opacity-50 hover:bg-gray-800 transition-colors"
            >
              {status === 'submitting' ? 'Submitting...' : 'Submit request'}
            </button>

            <div className="flex justify-between mt-6 pt-4 border-t">
              <button
                onClick={() => setStep(requestType === 'delete' ? 'remove' : 'edit')}
                className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:border-gray-400"
              >
                ← Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
