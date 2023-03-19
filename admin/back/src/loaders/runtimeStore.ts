import { getDomainServices } from "../services/Domain/Domain.service.js";
import { getUserAccountServices } from "../services/UserAccount/UserAccount.services.js";

type UnInitializedRuntimeStore = null;

type InitializedRuntimeStore = {
  adminDomainId: string;
  adminUserAccountId: string;
};

let runtimeStore: ReturnType<typeof createRuntimeStore>;

const createRuntimeStore = () => {
  let store: UnInitializedRuntimeStore | InitializedRuntimeStore = null;

  const userAccountService = getUserAccountServices();
  const domainService = getDomainServices();

  const init = async () => {
    const adminUserAccount = await userAccountService.getAdminUserAccount();
    const adminDomain = await domainService.getAdminDomain();

    if (!adminUserAccount || !adminDomain) {
      throw new Error("Admin user account or domain not found");
    }

    store = {
      adminDomainId: adminDomain._id,
      adminUserAccountId: adminUserAccount._id,
    };
  };

  return {
    init,
    get isInitialized() {
      return store !== null;
    },
    get adminDomainId() {
      if (!store) throw new Error("Runtime store not initialized");
      return store.adminDomainId;
    },
    get adminUserAccountId() {
      if (!store) throw new Error("Runtime store not initialized");
      return store.adminUserAccountId;
    },
  };
};

export const getRuntimeStore = () => {
  if (!runtimeStore) {
    runtimeStore = createRuntimeStore();
  }

  return runtimeStore;
};
