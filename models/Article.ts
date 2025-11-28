import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IArticle extends Document {
  titleDe: string;
  titleAr?: string;
  contentDe: string;
  contentAr?: string;
  excerptDe?: string;
  excerptAr?: string;
  status: 'draft' | 'published';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema: Schema = new Schema(
  {
    titleDe: { type: String, required: true },
    titleAr: String,
    contentDe: { type: String, required: true },
    contentAr: String,
    excerptDe: String,
    excerptAr: String,
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    publishedAt: Date,
  },
  { timestamps: true }
);

ArticleSchema.index({ status: 1, publishedAt: -1 });

const Article: Model<IArticle> = mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);

export default Article;

