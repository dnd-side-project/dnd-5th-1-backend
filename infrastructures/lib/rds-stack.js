"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RdsStack = void 0;
const ec2 = require("@aws-cdk/aws-ec2");
const cdk = require("@aws-cdk/core");
const rds = require("@aws-cdk/aws-rds");
const aws_secretsmanager_1 = require("@aws-cdk/aws-secretsmanager");
class RdsStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        this.dbInstance = new rds.DatabaseInstance(this, 'db-instance', {
            vpc: props.vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.ISOLATED,
            },
            engine: rds.DatabaseInstanceEngine.mysql({
                version: rds.MysqlEngineVersion.VER_8_0_25,
            }),
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
            credentials: rds.Credentials.fromSecret(aws_secretsmanager_1.Secret.fromSecretPartialArn(this, 'db-credentials', 'arn:aws:secretsmanager:ap-northeast-2:369590600858:secret:db-credentials-WDSwf4')),
            multiAz: false,
            allocatedStorage: 20,
            maxAllocatedStorage: 1000,
            allowMajorVersionUpgrade: false,
            autoMinorVersionUpgrade: true,
            backupRetention: cdk.Duration.days(3),
            deleteAutomatedBackups: true,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            deletionProtection: false,
            databaseName: 'pickme_db',
            publiclyAccessible: false,
        });
        const dbSecrets = aws_secretsmanager_1.Secret.fromSecretPartialArn(this, 'db-secrets', 'arn:aws:secretsmanager:ap-northeast-2:369590600858:secret:db-credentials-WDSwf4');
        this.dbCredentials = {
            DB_HOST: this.dbInstance.dbInstanceEndpointAddress,
            DB_PORT: this.dbInstance.dbInstanceEndpointPort,
            DB_NAME: 'pickme_db',
            DB_USER: dbSecrets.secretValueFromJson('username'),
            DB_PASS: dbSecrets.secretValueFromJson('password'),
        };
        this.dbInstance.connections.allowDefaultPortInternally();
    }
}
exports.RdsStack = RdsStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmRzLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmRzLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdDQUF1QztBQUN2QyxxQ0FBb0M7QUFDcEMsd0NBQXVDO0FBQ3ZDLG9FQUFvRDtBQWNwRCxNQUFhLFFBQVMsU0FBUSxHQUFHLENBQUMsS0FBSztJQUlyQyxZQUFZLEtBQW9CLEVBQUUsRUFBVSxFQUFFLEtBQW9CO1FBQ2hFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBRXZCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUM5RCxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7WUFDZCxVQUFVLEVBQUU7Z0JBQ1YsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUTthQUNwQztZQUNELE1BQU0sRUFBRSxHQUFHLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDO2dCQUN2QyxPQUFPLEVBQUUsR0FBRyxDQUFDLGtCQUFrQixDQUFDLFVBQVU7YUFDM0MsQ0FBQztZQUNGLFlBQVksRUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FDL0IsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQ3BCLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUN2QjtZQUNELFdBQVcsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FDckMsMkJBQU0sQ0FBQyxvQkFBb0IsQ0FDekIsSUFBSSxFQUNKLGdCQUFnQixFQUNoQixpRkFBaUYsQ0FDbEYsQ0FDRjtZQUNELE9BQU8sRUFBRSxLQUFLO1lBQ2QsZ0JBQWdCLEVBQUUsRUFBRTtZQUNwQixtQkFBbUIsRUFBRSxJQUFJO1lBQ3pCLHdCQUF3QixFQUFFLEtBQUs7WUFDL0IsdUJBQXVCLEVBQUUsSUFBSTtZQUM3QixlQUFlLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLHNCQUFzQixFQUFFLElBQUk7WUFDNUIsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztZQUN4QyxrQkFBa0IsRUFBRSxLQUFLO1lBQ3pCLFlBQVksRUFBRSxXQUFXO1lBQ3pCLGtCQUFrQixFQUFFLEtBQUs7U0FDMUIsQ0FBQyxDQUFBO1FBRUYsTUFBTSxTQUFTLEdBQUcsMkJBQU0sQ0FBQyxvQkFBb0IsQ0FDM0MsSUFBSSxFQUNKLFlBQVksRUFDWixpRkFBaUYsQ0FDbEYsQ0FBQTtRQUVELElBQUksQ0FBQyxhQUFhLEdBQUc7WUFDbkIsT0FBTyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMseUJBQXlCO1lBQ2xELE9BQU8sRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLHNCQUFzQjtZQUMvQyxPQUFPLEVBQUUsV0FBVztZQUNwQixPQUFPLEVBQUUsU0FBUyxDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQztZQUNsRCxPQUFPLEVBQUUsU0FBUyxDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQztTQUNuRCxDQUFBO1FBRUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsMEJBQTBCLEVBQUUsQ0FBQTtJQUMxRCxDQUFDO0NBQ0Y7QUF2REQsNEJBdURDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSdcbmltcG9ydCAqIGFzIHJkcyBmcm9tICdAYXdzLWNkay9hd3MtcmRzJ1xuaW1wb3J0IHsgU2VjcmV0IH0gZnJvbSAnQGF3cy1jZGsvYXdzLXNlY3JldHNtYW5hZ2VyJ1xuXG5leHBvcnQgaW50ZXJmYWNlIERiQ3JlZGVudGlhbHMge1xuICBEQl9IT1NUOiBzdHJpbmdcbiAgREJfUE9SVDogc3RyaW5nXG4gIERCX05BTUU6IHN0cmluZ1xuICBEQl9VU0VSOiBjZGsuU2VjcmV0VmFsdWVcbiAgREJfUEFTUzogY2RrLlNlY3JldFZhbHVlXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmRzU3RhY2tQcm9wcyBleHRlbmRzIGNkay5TdGFja1Byb3BzIHtcbiAgdnBjOiBlYzIuVnBjXG59XG5cbmV4cG9ydCBjbGFzcyBSZHNTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIHJlYWRvbmx5IGRiSW5zdGFuY2U6IHJkcy5EYXRhYmFzZUluc3RhbmNlXG4gIHJlYWRvbmx5IGRiQ3JlZGVudGlhbHM6IERiQ3JlZGVudGlhbHNcblxuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFJkc1N0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKVxuXG4gICAgdGhpcy5kYkluc3RhbmNlID0gbmV3IHJkcy5EYXRhYmFzZUluc3RhbmNlKHRoaXMsICdkYi1pbnN0YW5jZScsIHtcbiAgICAgIHZwYzogcHJvcHMudnBjLFxuICAgICAgdnBjU3VibmV0czoge1xuICAgICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5JU09MQVRFRCxcbiAgICAgIH0sXG4gICAgICBlbmdpbmU6IHJkcy5EYXRhYmFzZUluc3RhbmNlRW5naW5lLm15c3FsKHtcbiAgICAgICAgdmVyc2lvbjogcmRzLk15c3FsRW5naW5lVmVyc2lvbi5WRVJfOF8wXzI1LFxuICAgICAgfSksXG4gICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoXG4gICAgICAgIGVjMi5JbnN0YW5jZUNsYXNzLlQyLFxuICAgICAgICBlYzIuSW5zdGFuY2VTaXplLk1JQ1JPXG4gICAgICApLFxuICAgICAgY3JlZGVudGlhbHM6IHJkcy5DcmVkZW50aWFscy5mcm9tU2VjcmV0KFxuICAgICAgICBTZWNyZXQuZnJvbVNlY3JldFBhcnRpYWxBcm4oXG4gICAgICAgICAgdGhpcyxcbiAgICAgICAgICAnZGItY3JlZGVudGlhbHMnLFxuICAgICAgICAgICdhcm46YXdzOnNlY3JldHNtYW5hZ2VyOmFwLW5vcnRoZWFzdC0yOjM2OTU5MDYwMDg1ODpzZWNyZXQ6ZGItY3JlZGVudGlhbHMtV0RTd2Y0J1xuICAgICAgICApXG4gICAgICApLFxuICAgICAgbXVsdGlBejogZmFsc2UsXG4gICAgICBhbGxvY2F0ZWRTdG9yYWdlOiAyMCxcbiAgICAgIG1heEFsbG9jYXRlZFN0b3JhZ2U6IDEwMDAsXG4gICAgICBhbGxvd01ham9yVmVyc2lvblVwZ3JhZGU6IGZhbHNlLFxuICAgICAgYXV0b01pbm9yVmVyc2lvblVwZ3JhZGU6IHRydWUsXG4gICAgICBiYWNrdXBSZXRlbnRpb246IGNkay5EdXJhdGlvbi5kYXlzKDMpLFxuICAgICAgZGVsZXRlQXV0b21hdGVkQmFja3VwczogdHJ1ZSxcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICBkZWxldGlvblByb3RlY3Rpb246IGZhbHNlLFxuICAgICAgZGF0YWJhc2VOYW1lOiAncGlja21lX2RiJyxcbiAgICAgIHB1YmxpY2x5QWNjZXNzaWJsZTogZmFsc2UsXG4gICAgfSlcblxuICAgIGNvbnN0IGRiU2VjcmV0cyA9IFNlY3JldC5mcm9tU2VjcmV0UGFydGlhbEFybihcbiAgICAgIHRoaXMsXG4gICAgICAnZGItc2VjcmV0cycsXG4gICAgICAnYXJuOmF3czpzZWNyZXRzbWFuYWdlcjphcC1ub3J0aGVhc3QtMjozNjk1OTA2MDA4NTg6c2VjcmV0OmRiLWNyZWRlbnRpYWxzLVdEU3dmNCdcbiAgICApXG5cbiAgICB0aGlzLmRiQ3JlZGVudGlhbHMgPSB7XG4gICAgICBEQl9IT1NUOiB0aGlzLmRiSW5zdGFuY2UuZGJJbnN0YW5jZUVuZHBvaW50QWRkcmVzcyxcbiAgICAgIERCX1BPUlQ6IHRoaXMuZGJJbnN0YW5jZS5kYkluc3RhbmNlRW5kcG9pbnRQb3J0LFxuICAgICAgREJfTkFNRTogJ3BpY2ttZV9kYicsXG4gICAgICBEQl9VU0VSOiBkYlNlY3JldHMuc2VjcmV0VmFsdWVGcm9tSnNvbigndXNlcm5hbWUnKSxcbiAgICAgIERCX1BBU1M6IGRiU2VjcmV0cy5zZWNyZXRWYWx1ZUZyb21Kc29uKCdwYXNzd29yZCcpLFxuICAgIH1cblxuICAgIHRoaXMuZGJJbnN0YW5jZS5jb25uZWN0aW9ucy5hbGxvd0RlZmF1bHRQb3J0SW50ZXJuYWxseSgpXG4gIH1cbn1cbiJdfQ==