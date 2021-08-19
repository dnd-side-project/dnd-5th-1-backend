import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as rds from '@aws-cdk/aws-rds';
export interface DbCredentials {
    DB_HOST: string;
    DB_PORT: string;
    DB_NAME: string;
    DB_USER: cdk.SecretValue;
    DB_PASS: cdk.SecretValue;
}
export interface RdsStackProps extends cdk.StackProps {
    vpc: ec2.Vpc;
}
export declare class RdsStack extends cdk.Stack {
    readonly dbInstance: rds.DatabaseInstance;
    readonly dbCredentials: DbCredentials;
    constructor(scope: cdk.Construct, id: string, props: RdsStackProps);
}
