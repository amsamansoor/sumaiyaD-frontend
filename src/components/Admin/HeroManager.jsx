import React, { useState } from 'react';
import { Trash2, Edit, Image as ImageIcon, FolderOpen, X } from 'lucide-react';

export default function HeroManager({ heroList = [], productList = [], onSaveHero, onDeleteHero }) {
  const [editingId, setEditingId] = useState(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  
  const [form, setForm] = useState({
    id: '',
    title: '',
    subtitle: '',
    imageUrl: '',
    buttonText: 'Shop Collection',
    buttonLink: '#catalog'
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.subtitle.trim()) {
      alert("Both Banner Heading and Subtitle fields are required!");
      return;
    }

    if (!form.imageUrl) {
      alert("Please upload an image or select one from the Media Library first!");
      return;
    }
    
    // Direct local save without API hassle
    onSaveHero({ 
      ...form, 
      id: editingId ? editingId : Date.now(),
      isActive: true 
    });

    setForm({ id: '', title: '', subtitle: '', imageUrl: '', buttonText: 'Shop Collection', buttonLink: '#catalog' });
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      id: item.id || '',
      title: item.title || '',
      subtitle: item.subtitle || '',
      imageUrl: item.imageUrl || '',
      buttonText: item.buttonText || 'Shop Collection',
      buttonLink: item.buttonLink || '#catalog'
    });
  };

  const mediaImages = [
    ...(heroList.map(h => h.imageUrl).filter(Boolean)),
    ...(productList ? productList.map(p => p.imageUrl || p.image || p.Image).filter(Boolean) : [])
  ];
  const uniqueMediaImages = [...new Set(mediaImages)];

  return (
    <div className="space-y-8 relative">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold uppercase tracking-wider text-gray-900 mb-1">
          {editingId ? 'Edit Hero Banner' : 'Add New Hero Banner'}
        </h2>
        <p className="text-xs text-gray-500 mb-6">Fill out the heading, subtitle, and choose an image for your hero banner.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Banner Heading <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. New Collection"
              className="w-full border p-2.5 text-sm rounded focus:outline-none focus:border-black"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Banner Subtitle <span className="text-red-500">*</span></label>
            <textarea
              rows="2"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="e.g. Luxury Pret Collection 2026"
              className="w-full border p-2.5 text-sm rounded focus:outline-none focus:border-black"
              required
            />
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Upload Image File</label>
                <div className="flex items-center gap-2 border p-2 rounded bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Or Image URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full border p-2.5 text-sm rounded focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="flex justify-between items-center bg-gray-50 p-3 rounded border border-dashed border-gray-300">
              <div className="flex items-center gap-2 text-xs text-gray-700 font-semibold">
                <FolderOpen size={16} /> Want to pick from existing store products/media?
              </div>
              <button
                type="button"
                onClick={() => setIsMediaModalOpen(true)}
                className="bg-gray-900 text-white px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
              >
                Open Media Library
              </button>
            </div>
          </div>

          {form.imageUrl && (
            <div className="mt-2 h-36 w-full overflow-hidden rounded border relative bg-black">
              <img src={form.imageUrl} alt="Hero Preview" className="w-full h-full object-cover opacity-90" />
              <span className="absolute bottom-2 left-2 bg-black/75 text-white text-[10px] px-2 py-0.5 rounded uppercase font-semibold">Live Preview</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Button Text</label>
              <input
                type="text"
                value={form.buttonText}
                onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                className="w-full border p-2.5 text-sm rounded focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Button Link</label>
              <input
                type="text"
                value={form.buttonLink}
                onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
                className="w-full border p-2.5 text-sm rounded focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-black text-white font-bold text-xs uppercase tracking-widest py-3 rounded hover:bg-gray-800 transition-colors"
            >
              {editingId ? 'Update Hero Banner' : 'Add Hero Banner'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ id: '', title: '', subtitle: '', imageUrl: '', buttonText: 'Shop Collection', buttonLink: '#catalog' });
                }}
                className="bg-gray-200 text-gray-800 px-4 font-bold text-xs uppercase rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {isMediaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <h3 className="font-bold text-sm uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <FolderOpen size={18} /> Select Image from Media Library
              </h3>
              <button onClick={() => setIsMediaModalOpen(false)} className="text-gray-500 hover:text-black p-1">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              {uniqueMediaImages.length === 0 ? (
                <p className="text-center text-xs text-gray-500 py-10">No images found in your store yet.</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {uniqueMediaImages.map((imgSrc, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        setForm(prev => ({ ...prev, imageUrl: imgSrc }));
                        setIsMediaModalOpen(false);
                      }}
                      className="group relative h-28 border rounded overflow-hidden cursor-pointer hover:border-black transition-all bg-gray-100"
                    >
                      <img src={imgSrc} alt="Media item" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white text-black text-[10px] font-bold px-2 py-1 rounded shadow">Select</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t bg-gray-50 text-right">
              <button type="button" onClick={() => setIsMediaModalOpen(false)} className="bg-gray-200 text-gray-800 px-4 py-2 text-xs font-bold uppercase rounded hover:bg-gray-300">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4 flex items-center gap-2">
          <ImageIcon size={18} /> Active Hero Banners ({heroList.length})
        </h3>

        {heroList.length === 0 ? (
          <p className="text-xs text-gray-500 italic py-4 text-center">No hero banners added yet.</p>
        ) : (
          <div className="space-y-4">
            {heroList.map((item, index) => (
              <div key={item.id || index} className="flex flex-col sm:flex-row items-center justify-between border p-4 rounded gap-4 bg-gray-50/50">
                <div className="files flex items-center gap-4 w-full sm:w-auto">
                  <img src={item.imageUrl} alt={item.title} className="w-24 h-16 object-cover rounded border shrink-0 bg-gray-200" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded font-mono">ID: {item.id}</span>
                      <h4 className="font-bold text-sm text-gray-900">{item.title}</h4>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">{item.subtitle}</p>
                    <span className="inline-block mt-1 bg-gray-200 text-gray-700 text-[10px] px-2 py-0.5 rounded font-mono">
                      Link: {item.buttonLink}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                  <button type="button" onClick={() => handleEdit(item)} className="p-2 bg-white border border-gray-300 text-black rounded hover:bg-gray-100" title="Edit">
                    <Edit size={16} />
                  </button>
                  <button type="button" onClick={() => onDeleteHero(item.id)} className="p-2 bg-red-50 border border-red-200 text-red-600 rounded hover:bg-red-100" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}