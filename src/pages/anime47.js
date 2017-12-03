import $ from 'cheerio'
import cs from 'cloudscraper'
import Movie from '../models/movie'

const DOMAIN = 'http://anime47.com'
const provider = 'A47'

exports.search = q => new Promise((resolve, reject) => {
  cs.get(`${DOMAIN}/tim-nang-cao/?keyword=${q}`, (error, response, body) => {
    error
      ? reject(error)
      : resolve(
          $('#movie-last-movie', body)
            .find('li')
            .map((i, elem) => {
              const url = $(elem).find('a.movie-item').attr('href')
              const title = $(elem).find('a.movie-item').attr('title')
              const id = 0
              const provider = 'A47'

              return {
                provider,
                id,
                title,
                url
              }
            })
            .get()
        )
  })
})

exports.save = url => new Promise((resolve, reject) => {
  cs.get(`${DOMAIN}/${url}`, (error, response, body) => {
    if(error) {
      return reject(error)
    }

    let model = new Movie()
    const element = $('.movie-detail', body)
    const labels = element.find('dt')
    const contents = element.find('dd')

    model.provider = 'A47'
    model.url = url
    model.title1 = element.find('.title-1').text()
    model.title2 = element.find('.title-2').text()

    model.detail = [];
    contents.get().forEach((ele, idx) => {
      const label = $(labels[idx]).text()
      const content = getAText(ele)
      model.detail.push({label, content})
    })

    model.save((err, data) => {
      err ? reject(err) : resolve(data)
    })
  })
})

const getAText = (ele) => {
  const aTags = $(ele).find('a').get()
  return aTags.length
    ? aTags.reduce((rs, item) => rs.concat($(item).text()), []).join(', ')
    : ele.children[0] && ele.children[0].data
}
