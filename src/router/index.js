import { createRouter, createWebHistory } from "vue-router";
import Default from "@/Layouts/default.vue";
import Blank from "@/Layouts/blank.vue";
import Vertical from "@/Layouts/vertical.vue";
import Login from "@/pages/login.vue";
import Dashboard from "@/pages/dashboard.vue";
import Test from "@/pages/test.vue";

import Error from "@/pages/Error.vue";

import StudentDetail from "@/pages/student/studentDetail.vue";

import CreateStudent from "@/pages/student/createStudent.vue";
import StudentList from "@/pages/student/studentList.vue";
import StudentDelete from "@/pages/student/deleteStudent.vue";
import CreateTeacher from "@/pages/Teacher/createTeacher.vue";
import TeacherList from "@/pages/Teacher/teacherList.vue";

import CreateGrade from "@/pages/grade/createGrade.vue";
import GradeList from "@/pages/grade/gradeList.vue";

import RoomList from "@/pages/Room/roomList.vue";
import CreateRoom from "@/pages/Room/createRoom.vue";

import ClassroomList from "@/pages/classRoom/classroomList.vue";
import CreateClassroom from "@/pages/classRoom/createClassroom.vue";
import ClassroomDetail from "@/pages/classRoom/classroomDetail.vue";

import AcademicYearList from "@/pages/AcademicYear/academicYearList.vue";
import CreateAcademicYear from "@/pages/AcademicYear/createAcademicYear.vue";
import CreateSubject from "@/pages/subject/createSubject.vue";
import SubjectList from "@/pages/subject/subjectList.vue";

import ReportPrimary from "@/pages/ReportScoreKhmer/reportPrimary.vue";
import ReportSecondary from "@/pages/ReportScoreKhmer/reportSecondary.vue";
import ReportHighSchool from "@/pages/ReportScoreKhmer/reportHighSchool.vue";

import ExamScore from "@/pages/exam-score/examScore.vue";
import ReportPdf from "@/PDF/reportPrimary.vue";
import KhmerAttendance from "@/pages/Attendance/khmerAttendance.vue";

import UserList from "@/pages/User/userList.vue";
import CreateUser from "@/pages/User/createUser.vue";

import ParentList from "@/pages/parents/parentsList.vue";
import ParentDetail from "@/pages/parents/parentDetail.vue";
import CreateParent from "@/pages/parents/createParents.vue";

import SocialCreate from "@/pages/socialMedia/socialCreate.vue";
import SocialList from "@/pages/socialMedia/socialList.vue";
import SocialDetail from "@/pages/socialMedia/socialDetail.vue";

import SemesterCreate from "@/pages/settingSemester/semesterCreate.vue";
import SemesterList from "@/pages/settingSemester/semesterList.vue";

import SettingScoreCreate from "@/pages/settingScore/settingScoreCreate.vue";
import SettingScoreList from "@/pages/settingScore/settingScoreList.vue";

import SettingSemesterList from "@/pages/settingSemesterList/settingSemesterList.vue";
import SettingSemesterCreate from "@/pages/settingSemesterList/settingSemesterCreate.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/",
      component: Blank,
      children: [
        {
          path: "login",
          name: "Login",
          component: Login,
        },
      ],
    },
    {
      path: "/",
      component: Vertical,
      // meta: { requiresAuth: true },
      children: [
        {
          path: "/social-detail/:id?",
          name: "Social_detail",
          component: SocialDetail,
        },
      ],
    },

    {
      path: "/",
      component: Default,
      meta: { requiresAuth: true },
      children: [
        {
          path: "dashboard",
          name: "Dashboard",
          component: Dashboard,
        },
        {
          path: "test",
          name: "Test",
          component: Test,
        },

        {
          path: "create-student/:id?",
          name: "CreateStudent",
          component: CreateStudent,
        },
        {
          path: "student-detail/:id?",
          name: "StudentDetail",
          component: StudentDetail,
        },
        {
          path: "student",
          name: "StudentList",
          component: StudentList,
        },
        {
          path: "student-delete",
          name: "StudentDelete",
          component: StudentDelete,
        },
        {
          path: "create-teacher/:id?",
          name: "CreateTeacher",
          component: CreateTeacher,
        },
        {
          path: "teacher",
          name: "TeacherList",
          component: TeacherList,
        },
        {
          path: "create-room/:id?",
          name: "CreateRoom",
          component: CreateRoom,
        },
        {
          path: "room",
          name: "RoomList",
          component: RoomList,
        },
        {
          path: "create-grade/:id?",
          name: "CreateGrade",
          component: CreateGrade,
        },
        {
          path: "grade",
          name: "GradeList",
          component: GradeList,
        },
        {
          path: "create-classroom/:id?",
          name: "CreateClassroom",
          component: CreateClassroom,
        },
        {
          path: "classroom_detail/:id?",
          name: "ClassroomDetail",
          component: ClassroomDetail,
        },
        {
          path: "classroom",
          name: "ClassroomList",
          component: ClassroomList,
        },
        {
          path: "create-year/:id?",
          name: "CreateAcademicYear",
          component: CreateAcademicYear,
        },
        {
          path: "year",
          name: "AcademicYearList",
          component: AcademicYearList,
        },
        {
          path: "create-subject/:id?",
          name: "CreateSubject",
          component: CreateSubject,
        },
        {
          path: "subject",
          name: "SubjectList",
          component: SubjectList,
        },
        {
          path: "score",
          name: "ExamScore",
          component: ExamScore,
        },
        {
          path: "report_primary",
          name: "ReportPrimary",
          component: ReportPrimary,
        },
        {
          path: "report_secondary",
          name: "ReportSecondary",
          component: ReportSecondary,
        },
        {
          path: "report_highschool",
          name: "ReportHighSchool",
          component: ReportHighSchool,
        },
        {
          path: "attendance",
          name: "KhmerAttendance",
          component: KhmerAttendance,
        },
        {
          path: "pdf",
          name: "ReportPdf",
          component: ReportPdf,
        },
        {
          path: "create-user",
          name: "CreateUser",
          component: CreateUser,
        },
        {
          path: "user",
          name: "UserList",
          component: UserList,
        },
        {
          path: "parent",
          name: "ParentList",
          component: ParentList,
        },
        {
          path: "create-parent",
          name: "CreateParent",
          component: CreateParent,
        },
        {
          path: "parent-detail/:id?",
          name: "ParentDetail",
          component: ParentDetail,
        },

        {
          path: "social",
          name: "SocialList",
          component: SocialList,
        },
        {
          path: "create-social/:id?",
          name: "SocialCreate",
          component: SocialCreate,
        },
        {
          path: "semester",
          name: "SemesterList",
          component: SemesterList,
        },
        {
          path: "create-semester/:id?",
          name: "SemesterCreate",
          component: SemesterCreate,
        },
        {
          path: "score",
          name: "SettingScoreList",
          component: SettingScoreList,
        },
        {
          path: "create-score/:id?",
          name: "SettingScoreCreate",
          component: SettingScoreCreate,
        },

        {
          path: "settingsemesterlist/:id?",
          name: "SettingSemesterList",
          component: SettingSemesterList
        },
        {
          path: "settingsemestercreate/:id?",
          name: "SettingSemesterCreate",
          component: SettingSemesterCreate
        },

        {
          path: "/:pathMatch(.*)*",
          name: "Error",
          component: Error,
        },
      ],
    },
  ],
});

import { useStore } from "@/store";
import expirationToken from "@/utils/expirationToken";

// const store = useStore();

// router.beforeEach((to, from, next) => {
//   useStore().loadStoredAuth();

//   if (to.meta.requiresAuth) {
//     if (!useStore().token || expirationToken(useStore().exp)) {
//       useStore().logout();
//       next({ name: "Login" });
//     } else {
//       next();
//     }
//   } else {
//     next();
//   }
// });

router.beforeEach((to, from, next) => {
  const store = useStore();

  // 1. Attempt to load auth from storage
  store.loadStoredAuth();

  // 2. check if the route requires authentication
  if (to.meta.requiresAuth) {

    // 3. Check if token is missing OR expired
    if (!store.token || expirationToken(store.exp)) {
      console.log("helloooo");

      // 4. Clear state (but do NOT redirect inside the store function)
      // store.logout();
      store.unAuthenticated()

      // 5. Redirect to Login here
      next({ name: "Login" });

    } else {
      // Token is valid, proceed
      next();
    }
  } else {
    // 6. If user is logged in but tries to go to Login page, send them to Dashboard
    if (to.name === 'Login' && store.token && !expirationToken(store.exp)) {
      next({ name: 'Dashboard' });
    } else {
      next();
    }
  }
});



export default router;
