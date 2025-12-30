import { defineStore } from "pinia";
import axios from "axios";
import { api } from "@/utils/axios";
import Toast from "@/helper";
// import { useRouter } from "vue-router";
import { useSettingStore } from "./setting";
import router from "../router";

import expirationToken from "@/utils/expirationToken";

// const router = useRouter();

export const useStore = defineStore("cart", {
  state: () => ({
    // for Auth (login, logout, getProfile)
    token: localStorage.getItem("token") || null,
    user: null,
    message: null,
    alert: null,
    exp: null,
    isLogout: false,
    studentClass: [],
    total_students: null,
    female_students: null,
    student_no_class: [],
    classroom: null,
    time_counta: null,
    campus: [],
  }),
  actions: {
    async get_student_class(id) {
      await api.post(`/get_one_student_class/${id}`).then((res) => {
        this.studentClass = res.data.students;
        this.total_students = res.data.total_students;
        this.female_students = res.data.female_students;
        this.classroom = res.data.classInfo;
        this.student_no_class = res.data.students_not_in_class;

        console.log("classroomIn", this.classroom);
      });
    },

    loadStoredAuth() {
      const token = localStorage.getItem("token");
      const exp = localStorage.getItem("exp");

      if (token && exp) {
        // If both token and exp exist in localStorage, load them into the store
        this.token = token;
        this.exp = exp;
      }
    },

    startTokenExpirationMonitor() {
      let time_count = 3000;
      this.time_counta = setInterval(() => {
        const exp = localStorage.getItem("exp");
        console.log("aa");
        if (expirationToken(exp)) {
          console.log("Is Loggout");
          this.logout(); // Log out the user
          this.isLogout = true;
          localStorage.setItem("token", "needlogin");
        }
      }, time_count);
      // Check every 60 seconds (you can adjust the interval as needed)
    },

    async login(credentials) {
      try {
        const response = await api.post("login", credentials);
        this.message = response.data.message;
        this.alert = response.data.alert;
        console.log(this.alert);

        if (response.data.status) {
          this.token = response.data.token;
          this.exp = response.data.exp;
          this.$patch({
            user: response.data.user,
          });
          localStorage.setItem("user", JSON.stringify(this.user));
          localStorage.setItem("token", this.token);
          localStorage.setItem("exp", this.exp);
          console.log("Stored Token:", localStorage.getItem("token"));
          await this.authCampus();

          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${this.token}`;
          return true;
        }
      } catch (error) {
        console.error("error", error);
        this.message = error.response.data.message;
        return false;
      }
    },

    async authCampus() {
      try {
        const response = await api.post("authCampus");
        this.$patch({
          campus: response.data.data,
        });
        localStorage.setItem("campus", JSON.stringify(this.campus));
      } catch (error) {
        console.log("error authcampus", error);
      }
    },

    async unAuthenticated() {
      this.token = null;
      this.user = null;
      this.campus = [];

      // ✅ Remove all from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("exp");
      localStorage.removeItem("campus");
      localStorage.removeItem("user");
      useSettingStore().campus_id = null;

      // ✅ Remove auth header
      delete axios.defaults.headers.common["Authorization"];

      // useCookie("accessToken").value = null;
      router.push("/login");
    },

    // async getAllProfile() {
    //   try {
    //     axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
    //     await axios
    //       .get(`https://iconic.disreportcard.com/api/viewporfile/1`)
    //       .then((res) => {
    //         console.log("dataaa", res.data);
    //       });
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },

    // async logout() {
    //   try {
    //     let check_token = localStorage.getItem("token");

    //     if (check_token == undefined) {
    //       console.log("Underfinded Token");
    //       localStorage.setItem("token", "needlogin");
    //     } else {
    //       console.log(check_token);
    //       if (check_token != "needlogin") {
    //         axios.defaults.headers.common[
    //           "Authorization"
    //         ] = `Bearer ${this.token}`;
    //         await api.get("/logout").then((res) => {
    //           Toast.fire({
    //             title: res.data.message,
    //             icon: "warning",
    //           });
    //           // window.location.reload();
    //         });
    //         this.token = null;
    //         this.user = null;
    //         this.campus = [];
    //         localStorage.removeItem("token");
    //         localStorage.removeItem("exp");
    //         localStorage.removeItem("campus");
    //         delete axios.defaults.headers.common["Authorization"];
    //       }
    //     }
    //   } catch (error) {
    //     console.error(error);
    //   }
    // },

    async logout() {
      try {
        const check_token = localStorage.getItem("token");

        if (!check_token || check_token === "needlogin") {
          console.log("No valid token. Already logged out.");
          localStorage.setItem("token", "needlogin");
        } else {
          console.log("Logging out with token:", check_token);

          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${this.token}`;

          await api.get("/logout").then((res) => {
            Toast.fire({
              title: res.data.message,
              icon: "warning",
            });
          });

          // ✅ Clear Pinia state
          this.token = null;
          this.user = null;
          this.campus = [];

          // ✅ Remove all from localStorage
          localStorage.removeItem("token");
          localStorage.removeItem("exp");
          localStorage.removeItem("campus");
          localStorage.removeItem("user");
          useSettingStore().campus_id = null;

          // ✅ Remove auth header
          delete axios.defaults.headers.common["Authorization"];
        }
      } catch (error) {
        console.error("Logout error:", error);
      }
    },

    async getProfile() {
      try {
        console.log(this.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
        const response = await api.post("/profile");
        this.user = response.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
});
