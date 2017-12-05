import $ from 'cheerio'
import cs from 'cloudscraper'
import Movie from '../models/movie'

const DOMAIN = 'http://www.phimmoi.net'  
const provider = 'PM'

exports.search = q => new Promise((resolve, reject) => {
  cs.get(`${DOMAIN}/tim-kiem/${q}/`, (error, response, body) => {
    error
      ? reject(error)
      : resolve(
          $('.list-movie', body)
            .find('.movie-item')
            .map((i, elem) => {
              const url = $(elem).find('a.block-wrapper').attr('href')
              const title = $(elem).find('a.block-wrapper').attr('title')
              const id = url.split('-').slice(-1).pop().replace('/', '')

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