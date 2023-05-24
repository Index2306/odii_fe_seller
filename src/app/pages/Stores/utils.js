export const redirectToConnectPlatform = (platform, url) => {
  switch (platform) {
    case 'lazada':
      window.location.href = url;
      break;
    case 'shopee':
      window.location.href = url;
      break;
    case 'tiktok':
      window.location.href = url;
      break;
    default:
      break;
  }
};
