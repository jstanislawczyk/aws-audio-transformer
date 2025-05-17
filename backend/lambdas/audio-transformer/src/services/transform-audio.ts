import ffmpeg from 'fluent-ffmpeg';

export const transformAudio = async (audioFilePath: string, tempDirPath: string): Promise<string> => {
  const transformedAudioPath = `${tempDirPath}/transformed.mp3`;

  return new Promise((resolve, reject) => {
    ffmpeg(audioFilePath)
      .toFormat('mp3')
      .audioBitrate('44100')
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
}
