import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { Layout, Card, Menu, Dropdown, message, Modal } from 'antd';
import { connect } from 'dva';
import Header from '../../components/Header/index';
import { OrderDetail } from '../../components/OrderDetail';
import { OrderList } from '../../components/OrderList';
import {
  CancelContent,
  DeliverContent,
  DelayContent,
  RejectDelayContent,
  ExceptionContent,
  RefundContent,
  RejectNoGoodContent,
} from '../../components/OrderModalContent';
import { queryString, handleServerMsgObj } from '../../utils/util';
import styles from './SearchResult.less';

// 操作状态
const mapActions = ['接单', '发货', '触发异常', '同意延期', '驳回延期', '同意无货', '驳回无货', '取消订单'];


@connect(({ orders, loading }) => ({
  orders,
  loading,
}))
export default class SearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      args: queryString.parse(window.location.href),
      isShowModal: false,
      actionsIdx: 1,
    };
  }

  componentDidMount() {
    const { args } = this.state;
    const { dispatch } = this.props;
    console.log(args, this.props);
    dispatch({
      type: 'orders/fetchDetail',
      orderId: args.id,
      success: () => { message.success('查询成功'); },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  // 处理搜索
  handleSearch = (value) => {
    console.log(value);
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/fetchDetail',
      orderId: value,
      success: () => { message.success('查询成功'); },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  // 操作菜单被点击
  handleMenuClick = ({ key }) => {
    console.log('操作标识', key);
    this.setState({
      isShowModal: true,
      actionsIdx: parseInt(key, 10),
    });
  }

  // 模态框内容改变
  handleModalContentChange = (values) => {
    console.log('模态框内容改变了', values);
  }

  // 取消模态框
  handleCancelModal = () => {
    this.setState({
      isShowModal: false,
    });
  }

  // 确定模态框
  handleOkModal = () => {
    this.setState({
      isShowModal: false,
    });
  }

  // 校验表单：传入的是this.props.form对象
  validateForm = (formObj) => {
    console.log('我被调用了');
    this.formObj = formObj;
    // formObj.validateFields((error, values) => {
    //   console.log('校验出错', error, values);
    // });
  }

  render() {
    const { args, isShowModal, actionsIdx } = this.state;
    const { orders } = this.props;
    const searchOptions = {
      defaultValue: args.id || '',
    };
    const userInfo = Cookies.getJSON('userinfo');

    // 操作小组件
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1">接单</Menu.Item>
        <Menu.Item key="2">发货</Menu.Item>
        <Menu.Item key="3">触发异常</Menu.Item>
        <Menu.Item key="4">同意延期</Menu.Item>
        <Menu.Item key="5">驳回延期</Menu.Item>
        <Menu.Item key="6">同意无货</Menu.Item>
        <Menu.Item key="7">驳回无货</Menu.Item>
        <Menu.Item key="8">取消订单</Menu.Item>
      </Menu>
    );
    const actions = (
      <Dropdown.Button onClick={this.handleButtonClick} overlay={menu}>
        操作
      </Dropdown.Button>
    );

    // 返回操作模态框内容
    // const mapActions = ['接单', '发货', '触发异常', '同意延期','驳回延期', '同意无货','驳回无货', '取消订单'];

    const returnModalContent = (modalIdx) => {
      console.log('modal idx', modalIdx, typeof modalIdx);
      switch (modalIdx) {
        case 1:
          return (<div>接单</div>);
        case 2:
          return (
            <DeliverContent
              data={orders.detail}
              onChange={this.handleModalContentChange}
            />
          );
        case 3:
          return (
            <ExceptionContent />
          );
        case 4:
          return (
            <DelayContent />
          );
        case 5:
          return (
            <RejectDelayContent />
          );
        case 6:
          return (
            <RefundContent />
          );
        case 7:
          return (
            <RejectNoGoodContent />
          );
        case 8:
          return (
            <CancelContent />
          );
        default:
          return (
            <div>
              游离三界外，不在五行中。
            </div>
          );
      }
    };

    return (
      <Layout className={`result-container ${styles['result-page']}`} >
        <Header
          user={userInfo}
          search={searchOptions}
          onSearch={this.handleSearch}
          actions={actions}
        />
        <div id="resultStats">
          搜索结果
        </div>
        <Card bordered={false} className="order-card">
          <OrderDetail
            data={orders.detail}
          />
          {/* <OrderList /> */}
        </Card>
        {/* 无货同意并退款Modal */}
        <Modal
          width={600}
          visible={isShowModal}
          title={mapActions[actionsIdx - 1]}
          onCancel={() => { this.handleCancelModal(actionsIdx - 1); }}
          onOk={() => { this.handleOkModal(actionsIdx - 1); }}
        >
          {
            returnModalContent(actionsIdx)
          }
        </Modal>
      </Layout>
    );
  }
}
