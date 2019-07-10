import Layout from '../components/Layout'
import ProductSummary from '../components/ProductSummary'
import ProductAttributes from '../components/ProductAttributes'
import Findify, { waitForFindify } from '../components/Findify';
import { getProductById } from '../lib/moltin'
import { Component } from 'react';

const sendAnalytics = async (item_id) => {
  const findify = await waitForFindify();
  findify.analytics.sendEvent('view-page', { item_id })
} 

class ProductPage extends React.Component {
  static getInitialProps = async ({ query: { id } }) => {
    const {
      data,
      included: { main_images }
    } = await getProductById(id)

    const imageId = data.relationships.main_image
      ? data.relationships.main_image.data.id
      : false

    return {
      id,
      product: {
        ...data,
        image: imageId
          ? main_images.find(img => img.id === imageId).link.href
          : '/static/moltin-light-hex.svg'
      }
    }
  }

  componentDidMount() {
    sendAnalytics(this.props.id)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.id !== this.props.id) sendAnalytics(this.props.id);
  }

  render() {
    const { product } = this.props;
    return (
      <Layout title={product.name}>
        <ProductSummary {...product} />
        <Findify
          type='recommendation'
          options={{ slot: 'cart-findify-rec-2' }}
          config={{ template: 'slider' }}
        />
        <Findify
          type='recommendation'
          options={{ slot: 'product-findify-rec-4', item_ids: ['15855'] }}
          config={{ template: 'swiper' }}
        />
        <Findify
          type='recommendation'
          options={{ slot: 'home-findify-rec-3' }}
          config={{ template: 'grid' }}
        />
        <ProductAttributes {...product} />
      </Layout>
    )
  }
}


export default ProductPage
