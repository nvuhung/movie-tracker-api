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
              const provider = 'PM'

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

exports.getDetail = url => new Promise((resolve, reject) => {
  cs.get(`${DOMAIN}/${url}`, (error, response, body) => {
    error ? reject(error) : resolve(body)
  })
})