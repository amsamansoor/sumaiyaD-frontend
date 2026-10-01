import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Eye, EyeOff, Upload, X } from 'lucide-react';
import {
  fetchHomeSections,
  createHomeSection,
  updateHomeSection,
  deleteHomeSection,
  reorderHomeSections,
} from '../../Service/api';

const TYPE_LABELS = {
  'category-strip': 'Category Cards Strip',
  'promo-banner-grid': 'Promo Banner Grid',
  'product-carousel': 'Product Carousel',
  'single-banner': 'Single Wide Banner',
};

const emptyItem = (size = 'large') => ({ label: '', imageUrl: '', linkCategory: '', size });

export default function HomeSectionsManager({ currentUser, availableCategories = [] }) {
  const token = currentUser?.token || currentUser;

  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); // null = not editing, 'new' = creating
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await fetchHomeSections();
      setSections(data || []);
    } catch (err) {
      console.error('Failed to load home sections:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (section) => {
    setBusyId(section.id);
    try {
      await updateHomeSection(section.id, { ...section, isActive: !section.isActive }, token);
      setSections((prev) => prev.map((s) => (s.id === section.id ? { ...s, isActive: !s.isActive } : s)));
    } catch (err) {
      alert('Could not update section.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (section) => {
    if (!confirm(`Delete "${section.title}"? This can't be undone.`)) return;
    setBusyId(section.id);
    try {
      await deleteHomeSection(section.id, token);
      setSections((prev) => prev.filter((s) => s.id !== section.id));
    } catch (err) {
      alert('Could not delete section.');
    } finally {
      setBusyId(null);
    }
  };

  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const reordered = [...sections];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    setSections(reordered);

    try {
      await reorderHomeSections(
        reordered.map((s, i) => ({ id: s.id, sortOrder: i })),
        token
      );
    } catch (err) {
      alert('Could not save the new order.');
      load(); // revert to server state
    }
  };

  const handleSaved = (saved, isNew) => {
    if (isNew) {
      setSections((prev) => [...prev, saved]);
    } else {
      setSections((prev) => prev.map((s) => (s.id === saved.id ? saved : s)));
    }
    setEditingId(null);
  };

  if (editingId !== null) {
    const existing = editingId === 'new' ? null : sections.find((s) => s.id === editingId);
    return (
      <SectionEditor
        initial={existing}
        token={token}
        availableCategories={availableCategories}
        onCancel={() => setEditingId(null)}
        onSaved={(saved) => handleSaved(saved, editingId === 'new')}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl">Homepage Sections</h2>
          <p className="text-xs text-[#8A8580] mt-0.5">Add, reorder, hide, or remove blocks shown on the homepage.</p>
        </div>
        <button
          onClick={() => setEditingId('new')}
          className="flex items-center gap-2 bg-[#1A1A1A] text-white text-xs uppercase tracking-widest font-semibold px-4 py-2.5 hover:bg-black transition-colors shrink-0"
        >
          <Plus size={15} /> Add Section
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-[#8A8580]">Loading…</p>
      ) : sections.length === 0 ? (
        <p className="text-sm text-[#8A8580]">No sections yet — click "Add Section" to create your first one.</p>
      ) : (
        <ul className="border border-[#E5E2DC] divide-y divide-[#E5E2DC] bg-white">
          {sections.map((section, index) => (
            <li key={section.id} className="flex items-center gap-4 p-4">
              <div className="flex flex-col shrink-0">
                <button
                  onClick={() => handleMove(index, -1)}
                  disabled={index === 0}
                  className="text-[#8A8580] hover:text-[#1A1A1A] disabled:opacity-20"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  onClick={() => handleMove(index, 1)}
                  disabled={index === sections.length - 1}
                  className="text-[#8A8580] hover:text-[#1A1A1A] disabled:opacity-20"
                >
                  <ChevronDown size={16} />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{section.title}</p>
                <p className="text-xs text-[#8A8580]">
                  {TYPE_LABELS[section.type] || section.type}
                  {section.type === 'product-carousel' && section.productCategoryFilter
                    ? ` — ${section.productCategoryFilter}`
                    : ''}
                  {section.items?.length > 0 ? ` — ${section.items.length} item(s)` : ''}
                </p>
              </div>

              <button
                onClick={() => handleToggleActive(section)}
                disabled={busyId === section.id}
                className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#8A8580] hover:text-[#1A1A1A] shrink-0"
                title={section.isActive ? 'Visible — click to hide' : 'Hidden — click to show'}
              >
                {section.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                {section.isActive ? 'Shown' : 'Hidden'}
              </button>

              <button
                onClick={() => setEditingId(section.id)}
                className="text-xs uppercase tracking-wide font-semibold border border-[#E5E2DC] px-3 py-1.5 hover:border-[#1A1A1A] shrink-0"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(section)}
                disabled={busyId === section.id}
                className="text-[#8A8580] hover:text-[#7A1F2B] shrink-0"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// --------------------------------------------------------------------------

function SectionEditor({ initial, token, availableCategories, onCancel, onSaved }) {
  const [type, setType] = useState(initial?.type || 'promo-banner-grid');
  const [title, setTitle] = useState(initial?.title || '');
  const [subtitle, setSubtitle] = useState(initial?.subtitle || '');
  const [productCategoryFilter, setProductCategoryFilter] = useState(initial?.productCategoryFilter || 'All');
  const [items, setItems] = useState(
    initial?.items?.length ? initial.items : type === 'single-banner' ? [emptyItem()] : []
  );
  const [isSaving, setIsSaving] = useState(false);

  const needsItems = type !== 'product-carousel';

  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'single-banner') setItems([emptyItem()]);
    else if (newType === 'product-carousel') setItems([]);
  };

  const handleAddItem = () => {
    setItems((prev) => [...prev, emptyItem(type === 'promo-banner-grid' ? 'small' : 'large')]);
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)));
  };

  const handleItemFile = (index, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => handleItemChange(index, 'imageUrl', reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Section title is required.');
      return;
    }
    if (needsItems && items.length === 0) {
      alert('Add at least one item.');
      return;
    }
    if (needsItems && items.some((it) => !it.imageUrl.trim())) {
      alert('Every item needs an image.');
      return;
    }

    const payload = {
      id: initial?.id || 0,
      title: title.trim(),
      subtitle: subtitle.trim() || null,
      type,
      isActive: initial?.isActive ?? true,
      sortOrder: initial?.sortOrder ?? 0,
      items: needsItems ? items : [],
      productCategoryFilter: type === 'product-carousel' ? productCategoryFilter : null,
    };

    setIsSaving(true);
    try {
      if (initial) {
        await updateHomeSection(initial.id, payload, token);
        onSaved(payload);
      } else {
        const created = await createHomeSection(payload, token);
        onSaved(created);
      }
    } catch (err) {
      console.error(err);
      alert('Could not save the section.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white border border-[#E5E2DC]">
      <div className="px-6 py-5 border-b border-[#E5E2DC] flex justify-between items-center">
        <h2 className="font-serif text-xl">{initial ? 'Edit Section' : 'New Section'}</h2>
        <button type="button" onClick={onCancel} className="text-[#8A8580] hover:text-[#1A1A1A]">
          <X size={20} />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Type — locked once created, to avoid mismatched data */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-[#8A8580] mb-1.5">
            Section Type
          </label>
          <select
            value={type}
            onChange={(e) => handleTypeChange(e.target.value)}
            disabled={!!initial}
            className="w-full border border-[#E5E2DC] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1A1A1A] disabled:bg-[#FAF9F7] disabled:text-[#8A8580]"
          >
            {Object.entries(TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          {initial && <p className="text-xs text-[#8A8580] mt-1">Type can't be changed after creation — delete and re-add if needed.</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-[#8A8580] mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. New Arrivals"
              className="w-full border border-[#E5E2DC] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-[#8A8580] mb-1.5">
              Subtitle <span className="normal-case text-[#B5B0A8]">(optional)</span>
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Shop the latest arrivals before they sell out"
              className="w-full border border-[#E5E2DC] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>
        </div>

        {type === 'product-carousel' && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-[#8A8580] mb-1.5">
              Show products from
            </label>
            <select
              value={productCategoryFilter}
              onChange={(e) => setProductCategoryFilter(e.target.value)}
              className="w-full border border-[#E5E2DC] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1A1A1A]"
            >
              <option value="All">All Categories</option>
              {availableCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        )}

        {needsItems && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wide text-[#8A8580]">
                {type === 'single-banner' ? 'Banner' : 'Items'}
              </label>
              {type !== 'single-banner' && (
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#1A1A1A] hover:underline"
                >
                  <Plus size={14} /> Add Item
                </button>
              )}
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="border border-[#E5E2DC] p-4 flex flex-col sm:flex-row gap-4">
                  <div className="w-20 h-24 bg-[#F1EFEA] shrink-0 overflow-hidden">
                    {item.imageUrl && <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />}
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => handleItemChange(index, 'label', e.target.value)}
                        placeholder="Label — e.g. READY TO WEAR"
                        className="flex-1 border border-[#E5E2DC] px-3 py-2 text-sm focus:outline-none focus:border-[#1A1A1A]"
                      />
                      {type !== 'single-banner' && (
                        <select
                          value={item.linkCategory || ''}
                          onChange={(e) => handleItemChange(index, 'linkCategory', e.target.value)}
                          className="border border-[#E5E2DC] px-2 py-2 text-sm focus:outline-none focus:border-[#1A1A1A]"
                        >
                          <option value="">Links to…</option>
                          {availableCategories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      )}
                      {type === 'promo-banner-grid' && (
                        <select
                          value={item.size}
                          onChange={(e) => handleItemChange(index, 'size', e.target.value)}
                          className="border border-[#E5E2DC] px-2 py-2 text-sm focus:outline-none focus:border-[#1A1A1A]"
                        >
                          <option value="large">Large</option>
                          <option value="small">Small</option>
                        </select>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={item.imageUrl.startsWith('data:') ? '(uploaded image)' : item.imageUrl}
                        readOnly={item.imageUrl.startsWith('data:')}
                        onChange={(e) => handleItemChange(index, 'imageUrl', e.target.value)}
                        placeholder="Paste image URL"
                        className="flex-1 border border-[#E5E2DC] px-3 py-2 text-xs focus:outline-none focus:border-[#1A1A1A]"
                      />
                      <label className="flex items-center gap-1.5 border border-[#1A1A1A] px-3 py-2 text-xs uppercase tracking-wide font-semibold cursor-pointer hover:bg-[#1A1A1A] hover:text-white shrink-0">
                        <Upload size={13} /> Upload
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleItemFile(index, e.target.files?.[0])} />
                      </label>
                    </div>
                  </div>

                  {type !== 'single-banner' && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-[#8A8580] hover:text-[#7A1F2B] self-start"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-5 border-t border-[#E5E2DC] flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 text-xs uppercase tracking-wide font-semibold border border-[#E5E2DC] hover:border-[#1A1A1A]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 text-xs uppercase tracking-wide font-semibold bg-[#1A1A1A] text-white hover:bg-black disabled:opacity-50"
        >
          {isSaving ? 'Saving…' : initial ? 'Save Changes' : 'Create Section'}
        </button>
      </div>
    </form>
  );
}
