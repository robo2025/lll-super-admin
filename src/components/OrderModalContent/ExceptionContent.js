import React, { Component } from 'react';
import moment from 'moment';
import { DatePicker, Form, Select, Input } from 'antd';
import styles from './ExceptionContent.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;


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
class ExceptionContent extends Component {
  state = {
    isHaveGoods: false,
  }

  componentDidMount() {
    console.log('异常处理弹窗didmount', this.props);
    this.props.handleValidate(this.props.form);
  }

  handleSelected = (value) => {
    console.log(`selected ${value}`);
    if (value >> 0 === 9) {
      this.setState({ isHaveGoods: false });
    } else {
      this.setState({ isHaveGoods: true });
    }
  }

  disabledDate = (current, last) => {
    console.log('当前时间:', current && current < moment().endOf('day'), moment(last).format('YYYY-MM-DD'));
    return current && current < moment(last).endOf('day');
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { isHaveGoods } = this.state;
    const { data, defaultData } = this.props;
    const sonOrderInfo = data.son_order_info;
    console.log('异常弹窗', this.props, isHaveGoods);

    return (
      <div className={styles['exception-content']}>
        <Form>
          <FormItem
            label="订单ID"
            labelCol={{
              xs: { span: 24 },
              sm: { span: 4 },
            }}
            wrapperCol={{
              xs: { span: 24 },
              sm: { span: 8 },
            }}
          >
            <span>{sonOrderInfo.son_order_sn}</span>
          </FormItem>
          <FormItem
            label="原发货时间"
            labelCol={{
              xs: { span: 24 },
              sm: { span: 4 },
            }}
            wrapperCol={{
              xs: { span: 24 },
              sm: { span: 8 },
            }}
          >
            <span>{moment(sonOrderInfo.due_time * 1000).format('YYYY-MM-DD')}</span>
          </FormItem>
          <FormItem
            label="异常情况"
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
              getFieldDecorator('operation_type', {
                rules: [{
                  required: true,
                  message: '请选择异常情况',
                }],
                initialValue: defaultData.operation_type.toString(),
              })(
                <Select onChange={this.handleSelected}>
                  <Option value="9">无货</Option>
                  <Option value="10">延期</Option>
                </Select>
              )
            }
          </FormItem>
          {
            isHaveGoods ?
            (
              <FormItem
                label="预计发货时间"
                {...formItemLayout}
              >
                {
                  getFieldDecorator('expect_date_of_delivery', {
                    rules: [{
                      required: true,
                      message: '请选择预计发货时间',
                    }],
                  })(
                    <DatePicker
                      allowClear={false}
                      disabledDate={current => (this.disabledDate(current, sonOrderInfo.due_time * 1000))}
                    />
                  )
                }
              </FormItem>
            )
            :
            null
          }

          <FormItem
            label="说明"
            {...formItemLayout}
          >
            {
              getFieldDecorator('remarks', {
                rules: [{
                  required: true,
                  message: '请填写说明原因',
                  initialValue: defaultData.remarks,
                }],
              })(
                <TextArea rows={4} />
              )
            }
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default ExceptionContent;
