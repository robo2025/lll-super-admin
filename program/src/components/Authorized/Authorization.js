import React from 'react';
import { Route, Redirect } from 'dva/router';


const Authorization = ({ path, component: Component, redirectPath, authority, ...rest }) => {
  console.log('授权组件', path, rest);
  return (
    <Route
      {...rest}
      render={props =>
        (authority || path === redirectPath ? (
          <Component {...props} />
        ) : (
            <Redirect
              to={{
                pathname: '/verify',
              }}
            />
          ))
      }
    />
  );
};

export default Authorization;
