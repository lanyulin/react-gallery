require('normalize.css/normalize.css');
require('styles/App.less');

import React from 'react';

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

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec">
      	</section>
      	<nav className="controller-nav">
      	</nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
