# AWS Audio Transformer
This project provides a solution for transforming audio files on the AWS platform.
It leverages AWS services to process and convert audio files into different formats, enabling efficient and scalable audio manipulation.

# Audio Processor

This is a simple audio processor that can be used to process audio files in AWS Cloud.

It uses AWS Lambda and AWS S3 to process the audio files. The audio files are stored in S3 and the Lambda function is triggered when a new file is uploaded to the S3 bucket.
The Lambda function processes the audio file and stores the processed file back in the S3 bucket.

## How to run the project
1. Install Node.js 20 nad Yarn (you can use NVM)
2. Download the FFmpeg and FFprobe binaries. You can find the binaries at [FFmpeg official site](https://ffmpeg.org/download.html).
3. Zip the binaries and place them in the `deployment/layers` directory as `ffmpeg.zip` and `ffprobe.zip`.
4. Go to the main directory and run `yarn` to install dependencies and `yarn run build` to build the project
5. In `terraform` directory, run `terraform init` to initialize the project, `terraform plan` to see the changes and `terraform apply` to apply the changes.
6. After the deployment is complete, you can test the audio transformer API. Copy the API endpoint from the Api Gateway console and use it to test the audio transformer API.
7. Supported endpoints:
   - `POST /files`: Creates new presigned URL for uploading an audio file to S3 bucket.
   - `GET /files`: Returns a list of audio files in the S3 bucket.

## Architecture
![Full](https://github.com/user-attachments/assets/88b7dbcb-c4e3-4dbe-95ff-05809e1df717)
