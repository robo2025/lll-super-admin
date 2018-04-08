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
  PaymentContent,
} from '../../components/OrderModalContent';
import { queryString, handleServerMsgObj } from '../../utils/util';
import styles from './SearchResult.less';

// 操作状态
const mapActions = ['接单', '发货', '触发异常', '同意延期', '驳回延期', '同意无货', '驳回无货', '取消订单', '完成支付'];

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
      orderId: '',
      deliveryData: { // 发货默认数据
        operation_type: 4,
        logistics_company: '',
        logistics_number: '',
      },
      exceptionData: { // 触发异常默认数据
        operation_type: 9,
        remarks: '',
      },
      agreeDelayData: {

      },
      rejectDelayData: { // 驳回延期默认数据
        responsible_party: 1,
        desc: '',
      },
      refundData: {// 无货，同意退款默认数据
        responsible_party: 1,
        desc: '',
      },
      rejectNoGoodData: {// 无货：驳回默认数据
        operation_type: 9,
        desc: '',
      },
      cancelData: {// 取消订单：默认数据
        responsible_party: 1,
        desc: '',
      },
      paymentData: {// 支付：默认数据
        operation_type: 5,
        trade_no: '',
        pay_time: '',
        pay_type: '1',
      },
    };
  }

  componentDidMount() {
    const { args } = this.state;
    const { dispatch } = this.props;
    console.log(args, this.props);
    if (!args.id) return;
    dispatch({
      type: 'orders/fetchDetail',
      orderId: args.id,
      success: () => { message.success('查询成功'); },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });

    // 监听浏览器hash改变
    window.onhashchange = () => {
      this.setState({
        args: queryString.parse(window.location.href),
      });
      this.handleHashChange();
    };
  }

  // 浏览器hash改变时处理
  handleHashChange = () => {
    const { args } = this.state;
    const { dispatch } = this.props;
    console.log(args, this.props);
    if (!args.id) return;
    dispatch({
      type: 'orders/fetchDetail',
      orderId: args.id,
      success: () => { message.success('查询成功'); },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  // 处理搜索
  handleSearch = (value) => {
    console.log('搜索', value, this.props);
    // const { dispatch } = this.props;
    this.props.history.push('/search/result?id=' + value);
    // dispatch({
    //   type: 'orders/fetchDetail',
    //   orderId: value,
    //   success: () => { message.success('查询成功'); },
    //   error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    // });
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
  handleModalContentChange = (idx, values) => {
    console.log('模态框内容改变了', idx, values);
    switch (idx) {
      case 1: // 接单
        return (<div>接单</div>);
      case 2: { // 发货
        const { deliveryData } = this.state;
        this.setState({ deliveryData: { ...deliveryData, ...values } });
        break;
      }
      case 3: { // 触发异常
        const { exceptionData } = this.state;
        this.setState({ exceptionData: { ...exceptionData, ...values } });
        break;
      }
      case 4: { // 同意延期
        const { agreeDelayData } = this.state;
        this.setState({ agreeDelayData: { ...agreeDelayData, ...values } });
        break;
      }
      case 5: { // 驳回延期
        const { rejectDelayData } = this.state;
        this.setState({ rejectDelayData: { ...rejectDelayData, ...values } });
        break;
      }
      case 6: { // 同意无货
        const { refundData } = this.state;
        this.setState({ refundData: { ...refundData, ...values } });
        break;
      }
      case 7: { // 驳回无货
        const { rejectNoGoodData } = this.state;
        this.setState({ refundData: { ...rejectNoGoodData, ...values } });
        break;
      }
      case 8: { // 取消订单
        const { cancelData } = this.state;
        this.setState({ cancelData: { ...cancelData, ...values } });
        break;
      }
      case 9: { // 完成支付
        const { paymentData } = this.state;
        this.setState({ paymentData: { ...paymentData, ...values } });
        break;
      }
      default:
        break;
    }
  }

  /**
 * 订单列表操作被点击：处理Modal的显示
 * @param {string} modalKey Modal的key，8:取消订单 9：完成支付
 * @param {string} orderId  订单ID
 */
  handleModalToggle = (modalKey, orderId) => {
    console.log('toggleModal', modalKey, orderId);
    this.setState({
      isShowModal: true,
      actionsIdx: parseInt(modalKey, 10),
      orderId,
    });
  }

  // 取消模态框
  handleCancelModal = () => {
    this.setState({
      isShowModal: false,
    });
  }

  // 确定模态框
  handleOkModal = (idx) => {
    const { args,
      orderId,
      deliveryData,
      paymentData,
      exceptionData,
      agreeDelayData,
      rejectDelayData,
      refundData,
      rejectNoGoodData,
      cancelData,
    } = this.state;

    // 校验表单
    this.formObj.validateFields((error, values) => {
      if (error) {
        console.log('校验出错', error, values);
      } else {
        this.setState({
          isShowModal: false,
        });
        switch (idx) {
          case 1: // 接单
            return (<div>接单</div>);
          case 2: { // 发货
            this.dispatchDelivery(args.id, deliveryData);
            break;
          }
          case 3: { // 触发异常
            this.dispatchException(args.id, exceptionData);
            break;
          }
          case 4: { // 同意延期
            this.dispatchAgreeeDelay(args.id, agreeDelayData);
            break;
          }
          case 5: { // 驳回延期
            this.dispatchRejectDelay(args.id, rejectDelayData);
            break;
          }
          case 6: { // 同意无货
            this.dispatchAgreeNogood(args.id, refundData);
            break;
          }
          case 7: { // 驳回无货
            this.dispatchRejectNogood(args.id, rejectNoGoodData);
            break;
          }
          case 8: { // 取消订单
            this.dispatchCancelOrder(args.id, cancelData);
            break;
          }
          case 9: { // 完成支付
            this.dispatchPayment(args.id, paymentData);
            break;
          }
          default:
            break;
        }
      }
    });
  }


  // 校验表单：传入的是this.props.form对象
  validateForm = (formObj) => {
    console.log('我被调用了');
    // 将子组件的this.props.form传给父组件，方便后面校验
    this.formObj = formObj;
  }

  // 发起发货操作
  dispatchDelivery = (orderId, data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/fetchDelivery',
      orderId,
      data,
      success: () => { message.success('发货成功'); },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  // 发起异常操作
  dispatchException = (orderId, data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/fetchDelayException',
      orderId,
      data,
      success: () => { message.success('异常提交成功'); },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  // 发起同意延期操作
  dispatchAgreeeDelay = (orderId, data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/fetchAgreeDelay',
      orderId,
      data,
      success: () => { message.success('操作成功'); },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  // 发起驳回延期操作
  dispatchRejectDelay = (orderId, data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/fetchRejectDelay',
      orderId,
      data,
      success: () => { message.success('操作成功'); },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  // 发起同意无货操作
  dispatchAgreeNogood = (orderId, data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/fetchAgreeNoGood',
      orderId,
      data,
      success: () => { message.success('操作成功'); },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  // 发起驳回无货操作
  dispatchRejectNogood = (orderId, data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/fetchRejectNoGood',
      orderId,
      data,
      success: () => { message.success('操作成功'); },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  // 发起取消订单操作
  dispatchCancelOrder = (orderId, data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/fetchCancel',
      orderId,
      data,
      success: () => { message.success('操作成功'); },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  // 发起支付操作
  dispatchPayment = (orderId, data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/fetchPayment',
      orderId,
      data,
      success: () => { message.success('付款完成'); },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  render() {
    const { args,
      isShowModal,
      actionsIdx,
      orderId,
      deliveryData,
      exceptionData,
      rejectDelayData,
      refundData,
      rejectNoGoodData,
      cancelData,
      paymentData,
    } = this.state;
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
        <Menu.Item key="6">同意退款</Menu.Item>
        <Menu.Item key="7">驳回无货</Menu.Item>
        <Menu.Item key="8">取消订单</Menu.Item>
      </Menu>
    );
    const menu2 = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="9">完成支付</Menu.Item>
        <Menu.Item key="8">取消整单</Menu.Item>
      </Menu>
    );
    const actions = (
      <Dropdown.Button
        onClick={this.handleButtonClick}
        overlay={Array.isArray(orders.detail) ? menu2 : menu}
      >
        操作
      </Dropdown.Button>
    );

    const returnModalContent = (modalIdx) => {
      console.log('modal idx', modalIdx, typeof modalIdx);
      switch (modalIdx) {
        case 1:
          return (<div>接单</div>);
        case 2:
          return (
            <DeliverContent
              data={orders.detail}
              defaultData={deliveryData}
              onChange={values => this.handleModalContentChange(2, values)}
              handleValidate={this.validateForm}
            />
          );
        case 3:
          return (
            <ExceptionContent
              data={orders.detail}
              defaultData={exceptionData}
              onChange={values => this.handleModalContentChange(3, values)}
              handleValidate={this.validateForm}
            />
          );
        case 4:
          return (
            <DelayContent
              data={orders.detail}
              onChange={values => this.handleModalContentChange(4, values)}
              handleValidate={this.validateForm}
            />
          );
        case 5:
          return (
            <RejectDelayContent
              data={orders.detail}
              defaultData={rejectDelayData}
              onChange={values => this.handleModalContentChange(5, values)}
              handleValidate={this.validateForm}
            />
          );
        case 6:
          return (
            <RefundContent
              data={orders.detail}
              defaultData={refundData}
              onChange={values => this.handleModalContentChange(6, values)}
              handleValidate={this.validateForm}
            />
          );
        case 7:
          return (
            <RejectNoGoodContent
              data={orders.detail}
              defaultData={rejectNoGoodData}
              onChange={values => this.handleModalContentChange(7, values)}
              handleValidate={this.validateForm}
            />
          );
        case 8:
          return (
            <CancelContent
              data={Array.isArray(orders.detail) ? { add_time: orders.detail[0].add_time, son_order_sn: args.id } : orders.detail}
              defaultData={cancelData}
              onChange={values => this.handleModalContentChange(8, values)}
              handleValidate={this.validateForm}
            />
          );
        case 9:
          return (
            <PaymentContent
              data={Array.isArray(orders.detail) ? orders.detail[0] : orders.detail}
              defaultData={paymentData}
              onChange={values => this.handleModalContentChange(9, values)}
              handleValidate={this.validateForm}
            />
          );
        default:
          return (
            <div>
              游离三界外，不在五行中。
            </div>
          );
      }
    };

    console.log('搜索结果页面props-state:', this.props, this.state);
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
          {
            Array.isArray(orders.detail) ?
              (
                <OrderList
                  data={orders.detail}
                  onHandleOrderClick={this.handleModalToggle}
                />
              )
              :
              (
                <OrderDetail
                  data={orders.detail}
                />
              )
          }

        </Card>
        {/* 无货同意并退款Modal */}
        <Modal
          width={650}
          visible={isShowModal}
          title={mapActions[actionsIdx - 1]}
          onCancel={() => { this.handleCancelModal(actionsIdx); }}
          onOk={() => { this.handleOkModal(actionsIdx); }}
          okText="确定"
          cancelText="取消"
        >
          {
            returnModalContent(actionsIdx)
          }
        </Modal>
      </Layout>
    );
  }
}
