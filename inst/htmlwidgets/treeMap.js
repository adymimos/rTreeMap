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
    //use canvas text
//    Label: {
  //    type: 'HTML',
    //  size: 20,
    //  color:'#ccc'
   //   family: 'Tahoma, Verdana, Arial'
//    },
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
        if(node) 
        {
        	var click='{ "treemap" : [' +
                '{ "type":"onMouseEnter" , "node":"'+node.name+'" }]}';
                Shiny.onInputChange(el.id+'_treemap_event',click);
         	tm.enter(node);
        }
        
        
      },
      onRightClick: function() {
      	var click='{ "treemap" : [' +
                '{ "type":"onMouseLeave" , "node":"'+tm.clickedNode.name+'" }]}';
                        Shiny.onInputChange(el.id+'_treemap_event',click);
        tm.out();
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
          node.removeCanvasStyle('shadowBlur');
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
        domElement.innerHTML = node.name;
        var style = domElement.style;
        style.display = '';
        style.fontSize= '1.2vw';
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
  tm.refresh();
  instance.lastValue = x;
  
  },

  resize: function(el, width, height, instance) {
    // Re-render the previous value, if any
   var tm = instance.tree;
   tm.config.animate = false;
   tm.canvas.resize(width, height); // resize the treemap to fit the background container
   tm.config.animate = true;

  }

});
