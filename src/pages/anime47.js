import cheerio from 'cheerio'
import qs from 'querystring'
import cs from 'cloudscraper'
import utils from '../utils/utils'

const DOMAIN = 'http://anime47.com'
const provider = 'A47'

exports.search = q => utils.asyncFunc(_search(q))

const _search = q =>
  new Promise((resolve, reject) => {
    cs.get(`${DOMAIN}/tim-nang-cao/?keyword=${q}`, (error, response, body) => {

      if (error) {
        return reject(error)
      }

      let $ = cheerio.load(body)
      resolve(
        $('#movie-last-movie')
        .find('li')
        .map((i, elem) => {
          let url = $(elem).find('a.movie-item').attr('href')
          let title = $(elem).find('a.movie-item').attr('title')
          let id = 0
          const provider = 'A47'
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
