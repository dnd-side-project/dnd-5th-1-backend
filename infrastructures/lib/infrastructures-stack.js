"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfrastructuresStack = void 0;
const cdk = require("@aws-cdk/core");
const ecr = require("@aws-cdk/aws-ecr");
const ecs = require("@aws-cdk/aws-ecs");
const ecs_patterns = require("@aws-cdk/aws-ecs-patterns");
const iam = require("@aws-cdk/aws-iam");
const codebuild = require("@aws-cdk/aws-codebuild");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const codepipeline_actions = require("@aws-cdk/aws-codepipeline-actions");
const ssm = require("@aws-cdk/aws-ssm");
class InfrastructuresStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const clusterAdmin = new iam.Role(this, 'PickmeAdminRole', {
            assumedBy: new iam.AccountRootPrincipal(),
        });
        const cluster = new ecs.Cluster(this, 'pickme-ecs-cluster', {
            vpc: props.vpc,
        });
        const logging = new ecs.AwsLogDriver({
            streamPrefix: 'pickme-ecs-logs',
        });
        const taskRole = new iam.Role(this, `pickme-ecs-taskRole-${this.stackName}`, {
            roleName: `ecs-taskRole-${this.stackName}`,
            assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
        });
        // ECR - repo
        const ecrRepo = ecr.Repository.fromRepositoryName(this, 'pickme-backend-ecr-repo', 'pickme-backend-ecr-repo');
        // ***ECS Contructs***
        const executionRolePolicy = new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            resources: ['*'],
            actions: [
                'ecr:GetAuthorizationToken',
                'ecr:BatchCheckLayerAvailability',
                'ecr:GetDownloadUrlForLayer',
                'ecr:BatchGetImage',
                'logs:CreateLogStream',
                'logs:PutLogEvents',
            ],
        });
        const taskDef = new ecs.FargateTaskDefinition(this, 'pickme-ecs-taskdef', {
            taskRole: taskRole,
        });
        taskDef.addToExecutionRolePolicy(executionRolePolicy);
        const container = taskDef.addContainer('pickme-app', {
            // tag: latest
            image: ecs.ContainerImage.fromEcrRepository(ecrRepo),
            secrets: {
                JWT_SECRET: ecs.Secret.fromSsmParameter(props.appCredentials.JWT_SECRET),
                ACCESS_KEY_ID: ecs.Secret.fromSsmParameter(props.s3Credentials.ACCESS_KEY_ID),
                SECRET_ACCESS_KEY: ecs.Secret.fromSsmParameter(props.s3Credentials.SECRET_ACCESS_KEY),
                DB_USER: ecs.Secret.fromSsmParameter(ssm.StringParameter.fromSecureStringParameterAttributes(this, '/pickme/mysql/db_username', { parameterName: '/pickme/mysql/db_username', version: 1 })),
                DB_PASS: ecs.Secret.fromSsmParameter(ssm.StringParameter.fromSecureStringParameterAttributes(this, '/pickme/mysql/db_password', { parameterName: '/pickme/mysql/db_password', version: 1 })),
            },
            environment: {
                NODE_ENV: 'production',
                PORT: props.appCredentials.PORT,
                S3_BUCKET_NAME: props.s3Credentials.S3_BUCKET_NAME,
                DB_HOST: props.dbCredentials.DB_HOST,
                DB_PORT: props.dbCredentials.DB_PORT,
                DB_NAME: props.dbCredentials.DB_NAME,
            },
            logging,
        });
        container.addPortMappings({
            containerPort: 3000,
            protocol: ecs.Protocol.TCP,
        });
        const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'pickme-ecs-service', {
            cluster: cluster,
            taskDefinition: taskDef,
            publicLoadBalancer: true,
            desiredCount: 1,
            listenerPort: 80,
        });
        const scaling = fargateService.service.autoScaleTaskCount({
            maxCapacity: 2,
        });
        // props.dbInstance.connections.allowFrom(
        //   fargateService.service,
        //   ec2.Port.tcp(+props.dbInstance.dbInstanceEndpointPort)
        // )
        // scaling.scaleOnCpuUtilization('CpuScaling', {
        //   targetUtilizationPercent: 10,
        //   scaleInCooldown: cdk.Duration.seconds(60),
        //   scaleOutCooldown: cdk.Duration.seconds(60),
        // })
        // ***PIPELINE CONSTRUCTS***
        const gitHubSource = codebuild.Source.gitHub({
            owner: 'dnd-side-project',
            repo: 'dnd-5th-1-backend',
            webhook: true,
            webhookFilters: [
                codebuild.FilterGroup.inEventOf(codebuild.EventAction.PULL_REQUEST_MERGED).andBranchIs('main'),
            ],
        });
        // CODEBUILD - project
        const project = new codebuild.Project(this, 'PickmeCodeBuildProject', {
            projectName: `${this.stackName}`,
            source: gitHubSource,
            environment: {
                buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_2,
                privileged: true,
            },
            environmentVariables: {
                CLUSTER_NAME: {
                    value: `${cluster.clusterName}`,
                },
                ECR_REPO_URI: {
                    value: `${ecrRepo.repositoryUri}`,
                },
            },
            buildSpec: codebuild.BuildSpec.fromObject({
                version: '0.2',
                phases: {
                    pre_build: {
                        commands: [
                            'env',
                            'export TAG=${CODEBUILD_RESOLVED_SOURCE_VERSION}',
                        ],
                    },
                    build: {
                        commands: [
                            'echo Build started on `date`',
                            `docker build -t $ECR_REPO_URI:$TAG .`,
                            '$(aws ecr get-login --no-include-email)',
                            'docker push $ECR_REPO_URI:$TAG',
                        ],
                    },
                    post_build: {
                        commands: [
                            'echo "In Post-Build Stage"',
                            'printf \'[{"name":"pickme-app","imageUri":"%s"}]\' $ECR_REPO_URI:$TAG > imagedefinitions.json',
                            'pwd; ls -al; cat imagedefinitions.json',
                            'echo Build completed on `date`',
                        ],
                    },
                },
                artifacts: {
                    files: ['imagedefinitions.json'],
                },
            }),
        });
        // ***PIPELINE ACTIONS***
        const sourceOutput = new codepipeline.Artifact();
        const buildOutput = new codepipeline.Artifact();
        const sourceAction = new codepipeline_actions.GitHubSourceAction({
            actionName: 'GitHub_Source',
            owner: 'dnd-side-project',
            repo: 'dnd-5th-1-backend',
            branch: 'main',
            oauthToken: cdk.SecretValue.secretsManager('github-token'),
            output: sourceOutput,
        });
        const buildAction = new codepipeline_actions.CodeBuildAction({
            actionName: 'CodeBuild',
            project: project,
            input: sourceOutput,
            outputs: [buildOutput],
        });
        const manualApprovalAction = new codepipeline_actions.ManualApprovalAction({
            actionName: 'Approve',
        });
        const deployAction = new codepipeline_actions.EcsDeployAction({
            actionName: 'DeployAction',
            service: fargateService.service,
            imageFile: new codepipeline.ArtifactPath(buildOutput, `imagedefinitions.json`),
        });
        // PIPELINE STAGES
        new codepipeline.Pipeline(this, 'PickmeECSPipeline', {
            stages: [
                {
                    stageName: 'Source',
                    actions: [sourceAction],
                },
                {
                    stageName: 'Build',
                    actions: [buildAction],
                },
                {
                    stageName: 'Approve',
                    actions: [manualApprovalAction],
                },
                {
                    stageName: 'Deploy-to-ECS',
                    actions: [deployAction],
                },
            ],
        });
        ecrRepo.grantPullPush(project.role);
        project.addToRolePolicy(new iam.PolicyStatement({
            actions: [
                'ecs:DescribeCluster',
                'ecr:GetAuthorizationToken',
                'ecr:BatchCheckLayerAvailability',
                'ecr:BatchGetImage',
                'ecr:GetDownloadUrlForLayer',
            ],
            resources: [`${cluster.clusterArn}`],
        }));
        //OUTPUT
        new cdk.CfnOutput(this, 'LoadBalancerDNS', {
            value: fargateService.loadBalancer.loadBalancerDnsName,
        });
    }
}
exports.InfrastructuresStack = InfrastructuresStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mcmFzdHJ1Y3R1cmVzLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW5mcmFzdHJ1Y3R1cmVzLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFvQztBQUVwQyx3Q0FBdUM7QUFDdkMsd0NBQXVDO0FBRXZDLDBEQUF5RDtBQUN6RCx3Q0FBdUM7QUFDdkMsb0RBQW1EO0FBQ25ELDBEQUF5RDtBQUN6RCwwRUFBeUU7QUFDekUsd0NBQXVDO0FBZXZDLE1BQWEsb0JBQXFCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDakQsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUF3QjtRQUNwRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUV2QixNQUFNLFlBQVksR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO1lBQ3pELFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRTtTQUMxQyxDQUFDLENBQUE7UUFFRixNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFFO1lBQzFELEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztTQUNmLENBQUMsQ0FBQTtRQUVGLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQztZQUNuQyxZQUFZLEVBQUUsaUJBQWlCO1NBQ2hDLENBQUMsQ0FBQTtRQUVGLE1BQU0sUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FDM0IsSUFBSSxFQUNKLHVCQUF1QixJQUFJLENBQUMsU0FBUyxFQUFFLEVBQ3ZDO1lBQ0UsUUFBUSxFQUFFLGdCQUFnQixJQUFJLENBQUMsU0FBUyxFQUFFO1lBQzFDLFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyx5QkFBeUIsQ0FBQztTQUMvRCxDQUNGLENBQUE7UUFF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QUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUN6QyxLQUFLLEVBQUUsY0FBYyxDQUFDLFlBQVksQ0FBQyxtQkFBbUI7U0FDdkQsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGO0FBclFELG9EQXFRQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJ1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInXG5pbXBvcnQgKiBhcyBlY3IgZnJvbSAnQGF3cy1jZGsvYXdzLWVjcidcbmltcG9ydCAqIGFzIGVjcyBmcm9tICdAYXdzLWNkay9hd3MtZWNzJ1xuaW1wb3J0ICogYXMgcmRzIGZyb20gJ0Bhd3MtY2RrL2F3cy1yZHMnXG5pbXBvcnQgKiBhcyBlY3NfcGF0dGVybnMgZnJvbSAnQGF3cy1jZGsvYXdzLWVjcy1wYXR0ZXJucydcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJ1xuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlYnVpbGQnXG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZSdcbmltcG9ydCAqIGFzIGNvZGVwaXBlbGluZV9hY3Rpb25zIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUtYWN0aW9ucydcbmltcG9ydCAqIGFzIHNzbSBmcm9tICdAYXdzLWNkay9hd3Mtc3NtJ1xuXG5pbXBvcnQgeyBBcHBDcmVkZW50aWFscywgUzNDcmVkZW50aWFscyB9IGZyb20gJy4vY3JlZGVudGlhbHMtc3RhY2snXG5pbXBvcnQgeyBEYkNyZWRlbnRpYWxzIH0gZnJvbSAnLi9yZHMtc3RhY2snXG5cbmV4cG9ydCBpbnRlcmZhY2UgQmFja2VuZFN0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XG4gIHZwYzogZWMyLlZwY1xuICBkYkluc3RhbmNlOiByZHMuRGF0YWJhc2VJbnN0YW5jZVxuICByZWdpb246IGFueVxuICBhY2NvdW50OiBhbnlcbiAgYXBwQ3JlZGVudGlhbHM6IEFwcENyZWRlbnRpYWxzXG4gIHMzQ3JlZGVudGlhbHM6IFMzQ3JlZGVudGlhbHNcbiAgZGJDcmVkZW50aWFsczogRGJDcmVkZW50aWFsc1xufVxuXG5leHBvcnQgY2xhc3MgSW5mcmFzdHJ1Y3R1cmVzU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEJhY2tlbmRTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcylcblxuICAgIGNvbnN0IGNsdXN0ZXJBZG1pbiA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnUGlja21lQWRtaW5Sb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLkFjY291bnRSb290UHJpbmNpcGFsKCksXG4gICAgfSlcblxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIodGhpcywgJ3BpY2ttZS1lY3MtY2x1c3RlcicsIHtcbiAgICAgIHZwYzogcHJvcHMudnBjLFxuICAgIH0pXG5cbiAgICBjb25zdCBsb2dnaW5nID0gbmV3IGVjcy5Bd3NMb2dEcml2ZXIoe1xuICAgICAgc3RyZWFtUHJlZml4OiAncGlja21lLWVjcy1sb2dzJyxcbiAgICB9KVxuXG4gICAgY29uc3QgdGFza1JvbGUgPSBuZXcgaWFtLlJvbGUoXG4gICAgICB0aGlzLFxuICAgICAgYHBpY2ttZS1lY3MtdGFza1JvbGUtJHt0aGlzLnN0YWNrTmFtZX1gLFxuICAgICAge1xuICAgICAgICByb2xlTmFtZTogYGVjcy10YXNrUm9sZS0ke3RoaXMuc3RhY2tOYW1lfWAsXG4gICAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdlY3MtdGFza3MuYW1hem9uYXdzLmNvbScpLFxuICAgICAgfVxuICAgIClcblxuICAgIC8vIEVDUiAtIHJlcG9cbiAgICBjb25zdCBlY3JSZXBvID0gZWNyLlJlcG9zaXRvcnkuZnJvbVJlcG9zaXRvcnlOYW1lKFxuICAgICAgdGhpcyxcbiAgICAgICdwaWNrbWUtYmFja2VuZC1lY3ItcmVwbycsXG4gICAgICAncGlja21lLWJhY2tlbmQtZWNyLXJlcG8nXG4gICAgKVxuXG4gICAgLy8gKioqRUNTIENvbnRydWN0cyoqKlxuICAgIGNvbnN0IGV4ZWN1dGlvblJvbGVQb2xpY3kgPSBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgYWN0aW9uczogW1xuICAgICAgICAnZWNyOkdldEF1dGhvcml6YXRpb25Ub2tlbicsXG4gICAgICAgICdlY3I6QmF0Y2hDaGVja0xheWVyQXZhaWxhYmlsaXR5JyxcbiAgICAgICAgJ2VjcjpHZXREb3dubG9hZFVybEZvckxheWVyJyxcbiAgICAgICAgJ2VjcjpCYXRjaEdldEltYWdlJyxcbiAgICAgICAgJ2xvZ3M6Q3JlYXRlTG9nU3RyZWFtJyxcbiAgICAgICAgJ2xvZ3M6UHV0TG9nRXZlbnRzJyxcbiAgICAgIF0sXG4gICAgfSlcblxuICAgIGNvbnN0IHRhc2tEZWYgPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbih0aGlzLCAncGlja21lLWVjcy10YXNrZGVmJywge1xuICAgICAgdGFza1JvbGU6IHRhc2tSb2xlLFxuICAgIH0pXG5cbiAgICB0YXNrRGVmLmFkZFRvRXhlY3V0aW9uUm9sZVBvbGljeShleGVjdXRpb25Sb2xlUG9saWN5KVxuXG4gICAgY29uc3QgY29udGFpbmVyID0gdGFza0RlZi5hZGRDb250YWluZXIoJ3BpY2ttZS1hcHAnLCB7XG4gICAgICAvLyB0YWc6IGxhdGVzdFxuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tRWNyUmVwb3NpdG9yeShlY3JSZXBvKSxcbiAgICAgIHNlY3JldHM6IHtcbiAgICAgICAgSldUX1NFQ1JFVDogZWNzLlNlY3JldC5mcm9tU3NtUGFyYW1ldGVyKFxuICAgICAgICAgIHByb3BzLmFwcENyZWRlbnRpYWxzLkpXVF9TRUNSRVRcbiAgICAgICAgKSxcbiAgICAgICAgQUNDRVNTX0tFWV9JRDogZWNzLlNlY3JldC5mcm9tU3NtUGFyYW1ldGVyKFxuICAgICAgICAgIHByb3BzLnMzQ3JlZGVudGlhbHMuQUNDRVNTX0tFWV9JRFxuICAgICAgICApLFxuICAgICAgICBTRUNSRVRfQUNDRVNTX0tFWTogZWNzLlNlY3JldC5mcm9tU3NtUGFyYW1ldGVyKFxuICAgICAgICAgIHByb3BzLnMzQ3JlZGVudGlhbHMuU0VDUkVUX0FDQ0VTU19LRVlcbiAgICAgICAgKSxcbiAgICAgICAgREJfVVNFUjogZWNzLlNlY3JldC5mcm9tU3NtUGFyYW1ldGVyKFxuICAgICAgICAgIHNzbS5TdHJpbmdQYXJhbWV0ZXIuZnJvbVNlY3VyZVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMoXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgJy9waWNrbWUvbXlzcWwvZGJfdXNlcm5hbWUnLFxuICAgICAgICAgICAgeyBwYXJhbWV0ZXJOYW1lOiAnL3BpY2ttZS9teXNxbC9kYl91c2VybmFtZScsIHZlcnNpb246IDEgfVxuICAgICAgICAgIClcbiAgICAgICAgKSxcbiAgICAgICAgREJfUEFTUzogZWNzLlNlY3JldC5mcm9tU3NtUGFyYW1ldGVyKFxuICAgICAgICAgIHNzbS5TdHJpbmdQYXJhbWV0ZXIuZnJvbVNlY3VyZVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMoXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgJy9waWNrbWUvbXlzcWwvZGJfcGFzc3dvcmQnLFxuICAgICAgICAgICAgeyBwYXJhbWV0ZXJOYW1lOiAnL3BpY2ttZS9teXNxbC9kYl9wYXNzd29yZCcsIHZlcnNpb246IDEgfVxuICAgICAgICAgIClcbiAgICAgICAgKSxcbiAgICAgIH0sXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBOT0RFX0VOVjogJ3Byb2R1Y3Rpb24nLFxuICAgICAgICBQT1JUOiBwcm9wcy5hcHBDcmVkZW50aWFscy5QT1JULFxuICAgICAgICBTM19CVUNLRVRfTkFNRTogcHJvcHMuczNDcmVkZW50aWFscy5TM19CVUNLRVRfTkFNRSxcbiAgICAgICAgREJfSE9TVDogcHJvcHMuZGJDcmVkZW50aWFscy5EQl9IT1NULFxuICAgICAgICBEQl9QT1JUOiBwcm9wcy5kYkNyZWRlbnRpYWxzLkRCX1BPUlQsXG4gICAgICAgIERCX05BTUU6IHByb3BzLmRiQ3JlZGVudGlhbHMuREJfTkFNRSxcbiAgICAgIH0sXG4gICAgICBsb2dnaW5nLFxuICAgIH0pXG5cbiAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHtcbiAgICAgIGNvbnRhaW5lclBvcnQ6IDMwMDAsXG4gICAgICBwcm90b2NvbDogZWNzLlByb3RvY29sLlRDUCxcbiAgICB9KVxuXG4gICAgY29uc3QgZmFyZ2F0ZVNlcnZpY2UgPVxuICAgICAgbmV3IGVjc19wYXR0ZXJucy5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlZEZhcmdhdGVTZXJ2aWNlKFxuICAgICAgICB0aGlzLFxuICAgICAgICAncGlja21lLWVjcy1zZXJ2aWNlJyxcbiAgICAgICAge1xuICAgICAgICAgIGNsdXN0ZXI6IGNsdXN0ZXIsXG4gICAgICAgICAgdGFza0RlZmluaXRpb246IHRhc2tEZWYsXG4gICAgICAgICAgcHVibGljTG9hZEJhbGFuY2VyOiB0cnVlLFxuICAgICAgICAgIGRlc2lyZWRDb3VudDogMSxcbiAgICAgICAgICBsaXN0ZW5lclBvcnQ6IDgwLFxuICAgICAgICB9XG4gICAgICApXG5cbiAgICBjb25zdCBzY2FsaW5nID0gZmFyZ2F0ZVNlcnZpY2Uuc2VydmljZS5hdXRvU2NhbGVUYXNrQ291bnQoe1xuICAgICAgbWF4Q2FwYWNpdHk6IDIsXG4gICAgfSlcblxuICAgIC8vIHByb3BzLmRiSW5zdGFuY2UuY29ubmVjdGlvbnMuYWxsb3dGcm9tKFxuICAgIC8vICAgZmFyZ2F0ZVNlcnZpY2Uuc2VydmljZSxcbiAgICAvLyAgIGVjMi5Qb3J0LnRjcCgrcHJvcHMuZGJJbnN0YW5jZS5kYkluc3RhbmNlRW5kcG9pbnRQb3J0KVxuICAgIC8vIClcblxuICAgIC8vIHNjYWxpbmcuc2NhbGVPbkNwdVV0aWxpemF0aW9uKCdDcHVTY2FsaW5nJywge1xuICAgIC8vICAgdGFyZ2V0VXRpbGl6YXRpb25QZXJjZW50OiAxMCxcbiAgICAvLyAgIHNjYWxlSW5Db29sZG93bjogY2RrLkR1cmF0aW9uLnNlY29uZHMoNjApLFxuICAgIC8vICAgc2NhbGVPdXRDb29sZG93bjogY2RrLkR1cmF0aW9uLnNlY29uZHMoNjApLFxuICAgIC8vIH0pXG5cbiAgICAvLyAqKipQSVBFTElORSBDT05TVFJVQ1RTKioqXG5cbiAgICBjb25zdCBnaXRIdWJTb3VyY2UgPSBjb2RlYnVpbGQuU291cmNlLmdpdEh1Yih7XG4gICAgICBvd25lcjogJ2RuZC1zaWRlLXByb2plY3QnLFxuICAgICAgcmVwbzogJ2RuZC01dGgtMS1iYWNrZW5kJyxcbiAgICAgIHdlYmhvb2s6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0OiB0cnVlIGlmIGB3ZWJob29rRmlsdGVyZXNgIHdlcmUgcHJvdmlkZWQsIGZhbHNlIG90aGVyd2lzZVxuICAgICAgd2ViaG9va0ZpbHRlcnM6IFtcbiAgICAgICAgY29kZWJ1aWxkLkZpbHRlckdyb3VwLmluRXZlbnRPZihcbiAgICAgICAgICBjb2RlYnVpbGQuRXZlbnRBY3Rpb24uUFVMTF9SRVFVRVNUX01FUkdFRFxuICAgICAgICApLmFuZEJyYW5jaElzKCdtYWluJyksXG4gICAgICBdLCAvLyBvcHRpb25hbCwgYnkgZGVmYXVsdCBhbGwgcHVzaGVzIGFuZCBQdWxsIFJlcXVlc3RzIHdpbGwgdHJpZ2dlciBhIGJ1aWxkXG4gICAgfSlcblxuICAgIC8vIENPREVCVUlMRCAtIHByb2plY3RcbiAgICBjb25zdCBwcm9qZWN0ID0gbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHRoaXMsICdQaWNrbWVDb2RlQnVpbGRQcm9qZWN0Jywge1xuICAgICAgcHJvamVjdE5hbWU6IGAke3RoaXMuc3RhY2tOYW1lfWAsXG4gICAgICBzb3VyY2U6IGdpdEh1YlNvdXJjZSxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIGJ1aWxkSW1hZ2U6IGNvZGVidWlsZC5MaW51eEJ1aWxkSW1hZ2UuQU1BWk9OX0xJTlVYXzJfMixcbiAgICAgICAgcHJpdmlsZWdlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICBlbnZpcm9ubWVudFZhcmlhYmxlczoge1xuICAgICAgICBDTFVTVEVSX05BTUU6IHtcbiAgICAgICAgICB2YWx1ZTogYCR7Y2x1c3Rlci5jbHVzdGVyTmFtZX1gLFxuICAgICAgICB9LFxuICAgICAgICBFQ1JfUkVQT19VUkk6IHtcbiAgICAgICAgICB2YWx1ZTogYCR7ZWNyUmVwby5yZXBvc2l0b3J5VXJpfWAsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgYnVpbGRTcGVjOiBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3Qoe1xuICAgICAgICB2ZXJzaW9uOiAnMC4yJyxcbiAgICAgICAgcGhhc2VzOiB7XG4gICAgICAgICAgcHJlX2J1aWxkOiB7XG4gICAgICAgICAgICBjb21tYW5kczogW1xuICAgICAgICAgICAgICAnZW52JyxcbiAgICAgICAgICAgICAgJ2V4cG9ydCBUQUc9JHtDT0RFQlVJTERfUkVTT0xWRURfU09VUkNFX1ZFUlNJT059JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBidWlsZDoge1xuICAgICAgICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgICAgICAgJ2VjaG8gQnVpbGQgc3RhcnRlZCBvbiBgZGF0ZWAnLFxuICAgICAgICAgICAgICBgZG9ja2VyIGJ1aWxkIC10ICRFQ1JfUkVQT19VUkk6JFRBRyAuYCxcbiAgICAgICAgICAgICAgJyQoYXdzIGVjciBnZXQtbG9naW4gLS1uby1pbmNsdWRlLWVtYWlsKScsXG4gICAgICAgICAgICAgICdkb2NrZXIgcHVzaCAkRUNSX1JFUE9fVVJJOiRUQUcnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHBvc3RfYnVpbGQ6IHtcbiAgICAgICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAgICAgICdlY2hvIFwiSW4gUG9zdC1CdWlsZCBTdGFnZVwiJyxcbiAgICAgICAgICAgICAgJ3ByaW50ZiBcXCdbe1wibmFtZVwiOlwicGlja21lLWFwcFwiLFwiaW1hZ2VVcmlcIjpcIiVzXCJ9XVxcJyAkRUNSX1JFUE9fVVJJOiRUQUcgPiBpbWFnZWRlZmluaXRpb25zLmpzb24nLFxuICAgICAgICAgICAgICAncHdkOyBscyAtYWw7IGNhdCBpbWFnZWRlZmluaXRpb25zLmpzb24nLFxuICAgICAgICAgICAgICAnZWNobyBCdWlsZCBjb21wbGV0ZWQgb24gYGRhdGVgJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgYXJ0aWZhY3RzOiB7XG4gICAgICAgICAgZmlsZXM6IFsnaW1hZ2VkZWZpbml0aW9ucy5qc29uJ10sXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICB9KVxuXG4gICAgLy8gKioqUElQRUxJTkUgQUNUSU9OUyoqKlxuXG4gICAgY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpXG4gICAgY29uc3QgYnVpbGRPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KClcblxuICAgIGNvbnN0IHNvdXJjZUFjdGlvbiA9IG5ldyBjb2RlcGlwZWxpbmVfYWN0aW9ucy5HaXRIdWJTb3VyY2VBY3Rpb24oe1xuICAgICAgYWN0aW9uTmFtZTogJ0dpdEh1Yl9Tb3VyY2UnLFxuICAgICAgb3duZXI6ICdkbmQtc2lkZS1wcm9qZWN0JyxcbiAgICAgIHJlcG86ICdkbmQtNXRoLTEtYmFja2VuZCcsXG4gICAgICBicmFuY2g6ICdtYWluJyxcbiAgICAgIG9hdXRoVG9rZW46IGNkay5TZWNyZXRWYWx1ZS5zZWNyZXRzTWFuYWdlcignZ2l0aHViLXRva2VuJyksXG4gICAgICBvdXRwdXQ6IHNvdXJjZU91dHB1dCxcbiAgICB9KVxuXG4gICAgY29uc3QgYnVpbGRBY3Rpb24gPSBuZXcgY29kZXBpcGVsaW5lX2FjdGlvbnMuQ29kZUJ1aWxkQWN0aW9uKHtcbiAgICAgIGFjdGlvbk5hbWU6ICdDb2RlQnVpbGQnLFxuICAgICAgcHJvamVjdDogcHJvamVjdCxcbiAgICAgIGlucHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICBvdXRwdXRzOiBbYnVpbGRPdXRwdXRdLCAvLyBvcHRpb25hbFxuICAgIH0pXG5cbiAgICBjb25zdCBtYW51YWxBcHByb3ZhbEFjdGlvbiA9IG5ldyBjb2RlcGlwZWxpbmVfYWN0aW9ucy5NYW51YWxBcHByb3ZhbEFjdGlvbih7XG4gICAgICBhY3Rpb25OYW1lOiAnQXBwcm92ZScsXG4gICAgfSlcblxuICAgIGNvbnN0IGRlcGxveUFjdGlvbiA9IG5ldyBjb2RlcGlwZWxpbmVfYWN0aW9ucy5FY3NEZXBsb3lBY3Rpb24oe1xuICAgICAgYWN0aW9uTmFtZTogJ0RlcGxveUFjdGlvbicsXG4gICAgICBzZXJ2aWNlOiBmYXJnYXRlU2VydmljZS5zZXJ2aWNlLFxuICAgICAgaW1hZ2VGaWxlOiBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0UGF0aChcbiAgICAgICAgYnVpbGRPdXRwdXQsXG4gICAgICAgIGBpbWFnZWRlZmluaXRpb25zLmpzb25gXG4gICAgICApLFxuICAgIH0pXG5cbiAgICAvLyBQSVBFTElORSBTVEFHRVNcbiAgICBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHRoaXMsICdQaWNrbWVFQ1NQaXBlbGluZScsIHtcbiAgICAgIHN0YWdlczogW1xuICAgICAgICB7XG4gICAgICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgICAgICBhY3Rpb25zOiBbc291cmNlQWN0aW9uXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHN0YWdlTmFtZTogJ0J1aWxkJyxcbiAgICAgICAgICBhY3Rpb25zOiBbYnVpbGRBY3Rpb25dLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgc3RhZ2VOYW1lOiAnQXBwcm92ZScsXG4gICAgICAgICAgYWN0aW9uczogW21hbnVhbEFwcHJvdmFsQWN0aW9uXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHN0YWdlTmFtZTogJ0RlcGxveS10by1FQ1MnLFxuICAgICAgICAgIGFjdGlvbnM6IFtkZXBsb3lBY3Rpb25dLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KVxuXG4gICAgZWNyUmVwby5ncmFudFB1bGxQdXNoKHByb2plY3Qucm9sZSEpXG4gICAgcHJvamVjdC5hZGRUb1JvbGVQb2xpY3koXG4gICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAnZWNzOkRlc2NyaWJlQ2x1c3RlcicsXG4gICAgICAgICAgJ2VjcjpHZXRBdXRob3JpemF0aW9uVG9rZW4nLFxuICAgICAgICAgICdlY3I6QmF0Y2hDaGVja0xheWVyQXZhaWxhYmlsaXR5JyxcbiAgICAgICAgICAnZWNyOkJhdGNoR2V0SW1hZ2UnLFxuICAgICAgICAgICdlY3I6R2V0RG93bmxvYWRVcmxGb3JMYXllcicsXG4gICAgICAgIF0sXG4gICAgICAgIHJlc291cmNlczogW2Ake2NsdXN0ZXIuY2x1c3RlckFybn1gXSxcbiAgICAgIH0pXG4gICAgKVxuXG4gICAgLy9PVVRQVVRcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdMb2FkQmFsYW5jZXJETlMnLCB7XG4gICAgICB2YWx1ZTogZmFyZ2F0ZVNlcnZpY2UubG9hZEJhbGFuY2VyLmxvYWRCYWxhbmNlckRuc05hbWUsXG4gICAgfSlcbiAgfVxufVxuIl19