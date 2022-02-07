import { createContext, useContext } from "react";
import ActivityStore from "./activity-store";
import CommonStore from "./commonStore";
import ModalStore from "./modalStore";
import UserStore from "./user-store";


interface Store {
  activityStore: ActivityStore;
  commonStore: CommonStore;
  userStore: UserStore;
  modalStore: ModalStore;
}

export const store: Store = {
  activityStore: new ActivityStore(),
  commonStore: new CommonStore(),
  userStore: new UserStore(),
  modalStore: new ModalStore()
}

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}