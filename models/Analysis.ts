import mongoose, { Schema, model, models } from 'mongoose';

export interface IAnalysis {
  clerkId: string;
  image: string;
  results: {
    skinTone: string;
    bodyType: string;
    faceShape: string;
    recommendations: any[];
  };
  createdAt: Date;
}

const AnalysisSchema = new Schema<IAnalysis>({
  clerkId: { type: String, required: true },
  image: { type: String, required: true },
  results: {
    skinTone: { type: String },
    bodyType: { type: String },
    faceShape: { type: String },
    recommendations: { type: [Schema.Types.Mixed] },
  },
  createdAt: { type: Date, default: Date.now },
});

const Analysis = models.Analysis || model('Analysis', AnalysisSchema);

export default Analysis;
