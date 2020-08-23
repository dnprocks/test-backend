import mongoose, { Document, Model } from 'mongoose';

export interface Movie {
  _id?: string;
  title: string;
  description: string;
  genre: string;
  director: string;
  actors: string;
  year: string;
  country: string;
  rating: string;
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
      ratingCount: { type: String, required: false },
      bestRating: { type: String, required: false },
      worstRating: { type: String, required: false },
      ratingValue: { type: String, required: false },
      ratingAverage: { type: String, required: false },
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
