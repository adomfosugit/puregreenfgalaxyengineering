/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  eslint: {

 ignoreDuringBuilds: true,
},

  typescript: {
 ignoreBuildErrors: true,
},

   images:{
     remotePatterns:[
       {
         protocol: 'https',
         hostname: 'cloud.appwrite.io',
         port: '',
         pathname: '/v1/storage/buckets/**',
       },
     ]
   }
};

export default nextConfig;
