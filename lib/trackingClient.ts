export interface TrackingInfo {
  trackingUrl: string;
  carrier: string;
  trackingNumber: string;
}

export const getTrackingInfo = (trackingNumber: string, carrier: string): TrackingInfo => {
  // For static export, we'll use the AfterShip tracking URL directly
  const trackingUrl = `https://track.aftership.com/${trackingNumber}`;
  
  return {
    trackingUrl,
    carrier,
    trackingNumber
  };
};

// Add any other tracking-related functions here
export const getTrackingStatus = (trackingNumber: string) => {
  // This could be used to show a basic status
  return 'Tracking available';
}; 