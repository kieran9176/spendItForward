import React from 'react'
import { connect } from 'react-redux'
import { Table } from 'antd'

@connect(({ profile }) => ({ profile }))
class Cart extends React.Component {
  state = {}

  getInitialValues = type => {
    const { profile } = this.props
    const { siteMetadata } = profile

    if (type === 'siteMetadata') {
      return siteMetadata || []
    }
    return []
  }

  transformToTable = initialValues => {
    const data = initialValues[0]

    return {
      siteMetadataTableData: [
        {
          key: '1',
          number: '1',
          description: 'Theme',
          metadata: data
            ? data.theme
            : 'Details pending, will populate ~30 seconds from signup (refresh required).',
        },
        {
          key: '2',
          number: '2',
          description: 'Staging URL',
          metadata: data
            ? data.development_url
            : 'Details pending, will populate ~30 seconds from signup (refresh required).',
        },
        {
          key: '3',
          number: '3',
          description: 'Production URL',
          metadata: data
            ? data.production_url
            : 'Details pending, will populate ~30 seconds from signup (refresh required).',
        },
      ],
    }
  }

  render() {
    const initialValues = this.getInitialValues('siteMetadata')
    const { siteMetadataTableData } = this.transformToTable(initialValues)

    const columns = [
      {
        title: '#',
        dataIndex: 'number',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        render: text => <div>{text}</div>,
      },
      {
        title: 'Metadata',
        dataIndex: 'metadata',
        render: text => (
          <a
            className="utils__link--underlined"
            href={text}
            target="_blank"
            rel="noopener noreferrer"
          >
            {text}
          </a>
        ),
      },
    ]

    return (
      <Table
        className="utils__scrollTable"
        scroll={{ x: '100%' }}
        dataSource={siteMetadataTableData}
        columns={columns}
        pagination={false}
      />
    )
  }
}

export default Cart
