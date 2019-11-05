import React from 'react'
import App from 'next/app'
import { Tina, TinaCMS } from 'tinacms'

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    const cms = new TinaCMS()
    return (
      <Tina cms={cms}>
        <Component {...pageProps} />
      </Tina>
    )
  }
}
export default MyApp