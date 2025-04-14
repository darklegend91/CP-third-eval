// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: 
// [react()],
//   server: {
//     proxy: {
//       '/api': 'http://localhost:5000' // Proxy API requests
//     }
//   }
// })

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       // Change from '/api' to '/api/api'
//       '/api/api': {
//         target: 'http://localhost:5000',
//         rewrite: (path) => path.replace(/^\/api\/api/, '/api')
//       }
//     }
//   }
// })

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:5000',
//         changeOrigin: true,
//         rewrite: path => path.replace(/^\/api/, '')
//       }
//     }
//   }
// });/

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})


