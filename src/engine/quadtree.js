/*
 * Javascript Quadtree 
 * @version 1.1.1
 * @licence MIT
 * @author Timo Hausmann
 * https://github.com/timohausmann/quadtree-js/
 */
 
/*
 Copyright © 2012 Timo Hausmann

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENthis. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
 	
	 /*
	  * Quadtree Constructor
	  * @param Object bounds		bounds of the node, object with x, y, width, height (碰撞空间的大小)
	  * @param Integer max_objects		(optional) max objects a node can hold before splitting into 4 subnodes (default: 10) (一个象限最多可以容纳的对象)
	  * @param Integer max_levels		(optional) total max levels inside root Quadtree (default: 4) (树的深度)
	  * @param Integer level		(optional) deepth level, required for subnodes  
	  */
	export default function Quadtree( bounds, max_objects, max_levels, level ) {
		
		this.max_objects	= 2;
		this.max_levels		= 5;
		
		this.level 		= level || 0;
		this.bounds 		= bounds;
		
		this.objects 		= [];
		this.nodes 		= [];
	};
	
	
	/*
	 * Split the node into 4 subnodes
	 */
    //分割碰撞空间
	Quadtree.prototype.split = function() {

    //当前层级+1，子节点宽高为父结点一半取整
		  var 	nextLevel	= this.level + 1,
			subWidth	= Math.round( this.bounds.width / 2 ),
			subHeight 	= Math.round( this.bounds.height / 2 ),
			x 		= Math.round( this.bounds.x ),
			y 		= Math.round( this.bounds.y );

     //创建四个新的象限
	 	//top right node //右上
		this.nodes[0] = new Quadtree({
			x	: x + subWidth, 
			y	: y, 
			width	: subWidth, 
			height	: subHeight
		}, this.max_objects, this.max_levels, nextLevel);
		
		//top left node //左上
		this.nodes[1] = new Quadtree({
			x	: x, 
			y	: y, 
			width	: subWidth, 
			height	: subHeight
		}, this.max_objects, this.max_levels, nextLevel);
		
		//bottom left node //左下
		this.nodes[2] = new Quadtree({
			x	: x, 
			y	: y + subHeight, 
			width	: subWidth, 
			height	: subHeight
		}, this.max_objects, this.max_levels, nextLevel);
		
		//bottom right node //右下
		this.nodes[3] = new Quadtree({
			x	: x + subWidth, 
			y	: y + subHeight, 
			width	: subWidth, 
			height	: subHeight
		}, this.max_objects, this.max_levels, nextLevel);
	};
	
	
	/*
	 * Determine which node the object belongs to
	 * @param Object pRect		bounds of the area to be checked, with x, y, width, height
	 * @return Integer		index of the subnode (0-3), or -1 if pRect cannot completely fit within a subnode and is part of the parent node
	 */
    //获取所在象限的索引，0-3，-1代表在边界上
	Quadtree.prototype.getIndex = function( pRect ) {
		
		  var 	index 			= -1,
          // |
			    verticalMidpoint 	= this.bounds.x + (this.bounds.width / 2),
          // 一
			horizontalMidpoint 	= this.bounds.y + (this.bounds.height / 2),
	 
			    //pRect can completely fit within the top quadrants
          //判定位于上面两个象限，子弹的伤害判定区域是圆，因此此处是加上半径进行判断
			    topQuadrant = (pRect.locationCurrent.y < horizontalMidpoint && pRect.locationCurrent.y + pRect.radius < horizontalMidpoint),
			
			    //pRect can completely fit within the bottom quadrants
          //判定位于下面两个象限
			bottomQuadrant = (pRect.locationCurrent.y > horizontalMidpoint);
		 
		  //pRect can completely fit within the left quadrants
      //判断位于左边两个象限
		  if( pRect.locationCurrent.x < verticalMidpoint && pRect.locationCurrent.x + pRect.radius < verticalMidpoint ) {
			if( topQuadrant ) {
        // 左上，index为1
				index = 1;
			} else if( bottomQuadrant ) {
        // 左下，index为2
				index = 2;
			}
			
		  //pRect can completely fit within the right quadrants
      //判断位于右边两个象限
		} else if( pRect.locationCurrent.x > verticalMidpoint ) {
			  if( topQuadrant ) {
        // 右上，index 为0
				index = 0;
			  } else if( bottomQuadrant ) {
        // 右下，index 为3
				index = 3;
			}
		}
	 
		return index;
	};
	
	
	/*
	 * Insert the object into the node. If the node
	 * exceeds the capacity, it will split and add all
	 * objects to their corresponding subnodes.
	 * @param Object pRect		bounds of the object to be added, with x, y, width, height
	 */
    //插入数据点
	Quadtree.prototype.insert = function( pRect ) {
		
		var 	i = 0,
	 		index;
	 	
	 	  //if we have subnodes ...
      //假如有子节点
		  if( typeof this.nodes[0] !== 'undefined' ) {
         //拿到数据点所在象限的index
			index = this.getIndex( pRect );

         //不在边界上就插入到对应的节点当中
		  	if( index !== -1 ) {
				    this.nodes[index].insert( pRect );
			 	    return;
			}
		}

    //将这个数据点push到objets当中，用于判断当前节点中的数据点是否超限，如果超限并且没有超出树的深度就接着分割
	 	this.objects.push( pRect );
		
		  if(this.objects.length > this.max_objects && this.level < this.max_levels ) {
			
			  //split if we don't already have subnodes
        //没有子节点就开始分割
			if( typeof this.nodes[0] === 'undefined' ) {
				this.split();
			}
			
			  //add all objects to there corresponding subnodes
        //将当前节点中的所有数据点录入到对应的子节点当中
			while( i < this.objects.length ) {
				
				index = this.getIndex( this.objects[ i ] );
				
				if( index !== -1 ) {
					this.nodes[index].insert( this.objects.splice(i, 1)[0] );
				} else {
          //跳过在边界上的点
					i = i + 1;
			 	}
		 	}
		}
	 };
	 
	 
	/*
	 * Return all objects that could collide with the given object
	 * @param Object pRect		bounds of the object to be checked, with x, y, width, height
	 * @Return Array		array with all detected objects
	 */
    //搜索同一象限内的对象
	Quadtree.prototype.retrieve = function( pRect ) {
	 	
		var 	index = this.getIndex( pRect ),
			returnObjects = this.objects;
			
		  //if we have subnodes ...
		if( typeof this.nodes[0] !== 'undefined' ) {
			
			  //if pRect fits into a subnode ..
        //不在边界上的点
			  if( index !== -1 ) {
            //目标点不在边界上，直接从对应的节点开始递归遍历
            returnObjects = returnObjects.concat( this.nodes[index].retrieve( pRect ));
			//if pRect does not fit into a subnode, check it against all subnodes
			  } else {
            //假如目标点是在边界上的点，就从根节点开始
				    for( var i=0; i < this.nodes.length; i=i+1 ) {
                returnObjects = returnObjects.concat( this.nodes[i].retrieve( pRect ));
				}
			}
		}
	 
		return returnObjects;
	};
	
	
	/*
	 * Clear the quadtree
	 */
	Quadtree.prototype.clear = function() {
		
		this.objects = [];
	 
		for( var i=0; i < this.nodes.length; i=i+1 ) {
			if( typeof this.nodes[i] !== 'undefined' ) {
				this.nodes[i].clear();
		  	}
		}

		this.nodes = [];
	};

