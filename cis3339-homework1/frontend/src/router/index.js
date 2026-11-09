import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/students' },
    {
      path: '/students',
      name: 'students',
      component: () => import('../views/StudentsView.vue'),
    },
    {
      path: '/courses',
      name: 'courses',
      component: () => import('../views/CoursesView.vue'),
    },
    {
      path: '/enrollments',
      name: 'enrollments',
      component: () => import('../views/EnrollmentsView.vue'),
    },
    // Anything else goes back to the students page
    { path: '/:pathMatch(.*)*', redirect: '/students' },
  ],
})

export default router