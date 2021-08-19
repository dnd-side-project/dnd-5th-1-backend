"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VpcStack = void 0;
const ec2 = require("@aws-cdk/aws-ec2");
const cdk = require("@aws-cdk/core");
class VpcStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        /**
         * Create a new VPC with single NAT Gateway
         */
        this.vpc = new ec2.Vpc(this, 'pickme-ecs-cdk-vpc', {
            cidr: '10.0.0.0/16',
            maxAzs: 2,
            subnetConfiguration: [
                {
                    name: 'pickme-public-subnet-1',
                    subnetType: ec2.SubnetType.PUBLIC,
                    cidrMask: 20,
                },
                {
                    name: 'pickme-isolated-subnet-1',
                    subnetType: ec2.SubnetType.ISOLATED,
                    cidrMask: 24,
                },
                {
                    name: 'pickme-private-subnet-1',
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
        });
        this.vpc.addInterfaceEndpoint('vpc-endpoint-ecr', {
            service: ec2.InterfaceVpcEndpointAwsService.ECR,
        });
        this.vpc.addInterfaceEndpoint('vpc-endpoint-ssm', {
            service: ec2.InterfaceVpcEndpointAwsService.SSM,
        });
        this.vpc.addInterfaceEndpoint('vpc-endpoint-secrets-manager', {
            service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
        });
        this.vpc.addInterfaceEndpoint('vpc-endpoint-cloudwatch', {
            service: ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH,
        });
    }
}
exports.VpcStack = VpcStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnBjLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidnBjLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdDQUF1QztBQUN2QyxxQ0FBb0M7QUFFcEMsTUFBYSxRQUFTLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFHckMsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUNsRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUN2Qjs7V0FFRztRQUNILElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxvQkFBb0IsRUFBRTtZQUNqRCxJQUFJLEVBQUUsYUFBYTtZQUNuQixNQUFNLEVBQUUsQ0FBQztZQUNULG1CQUFtQixFQUFFO2dCQUNuQjtvQkFDRSxJQUFJLEVBQUUsd0JBQXdCO29CQUM5QixVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNO29CQUNqQyxRQUFRLEVBQUUsRUFBRTtpQkFDYjtnQkFDRDtvQkFDRSxJQUFJLEVBQUUsMEJBQTBCO29CQUNoQyxVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRO29CQUNuQyxRQUFRLEVBQUUsRUFBRTtpQkFDYjtnQkFDRDtvQkFDRSxJQUFJLEVBQUUseUJBQXlCO29CQUMvQixVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPO29CQUNsQyxRQUFRLEVBQUUsRUFBRTtpQkFDYjthQUNGO1lBQ0QsV0FBVyxFQUFFLENBQUM7WUFDZCxnQkFBZ0IsRUFBRTtnQkFDaEIsc0JBQXNCLEVBQUU7b0JBQ3RCLE9BQU8sRUFBRSxHQUFHLENBQUMsNEJBQTRCLENBQUMsRUFBRTtvQkFDNUMsT0FBTyxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztpQkFDbEQ7YUFDRjtTQUNGLENBQUMsQ0FBQTtRQUVGLElBQUksQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsa0JBQWtCLEVBQUU7WUFDaEQsT0FBTyxFQUFFLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxHQUFHO1NBQ2hELENBQUMsQ0FBQTtRQUVGLElBQUksQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsa0JBQWtCLEVBQUU7WUFDaEQsT0FBTyxFQUFFLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxHQUFHO1NBQ2hELENBQUMsQ0FBQTtRQUVGLElBQUksQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsOEJBQThCLEVBQUU7WUFDNUQsT0FBTyxFQUFFLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxlQUFlO1NBQzVELENBQUMsQ0FBQTtRQUVGLElBQUksQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMseUJBQXlCLEVBQUU7WUFDdkQsT0FBTyxFQUFFLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxVQUFVO1NBQ3ZELENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRjtBQXJERCw0QkFxREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMidcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJ1xuXG5leHBvcnQgY2xhc3MgVnBjU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICByZWFkb25seSB2cGM6IGVjMi5WcGNcblxuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IFZQQyB3aXRoIHNpbmdsZSBOQVQgR2F0ZXdheVxuICAgICAqL1xuICAgIHRoaXMudnBjID0gbmV3IGVjMi5WcGModGhpcywgJ3BpY2ttZS1lY3MtY2RrLXZwYycsIHtcbiAgICAgIGNpZHI6ICcxMC4wLjAuMC8xNicsXG4gICAgICBtYXhBenM6IDIsXG4gICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAncGlja21lLXB1YmxpYy1zdWJuZXQtMScsXG4gICAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICAgIGNpZHJNYXNrOiAyMCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdwaWNrbWUtaXNvbGF0ZWQtc3VibmV0LTEnLFxuICAgICAgICAgIHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLklTT0xBVEVELFxuICAgICAgICAgIGNpZHJNYXNrOiAyNCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdwaWNrbWUtcHJpdmF0ZS1zdWJuZXQtMScsXG4gICAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFJJVkFURSxcbiAgICAgICAgICBjaWRyTWFzazogMjgsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgbmF0R2F0ZXdheXM6IDEsXG4gICAgICBnYXRld2F5RW5kcG9pbnRzOiB7XG4gICAgICAgICd2cGMtZ2F0ZXdheS1lbmRwb2ludCc6IHtcbiAgICAgICAgICBzZXJ2aWNlOiBlYzIuR2F0ZXdheVZwY0VuZHBvaW50QXdzU2VydmljZS5TMyxcbiAgICAgICAgICBzdWJuZXRzOiBbeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QUklWQVRFIH1dLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KVxuXG4gICAgdGhpcy52cGMuYWRkSW50ZXJmYWNlRW5kcG9pbnQoJ3ZwYy1lbmRwb2ludC1lY3InLCB7XG4gICAgICBzZXJ2aWNlOiBlYzIuSW50ZXJmYWNlVnBjRW5kcG9pbnRBd3NTZXJ2aWNlLkVDUixcbiAgICB9KVxuXG4gICAgdGhpcy52cGMuYWRkSW50ZXJmYWNlRW5kcG9pbnQoJ3ZwYy1lbmRwb2ludC1zc20nLCB7XG4gICAgICBzZXJ2aWNlOiBlYzIuSW50ZXJmYWNlVnBjRW5kcG9pbnRBd3NTZXJ2aWNlLlNTTSxcbiAgICB9KVxuXG4gICAgdGhpcy52cGMuYWRkSW50ZXJmYWNlRW5kcG9pbnQoJ3ZwYy1lbmRwb2ludC1zZWNyZXRzLW1hbmFnZXInLCB7XG4gICAgICBzZXJ2aWNlOiBlYzIuSW50ZXJmYWNlVnBjRW5kcG9pbnRBd3NTZXJ2aWNlLlNFQ1JFVFNfTUFOQUdFUixcbiAgICB9KVxuXG4gICAgdGhpcy52cGMuYWRkSW50ZXJmYWNlRW5kcG9pbnQoJ3ZwYy1lbmRwb2ludC1jbG91ZHdhdGNoJywge1xuICAgICAgc2VydmljZTogZWMyLkludGVyZmFjZVZwY0VuZHBvaW50QXdzU2VydmljZS5DTE9VRFdBVENILFxuICAgIH0pXG4gIH1cbn1cbiJdfQ==