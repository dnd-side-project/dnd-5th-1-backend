import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
export declare class VpcStack extends cdk.Stack {
    readonly vpc: ec2.Vpc;
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps);
}
