export interface NavBanner {
  src: string;
  alt: string;
  caption?: string;
}

export interface NavLink {
  label: string;
  href: string;
  sale?: boolean;
  chevron?: boolean;
  sectionTitle?: string;
  banner?: NavBanner;
  children?: NavLink[];
}

export interface MenuSections {
  products: { label: string; links: NavLink[] };
  brand: { label: string; links: NavLink[] };
  utility: NavLink[];
  utilityMobile: NavLink[];
}

export interface SiteNavigation {
  mainNav: NavLink[];
  menuSections: MenuSections;
  footerShop: NavLink[];
  searchCategories: Array<{ label: string; href: string; query: string }>;
  source: 'shopify' | 'static';
}
