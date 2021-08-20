import * as cdk from '@aws-cdk/core'
import * as iam from '@aws-cdk/aws-iam'

export interface S3Credentials {
  S3_BUCKET_NAME: string
  ACCESS_KEY_ID: ssm.IStringParameter
  SECRET_ACCESS_KEY: ssm.IStringParameter
}

export class S3Stack extends cdk.Stack {
  readonly s3Credentilas: S3Credentials

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const s3Bucket = new S3({})

    const s3IamRole = new iam.Role(this, 's3-post-image-upload', {
      roleName: 's3-role-post-image-upload',
      assumedBy: new iam.ServicePrincipal('s3.amazonaws.com'),
    })

    create
  }
}
