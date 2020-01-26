import React from 'react'
import { connect } from 'react-redux'
import { API, graphqlOperation } from 'aws-amplify';
import * as mutations from 'graphql/mutations'
import { Tag, Input, Icon, notification } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';

@connect(({ profile }) => ({ profile }))
class TagsForm extends React.Component {

  constructor(props) {
    super(props);
    const { coursework, skills }  = props.profile;
    const { type } = props;
    let tags = [];

    if (type === "Coursework") tags = coursework;
    if (type === "Skills") tags = skills;

    this.state = {
      tags,
      inputVisible: false,
      inputValue: '',
    };
  }

  handleClose = removedTag => {
    let { tags } = this.state;
    const { type } = this.props;
    let mutation = "";

    if (type === "Coursework") mutation = "deleteCoursework";
    if (type === "Skills") mutation = "deleteSkill";

    API.graphql(graphqlOperation(mutations[mutation], {
        input: {
          id: removedTag.id
        }
      })
    )
      .then(response => {

        if (response.data) {
          const { deleteCoursework, deleteSkill } = response.data;
          let tagValue = "";

          tags = tags.filter(tag => tag !== removedTag);
          this.setState({ tags });

          if (deleteCoursework) tagValue = deleteCoursework.course_name;
          if (deleteSkill) tagValue = deleteSkill.content;

          this.setState({ tags });

          notification.success({
            message: 'Updates Saved',
            description: `You've successfully removed "${tagValue}" from your ${type}.`
          });

        } else {
          notification.error({
            message: 'Error',
            description: 'Our team of highly trained monkeys has been dispatched to deal with the situation.',
          });
        }
      });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const {inputValue} = this.state;
    let { tags } = this.state;
    const { type } = this.props;
    let mutation = "";
    let payload = {};

    if (type === "Coursework") {
      mutation = "createCoursework";
      payload = {
        input: {
          course_name: inputValue
        }
      }
    }
    if (type === "Skills") {
      mutation = "createSkill";
      payload = {
        input: {
          content: inputValue
        }
      }
    }

    if (inputValue) {

      API.graphql(graphqlOperation(mutations[mutation], payload))
        .then(response => {

          if (response.data) {
            const { createCoursework, createSkill } = response.data;
            let tagValue = "";

            if (createCoursework) {
              const { id } = createCoursework;
              tagValue = createCoursework.course_name;
              tags = [...tags, { course_name: tagValue, id}];
            }

            if (createSkill) {
              const { id } = createSkill;

              tagValue = createSkill.content;
              tags = [...tags, { content: tagValue, id}];
            }

            this.setState({
              tags,
              inputVisible: false,
              inputValue: '',
            });

            notification.success({
              message: 'Updates Saved',
              description: `You've successfully added "${tagValue}" to your ${type}.`
            });

          } else {
            notification.error({
              message: 'Error',
              description: 'Our team of highly trained monkeys has been dispatched to deal with the situation.',
            });
          }
        });
    }
  };

  forMap = tagObj => {
    const { type } = this.props;
    let tagValue = "";

    if (type === "Coursework") tagValue = tagObj.course_name;
    if (type === "Skills") tagValue = tagObj.content;

    const tagElem = (
      <Tag
        closable
        onClose={e => {
          e.preventDefault();
          this.handleClose(tagObj);
        }}
      >
        { tagValue }
      </Tag>
    );
    return (
      <span key={tagValue} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    );
  };

  saveInputRef = (input) => {
    this.input = input
  };

  render() {
    const { tags, inputVisible, inputValue } = this.state;
    const tagChild = tags ? tags.map(this.forMap) : null;

    return (
      <div>
        <div style={{marginBottom: 16}}>
          <TweenOneGroup
            enter={{
              scale: 0.8,
              opacity: 0,
              type: 'from',
              duration: 100,
              onComplete: e => {
                e.target.style = '';
              },
            }}
            leave={{opacity: 0, width: 0, scale: 0, duration: 200}}
            appear={false}
          >
            {tagChild}
          </TweenOneGroup>
        </div>
        <div style={{marginBottom: 16}}>
          {inputVisible && (
            <Input
              ref={this.saveInputRef}
              type="text"
              size="small"
              style={{width: 78}}
              value={inputValue}
              onChange={this.handleInputChange}
              onBlur={this.handleInputConfirm}
              onPressEnter={this.handleInputConfirm}
            />
          )}
          {!inputVisible && (
            <Tag onClick={this.showInput} style={{background: '#fff', borderStyle: 'dashed'}}>
              <Icon type="plus" /> New Tag
            </Tag>
          )}
        </div>
      </div>
    )
  }
}

export default TagsForm
