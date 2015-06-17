makeList1<-function(x,i=2){
  color <- c( '#4D4D4D','#393b79','#7b4173','#60BD68','#5DA5DA','#FAA43A','#F17CB0','#B2912F','#B276B2','#DECF3F','#F15854','#C14864')
  if(ncol(x)>2){
    listSplit<-split(x[-1],x[1],drop=T)
    lapply(names(listSplit),function(y){list(name=y,id=paste0(y,runif(1, 1, 100)),data=list(cases=sum(listSplit[[y]]$N), area =sum(listSplit[[y]]$N),color = color[i]),children=makeList1(listSplit[[y]],i+1))})
  }else{
    lapply(seq(nrow(x[1])),function(y){list(name=x[,1][y],data=list(cases=x[,2][y], area=x[,2][y],color=color[i]),id=paste0(x[,1][y],runif(1, 1, 100)))})
  }
}

nestedList1 <- function(data,cols) {
  require(data.table)
  data <- data.table(data[cols])
  print('shrinking dataset to defined cols')
  dt <- data.frame( data[,.N,by=cols])
  print('calling makeList')
  makeList1(dt)
}

nesto_list <- function(data)
{
  require(foreach)
  list1 <-list()
  foreach(i=1:nrow(data)) %do%
    list(name=data[i,1],id=paste0('treenode',round(runif(1, 1, 1000000))),data=list(cases=data[i,]$N,area=data[i,]$N,color=data[i,]$color))
  
}


nesto <- function(data,cols,solr=FALSE)
{
  require(data.table)
  if(solr == TRUE)
  {
    dt <- data
    names(dt)[ncol(dt)] <- 'N'
  }
  else
  {
    data <- data.table(data[cols])
    print('shrinking dataset to defined cols')
    dt <- data.frame( data[,.N,by=cols])
  }
  if(ncol(data)>4)
  {
    dt$N <- as.numeric(dt$N)
    dt2 <- data.table(dt)
    dt1 <- data.frame( dt2[,sum(N),by=c(cols[1],'pcolor')])
    names(dt1)[ncol(dt1)] <- 'N'
    listo <- foreach(j=1:nrow(dt1))  %do%
          list(name=dt1[j,1],id=paste0('treenode',round(runif(1, 1, 1000000))),data=list(cases=dt1[j,]$N,area=dt1[j,]$N,color=dt1[j,]$pcolor),
                      children=nesto(dt[dt[,1] ==dt1[j,1],][-1],cols[-1],solr))
    return(listo)
  }
  else
    return(nesto_list(dt))
}

treeMap <- function(data, cols=NULL,name='root',level=1,titleHeight=20,solr=FALSE,zone=FALSE,tooltip=NULL, width = NULL, height = NULL) {
  print('treeMap v 0.1')
  print(nrow(data))
  if(zone == TRUE)
  {
    #jsonOut <- jsonlite::toJSON(nesto(data,cols,solr))
    jsonOut <- jsonlite::toJSON(list(name=name,id="root",children=nesto(data,cols,solr)))
  }
  else
  if(solr == TRUE)
  {
	if(ncol(data) > 2)
	{
		data <- data[c('par','chi','count')]
		names(data)[3]<-'N'
		jsonOut<-jsonlite::toJSON(list(name=name,id="root",children=makeList1(data)))
	}
	else
	{
		names(data)[2]<-'N'
		jsonOut<-jsonlite::toJSON(list(name=name,id="root",children=makeList1(data)))
	}
  }
 
  else
  {
	jsonOut<-jsonlite::toJSON(list(name=name,id="root",children=nestedList1(data,cols)))
  }

  if(is.null(tooltip))
	tooltip <- 'Total'

j1 <- gsub('area','$area',jsonOut)
j1 <- gsub('color','$color',j1)
  # forward options using x
  cat(j1)
  x = list(
	data = j1,
	tooltip = tooltip,
	level=level,
	titleHeight = titleHeight
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'treeMap',
    x,
    width = width,
    height = height,
    package = 'rTreeMap',
    sizingPolicy = sizingPolicy(
      defaultWidth = 600,
      defaultHeight = 600
    )
  )
}


treeMapOutput <- function(outputId, width = '600px', height = '600px'){
  shinyWidgetOutput(outputId, 'treeMap', width, height, package = 'rTreeMap')
}

rendertreeMap <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  shinyRenderWidget(expr, treeMapOutput, env, quoted = TRUE)
}



