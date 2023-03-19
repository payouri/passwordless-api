import {
  Domain,
  DomainModel,
} from "../../../../../shared/entities/Domain/Domain.js";
import { ADMIN_CONFIG } from "../../config.js";
import {
  generateHashFromPublicKey,
  getPublicKey,
} from "../../lib/AsymetricEncryption/index.js";
import { isDuplicateKeyError } from "../../../../../shared/helpers/index.js";

export const buildDomainServices = ({
  adminDomainModel,
}: {
  adminDomainModel: DomainModel;
}) => {
  return {
    async isAdminDomainExist() {
      const adminDomain = await adminDomainModel.findOne(
        {},
        {
          _id: 1,
        }
      );

      return adminDomain !== null;
    },
    async createAdminDomain(params: Omit<Domain, "_id">) {
      if (await this.isAdminDomainExist()) {
        throw new Error("Admin user account already exist");
      }

      return adminDomainModel.create(params);
    },
    getAdminDomain() {
      return adminDomainModel.findOne({});
    },
    addAdminDomainAllowedHost(allowedHost: string) {
      return adminDomainModel.updateOne(
        {},
        {
          $push: {
            allowedHosts: allowedHost,
          },
        }
      );
    },
    async initAdminDomain(params: { owner: string }) {
      const { adminDomain } = ADMIN_CONFIG;
      const publicKey = await getPublicKey();

      const adminDomainData: Omit<Domain, "_id"> = {
        allowedHosts: adminDomain.allowedHosts,
        apiKey: await generateHashFromPublicKey(publicKey),
        authTypes: adminDomain.authTypes,
        metadata: {},
        name: adminDomain.name,
        owner: params.owner,
        pubKey: publicKey,
        returnURL: adminDomain.returnURL,
      };

      try {
        const adminDomain = await this.createAdminDomain(adminDomainData);

        return adminDomain;
      } catch (error) {
        if (isDuplicateKeyError(error)) {
          const adminDomain = await this.getAdminDomain();

          return adminDomain;
        }
        throw error;
      }
    },
  };
};
