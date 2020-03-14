import { API, graphqlOperation } from 'aws-amplify'
import { notification } from 'antd'
import * as subscriptions from 'graphql/subscriptions'

export default function notify(status, type) {
  if (status === 'success') {
    notification.success({
      message: 'Updates Saved',
      description: `You\'ve successfully updated your ${type}.`,
    })
  } else {
    notification.error({
      message: 'Error',
      description:
        'Our team of highly trained monkeys has been dispatched to deal with the situation.',
    })
  }
}

// Subscribe to creation of Todo
export const siteMetadataSubscription = API.graphql(
  graphqlOperation(subscriptions.onCreateSiteMetadata),
).subscribe({
  next: siteMetadata => console.log('returned siteMetadata', siteMetadata),
})
