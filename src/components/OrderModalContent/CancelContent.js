/*
 * @Author: lll 
 * @Date: 2018-03-05 10:15:16 
 * @Last Modified by: lll
 * @Last Modified time: 2018-04-08 13:45:27
 */
import React, { PureComponent } from 'react';
import moment from 'moment';
import { Row, Col, Select, Input, Form } from 'antd';

import styles from './modal-content.less';

const { Option } = Select;
const { TextArea } = Input;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

// 取消订单弹出层内容 
@Form.create({
  onValuesChange: (props, fields) => {
    if (fields.expect_date_of_delivery) {
      // console.log(fields.expect_date_of_delivery.format('YYYY-MM-DD'));
      const ExpectTime = fields.expect_date_of_delivery.format('YYYY-MM-DD');
      props.onChange({ expect_date_of_delivery: ExpectTime });
    } else {
      props.onChange(fields);
    }
  },
})
export default class CancelContent extends PureComponent {
  componentDidMount() {
    this.props.handleValidate(this.props.form);
  }
  
  render() {
    const { data, defaultData } = this.props;
    const { getFieldDecorator } = this.props.form;    
    const orderInfo = data.son_order_info || data;

    return (
      <div className={styles['modal-content']}>
        <Row>
          <Col span={12}>订单编号：{orderInfo.son_order_sn}</Col>
          <Col span={12}>下单时间：{moment(orderInfo.add_time * 1000).format('YYYY-MM-DD hh:mm:ss')}</Col>
        </Row>
        {
          orderInfo.supplier_name ?
            (
              <React.Fragment>
                <Row>
                  <Col span={12}>客户公司名称：{orderInfo.guest_company_name}</Col>
                </Row>
                <Row>
                  <Col span={12}>供应商公司名称：{orderInfo.supplier_name}</Col>
                </Row>
              </React.Fragment>
            )
            :
            (
              null
            )
        }
        <FormItem
          label="责任方"
          labelCol={{
            xs: { span: 24 },
            sm: { span: 4 },
          }}
          wrapperCol={{
            xs: { span: 24 },
            sm: { span: 8 },
          }}
        >
          {
            getFieldDecorator('responsible_party', {
              rules: [{
                required: true,
                message: '请选择责任方',
              }],
              initialValue: defaultData.responsible_party.toString(),
            })(
              <Select
                style={{ width: 120 }}
              >
                <Option value="1">客户</Option>
                <Option value="2">供应商</Option>
                <Option value="3">平台</Option>
              </Select>
            )
          }
        </FormItem>
        <FormItem
          label="说明"
          {...formItemLayout}
        >
          {
            getFieldDecorator('desc', {
              rules: [{
                required: true,
                message: '请填写说明原因',
                initialValue: defaultData.desc,
              }],
            })(
              <TextArea rows={4} />
            )
          }
        </FormItem>
      </div>
    );
  }
}
