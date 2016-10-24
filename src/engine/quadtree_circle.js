/*
 * Javascript Quadtree 
 * @version 1.1.2
 * @licence MIT
 * @author Timo Hausmann && MephistoPheies
 * https://github.com/timohausmann/quadtree-js/
 */
 
/*
 * 专门为了检测圆设定的quadtree对象
*/

        
    window.QUAD = Quadtree;
    /*
    * Quadtree Constructor
    * @param Object bounds		bounds of the node, object with x, y, width, height
    * @param Integer max_objects		(optional) max objects a node can hold before splitting into 4 subnodes (default: 10)
    * @param Integer max_levels		(optional) total max levels inside root Quadtree (default: 4) 
    * @param Integer level		(optional) deepth level, required for subnodes  
    */
    export default function Quadtree( bounds, max_objects, max_levels, level ) {
        
        this.max_objects	= 3;
        this.max_levels		= 10;
        
        this.level 		= level || 0;
        this.bounds 		= bounds;
        
        this.objects 		= [];
        this.nodes 		= [];
    };


    /*
     * Split the node into 4 subnodes
     */
    Quadtree.prototype.split = function() {
        
        var 	nextLevel	= this.level + 1,
            subWidth	= Math.round( this.bounds.width / 2 ),
            subHeight 	= Math.round( this.bounds.height / 2 ),
            x 		= Math.round( this.bounds.x ),
            y 		= Math.round( this.bounds.y );		
     
        //top right node
        this.nodes[0] = new Quadtree({
            x	: x + subWidth, 
            y	: y, 
            width	: subWidth, 
            height	: subHeight
        }, this.max_objects, this.max_levels, nextLevel);
        
        //top left node
        this.nodes[1] = new Quadtree({
            x	: x, 
            y	: y, 
            width	: subWidth, 
            height	: subHeight
        }, this.max_objects, this.max_levels, nextLevel);
        
        //bottom left node
        this.nodes[2] = new Quadtree({
            x	: x, 
            y	: y + subHeight, 
            width	: subWidth, 
            height	: subHeight
        }, this.max_objects, this.max_levels, nextLevel);
        
        //bottom right node
        this.nodes[3] = new Quadtree({
            x	: x + subWidth, 
            y	: y + subHeight, 
            width	: subWidth, 
            height	: subHeight
        }, this.max_objects, this.max_levels, nextLevel);
    };


    /*
     * Determine which node the object belongs to
     * @param Object circle		bounds of the area to be checked, with x, y,radius 
     * @return Integer		index of the subnode (0-3), or -1 if circle cannot completely fit within a subnode and is part of the parent node
     * 判断circle 所属的节点
     * 当它在边界上时，返回值为-1
     */
    Quadtree.prototype.getIndex = function( circle ) {
        
        var 	index 			= -1,
            verticalMidpoint 	= this.bounds.x + (this.bounds.width / 2),
            horizontalMidpoint 	= this.bounds.y + (this.bounds.height / 2),
            //circle can completely fit within the top quadrants
            //分两步算，可以减少一步运算，虽然在p.Rect.y < horizontalMidpoint 时，多了一步判断
            topQuadrant = (circle.locationCurrent.y < horizontalMidpoint && circle.locationCurrent.y + 1 < horizontalMidpoint),
            
            //circle can completely fit within the bottom quadrants
            bottomQuadrant = (circle.locationCurrent.y > horizontalMidpoint );
        //console.log("verticalMidpoint:" + verticalMidpoint);
        //console.log("horizontalMidpoint:" + horizontalMidpoint);
        //console.log(circle);
         
        //circle can completely fit within the left quadrants
        if( circle.locationCurrent.x < verticalMidpoint && circle.locationCurrent.x + 1 < verticalMidpoint ) {
            if( topQuadrant ) {
                index = 1;
            } else if( bottomQuadrant ) {
                index = 2;
            }
            
        //circle can completely fit within the right quadrants	
        } else if( circle.locationCurrent.x > verticalMidpoint ) {
            if( topQuadrant ) {
                index = 0;
            } else if( bottomQuadrant ) {
                index = 3;
            }
        }
     
        return index;
    };


    /*
     * Insert the object into the node. If the node
     * exceeds the capacity, it will split and add all
     * objects to their corresponding subnodes.
     * @param Object circle		bounds of the object to be added, with x, y,radius 
     */
    Quadtree.prototype.insert = function( circle ) {
        
        var 	i = 0,
            index;
        
        //if we have subnodes ...
        if( typeof this.nodes[0] !== 'undefined' ) {
            index = this.getIndex( circle );
     
            if( index !== -1 ) {
                this.nodes[index].insert( circle );
                return;
            }
        }
     
        this.objects.push( circle );
        

        if( this.objects.length > this.max_objects && this.level < this.max_levels ) {
            
            //split if we don't already have subnodes
            if( typeof this.nodes[0] === 'undefined' ) {
                this.split();
            }
            
            //add all objects to there corresponding subnodes
            while( i < this.objects.length ) {
                
                index = this.getIndex( this.objects[ i ] );
                
                if( index !== -1 ) {					
                    this.nodes[index].insert( this.objects.splice(i, 1)[0] );
                } else {
                    i = i + 1;
                }
            }
        }
     };
     

    /*
     * Return all objects that could collide with the given object
     * @param Object circle		bounds of the object to be checked, with x, y,radius
     * @Return Array		array with all detected objects
     */
    //返回所有可以与给定对象碰撞的对象集合
    Quadtree.prototype.retrieve = function( circle ) {

        var 	index = this.getIndex( circle ),
                //由于在分割线上的没被放到合适的子节点，所以要把父节点中的所有对象放进returnObjective中，以防万一
            returnObjects = this.objects;

        //if we have subnodes ...
        if( typeof this.nodes[0] !== 'undefined' ) {
            
            //if circle fits into a subnode ..
            if( index !== -1 ) {
                returnObjects.concat( this.nodes[index].retrieve( circle ) );
                
            //if circle does not fit into a subnode, check it against all subnodes
            } else {
                for( var i=0; i < this.nodes.length; i=i+1 ) {
                    returnObjects = returnObjects.concat( this.nodes[i].retrieve( circle ) );
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

