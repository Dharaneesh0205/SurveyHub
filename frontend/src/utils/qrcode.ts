export const generateQRCode = (text: string): string => {
  // Simple QR code generation using QR Server API
  const size = 200;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
  return qrUrl;
};