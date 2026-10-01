import React, { useState, useEffect } from 'react';
import { Upload, Check } from 'lucide-react';
import { fetchCategoryImages, saveCategoryImage } from '../../Service/api';

/**
 * CategoryImagesPanel
 * Admin sets the image for each homepage slot. Every slot is saved as one row
 * in the CategoryImages table (name -> image), so one backend serves both the
 * category cards and the promo banners.
 *
 * Props:
 *  - sections: [{ title, description, items: [{ key, label }] }]
 *      `key` is what gets saved (and what the storefront looks up),
 *      `label` is what the admin sees.
 */
export default function CategoryImagesPanel({ currentUser, sections = [] }) {
  const token = currentUser?.token || currentUser;

  const [images, setImages] = useState({});   // { 'unstitched': 'https://…' }  (lower-cased key)
  const [drafts, setDrafts] = useState({});   // unsaved edits, keyed by slot key
  const [savingKey, setSavingKey] = useState(null);
  const [savedKey, setSavedKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategoryImages()
      .then((rows) => {
        const map = {};
        (rows || []).forEach((r) => {
          map[(r.categoryName || '').trim().toLowerCase()] = r.imageUrl;
        });
        setImages(map);
      })
      .catch((err) => console.error('Failed to load category images:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const norm = (k) => k.trim().toLowerCase();
  const currentValue = (key) => (drafts[key] !== undefined ? drafts[key] : images[norm(key)] || '');

  const handleFile = (key, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setDrafts((prev) => ({ ...prev, [key]: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = async (key) => {
    const value = currentValue(key).trim();
    if (!value) {
      alert('Pehle image upload karein ya URL paste karein.');
      return;
    }
    setSavingKey(key);
    try {
      await saveCategoryImage(key, value, token);
      setImages((prev) => ({ ...prev, [norm(key)]: value }));
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      setSavedKey(key);
      setTimeout(() => setSavedKey((k) => (k === key ? null : k)), 2000);
    } catch (err) {
      console.error(err);
      alert('Could not save. Check network or terminal logs.');
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {sections.map((section) => (
        <div key={section.title} className="bg-white border border-[#E5E2DC]">
          <div className="px-6 py-5 border-b border-[#E5E2DC]">
            <h2 className="font-serif text-xl">{section.title}</h2>
            {section.description && (
              <p className="text-xs text-[#8A8580] mt-0.5">{section.description}</p>
            )}
          </div>

          {isLoading ? (
            <p className="text-sm text-[#8A8580] p-6">Loading…</p>
          ) : (
            <ul className="divide-y divide-[#F1EFEA]">
              {section.items.map(({ key, label }) => {
                const value = currentValue(key);
                const isDirty = drafts[key] !== undefined;
                return (
                  <li key={key} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-20 h-24 bg-[#F1EFEA] shrink-0 overflow-hidden">
                      {value ? (
                        <img src={value} alt={label} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-[#8A8580] uppercase tracking-wide">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-lg mb-2">{label}</p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="Paste image URL"
                          value={value.startsWith('data:') ? '(uploaded image)' : value}
                          readOnly={value.startsWith('data:')}
                          onChange={(e) => setDrafts((prev) => ({ ...prev, [key]: e.target.value }))}
                          className="flex-1 min-w-0 border border-[#E5E2DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1A1A1A]"
                        />
                        <label className="flex items-center justify-center gap-2 border border-[#1A1A1A] px-3 py-2 text-xs uppercase tracking-wider font-semibold cursor-pointer hover:bg-[#1A1A1A] hover:text-white transition-colors shrink-0">
                          <Upload size={14} /> Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFile(key, e.target.files?.[0])}
                          />
                        </label>
                        <button
                          onClick={() => handleSave(key)}
                          disabled={savingKey === key || (!isDirty && !!images[norm(key)])}
                          className="flex items-center justify-center gap-2 bg-[#1A1A1A] text-white px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-black disabled:opacity-40 shrink-0"
                        >
                          {savedKey === key ? (<><Check size={14} /> Saved</>) : savingKey === key ? 'Saving…' : 'Save'}
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
