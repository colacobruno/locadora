const { BaseService } = require('simple-node-framework').Base
const Lease = require('../model/Lease')

class LeaseRepository extends BaseService {
  constructor() {
    super({
      module: 'Lease Repository'
    })

    this.model = Lease.getModel()
  }

  async findById(leaseId) {
    return this.model.findById(leaseId).populate('film')
  }

  async createLease(data) {
    const lease = {
      film: data.film,
      reservation: data.reservation,
      customer: data.customer,
      status: data.status
    }
    return this.model.create(lease)
  }

  async findByIdAndStatus(leaseId, notStatus) {
    return this.model.findOne({
      _id: leaseId,
      status: { $ne: notStatus }
    })
  }
}

module.exports = LeaseRepository
