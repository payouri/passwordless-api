import mongoose from "mongoose";
import { getDomainModel } from "../../../../shared/entities/Domain/Domain.model.js";

export const initModels = async (c = mongoose.connection) => {
  const domainModel = getDomainModel(c);

  return {
    domainModel,
  };
};
