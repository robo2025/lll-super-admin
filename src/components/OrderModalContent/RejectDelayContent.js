/*
 * @Author: lll 
 * @Date: 2018-03-05 10:15:16 
 * @Last Modified by: lll
 * @Last Modified time: 2018-04-02 14:45:08
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
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
};
const formItemLayout2 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};

// 延期驳回弹出层内容 
@Form.create({
  onValuesChange: (props, fields) => {
    props.onChange(fields);
  },
})
export default class RejectDelayOrderContent extends PureComponent {
  // 处理下拉列表改变
  handleSelectChange = (key, value) => {
    const { onChange } = this.props;
    const tempJson = {};
    tempJson[key] = value;
    onChange(tempJson);
  }

  // 处理输入框改变
  handleTextChange = (key, text) => {
    const { onChange } = this.props;
    const tempJson = {};
    tempJson[key] = text;
    onChange(tempJson);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { data, defaultData } = this.props;
    const sonOrderInfo = data.son_order_info;
    console.log('延期驳回modal', data);
    return (
      <div className={styles['modal-content']}>
        <Row>
          <Col span={12}>订单编号：{sonOrderInfo.son_order_sn}</Col>
          <Col span={12}>下单时间：{moment(sonOrderInfo.add_time * 1000).format('YYYY-MM-DD hh:mm:ss')}</Col>
        </Row>
        <Row>
          <Col span={12}>客户公司名称：{sonOrderInfo.guest_company_name}</Col>
        </Row>
        <Row>
          <Col span={12}>供应商公司名称：{sonOrderInfo.supplier_name}</Col>
        </Row>
        <Form>
          <FormItem
            label="责任方"
            onChange={this.handleChange}
            {...formItemLayout}
          >
            {
              getFieldDecorator('responsible_party', {
                rules: [{
                  required: true,
                  message: '请选择一个责任方',
                }],
              })(
                <Select
                  defaultValue={defaultData.responsible_party.toString()}
                  style={{ width: 120 }}
                  onChange={(e) => { this.handleSelectChange('responsible_party', e); }}
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
            onChange={this.handleChange}
            {...formItemLayout2}
          >
            {
              getFieldDecorator('desc', {
                rules: [{
                  required: false,
                  message: '请填写补充说明',
                }],
              })(
                <TextArea
                  defaultValue={defaultData.desc}
                  onChange={(e) => { this.handleTextChange('desc', e.target.value); }}
                />
              )
            }
          </FormItem>
        </Form>
      </div>
    );
  }
}
