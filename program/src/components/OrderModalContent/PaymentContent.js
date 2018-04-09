/*
 * @Author: lll 
 * @Date: 2018-03-05 10:15:16 
 * @Last Modified by: lll
 * @Last Modified time: 2018-04-08 11:34:00
 */

import React, { PureComponent } from 'react';
import moment from 'moment';
import { Row, Col, Select, Input, Form, DatePicker } from 'antd';

import styles from './modal-content.less';

const { Option } = Select;
const { TextArea } = Input;
const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
};
const formItemLayout2 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};

// 延期驳回弹出层内容 
@Form.create({
  onValuesChange: (props, fields) => {
    if (fields.pay_time) {
      props.onChange({ pay_time: moment(fields.pay_time, dateFormat).format('X') });
    } else {
      props.onChange(fields);
    }
  },
})
export default class PaymentContent extends PureComponent {
  componentDidMount() {
    this.props.handleValidate(this.props.form);
  }
  
  render() {
    const { getFieldDecorator } = this.props.form;
    const { data, defaultData } = this.props;
    console.log('完成支付modal coentent', this.props);
    return (
      <div className={styles['modal-content']}>
        <Row>
          <Col span={12}>订单编号：{data.son_order_sn}</Col>
          <Col span={12}>下单时间：{moment(data.add_time * 1000).format('YYYY-MM-DD hh:mm:ss')}</Col>
        </Row>
        <Form>
          <FormItem
            label="支付方式"
            onChange={this.handleChange}
            {...formItemLayout}
          >
            {
              getFieldDecorator('pay_type', {
                rules: [{
                  required: true,
                  message: '请选择支付方式',
                }],
                initialValue: defaultData.pay_type,
              })(
                <Select
                  style={{ width: 120 }}
                >
                  <Option value="1" key="1">微信支付</Option>
                  <Option value="2" key="2">支付宝支付</Option>
                  <Option value="3" key="3">银联支付</Option>
                  <Option value="4" key="4">其他方式支付</Option>
                </Select>
              )
            }
          </FormItem>
          <FormItem
            label="交易流水号"
            onChange={this.handleChange}
            {...formItemLayout2}
          >
            {
              getFieldDecorator('trade_no', {
                rules: [{
                  required: true,
                  message: '请填写交易流水号',
                }],
                initialValue: defaultData.trade_no,
              })(
                <TextArea />
              )
            }
          </FormItem>
          <FormItem
            label="支付时间"
            onChange={this.handleChange}
            {...formItemLayout2}
          >
            {
              getFieldDecorator('pay_time', {
                rules: [{
                  required: true,
                  message: '请选择支付时间',
                }],
                initialValue: defaultData.pay_time,
              })(
                <DatePicker
                  format={dateFormat}
                  placeholder="支付时间"
                />
              )
            }
          </FormItem>
        </Form>
      </div>
    );
  }
}
