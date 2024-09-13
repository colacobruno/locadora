const { BaseService } = require('simple-node-framework').Base
const Films = require('../model/Film')

class FilmsRepository extends BaseService {
  constructor(Film, Reservation, Lease) {
    super({
      module: 'Films Repository'
    })

    this.model = Films.getModel()
    this.Film = Film
    this.Reservation = Reservation
    this.Lease = Lease
  }

  async create(film) {
    return this.model.create(film)
  }

  async find() {
    return this.model.find()
  }

  async findById(id) {
    return this.model.findById(id)
  }

  async findByNameAndNotId(name, id) {
    return this.model.findOne({ name, _id: { $ne: id } })
  }

  async update(id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true })
  }

  async delete(id) {
    return this.model.findByIdAndDelete(id)
  }
}

module.exports = FilmsRepository
