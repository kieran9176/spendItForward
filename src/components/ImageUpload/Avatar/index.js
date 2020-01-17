import React from 'react'
import {connect} from 'react-redux'
import {Form, Upload, Icon, message, Progress, notification } from 'antd';
import AWS from "aws-sdk";
import styles from './style.css'

// function getBase64(img, callback) {
//   const reader = new FileReader();
//   reader.addEventListener('load', () => callback(reader.result));
//   reader.readAsDataURL(img);
// }

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    notification.error({
      message: "File-type not accepted.",
      description: "You can only upload JPG/PNG file."
    });
    console.log('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 5;
  if (!isLt2M) {
    message.error('Image must be smaller than 5MB!');
    notification.error({
      message: "File too large.",
      description: "Image must be smaller than 5MB!"
    });
    console.log('Image must be smaller than 5MB!');
  }
  return isJpgOrPng && isLt2M;
}

@connect(({profile}) => ({profile}))
@Form.create()
class Avatar extends React.Component {

  state = {
    loading: false,
    progress: false,
    dispatchEdit: null,
    id: null,
  };

  componentDidMount() {
    const { type } = this.props;
    this.setFormState(type)
  }

  setFormState = (type) => {
    this.setState(this.getInitialValues(type));
    switch (type) {
      case "Primary":
        this.setState({
          dispatchEdit: 'profile/EDIT_PRIMARY',
        });
        return "Primary Success";
      case "Secondary":
        this.setState({
          dispatchEdit: 'profile/EDIT_SECONDARY',
        });
        return "Secondary Success";
      default:
        return null
    }
  };

  getInitialValues = (type) => {
    const { profile } = this.props;
    const { assets } = profile;
    if (type === "Primary") {
      return assets.filter(asset => asset.type === "primary")[0];
    }
    if (type === "Secondary") {
      return assets.filter(asset => asset.type === "secondary")[0];
    }
    return null
  };

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.handleUpload(info.file.originFileObj)
        .then(res => console.log(res))
    }
  };

  async handleUpload(fileObj) {
    const { dispatch } = this.props;
    const { dispatchEdit, id } = this.state;

    this.setState({
      loading: true
    });

    AWS.config.update({

    });

    const S3 = new AWS.S3();
    const encoded = encodeURI(fileObj.name);

    const objParams = {
      Bucket: "cf-simple-s3-origin-cloudfrontfors3-273116933489",
      Key: `kieranpaul-source/${encoded}`,
      Body: fileObj,
      ContentType: fileObj.type
    };

    return S3.putObject(objParams)
      .on("httpUploadProgress", (progress) => {
        const progressPercentage = Math.round((progress.loaded / progress.total) * 100);
        this.setState({progress: progressPercentage});
      })
      .send((err) => {
          if (err) {

            notification.error({
              message: err.code,
              description: err.message
            });

            this.setState({
              loading: false,
              progress: false
            });
            return "Failed"
          }

          this.setState({
            loading: false,
            progress: false
          });

          const resURL = `https://d2czw3op36f92o.cloudfront.net/kieranpaul-source/${encoded}`;

          // form.setFieldsValue({
          //   image_url: resURL
          // });

          // getBase64(fileObj, imageUrl =>
          //   this.setState({
          //     imageUrl
          //   })
          // );

        this.setState({
          url: resURL
        });

        const { url } = this.state;

        dispatch({
          type: dispatchEdit,
          payload: {id, url}
        });

        this.render();

        return "Success";
        }
      );
  };

  render() {
    const { loading, progress, url } = this.state;
    const { form, post } = this.props;

    // const initialValues = this.getInitialValues(type);

    if (form && post) {
      form.getFieldDecorator('image_url', {
        initialValue: post ? post.image_url : null
      });
    }

    if (progress)  {
      return (
        <Upload
          name="avatar"
          listType="picture-card"
          className={styles.avataruploader}
          showUploadList={false}
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          beforeUpload={beforeUpload}
          onChange={this.handleChange}
        >
          <Progress type="circle" percent={progress} width={80} />
        </Upload>
      )
    }

    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload Cover Image</div>
      </div>
    );

    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className={styles.avataruploader}
        showUploadList={false}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {url ? <img src={url} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    );
  }
}

export default Avatar
