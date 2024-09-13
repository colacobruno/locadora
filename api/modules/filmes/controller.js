const { BaseController } = require('simple-node-framework').Base
const FilmsService = require('./service/FilmsService')

class FilmsController extends BaseController {
  constructor() {
    super({ module: 'Filme Controller' })
    this.filmsService = new FilmsService()
  }

  async createFilm(req, res, next) {
    const { name, synopsis, rating } = req.body
    await this.filmsService.createFilm({ name, synopsis, rating })
    res.json()
    next()
  }

  async findFilms(req, res, next) {
    const films = await this.filmsService.findFilms()
    res.json(films)
    next()
  }

  async updateFilm(req, res, next) {
    const { id } = req.params
    const { name, synopsis, rating } = req.body
    await this.filmsService.updateFilm({
      id,
      name,
      synopsis,
      rating
    })
    res.status(200).send()
    next()
  }

  async deleteFilm(req, res, next) {
    const { id } = req.params
    await this.filmsService.deleteFilm(id)
    res.status(204).send()
    next()
  }

  async reserveFilm(req, res, next) {
    const { movieId } = req.body
    try {
      const reservation = await this.filmsService.reserveFilm(movieId)
      res.status(200).json({ reserveId: reservation._id })
      next()
    } catch (error) {
      res.status(400).json({ error: error.message })
      next()
    }
  }

  async confirmReserve(req, res, next) {
    const { reserveId, customer } = req.body
    const lease = await this.filmsService.confirmReserve(reserveId, customer)
    res.status(200).json({
      scheduleId: lease._id,
      status: lease.status
    })
    next()
  }

  async returnFilm(req, res, next) {
    const { scheduleId } = req.body
    const lease = await this.filmsService.returnFilm(scheduleId)
    res.status(200).json({
      scheduleId: lease._id,
      status: lease.status
    })
    next()
  }
}

module.exports = FilmsController
