import ffmpeg from 'fluent-ffmpeg';

export const transformAudio = async (audioFilePath: string, tempDirPath: string): Promise<string> => {
  const bitrate = "44100";
  const format = "mp3";
  const transformedAudioPath = `${tempDirPath}/transformed.${format}`;

  await new Promise((resolve, reject) => {
    ffmpeg(audioFilePath)
      .toFormat(format)
      .audioBitrate(bitrate)
      .save(transformedAudioPath)
      .on('end', () => {
        console.log('File has been transformed successfully');
        return resolve(transformedAudioPath);
      })
      .on('error', (error: Error) => {
        console.log('Failed to transform audio file: ', error.message);
        return reject(error);
      });
  });

  return transformedAudioPath;
}
