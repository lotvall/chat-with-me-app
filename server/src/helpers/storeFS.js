import fs, { createWriteStream } from 'fs'

const storeFS = ( stream, filename ) => {
  const uploadDir = './uploads';
  const path = `${uploadDir}/${filename}`;

  return new Promise((resolve, reject) => 
    stream
      .pipe(createWriteStream(path))
      .on("finish", () => resolve())
      .on("error", () => reject)
  )

}

export default storeFS