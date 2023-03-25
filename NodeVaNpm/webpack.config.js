const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env) => {
    const basePlugins = [
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        }),
        new HtmlWebpackPlugin({
            title: 'Webpack app',
            filename: 'index.html',
            template: './src/template.html'
        }),
    ]

    
    const isDevelopment = process.env.NODE_ENV === 'development';
    const  plugins = isDevelopment ? basePlugins : [...basePlugins, new BundleAnalyzerPlugin()];
    return {
        mode: isDevelopment ? 'development' : 'production',
        entry: {
            app: path.resolve('src/index.js')
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].[contenthash].js',
            clean: true,
            assetModuleFilename: '[file]'
        },
        devtool: isDevelopment ? 'source-map' : false,
        module: {
            rules: [
                {
                    test: /\.s[ac]ss|css$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif|pdf)$/i,
                    type: 'asset/resource'
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [[
                                '@babel/preset-env',
                                {
                                    debug: true,
                                    useBuiltIns: 'usage',
                                    corejs: '3.29.1'
                                }]]
                        }
                    }
                }
            ]
        },
        plugins,
        devServer: {
            static: {
                directory: 'dist',//Đường dẫn tương đối đến thư mục chưa index.html',
            },
            port: 3000, // Port thay cho port mặc đinh (8080)
            open: true, // Mở trang webpack khi chạy terminal
            hot: true, // Bật tính năng reload nhanh Hot Module Replacement
            compress: true, // Bật griz cho các tài nguyên
            historyApiFallback: true // Set true nếu bạn dùng cho các SPA và sử dụng history API của html5
        }
    }
}