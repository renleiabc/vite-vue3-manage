import { computed } from 'vue';
import { RouteRecordRaw, RouteRecordNormalized } from 'vue-router';
import usePermission from '@/hooks/permission';
import { useAppStore } from '@/store';
import appClientMenus from '@/router/app-menus';
import { cloneDeep } from 'lodash';

export default function useMenuTree() {
  const permission = usePermission();
  const appStore = useAppStore();

  const appRoute = computed(() => {
    if (appStore.menuFromServer) {
      return appStore.appAsyncMenus;
    }
    return appClientMenus;
  });
  console.log(
    '🚀 ~ file: use-menu-tree.ts:12 ~ appRoute ~ appRoute:',
    appRoute.value,
  );
  const menuTree = computed(() => {
    const copyRouter = cloneDeep(appRoute.value) as RouteRecordNormalized[];
    console.log(
      '🚀 ~ file: use-menu-tree.ts:19 ~ menuTree ~ copyRouter:',
      copyRouter,
    );
    copyRouter.sort((a: RouteRecordNormalized, b: RouteRecordNormalized) => {
      return ((a.meta.order as any) || 0) - ((b.meta.order as any) || 0);
    });
    function travel(_routes: RouteRecordRaw[], layer: number) {
      console.log(
        '🚀 ~ file: use-menu-tree.ts:32 ~ travel ~ _routes:',
        _routes,
      );
      if (!_routes) return null;

      const collector: any = _routes.map((element) => {
        // no access
        if (!permission.accessRouter(element)) {
          return null;
        }

        // leaf node
        if (element.meta?.hideChildrenInMenu || !element.children) {
          element.children = [];
          return element;
        }

        // route filter hideInMenu true
        element.children = element.children.filter(
          (x) => x.meta?.hideInMenu !== true,
        );

        // Associated child node
        const subItem = travel(element.children, layer + 1);

        if (subItem.length) {
          element.children = subItem;
          return element;
        }
        // the else logic
        if (layer > 1) {
          element.children = subItem;
          return element;
        }

        if (element.meta?.hideInMenu === false) {
          return element;
        }

        return null;
      });
      return collector.filter(Boolean);
    }
    return travel(copyRouter, 0);
  });

  return {
    menuTree,
  };
}
