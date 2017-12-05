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

exports.getMovieDetail = url => new Promise((resolve, reject) => {
  cs.get(`${DOMAIN}/${url}`, (error, response, body) => {
    error
      ? reject(error)
      : resolve(parseModel(url, body))
  })
})

const parseModel = (url, body) => {
  let model = new Movie()
  const element = $('.movie-detail', body)
  const labels = element.find('dt')
  const contents = element.find('dd')

  model.provider = provider
  model.url = url
  model.title1 = element.find('.title-1').last().text()
  model.title2 = element.find('.title-2').text() + element.find('.title-year').text()

  model.detail = []
  contents.get().forEach((ele, idx) => {
    const label = $(labels[idx]).text()
    const content = getAText(ele)
    model.detail.push({label, content})
  })

  return model
}

const getAText = (ele) => {
  const aTags = $(ele).find('a').get()
  return aTags.length
    ? aTags.reduce((rs, item) => rs.concat($(item).text()), []).join(', ')
    : ele.children[0] && ele.children[0].data
}