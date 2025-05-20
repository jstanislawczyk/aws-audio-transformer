resource "aws_sqs_queue" "audio_events" {
  name                        = "${local.project}-audio-events.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  visibility_timeout_seconds  = 300
}
