exports.handleNoEndpoint = (request, response, next) => {
    const error = {
      status: 404,
      msg: 'Endpoint Does Not Exist'
    }
    next(error);
  }
  
  exports.handleNotFound = (error, request, response, next) => {
    if (error.status === 404){
      response.status(404).send(error)
    }
    else{
      next(error);
    }
  }