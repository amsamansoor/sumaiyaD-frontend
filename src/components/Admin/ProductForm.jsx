import React, { useState, useEffect } from 'react';

// Builds every combination of the given attribute groups' values.
// e.g. [{name:'Color',values:['Black','Beige']},{name:'Size',values:['S','M']}]
// -> [{Color:'Black',Size:'S'}, {Color:'Black',Size:'M'}, {Color:'Beige',Size:'S'}, {Color:'Beige',Size:'M'}]
function generateCombinations(groups) {
  const validGroups = groups.filter(g => g.name.trim() && g.values.length > 0);
  if (validGroups.length === 0) return [];

  return validGroups.reduce(
    (acc, group) => {
      const next = [];
      acc.forEach(combo => {
        group.values.forEach(value => {
          next.push({ ...combo, [group.name]: value });
        });
      });
      return next;
    },
    [{}]
  );
}

function combinationKey(combo) {
  return Object.keys(combo).sort().map(k => `${k}:${combo[k]}`).join('|');
}

export default function ProductForm({ initialData, onSubmit, onCancel, categories = [] }) {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    originalPrice: '',
    category: categories[0] || 'Unstitched',
    description: '',
    shortDescription: '',
    productCare: '',
    inStock: true,
    images: [],
    productType: 'simple', // 'simple' | 'variable'
    attributeGroups: [],   // [{ name: 'Color', values: ['Black','Beige'] }]
    variants: []           // [{ combination: {Color:'Black'}, price, originalPrice, stock, sku, imageUrl }]
  });

  const [urlInput, setUrlInput] = useState('');
  const [attrNameDraft, setAttrNameDraft] = useState('');
  const [attrValuesDraft, setAttrValuesDraft] = useState({}); // { [groupIndex]: 'draft text' }

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        price: initialData.price !== undefined && initialData.price !== null ? String(initialData.price) : '',
        originalPrice: initialData.originalPrice !== undefined && initialData.originalPrice !== null ? String(initialData.originalPrice) : '',
        images: initialData.images
          ? [...initialData.images]
          : (initialData.imageUrl ? [initialData.imageUrl] : []),
        shortDescription: initialData.shortDescription || '',
        productCare: initialData.productCare || '',
        productType: initialData.productType || 'simple',
        attributeGroups: initialData.attributeGroups || [],
        variants: initialData.variants || []
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddUrlImage = () => {
    if (!urlInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, urlInput.trim()]
    }));
    setUrlInput('');
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSetPrimaryImage = (index) => {
    setFormData(prev => {
      const updatedImages = [...prev.images];
      const selected = updatedImages.splice(index, 1)[0];
      return { ...prev, images: [selected, ...updatedImages] };
    });
  };

  // ---- Product type ----
  const handleProductTypeChange = (type) => {
    setFormData(prev => ({ ...prev, productType: type }));
  };

  // ---- Attribute groups ----
  const handleAddAttributeGroup = () => {
    if (!attrNameDraft.trim()) return;
    setFormData(prev => ({
      ...prev,
      attributeGroups: [...prev.attributeGroups, { name: attrNameDraft.trim(), values: [] }]
    }));
    setAttrNameDraft('');
  };

  const handleAddAttributeValue = (groupIndex) => {
    const raw = attrValuesDraft[groupIndex];
    if (!raw || !raw.trim()) return;
    const newValues = raw.split(',').map(v => v.trim()).filter(Boolean);

    setFormData(prev => {
      const groups = [...prev.attributeGroups];
      const existing = new Set(groups[groupIndex].values);
      newValues.forEach(v => existing.add(v));
      groups[groupIndex] = { ...groups[groupIndex], values: Array.from(existing) };
      return { ...prev, attributeGroups: groups, variants: syncVariants(groups, prev.variants) };
    });
    setAttrValuesDraft(prev => ({ ...prev, [groupIndex]: '' }));
  };

  const handleRemoveAttributeValue = (groupIndex, value) => {
    setFormData(prev => {
      const groups = [...prev.attributeGroups];
      groups[groupIndex] = {
        ...groups[groupIndex],
        values: groups[groupIndex].values.filter(v => v !== value)
      };
      return { ...prev, attributeGroups: groups, variants: syncVariants(groups, prev.variants) };
    });
  };

  const handleRemoveAttributeGroup = (groupIndex) => {
    setFormData(prev => {
      const groups = prev.attributeGroups.filter((_, i) => i !== groupIndex);
      return { ...prev, attributeGroups: groups, variants: syncVariants(groups, prev.variants) };
    });
  };

  // Regenerates the variant matrix from the current attribute groups,
  // preserving price/stock/sku for combinations that already existed.
  function syncVariants(groups, existingVariants) {
    const combos = generateCombinations(groups);
    const existingByKey = new Map(
      existingVariants.map(v => [combinationKey(v.combination), v])
    );

    return combos.map(combo => {
      const key = combinationKey(combo);
      const existing = existingByKey.get(key);
      return existing || {
        combination: combo,
        sku: '',
        price: formData.price || '',
        originalPrice: formData.originalPrice || '',
        stock: 0,
        imageUrl: ''
      };
    });
  }

  const handleVariantFieldChange = (variantIndex, field, value) => {
    setFormData(prev => {
      const variants = [...prev.variants];
      variants[variantIndex] = { ...variants[variantIndex], [field]: value };
      return { ...prev, variants };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      alert("Kam se kam 1 product image zaroor add karein!");
      return;
    }

    const isVariableSubmit = formData.productType === 'variable';

    if (isVariableSubmit && formData.variants.length === 0) {
      alert("Variable product ke liye kam se kam ek attribute group aur uski values add karein.");
      return;
    }

    const cleanVariants = formData.variants.map(v => ({
      ...v,
      price: Number(v.price) || 0,
      originalPrice: v.originalPrice !== '' && v.originalPrice !== null ? Number(v.originalPrice) : null,
      stock: Number(v.stock) || 0
    }));

    // For a variable product, the top-level price/stock shown on the catalog
    // card are derived from the variants so listing pages stay simple.
    const derivedPrice = isVariableSubmit
      ? Math.min(...cleanVariants.map(v => v.price).filter(p => p > 0))
      : Number(formData.price);
    const derivedInStock = isVariableSubmit
      ? cleanVariants.some(v => v.stock > 0)
      : formData.inStock;

    const payload = {
      ...formData,
      price: isFinite(derivedPrice) ? derivedPrice : 0,
      originalPrice: formData.originalPrice !== '' && formData.originalPrice !== null ? Number(formData.originalPrice) : null,
      inStock: derivedInStock,
      imageUrl: formData.images[0],
      shortDescription: formData.shortDescription?.trim() || null,
      productCare: formData.productCare?.trim() || null,
      attributeGroups: isVariableSubmit ? formData.attributeGroups : [],
      variants: isVariableSubmit ? cleanVariants : []
    };

    onSubmit(payload);
  };

  const isVariable = formData.productType === 'variable';

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 max-w-3xl mx-auto my-6 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {initialData ? 'Edit Product Catalog' : 'Add New Product'}
        </h2>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600 text-sm">
            Cancel
          </button>
        )}
      </div>

      {/* Product Type */}
      <div>
        <label className="block text-xs font-semibold uppercase text-gray-600 mb-2">Product Type</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleProductTypeChange('simple')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${
              !isVariable ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-300 hover:border-black'
            }`}
          >
            Simple Product
          </button>
          <button
            type="button"
            onClick={() => handleProductTypeChange('variable')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${
              isVariable ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-300 hover:border-black'
            }`}
          >
            Variable Product
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1.5">
          {isVariable
            ? 'Customer picks options (Color, Size, etc). Each combination gets its own price and stock.'
            : 'A single product with one price and one stock count — no options to choose.'}
        </p>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Product Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Embroidered Velvet 3-Piece"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none text-sm bg-white"
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Pricing — only for Simple products; Variable products price per-variant below */}
      {!isVariable && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Sale Price (PKR)</label>
            <input
              type="number"
              name="price"
              required={!isVariable}
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. 12500"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Original Price / Strike (PKR)</label>
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleChange}
              placeholder="e.g. 15000 (Optional)"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none text-sm"
            />
          </div>
        </div>
      )}

      {/* Attribute Groups + Variant Matrix — only for Variable products */}
      {isVariable && (
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label className="block text-xs font-semibold uppercase text-gray-700">
            Options (e.g. Color, Size)
          </label>

          {/* Existing groups */}
          {formData.attributeGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="bg-white p-3 rounded-md border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-800">{group.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAttributeGroup(groupIndex)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Remove option
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-2">
                {group.values.map((value) => (
                  <span
                    key={value}
                    className="flex items-center gap-1.5 bg-gray-100 text-xs font-medium px-2.5 py-1 rounded-full"
                  >
                    {value}
                    <button
                      type="button"
                      onClick={() => handleRemoveAttributeValue(groupIndex, value)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={attrValuesDraft[groupIndex] || ''}
                  onChange={(e) => setAttrValuesDraft(prev => ({ ...prev, [groupIndex]: e.target.value }))}
                  placeholder={group.name.toLowerCase() === 'size' ? 'e.g. S, M, L or 2-3Y, 4-5Y' : 'e.g. Black, Beige'}
                  className="flex-1 px-3 py-2 border rounded-md text-xs focus:ring-1 focus:ring-black outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddAttributeValue(groupIndex)}
                  className="px-3 py-2 bg-gray-900 text-white rounded-md text-xs font-medium hover:bg-black shrink-0"
                >
                  Add
                </button>
              </div>
            </div>
          ))}

          {/* Add new group */}
          <div className="flex gap-2">
            <input
              type="text"
              value={attrNameDraft}
              onChange={(e) => setAttrNameDraft(e.target.value)}
              placeholder="Option name — e.g. Color, Size"
              className="flex-1 px-3 py-2 border rounded-md text-xs focus:ring-1 focus:ring-black outline-none bg-white"
            />
            <button
              type="button"
              onClick={handleAddAttributeGroup}
              className="px-4 py-2 bg-black text-white rounded-md text-xs font-medium hover:bg-gray-800 shrink-0"
            >
              + Add Option
            </button>
          </div>

          {/* Variant matrix */}
          {formData.variants.length > 0 && (
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-2 font-medium">
                Combinations ({formData.variants.length}) — set price &amp; stock for each
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="text-left text-gray-500 uppercase tracking-wide border-b">
                      <th className="py-2 pr-3">Combination</th>
                      <th className="py-2 pr-3">SKU</th>
                      <th className="py-2 pr-3">Price</th>
                      <th className="py-2 pr-3">Original Price</th>
                      <th className="py-2 pr-3">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.variants.map((variant, vIndex) => (
                      <tr key={vIndex} className="border-b border-gray-100">
                        <td className="py-2 pr-3 font-medium whitespace-nowrap">
                          {Object.values(variant.combination).join(' / ')}
                        </td>
                        <td className="py-2 pr-3">
                          <input
                            type="text"
                            value={variant.sku}
                            onChange={(e) => handleVariantFieldChange(vIndex, 'sku', e.target.value)}
                            placeholder="optional"
                            className="w-24 px-2 py-1 border rounded focus:ring-1 focus:ring-black outline-none"
                          />
                        </td>
                        <td className="py-2 pr-3">
                          <input
                            type="number"
                            required
                            value={variant.price}
                            onChange={(e) => handleVariantFieldChange(vIndex, 'price', e.target.value)}
                            className="w-24 px-2 py-1 border rounded focus:ring-1 focus:ring-black outline-none"
                          />
                        </td>
                        <td className="py-2 pr-3">
                          <input
                            type="number"
                            value={variant.originalPrice}
                            onChange={(e) => handleVariantFieldChange(vIndex, 'originalPrice', e.target.value)}
                            placeholder="optional"
                            className="w-24 px-2 py-1 border rounded focus:ring-1 focus:ring-black outline-none"
                          />
                        </td>
                        <td className="py-2 pr-3">
                          <input
                            type="number"
                            required
                            value={variant.stock}
                            onChange={(e) => handleVariantFieldChange(vIndex, 'stock', e.target.value)}
                            className="w-20 px-2 py-1 border rounded focus:ring-1 focus:ring-black outline-none"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Multiple Images Upload & URL Zone — unchanged */}
      <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <label className="block text-xs font-semibold uppercase text-gray-700">
          Product Gallery Images (Angles &amp; Closeups)
        </label>

        <div className="space-y-3">
          <div className="bg-white p-3 rounded-md border border-gray-200">
            <label className="text-xs font-medium text-gray-600 mb-1 block">Option A: Upload from Device / Gallery</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer"
            />
          </div>

          <div className="bg-white p-3 rounded-md border border-gray-200">
            <label className="text-xs font-medium text-gray-600 mb-1 block">Option B: Paste Web URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://images.com/photo.jpg"
                className="flex-1 px-3 py-2 border rounded-md text-xs focus:ring-1 focus:ring-black outline-none bg-white"
              />
              <button
                type="button"
                onClick={handleAddUrlImage}
                className="px-4 py-2 bg-gray-900 text-white rounded-md text-xs font-medium hover:bg-black shrink-0"
              >
                Add Link
              </button>
            </div>
          </div>
        </div>

        {formData.images.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600 mb-2 font-medium">
              Uploaded Images ({formData.images.length}). First image is Main/Cover Photo:
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {formData.images.map((imgSrc, index) => (
                <div key={index} className={`relative group border-2 rounded-lg overflow-hidden bg-white ${index === 0 ? 'border-green-600 ring-2 ring-green-100' : 'border-gray-200'}`}>
                  <img src={imgSrc} alt={`Angle ${index + 1}`} className="w-full h-24 object-cover" />

                  {index === 0 && (
                    <span className="absolute top-1 left-1 bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                      Main
                    </span>
                  )}

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="self-end text-white bg-red-600 hover:bg-red-700 w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold"
                      title="Delete image"
                    >
                      ✕
                    </button>

                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryImage(index)}
                        className="bg-white text-gray-900 text-[10px] font-bold py-1 px-1 rounded shadow text-center hover:bg-gray-100"
                      >
                        Make Main
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Short Description — optional */}
      <div>
        <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
          Short Description <span className="text-gray-400 normal-case">(optional)</span>
        </label>
        <input
          type="text"
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleChange}
          placeholder="One-line summary shown near the price"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none text-sm"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
          Description &amp; Fabric Details <span className="text-gray-400 normal-case">(optional)</span>
        </label>
        <textarea
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          placeholder="Includes Organza Dupatta, Embroidered Front, Plain Trousers..."
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none text-sm"
        />
      </div>

      {/* Product Care — optional */}
      <div>
        <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
          Product Care <span className="text-gray-400 normal-case">(optional)</span>
        </label>
        <textarea
          name="productCare"
          rows={2}
          value={formData.productCare}
          onChange={handleChange}
          placeholder="Dry clean only. Do not bleach. Iron on low heat..."
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none text-sm"
        />
      </div>

      {/* In Stock Toggle — only for Simple products; Variable products use per-variant stock */}
      {!isVariable && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="inStock"
            name="inStock"
            checked={formData.inStock}
            onChange={handleChange}
            className="w-4 h-4 text-black rounded focus:ring-black"
          />
          <label htmlFor="inStock" className="text-sm font-medium text-gray-700 cursor-pointer">
            Available in Stock
          </label>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end gap-3 border-t pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 shadow-sm"
        >
          {initialData ? 'Save Changes' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
