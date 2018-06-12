import React, { Component } from 'react';
import moment from 'moment';
import { Card, Table, Divider, Row, Col } from 'antd';
import {ACTION_STATUS,ORDER_STATUS} from "../../constant/statusList"
import DescriptionList from '../DescriptionList';

import styles from './OrderDetail.less';

const { Description } = DescriptionList;

// 支付状态
const mapPayStatus = ['全部', '未支付', '已支付'];

// 订单列
const goodsColumns = [{
  title: '商品ID',
  dataIndex: 'goods_sn',
  key: 'goods_sn',
}, {
  title: '商品名称',
  dataIndex: 'goods_name',
  key: 'goods_name',
}, {
  title: '型号',
  dataIndex: 'model',
  key: 'model',
}, {
  title: '发货日',
  dataIndex: 'max_delivery_time',
  key: 'max_delivery_time',
  render: text => (<span>{text}天</span>),
}, {
  title: '单价',
  dataIndex: 'univalent',
  key: 'univalent',
}, {
  title: '单价优惠',
  dataIndex: 'price_discount',
  key: 'price_discount',
}, {
  title: '商品售出单价',
  key: 'sold_price',
  render: text => (<span>{text.univalent - text.price_discount}</span>),
}, {
  title: '数量',
  dataIndex: 'number',
  key: 'number',
}, {
  title: '商品小计',
  dataIndex: 'subtotal_money',
  key: 'subtotal_money',
}];
// 发货记录列
const logisticsColumns = [{
  title: '商品名称',
  dataIndex: 'goods_name',
  key: 'goods_name',
}, {
  title: '型号',
  dataIndex: 'type',
  key: 'type',
}, {
  title: '品牌',
  dataIndex: 'brand',
  key: 'brand',
}, {
  title: '数量',
  dataIndex: 'count',
  key: 'count',
}, {
  title: '发货日期',
  dataIndex: 'delivery',
  key: 'delivery',
}, {
  title: '送货人',
  dataIndex: 'sender',
  key: 'sender',
}, {
  title: '联系号码',
  dataIndex: 'mobile',
  key: 'mobile',
}, {
  title: '物流公司',
  dataIndex: 'delivery_company',
  key: 'delivery_company',
}, {
  title: '物流单号',
  dataIndex: 'delivery_id',
  key: 'delivery_id',
}];
// 操作日志tab
const operationTabList = [{
  key: 'tab1',
  tab: '订单操作记录',
}, {
  key: 'tab2',
  tab: '异常操作记录',
}];
// 操作日志列
const actionColumns = [{
  title: '操作记录ID',
  dataIndex: 'status',
  key: 'status',
  render:(text)=>(<span>{ACTION_STATUS[text]}</span>)
}, {
  title: '操作员',
  dataIndex: 'operator',
  key: 'operator',
}, {
  title: '执行明细',
  dataIndex: 'execution_detail',
  key: 'execution_detail',
}, {
  title: '当前进度',
  dataIndex: 'progress',
  key: 'progress',
}, {
  title: '操作时间',
  dataIndex: 'add_time',
  key: 'add_time',
  render: text => (<span>{moment(text * 1000).format('YYYY-MM-DD h:mm:ss')}</span>),
}, {
  title: '耗时',
  dataIndex: 'time_consuming',
  key: 'time_consuming',
}];
const actionLogs = [{
  id: 1,
  desc: '提交订单',
  operater: 'admin',
  detail: '未支付',
  progress: '已支付',
  create_time: '2017-10-12 12:56:30',
  time: 5,
}];

export default class OrderDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      operationkey: 'tab1',
    };
  }

  onOperationTabChange = (key) => {
    console.log(key);
    this.setState({ operationkey: key });
  }

  render() {
    const { data } = this.props;
    const orderDetail = data;
    let {
      receipt_info,
      mother_info,
      son_order_info,
      payment_info,
      supplier_info,
      delivery_info,
      operation_record_info } = orderDetail;
    receipt_info = receipt_info || {};
    mother_info = mother_info || {};
    son_order_info = son_order_info || {};
    payment_info = payment_info || {};
    supplier_info = supplier_info || {};
    delivery_info = delivery_info || {};
    operation_record_info = operation_record_info || [];
    const orderGoodsList = [son_order_info];
    const exceptionAction = operation_record_info.filter((val) => {
      return val.is_abnormal;
    });
    const contentList = {
      tab1: <Table
        pagination={{
          defaultPageSize: 6,
          pageSize: 6,
        }}
        loading={false}
        dataSource={operation_record_info}
        columns={actionColumns}
        rowKey="add_time"
      />,
      tab2: <Table
        pagination={{
          defaultPageSize: 5,
          pageSize: 5,
        }}
        loading={false}
        dataSource={exceptionAction}
        columns={actionColumns}
        rowKey="add_time"
      />,
    };

    // 计算商品数量，商品总金额，佣金，优惠抵扣，实付总金额
    let goodsTotal = 0;
    let goodAmount = 0;
    let commission = 0;
    let discountMoney = 0;
    let money = 0;
    orderGoodsList.forEach((val) => {
      goodsTotal += val.number;
      goodAmount += val.subtotal_money;
      commission += val.commission;
      discountMoney += val.price_discount;
      money += val.subtotal_money;
    });


    // console.log('订单详情', order_info);
    return (
      <div className={styles['order-detail']}>
        <div className="relate-orders">
          <span className="title">关联订单：</span>
          <span className="item"><a>退款单</a></span>
          <span className="item"><a>退货单</a></span>
          <span className="item"><a>无货单</a></span>
        </div>
        <DescriptionList size="large" title="订单信息" style={{ marginBottom: 32 }}>
          <Description term="客户订单编号">{son_order_info.son_order_sn}</Description>
          <Description term="支付状态">{mapPayStatus[payment_info.pay_status]}</Description>
          <Description term="订单状态">{ORDER_STATUS[son_order_info.status]}</Description>
          <Description term="母订单编号">{mother_info.order_sn}</Description>
          <Description term="下单时间" >{moment(son_order_info.add_time * 1000).format('YYYY-MM-DD h:mm:ss')}</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 32 }} />
        <DescriptionList size="large" title="客户信息" style={{ marginBottom: 32 }}>
          <Description term="用户姓名">{mother_info.receiver}</Description>
          <Description term="联系电话">{mother_info.mobile}</Description>
          <Description term="公司名称">不知道</Description>
          <Description term="收货地址">
            {`${mother_info.province}
             ${mother_info.city}     
             ${mother_info.district}                         
             ${mother_info.address}
             `}
          </Description>
          <Description term="备注">{mother_info.remarks || '无'}</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 32 }} />
        <DescriptionList size="large" title="开票信息" style={{ marginBottom: 32 }}>
          <Description term="公司全称">{receipt_info.title}</Description>
          <Description term="公司账户">{receipt_info.account}</Description>
          <Description term="税务编号">{receipt_info.tax_number}</Description>
          <Description term="公司电话">{receipt_info.telephone}</Description>
          <Description term="开户银行">{receipt_info.bank}</Description>
          <Description term="公司地址">{receipt_info.company_address}</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 32 }} />
        <DescriptionList size="large" title="供应商信息" style={{ marginBottom: 32 }}>
          <Description term="联系人">{supplier_info.linkman}</Description>
          <Description term="联系电话">{supplier_info.mobile}</Description>
          <Description term="公司名称">{supplier_info.company_name}</Description>
          <Description term="收货地址">{supplier_info.address}</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 32 }} />
        <div className={styles.title}>订单商品明细</div>
        <Table
          style={{ marginBottom: 24 }}
          pagination={false}
          loading={false}
          dataSource={orderGoodsList}
          columns={goodsColumns}
          rowKey="abc"
          onRow={(record) => {
            return {
              onClick: () => {
                console.log('商品信息', record);
                window.open('https://www.robo2025.com/productsInfo.html?productId=' + record.goods_sn);
              },
            };
          }}
        />
        <div className={styles['extra-good-info']}>
          <Row gutter={8} justify="end" align="end" type="flex">
            <Col span={14}>总计</Col>
            <Col span={10} pull={2} style={{ textAlign: 'right' }}>
              <span style={{ marginRight: 45 }}>商品件数：{orderGoodsList.length}</span>
              <span>商品总金额：<span className="number">￥{goodAmount}</span></span>
            </Col>
          </Row>
          <Row gutter={8} justify="end" align="end" type="flex">
            <Col span={14} />
            <Col span={10} pull={2} style={{ textAlign: 'right' }}>
              <span style={{ marginRight: 45 }}>&nbsp;</span>
              <span>运费金额：<span className="number">￥0.00</span></span>
            </Col>
          </Row>
          <Row gutter={8} justify="end" align="end" type="flex">
            <Col span={14} />
            <Col span={10} pull={2} style={{ textAlign: 'right' }}>
              <span style={{ marginRight: 45 }}>&nbsp;</span>
              <span>佣金：<span className="number">￥{commission}</span></span>
            </Col>
          </Row>
          <Row gutter={8} justify="end" align="end" type="flex">
            <Col span={14} />
            <Col span={10} pull={2} style={{ textAlign: 'right' }}>
              {/* <span
                style={{ marginRight: 45, fontWeight: 'normal' }}
              >优惠券（YHQ20180103111256）满10元减0元
              </span> */}
              <span>优惠抵扣：<span className="number">￥-0.00</span></span>
            </Col>
          </Row>
          <Row gutter={8} justify="end" align="end" type="flex">
            <Col span={14} />
            <Col span={10} pull={2} style={{ textAlign: 'right' }}>
              <span style={{ marginRight: 45 }}>&nbsp;</span>
              <span>实付总金额：<span style={{ color: '#E6382F' }} className="number">￥{money}</span></span>
            </Col>
          </Row>
        </div>
        <Divider style={{ marginBottom: 32 }} />
        <div className={styles.title}>发货记录</div>
        <Table
          style={{ marginBottom: 24 }}
          pagination={false}
          loading={false}
          dataSource={[]}
          columns={logisticsColumns}
          rowKey="id"
        />
        {/* <Divider style={{ marginBottom: 32 }} />           */}
        <div className={styles.title}>操作日志记录</div>
        <Card
          className={styles.tabsCard}
          bordered={false}
          tabList={operationTabList}
          onTabChange={this.onOperationTabChange}
        >
          {contentList[this.state.operationkey]}
        </Card>
      </div>
    );
  }
}
