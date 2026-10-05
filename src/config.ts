export const site = {
  name: 'Facstol',
  owner: 'Milan Fačka',
  url: 'https://facstol.sk',
  description:
    'Nábytok na mieru z Lučenca – kuchyne, vstavané skrine, kúpeľne aj detské izby. Obhliadka zdarma, výroba a montáž po celom Slovensku.',
  phone: '+421903654667',
  phoneDisplay: '+421 903 654 667',
  email: 'info@facstol.sk',
  // Years of practice and completed jobs are derived from these two
  practiceSince: 2010,
  jobsPerYear: 26,
  city: 'Lučenec',
  cityIn: 'v Lučenci', // locative form used in sentences
  abroad: 'Rakúsko', // leave both empty to hide
  abroadIn: 'v Rakúsku', // locative form used in sentences
  // Public access key from web3forms.com; when empty the form falls back to mailto
  web3formsKey: '',
};

// Evaluated at build time; the deploy workflow also rebuilds once a year
export const yearsOfPractice = new Date().getFullYear() - site.practiceSince;
export const completedJobs = Math.floor((yearsOfPractice * site.jobsPerYear) / 10) * 10;

export const locationText =
  `Sídlim ${site.cityIn}, ale nábytok doveziem a namontujem kdekoľvek na Slovensku.` +
  (site.abroadIn ? ` Realizoval som už aj zákazky v zahraničí, napríklad ${site.abroadIn}.` : '');

export const nav = [
  { href: '/galeria/', label: 'Galéria' },
  { href: '/o-mne/', label: 'O mne' },
  { href: '/kontakt/', label: 'Kontakt' },
];
