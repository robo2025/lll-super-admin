
import { createElement } from 'react';
import dynamic from 'dva/dynamic';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return (props) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () =>
      models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
  });
};


export const getRouterData = (app) => {
  const routerConfig = {
    '/': {
      exact: true,
      component: dynamicWrapper(app, ['user'], () => import('../routes/Search/SearchOrder')),
      name: '搜索',
    },
    '/verify': {
      exact: true,
      component: dynamicWrapper(app, ['user'], () => import('../routes/Verify')),
      name: '授权',
    },
    '/search': {
      component: dynamicWrapper(app, ['order', 'user'], () => import('../routes/Search/SearchOrder')),
      name: '搜索',      
    },
    '/search/result': {
      component: dynamicWrapper(app, ['order'], () => import('../routes/Result/SearchResult')),
      name: '搜索结果',
    },
  };

  const routerData = {};
  // Get name from ./menu.js or just set it in the router data.
  Object.keys(routerConfig).forEach((path) => {
    let router = routerConfig[path];
    router = {
      ...router,
      path,
      exact: true,
    };
    routerData[path] = router;
  });
  return routerData;
};
