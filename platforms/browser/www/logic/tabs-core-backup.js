//create tabs
function TabsCore(){};
TabsCore.infoAlert=0; TabsCore.warningAlert=1; TabsCore.errorAlert=2; TabsCore.alertDelay=7000;
TabsCore.alertDlg=null;
TabsCore.selectedTab=0;
TabsCore.connectionId="";
TabsCore.checkConnectionDelay=30000; //check server each 30 seconds
TabsCore.serverNet=new NetworkTransfer("checkServer.php");
TabsCore.connectImg=null;
TabsCore.activeTab=0;
TabsCore.mainActionList=[];
TabsCore.subActionList=[];
TabsCore.subActionDialog=null;
TabsCore.direction="left";
TabsCore.mouseX=0;
TabsCore.mouseY=0;
TabsCore.exploreMode=false;
TabsCore.enableAnimation=true;
TabsCore.visibleDoc=true;

TabsCore.leaveMessage="Leave the app?";
TabsCore.showLeaveMessage=false;
TabsCore.reselect=function()
{
	tabWidgetStore[0].goTab(TabsCore.activeTab); selectTab(0);
};
TabsCore.alert=function(message,type)
{
	if(TabsCore.alertDlg)
	{
		dlg=TabsCore.alertDlg;
		img=dlg.img_;
		sp=dlg.sp_;
	}
	else
	{
	dlg=document.createElement("div");
	img=document.createElement("img");
	sp=document.createElement("span");
	dlg.img_=img;
	dlg.sp_=sp;
	dlg.appendChild(img);
	dlg.appendChild(sp);
	TabsCore.alertDlg=dlg;
	}
	sp.innerHTML=message;
	
	switch(type)
	{
		case 0: img.setAttribute("src","res/alert.png"); sp.style.color="white"; break;
		case 1: img.setAttribute("src","res/warning.png"); sp.style.color="white"; break;
		case 2: img.setAttribute("src","res/error.png"); sp.style.color="red"; break;
		default: img.setAttribute("src","res/alert.png"); sp.style.color="white"; break;
	}
	dlg.setAttribute("class","tabsAlert");
	dlg.setAttribute("id","tabsAlertBody");
	document.body.appendChild(dlg);
	setTimeout(TabsCore.closeAlert,TabsCore.alertDelay);
};
TabsCore.closeAlert=function()
{
	try{document.body.removeChild(TabsCore.alertDlg);}catch(ex){}
};
TabsCore.checkServer=function(res)
{
	if(typeof(res)=="undefined")
	{
	n=TabsCore.serverNet;
	n.clear();
	n.target="checkServer.php";
	n.callback=TabsCore.checkServer;
	n.onerror=TabsCore.errorSever;
	n.add("cid",TabsCore.connectionId);
	n.send();
	setTimeout(TabsCore.checkServer,TabsCore.checkConnectionDelay);
	}
	else
	{
		if(parseInt(res)==1)TabsCore.connectImg.setAttribute("src","res/connect.png");
		else TabsCore.connectImg.setAttribute("src","res/disconnect.png");
	}
};
TabsCore.errorSever=function()
{
	TabsCore.connectImg.setAttribute("src","res/disconnect.png");
};
var tabw=null;
TabsCore.start=function() //startTabs
{
	tabw=new TabWidget("tabsArea");
	tabw.build();
	TabsCore.connectImg=document.getElementById("connectImg");
	document.onmousemove=TabsCore.getMousePosition;
}

TabsCore.theme=function(id,theme) //setAreaTheme(id,theme)
{
	var obj=document.getElementById(id);
	obj.setAttribute("class",theme);
}

TabsCore.addTab=function(title,content,active,onclick) //addAction(title,content,active,onclick)
{
	tabw.addTab(title, content, active,onclick);
}

TabsCore.cleanActionKeys=function()
{
	var topb=document.getElementById('mainBarKeys');
	topb.innerHTML="";
	TabsCore.mainActionList.length=0;//clear array
};

TabsCore.addMainKey=function(title,action,icon)
{
	if(typeof(icon)=="undefined")icon=null;
	li=document.createElement('li');
	var topb=document.getElementById('mainBarKeys');
	li.innerHTML=title;
	li.setAttribute('onclick',action);
	topb.appendChild(li);
	TabsCore.mainActionList.push({"title":title,"action":action,"icon":icon});
};
TabsCore.showSubAction=function(evt)
{
	TabsCore.visibleSubAction=true;
	if(TabsCore.mainActionList.length>0)
	{
		if(TabsCore.subActionDialog==null)
		{
			TabsCore.subActionDialog=document.createElement("div");
			TabsCore.subActionButtons=document.createElement("ul");
			TabsCore.subActionDialog.setAttribute("class","subActionDialog");
			TabsCore.subActionDialog.appendChild(TabsCore.subActionButtons);
			document.body.appendChild(TabsCore.subActionDialog);
		}
		TabsCore.subActionButtons.innerHTML="";//clear buttons
		TabsCore.subActionDialog.style.top=(TabsCore.mouseY+10)+"px";
		TabsCore.subActionDialog.style.left=(TabsCore.mouseX+10)+"px";
		TabsCore.subActionDialog.style.visibility="visible";
		var li=null;
		for(var i in TabsCore.mainActionList)
		{
			li=document.createElement('li');
			li.setAttribute("class",TabsCore.direction);
			li.innerHTML=TabsCore.mainActionList[i].title;
			li.setAttribute('onclick',"TabsCore.stopPropagation(event);TabsCore.hideSubAction();"+TabsCore.mainActionList[i].action);
			TabsCore.subActionButtons.appendChild(li);
		}
	}
	
};
TabsCore.hideSubAction=function()
{
	TabsCore.visibleSubAction=false;
	if(TabsCore.subActionDialog)
	{
		TabsCore.subActionDialog.style.visibility="hidden";
	}
};
TabsCore.getMousePosition=function(evt)
{
	TabsCore.mouseX=evt.clientX;
	TabsCore.mouseY=evt.clientY;
}

TabsCore.drawDlg=function(cnt)
{
	var pa=document.getElementById("paintArea");
	if(cnt.toLowerCase)
	{
		pa.innerHTML=cnt;
	}
	else
	{
		pa.appendChild(cnt);
	}
}

TabsCore.showTabsBar=function(vis)
{
	if(TabsCore.visibleDoc==vis)return 0;
	TabsCore.visibleDoc=vis;
	var sb=_("#sideBar").source;
	if(TabsCore.enableAnimation)
	{
		if(document.body.scrollHeight>document.body.offsetHeight)document.body.style.overflow="hidden";
		if(vis)
		{
			sb.setAttribute('class','miniSidebar');
			_('#docBar').a("move-r","0,-142",100,TabsCore.onDocChanged);
		}
		else
		{
			sb.setAttribute('class','largeSidebar');
			_('#docBar').a("move-r","0,142",100,TabsCore.onDocChanged);
		}
	}
	else
	{
		docB=document.getElementById("docBar");
		var bhr=document.getElementById("bottomHr");
		if(vis)
		{
			docB.style.height="170px";
			bhr.style.marginBottom="200px";
			sb.setAttribute('class','miniSidebar');
		}
		else
		{
			docB.style.height="28px";
			bhr.style.marginBottom="50px";
			sb.setAttribute('class','largeSidebar');
		}
	}
}
TabsCore.onDocChanged=function()
{
	if(document.body.scrollHeight>document.body.offsetHeight)document.body.style.overflow="auto";
};

TabsCore.setRTL=function(arg)
{
	if(arg)TabsCore.direction="right";
	var docb=document.getElementById('docBar');
	var topb=document.getElementById('mainBar');
	if(arg)
	{
		docb.style.direction="rtl";
		docb.style.textAlign="right";
		
		topb.style.direction="rtl";
		topb.style.textAlign="right";
		
		lis=topb.getElementsByTagName('li');
		for(i in lis)
		{
			if(lis[i].nodeType==1)
			{
				lis[i].style.cssFloat="right";
				lis[i].style.borderRight="1px solid linen";
				lis[i].style.borderLeft="0px solid linen";
			}
		}
	}
};
TabsCore.switchViewState=function(explore)
{
	if(typeof(explore)=="undefined")TabsCore.exploreMode=!TabsCore.exploreMode;
	else TabsCore.exploreMode=explore;
	if(TabsCore.exploreMode)_("#viewState").source.setAttribute("class","exploreMode noselect");
	else _("#viewState").source.setAttribute("class","compactMode noselect");
};
TabsCore.stopPropagation=function(event,stop_documentClick)
{
	if(event.stopPropagation)event.stopPropagation();
	else event.cancelBubble=true;
};


//unload evenet
window.onbeforeunload=function(){if(TabsCore.showLeaveMessage)return TabsCore.leaveMessage; else return null;}