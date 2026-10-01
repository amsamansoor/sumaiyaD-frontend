import React, { useState } from 'react';
import { Package, Tag, DollarSign, Store, Image as ImageIcon, Megaphone, ShoppingBag, LayoutGrid, LayoutTemplate } from 'lucide-react';
import logoImage from "../../assets/logo.png";
import { addProduct, updateProduct } from '../../Service/api';
import ProductForm from './ProductForm';
import ProductTable from './ProductTable';
import HeroManager from './HeroManager';
import AdminOrdersPanel from './AdminOrdersPanel';
import CategoryImagesPanel from './CategoryImagesPanel';
import HomeSectionsManager from './HomeSectionsManager';

const PROMO_SLOTS = [
  { key: 'promo-ready-to-wear', label: 'Big banner — Ready To Wear' },
  { key: 'promo-unstitched',    label: 'Big banner — Unstitched' },
  { key: 'promo-couture',       label: 'Small banner — Couture' },
  { key: 'promo-jewelry',       label: 'Small banner — Jewelry' },
  { key: 'promo-accessories',   label: 'Small banner — Accessories' },
];

const TABS = [
  { id: 'homepage', label: 'Homepage Sections', icon: LayoutTemplate },
  { id: 'products', label: 'Products Catalog', icon: Package },
  { id: 'hero', label: 'Hero Banner', icon: ImageIcon },
  { id: 'announcements', label: 'Announcement Bar', icon: Megaphone },
  { id: 'categories', label: 'Category Images', icon: LayoutGrid },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
];

export default function AdminPanel({
  products = [],
  heroConfig = {},
  announcementConfig = {},
  currentUser,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateHero,
  onUpdateAnnouncement,
  onBackToStore
}) {
  const [activeTab, setActiveTab] = useState('products');
  const [editingProduct, setEditingProduct] = useState(null);

  const [heroForm, setHeroForm] = useState({
    title: heroConfig.title || 'Luxury Lawn Collection 2026',
    subtitle: heroConfig.subtitle || 'Discover timeless Pakistani couture crafted with precision.',
    imageUrl: heroConfig.imageUrl || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600',
    buttonText: heroConfig.buttonText || 'Shop Collection',
    buttonLink: heroConfig.buttonLink || '#shop'
  });

  const [announcementForm, setAnnouncementForm] = useState({
    text: announcementConfig.text || 'Complimentary Worldwide Shipping on Orders Above PKR 15,000',
    isActive: announcementConfig.isActive !== undefined ? announcementConfig.isActive : true
  });

  const handleFormSubmit = async (productData) => {
    try {
      const token = currentUser?.token || currentUser;

      const formattedPayload = {
        id: editingProduct ? Number(editingProduct.id || editingProduct._id || 0) : 0,
        title: productData.title || productData.name || '',
        price: Number(productData.price) || 0,
        originalPrice: productData.originalPrice ? Number(productData.originalPrice) : 0,
        category: productData.category || 'Uncategorized',
        imageUrl: productData.imageUrl || (Array.isArray(productData.images) ? productData.images[0] : ''),
        images: Array.isArray(productData.images) && productData.images.length > 0
          ? productData.images
          : [productData.imageUrl].filter(Boolean),
        description: productData.description || '',
        shortDescription: productData.shortDescription || null,
        productCare: productData.productCare || null,
        inStock: productData.inStock !== undefined ? Boolean(productData.inStock) : true,
        productType: productData.productType || 'simple',
        attributeGroups: productData.attributeGroups || [],
        variants: productData.variants || []
      };

      if (editingProduct) {
        const productId = editingProduct.id || editingProduct._id;
        const res = await updateProduct(productId, formattedPayload, token);
        const createdData = res || {}; // api.js returns the object directly, no .data wrapper

        const updatedItem = {
          ...formattedPayload,
          ...createdData,
          id: createdData.id || formattedPayload.id
        };

        if (typeof onUpdateProduct === 'function') {
          onUpdateProduct(updatedItem); // state update only — this call already saved to the DB above
        }
        alert('Product updated.');
        setEditingProduct(null);
      } else {
        const res = await addProduct(formattedPayload, token);
        const createdData = res || {}; // api.js returns the object directly, no .data wrapper

        const newItem = {
          ...formattedPayload,
          ...createdData,
          id: createdData.id
        };

        if (!newItem.id) {
          console.error('No id returned from server for new product:', res);
        }

        if (typeof onAddProduct === 'function') {
          onAddProduct(newItem); // state update only — this call already saved to the DB above
        }
        alert('Product published.');
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert('Could not save. Check network or terminal logs.');
    }
  };

  const handleSaveHero = (e) => {
    e.preventDefault();
    if (typeof onUpdateHero === 'function') onUpdateHero(heroForm);
    alert('Hero banner updated.');
  };

  const handleSaveAnnouncement = (e) => {
    e.preventDefault();
    if (typeof onUpdateAnnouncement === 'function') onUpdateAnnouncement(announcementForm);
    alert('Announcement bar updated.');
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setActiveTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const safeProducts = (products || []).filter(Boolean);

  const totalInventoryValue = safeProducts.reduce((acc, curr) => {
    const itemPrice = curr && curr.price ? Number(curr.price) : 0;
    return acc + (isNaN(itemPrice) ? 0 : itemPrice);
  }, 0);

  const totalCategories = new Set(
    safeProducts.map(p => p && p.category ? p.category : 'Uncategorized')
  ).size;

  const availableCategories = [
    'Kids', 'Stitched', 'Ready to Wear', 'Unstitched', 'Luxury Formal',
    'Luxury Pret', 'Accessories', 'Jewlary', 'Perfumes'
  ];

  // Categories shown in the "Category Images" tab — 'All' first, then every category a product can use
  const categoryImageNames = ['All', ...availableCategories];

  return (
    <div className="bg-[#FAF9F7] min-h-screen text-[#1A1A1A]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 mb-6 border-b border-[#E5E2DC] text-center sm:text-left">
          <button onClick={onBackToStore} className="flex items-center h-16 shrink-0">
            <img
              src={logoImage}
              alt="SUMAYYA.D"
              className="h-20 w-auto object-contain -my-2"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/140x45?text=SUMAYYA.D"; }}
            />
          </button>

          <div className="flex-1 order-3 sm:order-none">
            <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl tracking-tight">Store Management</h1>
            <p className="text-xs text-[#8A8580] mt-0.5">Sumayya.D Clothing — inventory &amp; storefront control</p>
          </div>

          <button
            onClick={onBackToStore}
            className="flex items-center gap-2 border border-[#1A1A1A] text-[#1A1A1A] text-xs uppercase tracking-widest font-semibold px-4 py-2.5 hover:bg-[#1A1A1A] hover:text-white transition-colors shrink-0"
          >
            <Store size={15} />
            <span>View Live Store</span>
          </button>
        </div>

        {/* Tabs — underline style, matching the storefront's category tabs */}
        <div className="flex gap-8 border-b border-[#E5E2DC] mb-8 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 pt-1 text-xs font-semibold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${
                  isActive ? 'border-[#1A1A1A] text-[#1A1A1A]' : 'border-transparent text-[#8A8580] hover:text-[#1A1A1A]'
                }`}
              >
                <Icon size={15} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB: HOMEPAGE SECTIONS */}
        {activeTab === 'homepage' && (
          <HomeSectionsManager currentUser={currentUser} availableCategories={availableCategories} />
        )}

        {/* TAB: PRODUCTS */}
        {activeTab === 'products' && (
          <>
            {/* Stats — single bordered strip with dividers, no card-kit repetition */}
            <div className="grid grid-cols-1 sm:grid-cols-3 border border-[#E5E2DC] divide-y sm:divide-y-0 sm:divide-x divide-[#E5E2DC] mb-10 bg-white">
              <Stat icon={Package} label="Total Products" value={safeProducts.length} />
              <Stat icon={Tag} label="Active Categories" value={totalCategories} />
              <Stat icon={DollarSign} label="Catalog Value" value={`PKR ${totalInventoryValue.toLocaleString()}`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-1">
                <ProductForm
                  initialData={editingProduct}
                  onSubmit={handleFormSubmit}
                  onCancel={editingProduct ? () => setEditingProduct(null) : undefined}
                  categories={availableCategories}
                />
              </div>
              <div className="lg:col-span-2">
                <ProductTable
                  safeProducts={safeProducts}
                  onEdit={handleEditClick}
                  onDelete={onDeleteProduct}
                />
              </div>
            </div>
          </>
        )}

        {/* TAB: HERO */}
        {activeTab === 'hero' && (
          <div className="max-w-4xl mx-auto">
            <HeroManager
              heroList={Array.isArray(heroConfig) ? heroConfig : [heroConfig].filter(Boolean)}
              onSaveHero={(newHero) => {
                const currentArray = Array.isArray(heroConfig) ? heroConfig : [heroConfig].filter(Boolean);
                const exists = currentArray.find(h => h.id === newHero.id);
                const updated = exists
                  ? currentArray.map(h => h.id === newHero.id ? newHero : h)
                  : [...currentArray, newHero];
                if (typeof onUpdateHero === 'function') onUpdateHero(updated);
                alert('Hero banners updated.');
              }}
              onDeleteHero={(id) => {
                const currentArray = Array.isArray(heroConfig) ? heroConfig : [heroConfig].filter(Boolean);
                const filtered = currentArray.filter(h => h.id !== id);
                if (typeof onUpdateHero === 'function') onUpdateHero(filtered);
                alert('Hero banner deleted.');
              }}
            />
          </div>
        )}

        {/* TAB: ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
          <div className="bg-white border border-[#E5E2DC] p-8 max-w-2xl mx-auto">
            <h2 className="font-serif text-xl mb-1">Announcement Bar</h2>
            <p className="text-xs text-[#8A8580] mb-6">Update the top notification ticker for discount offers or notices.</p>

            <form onSubmit={handleSaveAnnouncement} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#8A8580] mb-1.5">
                  Top bar text
                </label>
                <input
                  type="text"
                  value={announcementForm.text}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, text: e.target.value })}
                  className="w-full border border-[#E5E2DC] px-3 py-2.5 text-sm focus:outline-none focus:border-[#1A1A1A]"
                  required
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={announcementForm.isActive}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, isActive: e.target.checked })}
                  className="w-4 h-4 accent-[#1A1A1A]"
                />
                <span className="text-xs font-semibold uppercase tracking-wide text-[#1A1A1A]">
                  Show on website header
                </span>
              </label>

              <button
                type="submit"
                className="w-full bg-[#1A1A1A] text-white text-xs uppercase tracking-widest font-semibold py-3.5 hover:bg-black transition-colors"
              >
                Save &amp; Update
              </button>
            </form>
          </div>
        )}

        {/* TAB: CATEGORY IMAGES */}
        {activeTab === 'categories' && (
          <CategoryImagesPanel
            currentUser={currentUser}
            sections={[
              {
                title: 'Homepage — Category Cards',
                description: 'The "New Arrivals" strip at the top of the homepage.',
                items: categoryImageNames.map((n) => ({ key: n, label: n })),
              },
              {
                title: 'Homepage — Promo Banners',
                description: 'The two large and three small banners in the middle of the homepage.',
                items: PROMO_SLOTS,
              },
            ]}
          />
        )}

        {/* TAB: ORDERS */}
        {activeTab === 'orders' && (
          <AdminOrdersPanel currentUser={currentUser} />
        )}

      </main>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 px-6 py-6">
      <Icon size={20} className="text-[#8A8580]" strokeWidth={1.75} />
      <div>
        <p className="text-xs uppercase tracking-wide text-[#8A8580]">{label}</p>
        <p className="font-serif text-2xl mt-0.5">{value}</p>
      </div>
    </div>
  );
}
