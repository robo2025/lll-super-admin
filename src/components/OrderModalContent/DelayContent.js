/*
 * @Author: lll 
 * @Date: 2018-03-05 10:17:15 
 * @Last Modified by: lll
 * @Last Modified time: 2018-04-02 14:41:20
 */
import React, { PureComponent } from 'react';
import moment from 'moment';
import { Row, Col, Input, DatePicker, Form } from 'antd';
import styles from './modal-content.less';

const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';
const FormItem = Form.Item;
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


// 延迟收货弹出层内容 
@Form.create({
  onValuesChange: (props, fields) => {
    props.onChange(fields);
  },
})
export default class ReminderContent extends PureComponent {
  state = {
    desc: '',
  }

  componentDidMount() {
    this.props.handleValidate(this.props.form);
  }

  // 处理时间选择器改变
  handleDataPickerChange = (key, data, dateString) => {
    console.log(data, dateString);
    const tempJson = {};
    tempJson[key] = dateString;
    this.props.onChange(tempJson);
  }

  // 处理输入框改变
  handleTextChange = (key, text) => {
    const tempJson = {};
    tempJson[key] = text;
    this.setState(tempJson);
    this.props.onChange(tempJson);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { desc } = this.state;
    const { data } = this.props;
    const sonOrderInfo = data.son_order_info;
    console.log('延期Modal', data);
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
            label="延长时间至"
            onChange={this.handleChange}
            {...formItemLayout}
          >
            {
              getFieldDecorator('due_time', {
                rules: [{
                  required: false,
                  message: '请设定延迟时间',
                }],
              })(
                <DatePicker
                  defaultValue={moment(sonOrderInfo.due_time * 1000)}
                  format={dateFormat}
                  disabledDate={current => (current && current < moment(sonOrderInfo.due_time * 1000).endOf('day'))}
                  onChange={(date, dateString) => { this.handleDataPickerChange('due_time', date, dateString); }}
                />
              )
            }
          </FormItem>
          <FormItem
            label="延迟说明"
            onChange={this.handleChange}
            {...formItemLayout2}
          >
            {
              getFieldDecorator('desc', {
                rules: [{
                  required: false,
                  message: '请补充延迟说明',
                }],
              })(
                <TextArea
                  value={desc}
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
