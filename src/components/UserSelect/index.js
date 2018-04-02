import React, { Component } from 'react';
import { logout, login, register } from '../../services/user';
import styles from './index.less';


export default class UserSelect extends Component {
   // 注册账号
   registerAccount = () => {
    register();
  }


   /* 登出账号 */
   logoutAccout = () => {
    logout();
  }

  // 登录账号
  loginAccount = () => {
    login();
  }

  render() {
    const { user } = this.props;
    console.log(Object.keys);
    const isEmpty = !(user && Object.keys(user).length > 0);
    return isEmpty ?
      (
        <div className="user-select-box">
          <ul className={styles['user-select']}>
            <li onClick={this.registerAccount}>注册</li>
            <li onClick={this.loginAccount}>登录</li>
          </ul>
        </div>
      )
      :
      (
        <div className="user-select-box">
          <ul className={styles['user-select']}>
            <li>{user.username}</li>
            <li onClick={this.loginAccount}>登出</li>
          </ul>
        </div>
      );
  }
}
