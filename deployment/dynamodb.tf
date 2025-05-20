resource "aws_dynamodb_table" "audio_metadata" {
  name         = "${local.project}-audio-metadata"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}
