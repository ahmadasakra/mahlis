import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IComment extends Document {
  articleId: mongoose.Types.ObjectId;
  authorName: string;
  authorEmail?: string;
  content: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    articleId: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
    authorName: { type: String, required: true },
    authorEmail: String,
    content: { type: String, required: true },
    isApproved: { type: Boolean, default: false }, // Für Moderation
  },
  { timestamps: true }
);

// Index für bessere Performance
CommentSchema.index({ articleId: 1, isApproved: 1, createdAt: -1 });
CommentSchema.index({ createdAt: -1 });

const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;



