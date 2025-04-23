resource "aws_lambda_function" "upload_url_generator" {
  function_name = "${local.project}-upload-url-generator"
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  role          = aws_iam_role.upload_url_generator_role.arn
  filename      = data.archive_file.upload_url_generator.output_path

  source_code_hash = data.archive_file.upload_url_generator.output_base64sha256

  environment {
    variables = {
      REGION      = local.region
      BUCKET_NAME = aws_s3_bucket.audio.bucket
    }
  }
}

resource "aws_iam_role" "upload_url_generator_role" {
  name               = "${local.project}-upload-url-generator"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_role_policy_attachment" "upload_url_generator" {
  role       = aws_iam_role.upload_url_generator_role.name
  policy_arn = aws_iam_policy.upload_url_generator_policy.arn
}

resource "aws_iam_policy" "upload_url_generator_policy" {
  name = "${local.project}-upload-url-generator"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:${local.region}:${data.aws_caller_identity.current.account_id}:log-group:/aws/lambda/*:*:*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject"
      ],
      "Resource": "${aws_s3_bucket.audio.arn}/*"
    }
  ]
}
EOF
}

resource "aws_lambda_permission" "api_gw_upload_url_generator" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.upload_url_generator.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

data "archive_file" "upload_url_generator" {
  type        = "zip"
  source_dir  = "${path.module}/../backend/lambdas/upload-url-generator/dist"
  output_path = "artifacts/upload-url-generator.zip"
}
