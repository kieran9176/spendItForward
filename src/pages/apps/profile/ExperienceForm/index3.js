import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Button, Row, DatePicker } from 'antd'
import moment from 'moment'
import style from '../style.module.scss'

const { RangePicker } = DatePicker;

@Form.create()
@connect(({ profile }) => ({ profile }))
class ExperienceForm extends React.Component {

  getFields() {
    const { form, profile } = this.props
    const { experience } = profile
    const { getFieldDecorator } = form;
    const children = [];
    for (let i = 0; i < 2; i += 1) {
      children.push(
        <Form.Item label={`Title ${i + 1}`} key={i}>
          {getFieldDecorator(`title-field-${i}`, {
            rules: [
              {
                required: true,
                message: 'Input something!',
              },
            ],
            initialValue: experience[i].position,
          })(<Input placeholder="e.g. VP of Operations" />)}
        </Form.Item>,
        <Form.Item label={`Company ${i + 1}`} key={i + 1}>
          {getFieldDecorator(`company-field-${i}`, {
            rules: [
              {
                required: true,
                message: 'Input something!',
              },
            ],
            initialValue: experience[i].company,
          })(<Input placeholder="e.g. Chune Supply" />)}
        </Form.Item>,
        <Form.Item label={`Date ${i + 1}`}>
          {getFieldDecorator(`date-field-${i}`, {
            rules: [
              {
                required: true,
              },
            ],
            initialValue: [(moment(experience[i].start_date, 'YYYY-MM-DD')), (moment(experience[i].end_date, 'YYYY-MM-DD'))],
          })(<RangePicker
            dateRender={current => {
              const style1 = {};
              if (current.date() === 1) {
                style1.border = '1px solid #1890ff';
                style1.borderRadius = '50%';
              }
              return (
                <div className="ant-calendar-date" style={style}>
                  {current.date()}
                </div>
              );
            }}
          />)}
        </Form.Item>,
      );
    }
    return children;
  }

  onSubmit = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'profile/EDIT_PROFILE',
      payload: {
        mutation: "updateExperience",
        data: {
          experience: [
            {
              id: "57704f70-c41b-4717-8dda-8da263be8bc6",
              content: "Hi, I'm Joey Bag O Donuts."
            }
          ]
        }
      }
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, profile } = this.props
    const { experience } = profile
    form.validateFields((err, values) => {
      console.log("EXPERIENCE (1)", experience)
      console.log("VALUES", values)
      console.log("DATE-FIELD-0", values[`date-field-0`][0])
      // for (let i = 0; i < 2; i += 1) {
      //   experience[i].position = values[`title-field-${i}`]
      //   experience[i].company = values[`company-field-${i}`]
      //   experience[i].start_date = values[`date-field-${i}`][0]
      //   experience[i].end_date = values[`date-field-${i}`][1]
      // }
      console.log("EXPERIENCE (2)", experience)
    });
  };

  render() {

    return (
      <Form className="experience-form" onSubmit={this.handleSubmit}>
        <Row>{this.getFields()}</Row>
        <Row>
          <div>
            <Button type="primary" htmlType="submit">
              <i className="fa fa-send mr-2" />
              Save Experience
            </Button>
          </div>
        </Row>
      </Form>
    );
  }
}

export default ExperienceForm

