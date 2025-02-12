const AFTERSHIP_API_KEY = 'YOUR_API_KEY';

export const getTrackingInfo = async (trackingNumber, carrier) => {
  try {
    const response = await fetch(`https://api.aftership.com/v4/trackings/${carrier}/${trackingNumber}`, {
      headers: {
        'aftership-api-key': AFTERSHIP_API_KEY,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    return data.data.tracking;
  } catch (error) {
    console.error('Error fetching tracking info:', error);
    return null;
  }
}; 