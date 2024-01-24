import type { Router, LocationQueryRaw } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import { useUserStore } from '@/store';
import { isLogin } from '@/utils/auth';

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    NProgress.start();
    const userStore = useUserStore();
    console.log(
      '🚀 ~ file: userLoginInfo.ts:11 ~ router.beforeEach ~ userStore:',
      userStore.role,
    );
    if (isLogin()) {
      if (to.name === 'login') {
        const { redirect, ...othersQuery } = router.currentRoute.value.query;
        next({
          name: (redirect as string) || 'Workplace',
          query: {
            ...othersQuery,
          },
        });
      }
      if (userStore.role) {
        next();
      } else {
        try {
          await userStore.info();
          next();
        } catch (error) {
          await userStore.logout();
          next({
            name: 'login',
            query: {
              redirect: to.name,
              ...to.query,
            } as LocationQueryRaw,
          });
        }
      }
    } else {
      if (to.name === 'login') {
        next();
        return;
      }
      next({
        name: 'login',
        query: {
          redirect: to.name,
          ...to.query,
        } as LocationQueryRaw,
      });
    }
  });
}
