const FilmsController = require('../controller')

jest.mock('../service/FilmsService', () => {
  return jest.fn().mockImplementation(() => {
    return {
      createFilm: jest.fn(),
      updateFilm: jest.fn(),
      deleteFilm: jest.fn(),
      findFilms: jest.fn()
    }
  })
})
const makeSUT = () => new FilmsController()

describe('FilmsController', () => {
  describe('routes', () => {
    test('should create a film successfully', async () => {
      const sut = makeSUT()

      const service = jest.spyOn(sut.filmsService, 'createFilm').mockResolvedValue()

      const req = { body: { name: 'Film 1', synopsis: 'Synopsis', rating: 5 } }
      const res = { json: jest.fn() }
      const next = jest.fn()
      await sut.createFilm(req, res, next)

      expect(service).toHaveBeenCalledWith({ name: 'Film 1', synopsis: 'Synopsis', rating: 5 })
      expect(res.json).toHaveBeenCalledWith()
      expect(next).toHaveBeenCalledWith()
    })

    test('should update a film successfully', async () => {
      const sut = makeSUT()

      const service = jest.spyOn(sut.filmsService, 'updateFilm').mockResolvedValue()

      const req = {
        params: { id: '1' },
        body: { name: 'Updated Film', synopsis: 'Updated synopsis', rating: 5 }
      }
      const res = { json: jest.fn() }
      const next = jest.fn()
      await sut.updateFilm(req, res, next)

      expect(service).toHaveBeenCalledWith({
        id: '1',
        name: 'Updated Film',
        synopsis: 'Updated synopsis',
        rating: 5
      })
      expect(res.json).toHaveBeenCalledWith()
      expect(next).toHaveBeenCalledWith()
    })

    test('should delete a film successfully', async () => {
      const sut = makeSUT()

      const service = jest.spyOn(sut.filmsService, 'deleteFilm').mockResolvedValue()

      const req = { params: { id: '1' } }
      const res = { send: jest.fn() }
      const next = jest.fn()
      await sut.deleteFilm(req, res, next)

      expect(service).toHaveBeenCalledWith('1')
      expect(res.send).toHaveBeenCalledWith(204)
      expect(next).toHaveBeenCalledWith()
    })

    test('should find films successfully', async () => {
      const sut = makeSUT()

      const mockFilms = [{ name: 'Film 1' }, { name: 'Film 2' }]
      const service = jest.spyOn(sut.filmsService, 'findFilms').mockResolvedValue(mockFilms)

      const req = {}
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      const next = jest.fn()

      await sut.findFilms(req, res, next)

      expect(service).toHaveBeenCalledWith()
      expect(res.json).toHaveBeenCalledWith(mockFilms)
      expect(next).toHaveBeenCalledWith()
    })
  })
})
