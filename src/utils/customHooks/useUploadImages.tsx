import { useState } from 'react';

const useUploadImages = (initValue: string): [string, Function] => {
  const [fileURL, setFileURL] = useState<string>(initValue);
  const uploadCover = async ({ target }: any) => {
    const { files } = target;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'resenan_sancho');

    const imageResponse = await fetch('https://api.cloudinary.com/v1_1/dnhkw9n4n/image/upload',
      {
        method: 'POST',
        body: data,
      });
    const file = await imageResponse.json();
    setFileURL(file.secure_url);
  };
  return [fileURL, uploadCover];
};

export default useUploadImages;
