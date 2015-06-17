rTreeMap - An htmlwidget interface for Java Infovis toolkit treeMap 

to install
```
require(devtools)
install_github('adymimos/rTreeMap')


```
This is an experimentation for JIT treemaps. Since I work with SOLR, implementation is for solr needs

treemap(dataset, coloumns) will give you a treemap, internally uses data.table for grouping.
treemap(iris,'Species') 
```
