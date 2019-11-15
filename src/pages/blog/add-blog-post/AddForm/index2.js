import React from 'react'
import { Upload, Button, Icon, message } from 'antd';
import AWS from "aws-sdk";

class AddForm1 extends React.Component {
  state = {
    fileList: [],
    uploading: false,
  };

  onSuccess = (result, file) => {
    console.log("onSuccess", result, file.name);
  };

  onError = (err) => {
    console.log("onError", err);
  };

  onProgress = ({percent}, file) => {
    console.log("onProgress", `${percent}%`, file.name);
  };

  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('files[]', file);
    });

    this.setState({
      uploading: true,
    });

    AWS.config.update({
      accessKeyId: "AKIAT7FYJVVY5WMCAEIQ",
      secretAccessKey: "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"
    });

    const S3 = new AWS.S3();

    const objParams = {
      Bucket: "cf-simple-s3-origin-cloudfrontfors3-273116933489",
      Key: `kieranpaul-source/${fileList[0].name}`,
      Body: fileList[0],
      ContentType: fileList[0].type
    };

    S3.putObject(objParams)
      .on("httpUploadProgress", ({loaded, total}) => {
        this.onProgress(
          {
            percent: Math.round((loaded / total) * 100)
          },
          fileList[0]
        );
      })
      .send((err, data) => {
        if (err) {
          this.onError();
          console.log("Something went wrong");
          console.log(err.code);
          console.log(err.message);
          this.setState({ uploading: false })
        } else {
          console.log("data", data)
          this.onSuccess(data, fileList[0]);
          message.success(`${fileList[0].name} file uploaded successfully`);
          this.setState({ uploading: false })
          console.log("https://d2czw3op36f92o.cloudfront.net/kieranpaul-source/", fileList[0].name)
        }
      });
  };

  render() {
    const { uploading, fileList } = this.state;
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };

    return (
      <div>
        <Upload {...props}>
          <Button>
            <Icon type="upload" /> Select File
          </Button>
        </Upload>
        <Button
          type="primary"
          onClick={this.handleUpload}
          disabled={fileList.length === 0}
          loading={uploading}
          style={{ marginTop: 16 }}
        >
          {uploading ? 'Uploading' : 'Start Upload'}
        </Button>
      </div>
    );
  }
}

export default AddForm1
