#! /bin/bash

BUCKET="imjacobclark-artifacts"

if [ $1 = "update" ]
then
  zip -r api-crime-rate.zip ./*
  aws s3 cp api-crime-rate.zip s3://$BUCKET/api-crime-rate.zip 
  aws lambda update-function-code --function-name api-crime-rate --s3-bucket $BUCKET --s3-key api-crime-rate.zip --publish
  python troposphere/api.py > template.json
  aws cloudformation update-stack --capabilities CAPABILITY_IAM --stack-name api-crime-data --template-body file://./template.json
  rm template.json api-crime-rate.zip

  exit $?
fi

if [ $1 = "create" ]
then
  zip -r api-crime-rate.zip ./*
  aws s3 cp api-crime-rate.zip s3://$BUCKET/api-crime-rate.zip 
  python troposphere/api.py > template.json
  aws cloudformation create-stack --capabilities CAPABILITY_IAM --stack-name api-crime-data --template-body file://./template.json
  rm template.json api-crime-rate.zip

  exit $?
fi

echo "Unknown operation, try again with update or create"
