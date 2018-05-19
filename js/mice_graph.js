/**********************************
*****	图形绘制模块js集
*****   陈鹏昊
*****   2014/7/5
***********************************/
// 点对象
function point(x, y){
	this.x = x;
	this.y = y;	
}
// 最大最小xy对象
function pointMM(MaxX,MaxY,MinX,MinY){
	this.MaxX = MaxX;
	this.MaxY = MaxY;
	this.MinX = MinX;
	this.MinY = MinY;
}
// 文字标签对象
function font(id, opt, point, content){
	this.id = id;
	this.opt = opt;
	this.point = point;
	this.content = content;
}

// 文字配置对象
function fontOpt(fontSize, fontColor){
	this.fontSize = fontSize;
	this.fontColor = fontColor;
}

// 图形对象
function graph(id, opt, points){
	this.id = id;
	this.opt = opt;
	this.points = points;
	this.getFirstPoint = function(){
		if(this.points != null && this.points.length > 0){
			return this.points[0];
		}else{
			return false;
		}
	};
	this.getLastPoint = function(){
		if(this.points != null && this.points.length > 0){
			return this.points[this.points.length - 1];
		}else{
			return false;
		}
	};
}

// 图形配置对象
function graphOpt(borderColor, fillColor, borderWidth){
	this.borderColor = borderColor;
	this.fillColor = fillColor;
	this.borderWidth = borderWidth;
}

// 区域比较方法
function compare(point1, point2, compVal){
	var xV = Math.abs(point1.x - point2.x);
	var yV = Math.abs(point1.y - point2.y);
	if(xV <= compVal && yV <= compVal){
		return true;
	}
	return false;
}

// 获取图形
function getGraph(point){
	for(var i = 0;i < graphs.length;i++){
		graphTemp = graphs[i];
		if(pointInFences(point, graphTemp.points)){
			return graphTemp;
		}
	}
	for(var i = 0;i < fonts.length;i++){
		fontTemp = fonts[i];
		var pointTemp = fontTemp.point;
		if(compare(point, pointTemp, 10)){
			return fontTemp;
		}
	}
	return null;
}

// 删除数组中的某项，并返回新数组
function delItem(item, arrays){
	var newArray = new Array();
	for (var i = 0; i < arrays.length; i++) {
		if (item != arrays[i]) {
			newArray.push(arrays[i]);
		}
	}
	return newArray;
} 
// 射线法判断点是否在图形中
function pointInFences(pnt1, fencePnts){
    var j = 0, cnt = 0;
    for (var i = 0; i < fencePnts.length; i++){
        j = (i == fencePnts.length - 1) ? 0 : j + 1;
        if ((fencePnts[i].y!=fencePnts[j].y)&&(((pnt1.y >= fencePnts[i].y) && (pnt1.y < fencePnts[j].y)) || ((pnt1.y >= fencePnts[j].y) && (pnt1.y < fencePnts[i].y))) && (pnt1.x < (fencePnts[j].x - fencePnts[i].x) * (pnt1.y - fencePnts[i].y) / (fencePnts[j].y - fencePnts[i].y) + fencePnts[i].x)) {
        	cnt++;
        }
    }
    return (cnt%2 > 0) ? true : false;
}
// 计算点集合中的最大最小x，y
function getMaxMin(points){
	// 一个图形先计算中最大x，y，然后计算出最小x，y，最后算出四个顶点，根据四个顶点再计算出四个边框的中点
	var MaxX,MaxY,MinX,MinY;
	// 获取最大x，y；最小x，y
	for(var i = 0;i < points.length;i++){
		var tempPoint = points[i];
		if(i == 0){
			MaxX = tempPoint.x;
			MaxY = tempPoint.y;
			MinX = tempPoint.x; 
			MinY = tempPoint.y;
		}else{
			if(MaxX < tempPoint.x){
				MaxX = tempPoint.x;
			}
			if(MinX > tempPoint.x){
				MinX = tempPoint.x;
			}
			if(MaxY < tempPoint.y){
				MaxY = tempPoint.y;
			}
			if(MinY > tempPoint.y){
				MinY = tempPoint.y;
			}
		}
	}
	return new pointMM(MaxX, MaxY, MinX, MinY);
}
// 选中图形后为图形添加八个定位点选中框
function selectedGraph(points, ctx){
	// 获取最大最小xy
	var mm = getMaxMin(points);
	// 四顶点
	var zsPoint = new point(mm.MinX, mm.MinY);
	var ysPoint = new point(mm.MaxX, mm.MinY);
	var yxPoint = new point(mm.MaxX, mm.MaxY);
	var zxPoint = new point(mm.MinX, mm.MaxY);
	// 顶点偏移量
	var xP = 5;
	var yP = 5;
	// 四边线中点
	var szPoint = new point(mm.MinX+(mm.MaxX-mm.MinX)/2, mm.MinY);
	var yzPoint = new point(mm.MaxX, mm.MinY+(mm.MaxY-mm.MinY)/2);
	var xzPoint = new point(mm.MinX+(mm.MaxX-mm.MinX)/2, mm.MaxY);
	var zzPoint = new point(mm.MinX, mm.MinY+(mm.MaxY-mm.MinY)/2);
	ctx.fillStyle = "#7b97a7";
	ctx.fillRect(zsPoint.x- xP, zsPoint.y- yP, 10, 10);
	ctx.fillRect(szPoint.x- xP, szPoint.y- yP, 10, 10);
	ctx.fillRect(ysPoint.x- xP, ysPoint.y- yP, 10, 10);
	ctx.fillRect(yzPoint.x- xP, yzPoint.y- yP, 10, 10);
	ctx.fillRect(yxPoint.x- xP, yxPoint.y- yP, 10, 10);
	ctx.fillRect(xzPoint.x- xP, xzPoint.y- yP, 10, 10);
	ctx.fillRect(zxPoint.x- xP, zxPoint.y- yP, 10, 10);
	ctx.fillRect(zzPoint.x- xP, zzPoint.y- yP, 10, 10);
	var selectedMap = new Map();
	selectedMap.put('zs', zsPoint);
	selectedMap.put('ys', ysPoint);
	selectedMap.put('yx', yxPoint);
	selectedMap.put('zx', zxPoint);
	selectedMap.put('sz', szPoint);
	selectedMap.put('yz', yzPoint);
	selectedMap.put('xz', xzPoint);
	selectedMap.put('zz', zzPoint);
	return selectedMap;
}
// 获取画布中的坐标
function getPointOnCanvas(canvas, x, y) {
	var point = new point();
    var bbox = canvas.getBoundingClientRect();
    point.x = x- bbox.left *(canvas.width / bbox.width);
    point.y = y - bbox.top  * (canvas.height / bbox.height);
    return point
}
// 取字体中的大小
function getFontSize(font){
	font = font.substring(0 ,font.indexOf('px'))
	return font;
}
// 根据矩形的左顶点坐标和长宽，返回其他顶点的坐标
function getRectPoints(p){
	var width = 20;
	var height = 20;
	var points = new Array();
	var point0 = new point(p.x - 5, p.y - 5);
	var point1 = new point(point0.x + width, point0.y);
	var point2 = new point(point0.x + width, point0.y + height);
	var point3 = new point(point0.x, point0.y + height);
	points.push(point0);
	points.push(point1);
	points.push(point2);
	points.push(point3);
	return points;
}

// 获得当前坐标是在选中的8个定位点中的哪个
function getCurrSelectedPoint(currPoint, selectedMap){
	// 左上
	if(pointInFences(currPoint,getRectPoints(selectedMap.get('zs')))){
		$("body").css('cursor', 'nw-resize');
		return 'zs';
	}
	// 上中
	else if(pointInFences(currPoint,getRectPoints(selectedMap.get('sz')))){
		$("body").css('cursor', 'n-resize');
		return 'sz';
	}
	// 右上
	else if(pointInFences(currPoint,getRectPoints(selectedMap.get('ys')))){
		$("body").css('cursor', 'ne-resize');
		return 'ys';
	}
	// 右中
	else if(pointInFences(currPoint,getRectPoints(selectedMap.get('yz')))){
		$("body").css('cursor', 'e-resize');
		return 'yz';
	}
	// 右下
	else if(pointInFences(currPoint,getRectPoints(selectedMap.get('yx')))){
		$("body").css('cursor', 'se-resize');
		return 'yx';
	}
	// 下中
	else if(pointInFences(currPoint,getRectPoints(selectedMap.get('xz')))){
		$("body").css('cursor', 's-resize');
		return 'xz';
	}
	// 左下
	else if(pointInFences(currPoint,getRectPoints(selectedMap.get('zx')))){
		$("body").css('cursor', 'sw-resize');
		return 'zx';
	}
	// 左中
	else if(pointInFences(currPoint,getRectPoints(selectedMap.get('zz')))){
		$("body").css('cursor', 'w-resize');
		return 'zz';
	}else{
		if (currGraph instanceof graph) {
			if (pointInFences(currPoint, currGraph.points)) {
				$("body").css('cursor', 'move');
			}
			else {
				$("body").css('cursor', 'default');
			}
		}
		return '';
	}
}

// 左上缩放 左上 最大x，最大y不变
function zoomZs(currPoint){
	// 获取最大最小xy
	var mm = getMaxMin(currGraph.points);
	// 临时变量
	var tempPoint = selectedMap.get('zs');
	var tempPoints = new Array();
	// 计算偏移量
	var xP = tempPoint.x - currPoint.x;
	var yP = tempPoint.y - currPoint.y;		
	// 计算移动方向
	var up = false;
	var left = false;
	if(xP > 0){
		left = true;
	}
	if(yP > 0){
		up = true;
	}
	for (var i = 0; i < currGraph.points.length; i++) {
		var newX,newY;
		if(currGraph.points[i].x != mm.MaxX){
			if(left){
				newX = currGraph.points[i].x - Math.abs(xP);
			}else{
				newX = currGraph.points[i].x + Math.abs(xP);
			}
		}else{
			newX = mm.MaxX;
		}
		
		if(currGraph.points[i].y != mm.MaxY){
			if(up){
				newY = currGraph.points[i].y - Math.abs(yP);
			}else{
				newY = currGraph.points[i].y + Math.abs(yP);
			}
		}else{
			newY = mm.MaxY;
		}
		var newPoint = new point(newX, newY);
		tempPoints.push(newPoint);
	}
	return tempPoints;
}
// 右上缩放 右上 最小x、最大y不变
function zoomYs(currPoint){
	// 获取最大最小xy
	var mm = getMaxMin(currGraph.points);
	// 临时变量
	var tempPoint = selectedMap.get('ys');
	var tempPoints = new Array();
	// 计算偏移量
	var xP = tempPoint.x - currPoint.x;
	var yP = tempPoint.y - currPoint.y;		
	// 计算移动方向
	var up = false;
	var left = false;
	if(xP > 0){
		left = true;
	}
	if(yP > 0){
		up = true;
	}
	for (var i = 0; i < currGraph.points.length; i++) {
		var newX,newY;
		if(currGraph.points[i].x != mm.MinX){
			if(left){
				newX = currGraph.points[i].x - Math.abs(xP);
			}else{
				newX = currGraph.points[i].x + Math.abs(xP);
			}
		}else{
			newX = mm.MinX;
		}
		
		if(currGraph.points[i].y != mm.MaxY){
			if(up){
				newY = currGraph.points[i].y - Math.abs(yP);
			}else{
				newY = currGraph.points[i].y + Math.abs(yP);
			}
		}else{
			newY = mm.MaxY;
		}
		var newPoint = new point(newX, newY);
		tempPoints.push(newPoint);
	}
	return tempPoints;
}
// 右下缩放  最小x，最小y不变
function zoomYx(currPoint){
	// 获取最大最小xy
	var mm = getMaxMin(currGraph.points);
	// 临时变量
	var tempPoint = selectedMap.get('yx');
	var tempPoints = new Array();
	// 计算偏移量
	var xP = tempPoint.x - currPoint.x;
	var yP = tempPoint.y - currPoint.y;		
	// 计算移动方向
	var up = false;
	var left = false;
	if(xP > 0){
		left = true;
	}
	if(yP > 0){
		up = true;
	}
	for (var i = 0; i < currGraph.points.length; i++) {
		var newX,newY;
		if(currGraph.points[i].x != mm.MinX){
			if(left){
				newX = currGraph.points[i].x - Math.abs(xP);
			}else{
				newX = currGraph.points[i].x + Math.abs(xP);
			}
		}else{
			newX = mm.MinX;
		}
		
		if(currGraph.points[i].y != mm.MinY){
			if(up){
				newY = currGraph.points[i].y - Math.abs(yP);
			}else{
				newY = currGraph.points[i].y + Math.abs(yP);
			}
		}else{
			newY = mm.MinY;
		}
		var newPoint = new point(newX, newY);
		tempPoints.push(newPoint);
	}
	return tempPoints;
}
// 左下缩放  最大x，最小y不变
function zoomZx(currPoint){
	// 获取最大最小xy
	var mm = getMaxMin(currGraph.points);
	// 临时变量
	var tempPoint = selectedMap.get('zx');
	var tempPoints = new Array();
	// 计算偏移量
	var xP = tempPoint.x - currPoint.x;
	var yP = tempPoint.y - currPoint.y;		
	// 计算移动方向
	var up = false;
	var left = false;
	if(xP > 0){
		left = true;
	}
	if(yP > 0){
		up = true;
	}
	for (var i = 0; i < currGraph.points.length; i++) {
		var newX,newY;
		if(currGraph.points[i].x != mm.MaxX){
			if(left){
				newX = currGraph.points[i].x - Math.abs(xP);
			}else{
				newX = currGraph.points[i].x + Math.abs(xP);
			}
		}else{
			newX = mm.MaxX;
		}
		
		if(currGraph.points[i].y != mm.MinY){
			if(up){
				newY = currGraph.points[i].y - Math.abs(yP);
			}else{
				newY = currGraph.points[i].y + Math.abs(yP);
			}
		}else{
			newY = mm.MinY;
		}
		var newPoint = new point(newX, newY);
		tempPoints.push(newPoint);
	}
	return tempPoints;
}
// 上中缩放  最大y不变，所有x不变
function zoomSz(currPoint){
	// 获取最大最小xy
	var mm = getMaxMin(currGraph.points);
	// 临时变量
	var tempPoint = selectedMap.get('sz');
	var tempPoints = new Array();
	// 计算偏移量
	var xP = tempPoint.x - currPoint.x;
	var yP = tempPoint.y - currPoint.y;		
	// 计算移动方向
	var up = false;
	var left = false;
	if(xP > 0){
		left = true;
	}
	if(yP > 0){
		up = true;
	}
	for (var i = 0; i < currGraph.points.length; i++) {
		var newX,newY;
		newX =currGraph.points[i].x;
		if(currGraph.points[i].y != mm.MaxY){
			if(up){
				newY = currGraph.points[i].y - Math.abs(yP);
			}else{
				newY = currGraph.points[i].y + Math.abs(yP);
			}
		}else{
			newY = mm.MaxY;
		}
		var newPoint = new point(newX, newY);
		tempPoints.push(newPoint);
	}
	return tempPoints;
}
// 右中缩放  最小x不变，所有y不变
function zoomYz(currPoint){
	// 获取最大最小xy
	var mm = getMaxMin(currGraph.points);
	// 临时变量
	var tempPoint = selectedMap.get('yz');
	var tempPoints = new Array();
	// 计算偏移量
	var xP = tempPoint.x - currPoint.x;
	var yP = tempPoint.y - currPoint.y;		
	// 计算移动方向
	var up = false;
	var left = false;
	if(xP > 0){
		left = true;
	}
	if(yP > 0){
		up = true;
	}
	for (var i = 0; i < currGraph.points.length; i++) {
		var newX,newY;
		if(currGraph.points[i].x != mm.MinX){
			if(left){
				newX = currGraph.points[i].x - Math.abs(xP);
			}else{
				newX = currGraph.points[i].x + Math.abs(xP);
			}
		}else{
			newX = mm.MinX;
		}
		newY = currGraph.points[i].y;
		var newPoint = new point(newX, newY);
		tempPoints.push(newPoint);
	}
	return tempPoints;
}
// 下中缩放  最小y不变，所有x不变
function zoomXz(currPoint){
	// 获取最大最小xy
	var mm = getMaxMin(currGraph.points);
	// 临时变量
	var tempPoint = selectedMap.get('xz');
	var tempPoints = new Array();
	// 计算偏移量
	var xP = tempPoint.x - currPoint.x;
	var yP = tempPoint.y - currPoint.y;		
	// 计算移动方向
	var up = false;
	var left = false;
	if(xP > 0){
		left = true;
	}
	if(yP > 0){
		up = true;
	}
	for (var i = 0; i < currGraph.points.length; i++) {
		var newX,newY;
		newX =currGraph.points[i].x;
		if(currGraph.points[i].y != mm.MinY){
			if(up){
				newY = currGraph.points[i].y - Math.abs(yP);
			}else{
				newY = currGraph.points[i].y + Math.abs(yP);
			}
		}else{
			newY = mm.MinY;
		}
		var newPoint = new point(newX, newY);
		tempPoints.push(newPoint);
	}
	return tempPoints;
}
// 左中缩放  最大x不变，所有y不变
function zoomZz(currPoint){
	// 获取最大最小xy
	var mm = getMaxMin(currGraph.points);
	// 临时变量
	var tempPoint = selectedMap.get('zz');
	var tempPoints = new Array();
	// 计算偏移量
	var xP = tempPoint.x - currPoint.x;
	var yP = tempPoint.y - currPoint.y;		
	// 计算移动方向
	var up = false;
	var left = false;
	if(xP > 0){
		left = true;
	}
	if(yP > 0){
		up = true;
	}
	for (var i = 0; i < currGraph.points.length; i++) {
		var newX,newY;
		if(currGraph.points[i].x != mm.MaxX){
			if(left){
				newX = currGraph.points[i].x - Math.abs(xP);
			}else{
				newX = currGraph.points[i].x + Math.abs(xP);
			}
		}else{
			newX = mm.MaxX;
		}
		newY = currGraph.points[i].y;
		var newPoint = new point(newX, newY);
		tempPoints.push(newPoint);
	}
	return tempPoints;
}
// 选中模式
function toSelectModel(){
	model = 'selected';
	$("body").css('cursor', 'pointer');
}
// 移动模式
function toMoveModel(){
	model = 'move';
	$("body").css('cursor', 'move');
}