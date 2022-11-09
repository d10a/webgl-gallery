import vitePluginString from 'vite-plugin-string'


export default {
    mode: 'development',
    // plugins: [
    //     vitePluginString({
    //         include: [
    //             '**/*.glsl',
    //         ],
    //         exclude: 'node_modules/**',
    //         compress: true,
    //     })
    // ],
    server: {
        port: 9000
    }
};