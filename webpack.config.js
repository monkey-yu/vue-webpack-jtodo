const path=require('path')                                     // path是nodejs 的基础包，用来处理路径
const {VueLoaderPlugin} = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin')       //引入html-webpack-plugin
const webpack = require('webpack');                             // 引入webpack
const ExtractPlugin = require('extract-text-webpack-plugin')    // 分离css 打包
const isDev = process.env.NODE_ENV === 'development'            // 判断是否为测试环境，在启动脚本时设置的环境变量都是存在process.env这个对象里面的
const config ={
    target:'web',                                               // 设置webpack的编译目标是web平台
    entry:path.join(__dirname,'src/index.js'),                  // 入口文件。__dirname是我们文件的根目录
    output:{                                                    // 声明出口文件
        filename:'bundle.[hash:8].js',                          // 将挂载的app全部打包成一个bundle.js文件，在浏览器中可直接运行的代码
        path:path.join(__dirname,'dist')                        // 出口文件的位置
    },
    module:{
        rules:[                                        // webpack只能处理js文件，且只识别ES5的语法，所以针对不同类型文件，定义不同的识别规则，最终打包成js文件
            {
                test:/\.vue$/,                         // 处理.vue文件
                loader:'vue-loader'
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'                  //处理jsx文件
            },
            {
                test:/\.(gif|jpg|jpeg|png|svg)$/,       // 处理图片文件
                use:[
                    {
                        loader:'url-loader',            // url-loader依赖于file-loader,file-loader处理完文件可以保存为一个文件供处理
                        options:{                       // loader可以配置 options
                            limit:1024,                  // 对于小图片，在范围内可直接将图片转换成base64码直接存放在js中，减少http请求
                            name:'[name]-aa.[ext]'      // 输出文件的名称，[name]文件原名，[ext]文件扩展名
                        }
                    }
                ]
            }
        ]
    },
    plugins:[
        new webpack.DefinePlugin({          // 主要作用是在此处可以根据isDev配置process.env,一是可以在js代码中可以获取到process.env,二是webpack或vue根据process.env如果是developemnt,会给一些特殊的错误提醒
            'process.env':{
                NODE_ENV:isDev ? '"development"' : '"production"'
            }
        }),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin()            // 引入HTMLPlugin
    ]
}

if(isDev){                                // 开发环境中的配置
    config.module.rules.push(
        {
            test:/\.styl/,
            use:[
                'style-loader',           // 将css写入到html中去
                'css-loader',             // 处理css
                {
                    loader:'postcss-loader', //stylus-loader和postcss-loader自己都会生成sourcemap,如果前面stylus-loader已生成sourcemap
                    options:{                // 那么postcss-loader 可以直接引用前面的sourcemap
                        sourceMap:true
                    }
                },
                'stylus-loader'            // 处理stylus的css预处理器的问题件，转换成css,抛给上一层的css-loader
            ]
        }
    )
    config.devtool = "#cheap-module-eval-source-map" // 官方推荐使用这个配置，作用是在浏览器调试中，显示的代码和开发源码基本相似，而不会显示编译后的代码
    config.devServer ={                              // devServer 配置是webpack2.x以后引入的
      port:8000,
      host:'0.0.0.0',                                // 设置为0.0.0.0 ，这样可以通过127.0.0.1或localhost或本机ip去访问，也便于手机端访问调试
      overlay:{
          errors:true,                              // 编译中遇到的错误会显示在网页中
      },
    //   open:true,                                  // 项目启动时，会帮你打开浏览器
      hot:true                                      // 在单页面应用开发中，我们修改了代码后整个页面都刷新，开启hot后，只刷新对应的组件
    }
    config.plugins.push(                            // 添加2个插件用于hot:true的配置，热更新
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )
}else{                                               // 生产环境中的配置
    config.entry = {
        app:path.join(__dirname,'src/index.js'),
        vendor:['vue']                               // 分离类库
    }
    config.output.filename = '[name].[chunkhash:8].js' //此处一定是chunkhash,因为hash时app和vendor的hash码时一样的，每次业务更新，vendor也会更新，没有意义了。
    config.module.rules.push(
        {
            test:/\.styl/,
            use:ExtractPlugin.extract({
                fallback:'style-loader',
                use:[
                    'css-loader',
                    {
                        loader:'postcss-loader',
                        options:{
                            sourceMap:true
                        }
                    },
                    'stylus-loader'
                ]
            })
        }
    )
    config.plugins.push(
        new ExtractPlugin('styles.[chunkhash:8].css'),    //定义打包分离出来的css文件名
       
    )
    config.optimization={                     // webpack.optimize.CommonsChunkPlugin已过时，此处使用config.optimization.splitChunks 配置
        splitChunks:{
            cacheGroups:{
                common:{
                    chunks:'initial',
                    minChunks:2,
                    maxInitialRequests:5,
                    minSize:0
                },
                vendor:{                     // 定义 vue库的组件 打包
                    test:/node_modules/,
                    chunks:'initial',
                    name:'vendor',
                    priority:10,
                    enforce:true
                }

            }
            
        },
        runtimeChunk: true           // 将app.js文件中关于webpack文件的配置单独打包出一个文件，用于解决部分浏览器长缓存问题
    }

}
module.exports = config;         // 声明一个config的配置，用于对外暴露