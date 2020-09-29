/**

Copyright 2019 Forestry.io Inc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Modified from tinacms/tinacms 
RemarkCreatorPlugin in gatsby-tinacms-remark package 09.29.20

*/

import toMarkdownString from '../utils/toMarkdownString'

const MISSING_FILENAME_MESSAGE =
  'createRemarkButton must be given `filename(form): string`'
const MISSING_FIELDS_MESSAGE =
  'createRemarkButton must be given `fields: Field[]` with at least 1 item'

export class MarkdownCreatorPlugin {
  __type = 'content-creator'
  name
  fields

  // Markdown Specific
  filename
  frontmatter
  body

  constructor(options) {
    if (!options.filename) {
      console.error(MISSING_FILENAME_MESSAGE)
      throw new Error(MISSING_FILENAME_MESSAGE)
    }

    if (!options.fields || options.fields.length === 0) {
      console.error(MISSING_FIELDS_MESSAGE)
      throw new Error(MISSING_FIELDS_MESSAGE)
    }

    this.name = options.label
    this.fields = options.fields
    this.filename = options.filename
    this.frontmatter = options.frontmatter || (() => ({}))
    this.body = options.body || (() => '')
  }

  async onSubmit(form, cms) {
    const fileRelativePath = await this.filename(form)
    const frontmatter = await this.frontmatter(form)
    const markdownBody = await this.body(form)

    cms.api.git.onChange({
      fileRelativePath,
      content: toMarkdownString({
        fileRelativePath,
        frontmatter,
        markdownBody,
      }),
    })
  }
}

export const CreateBlogPlugin = new MarkdownCreatorPlugin({
  label: 'Add New Post',
  filename: form => {
    const slug = form.title.replace(/\s+/g, '-').toLowerCase()
    return `posts/${slug}.md`
  },
  fields: [
    {
      label: 'Title',
      name: 'title',
      component: 'text',
      required: true,
    },
    {
      label: 'Date',
      name: 'date',
      component: 'date',
      description: 'The default will be today',
    },
    {
      label: 'Author',
      description: 'Who wrote this, yo?',
      name: 'author',
      component: 'text',
    },
  ],
  frontmatter: postInfo => ({
    title: postInfo.title,
    date: postInfo.date || new Date(),
    author: postInfo.author || 'Kurt Vonnegut',
    hero_image: '/static/alfons-taekema-bali.jpg',
  }),
  body: () => `New post, who dis?`,
})
