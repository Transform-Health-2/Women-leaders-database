import React, { useState } from 'react'
import axios from 'axios'
import { storage } from '../firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { compressImage } from '../utils/compressImage'

const EXPERTISE_TAGS = [
  'AI & Automation',
  'Digital health policy',
  'Health financing',
  'Health systems',
  'Data & analytics',
  'mHealth',
  'Telemedicine',
  'Research',
  'Health information systems',
  'Health systems strengthening',
  'Digital health strategy',
  'Digital health advocacy',
  'Digital health innovation',
  'Digital health transformation',
  'Digital health philanthropy',
  'Health workforce',
]

const COUNTRIES = [
  'Kenya', 'Nigeria', 'South Africa', 'Tanzania', 'Uganda', 'Ghana',
  'Ethiopia', 'Rwanda', 'Senegal', 'India', 'Brazil', 'Malaysia',
  'United States', 'United Kingdom', 'France', 'Switzerland',
  'Germany', 'Australia', 'Japan', 'China',
]

export default function Submit({ onManageProfile }) {
  const [step, setStep] = useState(0)
  const [branch, setBranch] = useState('self')
  const [nominateLink, setNominateLink] = useState('')
  const [consent, setConsent] = useState(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [role, setRole] = useState('')
  const [org, setOrg] = useState('')
  const [expertise, setExpertise] = useState([])
  const [geoScope, setGeoScope] = useState('')
  const [country, setCountry] = useState('')
  const [bio, setBio] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [notableText, setNotableText] = useState('')
  const [notableItems, setNotableItems] = useState([])
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [photoName, setPhotoName] = useState('')
  const [status, setStatus] = useState('')
  const [showNoConsentModal, setShowNoConsentModal] = useState(false)

  const charCount = bio.length

  function goStep(n) {
    if (n >= 0 && n <= 5) setStep(n)
  }

  function selectBranch(b) {
    setBranch(b)
  }

  function handleStep0Continue() {
    if (branch === 'nominate' && nominateLink) {
      goStep(5)
      return
    }
    goStep(1)
  }

  function handleConsent() {
    if (consent === 'no') {
      setShowNoConsentModal(true)
    } else if (consent === 'yes') {
      goStep(2)
    }
  }

  function toggleExpertise(tag) {
    if (expertise.includes(tag)) {
      setExpertise(expertise.filter((e) => e !== tag))
    } else if (expertise.length < 3) {
      setExpertise([...expertise, tag])
    }
  }

  function bioCharWarning() {
    return charCount > 0 && (charCount < 100 || charCount > 150)
  }

  function updateNotableItem(index, field, value) {
    setNotableItems((current) =>
      current.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )
  }

  function addNotableItem() {
    if (notableItems.length >= 3) return
    setNotableItems((current) => [...current, { title: '', link: '', type: '' }])
  }

  function removeNotableItem(index) {
    setNotableItems((current) => current.filter((_, i) => i !== index))
  }

  async function handlePhotoUpload(e) {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) return

    try {
      const compressed = await compressImage(file)
      setPhoto(compressed)
      setPhotoName(compressed.name + ' (' + Math.round(compressed.size / 1024) + 'KB)')
      const reader = new FileReader()
      reader.onload = (ev) => setPhotoPreview(ev.target.result)
      reader.readAsDataURL(compressed)
    } catch (err) {
      console.error('Compression failed:', err)
    }
  }

  async function uploadPhoto(file) {
    const fileName = Date.now() + '-' + file.name.replace(/\s+/g, '-')
    const storageRef = ref(storage, 'profile-photos/' + fileName)
    const snapshot = await uploadBytes(storageRef, file)
    return getDownloadURL(snapshot.ref)
  }

  function resetForm() {
    setFirstName('')
    setLastName('')
    setRole('')
    setOrg('')
    setExpertise([])
    setGeoScope('')
    setCountry('')
    setBio('')
    setLinkedin('')
    setPhoto(null)
    setPhotoPreview(null)
    setPhotoName('')
    setConsent(null)
    setStep(0)
    setStatus('')
  }

  async function submit() {
    setStatus('submitting')
    try {
      let photoUrl = ''
      if (photo) {
        const hasFirebase = import.meta.env.VITE_FIREBASE_API_KEY
        if (hasFirebase) {
          photoUrl = await uploadPhoto(photo)
        }
      }

      const url = import.meta.env.VITE_APPS_SCRIPT_URL || ''
      if (!url) {
        setTimeout(() => setStatus('submitted'), 1000)
        return
      }

      const payload = {
        branch,
        firstName,
        lastName,
        role,
        organisation: org,
        expertise: expertise.join(', '),
        geoScope,
        country: geoScope === 'national' ? country : '',
        bio,
        linkedin,
        notableText,
        notableItems: notableItems.filter((item) => item.title || item.link || item.type),
        photoUrl,
      }

      const r = await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json' },
      })
      if (r.data && r.data.ok) setStatus('submitted')
      else setStatus('error')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }


  if (status === 'submitted') {
    return (
      <div className="min-h-screen bg-[rgb(255,255,244)] flex items-center justify-center p-6">
        <div className="bg-transparent border border-gray-200/70 rounded-lg p-8 text-center max-w-md">
          <div className="text-4xl mb-4">🌍</div>
          <h2 className="text-xl font-semibold text-[#02598E] mb-2">
            Thank you for contributing to the Transform Health Women Leaders in Digital Health Database
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Your submission helps advance gender equity and representation in digital health leadership.
          </p>
          <div className="text-sm text-gray-600 bg-[rgb(255,255,244)] p-4 rounded text-left space-y-1 mb-6">
            <p className="font-medium text-gray-800">Confirmation email sent to your inbox</p>
            <p>Your email includes:</p>
            <ul className="list-disc ml-4 text-xs text-gray-500">
              <li>"Update your profile anytime here" — a direct link to edit</li>
              <li>A follow-up survey link to share additional feedback</li>
            </ul>
            <p className="text-xs text-gray-400 mt-2">The Transform Health team will review your profile before it goes live.</p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800"
            >
              Submit another
            </button>
          </div>
        </div>
      </div>
    )
  }

  const stepLabels = ['Start', 'Consent', 'Basic Info', 'Profile', 'Links']

  const nextDisabled =
    (step === 2 && (!firstName || !lastName || !country)) ||
    (step === 3 && (expertise.length === 0 || !bio || !geoScope || charCount < 100 || charCount > 150))

  return (
    <div style={{ background: 'rgb(255, 255, 244)' }}>
      <div className="max-w-4xl mx-auto px-6 py-6">
        {step >= 1 && step <= 4 && (
          <div className="mb-6">
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3, 4].map((s) => (
                <React.Fragment key={s}>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${
                      s < step
                        ? 'bg-gray-800 text-white'
                        : s === step
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {s < step ? '✓' : s + 1}
                  </div>
                  <div
                    className={`flex-1 h-0.5 ${s < step ? 'bg-gray-800' : 'bg-gray-200'} ${s === 4 ? 'hidden' : ''}`}
                  />
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              {stepLabels.map((label, i) => (
                <span key={i}>{label}</span>
              ))}
            </div>
          </div>
        )}

          <div className="bg-transparent rounded-lg p-6 md:p-8">
          {step === 0 && (
            <div>
              <h2 className="text-xl font-bold text-[#02598E] mb-3">
                Women Leaders in Digital Health Database
              </h2>
              <div className="bg-[rgb(255,255,244)] rounded-md p-4 text-sm text-gray-600 leading-relaxed mb-5">
                <p className="mb-3">
                  Transform Health is building a global database of women leaders in digital health to increase visibility, representation, and engagement in leadership, policy, and technical spaces. This takes forward recommendations from the Transform Health policy brief <em>"Establishing Gender Equitable Foundations for Digital Health Transformation to Advance Universal Health Coverage"</em> launched in 2024 to mainstream gender in digital health.
                </p>
                <p>
                  Information submitted through this form may be featured in a publicly accessible database. By consenting, you agree that your profile information including your name, role, organisation, biography, and relevant links may be publicly displayed. <strong>Your email address will not be publicly displayed.</strong>
                </p>
              </div>

              <p className="text-xs text-gray-500 mb-4">
                You can <strong className="text-[#F85A8E]">submit your profile</strong> or <strong>nominate another woman leader</strong>. ⏱️ This form takes 3–5 minutes.
              </p>

              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
                Are you adding yourself or nominating someone else? *
              </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                  <button
                    onClick={() => selectBranch('self')}
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                      branch === 'self'
                        ? 'border-[#F85A8E] bg-pink-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-2xl mb-2">👤</div>
                    <div className="font-medium text-sm">I am nominating myself</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Submit your own profile
                    </div>
                  </button>
                  <button
                    onClick={() => selectBranch('nominate')}
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                      branch === 'nominate'
                        ? 'border-[#F85A8E] bg-pink-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-2xl mb-2">🌟</div>
                    <div className="font-medium text-sm">I am nominating someone else</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Nominate another woman leader
                    </div>
                  </button>
              </div>

              {branch === 'nominate' && (
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Public profile link of the person you are nominating *
                  </label>
                  <p className="text-xs text-gray-400 mb-2">e.g. LinkedIn URL or professional website</p>
                  <input
                    value={nominateLink}
                    onChange={(e) => setNominateLink(e.target.value)}
                    placeholder="https://linkedin.com/in/…"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 text-sm"
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                <button
                  onClick={handleStep0Continue}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#E8571D', display: 'inline-flex', alignItems: 'center', gap: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}
                >
                  {branch === 'nominate' ? 'SUBMIT NOMINATION →' : 'CONTINUE →'}
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div style={{ fontFamily: "'Montserrat', sans-serif" }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: '#02598e', marginBottom: 16 }}>Consent &amp; permissions</h2>
              <p style={{ fontSize: 15, color: '#333', marginBottom: 28, lineHeight: 1.7 }}>
                Your profile may be publicly displayed. By consenting, you agree that the following will be visible in the directory.
              </p>

              {/* Pink info box */}
              <div style={{ borderLeft: '4px solid #F85A8E', background: '#fff0f6', borderRadius: 8, padding: '16px 20px', marginBottom: 32 }}>
                <p style={{ fontSize: 14, color: '#333', marginBottom: 8 }}>
                  <span style={{ color: '#F85A8E', fontWeight: 600 }}>Public: </span>
                  Name, role, organisation, expertise areas, bio, and LinkedIn profile.
                </p>
                <p style={{ fontSize: 14, color: '#333', margin: 0 }}>
                  <span style={{ color: '#F85A8E', fontWeight: 600 }}>Private: </span>
                  Email address — used for follow-up only, never published.
                </p>
              </div>

              {/* Consent options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                <button
                  onClick={() => setConsent('yes')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 20px', borderRadius: 10, textAlign: 'left', cursor: 'pointer',
                    border: consent === 'yes' ? '2px solid #02598e' : '2px solid #e5e7eb',
                    background: consent === 'yes' ? '#f0f7ff' : '#fff',
                  }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#02598e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>✓</span>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#111', marginBottom: 2 }}>Yes, I consent</div>
                    <div style={{ fontSize: 13, color: '#666' }}>Add my profile to the Transform Health directory</div>
                  </div>
                </button>

                <button
                  onClick={() => setConsent('no')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 20px', borderRadius: 10, textAlign: 'left', cursor: 'pointer',
                    border: consent === 'no' ? '2px solid #dc2626' : '2px solid #e5e7eb',
                    background: consent === 'no' ? '#fff5f5' : '#f9fafb',
                  }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>✕</span>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#111', marginBottom: 2 }}>No, I do not consent</div>
                    <div style={{ fontSize: 13, color: '#666' }}>I prefer not to be included at this time</div>
                  </div>
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20 }}>
                <button
                  onClick={() => goStep(0)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#111', display: 'inline-flex', alignItems: 'center', gap: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}
                >
                  ← BACK
                </button>
                <button
                  onClick={handleStep0Continue}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 8, color: '#E8571D' }}
                >
                  {branch === 'nominate' ? 'Submit nomination →' : 'Continue →'}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ fontFamily: "'Montserrat', sans-serif" }}>
              <h2 style={{ fontSize: 26, fontWeight: 700, color: '#02598e', marginBottom: 8 }}>Basic information</h2>
              <p style={{ fontSize: 14, color: '#444', marginBottom: 28, lineHeight: 1.7 }}>
                Tell us who you are. Your email will never be published — it's used only for profile updates.
              </p>

              {/* First + Last name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 15, color: '#111', marginBottom: 8 }}>First name *</label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g Anet"
                    style={{ width: '100%', padding: '14px 16px', border: '1.5px solid #d1d5db', borderRadius: 10, fontSize: 15, outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 15, color: '#111', marginBottom: 8 }}>Last name *</label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g Clinton"
                    style={{ width: '100%', padding: '14px 16px', border: '1.5px solid #d1d5db', borderRadius: 10, fontSize: 15, outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Photo upload */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 15, color: '#111', marginBottom: 8 }}>Profile photo (optional)</label>
                <label style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  background: '#eef3fb', border: '1.5px solid #d1d9ec', borderRadius: 12,
                  padding: '52px 24px', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
                }}>
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 12 }} />
                  ) : (
                    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: 12 }}>
                      <rect x="7" y="4" width="30" height="36" rx="4" stroke="#9ca3af" strokeWidth="1.8" fill="none"/>
                      <circle cx="22" cy="19" r="6" stroke="#9ca3af" strokeWidth="1.8" fill="none"/>
                      <path d="M10 38c0-6.627 5.373-10 12-10s12 3.373 12 10" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                    </svg>
                  )}
                  <span style={{ fontSize: 15, fontWeight: 600, color: '#111', marginBottom: 4 }}>Upload a photo</span>
                  <span style={{ fontSize: 13, color: '#9ca3af' }}>JPEG or PNG .max 5MB</span>
                  <input type="file" accept="image/png,image/jpeg" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                </label>
              </div>

              {/* Country */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 15, color: '#111', marginBottom: 8 }}>Country of residence *</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  style={{ width: '100%', padding: '14px 16px', border: '1.5px solid #d1d5db', borderRadius: 10, fontSize: 15, outline: 'none', background: '#fff', boxSizing: 'border-box', color: country ? '#111' : '#9ca3af' }}
                >
                  <option value="">Select a country...</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Org + Role */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 15, color: '#111', marginBottom: 8 }}>Organisation / Institution</label>
                  <input
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    placeholder="e.g WHO"
                    style={{ width: '100%', padding: '14px 16px', border: '1.5px solid #d1d5db', borderRadius: 10, fontSize: 15, outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 15, color: '#111', marginBottom: 8 }}>Current role / title</label>
                  <input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g Director"
                    style={{ width: '100%', padding: '14px 16px', border: '1.5px solid #d1d5db', borderRadius: 10, fontSize: 15, outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20 }}>
                <button
                  onClick={() => goStep(1)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#111', display: 'inline-flex', alignItems: 'center', gap: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}
                >
                  ← BACK
                </button>
                <button
                  onClick={handleConsent}
                  disabled={consent === null}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 8, color: consent === null ? '#ccc' : '#E8571D' }}
                >
                  CONTINUE →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <span className="inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-gray-100 text-gray-700 mb-4">
                {branch === 'self' ? '👤 Adding myself' : '🌟 Nominating someone'}
              </span>
              <h2 className="text-lg font-medium text-[#02598E] mb-4">Profile Details</h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Areas of expertise * <span className="normal-case tracking-normal text-gray-400 font-normal">(select up to 3)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {EXPERTISE_TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleExpertise(tag)}
                        disabled={
                          !expertise.includes(tag) && expertise.length >= 3
                        }
                        className={`px-3 py-1.5 border rounded-full text-xs font-medium transition-colors ${
                          expertise.includes(tag)
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-300 text-gray-600 hover:border-gray-400 disabled:opacity-40'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">
                    {expertise.length} of 3 selected
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Geographic scope *
                  </label>
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={() => setGeoScope(geoScope === 'global' ? '' : 'global')}
                      className={`px-3 py-1.5 border rounded-full text-xs font-medium transition-colors ${
                        geoScope === 'global'
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {geoScope === 'global' ? '✓ ' : ''}Global / Multicountry
                    </button>
                    <button
                      onClick={() => setGeoScope(geoScope === 'national' ? '' : 'national')}
                      className={`px-3 py-1.5 border rounded-full text-xs font-medium transition-colors ${
                        geoScope === 'national'
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {geoScope === 'national' ? '✓ ' : ''}National
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Short bio * <span className="normal-case tracking-normal text-gray-400 font-normal">(100–150 characters)</span>
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Brief description of your work in digital health…"
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none text-sm resize-none ${
                      bioCharWarning()
                        ? 'border-red-300 focus:border-red-400'
                        : 'border-gray-300 focus:border-gray-400'
                    }`}
                  />
                  <div className="flex gap-3 mt-1.5">
                    <span className="text-xs text-gray-400">{charCount} characters</span>
                    {bioCharWarning() && (
                      <span className="text-xs text-red-500">
                        Please keep bio between 100–150 characters.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, borderTop: '1px solid #f0f0f0', marginTop: 24 }}>
                <button
                  onClick={() => goStep(2)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#111', display: 'inline-flex', alignItems: 'center', gap: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}
                >
                  ← BACK
                </button>
                <button
                  onClick={() => goStep(4)}
                  disabled={nextDisabled}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 8, color: nextDisabled ? '#ccc' : '#E8571D' }}
                >
                  CONTINUE →
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <span className="inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-gray-100 text-gray-700 mb-4">
                {branch === 'self' ? '👤 Adding myself' : '🌟 Nominating someone'}
              </span>
              <h2 className="text-lg font-medium text-[#02598E] mb-4">Visibility & Links</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    LinkedIn profile or professional website
                  </label>
                  <input
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/…"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Any notable publications, projects, or achievements <span className="text-gray-400 normal-case text-xs">(optional)</span>
                  </label>
                  <textarea
                    value={notableText}
                    onChange={(e) => setNotableText(e.target.value)}
                    placeholder="Briefly describe any notable publications, projects, or achievements…"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 text-sm resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-2">Type: Long text</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-700">Add up to 3 achievements</p>
                      <p className="text-xs text-gray-400">Each item can include a title, link, and type.</p>
                    </div>
                    <button
                      type="button"
                      onClick={addNotableItem}
                      disabled={notableItems.length >= 3}
                      className="px-3 py-1.5 bg-gray-900 text-white rounded-full text-xs font-medium disabled:opacity-40"
                    >
                      Add item
                    </button>
                  </div>
                  <div className="space-y-4">
                    {notableItems.length === 0 && (
                      <div className="text-xs text-gray-500">No items added yet.</div>
                    )}
                    {notableItems.map((item, index) => (
                      <div key={index} className="space-y-3 rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-semibold text-gray-900">Item {index + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeNotableItem(index)}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                          <div className="sm:col-span-1">
                            <label className="block text-xs text-gray-700 uppercase tracking-wider mb-1">Title</label>
                            <input
                              value={item.title}
                              onChange={(e) => updateNotableItem(index, 'title', e.target.value)}
                              placeholder="Title"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 text-sm"
                            />
                          </div>
                          <div className="sm:col-span-1">
                            <label className="block text-xs text-gray-700 uppercase tracking-wider mb-1">Link</label>
                            <input
                              value={item.link}
                              onChange={(e) => updateNotableItem(index, 'link', e.target.value)}
                              placeholder="https://…"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 text-sm"
                            />
                          </div>
                          <div className="sm:col-span-1">
                            <label className="block text-xs text-gray-700 uppercase tracking-wider mb-1">Type</label>
                            <select
                              value={item.type}
                              onChange={(e) => updateNotableItem(index, 'type', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 text-sm"
                            >
                              <option value="">Select type</option>
                              <option value="Publication">Publication</option>
                              <option value="Project">Project</option>
                              <option value="Achievement">Achievement</option>
                              <option value="Award">Award</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, borderTop: '1px solid #f0f0f0', marginTop: 24 }}>
                <button
                  onClick={() => goStep(3)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#111', display: 'inline-flex', alignItems: 'center', gap: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}
                >
                  ← BACK
                </button>
                <button
                  onClick={submit}
                  disabled={status === 'submitting'}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 8, color: status === 'submitting' ? '#ccc' : '#E8571D' }}
                >
                  {status === 'submitting' ? 'SUBMITTING...' : 'SUBMIT PROFILE →'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showNoConsentModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.45)' }}
        >
          <div className="bg-white rounded-2xl p-10 text-center max-w-md w-full shadow-xl" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#fff0f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <span style={{ fontSize: 36 }}>🙏</span>
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#02598e', marginBottom: 16 }}>Thank you for your time</h2>
            <p style={{ fontSize: 15, color: '#444', lineHeight: 1.7, marginBottom: 32 }}>
              We cannot proceed without your consent. You are welcome to return and submit your profile anytime.
            </p>
            <button
              onClick={() => setShowNoConsentModal(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#333', display: 'inline-flex', alignItems: 'center', gap: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}
            >
              ← BACK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
