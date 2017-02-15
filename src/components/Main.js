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

//
class ImgFigure extends React.Component{
    render(){
        var styleObj = {};
        //如果props属性中指定了这张图片的位置，则使用
        if(this.props.arrange.pos){
            styleObj = this.props.arrange.pos;
        }
        return(
            <figure className="img-figure" style={styleObj}>
                <img src={this.props.data.imageURL} alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                </figcaption>
            </figure>
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
                }
             }*/
            ]
        }

    }

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
            topImgNum = Math.ceil(Math.random() * 2), //取一个或不取
            topImgSpliceIndex = 0,

            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex ,1);

        //首先居中centerIndex的图片
        imgsArrangeCenterArr[0].pos = centerPos;

        //取出要布局上侧的图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (
                imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(
            topImgSpliceIndex, topImgNum);

        //布局位于上侧的图片
        imgsArrangeTopArr.forEach((value,index) => {
            imgsArrangeTopArr[index].pos = {
                top:getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                left:getRangeRandom(vPosRangeX[0], vPosRangeX[1])
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

            imgsArrangeArr[i].pos = {
                top:getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
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


    //组件加载完成后，为每张图片计算其位置范围
    componentDidMount(){
        //拿到舞台的大小
        var stageDOM = this.refs.stage,
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);
        console.log(stageW);
        //拿到一个imageFigure的大小
        var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2);
        console.log(imgFigureDOM);
        console.log(imgH);
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
                    }
                }
            }
            imgFigures.push(<ImgFigure data={value} key={index} ref={"imgFigure"+index} arrange={this.state.imgsArrangeArr[index]}></ImgFigure>)
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
