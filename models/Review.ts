import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  courseId: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  studentName?: string;
  isPublic: boolean;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
    studentName: String,
    isPublic: { type: Boolean, default: true },
    isAnonymous: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index für bessere Performance
ReviewSchema.index({ courseId: 1 });
ReviewSchema.index({ createdAt: -1 });

const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;

