import Head from 'next/head'
import { Container } from 'semantic-ui-react'
import Router from 'next/router'
import Header from './Header'

export default class Layout extends React.Component {
  state = {
    token: null
  }

  componentDidMount() {
    const token = localStorage.getItem('customerToken')
    const cartId = localStorage.getItem('mcart')

    if (!cartId) {
      const cartId = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, () =>
        ((Math.random() * 16) | 0).toString(16)
      )
      localStorage.setItem('mcart', cartId)
    }

    this.setState({
      token,
      cartId
    })
  }

  render() {
    const { children, title = '' } = this.props
    const { token } = this.state

    return (
      <React.Fragment>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
          <script
            async
            type="text/javascript"
            src="//findify-assets-2bveeb6u8ag.netdna-ssl.com/search/prod/bitaru-test-store.myshopify.com.min.js?shop=bitaru-test-store.myshopify.com"
          />
          <link
            rel="stylesheet"
            href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css"
          />
          <title>{title}</title>
        </Head>

        <Header token={token} />

        <Container fluid style={{ paddingTop: '7em' }}>
          {children}
        </Container>
      </React.Fragment>
    )
  }
}
