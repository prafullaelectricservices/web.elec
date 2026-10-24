/**
 * ============================================================================
 * SINGLE EDITABLE CONFIGURATION
 * ============================================================================
 * Edit your business information here in ONE place.
 * All phone links, WhatsApp buttons, email links, company titles, addresses,
 * and SEO schemas across the entire website will automatically update.
 * ============================================================================
 */

const CONFIG = {
  // Business Identity
  company: "Prafulla Electrical Services",
  tagline: "Your Trusted Electrical Experts",
  engineerName: "Prafulla Zanzane",
  engineerRole: "Electrical Engineer & Founder",

  // Contact Details
  phoneDisplay: "+91 80803 05801",   // How your phone appears visually
  phoneHref: "+918080305801",         // Used for tel: links (numbers with country code)
  whatsapp: "918080305801",           // Used for https://wa.me/ links (without '+' sign)
  email: "zanzaneprafulla12@gmail.com",

  // Location & Service Area
  serviceArea: "Pune City & Nearby Areas",
  address: "Pune, Maharashtra, India",
  businessHours: "Monday – Saturday: 9:00 AM – 5:00 PM | Emergency Service Available",

  // Online & Maps
  website: "https://prafullaelectrical.com",
  googleMapsUrl: "https://maps.google.com/maps?q=Pune%2C+Maharashtra&t=&z=12&ie=UTF8&iwloc=&output=embed",

  // Social Media (Leave empty "" to hide icons from the footer)
  instagram: "",
  facebook: "",
  linkedin: "",
  youtube: ""
};

// Make accessible globally
if (typeof window !== "undefined") {
  window.CONFIG = CONFIG;
}
