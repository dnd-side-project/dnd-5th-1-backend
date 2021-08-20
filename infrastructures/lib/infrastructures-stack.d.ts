import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as rds from '@aws-cdk/aws-rds';
import { AppCredentials, S3Credentials } from './credentials-stack';
import { DbCredentials } from './rds-stack';
export interface BackendStackProps extends cdk.StackProps {
    vpc: ec2.Vpc;
    dbInstance: rds.DatabaseInstance;
    region: any;
    account: any;
    appCredentials: AppCredentials;
    s3Credentials: S3Credentials;
    dbCredentials: DbCredentials;
}
export declare class InfrastructuresStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: BackendStackProps);
}
