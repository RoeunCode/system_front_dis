import { defineStore } from "pinia";

export const useSettingStore = defineStore("setting", {
  state: () => ({
    campus_id: null,
  }),

  getters: {
    geCampusId() {
      return this.campus_id;
    },
  },

  actions: {
    setCampusId(id) {
      this.campus_id = id;
    },
  },

  persist: {
    storage: localStorage,
  },
});
