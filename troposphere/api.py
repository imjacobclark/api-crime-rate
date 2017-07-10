from troposphere import Ref, Template, Output
from troposphere.apigateway import RestApi, Method
from troposphere.apigateway import Resource, MethodResponse
from troposphere.apigateway import Integration, IntegrationResponse
from troposphere.apigateway import Deployment, Stage, ApiStage
from troposphere.apigateway import UsagePlan, QuotaSettings, ThrottleSettings
from troposphere.apigateway import ApiKey, StageKey, UsagePlanKey, IntegrationResponse
from troposphere.iam import Role, Policy
from troposphere.awslambda import Function, Code, Permission
from troposphere import GetAtt, Join

bucket="imjacobclark-artifacts"

t = Template()

# Create the Api Gateway
rest_api = t.add_resource(RestApi(
    "CrimeDataAPI",
    Name="CrimeDataAPI"
))

# Create a role for the lambda function
t.add_resource(Role(
    "CrimeDataExecutionRole",
    Path="/",
    Policies=[Policy(
        PolicyName="root",
        PolicyDocument={
            "Version": "2012-10-17",
            "Statement": [{
                "Action": ["logs:*"],
                "Resource": "arn:aws:logs:*:*:*",
                "Effect": "Allow"
            }, {
                "Action": ["lambda:*"],
                "Resource": "*",
                "Effect": "Allow"
            }]
        })],
    AssumeRolePolicyDocument={"Version": "2012-10-17", "Statement": [
        {
            "Action": ["sts:AssumeRole"],
            "Effect": "Allow",
            "Principal": {
                "Service": [
                    "lambda.amazonaws.com",
                    "apigateway.amazonaws.com"
                ]
            }
        }
    ]},
))

# Create the Lambda function
function = t.add_resource(Function(
  "CrimeDataAPIFunction",
  FunctionName="api-crime-rate",
  Code=Code(
    S3Bucket=bucket,
    S3Key="api-crime-rate.zip"
  ),
  Handler="app.handler",
  Role=GetAtt("CrimeDataExecutionRole", "Arn"),
  Runtime="nodejs6.10",
  Timeout=10,
))

methods = ['postcode', 'place']

for method in methods:
  # Create a resource to map the lambda function to
  root = t.add_resource(Resource(
    method + "Root",
    RestApiId=Ref(rest_api),
    PathPart=method,
    ParentId=GetAtt("CrimeDataAPI", "RootResourceId"),
  ))

  date = t.add_resource(Resource(
    method+ "Date",
    RestApiId=Ref(rest_api),
    PathPart="{date}",
    ParentId=Ref(method + "Root"),
  ))

  query = t.add_resource(Resource(
    method + "Query",
    RestApiId=Ref(rest_api),
    PathPart="{" + method + "}",
    ParentId=Ref(method + "Date"),
  ))

  # Create a Lambda API method for the Lambda resource
  method = t.add_resource(Method(
    "CrimeDataAPIMethod" + method,
    DependsOn='CrimeDataAPIFunction',
    RestApiId=Ref(rest_api),
    AuthorizationType="NONE",
    ResourceId=Ref(query),
    HttpMethod="GET",
    Integration=Integration(
      Credentials=GetAtt("CrimeDataExecutionRole", "Arn"),
      Type="AWS_PROXY",
      IntegrationHttpMethod='POST',
      Uri=Join("", [
        "arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/",
        GetAtt("CrimeDataAPIFunction", "Arn"),
        "/invocations"
      ])
    ),
  ))

# Allow the gateway to invoke Lambda
permission = t.add_resource(Permission(
  "CrimeDataAPILambdaPermission",
  Action="lambda:InvokeFunction",
  FunctionName=GetAtt("CrimeDataAPIFunction", "Arn"),
  Principal="apigateway.amazonaws.com",
  SourceArn=Join("", [
    "arn:aws:execute-api:",
    Ref("AWS::Region"),
    ":",
    Ref("AWS::AccountId"),
    ":",
    Ref(rest_api),
    "/*/GET/CrimeData"
  ])
))

# Create a deployment
stage_name = 'v1'

deployment = t.add_resource(Deployment(
  "%sDeployment" % stage_name,
  DependsOn=["CrimeDataAPIMethod"+methods[0], "CrimeDataAPIMethod"+methods[1]],
  RestApiId=Ref(rest_api),
))

stage = t.add_resource(Stage(
  '%sStage' % stage_name,
  StageName=stage_name,
  RestApiId=Ref(rest_api),
  DeploymentId=Ref(deployment)
))

# Add the deployment endpoint as an output
t.add_output([
  Output(
    "ApiEndpoint",
    Value=Join("", [
      "https://",
      Ref(rest_api),
      ".execute-api.eu-west-1.amazonaws.com/",
      stage_name
    ]),
    Description="Endpoint for this stage of the api"
  ),
])

print(t.to_json())
