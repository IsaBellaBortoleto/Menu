path = r"D:\Bella\UTFPR\4.2_periodo\github\Menu\vite.config.ts"

new_content = '''import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  publicDir: 'public',
  server: {
    port: 5173,
    strictPort: false,
    open: true
  }
})
'''

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("✅ vite.config.ts atualizado")
