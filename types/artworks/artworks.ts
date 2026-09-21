export type ArtworkData = {
  title: string;
  description: string;
  location?: string | null;
  price: string;
  dimensions: string;
  artist: string;
  artwork_note?: string;
};

export type NewArtworkData = ArtworkData;

export type Artwork = {
  id: string;
  title: string;
  description: string;
  location?: string | null;
  image_path: string;
  sold: boolean;
  price: number;
  created_at: string;
};

export type ExhibitionArtwork = {
  id: string;
  title: string | null;
  image_path: string | null;
  price: number | null;
  dimensions: string | null;
  artist: {
    id: string;
    name: string;
  };
};
