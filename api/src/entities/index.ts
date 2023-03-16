import mongoose from "mongoose";
import { getDomainModel } from "./Domain/Domain.model.js";

export const initModels = async (c = mongoose.connection) => {
  getDomainModel(c);
};
