var tabWidgetIndex=0;
var tabWidgetStore=new Array();
function TabWidget(parentId)
{
	this.tabHeads=new Array();
	this.tabStore=new Array();
	this.tabIndex=0;
	this.currentTabIndex=0;
	this.parentId=parentId;
	this.widgetIndex=tabWidgetIndex;
	
	this.build=function()
	{
		this.wg=document.createElement("div");
		this.wg.setAttribute("class","tabWidget");
		this.wg.setAttribute("id","tabW"+this.widgetIndex);
		
		this.ul=document.createElement("ul");
		this.ul.setAttribute("id", "tabH"+this.widgetIndex);
		
		this.tc=document.createElement("div");
		this.tc.setAttribute("id","tabC"+this.widgetIndex);
		this.tc.setAttribute("class","tabContent");
		
		this.wg.appendChild(this.ul);
		this.wg.appendChild(this.tc);
		
		p=document.getElementById(this.parentId);
		p.appendChild(this.wg);
		
	};
	this.addTab=function(title,content,activate,onclick)
	{
		li=document.createElement("li");
		oc=(onclick)?onclick:"";
		li.setAttribute("onclick", "tabWidgetStore["+this.widgetIndex+"].goTab("+this.currentTabIndex+");"+oc);
		li.innerHTML=title;
		this.ul.appendChild(li);
		this.tabHeads[this.currentTabIndex]=li;
		this.tabStore[this.currentTabIndex]=content;
		if(activate)
		{
			this.goTab(this.currentTabIndex);
		}
		this.currentTabIndex++;
	};
	this.goTab=function(index)
	{
		for(i in this.tabHeads){this.tabHeads[i].setAttribute("class","");}
		this.tabHeads[index].setAttribute("class","active");
		this.tc.innerHTML=this.tabStore[index];
	};
	tabWidgetStore[tabWidgetIndex]=this;
	tabWidgetIndex++;
}