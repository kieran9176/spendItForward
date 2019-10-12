import React from 'react'
import { connect } from 'react-redux'
import {Form, Input, Select, Icon, Button, DatePicker } from 'antd';
import moment from 'moment'
import style from '../style.module.scss'

const { RangePicker } = DatePicker;
const { Option } = Select;

@connect(({ profile }) => ({ profile }))
@Form.create({
  onFieldsChange(props, changedFields, allFields) {

    const { form } = props;
    const { changed } = allFields;
    const {titles, companies, companyLinks, dates} = changedFields;

    [titles, companies, companyLinks, dates].forEach(arr => {
      return arr ? form.setFieldsValue({
        changed: changed.value.map((status, index) => {
          return arr[index] ? "true" : "false"
        })
      }) : null
    });
  }
})

class ExperienceForm extends React.Component {

  remove = (k, index) => {
    const { form, dispatch } = this.props;
    // can use data-binding to get
    const { keys, titles, companies, companyLinks, IDs } = form.getFieldsValue();

    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    const experience = this.createPayloads("removeExperience", [IDs[index]]);

    dispatch({
      type: 'profile/EDIT_PROFILE',
      payload: {
        mutation: "removeExperience",
        data: { experience }
      }
    });

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter( (key) => {
        return key !== k
      }),
      titles: titles.filter( (title) => {
        return title !== titles[index]
      }),
      companies: companies.filter( (company) => {
        return company !== companies[index]
      }),
      companyLinks: companyLinks.filter( (companyLink) => {
        return companyLink !== companyLinks[index]
      }),
      IDs: IDs.filter( (ID) => {
        return ID !== IDs[index]
      }),
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // const nextKeys = keys.concat(id += 1);
    const nextKeys = keys.concat(keys[keys.length - 1] + 1)

    // console.log("nextKeys", nextKeys)
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  createPayloads = (action, array) => {
    const experience = [];
    switch (action) {
      case "updateExperience":
        for (let i = 0; i < array[0].length; i += 1) {
          experience.push({
            position: array[0][i],
            company: array[1][i],
            start_date: array[2][i][0],
            end_date: array[2][i][1],
            link: array[3][i],
            id: array[4][i],
            changed: array[5][i]
          })
        }
        return experience;
      case "removeExperience":
        experience.push({ id: array[0] });
        return experience;
      default:
        return "Could not update"
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    // const {form, dispatch, profile} = this.props
    const {form, dispatch} = this.props

    // const { form } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        const {keys, companies, titles, dates, companyLinks, IDs, changed } = values;

        console.log("VALIDATE FIELDS DATES", dates)

        const companiesArr = keys.map(key => companies[key])
        const titleArr = keys.map(key => titles[key])
        const datesArr = keys.map(key => {
          return [moment(dates[key][0]).format('YYYY-MM-DD'), moment(dates[key][1]).format('YYYY-MM-DD')]
        });
        const companyLinksArr = keys.map(key => companyLinks[key])
        const idArr = keys.map(key => IDs[key])
        const changedArr = keys.map(key => changed[key])

        console.log("DATES ARRAY", datesArr)

        const experience = this.createPayloads("updateExperience", [titleArr, companiesArr, datesArr, companyLinksArr, idArr, changedArr]);

        dispatch({
          type: 'profile/EDIT_PROFILE',
          payload: {
            mutation: "updateExperience",
            data: { experience }
          }
        })
      }
    })
  };

  // if your form doesn't have the fields these you set, this error will appear!
  // if your form doesn't have the fields these you set, this error will appear!
  // if your form doesn't have the fields these you set, this error will appear!
  // https://github.com/ant-design/ant-design/issues/8880

  render() {
    const { form, profile } = this.props
    const { experience } = profile
    const { getFieldDecorator, getFieldValue } = form;

    const selectBefore = (
      <Select defaultValue="https://" style={{ width: 90 }}>
        <Option value="https://">https://</Option>
        <Option value="http://">http://</Option>
      </Select>
    );
    const selectAfter = (
      <Select defaultValue=".com" style={{ width: 80 }}>
        <Option value=".com">.com</Option>
        <Option value=".io">.io</Option>
        <Option value=".org">.org</Option>
        <Option value=".gov">.gov</Option>
      </Select>
    );

    getFieldDecorator('keys', { initialValue: experience.map((expObj, i) => i )});
    getFieldDecorator('IDs', { initialValue: experience.map((expObj) => expObj.id )});
    getFieldDecorator('changed', { initialValue: experience.map( () => "false" )});

    const keys = getFieldValue('keys');

    const companyFormItem = keys.map((k, index) => {
      return (
        <div key={k}>
          <Form.Item
            label={`Company ${index + 1}`}
            required={false}
          >
            { getFieldDecorator(`companies[${index}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: index < experience.length ? experience[index].company : "",
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Please input additional experience or delete this field.",
                },
              ],
            })(<Input placeholder="e.g. EY" style={{width: '60%', marginRight: 8}} />)
            }
          </Form.Item>
          <Form.Item
            label={`Company ${index + 1} Hyperlink`}
            required={false}
          >
            { getFieldDecorator(`companyLinks[${index}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: index < experience.length ? experience[index].link : "",
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Please input additional experience or delete this field.",
                },
              ],
            })(<Input
              addonBefore={selectBefore}
              addonAfter={selectAfter}
              placeholder="consulting.ey"
              style={{width: '60%', marginRight: 8}}
            />) }
          </Form.Item>
          <Form.Item
            label={`Title ${index + 1}`}
            required={false}
          >
            {getFieldDecorator(`titles[${index}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: index < experience.length ? experience[index].position : "",
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Please input additional experience or delete this field.",
                },
              ],
            })(<Input placeholder="e.g. Senior Consultant" style={{width: '60%', marginRight: 8}} />)}
          </Form.Item>
          <Form.Item
            label={`Date ${index + 1}`}
            required={false}
          >
            {getFieldDecorator(`dates[${index}]`, {
              rules: [
                {
                  required: true,
                  message: "Please input additional experience or delete this field.",
                },
              ],
              initialValue: index < experience.length ? [ moment(experience[index].start_date), moment(experience[index].end_date) ] : []
              // initialValue: []
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
            { keys.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.remove(k, index)}
              />
            ) : null}
          </Form.Item>
        </div>
      )
    });

    return (
      <Form onSubmit={this.handleSubmit}>
        { companyFormItem }
        <Form.Item>
          <Button type="dashed" onClick={this.add} style={{width: '60%'}}>
            <Icon type="plus" /> Add field
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default ExperienceForm
