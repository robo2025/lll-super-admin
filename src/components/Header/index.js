import React, { Component } from 'react';
import { Input, Menu, Dropdown, message } from 'antd';
import UserSelect from '../UserSelect/index';

import styles from './index.less';

const { Search } = Input;
export default class Header extends Component {
  handleMenuClick = (e) => {
    message.info('Click on menu item.');
    console.log('click', e);
  }

  render() {
    const { search, user, onSearch, actions } = this.props;

    return (
      <header className={styles.header}>
        <div className="logo-box">
          <a href="/#">
            <img
              width={120}
              src="https://newhome.robo2025.com/images/logo.png"
              alt="logo"
            />
          </a>
        </div>
        <div className="search-box">
          <Search
            placeholder="请输入订单ID"
            defaultValue={search.defaultValue || ''}
            size="large"
            onSearch={value => onSearch(value)}
            enterButton
          />
        </div>
        <div className="actions-box">
          {actions || null}
        </div>
        <div className="user-box">
          {/* <span>Super</span> */}
          <img
            src={require('./superhero.png')}
            width={40}
            height={40}
            alt="图片"
            title="超级用户"
          />
          <UserSelect user={user} />
        </div>
      </header>
    );
  }
}
