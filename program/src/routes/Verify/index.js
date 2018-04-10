import React from 'react';
import Cookies from 'js-cookie';
import { connect } from 'dva';
import { verifyLogin } from '../../utils/tools';
import { HOME_PAGE } from '../../constant/config';

@connect((state) => {
  return { ...state };
})
export default class Verify extends React.Component {
  componentDidMount() {
    verifyLogin();
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetch',
      success: (res) => { 
        Cookies.set('userinfo', JSON.stringify(res.data), { expires: 7 });        
        window.location.href = HOME_PAGE; 
      },
    });
  }

  render() {
    console.log(this.props);
    return (
      <div>跳转中...</div>
    );
  }
}

