import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICourse extends Document {
  titleDe: string;
  titleAr?: string;
  descriptionDe: string;
  descriptionAr?: string;
  language: 'de' | 'ar' | 'both';
  price?: number;
  status: 'draft' | 'published' | 'archived';
  startDate?: Date;
  endDate?: Date;
  materials?: Array<{
    fileName: string;
    fileUrl: string;
    fileType: 'pdf' | 'presentation' | 'video_link';
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema: Schema = new Schema(
  {
    titleDe: { type: String, required: true },
    titleAr: String,
    descriptionDe: { type: String, required: true },
    descriptionAr: String,
    language: { type: String, enum: ['de', 'ar', 'both'], default: 'de' },
    price: Number,
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    startDate: Date,
    endDate: Date,
    materials: [
      {
        fileName: String,
        fileUrl: String,
        fileType: { type: String, enum: ['pdf', 'presentation', 'video_link'] },
      },
    ],
  },
  { timestamps: true }
);

const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);

export default Course;

