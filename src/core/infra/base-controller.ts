import * as express from 'express'

export abstract class BaseController {
  protected req!: express.Request
  protected res!: express.Response

  public abstract executeImpl(): Promise<void | any>

  public execute(req: express.Request, res: express.Response): void {
    this.req = req
    this.res = res

    this.executeImpl()
  }

  public static jsonResponse(
    res: express.Response,
    statusCode: number,
    message: string
  ) {
    return res.status(statusCode).json({ message })
  }

  public ok<T>(res: express.Response, statusCode: number, dto?: T) {
    if (dto) {
      return res.status(statusCode).json(dto)
    } else {
      return res.sendStatus(statusCode)
    }
  }

  public clientError(message?: string) {
    return BaseController.jsonResponse(
      this.res,
      400,
      message ? message : 'Unauthorized'
    )
  }

  public unauthorized(message?: string) {
    return BaseController.jsonResponse(
      this.res,
      401,
      message ? message : 'Unauthorized'
    )
  }

  public forbidden(message?: string) {
    return BaseController.jsonResponse(
      this.res,
      403,
      message ? message : 'Forbidden'
    )
  }

  public notFound(message?: string) {
    return BaseController.jsonResponse(
      this.res,
      404,
      message ? message : 'Not found'
    )
  }

  public alreadyExists(message?: string) {
    return BaseController.jsonResponse(
      this.res,
      400,
      message ? message : 'Data Already Exists'
    )
  }

  public todo() {
    return BaseController.jsonResponse(this.res, 400, 'TODO')
  }

  public fail(error: Error | string) {
    console.log(error)
    return this.res.status(500).json({
      message: error.toString(),
    })
  }
}
