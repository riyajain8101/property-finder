export interface Ad {
  id?: string;
  title: string;
  subtitle: string;
  content: string;
  imageUrl: string;
  imageAlt: string;
  cta?: {
    label: string;
    url: string;
  };
}