import React from 'react';
import Cookies from 'js-cookie';
import { routerRedux, Switch, Route } from 'dva/router';
import { Authorization } from './components/Authorized';
import { getRouterData } from './common/router';

const { ConnectedRouter } = routerRedux;

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const HomeRouter = routerData['/'].component;
  const SearchRouter = routerData['/search'].component;
  const accessToken = Cookies.get('access_token');
  console.log('router.js', routerData, app, history);
  return (
    <ConnectedRouter history={history}>
      <Switch>
        <Route path="/" exact render={props => <HomeRouter {...props} />} />
        <Route path="/search" exact render={props => <SearchRouter {...props} />} />
        {
          Object.keys(routerData).map(val => (
            <Authorization
              key={val}
              path={val}
              {...routerData[val]}
              authority={!!accessToken}
              redirectPath="/verify"
            />
          ))
        }

      </Switch>
    </ConnectedRouter>
  );
}


export default RouterConfig;
