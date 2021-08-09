import * as cdk from '@aws-cdk/core'
import * as ec2 from '@aws-cdk/aws-ec2'
import * as ecr from '@aws-cdk/aws-ecr'
import * as ecs from '@aws-cdk/aws-ecs'
import * as ecs_patterns from '@aws-cdk/aws-ecs-patterns'
import * as iam from '@aws-cdk/aws-iam'
import * as codebuild from '@aws-cdk/aws-codebuild'
import * as codecommit from '@aws-cdk/aws-codecommit'
import * as targets from '@aws-cdk/aws-events-targets'
import * as codedeploy from '@aws-cdk/aws-codedeploy'
import * as codepipeline from '@aws-cdk/aws-codepipeline'
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions'
import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets'
import * as ecrdeploy from 'cdk-ecr-deployment'

export class InfrastructuresStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // const imageTag = this.node.tryGetContext('imageTag')

    /**
     * Create a new VPC with single NAT Gateway
     */
    const vpc = new ec2.Vpc(this, 'picme-ecs-cdk-vpc', {
      cidr: '10.0.0.0/16',
      natGateways: 1,
      maxAzs: 2,
    })

    const clusterAdmin = new iam.Role(this, 'PickmeAdminRole', {
      assumedBy: new iam.AccountRootPrincipal(),
    })

    const cluster = new ecs.Cluster(this, 'picme-ecs-cluster', {
      vpc: vpc,
    })

    const logging = new ecs.AwsLogDriver({
      streamPrefix: 'pickme-ecs-logs',
    })

    const taskRole = new iam.Role(
      this,
      `pickme-ecs-taskRole-${this.stackName}`,
      {
        roleName: `ecs-taskRole-${this.stackName}`,
        assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      }
    )

    // ECR - repo
    const ecrRepo = ecr.Repository.fromRepositoryName(
      this,
      'pickme-backend-ecr-repo',
      'pickme-backend-ecr-repo'
    )

    // const image = new DockerImageAsset(this, 'MyBuildImage', {
    //   directory: '../',
    // })
    // //upload docker image to ecr
    // new ecrdeploy.ECRDeployment(this, 'DeployDockerImage', {
    //   src: new ecrdeploy.DockerImageName(image.imageUri),
    //   dest: new ecrdeploy.DockerImageName(`${ecrRepo.repositoryUri}`),
    // })

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
    })

    const taskDef = new ecs.FargateTaskDefinition(this, 'pickme-ecs-taskdef', {
      taskRole: taskRole,
    })

    taskDef.addToExecutionRolePolicy(executionRolePolicy)

    const container = taskDef.addContainer('pickme-app', {
      // image: ecs.ContainerImage.fromEcrRepository(ecrRepo, imageTag),
      // tag: latest
      image: ecs.ContainerImage.fromEcrRepository(ecrRepo),
      logging,
    })

    container.addPortMappings({
      containerPort: 3000,
      protocol: ecs.Protocol.TCP,
    })

    const fargateService =
      new ecs_patterns.ApplicationLoadBalancedFargateService(
        this,
        'pickme-ecs-service',
        {
          cluster: cluster,
          taskDefinition: taskDef,
          publicLoadBalancer: true,
          desiredCount: 1,
          listenerPort: 80,
        }
      )

    const scaling = fargateService.service.autoScaleTaskCount({
      maxCapacity: 2,
    })
    // scaling.scaleOnCpuUtilization('CpuScaling', {
    //   targetUtilizationPercent: 10,
    //   scaleInCooldown: cdk.Duration.seconds(60),
    //   scaleOutCooldown: cdk.Duration.seconds(60),
    // })

    // ***PIPELINE CONSTRUCTS***

    const gitHubSource = codebuild.Source.gitHub({
      owner: 'dnd-side-project',
      repo: 'dnd-5th-1-backend',
      webhook: true, // optional, default: true if `webhookFilteres` were provided, false otherwise
      webhookFilters: [
        codebuild.FilterGroup.inEventOf(
          codebuild.EventAction.PULL_REQUEST_MERGED
        ).andBranchIs('main'),
      ], // optional, by default all pushes and Pull Requests will trigger a build
    })

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
    })

    // ***PIPELINE ACTIONS***

    const sourceOutput = new codepipeline.Artifact()
    const buildOutput = new codepipeline.Artifact()

    const sourceAction = new codepipeline_actions.GitHubSourceAction({
      actionName: 'GitHub_Source',
      owner: 'dnd-side-project',
      repo: 'dnd-5th-1-backend',
      branch: 'main',
      oauthToken: cdk.SecretValue.secretsManager('github-token'),
      //oauthToken: cdk.SecretValue.plainText('<plain-text>'),
      output: sourceOutput,
    })

    const buildAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'CodeBuild',
      project: project,
      input: sourceOutput,
      outputs: [buildOutput], // optional
    })

    const manualApprovalAction = new codepipeline_actions.ManualApprovalAction({
      actionName: 'Approve',
    })

    const deployAction = new codepipeline_actions.EcsDeployAction({
      actionName: 'DeployAction',
      service: fargateService.service,
      imageFile: new codepipeline.ArtifactPath(
        buildOutput,
        `imagedefinitions.json`
      ),
    })

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
    })

    ecrRepo.grantPullPush(project.role!)
    project.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          'ecs:DescribeCluster',
          'ecr:GetAuthorizationToken',
          'ecr:BatchCheckLayerAvailability',
          'ecr:BatchGetImage',
          'ecr:GetDownloadUrlForLayer',
        ],
        resources: [`${cluster.clusterArn}`],
      })
    )

    //OUTPUT

    new cdk.CfnOutput(this, 'LoadBalancerDNS', {
      value: fargateService.loadBalancer.loadBalancerDnsName,
    })
  }
}
