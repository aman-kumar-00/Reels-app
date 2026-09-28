import mongoose, {Document, Schema} from 'mongoose';

export interface IReel extends Document {
  title: string;
  videoUrl: string;
  publicId: string;
  description?: string;
  likes: number;
  views: number;
  createdAt: Date;
}

const reelSchema = new Schema<IReel>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    videoUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: '',
    },

    likes: {
      type: Number,
      default: 0,
    },

    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Reel = mongoose.model<IReel>(
  'Reel',
  reelSchema,
);

export default Reel;