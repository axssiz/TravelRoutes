// client/src/components/LoadingSkeletons.jsx
import React from "react";
import "../styles/Skeletons.css";

export const HotelCardSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-image"></div>
    <div className="skeleton skeleton-text"></div>
    <div className="skeleton skeleton-text short"></div>
    <div className="skeleton skeleton-text short"></div>
  </div>
);

export const HotelGridSkeleton = () => (
  <div className="hotels-grid">
    {Array.from({ length: 6 }).map((_, i) => (
      <HotelCardSkeleton key={i} />
    ))}
  </div>
);

export const RouteCardSkeleton = () => (
  <div className="skeleton-route">
    <div className="skeleton skeleton-text"></div>
    <div className="skeleton skeleton-text"></div>
    <div className="skeleton skeleton-text short"></div>
  </div>
);

export const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Загрузка...</p>
  </div>
);
