import * as ssm from '@aws-cdk/aws-ssm';
import * as cdk from '@aws-cdk/core';
export interface S3Credentials {
    S3_BUCKET_NAME: string;
    ACCESS_KEY_ID: ssm.IStringParameter;
    SECRET_ACCESS_KEY: ssm.IStringParameter;
}
export interface AppCredentials {
    PORT: string;
    JWT_SECRET: ssm.IStringParameter;
}
interface PickmeCredentials {
    appCredentials: AppCredentials;
    s3Credentials: S3Credentials;
}
export declare class CredentialsStack extends cdk.Stack {
    readonly pickmeCredentials: PickmeCredentials;
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps);
}
export {};
