const FilmsRepository = require('../repository/FilmsRepository')
const ReserveFilmRepository = require('../repository/ReserveFilmRepository')
const LeaseRepository = require('../repository/LeaseRepository')

class FilmsService {
  constructor() {
    this.module = 'Filmes Service'
    this.filmsRepository = new FilmsRepository()
    this.reservefilmRepository = new ReserveFilmRepository()
    this.leaseRepository = new LeaseRepository()
  }

  async createFilm({ name, synopsis, rating }) {
    const requestFilm = {
      name,
      synopsis,
      rating
    }

    await this.filmsRepository.create(requestFilm)
  }

  async findFilms() {
    const filmes = await this.filmsRepository.find()

    return filmes
  }

  async updateFilm({ id, name, synopsis, rating }) {
    const film = await this.filmsRepository.findById(id)
    if (!film) {
      throw new Error('Filme não encontrado.')
    }

    const existingFilm = await this.filmsRepository.findByNameAndNotId(name, id)
    if (existingFilm) {
      throw new Error('Já existe um filme com esse nome.')
    }

    return this.filmsRepository.update(id, { name, synopsis, rating })
  }

  async deleteFilm(id) {
    const film = await this.filmsRepository.findById(id)
    if (!film) {
      throw new Error('Filme não encontrado.')
    }
    await this.filmsRepository.delete(id)
  }

  async reserveFilm(movieId) {
    const isAvailable = await this.reservefilmRepository.isFilmAvailable(movieId)

    if (!isAvailable) {
      throw new Error('Este filme não está disponível para reserva.')
    }
    return this.reservefilmRepository.reserveFilm(movieId, 3)
  }

  async confirmReserve(reserveId, customer) {
    const reservation = await this.reservefilmRepository.findById(reserveId)
    if (!reservation) throw new Error('Reserva não encontrada.')

    const lease = await this.leaseRepository.createLease({
      film: reservation.film,
      reservation,
      customer,
      status: 'LEASED'
    })

    await this.reservefilmRepository.updateReserve(reserveId, lease.status)

    return lease
  }

  async returnFilm(scheduleId) {
    const lease = await this.leaseRepository.findById(scheduleId)
    if (!lease) throw new Error('Locação pendente não encontrada.')

    if (lease.status === 'RETURNED') {
      throw new Error('Locação já devolvida encontrada.')
    }

    lease.status = 'RETURNED'
    await lease.save()
    await this.reservefilmRepository.updateReserve(lease.reservation, lease.status)
    return lease
  }
}

module.exports = FilmsService
