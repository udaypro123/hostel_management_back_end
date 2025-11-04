import mongoose from "mongoose";

const knowledgeSchema = new mongoose.Schema({
    ownerId: {
        type: String,
        required: true,
    },
    collection: { type: String, required: true }, // kis model se aaya
    refId: { type: String, required: true },      // original document _id
    title: { type: String, required: true },      // short heading
    content: { type: String, required: true },    // human readable content
}, { timestamps: true });

export const KnowledgeBase = mongoose.model("KnowledgeBase", knowledgeSchema);