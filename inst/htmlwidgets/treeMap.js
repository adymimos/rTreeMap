var count = 0;
 var val, currentName, setInter, calcHeight, marginTop = undefined;

 var arr = new Array;
HTMLWidgets.widget({

  name: 'treeMap',

  type: 'output',
  
  renderOnNullValue: true,

initialize: function(el, width, height) {
  
  var tm = new $jit.TM.Squarified({
    //where to inject the visualization
    injectInto: el.id,
    //parent box title heights
    titleHeight: 30,
    
    levelsToShow: 1,
    //enable animations
    animate: true,
    //box offsets
    offset: 1,

Label : {  
  overridable: false,  
  type: 'HTML', //'SVG', 'Native'  
  style: ' ',  
  size: 30,  
  family: 'sans-serif',  
  textAlign: 'center',  
  textBaseline: 'alphabetic',  
  color: '#fff'  
},  

    //enable specific canvas styles
    //when rendering nodes
    Node: {
      CanvasStyles: {
        shadowBlur: 0,
        shadowColor: '#000'
      }
    },
    //Attach left and right click events
    Events: {
      enable: true,
      onClick: function(node) {

        clearInterval(setInter);
        
        calcHeight = $("#"+node.id.toString()+" span").css('top');
        
        //var newFieldName = 'my new field name';
        //var newFieldValue = 'my new field value';
        
var obj = {id : node.id.toString(), top:calcHeight};

arr.push({id: obj.id, top: obj.top});
    
        if(node) 
	      {
          
          setInter = setInterval(function(){ 
            $("#tree-label div:visible:first").addClass("titleRoot");
          
            $("#tree-label div:visible:first span").css({"display":"block", "top":"0px"});
            $(".titleRoot span").css({"width": "500px", "height":"30px"});
            
          }, 1000);
          
          
         //setInterval($("#tree-label div:visible:first").click, 500);
       
		  tm.enter(node);

    
  	var click='{ "treemap" : [' +
		'{ "type":"onMouseEnter" , "node":"'+node.name+'" }]}';
    
          Shiny.onInputChange(el.id+'_treemap_event',click);
          console.log(click);
          console.log(el.id+'treemap_event');
          
                  
	}
      },
      onRightClick: function(node) {
        
        
         clearInterval(setInter);
  
        for(var i=0; i<arr.length; i++){
          //console.log(arr[i].id, arr[i].top);
          if(tm.clickedNode.id.toString() == arr[i].id){
            $("#tree-label div:visible:first span").animate({ 'top': arr[i].top}, 1000);
          }
        }

        
       $("#tree-label div:visible:first span").css("display","table-cell");
        tm.out();
        

		var click='{ "treemap" : [' +
		'{ "type":"onMouseLeave" , "node":"'+tm.clickedNode.name+'" }]}';
                        Shiny.onInputChange(el.id+'_treemap_event',click);
                	console.log(click);
                  
 $("#tree-label").find(":visible:first").removeClass('titleRoot');
  //$(".node span").css("display","table-cell !important");
	
      },
      onMouseEnter: function(node, eventInfo) {
        if(node) {
          //add node selected styles and replot node
          node.setCanvasStyle('shadowBlur', 7);
          tm.fx.plotNode(node, tm.canvas);
          tm.labels.plotLabel(tm.canvas, node);
        }
      },
      onMouseLeave: function(node) {
        if(node) {
          
//          node.removeCanvasStyle('shadowBlur');
          tm.plot();
        }
      }
    },
    duration: 1000,
    //Enable tips
    Tips: {
      enable: true,
      //add positioning offsets
      offsetX: 20,
      offsetY: 20,
      //implement the onShow method to
      //add content to the tooltip when a node
      //is hovered
      onShow: function(tip, node, isLeaf, domElement) {
        var html = "<div class=\"tip-title\">" + node.name 
          + "</div><div class=\"tip-text\">";
            var data = node.data;
            
       if(data.cases) {  
        html +=  data.cases;
        
      }  
        tip.innerHTML =  html;
        
      }  
      
    },
    //Add the name of the node in the correponding label
    //This method is called once, on label creation.
    
    onCreateLabel: function(domElement, node){
      
        domElement.innerHTML = "<span>"+node.name+"</span>";
        var style = domElement.style;
        style.display = '';
        //style.fontSize= '1.2vw';
        var divContent = domElement;
        var divId = domElement.id;
        var divId1 = domElement.innerHTML;
        count++;
        var nodeHeight = node.data.$height;
        var nodeWidth = node.data.$width;
        //console.log(node.endData.$width);
        val = Math.ceil(node.endData.$width);
        valH = Math.ceil(node.endData.$height);
        
        
        if(!tm.leaf(node))
         {
          
          style.border = '2px solid #0099FF';  
         }
        else
        {
          
          style.border = '1px solid transparent';  
        }
        

        
        domElement.onmouseover = function() {
          style.border = '2px solid gray';

        };
        
        domElement.onmouseout = function() {
           if(!tm.leaf(node))
            {
              
              style.border = '2px solid #0099FF';  
            }
            else
            {
              
              style.border = '1px solid transparent';  
            }

        };
         

/*
	$jit.util.addEvent(domElement, 'mouseup', function (event) {
   	// detecting right button
	   if (event.button != 2) {
	       return;
	   }
		 var click='{ "treemap" : [' +
                '{ "type":"onMouseLeave" , "node":"'+node.name+'" }]}';
                        Shiny.onInputChange('treemap_event',click);
                        console.log(click);

	}); */
  

        
     if(node.id.toString() == "root"){
          style.fontSize = "20px";
        }else{
          
          //style.fontSize = val/8+"px";  
          if(node.endData.$width <= 100) {
          //console.log(node.endData.$width);
          style.fontSize = "16px";
        }else{
        style.fontSize = val/8+"px";  
        }
        
        var counts = 0;
      var listOfNode = setInterval(function(){
        
        if(counts >=1){
          clearInterval(listOfNode);
        }else{
        $.each(node.id, function(i, j){
         
         $("#"+j+" span").css({
          'width':Math.ceil(node.endData.$width)+"px",
          'height':Math.ceil(node.endData.$height) + "px",
          'position':'relative',
          'margin': 'auto'
        });
        
        $("#"+j).css({
        'fontSize': Math.ceil(node.endData.$width) / 8+"px"
        });
        
        marginTop = Math.ceil(node.endData.$height)/2.5;
        var fontSize = $("#"+node.id.toString());
               
        //$("#"+node.id.toString().css("font-size",fontSize / 8+"px"));
        //console.log(marginTop);
        
         $("#"+j+" span").animate({ 'top': marginTop +'px' }, 1000);
        
        });
        counts++;
        
        };},1000);
          
        }
        
        
    }
  });
  


	return {
	tree: tm
  
	}
},

  renderValue: function(el, x, instance) {

  var lvl = x.level;
  
  var tm = instance.tree;
  //var json = JSON.parse(x.data);
  var json = x.data;
  var tp = x.tooltip;

  tm.loadJSON(json);
  
  tm.refresh();

  //console.log(json);
  instance.lastValue = x;
  

  },

  resize: function(el, width, height, instance) {
    // Re-render the previous value, if any
   var tm = instance.tree;

   tm.config.animate = false;
   tm.canvas.resize(width, height); // resize the treemap to fit the background container
   tm.config.animate = true;

//   this.renderValue(el, instance.lastValue, instance);
  }

});

$(function(){
$("<style>")
.prop("type", "text/css")
.html("\
.titleRoot{\
font-size:20px !important; }")
.appendTo("head");
    
});


