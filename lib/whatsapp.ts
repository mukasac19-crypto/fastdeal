const whatsappNumber = process.env.NEXT_PUBLIC_FASTDEAL_WHATSAPP_NUMBER?.replace(/\D/g, "");

export function getWhatsAppHref(message: string) {
  const text = encodeURIComponent(message);

  if (!whatsappNumber) {
    return `/contact?message=${text}`;
  }

  return `https://wa.me/${whatsappNumber}?text=${text}`;
}

export function getGeneralWhatsAppHref() {
  return getWhatsAppHref(
    "Hello FastDeal Rwanda, I would like help with a car."
  );
}
