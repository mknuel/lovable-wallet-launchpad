// Validate phone number
export const validatePhone = (value) => {
  if (!value.trim()) {
    return false;
  } else if (value.length < 7) {
    return false;
  } else {
    return true;
  }
};

// Validate password
export const validatePassword = (value) => {
  if (!value.trim()) {
    return false;
  } else if (value.length < 6) {
    return false;
  } else {
    return true;
  }
};

export const formatAddress = (address, first = 5, end = 3) => {
  if (address.length <= 8) return address;
  return `${address.slice(0, first)}...${address.slice(-end)}`;
};

export const copyToClipboard = (text, setCopied) => {
  navigator.clipboard.writeText(text);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};
