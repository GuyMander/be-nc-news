exports.handleNoEndpoint = (request, response, next) => {
    const error = {
      status: 404,
      msg: 'Endpoint Does Not Exist'
    }
    next(error);
  }
  
  exports.handleCustomErrors = (error, request, response, next) => {
    if (error.status === 404){
      response.status(404).send(error)
    }
    else{
      next(error);
    }
  }

  exports.handlePsqlErrors = (error, request, response, next) => {
    if (error.status === 400){
        response.status(400).send(error)
    }
    else{
        next(error)
    }
  }

  exports.handleServerErrors = (error, request, response, next) => {
    const errorOutputObj = {status :500, msg: 'Internal Server Error'}
    response.status(500).send(errorOutputObj);
  }