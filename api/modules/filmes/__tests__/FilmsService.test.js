const { FilmsService } = require('../service/FilmsService')
const FilmsRepository = require('../repository/FilmsRepository')
const ReserveFilmRepository = require('../repository/ReserveFilmRepository')
const LeaseRepository = require('../repository/LeaseRepository')

jest.mock('../repository/FilmsRepository')
jest.mock('../repository/ReserveFilmRepository')
jest.mock('../repository/LeaseRepository')

describe('FilmsService', () => {
  let filmsService
  let mockReserveFilmRepository

  beforeEach(() => {
    mockReserveFilmRepository = {
      isFilmAvailable: jest.fn()
    }
    filmsService = new FilmsService({
      reservefilmRepository: mockReserveFilmRepository
    })
  })

  describe('createFilm', () => {
    it('should call create on FilmsRepository with the correct parameters', async () => {
      const filmData = {
        name: 'Inception',
        synopsis: 'A thief who steals corporate secrets.',
        rating: 'PG-13'
      }
      FilmsRepository.prototype.create = jest.fn()

      await filmsService.createFilm(filmData)

      expect(FilmsRepository.prototype.create).toHaveBeenCalledWith(filmData)
    })
  })

  describe('findFilms', () => {
    it('should retrieve films', async () => {
      const mockFilms = [
        { name: 'Inception', synopsis: 'A thief who steals corporate secrets.', rating: 'PG-13' }
      ]
      FilmsRepository.prototype.find = jest.fn().mockResolvedValue(mockFilms)

      const films = await filmsService.findFilms()

      expect(films).toEqual(mockFilms)
      expect(FilmsRepository.prototype.find).toHaveBeenCalled()
    })
  })

  describe('updateFilm', () => {
    it('should throw an error if film not found', async () => {
      FilmsRepository.prototype.findById = jest.fn().mockResolvedValue(null)

      await expect(
        filmsService.updateFilm({
          id: '123',
          name: 'New name',
          synopsis: 'New synopsis',
          rating: 'PG'
        })
      ).rejects.toThrow('Filme não encontrado.')
    })

    it('should throw an error if there is another film with the same name', async () => {
      const mockFilm = {
        _id: '123',
        name: 'Original Name',
        synopsis: 'Original Synopsis',
        rating: 'PG'
      }
      FilmsRepository.prototype.findById = jest.fn().mockResolvedValue(mockFilm)
      FilmsRepository.prototype.findByNameAndNotId = jest.fn().mockResolvedValue({ _id: '124' }) // Simulate finding another film

      await expect(
        filmsService.updateFilm({
          id: '123',
          name: 'Updated Name',
          synopsis: 'Updated Synopsis',
          rating: 'R'
        })
      ).rejects.toThrow('Já existe um filme com esse nome.')
    })

    it('should update the film if it is found and no conflicts exist', async () => {
      const mockFilm = {
        _id: '123',
        name: 'Original Name',
        synopsis: 'Original Synopsis',
        rating: 'PG'
      }
      FilmsRepository.prototype.findById = jest.fn().mockResolvedValue(mockFilm)
      FilmsRepository.prototype.findByNameAndNotId = jest.fn().mockResolvedValue(null)
      FilmsRepository.prototype.update = jest.fn().mockResolvedValue({
        _id: '123',
        name: 'Updated Name',
        synopsis: 'Updated Synopsis',
        rating: 'R'
      })

      const updatedFilm = await filmsService.updateFilm({
        id: '123',
        name: 'Updated Name',
        synopsis: 'Updated Synopsis',
        rating: 'R'
      })

      expect(FilmsRepository.prototype.update).toHaveBeenCalledWith('123', {
        name: 'Updated Name',
        synopsis: 'Updated Synopsis',
        rating: 'R'
      })
      expect(updatedFilm).toEqual({
        _id: '123',
        name: 'Updated Name',
        synopsis: 'Updated Synopsis',
        rating: 'R'
      })
    })

    it('should handle an error when updating the film in the repository', async () => {
      const mockFilm = {
        _id: '123',
        name: 'Original Name',
        synopsis: 'Original Synopsis',
        rating: 'PG'
      }
      // Encontra o filme corretamente
      FilmsRepository.prototype.findById = jest.fn().mockResolvedValue(mockFilm)
      // Assume que não há conflito de nome
      FilmsRepository.prototype.findByNameAndNotId = jest.fn().mockResolvedValue(null)
      // Simula uma falha no método update
      FilmsRepository.prototype.update = jest
        .fn()
        .mockRejectedValue(new Error('Erro ao atualizar o filme'))

      await expect(
        filmsService.updateFilm({
          id: '123',
          name: 'Updated Name',
          synopsis: 'Updated Synopsis',
          rating: 'R'
        })
      ).rejects.toThrow('Erro ao atualizar o filme')

      expect(FilmsRepository.prototype.update).toHaveBeenCalledWith('123', {
        name: 'Updated Name',
        synopsis: 'Updated Synopsis',
        rating: 'R'
      })
    })
  })

  describe('deleteFilm', () => {
    it('should throw an error if the film to be deleted is not found', async () => {
      FilmsRepository.prototype.findById = jest.fn().mockResolvedValue(null)

      await expect(filmsService.deleteFilm('123')).rejects.toThrow('Filme não encontrado.')
    })

    it('should delete the film if found', async () => {
      FilmsRepository.prototype.findById = jest.fn().mockResolvedValue({})
      FilmsRepository.prototype.delete = jest.fn()

      await filmsService.deleteFilm('123')

      expect(FilmsRepository.prototype.delete).toHaveBeenCalledWith('123')
    })
  })

  describe('reserveFilm', () => {
    it('should reserve the film if it is available', async () => {
      ReserveFilmRepository.prototype.isFilmAvailable = jest.fn().mockResolvedValue(true)
      ReserveFilmRepository.prototype.reserveFilm = jest.fn()

      await filmsService.reserveFilm('123')

      expect(ReserveFilmRepository.prototype.reserveFilm).toHaveBeenCalledWith('123', 3)
    })

    it('should throw an error if the film is not available for reservation', async () => {
      mockReserveFilmRepository.isFilmAvailable.mockResolvedValue(false)

      await expect(filmsService.reserveFilm('123')).rejects.toThrow(
        'Este filme não está disponível para reserva.'
      )
    })
  })

  describe('confirmReserve', () => {
    it('should throw an error if the reservation is not found', async () => {
      ReserveFilmRepository.prototype.findById = jest.fn().mockResolvedValue(null)

      await expect(
        filmsService.confirmReserve('reserveId', {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890'
        })
      ).rejects.toThrow('Reserva não encontrada.')
    })

    it('should create a lease if the reservation is found', async () => {
      const mockReservation = { _id: 'reserveId', film: 'filmId' }
      ReserveFilmRepository.prototype.findById = jest.fn().mockResolvedValue(mockReservation)
      LeaseRepository.prototype.createLease = jest.fn().mockResolvedValue({
        _id: 'leaseId',
        status: 'LEASED'
      })

      const result = await filmsService.confirmReserve('reserveId', {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890'
      })

      expect(LeaseRepository.prototype.createLease).toHaveBeenCalledWith({
        film: mockReservation.film,
        reservation: mockReservation,
        customer: { name: 'John Doe', email: 'john@example.com', phone: '1234567890' },
        status: 'LEASED'
      })
      expect(result).toHaveProperty('status', 'LEASED')
    })

    it('should update reservation status after creating a lease', async () => {
      const mockReservation = { _id: 'reserveId', film: 'filmId' }
      ReserveFilmRepository.prototype.findById = jest.fn().mockResolvedValue(mockReservation)
      LeaseRepository.prototype.createLease = jest.fn().mockResolvedValue({
        _id: 'leaseId',
        status: 'LEASED'
      })
      ReserveFilmRepository.prototype.updateReserve = jest.fn().mockResolvedValue({})

      await filmsService.confirmReserve('reserveId', {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890'
      })

      expect(ReserveFilmRepository.prototype.updateReserve).toHaveBeenCalledWith(
        'reserveId',
        'LEASED'
      )
    })
  })

  describe('returnFilm', () => {
    it('should update the reservation status after returning a film', async () => {
      const mockLease = { _id: 'leaseId', status: 'LEASED', reservation: 'resId', save: jest.fn() }
      LeaseRepository.prototype.findById = jest.fn().mockResolvedValue(mockLease)
      ReserveFilmRepository.prototype.updateReserve = jest.fn().mockResolvedValue({})

      const returnedLease = await filmsService.returnFilm('leaseId')

      expect(mockLease.status).toEqual('RETURNED')
      expect(mockLease.save).toHaveBeenCalled()
      expect(ReserveFilmRepository.prototype.updateReserve).toHaveBeenCalledWith(
        'resId',
        'RETURNED'
      )
      expect(returnedLease).toBe(mockLease)
    })

    it('should handle errors when updating the reservation status', async () => {
      const mockLease = { _id: 'leaseId', status: 'LEASED', reservation: 'resId', save: jest.fn() }
      LeaseRepository.prototype.findById = jest.fn().mockResolvedValue(mockLease)
      ReserveFilmRepository.prototype.updateReserve = jest
        .fn()
        .mockRejectedValue(new Error('Failed to update reservation'))

      await expect(filmsService.returnFilm('leaseId')).rejects.toThrow(
        'Failed to update reservation'
      )

      expect(mockLease.save).toHaveBeenCalled() // Verifica se a operação de salvar ainda é chamada
    })

    it('should throw an error if the lease is not found', async () => {
      LeaseRepository.prototype.findById = jest.fn().mockResolvedValue(null)

      await expect(filmsService.returnFilm('leaseId')).rejects.toThrow(
        'Locação pendente não encontrada.'
      )
    })

    it('should throw an error if the lease is already returned', async () => {
      const mockLease = { _id: 'leaseId', status: 'RETURNED' }
      LeaseRepository.prototype.findById = jest.fn().mockResolvedValue(mockLease)

      await expect(filmsService.returnFilm('leaseId')).rejects.toThrow(
        'Locação já devolvida encontrada.'
      )
    })

    it('should process the return of a film if it is not already returned', async () => {
      const mockLease = { _id: '123', status: 'LEASED', reservation: 'res123' }
      LeaseRepository.prototype.findById = jest.fn().mockResolvedValue(mockLease)
      LeaseRepository.prototype.save = jest.fn()
      ReserveFilmRepository.prototype.updateReserve = jest.fn()

      const returnedLease = await filmsService.returnFilm('123')

      expect(returnedLease.status).toEqual('RETURNED')
      expect(LeaseRepository.prototype.save).toHaveBeenCalled()
      expect(ReserveFilmRepository.prototype.updateReserve).toHaveBeenCalledWith(
        'res123',
        'RETURNED'
      )
    })

    it('should update the lease status to RETURNED', async () => {
      const mockLease = { _id: 'leaseId', status: 'LEASED', save: jest.fn() }
      LeaseRepository.prototype.findById = jest.fn().mockResolvedValue(mockLease)
      ReserveFilmRepository.prototype.updateReserve = jest.fn().mockResolvedValue({})

      await filmsService.returnFilm('leaseId')

      expect(mockLease.status).toBe('RETURNED')
      expect(mockLease.save).toHaveBeenCalled()
      expect(ReserveFilmRepository.prototype.updateReserve).toHaveBeenCalledWith(
        mockLease.reservation,
        'RETURNED'
      )
    })
  })
})
