import * as ec2 from '@aws-cdk/aws-ec2'
import * as cdk from '@aws-cdk/core'

export class VpcStack extends cdk.Stack {
  readonly vpc: ec2.Vpc

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    /**
     * Create a new VPC with single NAT Gateway
     */
    this.vpc = new ec2.Vpc(this, 'picme-ecs-cdk-vpc', {
      cidr: '10.0.0.0/16',
      maxAzs: 2,
      subnetConfiguration: [
        {
          name: 'picme-public-subnet-1',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 20,
        },
        {
          name: 'picme-isolated-subnet-1',
          subnetType: ec2.SubnetType.ISOLATED,
          cidrMask: 24,
        },
        {
          name: 'picme-private-subnet-1',
          subnetType: ec2.SubnetType.PRIVATE,
          cidrMask: 28,
        },
      ],
      natGateways: 1,
      gatewayEndpoints: {
        'vpc-gateway-endpoint': {
          service: ec2.GatewayVpcEndpointAwsService.S3,
          subnets: [{ subnetType: ec2.SubnetType.PRIVATE }],
        },
      },
    })

    this.vpc.addInterfaceEndpoint('vpc-endpoint-ecr-docker', {
      service: ec2.InterfaceVpcEndpointAwsService.ECR_DOCKER,
      subnets: {
        availabilityZones: ['ap-northeast-2a'],
      },
    })

    this.vpc.addInterfaceEndpoint('vpc-endpoint-ecr', {
      service: ec2.InterfaceVpcEndpointAwsService.ECR,
      subnets: {
        availabilityZones: ['ap-northeast-2a'],
      },
    })

    this.vpc.addInterfaceEndpoint('vpc-endpoint-secrets-manager', {
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      subnets: {
        availabilityZones: ['ap-northeast-2a'],
      },
    })

    this.vpc.addInterfaceEndpoint('vpc-endpoint-cloudwatch', {
      service: ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS,
      subnets: {
        availabilityZones: ['ap-northeast-2a'],
      },
    })
  }
}
