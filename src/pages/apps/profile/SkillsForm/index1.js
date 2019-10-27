import React from 'react'
import { connect } from 'react-redux'
import { Tag, Input, Icon, Form, Button } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';

@Form.create()
@connect(({ profile }) => ({ profile }))
class SkillsForm extends React.Component {

  state = {
    tags: ['Python', 'Java', 'C++'],
    inputVisible: false,
    inputValue: '',
  };

  handleClose = removedTag => {
    let { tags } = this.state
    tags = tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
  };

  showInput = () => {
    // this.setState({ inputVisible: true }, () => this.input.focus());
    this.setState({ inputVisible: true });
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    console.log(tags);
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  };

  forMap = tag => {
    const tagElem = (
      <Tag
        closable
        onClose={e => {
          e.preventDefault();
          this.handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    );
  };

  saveInputRef = (input) => {
    this.input = input
  }



  render() {
    const { tags, inputVisible, inputValue } = this.state;
    const tagChild = tags.map(this.forMap);

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
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
    );
  }
}

export default SkillsForm
