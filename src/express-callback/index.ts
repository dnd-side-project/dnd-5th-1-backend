import express from 'express'

type ControllerType = (httpRequest: any) => Promise<any>

const makeExpressCallback = (controller: ControllerType) => {
  return (req: express.Request, res: express.Response) => {
    const httpRequest = {
      body: req.body,
      query: req.query,
      params: req.params,
      ip: req.ip,
      method: req.method,
      path: req.path,
      headers: {
        'Content-Type': req.get('Content-Type'),
        Referer: req.get('referer'),
        'User-Agent': req.get('User-Agent'),
      },
    }
    controller(httpRequest)
      .then((httpResponse) => {
        if (httpResponse.header) {
          res.set(httpResponse.header)
        }
        res.type('json')
        res.status(httpResponse.statusCode).send(httpResponse.body)
      })
      .catch((e) =>
        res.status(500).send({ error: 'An unkown error occurred.' })
      )
  }
}

// interface AuthenticationType{
//   "access-token": string,
//   "refresh-token": string
// }

// interface HeadersType {
//   'Content-Type'?: string,
//   Referer?: string,
//   'User-Agent'?: string
//   Authentication?: AuthenticationType
// }

// interface HttpRequestType {
//   body: string,
//   query: any,
//   params: any,
//   ip: string,
//   method: string,
//   path: string,
//   headers: HeadersType
// }

// interface HttpResponseType {
//   statusCode: number
//   headers?: HeadersType,
//   body?: any
//   redirect?: any
// }
