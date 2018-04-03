import React, { Fragment } from 'react';
import moment from 'moment';
import { Table, Divider } from 'antd';
import styles from './OrderList.less';


const orderTableData = []; // 所有订单数据


for (let i = 0; i < 5; i++) {
  orderTableData.push({
    id: i + 1,
    guest_id: Math.random() * 100 >> 0,
    guest_name: '客户' + i,
    order_sn: 'DD000000098000000',
    receiver: '叶辰',
    mobile: '18673873978',
    address: '北京市北城区北城北',
    remarks: '请及时发货',
    total_money: 2148.0,
    son_order_sn: 'DD000000098000001',
    supplier_id: Math.random() * 100 >> 0,
    supplier_name: '供应商' + i,
    goods_id: 1,
    model: 'AK-47',
    number: 10,
    order_status: '已确认收货',
    univalent: 19.9,
    price_discount: 0.0,
    max_delivery_time: 7,
    pay_status: '已支付',
    commission: Math.random() * 50 >> 0,
    add_time: 1518875092.263431 + (Math.random() * 1000000),
    progress: Math.random() * 2 >> 0,
  });
}


// 订单状态
const mapOrderStatus = ['待支付', '已取消', '待接单', '待发货', '已发货,配送中',
  '已完成', '', '申请延期中', '', '退款中',
  '退货中', '作废', '无货', '退款完成', '退货完成',
  '订单流转结束'];
// 支付状态
const mapPayStatus = ['全部', '未支付', '已支付'];

export default class OrderTable extends React.Component {
  state = {
    selectedRowKeys: [],
    totalCallNo: 0,
    isShowModal: false,
  };

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const totalCallNo = selectedRows.reduce((sum, val) => {
      return sum + parseFloat(val.callNo, 10);
    }, 0);

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, totalCallNo });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  // 订单处理点击：催货、订单取消、收货延期
  handleOrderClick = (key) => {
    const [modalKey, orderKey] = key.split('-');
    this.props.onHandleOrderClick(modalKey, orderKey);
  }

  render() {
    const { selectedRowKeys, totalCallNo, isShowModal } = this.state;
    const { data, loading, total } = this.props;

    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 60,
      },
      {
        title: '客户订单编号',
        dataIndex: 'son_order_sn',
        key: 'son_order_sn',
        width: 200,
      },
      {
        title: '供应商公司名称',
        dataIndex: 'supplier_name',
        key: 'supplier_name',
        width: 150,
      },
      {
        title: '客户公司名称',
        dataIndex: 'guest_name',
        align: 'guest_name',
        width: 150,
        render: val => `${val}`,
      },
      {
        title: '最大发货日期',
        dataIndex: 'max_delivery_time',
        key: 'max_delivery_time',
        width: 150,
        render: text => (<span>{text}天</span>),
      },
      {
        title: '交易总金额(元)',
        dataIndex: 'total_money',
        width: 150,
        key: 'total_money',
      },
      {
        title: '支付状态',
        dataIndex: 'pay_status',
        key: 'pay_status',
        width: 100,
        render: text => (<span>{mapPayStatus[text]}</span>),
      },
      {
        title: '订单状态',
        dataIndex: 'order_status',
        key: 'order_status',
        width: 100,
        render: text => (<span>{mapOrderStatus[text - 1]}</span>),
      },
      {
        title: '佣金(元)',
        dataIndex: 'commission',
        key: 'commission',
      },
      {
        title: '下单时间',
        dataIndex: 'add_time',
        key: 'add_time',
        sorter: true,
        width: 200,
        render: val => <span>{moment(Math.floor(val * 1000)).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => { this.handleOrderClick(`2-${text.id}`); }} disabled={![1, 3].includes(text.order_status)}>订单取消</a>
            <Divider type="vertical" />
            <a href={'#/search/result/?id=' + record.son_order_sn}>查看</a>
          </Fragment>
        ),
        width: 200,
      },
    ];


    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    console.log('订单列表组件', this.props);

    return (
      <div >
        <Table
          with={800}
          loading={loading}
          rowKey={record => record.id}
          dataSource={data || []}
          columns={columns}
          pagination={false}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}
