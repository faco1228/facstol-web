import type { ImageMetadata } from 'astro';

interface Category {
  // Folder name in src/assets/galeria/, also used as the URL hash
  slug: string;
  title: string;
  // Singular form for the contact form
  singular?: string;
  // Default alt text
  alt: string;
  group: 'main' | 'other';
  // Cover file name (defaults to the first photo)
  cover?: string;
  // Alt text overrides per file name
  captions?: Record<string, string>;
}

export const categories: Category[] = [
  { slug: 'kuchyne', title: 'Kuchyne', singular: 'Kuchyňa', alt: 'Kuchynská linka na mieru', group: 'main', cover: 'kuchyna4.jpg' },
  { slug: 'skrine', title: 'Vstavané skrine', singular: 'Vstavaná skriňa', alt: 'Vstavaná skriňa na mieru', group: 'main', cover: 'skrina25.jpg' },
  { slug: 'satniky', title: 'Šatníky', singular: 'Šatník', alt: 'Šatník na mieru', group: 'main', cover: 'satnik1.jpg' },
  { slug: 'chodby', title: 'Chodby', singular: 'Nábytok do chodby', alt: 'Nábytok do chodby na mieru', group: 'main', cover: 'chodba3.jpg' },
  { slug: 'detske-izby', title: 'Detské izby', singular: 'Detská izba', alt: 'Detská izba na mieru', group: 'main', cover: 'detska7.jpg' },
  { slug: 'kupelne', title: 'Kúpeľne', singular: 'Kúpeľňa', alt: 'Kúpeľňový nábytok na mieru', group: 'main', cover: 'kupelna2.jpg' },
  { slug: 'spalne', title: 'Spálne', singular: 'Spálňa', alt: 'Spálňa na mieru', group: 'main', cover: 'spalna4.jpg' },
  { slug: 'obyvacky', title: 'Obývačky', singular: 'Obývačka', alt: 'Obývacia stena na mieru', group: 'main', cover: 'obyvacka3.jpg' },
  { slug: 'masiv', title: 'Výrobky z masívu', singular: 'Výrobok z masívu', alt: 'Výrobok z masívneho dreva', group: 'main', cover: 'masiv5.jpg' },

  { slug: 'pre-firmy', title: 'Nábytok pre vaše podnikanie', alt: 'Nábytok na mieru pre prevádzku', group: 'other', cover: 'ostatne7.jpg',
    captions: {
      'ostatne5.jpg': 'Uzatvorený priestor pre súkromie',
      'ostatne6.jpg': 'Uzatvorený priestor pre súkromie',
      'ostatne7.jpg': 'Kadernícky salón',
      'ostatne8.jpg': 'Kadernícky salón',
      'ostatne9.jpg': 'Kadernícky salón',
      'ostatne10.jpg': 'Kadernícky salón',
      'ostatne11.jpg': 'Pracovný stolík na manikúru',
      'ostatne12.jpg': 'Pracovný stolík na manikúru',
    } },
  { slug: 'jedalenske-stoly', title: 'Jedálenské stoly', alt: 'Jedálenský stôl na mieru', group: 'other' },
  { slug: 'policky', title: 'Poličky', alt: 'Poličky na mieru', group: 'other',
    captions: { 'ostatne4.jpg': 'Polička s vešiakmi', 'ostatne22.jpg': 'Domáca knižnica' } },
  { slug: 'stoliky-a-skrinky', title: 'Stolíky a skrinky', alt: 'Stolík na mieru', group: 'other',
    captions: { 'ostatne1.jpg': 'Malý praktický stolík', 'ostatne23.jpg': 'Skrinky', 'ostatne24.jpg': 'Praktický stolík s poličkou' } },
  { slug: 'ulozny-priestor', title: 'Úložný priestor', alt: 'Úložný priestor na mieru', group: 'other',
    captions: { 'ostatne16.jpg': 'Úložný priestor na spotrebiče' } },
  { slug: 'dekoracie', title: 'Dekorácie', alt: 'Dekorácia s úložným priestorom', group: 'other' },
  { slug: 'dekoracne-steny', title: 'Dekoračné steny', alt: 'Dekoračná stena', group: 'other' },
];

interface Photo {
  src: ImageMetadata;
  alt: string;
}

export interface CategoryWithPhotos extends Category {
  photos: Photo[];
  coverPhoto: Photo;
}

const files = import.meta.glob<ImageMetadata>('../assets/galeria/*/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}', {
  eager: true,
  import: 'default',
});

const byFolder = new Map<string, { file: string; src: ImageMetadata }[]>();
for (const [path, src] of Object.entries(files)) {
  const [folder, file] = path.split('/').slice(-2);
  if (!byFolder.has(folder)) byFolder.set(folder, []);
  byFolder.get(folder)!.push({ file, src });
}

// A folder without a category would silently disappear from the site – fail the build instead.
for (const folder of byFolder.keys()) {
  if (!categories.some((c) => c.slug === folder)) {
    throw new Error(`Folder src/assets/galeria/${folder} has no category in src/data/gallery.ts`);
  }
}

const naturalSort = (a: string, b: string) => a.localeCompare(b, 'sk', { numeric: true });

export const gallery: CategoryWithPhotos[] = categories.map((category) => {
  const entries = (byFolder.get(category.slug) ?? []).sort((a, b) => naturalSort(a.file, b.file));
  if (entries.length === 0) {
    throw new Error(`Category "${category.slug}" has no photos in src/assets/galeria/${category.slug}`);
  }
  const photos = entries.map(({ file, src }) => ({ src, alt: category.captions?.[file] ?? category.alt }));
  const coverIndex = Math.max(0, entries.findIndex((e) => e.file === category.cover));
  return { ...category, photos, coverPhoto: photos[coverIndex] };
});

export const mainCategories = gallery.filter((c) => c.group === 'main');
export const otherCategories = gallery.filter((c) => c.group === 'other');
export const photoCount = gallery.reduce((sum, c) => sum + c.photos.length, 0);
