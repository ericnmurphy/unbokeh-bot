const Jimp = require('jimp')
const Unsplash = require('unsplash-js').default
const fs = require('fs')
require('isomorphic-fetch')

//api keys
const keys = require('./keys')

const saveMetadata = (author, attrUrl, slug) => {
  //push all this metadata into a json file, you feeling me
  const database = '../unbokeh-client/src/data/metadata.json'
  const metadata = [{ author, attrUrl, path: `./images/${slug}.jpg` }]
  const json = JSON.parse(fs.readFileSync(database))
  json.push(...metadata)

  fs.writeFile(database, JSON.stringify(json), err => {})
}

//bokeh-fy images
const blurImage = (url, slug) => {
  return Jimp.read(url)
    .then(image => {
      return image
        .blur(150)
        .quality(80)
        .scaleToFit(2560, 2560)
        .write(`../unbokeh-client/src/data/images/${slug}.jpg`)
    })
    .catch(err => {
      console.log(err)
    })
}

//unsplash setup
const unsplash = new Unsplash({
  applicationId: keys.unsplashApi,
  secret: keys.unsplashSecret,
  callbackUrl: 'http://localhost:3000/',
})

//unsplash api
unsplash.photos
  .getPhoto('NQ-Avc_MjLk')
  .then(res => res.json())
  .then(json => {
    console.log(`processing image...`)
    const url = json.urls.full
    const author = json.user.name
    const attrUrl = `${json.links.html}?utm_source=unbokeh&utm_medium=referral`
    const slug = `${json.user.username}-${json.id}-unbokeh`.toLowerCase()

    // add metadata to database
    saveMetadata(author, attrUrl, slug)

    // blur the damn image!
    blurImage(url, slug)
  })
