import React from 'react'
import { connect } from 'react-redux'
import { Divider, Steps } from 'antd'

const { Step } = Steps

@connect(({ builds }) => ({ builds }))
class BuildStatus extends React.Component {
  pending = () => {
    return (
      <Steps current={4} size="small">
        <Step title="Started" description="Loading ..." />
        <Step title="In Progress" description="Loading ..." />
        <Step title="Waiting" description="Loading ..." />
      </Steps>
    )
  }

  started = () => {
    return (
      <Steps current={0} size="small">
        <Step title="Started" description="Build started." />
        <Step title="In Progress" description="Build not yet running." />
        <Step title="Waiting" description="Build not yet available to view." />
      </Steps>
    )
  }

  running = () => {
    return (
      <Steps current={1} size="small">
        <Step title="Started" description="Build started." />
        <Step title="In Progress" description="Build running." />
        <Step title="Waiting" description="Build not yet available to view." />
      </Steps>
    )
  }

  complete = () => {
    return (
      <Steps current={2} size="small">
        <Step title="Started" description="Build started." />
        <Step title="In Progress" description="Build running." />
        <Step title="Complete" description="Build available to view." />
      </Steps>
    )
  }

  render() {
    const { builds } = this.props
    const { developResponse, masterResponse } = builds
    const developStatus = developResponse.status
    const masterStatus = masterResponse.status

    const determineStatus = status => {
      console.log('determineStatus', status)

      switch (status) {
        case 'PENDING':
          return this.pending()
        case 'START':
          return this.started()
        case 'RUNNING':
          return this.running()
        default:
          return this.complete()
      }
    }

    return (
      <div>
        <p>Public</p>
        {determineStatus(masterStatus)}
        <Divider />
        <p>Staging</p>
        {determineStatus(developStatus)}
      </div>
    )
  }
}

export default BuildStatus
