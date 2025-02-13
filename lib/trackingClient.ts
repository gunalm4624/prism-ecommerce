export interface TrackingInfo {
  trackingUrl: string;
  carrier: string;
  trackingNumber: string;
}

export const getTrackingInfo = (trackingNumber: string, carrier?: string): TrackingInfo => {
  // Default to STCourier if carrier is null/undefined
  const normalizedCarrier = carrier?.toLowerCase() || 'stcourier';
  
  if (normalizedCarrier === 'stcourier') {
    return {
      trackingUrl: 'https://stcourier.com',  // Changed to homepage
      carrier: 'STCourier',
      trackingNumber
    };
  }

  // Fallback to STCourier
  return {
    trackingUrl: 'https://stcourier.com',
    carrier: 'STCourier',
    trackingNumber
  };
};

// Function to handle form submission to ST Courier's official tracking
export const handleSTCourierTracking = (trackingNumber: string) => {
  // Open ST Courier homepage in a new window
  const trackingWindow = window.open('https://stcourier.com', '_blank');
  
  if (trackingWindow) {
    // Wait for the page to load then fill and submit the form
    trackingWindow.onload = () => {
      try {
        // Find the input field and submit button by their IDs
        const inputField = trackingWindow.document.getElementById('awb_no');
        const submitButton = trackingWindow.document.getElementById('track');
        
        if (inputField instanceof HTMLInputElement && submitButton instanceof HTMLElement) {
          // Fill in the tracking number
          inputField.value = trackingNumber;
          // Click the submit button
          submitButton.click();
        }
      } catch (error) {
        console.error('Error automating tracking:', error);
        // Fallback: Just open the homepage if automation fails
        window.open('https://stcourier.com', '_blank');
      }
    };
  }
};

// Add any other tracking-related functions here
export const getTrackingStatus = (trackingNumber: string) => {
  // This could be used to show a basic status
  return 'Tracking available';
}; 