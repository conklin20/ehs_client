const { mergeWith } = require('lodash/fp')
const fs = require('fs-extra')

let custom = {}
const hasGatsbyConfig = fs.existsSync('./gatsby-config.custom.js')

if (hasGatsbyConfig) {
  try {
    custom = require('./gatsby-config.custom')
  } catch (err) {
    console.error(
      `Failed to load your gatsby-config.js file : `,
      JSON.stringify(err),
    )
  }
}

const config = {
  pathPrefix: '/',

  siteMetadata: {
    title: 'Ehs Frontend',
    description: 'My awesome app using docz',
  },
  plugins: [
    {
      resolve: 'gatsby-theme-docz',
      options: {
        themeConfig: {},
        themesDir: 'src',
        mdxExtensions: ['.md', '.mdx'],
        docgenConfig: {},
        menu: [],
        mdPlugins: [],
        hastPlugins: [],
        ignore: [],
        typescript: false,
        ts: false,
        propsParser: true,
        'props-parser': true,
        debug: false,
        native: false,
        openBrowser: false,
        o: false,
        open: false,
        'open-browser': false,
        root:
          'C:\\Users\\caryc\\Projects\\Vista Outdoor\\EHS\\EHS.Client\\.docz',
        base: '/',
        source: './',
        src: './',
        files: '**/*.{md,markdown,mdx}',
        public: '/public',
        dest: '.docz/dist',
        d: '.docz/dist',
        editBranch: 'master',
        eb: 'master',
        'edit-branch': 'master',
        config: '',
        title: 'Ehs Frontend',
        description: 'My awesome app using docz',
        host: 'localhost',
        port: 3001,
        p: 3000,
        separator: '-',
        paths: {
          root: 'C:\\Users\\caryc\\Projects\\Vista Outdoor\\EHS\\EHS.Client',
          templates:
            'C:\\Users\\caryc\\Projects\\Vista Outdoor\\EHS\\EHS.Client\\node_modules\\docz-core\\dist\\templates',
          docz:
            'C:\\Users\\caryc\\Projects\\Vista Outdoor\\EHS\\EHS.Client\\.docz',
          cache:
            'C:\\Users\\caryc\\Projects\\Vista Outdoor\\EHS\\EHS.Client\\.docz\\.cache',
          app:
            'C:\\Users\\caryc\\Projects\\Vista Outdoor\\EHS\\EHS.Client\\.docz\\app',
          appPackageJson:
            'C:\\Users\\caryc\\Projects\\Vista Outdoor\\EHS\\EHS.Client\\package.json',
          gatsbyConfig:
            'C:\\Users\\caryc\\Projects\\Vista Outdoor\\EHS\\EHS.Client\\gatsby-config.js',
          gatsbyBrowser:
            'C:\\Users\\caryc\\Projects\\Vista Outdoor\\EHS\\EHS.Client\\gatsby-browser.js',
          gatsbyNode:
            'C:\\Users\\caryc\\Projects\\Vista Outdoor\\EHS\\EHS.Client\\gatsby-node.js',
          gatsbySSR:
            'C:\\Users\\caryc\\Projects\\Vista Outdoor\\EHS\\EHS.Client\\gatsby-ssr.js',
          importsJs:
            'C:\\Users\\caryc\\Projects\\Vista Outdoor\\EHS\\EHS.Client\\.docz\\app\\imports.js',
          rootJs:
            'C:\\Users\\caryc\\Projects\\Vista Outdoor\\EHS\\EHS.Client\\.docz\\app\\root.jsx',
          indexJs:
            'C:\\Users\\caryc\\Projects\\Vista Outdoor\\EHS\\EHS.Client\\.docz\\app\\index.jsx',
          indexHtml:
            'C:\\Users\\caryc\\Projects\\Vista Outdoor\\EHS\\EHS.Client\\.docz\\app\\index.html',
          db:
            'C:\\Users\\caryc\\Projects\\Vista Outdoor\\EHS\\EHS.Client\\.docz\\app\\db.json',
        },
      },
    },
  ],
}

const merge = mergeWith((objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
})

module.exports = merge(config, custom)
