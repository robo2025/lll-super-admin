import React, { Component } from 'react';
import { Input, Form, message } from 'antd';
import UserSelect from '../UserSelect/index';

import styles from './index.less';

const { Search } = Input;
const FormItem = Form.Item;


export default class Header extends Component {
  state = {
    searchValue: '',
    validateStatus: '',
    help: '',
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ searchValue: nextProps.search.defaultValue });
  }

  handleSearchChange = (e) => {
    if (e.target.value.length < 17) {
      this.setState({ 
        searchValue: e.target.value,
        validateStatus: 'warning',
        help: '请输入17位订单号',
      });
    } else if (e.target.value.length > 17) {
      this.setState({ 
        searchValue: e.target.value.substring(0, 17),
        validateStatus: '',
        help: '',
      });
    } else {
      this.setState({ 
        validateStatus: '',    
        help: '',            
        searchValue: e.target.value,
      });
    }
  }

  handleMenuClick = (e) => {
    message.info('Click on menu item.');
    console.log('click', e);
  }

  render() {
    const { search, user, onSearch, actions } = this.props;
    const { searchValue, help, validateStatus } = this.state;
    return (
      <header className={styles.header}>
        <div className="logo-box">
          <a href="/#">
            <img
              width={120}
              src="https://imgcdn.robo2025.com/frontShop/index/logo.png"
              alt="logo"
            />
          </a>
        </div>
        <div className="search-box">
          <FormItem
            hasFeedback
            validateStatus={validateStatus}
            help={help}
          >
            <Search
              placeholder="请输入订单ID"
              value={searchValue}
              onChange={this.handleSearchChange}
              size="large"
              onSearch={value => onSearch(value)}
              enterButton
            />
          </FormItem>

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
