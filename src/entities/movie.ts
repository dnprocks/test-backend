import mongoose, { Document, Model } from 'mongoose';

export interface Ratting {
  ratingCount: number;
  bestRating: number;
  worstRating: number;
  ratingValue: number;
  ratingAverage: number;
}

export interface Movie {
  _id?: string;
  title: string;
  description: string;
  genre: string;
  director: string;
  actors: string;
  year: string;
  country: string;
  rating: Ratting;
}

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    country: { type: String, required: false },
    rating: {
      _id: false,
      ratingCount: { type: Number, default: 0 },
      bestRating: { type: Number, default: 0 },
      worstRating: { type: Number, default: 0 },
      ratingValue: { type: Number, default: 0 },
      ratingAverage: { type: Number, default: 0 },
    },
    director: {
      name: { type: String, required: false },
    },
    // TODO: Move to entity?
    actor: [
      {
        _id: false,
        name: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

interface MovieModel extends Omit<Movie, '_id'>, Document {}

export const Movie: Model<MovieModel> = mongoose.model('Movie', schema);
