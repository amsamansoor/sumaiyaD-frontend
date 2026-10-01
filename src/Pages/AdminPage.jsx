import React from 'react';
import AdminPanel from '../components/Admin/AdminPanel';

export default function AdminPage({ 
  products, 
  coupons,
  categories,
  heroConfig,
  announcementConfig,
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct, 
  onAddCoupon,
  onDeleteCoupon,
  onUpdateHero,
  onDeleteHero,         // <-- 1. Yahan prop receive karein
  onUpdateAnnouncement,
  onBackToHome 
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminPanel 
        products={products}
        coupons={coupons}
        categories={categories}
        heroConfig={heroConfig}
        announcementConfig={announcementConfig}
        onAddProduct={onAddProduct}
        onUpdateProduct={onUpdateProduct}
        onDeleteProduct={onDeleteProduct}
        onAddCoupon={onAddCoupon}
        onDeleteCoupon={onDeleteCoupon}
        onUpdateHero={onUpdateHero}
        onDeleteHero={onDeleteHero}       
        onUpdateAnnouncement={onUpdateAnnouncement}
        onBackToStore={onBackToHome}
      />
    </div>
  );
}