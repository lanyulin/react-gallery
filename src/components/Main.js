require('normalize.css/normalize.css');
require('styles/App.less');

import React from 'react';
import ReactDOM from 'react-dom';

let imagesData = require('../data/imagesData.json');

// 获取图片的地址路径
imagesData = (function getImagesURL(imagesDataArr){
	for(var i=0;i<imagesDataArr.length; i++){
		let oneImage = imagesDataArr[i];
		oneImage.imageURL = require("../images/"+oneImage.fileName);
		imagesDataArr[i] = oneImage;
	}
	return imagesDataArr;
})(imagesData);

/*
*   获取区间内的一个随机值
 */
function getRangeRandom(low,high) {
    return Math.ceil(Math.random() * (high - low) + low)
}

/*
*   获取0-30度之间的任意一个正负值
 */
function get30DegRandom(){
    return ((Math.random() > 0.5 ? "" : "-") + Math.ceil(Math.random() * 30))
}


class ImgFigure extends React.Component{
    //imgFigure的点击处理函数
    handleClick = (e) => {

        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }
        e.stopPropagation();
        e.preventDefault()
    };

    render(){
        var styleObj = {};
        //如果props属性中指定了这张图片的位置，则使用
        if(this.props.arrange.pos){
            styleObj = this.props.arrange.pos;
        }

        //如果图片的旋转角度有值且不为0，添加旋转角度
        if(this.props.arrange.rotate){
            (['MozTransform','msTransform','WebkitTransform','transform']).forEach(value => {
                styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
            })
        }

        if(this.props.arrange.isCenter){
            styleObj.zIndex = 11
        }

        var imgFigureClassName = "img-figure";
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

        return(
            <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
                <img src={this.props.data.imageURL} alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back" onClick={this.handleClick}>
                        <p>
                            {this.props.data.desc}
                        </p>
                    </div>
                </figcaption>
            </figure>
        )
    }
}

//控制组件
class ControllerUnit extends React.Component{
    handleClick = (e) => {
        //如果点击的是正在选中的按钮，则翻转图片，否则将对应的图片居中
        if(this.props.arrange.isCenter){
            this.props.inverse()
        }else{
            this.props.center()
        }
    }

    render(){
        var controllerUnitClassName = "controller-unit";

        //如果对应的是居中的图片，显示控制按钮的居中态
        if(this.props.arrange.isCenter){
            controllerUnitClassName += " is-center";

            //如果同时对应的是翻转的图片，显示控制按钮的翻转态
            if(this.props.arrange.isInverse){
                controllerUnitClassName += " is-inverse";
            }
        }
        return (
            <span className={controllerUnitClassName} onClick={this.handleClick}></span>
        )
    }
}

class AppComponent extends React.Component {
    constructor(props){
        super(props);
        this.constant = {
            centerPos:{
                left: 0,
                right: 0
            },
            hPosRange:{    //水平方向的取值范围
                leftSecX:[0,0],
                rightSecX:[0,0],
                y: [0,0]
            },
            vPosRange:{    //垂直方向的取值范围
                topY:[0,0],
                x: [0,0]
            }
        };
        this.state = {
            imgsArrangeArr : [
            /* {
                pos:{
                    left:"0",
                    top:"0"
                },
                rotate:0,
                isInverse: false //正反面
                isCenter: false //不居中
             }*/
            ]
        }
    }

    /*
     *  翻转图片
     *  @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
     *  @return {function} 这是一个闭包函数，其内return一个真正待被执行的函数
     */
    inverse = (index) => {
        return function () {
            var imgsArrangeArr = this.state.imgsArrangeArr;
            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
            this.setState({
                imgsArrangeArr: imgsArrangeArr
            })
        }.bind(this)
    };

    /*
    *  重新布局所有图片
    *  @param centerIndex 指定居中排布哪个图片
     */
    rearrange = (centerIndex) => {
        var imgsArrangeArr = this.state.imgsArrangeArr,
            constant = this.constant,
            centerPos = constant.centerPos,
            hPosRange = constant.hPosRange,
            vPosRange = constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeTopY = vPosRange.topY,
            vPosRangeX = vPosRange.x,

            imgsArrangeTopArr = [],
            topImgNum = Math.floor(Math.random() * 2), //取一个或不取
            topImgSpliceIndex = 0,

            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex ,1);

        //首先居中centerIndex的图片,居中的图片不需要旋转
        imgsArrangeCenterArr[0] = {
            pos : centerPos,
            rotate : 0,
            isCenter: true
        };

        //取出要布局上侧的图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (
                imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(
            topImgSpliceIndex, topImgNum);

        //布局位于上侧的图片
        imgsArrangeTopArr.forEach((value,index) => {
            imgsArrangeTopArr[index] = {
                pos : {
                    top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                    left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                },
                rotate: get30DegRandom(),
                isCenter:false
            }
        });

        //布局左右两侧的图片
        for(var i=0, j=imgsArrangeArr.length, k = j / 2; i<j; i++){
            var hPosRangeLORX = null;

            //前半部分布局左边，右半部分布局右边
            if(i < k){
                hPosRangeLORX = hPosRangeLeftSecX;
            }else{
                hPosRangeLORX = hPosRangeRightSecX;
            }

            imgsArrangeArr[i] ={
                pos : {
                    top:getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                    left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                },
                rotate: get30DegRandom(),
                isCenter:false
            }
        }

        if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        this.setState({
            imgsArrangeArr:imgsArrangeArr
        })
    };

    /*
     * 利用rearrange函数，居中对应的index图片
     * @param index，需要被居中的图片对应的图片信息数组的index值
     * @return {function}
     */
    center = (index) => {
        return function () {
           this.rearrange(index);
        }.bind(this)
    }

    //组件加载完成后，为每张图片计算其位置范围
    componentDidMount(){
        //拿到舞台的大小
        var stageDOM = this.refs.stage,
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);

        //拿到一个imageFigure的大小
        var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2);

        //计算中心图片的位置点
        this.constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        };

        //计算左侧、右侧区域图片排布位置的取值范围
        this.constant.hPosRange.leftSecX[0] = -halfImgW;
        this.constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        this.constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.constant.hPosRange.y[0] = -halfImgH;
        this.constant.hPosRange.y[1] = stageH - halfImgH;

        ////计算上侧区域图片排布位置的取值范围
        this.constant.vPosRange.topY[0] = -halfImgH;
        this.constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
        this.constant.vPosRange.x[0] = halfStageW - imgW;
        this.constant.vPosRange.x[1] = halfStageW;

        this.rearrange(0);
    }

    render() {
        var controllerUnits = [],imgFigures = [];
        imagesData.forEach((value,index) => {
            if(!this.state.imgsArrangeArr[index]){
                this.state.imgsArrangeArr[index] = {
                    pos:{
                        left: 0,
                        top: 0
                    },
                    rotate:0,
                    isInverse: false,
                    isCenter: false
                }
            }
            imgFigures.push(<ImgFigure data={value} key={index} ref={"imgFigure"+index}
                                       arrange={this.state.imgsArrangeArr[index]}
                                       inverse={this.inverse(index)} center={this.center(index)}
                                       ></ImgFigure>);
            controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]}
                                                 inverse={this.inverse(index)} center={this.center(index)} />);
        });
        return (
            <section className="stage" ref="stage">
            <section className="img-sec">
                {imgFigures}
          	</section>
          	<nav className="controller-nav">
                {controllerUnits}
          	</nav>
          </section>
        );
    }
}

AppComponent.defaultProps = {
};

export default AppComponent;
