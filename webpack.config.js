const path=require('path')
const {VueLoaderPlugin} = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin')       //引入html-webpack-plugin
const webpack = require('webpack');
const isDev = process.env.NODE_ENV === 'development'
const config ={
    target:'web',
    entry:path.join(__dirname,'src/index.js'),
    output:{
        filename:'bundle.js',
        path:path.join(__dirname,'dist')
    },
    module:{
        rules:[
            {
                test:/\.vue$/,
                loader:'vue-loader'
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'                  //处理jsx文件
            },
            {
                test: /\.css$/, 
                use: ['style-loader', 'css-loader']
            },
            {
                test:/\.(gif|jpg|jpeg|png|svg)$/,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            limit:2048,
                            name:'[name]-aa.[ext]'
                        }
                    }
                ]
            },
            {
                test:/\.styl/,
                use:[
                    'style-loader',
                    'css-loader',
                    {
                        loader:'postcss-loader',
                        options:{
                            sourceMap:true
                        }
                    },
                    'stylus-loader'
                ]
            },
            {
                test:/\.sass$/,
                loader: 'vue-style-loader!css-loader!sass-loader?indentedSyntax=false' 
            }
        ]
    },
    plugins:[
        new webpack.DefinePlugin({
            'process.env':{
                NODE_ENV:isDev ? '"development"' : '"production"'
            }
        }),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin()
    ]
}

if(isDev){
    config.devtool = "#cheap-module-eval-source-map"
    config.devServer ={
      port:8000,
      host:'0.0.0.0',
      overlay:{
          errors:true,
      },
    //   open:true,
      hot:true
    }
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )
}
module.exports = config;