import * as ssm from '@aws-cdk/aws-ssm'
import * as cdk from '@aws-cdk/core'

export interface S3Credentials {
  S3_BUCKET_NAME: string
  ACCESS_KEY_ID: ssm.IStringParameter
  SECRET_ACCESS_KEY: ssm.IStringParameter
}

export interface AppCredentials {
  PORT: string
  JWT_SECRET: ssm.IStringParameter
}

interface PickmeCredentials {
  appCredentials: AppCredentials
  s3Credentials: S3Credentials
}

export class CredentialsStack extends cdk.Stack {
  readonly pickmeCredentials: PickmeCredentials

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // import App Credentials
    const appPort = ssm.StringParameter.fromStringParameterAttributes(
      this,
      '/pickme/port',
      {
        parameterName: '/pickme/port',
        simpleName: false,
      }
    )

    const appJwtSecret =
      ssm.StringParameter.fromSecureStringParameterAttributes(
        this,
        '/pickme/jwt_secret',
        { parameterName: '/pickme/jwt_secret', version: 1 }
      )

    const appCredentials: AppCredentials = {
      PORT: appPort.stringValue,
      JWT_SECRET: appJwtSecret,
    }

    // import S3 Credentials
    const s3BucketName = ssm.StringParameter.fromStringParameterAttributes(
      this,
      '/pickme/s3/bucket_name',
      {
        parameterName: '/pickme/s3/bucket_name',
        simpleName: false,
      }
    )

    const s3AccessKeyId =
      ssm.StringParameter.fromSecureStringParameterAttributes(
        this,
        '/pickme/s3/access_key_id',
        { parameterName: '/pickme/s3/access_key_id', version: 1 }
      )

    const s3SecretAccessKey =
      ssm.StringParameter.fromSecureStringParameterAttributes(
        this,
        '/pickme/s3/secret_access_key',
        { parameterName: '/pickme/s3/secret_access_key', version: 1 }
      )

    const s3Credentials: S3Credentials = {
      S3_BUCKET_NAME: s3BucketName.stringValue,
      ACCESS_KEY_ID: s3AccessKeyId,
      SECRET_ACCESS_KEY: s3SecretAccessKey,
    }

    this.pickmeCredentials = {
      appCredentials: appCredentials,
      s3Credentials: s3Credentials,
    }
  }
}
