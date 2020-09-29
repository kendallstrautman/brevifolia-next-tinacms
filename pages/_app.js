import React from 'react'
import App from 'next/app'
import { TinaProvider, TinaCMS } from 'tinacms'
import { GitClient, GitMediaStore } from '@tinacms/git-client'
import { MarkdownFieldPlugin } from 'react-tinacms-editor'
import { DateFieldPlugin } from 'react-tinacms-date'

import { CreateBlogPlugin } from '../plugins/markdownCreator'

class MyApp extends App {
  constructor() {
    super()
    const git = new GitClient('http://localhost:3000/___tina')
    this.cms = new TinaCMS({
      enabled: process.env.NODE_ENV === 'development',
      sidebar: {
        position: 'overlay',
      },
      apis: {
        git,
      },
      media: new GitMediaStore(git),
    })

    this.cms.plugins.add(MarkdownFieldPlugin)
    this.cms.plugins.add(DateFieldPlugin)
    this.cms.plugins.add(CreateBlogPlugin)
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <TinaProvider cms={this.cms}>
        <Component {...pageProps} />
      </TinaProvider>
    )
  }
}
export default MyApp
