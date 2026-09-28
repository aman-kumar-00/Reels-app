import {Cloudinary} from '@cloudinary/url-gen';

const cloudinary = new Cloudinary({
  cloud: {
    cloudName: 'freereelsapp',
    apiKey: '831244411722212',
  },
  url: {
    secure: true,
  },
});

export default cloudinary;