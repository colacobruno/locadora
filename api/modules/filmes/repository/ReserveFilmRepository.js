const { BaseService } = require('simple-node-framework').Base
const Reservation = require('../model/Reservation')

class ReserveFilmRepository extends BaseService {
  constructor() {
    super({
      module: 'Reserve Film Repository'
    })
    this.model = Reservation.getModel()
  }

  async findById(id) {
    return this.model.findById(id)
  }

  async reserveFilm(movieId, duration) {
    const reservation = {
      film: movieId,
      expiresAt: new Date(Date.now() + duration * 3600000)
    }
    const createdReservation = await this.model.create(reservation)
    return createdReservation
  }

  // pegando reservas válidas
  async findValidReservation(reservationId) {
    return this.Reservation.findOne({ _id: reservationId, expiresAt: { $gt: new Date() } })
  }

  async isFilmAvailable(movieId) {
    // pegando a reserva mais recente ordenado por data da expiração
    const latestReservation = await this.model.findOne({ film: movieId }).sort({ expiresAt: -1 })

    // caso não ache, pode reservar
    if (!latestReservation) return true

    // se achar, verifico se o status é returned
    // verifica se a data atual é maior do que a de expiração, pois
    // se for, a reserva fica livre independente do status
    const now = new Date()
    if (latestReservation.status === 'RETURNED' || latestReservation.expiresAt < now) {
      return true
    }

    return false
  }

  async updateReserve(reserveId, status) {
    return this.model.findByIdAndUpdate(reserveId, { status }, { new: true })
  }
}

module.exports = ReserveFilmRepository
