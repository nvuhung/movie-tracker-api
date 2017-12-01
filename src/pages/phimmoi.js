import cheerio from 'cheerio'
import qs from 'querystring'
import cs from 'cloudscraper'
import utils from '../utils/utils'

const DOMAIN = 'http://www.phimmoi.net'
const provider = 'PM'

exports.search = q => utils.asyncFunc(_search(q))

const _search = q =>
  new Promise((resolve, reject) => {
    cs.get(`${DOMAIN}/tim-kiem/${q}/`, (error, response, body) => {

      if (error) {
        return reject(error)
      }

      let $ = cheerio.load(body)
      resolve(
        $('.list-movie')
        .find('.movie-item')
        .map((i, elem) => {
          let url = $(elem).find('a.block-wrapper').attr('href')
          let title = $(elem).find('a.block-wrapper').attr('title')
          let id = url.split('-').slice(-1).pop().replace('/', '')
          const provider = 'PM'
          return {
            provider,
            id,
            title,
            url
          }
        })
        .get())

    })
  })
