import React, { Component } from 'react';
import { Layout, Input } from 'antd';
import styles from './SearchOrder.less';

const { Content, Footer } = Layout;
const { Search } = Input;

export default class SearchOrder extends Component {
  handleSearch = (orderId) => {
    this.props.history.push('/search/result?id=' + orderId);
  }

  render() {
    console.log('搜索页props:', this.props);
    return (
      <Layout className={`ly-container ${styles['search-page']}`}>
        <Content>
          <div className="logo-box">
            <a href="//robo2025.com">
              <img
                width={300}
                height={180}
                src="https://newhome.robo2025.com/images/logo.png"
                alt="logo"
              />
            </a>
          </div>
          <div className="search-box">
            <Search
              placeholder="请输入订单ID"
              size="large"
              onSearch={value => this.handleSearch(value)}
              enterButton
            />
          </div>

        </Content>
      </Layout>
    );
  }
}
