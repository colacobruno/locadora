const { route } = require('simple-node-framework').Singleton
const { ControllerFactory } = require('simple-node-framework')
const server = require('../../../index')
const Controller = require('./controller')

const { full } = route.info(__filename)

server.post(`${full}/`, ControllerFactory.build(Controller, 'createFilm'))
server.get(`${full}/`, ControllerFactory.build(Controller, 'findFilms'))
server.put(`${full}/:id`, ControllerFactory.build(Controller, 'updateFilm'))
server.delete(`${full}/:id`, ControllerFactory.build(Controller, 'deleteFilm'));

server.post(`${full}/reserve`, ControllerFactory.build(Controller, 'reserveFilm'));

server.post(`${full}/confirm`, ControllerFactory.build(Controller, 'confirmReserve')); 

server.post(`${full}/return`, ControllerFactory.build(Controller, 'returnFilm'));
